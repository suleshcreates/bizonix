import type {
  IndustryDetail,
  VariantMatrix as MatrixData,
} from "./industry-detail";
import { industryDetails } from "./industry-detail";
import {
  industryHeroContent,
  type IndustryHeroContent,
} from "./industry-hero-content";
import { industries as canonicalIndustries } from "./industries";

export type PublicIndustryItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  accent: "BLUE" | "TEAL" | "VIOLET";
  badge?: string | null;
  sortOrder: number;
  status: string;
  showInOverview: boolean;
  showInMegaMenu: boolean;
  showInHomepage: boolean;
  showInFooter: boolean;
  route: string;
};

export type DynamicIndustryDetail = IndustryDetail & {
  heroContent: IndustryHeroContent;
  painsIntro?: { eyebrow?: string; title?: string; lede?: string };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
};

function getApiBase(): string {
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001/api/v1"
  ).replace(/\/$/, "");
}

/**
 * Fetch all published industries from backend, with graceful fallback to canonical list.
 */
export async function getAllPublicIndustries(): Promise<PublicIndustryItem[]> {
  try {
    const res = await fetch(`${getApiBase()}/public/industries`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data: PublicIndustryItem[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch public industries from backend:", err);
  }

  // Fallback to canonical list
  return canonicalIndustries.map((item, idx) => ({
    id: `canonical-${item.id}`,
    slug: item.href.replace("/industries/", ""),
    name: item.name,
    category: "Retail Models",
    summary: item.description,
    accent: item.accent === "teal" ? "TEAL" : item.accent === "violet" ? "VIOLET" : "BLUE",
    badge: null,
    sortOrder: idx,
    status: "PUBLISHED",
    showInOverview: true,
    showInMegaMenu: true,
    showInHomepage: true,
    showInFooter: true,
    route: item.href,
  }));
}

/**
 * Resolves an industry by slug dynamically from the CMS backend,
 * with full fallback to canonical hardcoded files if backend is unavailable.
 */
export async function getDynamicIndustry(
  slug: string,
): Promise<DynamicIndustryDetail | null> {
  try {
    const res = await fetch(`${getApiBase()}/public/industries/${slug}`, {
      cache: "no-store",
    });

    if (res.status === 404) {
      return null;
    }

    if (res.ok) {
      const data = await res.json();
      const content = data.content || {};

      // Resolve hero
      const heroContent: IndustryHeroContent = content.hero ||
        industryHeroContent[slug] || {
          breadcrumbLabel: data.name,
          eyebrowLabel: data.name,
          headlineParts: [
            { text: "Operating depth for " },
            { text: data.name, accent: "blue", breakAfter: true },
            { text: "without operational compromise." },
          ],
          subheadText: data.summary,
          primaryCta: { label: "Book a demo", href: `/contact?utm_source=${data.slug}` },
          secondaryCta: { label: "Explore the platform", href: "#fits" },
          trustStats: [
            { icon: "scanBarcode", label: "Visibility at", value: "Item level" },
            { icon: "store", label: "Coverage", value: "Stores & network" },
            { icon: "layers", label: "Connected", value: "Unified ERP" },
          ],
          heroImage: {
            src: "/images/industries/overview/apparel-operations.webp",
            alt: `${data.name} operational review.`,
          },
          floatingCardTopLeft: {
            icon: "boxes",
            title: `${data.name} inventory`,
            meta: "Synchronized live position",
            status: { text: "In stock", tone: "positive" },
          },
          floatingStatsCardTopRight: [
            { icon: "boxes", label: "Active SKUs", value: 1850, trend: { direction: "up", label: "5%" } },
            { icon: "receipt", label: "Daily transactions", value: 320, trend: { direction: "up", label: "14%" } },
            { icon: "badgeCheck", label: "Audit match", value: 100, suffix: "%" },
          ],
          floatingBannerBottomRight: {
            icon: "arrowUpRight",
            title: "One record, full control",
            subtitle: "From intake to customer billing",
          },
          bgLabel: `From supply to ${data.name}`,
        };

      const pains = content.pains || [
        {
          title: "Multi-location inventory drift",
          body: "Stock splits across retail stores, warehouse hubs, and partner channels lose unified sync.",
        },
        {
          title: "Counter speed vs data precision",
          body: "High-volume sales counters demand instantaneous checkout without sacrificing GST or serial audits.",
        },
        {
          title: "Operational governance across entities",
          body: "Central management needs consolidated intelligence while preserving independent subsidiary books.",
        },
      ];

      const painsIntro = content.painsIntro || {
        eyebrow: "Where clarity breaks",
        title: `${data.name} carries more context than a stock number can hold.`,
        lede: `Key operational pressures that challenge ${data.name} retail and distribution.`,
      };

      const fit = content.fit || {
        title: "Centralize the rules and visibility. Keep operations connected.",
        body: `Bizonix delivers an integrated operating foundation designed for ${data.name}.`,
        modules: [
          { name: "Inventory", body: "Stock tracking, serial numbers, and inter-store rebalancing." },
          { name: "Sales & POS", body: "Sub-second counter transactions and automated reconciliation." },
          { name: "Accounting", body: "Direct ledger synchronization aligned with operational flows." },
        ],
      };

      const workflow = content.workflow || [
        {
          order: "01",
          title: "Inbound receipt & barcode tagging",
          body: "Verify physical shipments against digital purchase orders with automated GRN creation.",
          systems: ["Procurement", "Inventory"],
          image: "/images/industries/overview/apparel-operations.webp",
          alt: "Inbound receipt.",
        },
        {
          order: "02",
          title: "Omnichannel inventory allocation",
          body: "Route inventory packs dynamically based on store run-rates and lead times.",
          systems: ["Inventory", "Wholesale"],
          image: "/images/product/security/security-warehouse-v2.png",
          alt: "Stock allocation.",
        },
        {
          order: "03",
          title: "Counter sales & instant ledger sync",
          body: "Process bills while deducting local inventory and creating tax journal entries in real time.",
          systems: ["Sales & POS", "Accounting"],
          image: "/images/product/day-in-life/day-counter-sale.webp",
          alt: "Billing transaction.",
        },
      ];

      const proof = content.proof || {
        label: "Operational proof",
        title: "A single record gives each movement the context it needs.",
        before: "Teams relied on disconnected spreadsheets and manual phone calls across stores.",
        after: "Warehouses, retail counters, and finance share one live ledger of operating facts.",
        turningPoint: "Centralized inventory and checkout onto one integrated platform.",
        image: "/images/industries/proof/customer-story.webp",
        alt: `${data.name} operational proof.`,
      };

      const cta = content.cta || {
        title: `See ${data.name} operations as one connected system.`,
        body: "Book an executive walkthrough tailored to your stores, warehouses, and partner outlets.",
      };

      const matrix: MatrixData | undefined = content.matrix || undefined;

      const seo = content.seo || {
        metaTitle: `${data.name} ERP Software | Bizonix`,
        metaDescription: data.summary,
        ogTitle: `${data.name} — Enterprise Solutions`,
        ogDescription: data.summary,
      };

      return {
        slug: data.slug as any,
        name: data.name,
        eyebrow: data.name,
        hero: {
          title: heroContent.headlineParts.map((p) => p.text).join(""),
          body: heroContent.subheadText,
          image: heroContent.heroImage.src,
          alt: heroContent.heroImage.alt,
        },
        heroContent,
        painsIntro,
        pains,
        fit,
        workflow,
        proof,
        cta,
        matrix,
        seo,
      };
    }
  } catch (err) {
    console.warn(`Could not fetch dynamic industry ${slug} from backend:`, err);
  }

  // Fallback to static canonical definition
  const staticDetail = industryDetails[slug as keyof typeof industryDetails];
  if (!staticDetail) return null;

  return {
    ...staticDetail,
    heroContent: industryHeroContent[slug],
  };
}
