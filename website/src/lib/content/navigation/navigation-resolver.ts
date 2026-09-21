import {
  megaMenuDefinitions,
  type MegaMenuDefinition,
} from "@/components/layout/mega-menu-data";
import { featureLinks, industryLinks, primaryNav, siteConfig } from "@/lib/site-config";

export interface AnnouncementBarData {
  isActive: boolean;
  badge?: string;
  text: string;
  linkText?: string;
  linkHref?: string;
  theme: 'blue' | 'navy' | 'dark' | 'amber' | 'emerald';
  isDismissible?: boolean;
}

export interface HeaderNavItem {
  id: string;
  label: string;
  href: string;
  type: 'link' | 'mega-menu';
  menu?: string;
  badge?: string;
  isExternal?: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface HeaderActionData {
  isEnabled: boolean;
  label: string;
  href: string;
}

export interface HeaderConfigData {
  items: HeaderNavItem[];
  action: HeaderActionData;
}

export interface FooterLinkItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
  isActive: boolean;
  isExternal?: boolean;
}

export interface FooterColumnData {
  id: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
  links: FooterLinkItem[];
}

export interface FooterCtaData {
  isEnabled: boolean;
  eyebrow: string;
  title: string;
  lede: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export interface BottomBarData {
  copyrightNotice: string;
  tagline: string;
  links: FooterLinkItem[];
}

export interface PublicNavigationData {
  announcement: AnnouncementBarData;
  header: HeaderConfigData;
  megaMenus: Record<string, MegaMenuDefinition>;
  footerColumns: FooterColumnData[];
  footerCta: FooterCtaData;
  bottomBar: BottomBarData;
}

function getApiBase(): string {
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001/api/v1"
  ).replace(/\/$/, "");
}

export function getDefaultNavigationData(): PublicNavigationData {
  return {
    announcement: {
      isActive: false,
      badge: "NEW",
      text: "Bizonix 3.0 launched — multi-entity retail & franchise operations unified.",
      linkText: "Explore platform",
      linkHref: "/product",
      theme: "blue",
      isDismissible: true,
    },
    header: {
      items: primaryNav.map((item, idx) => ({
        id: `nav-${idx}`,
        label: item.label,
        href: item.href,
        type: "menu" in item ? "mega-menu" : "link",
        menu: "menu" in item ? item.menu : undefined,
        isActive: true,
        sortOrder: idx + 1,
      })),
      action: {
        isEnabled: true,
        label: "Book a demo",
        href: "/contact",
      },
    },
    megaMenus: megaMenuDefinitions,
    footerColumns: [
      {
        id: "col-platform",
        title: "Platform",
        sortOrder: 1,
        isActive: true,
        links: [
          { id: "f-how", label: "How it works", href: "/product", isActive: true },
          { id: "f-modules", label: "All solutions", href: "/modules", isActive: true },
          { id: "f-about", label: "About Bizonix", href: "/about", isActive: true },
        ],
      },
      {
        id: "col-features",
        title: "Features",
        sortOrder: 2,
        isActive: true,
        links: featureLinks.map((f) => ({
          id: f.href,
          label: f.label,
          href: f.href,
          isActive: true,
        })),
      },
      {
        id: "col-industries",
        title: "Industries",
        sortOrder: 3,
        isActive: true,
        links: industryLinks.map((i) => ({
          id: i.href,
          label: i.label,
          href: i.href,
          isActive: true,
        })),
      },
      {
        id: "col-company",
        title: "Company",
        sortOrder: 4,
        isActive: true,
        links: [
          { id: "f-about", label: "About", href: "/about", isActive: true },
          { id: "f-contact", label: "Contact", href: "/contact", isActive: true },
          { id: "f-resources", label: "Resources", href: "/resources", isActive: true },
        ],
      },
    ],
    footerCta: {
      isEnabled: true,
      eyebrow: "One platform, every entity",
      title: "Ready to run your brand on one operating truth?",
      lede: "Thirty minutes, your numbers, no obligation. We will walk your warehouse, stores and partners through a single record.",
      primaryLabel: "Book a free consultation",
      primaryHref: "/contact?utm_source=footer-cta",
      secondaryLabel: "See the platform",
      secondaryHref: "/product",
    },
    bottomBar: {
      copyrightNotice: `${siteConfig.company} All rights reserved.`,
      tagline: "Built in India for multi-entity retail operators.",
      links: [
        { id: "b-privacy", label: "Privacy", href: "/privacy", isActive: true },
        { id: "b-terms", label: "Terms", href: "/terms", isActive: true },
      ],
    },
  };
}

export async function getPublicNavigation(): Promise<PublicNavigationData> {
  const defaults = getDefaultNavigationData();

  try {
    const res = await fetch(`${getApiBase()}/public/navigation`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.header) {
        // Convert megaMenus array to lookup map
        const menusMap: Record<string, MegaMenuDefinition> = { ...megaMenuDefinitions };
        if (Array.isArray(data.megaMenus)) {
          for (const m of data.megaMenus) {
            menusMap[m.id] = m;
          }
        }

        return {
          announcement: data.announcement || defaults.announcement,
          header: data.header || defaults.header,
          megaMenus: menusMap,
          footerColumns: Array.isArray(data.footerColumns) && data.footerColumns.length > 0
            ? data.footerColumns
            : defaults.footerColumns,
          footerCta: data.footerCta || defaults.footerCta,
          bottomBar: data.bottomBar || defaults.bottomBar,
        };
      }
    }
  } catch (error) {
    console.warn("Could not fetch navigation from API, falling back to defaults:", error);
  }

  return defaults;
}
