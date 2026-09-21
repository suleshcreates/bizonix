import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateModuleDto,
  UpdateModuleDto,
  ReorderModulesDto,
  ModuleListItemDto,
  ModulePublicDetailDto,
  AdminModuleDto,
  AdminModulePreviewDto,
} from './dto/module.dto';
import { ModuleStatus, Prisma } from '@prisma/client';

@Injectable()
export class ModulesService {
  constructor(private readonly prisma: PrismaService) {}

  // -------------------------------------------------------------------------
  // PUBLIC QUERIES (status = PUBLISHED only)
  // -------------------------------------------------------------------------

  async getPublicModules(): Promise<ModuleListItemDto[]> {
    const modules = await this.prisma.moduleItem.findMany({
      where: { status: ModuleStatus.PUBLISHED },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        summary: true,
        outcome: true,
        themeKey: true,
        iconKey: true,
        badge: true,
        sortOrder: true,
        showInCatalog: true,
        showInMegaMenu: true,
        showInHomepage: true,
        showInFooter: true,
      },
    });

    return modules.map((m) => ({
      ...m,
      route: `/modules/${m.slug}`,
    }));
  }

  async getPublicModuleBySlug(slug: string): Promise<ModulePublicDetailDto> {
    const moduleItem = await this.prisma.moduleItem.findFirst({
      where: {
        slug,
        status: ModuleStatus.PUBLISHED,
      },
      include: {
        faqs: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            question: true,
            answer: true,
            sortOrder: true,
          },
        },
      },
    });

    if (!moduleItem) {
      throw new NotFoundException(`Module with slug "${slug}" not found or not published.`);
    }

    return {
      slug: moduleItem.slug,
      title: moduleItem.title,
      category: moduleItem.category,
      summary: moduleItem.summary,
      outcome: moduleItem.outcome,
      themeKey: moduleItem.themeKey,
      iconKey: moduleItem.iconKey,
      badge: moduleItem.badge,
      content: moduleItem.content as Record<string, any>,
      faqs: moduleItem.faqs,
      publishedAt: moduleItem.publishedAt,
    };
  }

  // -------------------------------------------------------------------------
  // ADMIN QUERIES
  // -------------------------------------------------------------------------

  async getAdminModules(query: {
    search?: string;
    category?: string;
    status?: ModuleStatus;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 50));
    const skip = (page - 1) * limit;

    const where: Prisma.ModuleItemWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { title: { contains: s, mode: 'insensitive' } },
        { slug: { contains: s, mode: 'insensitive' } },
        { summary: { contains: s, mode: 'insensitive' } },
        { category: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [total, items, stats] = await Promise.all([
      this.prisma.moduleItem.count({ where }),
      this.prisma.moduleItem.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
        skip,
        take: limit,
        include: {
          faqs: {
            orderBy: { sortOrder: 'asc' },
            select: { id: true },
          },
        },
      }),
      this.getStats(),
    ]);

    return {
      items: items.map((m) => ({
        id: m.id,
        slug: m.slug,
        title: m.title,
        category: m.category,
        summary: m.summary,
        outcome: m.outcome,
        themeKey: m.themeKey,
        iconKey: m.iconKey,
        badge: m.badge,
        sortOrder: m.sortOrder,
        status: m.status,
        everPublished: m.everPublished,
        version: m.version,
        showInCatalog: m.showInCatalog,
        showInMegaMenu: m.showInMegaMenu,
        showInHomepage: m.showInHomepage,
        showInFooter: m.showInFooter,
        faqCount: m.faqs.length,
        publishedAt: m.publishedAt,
        updatedAt: m.updatedAt,
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

  async getAdminModuleById(id: string): Promise<AdminModuleDto> {
    const moduleItem = await this.prisma.moduleItem.findUnique({
      where: { id },
      include: {
        faqs: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!moduleItem) {
      throw new NotFoundException(`Module with id "${id}" not found.`);
    }

    return {
      id: moduleItem.id,
      slug: moduleItem.slug,
      title: moduleItem.title,
      category: moduleItem.category,
      summary: moduleItem.summary,
      outcome: moduleItem.outcome,
      themeKey: moduleItem.themeKey,
      iconKey: moduleItem.iconKey,
      badge: moduleItem.badge,
      sortOrder: moduleItem.sortOrder,
      status: moduleItem.status,
      everPublished: moduleItem.everPublished,
      version: moduleItem.version,
      contentVersion: moduleItem.contentVersion,
      showInCatalog: moduleItem.showInCatalog,
      showInMegaMenu: moduleItem.showInMegaMenu,
      showInHomepage: moduleItem.showInHomepage,
      showInFooter: moduleItem.showInFooter,
      content: moduleItem.content as Record<string, any>,
      faqs: moduleItem.faqs.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        sortOrder: f.sortOrder,
        isPublished: f.isPublished,
      })),
      publishedAt: moduleItem.publishedAt,
      createdAt: moduleItem.createdAt,
      updatedAt: moduleItem.updatedAt,
    };
  }

  async getAdminModulePreview(id: string): Promise<AdminModulePreviewDto> {
    const moduleItem = await this.prisma.moduleItem.findUnique({
      where: { id },
      include: {
        faqs: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!moduleItem) {
      throw new NotFoundException(`Module with id "${id}" not found.`);
    }

    return {
      slug: moduleItem.slug,
      title: moduleItem.title,
      category: moduleItem.category,
      summary: moduleItem.summary,
      outcome: moduleItem.outcome,
      themeKey: moduleItem.themeKey,
      iconKey: moduleItem.iconKey,
      badge: moduleItem.badge,
      content: moduleItem.content as Record<string, any>,
      faqs: moduleItem.faqs.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        sortOrder: f.sortOrder,
      })),
      previewToken: `preview-${moduleItem.id}-${Date.now()}`,
      isDraft: moduleItem.status !== ModuleStatus.PUBLISHED,
    };
  }

  private async getStats() {
    const [total, published, drafts, archived, categories] = await Promise.all([
      this.prisma.moduleItem.count(),
      this.prisma.moduleItem.count({ where: { status: ModuleStatus.PUBLISHED } }),
      this.prisma.moduleItem.count({ where: { status: ModuleStatus.DRAFT } }),
      this.prisma.moduleItem.count({ where: { status: ModuleStatus.ARCHIVED } }),
      this.prisma.moduleItem.groupBy({
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

  async createModule(dto: CreateModuleDto, actorUserId?: string) {
    const normalizedSlug = dto.slug.trim().toLowerCase().replace(/\s+/g, '-');

    const existing = await this.prisma.moduleItem.findUnique({
      where: { slug: normalizedSlug },
    });

    if (existing) {
      throw new ConflictException(`Module with slug "${normalizedSlug}" already exists.`);
    }

    // Determine next sort order
    const lastItem = await this.prisma.moduleItem.findFirst({
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });
    const nextSortOrder = (lastItem?.sortOrder ?? 0) + 1;

    // Default structure for new standard module content
    const defaultContent = {
      hero: {
        eyebrow: dto.title,
        headline: `${dto.title} for modern operating brands`,
        headlineAccent: 'for modern operating brands',
        body: dto.summary,
        primaryCta: { label: 'Book consultation', href: '/contact' },
        secondaryCta: { label: 'See all solutions', href: '/modules' },
        templateKey: 'standard',
        chain: [
          { id: 'step-1', label: 'Intake', detail: 'Central capture' },
          { id: 'step-2', label: 'Processing', detail: 'Live verification' },
          { id: 'step-3', label: 'Reconciliation', detail: 'Ledger sync' },
        ],
        facts: [
          { label: 'Latency', value: '< 200ms' },
          { label: 'Integrity', value: '100%' },
          { label: 'Audited', value: 'Continuous' },
        ],
      },
      problemSection: {
        presentation: 'visual-stories',
        eyebrow: `Before ${dto.title}`,
        title: 'Friction in fragmented operations',
        intro: 'Where traditional operations break under scale.',
        problems: [
          {
            id: 'prob-1',
            number: '01',
            title: 'Siloed information',
            description: 'Data held in separate tools drifts out of sync.',
            quote: 'We spent hours matching reports across systems.',
            visual: 'count-mismatch',
          },
          {
            id: 'prob-2',
            number: '02',
            title: 'Delayed reconciliation',
            description: 'End-of-day batches hide discrepancies until too late.',
            quote: 'Stock was already shipped before errors were spotted.',
            visual: 'order-receipt-drift',
          },
          {
            id: 'prob-3',
            number: '03',
            title: 'Uncontrolled access',
            description: 'Permissions drift as teams expand across outlets.',
            quote: 'People had access to entities they did not manage.',
            visual: 'permission-creep',
          },
        ],
        consequence: {
          title: 'The operational cost',
          items: [
            { id: 'c-1', label: 'Lost Margin', body: 'Unnoticed shrinkage and pricing leakage.' },
            { id: 'c-2', label: 'Operational Drag', body: 'Manual spreadsheet reconciliations.' },
            { id: 'c-3', label: 'Customer Friction', body: 'Unfulfilled orders and incorrect inventory.' },
          ],
        },
      },
      outcomesSection: {
        eyebrow: 'Measured outcome',
        title: 'Clear operational control',
        highlight: 'One operating truth.',
        intro: 'Measurable improvements delivered immediately.',
        outcomes: [
          {
            id: 'out-1',
            number: '01',
            visualVariant: 'bars',
            accent: '#2f6bff',
            title: 'Zero reconciliation latency',
            description: 'Transactions write to stock and ledgers in real time.',
          },
          {
            id: 'out-2',
            number: '02',
            visualVariant: 'trend',
            accent: '#2d9d78',
            title: 'Complete audit traceability',
            description: 'Every record change carries an attributed actor and timestamp.',
          },
          {
            id: 'out-3',
            number: '03',
            visualVariant: 'dots',
            accent: '#8b5cf6',
            title: 'Entity-scoped governance',
            description: 'Store teams operate within strict boundary controls.',
          },
        ],
      },
      capabilities: {
        groups: [
          {
            id: 'cap-1',
            title: 'Core Functions',
            context: 'Essential workflows',
            items: ['Live tracking', 'Role-based access', 'Automated alerts'],
          },
        ],
        limitations: [],
      },
      workflow: {
        title: 'Operating sequence',
        intro: 'How operations move from trigger to ledger.',
        steps: [
          {
            id: 'wf-1',
            index: '01',
            title: 'Initiate transaction',
            body: 'Operator captures action at terminal or warehouse.',
            record: 'Initiated event',
          },
          {
            id: 'wf-2',
            index: '02',
            title: 'Validate boundary',
            body: 'Engine checks permissions and stock availability.',
            record: 'Validated record',
          },
          {
            id: 'wf-3',
            index: '03',
            title: 'Commit to ledger',
            body: 'Synchronous post across all related entities.',
            record: 'Settled state',
          },
        ],
      },
      gallery: {
        variant: 'featured-plus-grid',
        title: 'System interface',
        intro: 'Screens built for operator speed and precision.',
        shots: [],
      },
      verticalRelevance: {
        heading: 'Where it matters',
        headingAccent: 'in your sector',
        intro: 'Engineered for high-volume Indian multi-entity retail.',
        contexts: [],
      },
      relatedModules: ['inventory', 'sales-pos', 'accounting'],
      seo: {
        title: `${dto.title} Management Software | Bizonix ERP`,
        description: dto.summary,
        ogTitle: `${dto.title} | Bizonix ERP`,
        ogDescription: dto.outcome,
      },
    };

    return this.prisma.$transaction(async (tx) => {
      const created = await tx.moduleItem.create({
        data: {
          slug: normalizedSlug,
          title: dto.title.trim(),
          category: dto.category.trim(),
          summary: dto.summary.trim(),
          outcome: dto.outcome.trim(),
          themeKey: dto.themeKey || 'BLUE',
          iconKey: dto.iconKey || 'BOXES',
          badge: dto.badge?.trim() || null,
          sortOrder: nextSortOrder,
          status: ModuleStatus.DRAFT,
          everPublished: false,
          version: 1,
          contentVersion: 1,
          showInCatalog: dto.showInCatalog ?? true,
          showInMegaMenu: dto.showInMegaMenu ?? false,
          showInHomepage: dto.showInHomepage ?? false,
          showInFooter: dto.showInFooter ?? false,
          content: dto.content || defaultContent,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'MODULE_CREATED',
          resourceType: 'MODULE',
          resourceId: created.id,
          afterJson: {
            slug: created.slug,
            title: created.title,
            status: created.status,
          },
        },
      });

      return created;
    });
  }

  async updateModule(id: string, dto: UpdateModuleDto, actorUserId?: string) {
    const existing = await this.prisma.moduleItem.findUnique({
      where: { id },
      include: { faqs: true },
    });

    if (!existing) {
      throw new NotFoundException(`Module with id "${id}" not found.`);
    }

    // Optimistic concurrency check
    if (existing.version !== dto.expectedVersion) {
      throw new ConflictException(
        `This module was modified by another administrator (expected version ${dto.expectedVersion}, found ${existing.version}). Please reload to review the latest changes.`,
      );
    }

    // Two-tier relatedModules validation: during draft save, referenced modules must exist in DB
    if (dto.content?.relatedModules && Array.isArray(dto.content.relatedModules)) {
      const relatedSlugs = dto.content.relatedModules as string[];
      for (const rSlug of relatedSlugs) {
        if (rSlug === existing.slug) {
          throw new BadRequestException(`Module cannot reference itself in relatedModules.`);
        }
        const rel = await this.prisma.moduleItem.findUnique({ where: { slug: rSlug } });
        if (!rel) {
          throw new BadRequestException(
            `Referenced related module "${rSlug}" does not exist in the system.`,
          );
        }
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // Sync FAQs if provided
      if (dto.faqs) {
        // Delete removed FAQs
        const incomingIds = dto.faqs.filter((f) => f.id).map((f) => f.id as string);
        await tx.faqItem.deleteMany({
          where: {
            moduleId: id,
            id: { notIn: incomingIds },
          },
        });

        // Upsert FAQs
        for (let i = 0; i < dto.faqs.length; i++) {
          const f = dto.faqs[i];
          if (f.id) {
            await tx.faqItem.update({
              where: { id: f.id },
              data: {
                question: f.question.trim(),
                answer: f.answer.trim(),
                sortOrder: f.sortOrder ?? i + 1,
                isPublished: f.isPublished ?? true,
                location: 'MODULE',
              },
            });
          } else {
            await tx.faqItem.create({
              data: {
                question: f.question.trim(),
                answer: f.answer.trim(),
                sortOrder: f.sortOrder ?? i + 1,
                isPublished: f.isPublished ?? true,
                location: 'MODULE',
                moduleId: id,
              },
            });
          }
        }
      }

      const updated = await tx.moduleItem.update({
        where: { id },
        data: {
          title: dto.title?.trim() ?? existing.title,
          category: dto.category?.trim() ?? existing.category,
          summary: dto.summary?.trim() ?? existing.summary,
          outcome: dto.outcome?.trim() ?? existing.outcome,
          themeKey: dto.themeKey ?? existing.themeKey,
          iconKey: dto.iconKey ?? existing.iconKey,
          badge: dto.badge !== undefined ? dto.badge?.trim() || null : existing.badge,
          showInCatalog: dto.showInCatalog ?? existing.showInCatalog,
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
          action: 'MODULE_UPDATED',
          resourceType: 'MODULE',
          resourceId: id,
          beforeJson: {
            title: existing.title,
            version: existing.version,
          },
          afterJson: {
            title: updated.title,
            version: updated.version,
          },
        },
      });

      return updated;
    });
  }

  async publishModule(id: string, actorUserId?: string) {
    const existing = await this.prisma.moduleItem.findUnique({
      where: { id },
      include: { faqs: true },
    });

    if (!existing) {
      throw new NotFoundException(`Module with id "${id}" not found.`);
    }

    // Strict validation of ModuleContentV1 before publication
    const content = existing.content as Record<string, any>;
    if (!content?.hero?.headline || !content?.hero?.body) {
      throw new BadRequestException('Module hero section requires headline and body before publishing.');
    }
    if (!content?.problemSection?.problems || content.problemSection.problems.length < 1) {
      throw new BadRequestException('Module requires at least one problem friction point before publishing.');
    }
    if (!content?.capabilities?.groups || content.capabilities.groups.length < 1) {
      throw new BadRequestException('Module requires at least one capability group before publishing.');
    }

    // Two-tier relatedModules validation: upon publish, EVERY referenced module must be PUBLISHED
    if (content?.relatedModules && Array.isArray(content.relatedModules)) {
      for (const rSlug of content.relatedModules) {
        const rel = await this.prisma.moduleItem.findUnique({ where: { slug: rSlug } });
        if (!rel || rel.status !== ModuleStatus.PUBLISHED) {
          throw new BadRequestException(
            `Cannot publish module: referenced related module "${rSlug}" is not published.`,
          );
        }
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.moduleItem.update({
        where: { id },
        data: {
          status: ModuleStatus.PUBLISHED,
          everPublished: true,
          publishedAt: new Date(),
          version: existing.version + 1,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'MODULE_PUBLISHED',
          resourceType: 'MODULE',
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

  async unpublishModule(id: string, actorUserId?: string) {
    const existing = await this.prisma.moduleItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Module not found.`);

    if (existing.status !== ModuleStatus.PUBLISHED) {
      throw new BadRequestException(`Module is not currently published.`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.moduleItem.update({
        where: { id },
        data: {
          status: ModuleStatus.DRAFT,
          version: existing.version + 1,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'MODULE_UNPUBLISHED',
          resourceType: 'MODULE',
          resourceId: id,
          afterJson: { status: ModuleStatus.DRAFT },
        },
      });

      return updated;
    });
  }

  async archiveModule(id: string, actorUserId?: string) {
    const existing = await this.prisma.moduleItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Module not found.`);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.moduleItem.update({
        where: { id },
        data: {
          status: ModuleStatus.ARCHIVED,
          version: existing.version + 1,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'MODULE_ARCHIVED',
          resourceType: 'MODULE',
          resourceId: id,
          afterJson: { status: ModuleStatus.ARCHIVED },
        },
      });

      return updated;
    });
  }

  async restoreModule(id: string, actorUserId?: string) {
    const existing = await this.prisma.moduleItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Module not found.`);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.moduleItem.update({
        where: { id },
        data: {
          status: ModuleStatus.DRAFT,
          version: existing.version + 1,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'MODULE_RESTORED',
          resourceType: 'MODULE',
          resourceId: id,
          afterJson: { status: ModuleStatus.DRAFT },
        },
      });

      return updated;
    });
  }

  async reorderModules(dto: ReorderModulesDto, actorUserId?: string) {
    return this.prisma.$transaction(async (tx) => {
      for (const item of dto.items) {
        await tx.moduleItem.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        });
      }

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'MODULE_REORDERED',
          resourceType: 'MODULE',
          afterJson: { itemCount: dto.items.length },
        },
      });

      return { success: true, count: dto.items.length };
    });
  }

  async deleteModule(id: string, actorUserId?: string) {
    const existing = await this.prisma.moduleItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Module not found.`);

    // Archive-first safeguard: modules that have ever been published cannot be hard-deleted
    if (existing.everPublished) {
      throw new BadRequestException(
        `Modules that have ever been published cannot be hard-deleted because their public URLs may be indexed or referenced. Please archive this module instead.`,
      );
    }

    if (existing.status === ModuleStatus.PUBLISHED) {
      throw new BadRequestException(`Published modules cannot be deleted. Unpublish or archive instead.`);
    }

    // Check if referenced by other modules in relatedModules
    const allOtherModules = await this.prisma.moduleItem.findMany({
      where: { id: { not: id } },
      select: { slug: true, title: true, content: true },
    });

    for (const other of allOtherModules) {
      const related = (other.content as any)?.relatedModules;
      if (Array.isArray(related) && related.includes(existing.slug)) {
        throw new BadRequestException(
          `Cannot delete module "${existing.title}": it is referenced by module "${other.title}". Remove the reference first or archive instead.`,
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // Delete associated module FAQs
      await tx.faqItem.deleteMany({
        where: { moduleId: id },
      });

      await tx.moduleItem.delete({
        where: { id },
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: 'MODULE_DELETED',
          resourceType: 'MODULE',
          resourceId: id,
          beforeJson: { slug: existing.slug, title: existing.title },
        },
      });

      return { success: true, deletedId: id };
    });
  }
}
