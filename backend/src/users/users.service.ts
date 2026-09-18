import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
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
                  notIn: ['CLOSED', 'SPAM', 'CONVERTED']
                }
              }
            },
            sentEnquiryEmails: true,
          }
        },
        userRoles: {
          select: {
            role: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Returns a single employee's full profile — assigned enquiries, email history, stats.
   * Used by the employee detail / history page.
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
            role: { select: { name: true } }
          }
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
              }
            }
          }
        },
        _count: {
          select: {
            assignedEnquiries: true,
            sentEnquiryEmails: true,
          }
        }
      }
    });

    if (!user) throw new NotFoundException('Employee not found.');

    // Compute derived stats
    const activeLeads = user.assignedEnquiries.filter(
      (e) => !['CLOSED', 'SPAM'].includes(e.status)
    ).length;
    const convertedLeads = user.assignedEnquiries.filter(
      (e) => e.status === 'CONVERTED'
    ).length;

    return {
      ...user,
      stats: {
        totalLeads: user._count.assignedEnquiries,
        activeLeads,
        convertedLeads,
        emailsSent: user._count.sentEnquiryEmails,
        conversionRate: user._count.assignedEnquiries > 0
          ? Math.round((convertedLeads / user._count.assignedEnquiries) * 100)
          : 0,
      }
    };
  }

  async createUser(dto: CreateUserDto) {
    const email = dto.email.trim().toLowerCase();
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) {
      throw new ConflictException('A user with this email already exists.');
    }

    // 1. Generate unique clean username
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

    // 2. Generate secure temporary password: 14 chars with upper, lower, numbers & symbols
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let randomPart = '';
    for (let i = 0; i < 9; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const temporaryPassword = `Biz#${randomPart}!`;

    // 3. Hash temporary password with Argon2
    const passwordHash = await argon2.hash(temporaryPassword);

    const roleName = dto.role || 'SITE_ADMIN';
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
        initialPassword: temporaryPassword,
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

    return {
      ...created,
      temporaryPassword,
      role: roleName,
    };
  }
}
