import { featureSummaries } from "@/lib/content/features/features";
import { featureById } from "@/lib/content/features/features-hero-data";
import { industryDetails } from "@/lib/content/industries/industry-detail";
import { modulePageList } from "@/lib/content/modules/module-pages";

/**
 * The route registry — one list that knows every public URL on the site.
 *
 * Metadata, the sitemap, breadcrumbs and structured data all read from here,
 * which is what makes the canonical URL, the sitemap entry and the internal
 * link destination agree by construction rather than by discipline.
 *
 * Adding a page means adding an entry (or, for the three templated families,
 * adding the content file the family is derived from). Nothing else changes.
 */

export type RouteKind =
  /** Public, canonical, in the sitemap. */
  | "indexable"
  /** Public and reachable, but deliberately kept out of the index. */
  | "noindex";

export type SeoRoute = {
  /** Path with a leading slash; `/` for the homepage. */
  path: string;
  kind: RouteKind;
  /**
   * Title without the `| Bizonix` suffix, which the root template appends.
   * Written to land in the 45–65 character band once suffixed.
   */
  title: string;
  /** Unique, 140–165 characters, describing what the page is and who for. */
  description: string;
  /** Social headline. Shorter and more declarative than the search title. */
  ogTitle: string;
  ogDescription: string;
  /** Ancestors, nearest-last. The page itself is appended automatically. */
  breadcrumb?: readonly { label: string; path: string }[];
  /**
   * How this page names itself in a breadcrumb — short, and matching the
   * visible crumb rather than the search title. "Inventory", not "Inventory
   * Management Software for Multi-Location Stock".
   */
  breadcrumbLeaf: string;
  /** Relative importance inside the site, for the sitemap only. */
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** Why this route is not indexed. Required whenever `kind` is `noindex`. */
  noindexReason?: string;
};

const HOME = { label: "Home", path: "/" } as const;
const SOLUTIONS = { label: "Solutions", path: "/modules" } as const;
const FEATURES = { label: "Features", path: "/features" } as const;
const INDUSTRIES = { label: "Industries", path: "/industries" } as const;

/* ------------------------------------------------------------ top-level */

const topLevel: readonly SeoRoute[] = [
  {
    path: "/",
    breadcrumbLeaf: "Home",
    kind: "indexable",
    title: "Bizonix ERP — Wholesale, Retail & Franchise Software",
    description:
      "Bizonix is an ERP for Indian brands running wholesale, retail and franchise together — one operating record across warehouse, stores, partners and books.",
    ogTitle: "Wholesale, retail & franchise. One operating truth.",
    ogDescription:
      "Bizonix connects every operating entity without fragmenting the business.",
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    path: "/product",
    breadcrumbLeaf: "Platform",
    kind: "indexable",
    title: "ERP Platform for Multi-Entity Retail Operations",
    description:
      "See how the Bizonix platform connects warehouse, retail, franchise, ecommerce and finance on one operating record without mixing separate operating entities.",
    ogTitle: "One platform. Every operating entity.",
    ogDescription: "The Bizonix operating model for multi-entity retail brands.",
    breadcrumb: [HOME],
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/modules",
    breadcrumbLeaf: "Solutions",
    kind: "indexable",
    title: "Nine ERP Modules for Retail, Wholesale & Franchise",
    description:
      "Inventory, procurement, sales and POS, wholesale, franchise, accounting, ecommerce, analytics and security — nine Bizonix modules working from one record.",
    ogTitle: "Solutions built for how brands actually operate",
    ogDescription: "One ERP across every operating function and entity.",
    breadcrumb: [HOME],
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/features",
    breadcrumbLeaf: "Features",
    kind: "indexable",
    title: "ERP Features: Barcode, POS Sessions & GST Capture",
    description:
      "The five cross-cutting details behind Bizonix: piece barcodes, billing counter sessions, GST capture, series pricing and stock transfer visibility.",
    ogTitle: "The small things that make the big numbers true",
    ogDescription:
      "Piece identity, counter control, tax truth, price discipline and movement visibility — the capabilities running underneath every Bizonix module.",
    breadcrumb: [HOME],
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/industries",
    breadcrumbLeaf: "Industries",
    kind: "indexable",
    title: "ERP for Apparel, Jewellery & Franchise Retail",
    description:
      "How Bizonix fits apparel and footwear, imitation jewellery and franchise networks — the stock, billing and entity pressures each retail model actually has.",
    ogTitle: "Built for the way your category actually operates",
    ogDescription:
      "Apparel, imitation jewellery and franchise networks, each with its own operating pressure.",
    breadcrumb: [HOME],
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/pricing",
    breadcrumbLeaf: "Pricing",
    kind: "noindex",
    noindexReason: "Pricing is temporarily unpublished.",
    title: "Bizonix ERP Pricing Plans for Retail & Wholesale",
    description:
      "Bizonix plans priced on operating entities and users, never on transaction volume. Compare what each plan runs across all nine modules, plus optional add-ons.",
    ogTitle: "Pay for the operation you run, not the software",
    ogDescription:
      "Three plans priced on operating entities and users, with every module compared side by side.",
    breadcrumb: [HOME],
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/about",
    breadcrumbLeaf: "About",
    kind: "indexable",
    title: "About Fibonce Tech Solutions, Makers of Bizonix",
    description:
      "Fibonce Tech Solutions builds Bizonix, an ERP for Indian brands running wholesale, retail and franchise together. Our mission, values and product principles.",
    ogTitle: "The team behind Bizonix",
    ogDescription:
      "Fibonce Tech Solutions builds operating software for Indian multi-entity retail brands.",
    breadcrumb: [HOME],
    priority: 0.7,
    changeFrequency: "yearly",
  },
  {
    path: "/contact",
    breadcrumbLeaf: "Book a demo",
    kind: "indexable",
    title: "Book a Bizonix ERP Demo for Your Operations",
    description:
      "See Bizonix ERP running on your own wholesale, retail and franchise workflows. Thirty minutes with the team, no preparation and no obligation needed.",
    ogTitle: "See Bizonix on your workflows",
    ogDescription: "Book a practical workflow demo with the Bizonix team.",
    breadcrumb: [HOME],
    priority: 0.8,
    changeFrequency: "monthly",
  },

  /* The two legal pages ship as reviewed drafts and say so in their own copy.
     Indexing a placeholder privacy policy would put language Fibonce has not
     approved into search results under the company's name, so they stay
     crawlable and linked but out of the index until legal sign-off. */
  {
    path: "/privacy",
    breadcrumbLeaf: "Privacy policy",
    kind: "noindex",
    noindexReason: "draft legal copy pending review",
    title: "Privacy Policy",
    description:
      "Draft privacy structure for the Bizonix website, covering demo-request data, cookies, sharing and retention. Pending legal review before publication.",
    ogTitle: "Privacy policy",
    ogDescription: "Draft privacy structure for the Bizonix website.",
    breadcrumb: [HOME],
    priority: 0.1,
    changeFrequency: "yearly",
  },
  {
    path: "/terms",
    breadcrumbLeaf: "Terms of use",
    kind: "noindex",
    noindexReason: "draft legal copy pending review",
    title: "Terms of Use",
    description:
      "Draft terms structure for the Bizonix website, covering website use, product information, intellectual property and liability. Pending legal review.",
    ogTitle: "Terms of use",
    ogDescription: "Draft terms structure for the Bizonix website.",
    breadcrumb: [HOME],
    priority: 0.1,
    changeFrequency: "yearly",
  },
];

/* --------------------------------------------------------------- modules */

/**
 * Search-intent titles and descriptions for the nine module pages.
 *
 * Kept beside the other route data rather than in the module content files so
 * the nine read as a set: no two compete for the same query, and each one is
 * named for the job a buyer is searching for rather than for its position in
 * the product's own menu.
 */
const moduleSearchIntent: Record<string, { title: string; description: string }> =
  {
    inventory: {
      title: "Inventory Management Software for Multi-Location Stock",
      description:
        "Piece and series level stock control across warehouses, stores and partner outlets, with barcodes issued at receiving and carried through every movement.",
    },
    procurement: {
      title: "Procurement & Purchase Order Management Software",
      description:
        "Purchases, goods receipt, purchase returns and supplier position on one trail, with intake cost and series pricing carried straight through to stock.",
    },
    "sales-pos": {
      title: "Retail POS & Billing Software with Counter Sessions",
      description:
        "Retail counter billing with barcode scanning, billing sessions, cash handover and returns — every bill moving stock and books in the same pass.",
    },
    wholesale: {
      title: "Wholesale Order & Distribution Management Software",
      description:
        "Bulk billing, fulfilment, dispatch and partner credit on one order record, drawn from the same stock the retail counter and the warehouse already read.",
    },
    franchise: {
      title: "Franchise Management Software for Retail Networks",
      description:
        "Run a franchise network as separate operating entities with shared masters, recorded stock transfers between centre and outlet, and network-level oversight.",
    },
    accounting: {
      title: "Accounting & GST Software Posted from Operations",
      description:
        "Chart of accounts, journals, ledgers, AR and AP, receipts, P&L, balance sheet and GST reports, posted from the operating documents that created them.",
    },
    ecommerce: {
      title: "Ecommerce & Online Order Management on Live Stock",
      description:
        "Catalog, CMS, storefront and online orders connected to the same product masters and stock lines the retail counter and the warehouse already use.",
    },
    analytics: {
      title: "Retail Analytics & Reporting Across Every Entity",
      description:
        "Purchase, inventory and sales views built on the operating records themselves, readable for one entity or consolidated across the whole network.",
    },
    security: {
      title: "Role-Based Access Control & Entity Scope for ERP",
      description:
        "Users, roles, permissions and entity scope shaped around real responsibilities, with actions recorded against the documents they change.",
    },
  };

const moduleRoutes: readonly SeoRoute[] = modulePageList.map((module) => {
  const intent = moduleSearchIntent[module.slug];
  if (!intent)
    throw new Error(
      `[seo] module "${module.slug}" has no search-intent entry in routes.ts`,
    );
  return {
    path: `/modules/${module.slug}`,
    kind: "indexable" as const,
    breadcrumbLeaf: module.title,
    title: intent.title,
    description: intent.description,
    ogTitle: module.seo.ogTitle,
    ogDescription: module.seo.ogDescription,
    breadcrumb: [HOME, SOLUTIONS],
    priority: 0.8,
    changeFrequency: "monthly" as const,
  };
});

/* -------------------------------------------------------------- features */

const featureSearchIntent: Record<string, { title: string; description: string }> =
  {
    barcode: {
      title: "Barcode & Piece-Level Product Identity Tracking",
      description:
        "Give every physical piece a lasting barcode identity at receiving, then follow that same piece through sale, return and transfer without losing its record.",
    },
    "billing-counters": {
      title: "Billing Counter Sessions & Cash Handover Control",
      description:
        "Every retail counter runs as a named session with its own operator, running total and close, so a shift has to balance before it can be handed over.",
    },
    "gst-compliance": {
      title: "GST Compliance Captured at Every Transaction",
      description:
        "Tax treatment is recorded on the transaction that created it rather than reconstructed at month-end, so GST reporting reads the books instead of rebuilding them.",
    },
    "series-pricing": {
      title: "Series Pricing Control for Purchase & Selling Rates",
      description:
        "One product series carries one approved set of purchase and selling rates, so pricing stays consistent across counters, partners and franchise outlets.",
    },
    "stock-transfer": {
      title: "Stock Transfer Tracking Between Warehouse & Stores",
      description:
        "Stock moving between warehouse, store and outlet stays visible in transit, with a recorded source, destination and owner at every step of the crossing.",
    },
  };

const featureRoutes: readonly SeoRoute[] = featureSummaries.map((feature) => {
  const intent = featureSearchIntent[feature.id];
  const hero = featureById[feature.id];
  if (!intent)
    throw new Error(
      `[seo] feature "${feature.id}" has no search-intent entry in routes.ts`,
    );
  return {
    path: `/features/${feature.id}`,
    kind: "indexable" as const,
    breadcrumbLeaf: feature.title,
    title: intent.title,
    description: intent.description,
    /* The social headline is the page's own H1, so a shared card and the page
       it opens make the same claim. */
    ogTitle: `${hero.headline[0]} ${hero.headline[1]}`,
    ogDescription: hero.description,
    breadcrumb: [HOME, FEATURES],
    priority: 0.7,
    changeFrequency: "monthly" as const,
  };
});

/* ------------------------------------------------------------ industries */

const industrySearchIntent: Record<string, { title: string; description: string }> =
  {
    "apparel-footwear": {
      title: "ERP for Apparel & Footwear Brands in India",
      description:
        "Size, colour and season multiply every decision. Bizonix holds apparel and footwear stock as variants you can read by location, piece by piece, across the brand.",
    },
    "imitation-jewellery": {
      title: "ERP for Imitation Jewellery Retail & Wholesale",
      description:
        "Design-heavy assortments need piece-level traceability and fast billing. Bizonix keeps barcode identity, POS and supplier movement linked on one record.",
    },
    "franchise-networks": {
      title: "ERP for Franchise Retail Networks & Outlets",
      description:
        "Give head office the visibility to plan and allocate while every outlet keeps responsibility for its own operation, books and stock as a distinct entity.",
    },
  };

const industryRoutes: readonly SeoRoute[] = Object.values(industryDetails)
  .filter((industry) => industry !== undefined)
  .map((industry) => {
    const intent = industrySearchIntent[industry.slug];
    if (!intent)
      throw new Error(
        `[seo] industry "${industry.slug}" has no search-intent entry in routes.ts`,
      );
    return {
      path: `/industries/${industry.slug}`,
      kind: "indexable" as const,
      breadcrumbLeaf: industry.name,
      title: intent.title,
      description: intent.description,
      ogTitle: industry.hero.title,
      ogDescription: industry.hero.body,
      breadcrumb: [HOME, INDUSTRIES],
      priority: 0.7,
      changeFrequency: "monthly" as const,
    };
  });

/* ---------------------------------------------------------------- registry */

export const seoRoutes: readonly SeoRoute[] = [
  ...topLevel,
  ...moduleRoutes,
  ...featureRoutes,
  ...industryRoutes,
];

const routesByPath = new Map(seoRoutes.map((route) => [route.path, route]));

/** Every path is registered at module load, with dynamic fallback for CMS modules. */
export function getRoute(path: string): SeoRoute {
  const route = routesByPath.get(path);
  if (route) return route;

  if (path.startsWith("/modules/")) {
    const slug = path.replace("/modules/", "");
    const title = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      path,
      kind: "indexable",
      breadcrumbLeaf: title,
      title: `${title} | Bizonix Enterprise Solutions`,
      description: `Bizonix ERP ${title} module for multi-entity retail, distribution and supply chain operations.`,
      ogTitle: `${title} — Enterprise Solutions`,
      ogDescription: `Explore the Bizonix ${title} module for operational excellence.`,
      breadcrumb: [HOME, SOLUTIONS],
      priority: 0.8,
      changeFrequency: "monthly",
    };
  }

  if (path.startsWith("/industries/")) {
    const slug = path.replace("/industries/", "");
    const title = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      path,
      kind: "indexable",
      breadcrumbLeaf: title,
      title: `${title} ERP Software | Bizonix`,
      description: `Bizonix vertical ERP solutions for ${title} retail, distribution and multi-entity networks.`,
      ogTitle: `${title} — Vertical ERP Solutions`,
      ogDescription: `Explore Bizonix connected operations for ${title}.`,
      breadcrumb: [HOME, INDUSTRIES],
      priority: 0.7,
      changeFrequency: "monthly",
    };
  }

  throw new Error(`[seo] no route registered for "${path}"`);
}

/** Routes eligible for the sitemap: public, canonical and indexable. */
export const indexableRoutes: readonly SeoRoute[] = seoRoutes.filter(
  (route) => route.kind === "indexable",
);

/* A duplicate path would silently shadow an entry in the lookup and quietly
   drop a URL from the sitemap, so it fails the build instead. */
if (routesByPath.size !== seoRoutes.length) {
  const seen = new Set<string>();
  const duplicates = seoRoutes
    .map((route) => route.path)
    .filter((path) => (seen.has(path) ? true : (seen.add(path), false)));
  throw new Error(`[seo] duplicate route paths: ${duplicates.join(", ")}`);
}
