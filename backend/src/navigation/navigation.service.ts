import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateNavigationDto,
  AdminNavigationResponseDto,
  AdminModuleOptionDto,
  AdminIndustryOptionDto,
} from './dto/navigation.dto';
import { ModuleStatus, IndustryStatus } from '@prisma/client';

@Injectable()
export class NavigationService {
  private readonly logger = new Logger(NavigationService.name);

  constructor(private readonly prisma: PrismaService) {}

  getDefaultNavigationConfig(): UpdateNavigationDto {
    return {
      announcement: {
        isActive: false,
        badge: 'NEW',
        text: 'Bizonix 3.0 launched — multi-entity retail & franchise operations unified.',
        linkText: 'Explore platform',
        linkHref: '/product',
        theme: 'blue',
        isDismissible: true,
      },
      header: {
        items: [
          {
            id: 'h-product',
            label: 'Product',
            href: '/product',
            type: 'link',
            isActive: true,
            sortOrder: 1,
          },
          {
            id: 'h-solutions',
            label: 'Solutions',
            href: '/modules',
            type: 'mega-menu',
            menu: 'solutions',
            isActive: true,
            sortOrder: 2,
          },
          {
            id: 'h-features',
            label: 'Features',
            href: '/features',
            type: 'mega-menu',
            menu: 'features',
            isActive: true,
            sortOrder: 3,
          },
          {
            id: 'h-industries',
            label: 'Industries',
            href: '/industries',
            type: 'mega-menu',
            menu: 'industries',
            isActive: true,
            sortOrder: 4,
          },
          {
            id: 'h-about',
            label: 'About',
            href: '/about',
            type: 'link',
            isActive: true,
            sortOrder: 5,
          },
        ],
        action: {
          isEnabled: true,
          label: 'Book a demo',
          href: '/contact',
        },
      },
      megaMenus: [
        {
          id: 'solutions',
          label: 'Solutions',
          href: '/modules',
          summary: {
            eyebrow: 'Built for operations',
            title: 'One system for the way your business runs.',
            description:
              'Connect inventory, sales, purchasing, finance and growth across every operating entity.',
            ctaLabel: 'Explore the platform',
            ctaHref: '/product',
          },
          footerLabel: 'Explore all modules',
          groups: [
            {
              id: 'group-operate',
              label: 'Operate',
              items: [
                {
                  id: 'inventory',
                  title: 'Inventory Management',
                  description: 'Stock, transfers and multi-location control.',
                  href: '/modules/inventory',
                  isActive: true,
                },
                {
                  id: 'sales-pos',
                  title: 'Sales & POS',
                  description: 'Sell, bill and keep stock connected.',
                  href: '/modules/sales-pos',
                  isActive: true,
                },
                {
                  id: 'procurement',
                  title: 'Procurement',
                  description: 'Receiving, pricing and payables.',
                  href: '/modules/procurement',
                  isActive: true,
                },
              ],
            },
            {
              id: 'group-grow',
              label: 'Grow',
              items: [
                {
                  id: 'wholesale',
                  title: 'Wholesale B2B',
                  description: 'Bulk orders and distribution.',
                  href: '/modules/wholesale',
                  isActive: true,
                },
                {
                  id: 'ecommerce',
                  title: 'Ecommerce Sync',
                  description: 'Online store and order management.',
                  href: '/modules/ecommerce',
                  isActive: true,
                },
                {
                  id: 'analytics',
                  title: 'Analytics & BI',
                  description: 'Insights across your operation.',
                  href: '/modules/analytics',
                  isActive: true,
                },
              ],
            },
            {
              id: 'group-scale',
              label: 'Scale',
              items: [
                {
                  id: 'franchise',
                  title: 'Franchise Management',
                  description: 'Outlet operations and oversight.',
                  href: '/modules/franchise',
                  isActive: true,
                },
                {
                  id: 'accounting',
                  title: 'Accounting Engine',
                  description: 'Books that already know your operations.',
                  href: '/modules/accounting',
                  isActive: true,
                },
                {
                  id: 'security',
                  title: 'Security & Access',
                  description: 'Access, roles and data protection.',
                  href: '/modules/security',
                  isActive: true,
                },
              ],
            },
          ],
        },
        {
          id: 'features',
          label: 'Features',
          href: '/features',
          summary: {
            eyebrow: 'Built for precision',
            title: 'The controls behind reliable operations.',
            description:
              'Keep identity, counters, tax, pricing and stock movement precise from the first transaction.',
            ctaLabel: 'Explore the platform',
            ctaHref: '/product',
          },
          footerLabel: 'Explore all features',
          groups: [
            {
              id: 'group-record',
              label: 'Record',
              items: [
                {
                  id: 'barcode',
                  title: 'Barcode',
                  description: 'Which one it is, not just what it is.',
                  href: '/features/barcode',
                  isActive: true,
                },
                {
                  id: 'gst-compliance',
                  title: 'GST Compliance',
                  description: 'Captured on the transaction.',
                  href: '/features/gst-compliance',
                  isActive: true,
                },
              ],
            },
            {
              id: 'group-transact',
              label: 'Transact',
              items: [
                {
                  id: 'billing-counters',
                  title: 'Billing Counters',
                  description: 'A shift that balances before it closes.',
                  href: '/features/billing-counters',
                  isActive: true,
                },
                {
                  id: 'series-pricing',
                  title: 'Series Pricing',
                  description: 'One series, one approved set of rates.',
                  href: '/features/series-pricing',
                  isActive: true,
                },
              ],
            },
            {
              id: 'group-move',
              label: 'Move',
              items: [
                {
                  id: 'stock-transfer',
                  title: 'Stock Transfer',
                  description: 'Stock in transit is still visible.',
                  href: '/features/stock-transfer',
                  isActive: true,
                },
              ],
            },
          ],
        },
        {
          id: 'industries',
          label: 'Industries',
          href: '/industries',
          summary: {
            eyebrow: 'Built for your model',
            title: 'Control shaped around how your business operates.',
            description:
              'Connect stock, selling and responsibility without flattening the realities of each retail model.',
            ctaLabel: 'Explore the platform',
            ctaHref: '/product',
          },
          footerLabel: 'Explore all industries',
          groups: [
            {
              id: 'group-retail',
              label: 'Retail models',
              items: [
                {
                  id: 'apparel',
                  title: 'Apparel & Footwear',
                  description: 'Size, colour, fit, season and exchange-heavy selling across stores.',
                  href: '/industries/apparel-footwear',
                  isActive: true,
                },
                {
                  id: 'jewellery',
                  title: 'Imitation Jewellery',
                  description: 'High-variant, rapid-turnover inventory with fine design-level control.',
                  href: '/industries/imitation-jewellery',
                  isActive: true,
                },
              ],
            },
            {
              id: 'group-networks',
              label: 'Networks',
              items: [
                {
                  id: 'franchise-networks',
                  title: 'Franchise Networks',
                  description: 'Multi-outlet visibility, supply control and franchisee settlements in one ledger.',
                  href: '/industries/franchise-networks',
                  isActive: true,
                },
              ],
            },
          ],
        },
      ],
      footerColumns: [
        {
          id: 'col-platform',
          title: 'Platform',
          sortOrder: 1,
          isActive: true,
          links: [
            { id: 'f-how', label: 'How it works', href: '/product', isActive: true },
            { id: 'f-modules', label: 'All solutions', href: '/modules', isActive: true },
            { id: 'f-about', label: 'About Bizonix', href: '/about', isActive: true },
          ],
        },
        {
          id: 'col-features',
          title: 'Features',
          sortOrder: 2,
          isActive: true,
          links: [
            { id: 'f-barcode', label: 'Barcode', href: '/features/barcode', isActive: true },
            { id: 'f-billing', label: 'Billing Counters', href: '/features/billing-counters', isActive: true },
            { id: 'f-gst', label: 'GST Compliance', href: '/features/gst-compliance', isActive: true },
            { id: 'f-series', label: 'Series Pricing', href: '/features/series-pricing', isActive: true },
            { id: 'f-stock', label: 'Stock Transfer', href: '/features/stock-transfer', isActive: true },
          ],
        },
        {
          id: 'col-industries',
          title: 'Industries',
          sortOrder: 3,
          isActive: true,
          links: [
            { id: 'f-ind-all', label: 'All industries', href: '/industries', isActive: true },
            { id: 'f-apparel', label: 'Apparel & Footwear', href: '/industries/apparel-footwear', isActive: true },
            { id: 'f-jewel', label: 'Imitation Jewellery', href: '/industries/imitation-jewellery', isActive: true },
            { id: 'f-franchise', label: 'Franchise Networks', href: '/industries/franchise-networks', isActive: true },
          ],
        },
        {
          id: 'col-company',
          title: 'Company',
          sortOrder: 4,
          isActive: true,
          links: [
            { id: 'f-co-about', label: 'About', href: '/about', isActive: true },
            { id: 'f-co-contact', label: 'Contact', href: '/contact', isActive: true },
          ],
        },
      ],
      footerCta: {
        isEnabled: true,
        eyebrow: 'One platform, every entity',
        title: 'Ready to run your brand on one operating truth?',
        lede: 'Thirty minutes, your numbers, no obligation. We will walk your warehouse, stores and partners through a single record.',
        primaryLabel: 'Book a free consultation',
        primaryHref: '/contact?utm_source=footer-cta',
        secondaryLabel: 'See the platform',
        secondaryHref: '/product',
      },
      bottomBar: {
        copyrightNotice: 'Fibonce Tech Solutions Pvt. Ltd. All rights reserved.',
        tagline: 'Built in India for multi-entity retail operators.',
        links: [
          { id: 'b-privacy', label: 'Privacy', href: '/privacy', isActive: true },
          { id: 'b-terms', label: 'Terms', href: '/terms', isActive: true },
        ],
      },
    };
  }

  async getPublicNavigation(): Promise<UpdateNavigationDto> {
    try {
      const configRecord = await this.prisma.navigationConfig.findUnique({
        where: { id: 'singleton' },
      });

      const defaults = this.getDefaultNavigationConfig();

      if (!configRecord) {
        return defaults;
      }

      // Merge saved configuration with defaults
      const savedConfig: UpdateNavigationDto = {
        announcement: (configRecord.announcement as any) || defaults.announcement,
        header: (configRecord.header as any) || defaults.header,
        megaMenus: Array.isArray((configRecord.megaMenu as any))
          ? (configRecord.megaMenu as any)
          : defaults.megaMenus,
        footerColumns: Array.isArray((configRecord.footer as any))
          ? (configRecord.footer as any)
          : defaults.footerColumns,
        footerCta: (configRecord.footerCta as any) || defaults.footerCta,
        bottomBar: (configRecord.bottomBar as any) || defaults.bottomBar,
      };

      // Filter out non-active items for public consumption
      if (savedConfig.header?.items) {
        savedConfig.header.items = savedConfig.header.items
          .filter((item) => item.isActive !== false)
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      }

      if (savedConfig.footerColumns) {
        savedConfig.footerColumns = savedConfig.footerColumns
          .filter((col) => col.isActive !== false)
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map((col) => ({
            ...col,
            links: (col.links || []).filter((l) => l.isActive !== false),
          }));
      }

      return savedConfig;
    } catch (error) {
      this.logger.error('Error fetching public navigation, falling back to defaults', error);
      return this.getDefaultNavigationConfig();
    }
  }

  async getAdminNavigation(): Promise<AdminNavigationResponseDto> {
    const configRecord = await this.prisma.navigationConfig.findUnique({
      where: { id: 'singleton' },
    });

    const defaults = this.getDefaultNavigationConfig();

    let config: UpdateNavigationDto;
    if (!configRecord) {
      config = defaults;
    } else {
      config = {
        announcement: (configRecord.announcement as any) || defaults.announcement,
        header: (configRecord.header as any) || defaults.header,
        megaMenus: Array.isArray((configRecord.megaMenu as any))
          ? (configRecord.megaMenu as any)
          : defaults.megaMenus,
        footerColumns: Array.isArray((configRecord.footer as any))
          ? (configRecord.footer as any)
          : defaults.footerColumns,
        footerCta: (configRecord.footerCta as any) || defaults.footerCta,
        bottomBar: (configRecord.bottomBar as any) || defaults.bottomBar,
      };
    }

    // Fetch published modules and industries for quick-import shortcuts in CMS
    const [modules, industries] = await Promise.all([
      this.prisma.moduleItem.findMany({
        where: { status: ModuleStatus.PUBLISHED },
        select: {
          id: true,
          slug: true,
          title: true,
          category: true,
          showInMegaMenu: true,
          showInFooter: true,
        },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.industryItem.findMany({
        where: { status: IndustryStatus.PUBLISHED },
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
          showInMegaMenu: true,
          showInFooter: true,
        },
        orderBy: { sortOrder: 'asc' },
      }),
    ]);

    const availableModules: AdminModuleOptionDto[] = modules.map((m) => ({
      id: m.id,
      slug: m.slug,
      title: m.title,
      category: m.category,
      showInMegaMenu: m.showInMegaMenu,
      showInFooter: m.showInFooter,
    }));

    const availableIndustries: AdminIndustryOptionDto[] = industries.map((i) => ({
      id: i.id,
      slug: i.slug,
      name: i.name,
      category: i.category,
      showInMegaMenu: i.showInMegaMenu,
      showInFooter: i.showInFooter,
    }));

    return {
      config,
      availableModules,
      availableIndustries,
      updatedAt: configRecord?.updatedAt,
    };
  }

  async updateNavigation(dto: UpdateNavigationDto, userId?: string): Promise<{ success: boolean }> {
    await this.prisma.navigationConfig.upsert({
      where: { id: 'singleton' },
      create: {
        id: 'singleton',
        announcement: dto.announcement as any,
        header: dto.header as any,
        megaMenu: dto.megaMenus as any,
        footer: dto.footerColumns as any,
        footerCta: dto.footerCta as any,
        bottomBar: dto.bottomBar as any,
      },
      update: {
        announcement: dto.announcement as any,
        header: dto.header as any,
        megaMenu: dto.megaMenus as any,
        footer: dto.footerColumns as any,
        footerCta: dto.footerCta as any,
        bottomBar: dto.bottomBar as any,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          action: 'NAVIGATION_CONFIG_UPDATED',
          resourceType: 'NAVIGATION',
          resourceId: 'singleton',
          actorUserId: userId,
          afterJson: {
            announcementActive: dto.announcement?.isActive,
            headerItemCount: dto.header?.items?.length,
            footerColumnCount: dto.footerColumns?.length,
          },
        },
      }).catch((e) => this.logger.warn('Failed to create audit log for navigation update', e));
    }

    return { success: true };
  }

  async resetToDefaults(userId?: string): Promise<{ success: boolean }> {
    const defaults = this.getDefaultNavigationConfig();
    await this.updateNavigation(defaults, userId);

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          action: 'NAVIGATION_CONFIG_RESET_DEFAULTS',
          resourceType: 'NAVIGATION',
          resourceId: 'singleton',
          actorUserId: userId,
        },
      }).catch((e) => this.logger.warn('Failed to create audit log for navigation reset', e));
    }

    return { success: true };
  }
}
