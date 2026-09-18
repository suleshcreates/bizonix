import { Injectable, NotFoundException, BadRequestException, ServiceUnavailableException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnquiryStatus, EnquiryPriority, EnquiryEmailDeliveryStatus, Prisma } from '@prisma/client';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryStatusDto } from './dto/update-enquiry-status.dto';
import { AssignEnquiryDto } from './dto/assign-enquiry.dto';
import { CreateEnquiryNoteDto } from './dto/create-enquiry-note.dto';
import { UpdateEnquiryDetailsDto } from './dto/update-enquiry-details.dto';
import { EnquiryQueryDto } from './dto/enquiry-query.dto';
import { RespondToEnquiryDto } from './dto/respond-to-enquiry.dto';
import { EmailService } from '../email/email.service';
import { buildConfirmationEmail, buildStaffAlertEmail, buildProspectReplyEmail, buildEmployeeAssignmentEmail } from '../email/templates';
import { AuthenticatedUser } from '../common/decorators';

@Injectable()
export class EnquiriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  private calculateLeadScore(dto: CreateEnquiryDto): { score: number; priority: EnquiryPriority } {
    let score = 30; // base score

    const roleLower = (dto.role || '').toLowerCase();
    if (roleLower.includes('director') || roleLower.includes('founder') || roleLower.includes('ceo') || roleLower.includes('head')) {
      score += 30;
    } else if (roleLower.includes('manager') || roleLower.includes('lead')) {
      score += 15;
    }

    const timelineLower = (dto.timeline || '').toLowerCase();
    if (timelineLower.includes('immediate') || timelineLower.includes('30 days') || timelineLower.includes('urgent')) {
      score += 25;
    } else if (timelineLower.includes('quarter')) {
      score += 15;
    }

    if (dto.phone && dto.phone.trim().length > 5) {
      score += 15;
    }

    if (dto.priorities && dto.priorities.length > 1) {
      score += 10;
    }

    let priority: EnquiryPriority = EnquiryPriority.MEDIUM;
    if (score >= 85) {
      priority = EnquiryPriority.URGENT;
    } else if (score >= 70) {
      priority = EnquiryPriority.HIGH;
    } else if (score < 40) {
      priority = EnquiryPriority.LOW;
    }

    return { score: Math.min(score, 100), priority };
  }

  async create(dto: CreateEnquiryDto, ip: string, userAgent: string) {
    if (!this.email.isConfigured || !process.env.DEMO_REQUEST_TO_EMAIL) {
      throw new ServiceUnavailableException('Demo request delivery is not configured. Please try again shortly.');
    }
    const { score, priority } = this.calculateLeadScore(dto);

    const enquiry = await this.prisma.$transaction(async (tx) => {
      const enquiry = await tx.enquiry.create({
        data: {
          fullName: dto.fullName.trim(),
          companyName: dto.companyName.trim(),
          email: dto.email.trim().toLowerCase(),
          phone: dto.phone ? dto.phone.trim() : null,
          city: dto.city ? dto.city.trim() : null,
          outletCount: dto.outletCount || null,
          currentSoftware: dto.currentSoftware || null,
          role: dto.role || null,
          industry: dto.industry || null,
          priorities: dto.priorities || [],
          timeline: dto.timeline || null,
          intent: dto.intent || 'Book a Demo',
          source: dto.source || 'Website',
          page: dto.page || '/contact',
          message: dto.message || null,
          status: EnquiryStatus.NEW,
          priority,
          leadScore: score,
          metadata: (dto.metadata ?? {}) as Prisma.InputJsonValue,
          activities: {
            create: {
              type: 'ENQUIRY_RECEIVED',
              description: `Enquiry submitted from ${dto.page || 'website'}.`,
              metadata: { ip, userAgent },
            },
          },
        },
      });

      return enquiry;
    });

    await this.sendInitialEmails(enquiry);
    return enquiry;
  }

  async findAll(query: EnquiryQueryDto, user?: AuthenticatedUser) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.EnquiryWhereInput = {};

    const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN');
    if (!isSuperAdmin && user?.id) {
      // Employees ONLY see enquiries assigned to them
      where.assignedToId = user.id;
    } else if (query.assignedToId) {
      if (query.assignedToId === 'unassigned') {
        where.assignedToId = null;
      } else {
        where.assignedToId = query.assignedToId;
      }
    }

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { fullName: { contains: s, mode: 'insensitive' } },
        { companyName: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
        { phone: { contains: s, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.source) {
      where.source = { contains: query.source, mode: 'insensitive' };
    }

    const orderBy: Prisma.EnquiryOrderByWithRelationInput = {};
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    if (sortBy === 'fullName' || sortBy === 'companyName' || sortBy === 'createdAt' || sortBy === 'leadScore' || sortBy === 'status') {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    const [total, items] = await Promise.all([
      this.prisma.enquiry.count({ where }),
      this.prisma.enquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          assignedTo: {
            select: { id: true, displayName: true, email: true },
          },
        },
      }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStats(user?: AuthenticatedUser) {
    const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN');
    const where: Prisma.EnquiryWhereInput = !isSuperAdmin && user?.id ? { assignedToId: user.id } : {};

    const [total, byStatus] = await Promise.all([
      this.prisma.enquiry.count({ where }),
      this.prisma.enquiry.groupBy({
        by: ['status'],
        where,
        _count: { status: true },
      }),
    ]);

    const counts: Record<string, number> = {
      NEW: 0,
      CONTACTED: 0,
      QUALIFIED: 0,
      DEMO_SCHEDULED: 0,
      DEMO_COMPLETED: 0,
      FOLLOW_UP: 0,
      CONVERTED: 0,
      CLOSED: 0,
      SPAM: 0,
    };

    byStatus.forEach((item) => {
      counts[item.status] = item._count.status;
    });

    return {
      total,
      counts,
    };
  }

  async findOne(id: string, user?: AuthenticatedUser) {
    const enquiry = await this.prisma.enquiry.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, displayName: true, email: true },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, displayName: true, email: true } },
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          include: {
            actor: { select: { id: true, displayName: true, email: true } },
          },
        },
        emails: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            direction: true,
            recipient: true,
            subject: true,
            body: true,
            deliveryStatus: true,
            errorMessage: true,
            sentAt: true,
            createdAt: true,
            senderUser: { select: { id: true, displayName: true, email: true } },
          },
        },
      },
    });

    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN');
    if (!isSuperAdmin && user?.id && enquiry.assignedToId !== user.id) {
      throw new ForbiddenException('You do not have access to view this enquiry.');
    }

    return enquiry;
  }

  async updateStatus(id: string, dto: UpdateEnquiryStatusDto, user: AuthenticatedUser, ip: string, userAgent: string) {
    const existing = await this.findOne(id, user);
    if (!user.roles?.includes('SUPER_ADMIN') && existing.assignedToId !== user.id) {
      throw new ForbiddenException('You can only update enquiries assigned to you.');
    }
    if (existing.status === dto.status) {
      return existing;
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.enquiry.update({
        where: { id },
        data: { status: dto.status },
        include: {
          assignedTo: { select: { id: true, displayName: true, email: true } },
        },
      });

      await tx.enquiryActivity.create({
        data: {
          enquiryId: id,
          actorId: user.id,
          type: 'STATUS_CHANGED',
          description: `Status changed from ${existing.status} to ${dto.status}.`,
          metadata: { previousStatus: existing.status, newStatus: dto.status },
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'ENQUIRY_STATUS_UPDATE',
          resourceType: 'enquiry',
          resourceId: id,
          beforeJson: { status: existing.status },
          afterJson: { status: dto.status },
          ipAddress: ip,
          userAgent,
        },
      });

      return updated;
    });
  }

  async assign(id: string, dto: AssignEnquiryDto, user: AuthenticatedUser, ip: string, userAgent: string) {
    if (!user.roles?.includes('SUPER_ADMIN')) {
      throw new ForbiddenException('Only administrators can assign enquiries.');
    }

    const existing = await this.findOne(id, user);

    let targetUser: any = null;
    const result = await this.prisma.$transaction(async (tx) => {
      let assigneeName = 'Unassigned';
      if (dto.assignedToId) {
        targetUser = await tx.user.findUnique({
          where: { id: dto.assignedToId },
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            initialPassword: true,
            welcomeEmailSent: true,
          },
        });
        if (!targetUser) throw new BadRequestException('Target user does not exist');
        assigneeName = targetUser.displayName || targetUser.email;
      }

      const updated = await tx.enquiry.update({
        where: { id },
        data: { assignedToId: dto.assignedToId || null },
        include: {
          assignedTo: { select: { id: true, displayName: true, email: true } },
        },
      });

      await tx.enquiryActivity.create({
        data: {
          enquiryId: id,
          actorId: user.id,
          type: 'ASSIGNED',
          description: dto.assignedToId ? `Assigned to ${assigneeName}.` : 'Unassigned.',
          metadata: { assignedToId: dto.assignedToId },
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'ENQUIRY_ASSIGN',
          resourceType: 'enquiry',
          resourceId: id,
          beforeJson: { assignedToId: existing.assignedToId },
          afterJson: { assignedToId: dto.assignedToId },
          ipAddress: ip,
          userAgent,
        },
      });

      return updated;
    });

    if (targetUser && dto.assignedToId && dto.assignedToId !== existing.assignedToId) {
      await this.sendAssignmentEmail(result, targetUser, user);
    }

    return result;
  }

  private async sendAssignmentEmail(
    enquiry: any,
    assignee: { id: string; email: string; displayName: string | null; username: string | null; initialPassword: string | null; welcomeEmailSent: boolean },
    assignedBy: { email: string; displayName?: string | null }
  ) {
    const adminOrigin = process.env.ADMIN_ORIGIN || 'http://localhost:3002';
    const adminUrl = `${adminOrigin}/enquiries/${enquiry.id}`;
    const loginUrl = `${adminOrigin}/login`;

    const isFirstAssignment = !assignee.welcomeEmailSent && Boolean(assignee.initialPassword);

    const emailHtml = buildEmployeeAssignmentEmail({
      enquiry,
      assignee,
      assignedBy,
      adminUrl,
      loginUrl,
      isFirstAssignment,
      temporaryPassword: isFirstAssignment ? assignee.initialPassword : null,
    });

    const subject = isFirstAssignment
      ? `Welcome to Bizonix: Deal Assigned & Portal Activated (${enquiry.companyName})`
      : `New Lead Assigned: ${enquiry.companyName} (${enquiry.priority || 'MEDIUM'})`;

    const textBody = isFirstAssignment
      ? `Welcome to Bizonix! A new lead (${enquiry.companyName}) has been assigned to you by ${assignedBy.email}.\n\nPortal Login: ${loginUrl}\nUsername: ${assignee.username || assignee.email}\nTemporary Password: ${assignee.initialPassword}\n\nView Deal: ${adminUrl}`
      : `A new lead (${enquiry.companyName}) has been assigned to you by ${assignedBy.email}.\n\nView Deal: ${adminUrl}`;

    try {
      await this.email.send({
        to: assignee.email,
        subject,
        text: textBody,
        html: emailHtml,
      });

      if (isFirstAssignment) {
        await this.prisma.user.update({
          where: { id: assignee.id },
          data: { welcomeEmailSent: true },
        });
      }
    } catch (err) {
      console.error('Failed to dispatch assignment email:', err);
    }
  }

  async updateDetails(id: string, dto: UpdateEnquiryDetailsDto, user: AuthenticatedUser, ip: string, userAgent: string) {
    const existing = await this.findOne(id, user);
    if (!user.roles?.includes('SUPER_ADMIN') && existing.assignedToId !== user.id) {
      throw new ForbiddenException('You can only update enquiries assigned to you.');
    }

    return this.prisma.$transaction(async (tx) => {
      const data: Prisma.EnquiryUpdateInput = {};
      if (dto.priority !== undefined) data.priority = dto.priority;
      if (dto.nextAction !== undefined) data.nextAction = dto.nextAction;
      if (dto.demoDate !== undefined) data.demoDate = dto.demoDate ? new Date(dto.demoDate) : null;

      // Auto-advance to DEMO_SCHEDULED if a new demo date is set and the enquiry
      // is not already in a later or terminal state.
      const terminalOrLaterStatuses = new Set<string>([
        EnquiryStatus.DEMO_SCHEDULED,
        EnquiryStatus.DEMO_COMPLETED,
        EnquiryStatus.FOLLOW_UP,
        EnquiryStatus.CONVERTED,
        EnquiryStatus.CLOSED,
        EnquiryStatus.SPAM,
      ]);
      const shouldAutoSchedule =
        dto.demoDate &&
        !terminalOrLaterStatuses.has(existing.status);


      if (shouldAutoSchedule) {
        data.status = EnquiryStatus.DEMO_SCHEDULED;
        data.nextAction = 'Demo scheduled — await attendance.';
      }

      const updated = await tx.enquiry.update({
        where: { id },
        data,
        include: {
          assignedTo: { select: { id: true, displayName: true, email: true } },
        },
      });

      if (dto.demoDate) {
        await tx.enquiryActivity.create({
          data: {
            enquiryId: id,
            actorId: user.id,
            type: 'DEMO_SCHEDULED',
            description: `Demo scheduled for ${new Date(dto.demoDate).toLocaleString('en-IN')}.`,
            metadata: { demoDate: dto.demoDate, autoStatusChange: shouldAutoSchedule },
          },
        });
        if (shouldAutoSchedule) {
          await tx.enquiryActivity.create({
            data: {
              enquiryId: id,
              actorId: user.id,
              type: 'STATUS_CHANGED',
              description: `Status auto-advanced from ${existing.status} to DEMO_SCHEDULED after demo date was set.`,
              metadata: { previousStatus: existing.status, newStatus: 'DEMO_SCHEDULED' },
            },
          });
        }
      } else if (dto.nextAction) {
        await tx.enquiryActivity.create({
          data: {
            enquiryId: id,
            actorId: user.id,
            type: 'DETAILS_UPDATED',
            description: `Next action set: "${dto.nextAction}"`,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'ENQUIRY_DETAILS_UPDATE',
          resourceType: 'enquiry',
          resourceId: id,
          beforeJson: { priority: existing.priority, nextAction: existing.nextAction, demoDate: existing.demoDate, status: existing.status },
          afterJson: { priority: dto.priority, nextAction: dto.nextAction, demoDate: dto.demoDate, status: shouldAutoSchedule ? 'DEMO_SCHEDULED' : existing.status },
          ipAddress: ip,
          userAgent,
        },
      });

      return updated;
    });
  }


  async addNote(id: string, dto: CreateEnquiryNoteDto, user: AuthenticatedUser) {
    const existing = await this.findOne(id, user);
    if (!user.roles?.includes('SUPER_ADMIN') && existing.assignedToId !== user.id) {
      throw new ForbiddenException('You can only add notes to enquiries assigned to you.');
    }

    return this.prisma.$transaction(async (tx) => {
      const note = await tx.enquiryNote.create({
        data: {
          enquiryId: id,
          authorId: user.id,
          content: dto.content.trim(),
        },
        include: {
          author: { select: { id: true, displayName: true, email: true } },
        },
      });

      await tx.enquiryActivity.create({
        data: {
          enquiryId: id,
          actorId: user.id,
          type: 'NOTE_ADDED',
          description: 'Added an internal note.',
        },
      });

      return note;
    });
  }

  async respond(
    id: string,
    dto: RespondToEnquiryDto,
    user: AuthenticatedUser,
    ip: string,
    userAgent: string,
  ) {
    const enquiry = await this.findOne(id, user);
    if (!user.roles?.includes('SUPER_ADMIN') && enquiry.assignedToId !== user.id) {
      throw new ForbiddenException('You can only respond to enquiries assigned to you.');
    }
    const body = dto.message.trim();
    const subject = dto.subject.trim();
    const demoDateObj = dto.demoDate ? new Date(dto.demoDate) : undefined;

    // Build branded HTML that includes the demo date block when scheduled
    const htmlBody = buildProspectReplyEmail(enquiry.fullName, body, demoDateObj);

    const result = await this.deliverAndRecord({
      enquiryId: enquiry.id,
      senderUserId: user.id,
      recipient: enquiry.email,
      subject,
      body,
      html: htmlBody,
    });

    if (result.deliveryStatus !== EnquiryEmailDeliveryStatus.SENT) {
      throw new BadRequestException('Email delivery is not configured or failed. The response was not marked as sent.');
    }

    const status = dto.demoDate ? EnquiryStatus.DEMO_SCHEDULED : EnquiryStatus.CONTACTED;
    const updated = await this.prisma.$transaction(async (tx) => {
      const value = await tx.enquiry.update({
        where: { id },
        data: {
          status,
          demoDate: dto.demoDate ? new Date(dto.demoDate) : undefined,
          nextAction: dto.demoDate ? 'Demo scheduled — await attendance.' : 'Await prospect reply.',
        },
      });
      await tx.enquiryActivity.create({
        data: {
          enquiryId: id,
          actorId: user.id,
          type: dto.demoDate ? 'DEMO_SCHEDULED_AND_EMAIL_SENT' : 'PROSPECT_EMAIL_SENT',
          description: dto.demoDate
            ? `Sent schedule confirmation for ${new Date(dto.demoDate).toLocaleString('en-IN')}.`
            : 'Sent a response to the prospect.',
          metadata: { emailId: result.id, demoDate: dto.demoDate || null },
        },
      });
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: dto.demoDate ? 'ENQUIRY_DEMO_SCHEDULED' : 'ENQUIRY_EMAIL_SENT',
          resourceType: 'enquiry',
          resourceId: id,
          afterJson: { status, demoDate: dto.demoDate || null, emailId: result.id },
          ipAddress: ip,
          userAgent,
        },
      });
      return value;
    });

    return { enquiry: updated, email: result };
  }

  private async sendInitialEmails(enquiry: { id: string; fullName: string; companyName: string; email: string; phone: string | null; city: string | null; outletCount: string | null; role: string | null; industry: string | null; timeline: string | null; priority: EnquiryPriority; leadScore: number; message: string | null; intent: string | null }) {
    const confirmationText = [
      `Hi ${enquiry.fullName},`,
      '',
      'Thanks for requesting a Bizonix demo. Your request has been forwarded to our team.',
      'We will review your operating context and get back to you shortly to arrange the right session.',
      '',
      'Regards,',
      'The Bizonix Sales Team',
    ].join('\n');

    const confirmationHtml = buildConfirmationEmail(enquiry.fullName, enquiry.companyName);

    await this.deliverAndRecord({
      enquiryId: enquiry.id,
      recipient: enquiry.email,
      subject: 'We received your Bizonix demo request',
      body: confirmationText,
      html: confirmationHtml,
    });

    const internalRecipient = process.env.DEMO_REQUEST_TO_EMAIL;
    if (!internalRecipient) {
      await this.recordEmail({
        enquiryId: enquiry.id,
        recipient: 'unconfigured-team-inbox',
        subject: `New demo request — ${enquiry.companyName}`,
        body: 'Team notification skipped because DEMO_REQUEST_TO_EMAIL is not configured.',
        deliveryStatus: EnquiryEmailDeliveryStatus.SKIPPED,
      });
      return;
    }

    const staffText = [
      `New ${enquiry.priority.toLowerCase()} priority demo request`,
      '',
      `Name: ${enquiry.fullName}`,
      `Company: ${enquiry.companyName}`,
      `Email: ${enquiry.email}`,
      `Phone: ${enquiry.phone || 'Not supplied'}`,
      `City: ${enquiry.city || 'Not supplied'}`,
      `Outlet count: ${enquiry.outletCount || 'Not supplied'}`,
      `Role: ${enquiry.role || 'Not supplied'}`,
      `Timeline: ${enquiry.timeline || 'Not supplied'}`,
      `Lead score: ${enquiry.leadScore}/100`,
      `Notes: ${enquiry.message || 'Not supplied'}`,
    ].join('\n');

    const adminUrl = `${process.env.ADMIN_APP_URL || 'http://localhost:3002'}/enquiries/${enquiry.id}`;
    const staffHtml = buildStaffAlertEmail(enquiry, adminUrl);

    await this.deliverAndRecord({
      enquiryId: enquiry.id,
      recipient: internalRecipient,
      subject: `[${enquiry.priority}] New Bizonix demo request — ${enquiry.companyName}`,
      body: staffText,
      html: staffHtml,
      replyTo: enquiry.email,
    });
  }


  private async deliverAndRecord(input: {
    enquiryId: string;
    senderUserId?: string;
    recipient: string;
    subject: string;
    body: string;
    html?: string;
    replyTo?: string;
    template?: { id: string; variables: Record<string, string | number> };
  }) {
    try {
      const sent = await this.email.send({
        to: input.recipient,
        subject: input.subject,
        text: input.body,
        html: input.html ?? this.toHtml(input.body),
        replyTo: input.replyTo,
        template: input.template,
      });
      return this.recordEmail({
        ...input,
        providerId: sent.configured ? sent.id : undefined,
        deliveryStatus: sent.configured ? EnquiryEmailDeliveryStatus.SENT : EnquiryEmailDeliveryStatus.SKIPPED,
      });
    } catch (error) {
      return this.recordEmail({
        ...input,
        deliveryStatus: EnquiryEmailDeliveryStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : 'Unknown email delivery error',
      });
    }
  }


  private async recordEmail(input: {
    enquiryId: string;
    senderUserId?: string;
    recipient: string;
    subject: string;
    body: string;
    providerId?: string;
    deliveryStatus: EnquiryEmailDeliveryStatus;
    errorMessage?: string;
  }) {
    return this.prisma.enquiryEmail.create({
      data: {
        enquiryId: input.enquiryId,
        senderUserId: input.senderUserId,
        direction: 'OUTBOUND',
        recipient: input.recipient,
        subject: input.subject,
        body: input.body,
        providerId: input.providerId,
        deliveryStatus: input.deliveryStatus,
        errorMessage: input.errorMessage,
        sentAt: input.deliveryStatus === EnquiryEmailDeliveryStatus.SENT ? new Date() : null,
      },
    });
  }

  private toHtml(text: string) {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    return `<div style="font-family:Arial,sans-serif;color:#102a4c;line-height:1.6;white-space:pre-line">${escaped}</div>`;
  }
}
