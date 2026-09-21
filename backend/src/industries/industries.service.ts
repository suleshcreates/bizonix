import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateIndustryDto,
  UpdateIndustryDto,
  ReorderIndustriesDto,
  IndustryListItemDto,
  IndustryPublicDetailDto,
  AdminIndustryDto,
  AdminIndustryPreviewDto,
} from './dto/industry.dto';
import { IndustryStatus, IndustryAccent, Prisma } from '@prisma/client';

@Injectable()
export class IndustriesService {
  constructor(private readonly prisma: PrismaService) {}

  // -------------------------------------------------------------------------
  // PUBLIC QUERIES (status = PUBLISHED only)
  // -------------------------------------------------------------------------

  async getPublicIndustries(): Promise<IndustryListItemDto[]> {
    const industries = await this.prisma.industryItem.findMany({
      where: { status: IndustryStatus.PUBLISHED },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        summary: true,
        accent: true,
        badge: true,
        sortOrder: true,
        status: true,
        showInOverview: true,
        showInMegaMenu: true,
        showInHomepage: true,
        showInFooter: true,
      },
    });

    return industries.map((ind) => ({
      ...ind,
      route: `/industries/${ind.slug}`,
    }));
  }

  async getPublicIndustryBySlug(slug: string): Promise<IndustryPublicDetailDto> {
    const industryItem = await this.prisma.industryItem.findFirst({
      where: {
        slug,
        status: IndustryStatus.PUBLISHED,
      },
    });

    if (!industryItem) {
      throw new NotFoundException(`Industry with slug "${slug}" not found or not published.`);
    }

    return {
      slug: industryItem.slug,
      name: industryItem.name,
      category: industryItem.category,
      summary: industryItem.summary,
      accent: industryItem.accent,
      badge: industryItem.badge,
      content: industryItem.content as Record<string, any>,
      publishedAt: industryItem.publishedAt,
    };
  }

  // -------------------------------------------------------------------------
  // ADMIN QUERIES
  // -------------------------------------------------------------------------

  async getAdminIndustries(query: {
    search?: string;
    category?: string;
    status?: IndustryStatus;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 50));
    const skip = (page - 1) * limit;

    const where: Prisma.IndustryItemWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { slug: { contains: s, mode: 'insensitive' } },
        { summary: { contains: s, mode: 'insensitive' } },
        { category: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [total, items, stats] = await Promise.all([
      this.prisma.industryItem.count({ where }),
      this.prisma.industryItem.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
        skip,
        take: limit,
      }),
      this.getStats(),
    ]);

    return {
      items: items.map((ind) => ({
        id: ind.id,
        slug: ind.slug,
        name: ind.name,
        category: ind.category,
        summary: ind.summary,
        accent: ind.accent,
        badge: ind.badge,
        sortOrder: ind.sortOrder,
        status: ind.status,
        everPublished: ind.everPublished,
        version: ind.version,
        showInOverview: ind.showInOverview,
        showInMegaMenu: ind.showInMegaMenu,
        showInHomepage: ind.showInHomepage,
        showInFooter: ind.showInFooter,
        publishedAt: ind.publishedAt,
        updatedAt: ind.updatedAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    };
  }

  async getAdminIndustryById(id: string): Promise<AdminIndustryDto> {
    const industryItem = await this.prisma.industryItem.findUnique({
      where: { id },
    });

    if (!industryItem) {
      throw new NotFoundException(`Industry with id "${id}" not found.`);
    }

    return {
      id: industryItem.id,
      slug: industryItem.slug,
      name: industryItem.name,
      category: industryItem.category,
      summary: industryItem.summary,
      accent: industryItem.accent,
      badge: industryItem.badge,
      sortOrder: industryItem.sortOrder,
      status: industryItem.status,
      everPublished: industryItem.everPublished,
      version: industryItem.version,
      contentVersion: industryItem.contentVersion,
      showInOverview: industryItem.showInOverview,
      showInMegaMenu: industryItem.showInMegaMenu,
      showInHomepage: industryItem.showInHomepage,
      showInFooter: industryItem.showInFooter,
      content: industryItem.content as Record<string, any>,
      publishedAt: industryItem.publishedAt,
      createdAt: industryItem.createdAt,
      updatedAt: industryItem.updatedAt,
    };
  }

  async getAdminIndustryPreview(id: string): Promise<AdminIndustryPreviewDto> {
    const industryItem = await this.prisma.industryItem.findUnique({
      where: { id },
    });

    if (!industryItem) {
      throw new NotFoundException(`Industry with id "${id}" not found.`);
    }

    return {
      slug: industryItem.slug,
      name: industryItem.name,
      category: industryItem.category,
      summary: industryItem.summary,
      accent: industryItem.accent,
      badge: industryItem.badge,
      content: industryItem.content as Record<string, any>,
      previewToken: `preview-${industryItem.id}-${Date.now()}`,
      isDraft: industryItem.status !== IndustryStatus.PUBLISHED,
    };
  }

  private async getStats() {
    const [total, published, drafts, archived, categories] = await Promise.all([
      this.prisma.industryItem.count(),
      this.prisma.industryItem.count({ where: { status: IndustryStatus.PUBLISHED } }),
      this.prisma.industryItem.count({ where: { status: IndustryStatus.DRAFT } }),
      this.prisma.industryItem.count({ where: { status: IndustryStatus.ARCHIVED } }),
      this.prisma.industryItem.groupBy({
        by: ['category'],
        _count: { category: true },
      }),
    ]);

    return {
      total,
      published,
      drafts,
      archived,
      categoriesCount: categories.length,
    };
  }

  // -------------------------------------------------------------------------
  // MUTATIONS (ADMIN)
  // -------------------------------------------------------------------------

  async createIndustry(dto: CreateIndustryDto, actorUserId?: string) {
    const normalizedSlug = dto.slug.trim().toLowerCase().replace(/\s+/g, '-');

    const existing = await this.prisma.industryItem.findUnique({
      where: { slug: normalizedSlug },
    });

    if (existing) {
      throw new ConflictException(`Industry with slug "${normalizedSlug}" already exists.`);
    }

    // Determine next sort order
    const lastItem = await this.prisma.industryItem.findFirst({
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });
    const nextSortOrder = (lastItem?.sortOrder ?? 0) + 1;

    // Default structure for new industry content
    const defaultContent = {
      hero: {
        breadcrumbLabel: dto.name,
        eyebrowLabel: dto.name,
        headlineParts: [
          { text: 'Operating depth for ' },
          { text: dto.name, accent: 'blue', breakAfter: true },
          { text: 'without operational compromise.' },
        ],
        subheadText: dto.summary,
        primaryCta: { label: 'Book a demo', href: `/contact?utm_source=${normalizedSlug}` },
        secondaryCta: { label: 'Explore the platform', href: '#fits' },
        trustStats: [
          { icon: 'scanBarcode', label: 'Visibility at', value: 'Item level' },
          { icon: 'store', label: 'Coverage', value: 'Stores & network' },
          { icon: 'layers', label: 'Connected', value: 'Unified ERP' },
        ],
        heroImage: {
          src: '/images/industries/overview/apparel-operations.webp',
          alt: `${dto.name} operational team reviewing system workflows.`,
        },
        floatingCardTopLeft: {
          icon: 'boxes',
          title: `${dto.name} inventory`,
          meta: 'Synchronized live position',
          status: { text: 'In stock', tone: 'positive' },
        },
        floatingStatsCardTopRight: [
          { icon: 'boxes', label: 'Active SKUs', value: 1850, trend: { direction: 'up', label: '5%' } },
          { icon: 'receipt', label: 'Daily transactions', value: 320, trend: { direction: 'up', label: '14%' } },
          { icon: 'badgeCheck', label: 'Audit match', value: 100, suffix: '%' },
        ],
        floatingBannerBottomRight: {
          icon: 'arrowUpRight',
          title: 'One record, full control',
          subtitle: 'From procurement to customer point of sale',
        },
        bgLabel: `From supply to ${dto.name}`,
      },
      painsIntro: {
        eyebrow: 'Where clarity breaks',
        title: `${dto.name} carries more context than a stock number can hold.`,
        lede: `Key operational pressures that challenge ${dto.name} retail and supply chains.`,
      },
      pains: [
        {
          title: 'Inventory fragmentation across locations',
          body: 'Stock splits between warehouses, counters, and digital channels lose unified visibility.',
        },
        {
          title: 'Speed at billing vs operational precision',
          body: 'Counter staff need instant checkout without bypassing tax, batch, or variant validations.',
        },
        {
          title: 'Network visibility without entity loss',
          body: 'Central operations need aggregate oversight while preserving distinct entity books and roles.',
        },
      ],
      fit: {
        title: 'Centralize the rules and visibility. Keep operations connected.',
        body: `Bizonix provides unified operational control tailored for ${dto.name}.`,
        modules: [
          { name: 'Inventory', body: 'Stock levels, serials, and multi-location rebalancing.' },
          { name: 'Sales & POS', body: 'Fast counter billing and integrated payment settlement.' },
          { name: 'Accounting', body: 'Automated ledger posting aligned with transaction streams.' },
        ],
      },
      workflow: [
        {
          order: '01',
          title: 'Stock intake & verification',
          body: 'Scan and receive goods directly into inventory with instant GRN generation.',
          systems: ['Procurement', 'Inventory'],
          image: '/images/industries/overview/apparel-operations.webp',
          alt: 'Goods intake verification.',
        },
        {
          order: '02',
          title: 'Distribution and counter allocation',
          body: 'Move items to regional stores and sales floors with live tracking.',
          systems: ['Inventory', 'Wholesale'],
          image: '/images/product/security/security-warehouse-v2.png',
          alt: 'Stock distribution.',
        },
        {
          order: '03',
          title: 'Real-time billing and reconciliation',
          body: 'Transact at counters while updating ledger and channel availability instantly.',
          systems: ['Sales & POS', 'Accounting'],
          image: '/images/product/day-in-life/day-counter-sale.webp',
          alt: 'Customer checkout.',
        },
      ],
      proof: {
        label: 'Operational proof',
        title: 'A single record gives each movement the context it needs.',
        before: 'Operations were managed across disconnected spreadsheets, paper notes, and legacy point solutions.',
        after: 'Inventory, retail movement, wholesale distribution, and accounting share one operational record.',
        turningPoint: 'Connected every transaction to one synchronized enterprise backbone.',
        image: '/images/industries/proof/customer-story.webp',
        alt: `${dto.name} team reviewing connected dashboard.`,
      },
      cta: {
        title: `See ${dto.name} operations as one connected system.`,
        body: 'Book a walkthrough tailored to the way your stores, warehouse, and partners run today.',
      },
      seo: {
        metaTitle: `${dto.name} ERP Software | Bizonix`,
        metaDescription: dto.summary,
        ogTitle: `${dto.name} — Enterprise Vertical | Bizonix`,
        ogDescription: dto.summary,
      },
    };

    return this.prisma.$transaction(async (tx) => {
      const created = await tx.industryItem.create({
        data: {
          slug: normalizedSlug,
          name: dto.name.trim(),
          category: dto.category.trim(),
          summary: dto.summary.trim(),
          accent: dto.accent || IndustryAccent.BLUE,
          badge: dto.badge?.trim() || null,
          sortOrder: nextSortOrder,
          status: IndustryStatus.DRAFT,
          everPublished: false,
          version: 1,
          contentVersion: 1,
          showInOverview: dto.showInOverview ?? true,
          showInMegaMenu: dto.showInMegaMenu ?? false,
          showInHomepage: dto.showInHomepage ?? false,
          showInFooter: dto.showInFooter ?? false,
          content: dto.content || defaultContent,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'INDUSTRY_CREATED',
          resourceType: 'INDUSTRY',
          resourceId: created.id,
          afterJson: {
            slug: created.slug,
            name: created.name,
            status: created.status,
          },
        },
      });

      return created;
    });
  }

  async updateIndustry(id: string, dto: UpdateIndustryDto, actorUserId?: string) {
    const existing = await this.prisma.industryItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Industry with id "${id}" not found.`);
    }

    // Optimistic concurrency check
    if (existing.version !== dto.expectedVersion) {
      throw new ConflictException(
        `This industry was modified by another administrator (expected version ${dto.expectedVersion}, found ${existing.version}). Please reload to review the latest changes.`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.industryItem.update({
        where: { id },
        data: {
          name: dto.name?.trim() ?? existing.name,
          category: dto.category?.trim() ?? existing.category,
          summary: dto.summary?.trim() ?? existing.summary,
          accent: dto.accent ?? existing.accent,
          badge: dto.badge !== undefined ? dto.badge?.trim() || null : existing.badge,
          showInOverview: dto.showInOverview ?? existing.showInOverview,
          showInMegaMenu: dto.showInMegaMenu ?? existing.showInMegaMenu,
          showInHomepage: dto.showInHomepage ?? existing.showInHomepage,
          showInFooter: dto.showInFooter ?? existing.showInFooter,
          content: (dto.content ?? existing.content) as Prisma.InputJsonValue,
          version: existing.version + 1,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'INDUSTRY_UPDATED',
          resourceType: 'INDUSTRY',
          resourceId: id,
          beforeJson: {
            name: existing.name,
            version: existing.version,
          },
          afterJson: {
            name: updated.name,
            version: updated.version,
          },
        },
      });

      return updated;
    });
  }

  async publishIndustry(id: string, actorUserId?: string) {
    const existing = await this.prisma.industryItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Industry with id "${id}" not found.`);
    }

    // Strict validation of Industry content before publication
    const content = existing.content as Record<string, any>;
    if (!content?.hero?.headlineParts || content.hero.headlineParts.length < 1) {
      throw new BadRequestException('Industry hero section requires at least one headline part before publishing.');
    }
    if (!content?.hero?.subheadText) {
      throw new BadRequestException('Industry hero section requires subhead copy before publishing.');
    }
    if (!content?.pains || !Array.isArray(content.pains) || content.pains.length < 1) {
      throw new BadRequestException('Industry requires at least one operational pressure point before publishing.');
    }
    if (!content?.workflow || !Array.isArray(content.workflow) || content.workflow.length < 1) {
      throw new BadRequestException('Industry requires at least one operating day workflow step before publishing.');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.industryItem.update({
        where: { id },
        data: {
          status: IndustryStatus.PUBLISHED,
          everPublished: true,
          publishedAt: new Date(),
          version: existing.version + 1,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'INDUSTRY_PUBLISHED',
          resourceType: 'INDUSTRY',
          resourceId: id,
          afterJson: {
            slug: updated.slug,
            version: updated.version,
            publishedAt: updated.publishedAt,
          },
        },
      });

      return updated;
    });
  }

  async unpublishIndustry(id: string, actorUserId?: string) {
    const existing = await this.prisma.industryItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Industry not found.`);

    if (existing.status !== IndustryStatus.PUBLISHED) {
      throw new BadRequestException(`Industry is not currently published.`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.industryItem.update({
        where: { id },
        data: {
          status: IndustryStatus.DRAFT,
          version: existing.version + 1,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'INDUSTRY_UNPUBLISHED',
          resourceType: 'INDUSTRY',
          resourceId: id,
          afterJson: { status: IndustryStatus.DRAFT },
        },
      });

      return updated;
    });
  }

  async archiveIndustry(id: string, actorUserId?: string) {
    const existing = await this.prisma.industryItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Industry not found.`);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.industryItem.update({
        where: { id },
        data: {
          status: IndustryStatus.ARCHIVED,
          version: existing.version + 1,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'INDUSTRY_ARCHIVED',
          resourceType: 'INDUSTRY',
          resourceId: id,
          afterJson: { status: IndustryStatus.ARCHIVED },
        },
      });

      return updated;
    });
  }

  async restoreIndustry(id: string, actorUserId?: string) {
    const existing = await this.prisma.industryItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Industry not found.`);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.industryItem.update({
        where: { id },
        data: {
          status: IndustryStatus.DRAFT,
          version: existing.version + 1,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'INDUSTRY_RESTORED',
          resourceType: 'INDUSTRY',
          resourceId: id,
          afterJson: { status: IndustryStatus.DRAFT },
        },
      });

      return updated;
    });
  }

  async reorderIndustries(dto: ReorderIndustriesDto, actorUserId?: string) {
    return this.prisma.$transaction(async (tx) => {
      for (const item of dto.items) {
        await tx.industryItem.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        });
      }

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'INDUSTRY_REORDERED',
          resourceType: 'INDUSTRY',
          afterJson: { itemCount: dto.items.length },
        },
      });

      return { success: true, count: dto.items.length };
    });
  }

  async deleteIndustry(id: string, actorUserId?: string) {
    const existing = await this.prisma.industryItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Industry not found.`);

    // Archive-first safeguard: industries that have ever been published cannot be hard-deleted
    if (existing.everPublished) {
      throw new BadRequestException(
        `Industries that have ever been published cannot be hard-deleted because their public URLs may be indexed or referenced. Please archive this industry instead.`,
      );
    }

    if (existing.status === IndustryStatus.PUBLISHED) {
      throw new BadRequestException(`Published industries cannot be deleted. Unpublish or archive instead.`);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.industryItem.delete({
        where: { id },
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'INDUSTRY_DELETED',
          resourceType: 'INDUSTRY',
          resourceId: id,
          beforeJson: { slug: existing.slug, name: existing.name },
        },
      });

      return { success: true, deletedId: id };
    });
  }
}
