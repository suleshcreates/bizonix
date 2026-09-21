import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, ResetPasswordDto } from './dto/update-user.dto';
import { AuthenticatedUser } from '../common/decorators';
import * as argon2 from 'argon2';

function generateSecurePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let randomPart = '';
  for (let i = 0; i < 12; i++) {
    randomPart += chars[crypto.randomInt(0, chars.length)];
  }
  return `Biz#${randomPart}!`;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all ACTIVE users — used by the admin assignment dropdown.
   * Only exposes safe public fields (no password hashes).
   */
  async findAllActive() {
    return this.prisma.user.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { displayName: 'asc' },
      select: {
        id: true,
        email: true,
        displayName: true,
        status: true,
      },
    });
  }

  /**
   * Returns all admin users (active and disabled) with roles and security status.
   */
  async findAllAdminUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        status: true,
        welcomeEmailSent: true,
        failedLoginCount: true,
        lockedUntil: true,
        lastLoginAt: true,
        createdAt: true,
        userRoles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return users.map((u) => {
      const isLocked = u.lockedUntil ? new Date(u.lockedUntil) > new Date() : false;
      const roleName = u.userRoles[0]?.role?.name || 'VIEWER';
      return {
        id: u.id,
        email: u.email,
        username: u.username,
        displayName: u.displayName,
        status: u.status,
        role: roleName,
        failedLoginCount: u.failedLoginCount,
        isLocked,
        lockedUntil: u.lockedUntil,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt,
      };
    });
  }

  /**
   * Returns the entire team with stats on how many active leads they have.
   */
  async findTeam() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        status: true,
        welcomeEmailSent: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            assignedEnquiries: {
              where: {
                status: {
                  notIn: ['CLOSED', 'SPAM', 'CONVERTED'],
                },
              },
            },
            sentEnquiryEmails: true,
          },
        },
        userRoles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Returns a single employee's full profile.
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        status: true,
        welcomeEmailSent: true,
        createdAt: true,
        lastLoginAt: true,
        userRoles: {
          select: {
            role: { select: { name: true } },
          },
        },
        assignedEnquiries: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            fullName: true,
            companyName: true,
            email: true,
            phone: true,
            status: true,
            priority: true,
            leadScore: true,
            intent: true,
            createdAt: true,
            demoDate: true,
            nextAction: true,
          },
        },
        sentEnquiryEmails: {
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: {
            id: true,
            direction: true,
            recipient: true,
            subject: true,
            deliveryStatus: true,
            sentAt: true,
            createdAt: true,
            enquiry: {
              select: {
                id: true,
                companyName: true,
                fullName: true,
              },
            },
          },
        },
        _count: {
          select: {
            assignedEnquiries: true,
            sentEnquiryEmails: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Employee not found.');

    const activeLeads = user.assignedEnquiries.filter(
      (e) => !['CLOSED', 'SPAM'].includes(e.status),
    ).length;
    const convertedLeads = user.assignedEnquiries.filter((e) => e.status === 'CONVERTED').length;

    return {
      ...user,
      stats: {
        totalLeads: user._count.assignedEnquiries,
        activeLeads,
        convertedLeads,
        emailsSent: user._count.sentEnquiryEmails,
        conversionRate:
          user._count.assignedEnquiries > 0
            ? Math.round((convertedLeads / user._count.assignedEnquiries) * 100)
            : 0,
      },
    };
  }

  async getAvailableRoles() {
    return this.prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async createUser(dto: CreateUserDto, currentUser?: AuthenticatedUser) {
    const isCallerSuperAdmin = currentUser?.roles?.includes('SUPER_ADMIN');
    const roleName = dto.role || 'SITE_ADMIN';

    if (roleName === 'SUPER_ADMIN' && !isCallerSuperAdmin) {
      throw new ForbiddenException('Only a SUPER_ADMIN can assign the SUPER_ADMIN role.');
    }

    const email = dto.email.trim().toLowerCase();
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) {
      throw new ConflictException('A user with this email already exists.');
    }

    let baseUsername = (dto.username || dto.displayName || email.split('@')[0])
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9._-]/g, '');
    if (!baseUsername) baseUsername = 'employee';

    let username = baseUsername;
    let counter = 1;
    while (await this.prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter++}`;
    }

    const rawPassword = dto.password?.trim() || generateSecurePassword();
    const passwordHash = await argon2.hash(rawPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const role = await this.prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      throw new ConflictException(`${roleName} role missing in DB.`);
    }

    const created = await this.prisma.user.create({
      data: {
        email,
        username,
        displayName: dto.displayName.trim(),
        passwordHash,
        welcomeEmailSent: false,
        userRoles: {
          create: {
            roleId: role.id,
          },
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        status: true,
        welcomeEmailSent: true,
        createdAt: true,
      },
    });

    if (currentUser?.id) {
      await this.prisma.auditLog
        .create({
          data: {
            action: 'USER_CREATED',
            resourceType: 'USER',
            resourceId: created.id,
            actorUserId: currentUser.id,
            afterJson: { email, username, role: roleName },
          },
        })
        .catch((err) => this.logger.warn('Failed to audit user creation', err));
    }

    return {
      ...created,
      temporaryPassword: rawPassword,
      role: roleName,
    };
  }

  async updateUser(id: string, dto: UpdateUserDto, currentUser?: AuthenticatedUser) {
    const isCallerSuperAdmin = currentUser?.roles?.includes('SUPER_ADMIN');

    if (id === currentUser?.id) {
      if (dto.role) {
        throw new ForbiddenException('You cannot modify your own role.');
      }
      if (dto.status === 'DISABLED') {
        throw new BadRequestException('You cannot disable your own account.');
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { userRoles: { include: { role: true } } },
    });
    if (!user) throw new NotFoundException('User not found.');

    const targetIsSuperAdmin = user.userRoles.some((ur) => ur.role.name === 'SUPER_ADMIN');
    if (targetIsSuperAdmin && !isCallerSuperAdmin) {
      throw new ForbiddenException('Only a SUPER_ADMIN can modify a SUPER_ADMIN account.');
    }

    if (dto.role) {
      if (dto.role === 'SUPER_ADMIN' && !isCallerSuperAdmin) {
        throw new ForbiddenException('Only a SUPER_ADMIN can assign the SUPER_ADMIN role.');
      }
    }

    const dataToUpdate: any = {};
    if (dto.displayName) dataToUpdate.displayName = dto.displayName.trim();
    if (dto.email) {
      const email = dto.email.trim().toLowerCase();
      if (email !== user.email) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) throw new ConflictException('Email already in use.');
        dataToUpdate.email = email;
      }
    }
    if (dto.username) {
      const username = dto.username.trim().toLowerCase();
      if (username !== user.username) {
        const existing = await this.prisma.user.findUnique({ where: { username } });
        if (existing) throw new ConflictException('Username already in use.');
        dataToUpdate.username = username;
      }
    }
    if (dto.status) {
      if (id === currentUser?.id && dto.status === 'DISABLED') {
        throw new BadRequestException('You cannot disable your own account.');
      }
      if (targetIsSuperAdmin && dto.status === 'DISABLED') {
        const activeSuperAdminCount = await this.prisma.userRole.count({
          where: {
            role: { name: 'SUPER_ADMIN' },
            user: { status: 'ACTIVE' },
          },
        });
        if (activeSuperAdminCount <= 1) {
          throw new BadRequestException('Cannot disable the last active SUPER_ADMIN user.');
        }
      }
      dataToUpdate.status = dto.status;
    }

    await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    if (dto.role) {
      const role = await this.prisma.role.findUnique({ where: { name: dto.role } });
      if (!role) throw new NotFoundException(`Role ${dto.role} not found.`);

      // Replace role
      await this.prisma.userRole.deleteMany({ where: { userId: id } });
      await this.prisma.userRole.create({
        data: { userId: id, roleId: role.id },
      });
    }

    if (currentUser?.id) {
      await this.prisma.auditLog
        .create({
          data: {
            action: 'USER_UPDATED',
            resourceType: 'USER',
            resourceId: id,
            actorUserId: currentUser.id,
            afterJson: dto as any,
          },
        })
        .catch((err) => this.logger.warn('Failed to audit user update', err));
    }

    return { success: true };
  }

  async resetPassword(id: string, dto: ResetPasswordDto, currentUser?: AuthenticatedUser) {
    const isCallerSuperAdmin = currentUser?.roles?.includes('SUPER_ADMIN');

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { userRoles: { include: { role: true } } },
    });
    if (!user) throw new NotFoundException('User not found.');

    const targetIsSuperAdmin = user.userRoles.some((ur) => ur.role.name === 'SUPER_ADMIN');
    if (targetIsSuperAdmin && !isCallerSuperAdmin) {
      throw new ForbiddenException('Only a SUPER_ADMIN can reset the password of a SUPER_ADMIN account.');
    }

    const rawPassword = dto.password?.trim() || generateSecurePassword();
    const passwordHash = await argon2.hash(rawPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    await this.prisma.user.update({
      where: { id },
      data: {
        passwordHash,
        failedLoginCount: 0,
        lockedUntil: null,
      },
    });

    // Invalidate existing sessions for this user so they must log in with new password
    await this.prisma.refreshSession.deleteMany({ where: { userId: id } });

    if (currentUser?.id) {
      await this.prisma.auditLog
        .create({
          data: {
            action: 'USER_PASSWORD_RESET',
            resourceType: 'USER',
            resourceId: id,
            actorUserId: currentUser.id,
          },
        })
        .catch((err) => this.logger.warn('Failed to audit password reset', err));
    }

    return {
      success: true,
      temporaryPassword: rawPassword,
    };
  }

  async toggleStatus(id: string, currentUser?: AuthenticatedUser) {
    const isCallerSuperAdmin = currentUser?.roles?.includes('SUPER_ADMIN');

    if (id === currentUser?.id) {
      throw new BadRequestException('You cannot disable your own account.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { userRoles: { include: { role: true } } },
    });
    if (!user) throw new NotFoundException('User not found.');

    const targetIsSuperAdmin = user.userRoles.some((ur) => ur.role.name === 'SUPER_ADMIN');
    if (targetIsSuperAdmin && !isCallerSuperAdmin) {
      throw new ForbiddenException('Only a SUPER_ADMIN can alter the status of a SUPER_ADMIN account.');
    }

    const newStatus = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';

    if (targetIsSuperAdmin && newStatus === 'DISABLED') {
      const activeSuperAdminCount = await this.prisma.userRole.count({
        where: {
          role: { name: 'SUPER_ADMIN' },
          user: { status: 'ACTIVE' },
        },
      });
      if (activeSuperAdminCount <= 1) {
        throw new BadRequestException('Cannot disable the last active SUPER_ADMIN user in the system.');
      }
    }

    await this.prisma.user.update({
      where: { id },
      data: { status: newStatus },
    });

    if (newStatus === 'DISABLED') {
      await this.prisma.refreshSession.deleteMany({ where: { userId: id } });
    }

    if (currentUser?.id) {
      await this.prisma.auditLog
        .create({
          data: {
            action: newStatus === 'ACTIVE' ? 'USER_ACTIVATED' : 'USER_DISABLED',
            resourceType: 'USER',
            resourceId: id,
            actorUserId: currentUser.id,
            afterJson: { newStatus },
          },
        })
        .catch((err) => this.logger.warn('Failed to audit user status toggle', err));
    }

    return { success: true, status: newStatus };
  }

  async unlockUser(id: string, currentUser?: AuthenticatedUser) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found.');

    await this.prisma.user.update({
      where: { id },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
      },
    });

    if (currentUser?.id) {
      await this.prisma.auditLog
        .create({
          data: {
            action: 'USER_UNLOCKED',
            resourceType: 'USER',
            resourceId: id,
            actorUserId: currentUser.id,
          },
        })
        .catch((err) => this.logger.warn('Failed to audit user unlock', err));
    }

    return { success: true };
  }

  async deleteUser(id: string, currentUser?: AuthenticatedUser) {
    const isCallerSuperAdmin = currentUser?.roles?.includes('SUPER_ADMIN');

    if (id === currentUser?.id) {
      throw new BadRequestException('You cannot delete your own account.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { userRoles: { include: { role: true } } },
    });
    if (!user) throw new NotFoundException('User not found.');

    const targetIsSuperAdmin = user.userRoles.some((ur) => ur.role.name === 'SUPER_ADMIN');
    if (targetIsSuperAdmin) {
      if (!isCallerSuperAdmin) {
        throw new ForbiddenException('Only a SUPER_ADMIN can delete a SUPER_ADMIN account.');
      }
      const superAdminCount = await this.prisma.userRole.count({
        where: {
          role: { name: 'SUPER_ADMIN' },
          user: { status: 'ACTIVE' },
        },
      });
      if (superAdminCount <= 1) {
        throw new BadRequestException('Cannot delete the last active SUPER_ADMIN user in the system.');
      }
    }

    // Unassign any enquiries assigned to this user
    await this.prisma.enquiry.updateMany({
      where: { assignedToId: id },
      data: { assignedToId: null },
    });

    // Delete user (cascades UserRole, RefreshSession, EnquiryNote)
    await this.prisma.user.delete({ where: { id } });

    if (currentUser?.id) {
      await this.prisma.auditLog
        .create({
          data: {
            action: 'USER_DELETED',
            resourceType: 'USER',
            resourceId: id,
            actorUserId: currentUser.id,
            afterJson: { email: user.email, username: user.username },
          },
        })
        .catch((err) => this.logger.warn('Failed to audit user deletion', err));
    }

    return { success: true };
  }
}
