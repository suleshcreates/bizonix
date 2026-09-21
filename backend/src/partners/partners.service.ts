import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto, UpdatePartnerDto, PartnersConfigDto } from './dto/partner.dto';

const DEFAULT_PARTNERS_CONFIG: PartnersConfigDto = {
  eyebrow: 'TRUSTED ECOSYSTEM',
  title: 'Integrated with Leading Platforms & Networks',
  subtitle:
    'Seamless bidirectional connectivity with premier payment gateways, logistics aggregators, hardware terminals, and enterprise cloud systems.',
  speedSeconds: 35,
  showOnHomepage: true,
};

const CANONICAL_FALLBACK_PARTNERS = [
  {
    id: 'partner-1',
    name: 'Razorpay',
    slug: 'razorpay',
    category: 'Payments & Checkout',
    logoUrl: '',
    websiteUrl: 'https://razorpay.com',
    description: 'Omnichannel payment gateway and POS reconciliation',
    sortOrder: 0,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'partner-2',
    name: 'Pine Labs',
    slug: 'pine-labs',
    category: 'Hardware & POS Terminals',
    logoUrl: '',
    websiteUrl: 'https://pinelabs.com',
    description: 'Smart android EDC card machines and retail payment terminals',
    sortOrder: 1,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'partner-3',
    name: 'Delhivery',
    slug: 'delhivery',
    category: 'Logistics & 3PL',
    logoUrl: '',
    websiteUrl: 'https://delhivery.com',
    description: 'Automated surface dispatch, express courier, and nationwide freight',
    sortOrder: 2,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'partner-4',
    name: 'Amazon Web Services',
    slug: 'aws',
    category: 'Cloud Infrastructure',
    logoUrl: '',
    websiteUrl: 'https://aws.amazon.com',
    description: 'Enterprise multi-AZ cloud hosting and auto-scaling computing',
    sortOrder: 3,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'partner-5',
    name: 'SAP ERP',
    slug: 'sap',
    category: 'Enterprise Systems',
    logoUrl: '',
    websiteUrl: 'https://sap.com',
    description: 'Two-way financial ledgers and materials management integration',
    sortOrder: 4,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'partner-6',
    name: 'Salesforce',
    slug: 'salesforce',
    category: 'CRM & Service Cloud',
    logoUrl: '',
    websiteUrl: 'https://salesforce.com',
    description: 'Customer lifecycle, omnichannel lead tracking, and loyalty sync',
    sortOrder: 5,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'partner-7',
    name: 'Stripe',
    slug: 'stripe',
    category: 'Global Payments',
    logoUrl: '',
    websiteUrl: 'https://stripe.com',
    description: 'Cross-border multi-currency billing and subscription management',
    sortOrder: 6,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'partner-8',
    name: 'Shiprocket',
    slug: 'shiprocket',
    category: 'Fulfillment & Hyperlocal',
    logoUrl: '',
    websiteUrl: 'https://shiprocket.in',
    description: 'Multi-carrier logistics allocation and same-day city deliveries',
    sortOrder: 7,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'partner-9',
    name: 'Zoho Books',
    slug: 'zoho',
    category: 'Accounting & Tax',
    logoUrl: '',
    websiteUrl: 'https://zoho.com',
    description: 'Automated GST filing and statutory compliance registers',
    sortOrder: 8,
    isFeatured: true,
    isPublished: true,
  },
];

@Injectable()
export class PartnersService {
  private readonly logger = new Logger(PartnersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Public storefront query for Homepage Logo Marquee
   */
  async findAllPublic() {
    try {
      const [partners, config] = await Promise.all([
        this.prisma.partner.findMany({
          where: {
            isPublished: true,
            deletedAt: null,
          },
          orderBy: { sortOrder: 'asc' },
        }),
        this.getConfig(),
      ]);

      const items = partners.length > 0 ? partners : CANONICAL_FALLBACK_PARTNERS;
      return {
        config,
        partners: items,
      };
    } catch (err: any) {
      this.logger.error(`Error loading public partners: ${err?.message}`);
      return {
        config: DEFAULT_PARTNERS_CONFIG,
        partners: CANONICAL_FALLBACK_PARTNERS,
      };
    }
  }

  /**
   * Admin CMS query
   */
  async findAllAdmin(search?: string) {
    const where: any = { deletedAt: null };
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total, config] = await Promise.all([
      this.prisma.partner.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.partner.count({ where }),
      this.getConfig(),
    ]);

    return {
      items,
      total,
      config,
    };
  }

  /**
   * Create Partner
   */
  async create(dto: CreatePartnerDto, userId?: string) {
    let slug = dto.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check slug collision
    const existing = await this.prisma.partner.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Default sort order to max + 1
    let sortOrder = dto.sortOrder;
    if (sortOrder === undefined) {
      const maxOrder = await this.prisma.partner.aggregate({
        _max: { sortOrder: true },
      });
      sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;
    }

    const partner = await this.prisma.partner.create({
      data: {
        name: dto.name,
        slug,
        category: dto.category || 'Technology Partner',
        logoUrl: dto.logoUrl || '',
        websiteUrl: dto.websiteUrl || '',
        description: dto.description || '',
        sortOrder,
        isFeatured: dto.isFeatured ?? true,
        isPublished: dto.isPublished ?? true,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          actorUserId: userId,
          action: 'PARTNER_CREATED',
          resourceType: 'partner',
          resourceId: partner.id,
          afterJson: partner as any,
        },
      });
    }

    return partner;
  }

  /**
   * Update Partner
   */
  async update(id: string, dto: UpdatePartnerDto, userId?: string) {
    const existing = await this.prisma.partner.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Partner with ID ${id} not found.`);
    }

    const partner = await this.prisma.partner.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
        ...(dto.websiteUrl !== undefined && { websiteUrl: dto.websiteUrl }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
        ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          actorUserId: userId,
          action: 'PARTNER_UPDATED',
          resourceType: 'partner',
          resourceId: partner.id,
          beforeJson: existing as any,
          afterJson: partner as any,
        },
      });
    }

    return partner;
  }

  /**
   * Delete Partner
   */
  async delete(id: string, userId?: string) {
    const existing = await this.prisma.partner.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Partner with ID ${id} not found.`);
    }

    await this.prisma.partner.delete({ where: { id } });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          actorUserId: userId,
          action: 'PARTNER_DELETED',
          resourceType: 'partner',
          resourceId: id,
          beforeJson: existing as any,
        },
      });
    }

    return { success: true, message: `Partner ${existing.name} removed successfully.` };
  }

  /**
   * Batch Reorder Partners
   */
  async reorder(ids: string[], userId?: string) {
    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.partner.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          actorUserId: userId,
          action: 'PARTNERS_REORDERED',
          resourceType: 'partner',
        },
      });
    }

    return { success: true, count: ids.length };
  }

  /**
   * Get Section Settings Config
   */
  async getConfig(): Promise<PartnersConfigDto> {
    try {
      const setting = await this.prisma.siteSetting.findUnique({
        where: { key: 'partners_section_config' },
      });
      if (setting && setting.value) {
        return {
          ...DEFAULT_PARTNERS_CONFIG,
          ...JSON.parse(setting.value),
        };
      }
    } catch {
      // fallback
    }
    return DEFAULT_PARTNERS_CONFIG;
  }

  /**
   * Update Section Settings Config
   */
  async updateConfig(dto: PartnersConfigDto, userId?: string) {
    const current = await this.getConfig();
    const updated = {
      ...current,
      ...dto,
    };

    await this.prisma.siteSetting.upsert({
      where: { key: 'partners_section_config' },
      update: { value: JSON.stringify(updated) },
      create: { key: 'partners_section_config', value: JSON.stringify(updated) },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          actorUserId: userId,
          action: 'PARTNERS_CONFIG_UPDATED',
          resourceType: 'settings',
          afterJson: updated as any,
        },
      });
    }

    return updated;
  }
}
