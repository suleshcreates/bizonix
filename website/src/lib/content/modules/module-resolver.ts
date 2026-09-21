import {
  Boxes,
  Truck,
  ScanBarcode,
  Building2,
  Store,
  Calculator,
  ShoppingBag,
  BarChart3,
  ShieldCheck,
  Layers,
  GitMerge,
  Database,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type {
  ModuleData,
  ModuleTheme,
  ModuleHeroData,
  ProblemSectionData,
  OutcomesSectionData,
  ModuleCapabilities,
  ModuleWorkflowData,
  ModuleGallery,
  VerticalRelevance,
} from "./module-pages/types";
import { getModulePage } from "./module-pages";
import { moduleIndexItems } from "./modules-index";

export const THEME_PALETTE: Record<string, ModuleTheme> = {
  BLUE: {
    accent: "#2f6bff",
    accentDark: "#1748c7",
    accentSoft: "rgba(47, 107, 255, 0.08)",
  },
  CYAN: {
    accent: "#22b8cf",
    accentDark: "#087f8c",
    accentSoft: "rgba(34, 184, 207, 0.08)",
  },
  ORANGE: {
    accent: "#ff9f43",
    accentDark: "#c66a00",
    accentSoft: "rgba(255, 159, 67, 0.08)",
  },
  CORAL: {
    accent: "#ff6b6b",
    accentDark: "#c53d3d",
    accentSoft: "rgba(255, 107, 107, 0.08)",
  },
  EMERALD: {
    accent: "#2d9d78",
    accentDark: "#216e56",
    accentSoft: "rgba(45, 157, 120, 0.08)",
  },
  PURPLE: {
    accent: "#8b5cf6",
    accentDark: "#6437c8",
    accentSoft: "rgba(139, 92, 246, 0.08)",
  },
  PINK: {
    accent: "#ec4899",
    accentDark: "#b42e72",
    accentSoft: "rgba(236, 72, 153, 0.08)",
  },
  INDIGO: {
    accent: "#6366f1",
    accentDark: "#4144bd",
    accentSoft: "rgba(99, 102, 241, 0.08)",
  },
  SLATE: {
    accent: "#64748b",
    accentDark: "#405065",
    accentSoft: "rgba(100, 116, 139, 0.08)",
  },
};

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  BOXES: Boxes,
  TRUCK: Truck,
  SCAN_BARCODE: ScanBarcode,
  BUILDING: Building2,
  STORE: Store,
  CALCULATOR: Calculator,
  SHOPPING_BAG: ShoppingBag,
  BAR_CHART: BarChart3,
  SHIELD_CHECK: ShieldCheck,
  LAYERS: Layers,
  WORKFLOW: GitMerge,
  DATABASE: Database,
  ZAP: Zap,
};

export function resolveModuleTheme(themeKey?: string): ModuleTheme {
  if (themeKey && THEME_PALETTE[themeKey.toUpperCase()]) {
    return THEME_PALETTE[themeKey.toUpperCase()];
  }
  return THEME_PALETTE.BLUE;
}

export function resolveModuleIcon(iconKey?: string): LucideIcon {
  if (iconKey && ICON_REGISTRY[iconKey.toUpperCase()]) {
    return ICON_REGISTRY[iconKey.toUpperCase()];
  }
  return Boxes;
}

function getApiBase(): string {
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001/api/v1"
  ).replace(/\/$/, "");
}

export interface PublicModuleListItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  outcome: string;
  themeKey: string;
  iconKey: string;
  badge?: string | null;
  sortOrder: number;
  showInCatalog: boolean;
  showInMegaMenu: boolean;
  showInHomepage: boolean;
  showInFooter: boolean;
  route: string;
}

/**
 * Fetch all published modules from API, falling back to static catalog.
 */
export async function getAllPublicModules(): Promise<PublicModuleListItem[]> {
  try {
    const res = await fetch(`${getApiBase()}/public/modules`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data: PublicModuleListItem[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch public modules from API, falling back to static:", err);
  }

  return moduleIndexItems.map((item, idx) => ({
    id: item.slug,
    slug: item.slug,
    title: item.title,
    category: "Core Operations",
    summary: item.summary,
    outcome: item.outcome,
    themeKey: "BLUE",
    iconKey: "BOXES",
    badge: null,
    sortOrder: idx + 1,
    showInCatalog: true,
    showInMegaMenu: true,
    showInHomepage: true,
    showInFooter: true,
    route: `/modules/${item.slug}`,
  }));
}

/**
 * Fetch a published module by slug from API with static fallback.
 * Strictly returns null if unpublished or 404.
 */
export async function getDynamicModule(slug: string): Promise<ModuleData | null> {
  try {
    const res = await fetch(`${getApiBase()}/public/modules/${slug}`, {
      cache: "no-store",
    });

    if (res.status === 404) {
      return null;
    }

    if (res.ok) {
      const data = await res.json();
      const content = data.content || {};

      const theme = resolveModuleTheme(data.themeKey);
      const icon = resolveModuleIcon(data.iconKey);

      // Construct standard hero if content.hero is sparse
      const hero: ModuleHeroData = {
        eyebrow: content.hero?.eyebrow || data.category || "Enterprise Solution",
        headline: content.hero?.headline || `${data.title} for Multi-Entity Operations`,
        headlineAccent: content.hero?.headlineAccent || "Operations",
        body: content.hero?.body || data.summary || "",
        primaryCta: content.hero?.primaryCta || { label: "Request Walkthrough", href: "/contact" },
        secondaryCta: content.hero?.secondaryCta,
        visualVariant: content.hero?.visualVariant || "inventory",
        chain: content.hero?.chain || [
          { id: "c1", label: "Signal", detail: "Real-time event capture" },
          { id: "c2", label: "Ledger", detail: "Central posted state" },
          { id: "c3", label: "Execution", detail: "Automated distribution" },
        ],
        facts: content.hero?.facts || [
          { label: "Operation", value: "Real-time" },
          { label: "Audit State", value: "Verified" },
          { label: "Latency", value: "<120ms" },
        ],
        screen: content.hero?.screen,
      };

      // Construct problem section
      const problemSection: ProblemSectionData = {
        presentation: content.problemSection?.presentation || "visual-stories",
        eyebrow: content.problemSection?.eyebrow || `Before ${data.title}`,
        title: content.problemSection?.title || "Where conventional disconnected systems break down.",
        intro: content.problemSection?.intro || "When operations rely on manual relays, information drifts and margins suffer.",
        problems: content.problemSection?.problems || [
          {
            id: "p1",
            number: "01",
            title: "Data Disconnect",
            description: "Disparate systems fail to maintain a single source of truth across locations.",
            quote: "We waste hours reconciling data between departments.",
            visual: "count-mismatch",
          },
          {
            id: "p2",
            number: "02",
            title: "Latency & Blind Spots",
            description: "Operational delays prevent timely inventory decisions and fulfillment tracking.",
            quote: "We only discover stock discrepancies after orders fail.",
            visual: "location-mismatch",
          },
          {
            id: "p3",
            number: "03",
            title: "Permission Drift",
            description: "Without entity boundaries, audit trails break down across franchise and branch tiers.",
            quote: "Unattributed changes make accountability nearly impossible.",
            visual: "identity-loss",
          },
        ],
        consequence: content.problemSection?.consequence || {
          title: "The compounding friction across your enterprise",
          items: [
            { id: "cq1", label: "Revenue Leakage", body: "Unaccounted stock adjustments eat directly into net margin." },
            { id: "cq2", label: "Fulfillment Delays", body: "Misaligned inventory causes orders to stall during dispatch." },
            { id: "cq3", label: "Audit Vulnerability", body: "Fragmented logs leave operations exposed during compliance checks." },
          ],
        },
      };

      // Construct outcomes section
      const outcomesSection: OutcomesSectionData = {
        eyebrow: content.outcomesSection?.eyebrow || "Measurable Transformation",
        title: content.outcomesSection?.title || "Operational certainty built into every workflow",
        highlight: content.outcomesSection?.highlight || "every workflow",
        intro: content.outcomesSection?.intro || "Bizonix replaces batch reconciliations with continuous state enforcement.",
        outcomes: content.outcomesSection?.outcomes || [
          {
            id: "o1",
            number: "01",
            visualVariant: "document-posted",
            accent: theme.accent,
            title: "Real-Time Ledger Settlement",
            description: "Every movement is immediately reflected across stock balances, GL accounts, and tax reporting.",
          },
          {
            id: "o2",
            number: "02",
            visualVariant: "entity-consolidation",
            accent: theme.accentDark,
            title: "Autonomous Entity Boundaries",
            description: "Strict isolation ensures franchise partners and company outlets operate with guaranteed data integrity.",
          },
        ],
      };

      // Construct capabilities
      const capabilities: ModuleCapabilities = {
        groups: content.capabilities?.groups || [
          {
            id: "cg1",
            title: "Core Execution",
            context: "Essential operational controls for daily business workflows",
            items: ["Unified Records", "Automated Validation", "Real-Time Sync", "Role-Based Access"],
          },
          {
            id: "cg2",
            title: "Enterprise Governance",
            context: "Compliance, multi-entity isolation, and audit readiness",
            items: ["Immutable Audit Logs", "Entity Scoping", "Policy Enforcement", "Automated Reconciliations"],
          },
        ],
        limitations: content.capabilities?.limitations,
      };

      // Construct workflow
      const workflow: ModuleWorkflowData = {
        title: content.workflow?.title || "How the operational chain functions end to end",
        intro: content.workflow?.intro || "From initial transaction creation to final ledger settlement.",
        steps: content.workflow?.steps || [
          { id: "w1", index: "01", title: "Transaction Initiate", body: "Staff scan or enter order details with instant validation.", record: "Draft Entry" },
          { id: "w2", index: "02", title: "Policy Verification", body: "Entity boundaries and credit terms verify automatically.", record: "Approved Order" },
          { id: "w3", index: "03", title: "Stock Allocation", body: "Inventory locks in real time across the distribution network.", record: "Allocated Item" },
          { id: "w4", index: "04", title: "Ledger Settlement", body: "Financial and operational records update simultaneously.", record: "Settled Ledger" },
        ],
      };

      // Construct gallery
      const gallery: ModuleGallery = {
        variant: content.gallery?.variant || "featured-plus-grid",
        title: content.gallery?.title || `${data.title} Interface & Workflows`,
        intro: content.gallery?.intro || "High-density enterprise interfaces engineered for maximum operator productivity.",
        shots: (content.gallery?.shots && content.gallery.shots.length > 0)
          ? content.gallery.shots.map((shot: any, sIdx: number) => ({
              id: shot.id || `shot-${sIdx + 1}`,
              title: shot.title || `Screenshot ${sIdx + 1}`,
              description: shot.description || "",
              order: typeof shot.order === "number" ? shot.order : sIdx + 1,
              context: shot.context || "Operations Overview",
              featured: Boolean(shot.featured),
              state: shot.src ? "captured" : (shot.state || "pending"),
              src: shot.src || undefined,
              alt: shot.alt || shot.title || `Screenshot ${sIdx + 1}`,
              screen: shot.screen || undefined,
            }))
          : [
              {
                id: "s1",
                title: "Unified Command Center",
                description: "Complete visibility into active transactions and pending approvals.",
                order: 1,
                context: "Operations Overview",
                featured: true,
                state: "pending",
              },
              {
                id: "s2",
                title: "Detailed Ledger Inspection",
                description: "Audit every row, timestamp, and operator action with one click.",
                order: 2,
                context: "Audit Trail",
                state: "pending",
              },
            ],
      };

      // Construct vertical relevance
      const verticalRelevance: VerticalRelevance = {
        apparel: content.verticalRelevance?.apparel || "Matrix sizing, color variants, and seasonal transfer cycles handled natively.",
        jewellery: content.verticalRelevance?.jewellery || "Piece-by-piece certification tracking, metal purity adjustments, and vault custody.",
        franchise: content.verticalRelevance?.franchise || "Strict multi-entity tenant scoping with consolidated parent reporting.",
      };

      // Construct FAQs (from DB table relations or fallback to content.faq)
      const faqs = (data.faqs && data.faqs.length > 0)
        ? data.faqs.map((f: any) => ({ id: f.id, question: f.question, answer: f.answer }))
        : (content.faq || []);

      const relatedModules = content.relatedModules || ["inventory", "sales-pos", "accounting"];

      const seo = content.seo || {
        title: `${data.title} | Bizonix Enterprise Solutions`,
        description: data.summary,
        ogTitle: `${data.title} | Bizonix`,
        ogDescription: data.outcome || data.summary,
      };

      return {
        slug: data.slug,
        title: data.title,
        eyebrow: hero.eyebrow,
        outcome: data.outcome,
        intro: data.summary,
        icon,
        theme,
        hero,
        problemSection,
        outcomesSection,
        capabilities,
        workflow,
        gallery,
        verticalRelevance,
        proof: content.proof || undefined,
        video: content.video || undefined,
        faq: faqs,
        relatedModules,
        seo,
      };
    }
  } catch (err) {
    console.warn(`Could not fetch dynamic module ${slug} from backend:`, err);
  }

  const staticModule = getModulePage(slug);
  return staticModule || null;
}
