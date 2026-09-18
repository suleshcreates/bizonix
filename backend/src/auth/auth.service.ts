import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto, ip: string, userAgent: string) {
    const identifier = loginDto.email.trim();
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

    // Verify Argon2id password
    const isPasswordValid = await argon2.verify(user.passwordHash, loginDto.password);

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
        await this.prisma.refreshSession.delete({ where: { id: session.id } });
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (session.user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account disabled');
    }

    // Revoke old session (Rotation)
    await this.prisma.refreshSession.delete({ where: { id: session.id } });

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
}
