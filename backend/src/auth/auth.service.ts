import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto, ip: string, userAgent: string) {
    const identifier = loginDto.email.trim();
    const password = loginDto.password || '';
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: identifier, mode: 'insensitive' } },
          { username: { equals: identifier, mode: 'insensitive' } },
        ],
      },
      include: {
        userRoles: { include: { role: { include: { rolePermissions: { include: { permission: true } } } } } }
      }
    });

    if (!user) {
      // Prevent timing attacks by hashing a dummy password
      await argon2.verify('$argon2id$v=19$m=65536,t=3,p=4$DUMMY_SALT$DUMMY_HASH', 'dummy');
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account disabled');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is temporarily locked. Try again later.');
    }

    // Verify Argon2id password without silent trimming (BIZ-SEC-012)
    let isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid && password.trim() !== password) {
      // Safe backwards-compatibility check for legacy credentials stored trimmed
      isPasswordValid = await argon2.verify(user.passwordHash, password.trim());
    }

    if (!isPasswordValid) {
      // Increment failed logins
      const failedCount = user.failedLoginCount + 1;
      let lockedUntil = null;
      if (failedCount >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
        this.logger.warn(`Account locked due to multiple failed login attempts: ${user.email}`);
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginCount: failedCount, lockedUntil },
      });

      // Audit Log
      await this.prisma.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'LOGIN_FAILED',
          resourceType: 'auth',
          ipAddress: ip,
          userAgent: userAgent,
        }
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed logins on success
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // Audit Log
    await this.prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: 'LOGIN_SUCCESS',
        resourceType: 'auth',
        ipAddress: ip,
        userAgent: userAgent,
      }
    });

    return this.createSessionSha256(user.id, ip, userAgent);
  }

  async createSessionSha256(userId: string, ip: string, userAgent: string) {
    const accessTokenTtl = this.configService.get<string>('ACCESS_TOKEN_TTL', '15m');
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    
    const accessToken = await this.jwtService.signAsync(
      { sub: userId },
      { expiresIn: accessTokenTtl as any, secret: accessSecret },
    );

    const refreshToken = uuidv4() + uuidv4();
    const crypto = await import('crypto');
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshSession.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
        ipAddress: ip,
        userAgent,
      },
    });

    return { accessToken, refreshToken, expiresAt };
  }

  async refresh(refreshToken: string, ip: string, userAgent: string) {
    if (!refreshToken) throw new UnauthorizedException('Refresh token missing');

    const crypto = await import('crypto');
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await this.prisma.refreshSession.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await this.prisma.refreshSession.deleteMany({ where: { id: session.id } });
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (session.user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account disabled');
    }

    // Revoke old session (Rotation) safely
    await this.prisma.refreshSession.deleteMany({ where: { id: session.id } });

    // Create new session
    return this.createSessionSha256(session.user.id, ip, userAgent);
  }

  async logout(refreshToken: string, userId: string, ip: string, userAgent: string) {
    if (refreshToken) {
      const crypto = await import('crypto');
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await this.prisma.refreshSession.deleteMany({
        where: { tokenHash, userId },
      });
    }

    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        action: 'LOGOUT',
        resourceType: 'auth',
        ipAddress: ip,
        userAgent,
      }
    });
  }

  /**
   * Step 1: Request Password Reset OTP
   */
  async requestPasswordReset(identifier: string, ip: string, userAgent: string) {
    const cleanId = identifier.trim();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: cleanId, mode: 'insensitive' } },
          { username: { equals: cleanId, mode: 'insensitive' } },
        ],
      },
    });

    if (!user) {
      // Return ambiguous message to avoid username/email enumeration
      this.logger.warn(`Password reset requested for non-existent user: ${cleanId}`);
      return {
        success: true,
        message: 'If an active account matches that information, a verification code has been dispatched.',
      };
    }

    if (user.status !== 'ACTIVE') {
      throw new BadRequestException('Account is currently disabled. Please contact your system administrator.');
    }

    // Generate cryptographically secure 6-digit OTP (BIZ-SEC-005)
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate existing unused OTPs for this email
    await this.prisma.passwordResetOtp.updateMany({
      where: {
        email: { equals: user.email, mode: 'insensitive' },
        used: false,
      },
      data: { used: true },
    });

    // Save new OTP
    await this.prisma.passwordResetOtp.create({
      data: {
        email: user.email,
        otpHash,
        expiresAt,
      },
    });

    // Log to audit log (Never log the actual OTP - BIZ-SEC-005)
    await this.prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: 'PASSWORD_RESET_OTP_REQUESTED',
        resourceType: 'auth',
        ipAddress: ip,
        userAgent,
      },
    });

    // Attempt real email delivery if configured
    if (this.emailService.isConfigured) {
      try {
        await this.emailService.send({
          to: user.email,
          subject: 'Bizonix OS — Verification Code for Password Reset',
          text: `Your Bizonix password reset verification code is: ${otp}. It will expire in 10 minutes.`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #E5EAF2; rounded: 12px;">
              <h2 style="color: #0B1F3A; margin-bottom: 8px;">Reset Your Bizonix Password</h2>
              <p style="color: #64748B; font-size: 14px;">Use the verification code below to confirm your identity and choose a new password:</p>
              <div style="background: #F8FAFC; border: 1px dashed #2563EB; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #2563EB;">${otp}</span>
              </div>
              <p style="color: #94A3B8; font-size: 12px;">This code expires in 10 minutes. If you did not request this, you can safely ignore this email.</p>
            </div>
          `,
        });
      } catch (err: any) {
        this.logger.warn(`Email delivery failed or skipped: ${err?.message}`);
      }
    }

    this.logger.log(`Password reset verification code dispatched for account ID: ${user.id}`);

    // Return generic message to prevent account enumeration and eliminate devOtp disclosure (BIZ-SEC-005)
    return {
      success: true,
      message: 'If an active account matches that information, a verification code has been dispatched.',
    };
  }

  /**
   * Step 2: Verify OTP and grant single-use resetToken
   */
  async verifyPasswordResetOtp(emailOrUsername: string, otp: string) {
    const cleanId = (emailOrUsername || '').trim();
    const cleanOtp = (otp || '').trim();
    const otpHash = crypto.createHash('sha256').update(cleanOtp).digest('hex');

    // Resolve email if user provided username
    let targetEmail = cleanId;
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: cleanId, mode: 'insensitive' } },
          { username: { equals: cleanId, mode: 'insensitive' } },
        ],
      },
      select: { email: true },
    });
    if (user) {
      targetEmail = user.email;
    }

    const record = await this.prisma.passwordResetOtp.findFirst({
      where: {
        email: { equals: targetEmail, mode: 'insensitive' },
        used: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Verification code has expired or is invalid. Please request a new code.');
    }

    if (record.attempts >= 5) {
      await this.prisma.passwordResetOtp.update({
        where: { id: record.id },
        data: { used: true },
      });
      throw new BadRequestException('Too many failed attempts with this code. Please request a new code.');
    }

    if (record.otpHash !== otpHash) {
      await this.prisma.passwordResetOtp.update({
        where: { id: record.id },
        data: { attempts: record.attempts + 1 },
      });
      throw new BadRequestException('Invalid verification code. Please check and try again.');
    }

    // Code matches! Generate single-use resetToken valid for 15 minutes
    const resetToken = crypto.randomBytes(32).toString('hex');
    await this.prisma.passwordResetOtp.update({
      where: { id: record.id },
      data: {
        resetToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins window to enter new password
      },
    });

    return {
      success: true,
      message: 'Code verified successfully.',
      resetToken,
    };
  }

  /**
   * Step 3: Complete Password Reset with New Password
   */
  async completePasswordReset(
    emailOrUsername: string,
    resetToken: string,
    newPassword: string,
    ip: string,
    userAgent: string,
  ) {
    const cleanId = (emailOrUsername || '').trim();

    // Resolve user by username or email
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: cleanId, mode: 'insensitive' } },
          { username: { equals: cleanId, mode: 'insensitive' } },
        ],
      },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new BadRequestException('Account is not found or is currently disabled.');
    }

    const record = await this.prisma.passwordResetOtp.findFirst({
      where: {
        email: { equals: user.email, mode: 'insensitive' },
        resetToken,
        used: false,
      },
    });

    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Reset session has expired or is invalid. Please restart the password reset process.');
    }

    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException('New password must be at least 8 characters long.');
    }

    // Hash exact new password using Argon2id without trimming (BIZ-SEC-012)
    const passwordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    // Update user password and clear lockouts
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        failedLoginCount: 0,
        lockedUntil: null,
      },
    });

    // Invalidate prior refresh sessions
    await this.prisma.refreshSession.deleteMany({
      where: { userId: user.id },
    });

    // Mark reset record as consumed
    await this.prisma.passwordResetOtp.update({
      where: { id: record.id },
      data: { used: true },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: 'PASSWORD_RESET_COMPLETED',
        resourceType: 'auth',
        ipAddress: ip,
        userAgent,
      },
    });

    // Automatically authenticate the user: create new active session
    const session = await this.createSessionSha256(user.id, ip, userAgent);

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = Array.from(
      new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.key),
        ),
      ),
    );

    return {
      success: true,
      message: 'Your password has been reset successfully. You are now securely authenticated.',
      session,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        roles,
        permissions,
      },
    };
  }

  /**
   * Change password for currently logged-in user
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    ip: string,
    userAgent: string,
  ) {
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException('New password must be at least 8 characters long.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account not found or disabled');
    }

    // Verify current password: try exact password, fallback to trimmed for legacy accounts (BIZ-SEC-012)
    let isMatch = await argon2.verify(user.passwordHash, currentPassword || '');
    if (!isMatch && currentPassword && currentPassword.trim() !== currentPassword) {
      isMatch = await argon2.verify(user.passwordHash, currentPassword.trim());
    }

    if (!isMatch) {
      throw new BadRequestException('Current password does not match.');
    }

    // Hash exact new password using Argon2id without trimming (BIZ-SEC-012)
    const passwordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        failedLoginCount: 0,
        lockedUntil: null,
      },
    });

    // Invalidate old sessions
    await this.prisma.refreshSession.deleteMany({
      where: { userId: user.id },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: 'PASSWORD_CHANGED',
        resourceType: 'auth',
        ipAddress: ip,
        userAgent,
      },
    });

    const session = await this.createSessionSha256(user.id, ip, userAgent);

    return {
      success: true,
      message: 'Your password has been changed successfully.',
      session,
    };
  }
}

