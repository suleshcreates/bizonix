import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EnquiryStatus, HeroStatus, Prisma } from '@prisma/client';
import { AuthenticatedUser } from '../common/decorators';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(user?: AuthenticatedUser) {
    const isSuperAdmin = user?.roles?.includes('SUPER_ADMIN');
    const enquiryBaseWhere: Prisma.EnquiryWhereInput = !isSuperAdmin && user?.id ? { assignedToId: user.id } : {};
    const auditWhere: Prisma.AuditLogWhereInput = !isSuperAdmin && user?.id ? { actorUserId: user.id } : {};

    const [
      newEnquiriesCount,
      awaitingResponseCount,
      demoScheduledCount,
      draftHeroesCount,
      publishedHeroState,
      attentionEnquiries,
      recentAuditLogs,
      allHeroVariants,
    ] = await Promise.all([
      this.prisma.enquiry.count({ where: { status: EnquiryStatus.NEW, ...enquiryBaseWhere } }),
      this.prisma.enquiry.count({
        where: {
          status: { in: [EnquiryStatus.CONTACTED, EnquiryStatus.FOLLOW_UP] },
          ...enquiryBaseWhere,
        },
      }),
      this.prisma.enquiry.count({ where: { status: EnquiryStatus.DEMO_SCHEDULED, ...enquiryBaseWhere } }),
      isSuperAdmin ? this.prisma.homeHeroVariant.count({ where: { status: HeroStatus.DRAFT } }) : Promise.resolve(0),
      isSuperAdmin
        ? this.prisma.homeHeroPublishState.findUnique({
            where: { id: 'singleton' },
            include: {
              publishedVariant: { select: { id: true, name: true, key: true } },
              draftVariant: { select: { id: true, name: true, key: true } },
            },
          })
        : Promise.resolve(null),
      this.prisma.enquiry.findMany({
        where: {
          status: {
            in: [EnquiryStatus.NEW, EnquiryStatus.DEMO_SCHEDULED, EnquiryStatus.FOLLOW_UP],
          },
          ...enquiryBaseWhere,
        },
        take: 5,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        include: {
          assignedTo: { select: { id: true, displayName: true, email: true } },
        },
      }),
      this.prisma.auditLog.findMany({
        where: auditWhere,
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: { select: { id: true, displayName: true, email: true } },
        },
      }),
      isSuperAdmin
        ? this.prisma.homeHeroVariant.findMany({
            select: { id: true, name: true, key: true, status: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' },
          })
        : Promise.resolve([]),
    ]);

    const contentDraftsCount = draftHeroesCount;

    return {
      metrics: {
        newEnquiries: newEnquiriesCount,
        awaitingResponse: awaitingResponseCount,
        demoScheduled: demoScheduledCount,
        contentDrafts: contentDraftsCount,
      },
      attentionEnquiries,
      contentStatus: {
        publishedHero: publishedHeroState?.publishedVariant || null,
        draftHero: publishedHeroState?.draftVariant || null,
        heroVariants: allHeroVariants,
        totalHeroes: allHeroVariants.length,
        draftHeroesCount,
      },
      recentActivity: recentAuditLogs,
    };
  }
}
