import { moduleIndexItems } from "./modules-index";

/**
 * Canonical data for the home "operating core" module showcase.
 *
 * The nine modules, their order, titles, slugs and icons are defined exactly
 * once — in `moduleIndexItems` — and projected here into the shape this
 * section consumes. Order is the approved sequence and doubles as the
 * assembly order for the scroll choreography. Do not reorder or filter.
 */
export type ShowcaseModule = {
  /** Stable key, identical to the module slug. */
  id: string;
  slug: string;
  title: string;
  /** Editorial two-digit number shown on the node ("01" … "09"). */
  number: string;
  icon: (typeof moduleIndexItems)[number]["icon"];
  /** Canonical route for this module. */
  route: string;
  /** Module accent colour (existing system hues). */
  accent: string;
  description: string;
  image: string;
  imageAlt: string;
  metric?: {
    label: string;
    value: string;
    delta?: string;
    chart: "trend" | "bars" | "people";
  };
};

const showcaseDetails = {
  inventory: {
    accent: "#2f6bff",
    description: "Piece-level stock, always current.",
    image: "/images/modules/overview/editorial/inventory-v2.webp",
    imageAlt: "A warehouse aisle filled with organised stock",
    metric: { label: "Stock accuracy", value: "99.8%", chart: "trend" },
  },
  procurement: {
    accent: "#ff9f43",
    description: "Purchases, receiving, and supplier context together.",
    image: "/images/product/security/security-warehouse-v2.png",
    imageAlt: "A warehouse team member scanning an incoming carton",
  },
  "sales-pos": {
    accent: "#2ec4b6",
    description: "Fast at the counter, accurate in the books.",
    image: "/images/modules/overview/editorial/sales-pos-v2.webp",
    imageAlt: "A modern point-of-sale counter in a retail store",
    metric: {
      label: "Today’s sales",
      value: "₹8,45,231",
      delta: "+14.2%",
      chart: "trend",
    },
  },
  wholesale: {
    accent: "#2ec4b6",
    description: "Bulk orders, credit, and fulfillment in one flow.",
    image: "/images/modules/overview/editorial/wholesale-v2.webp",
    imageAlt: "A distribution warehouse with a delivery truck",
    metric: { label: "Orders this month", value: "342", chart: "bars" },
  },
  franchise: {
    accent: "#8b5cf6",
    description: "Partner outlets, HQ-governed allocation.",
    image: "/images/modules/overview/editorial/franchise-v2.webp",
    imageAlt: "A premium retail franchise storefront",
    metric: { label: "Network view", value: "Sample", chart: "people" },
  },
  accounting: {
    accent: "#f4b400",
    description: "GST-ready books that follow every movement.",
    image: "/images/modules/overview/editorial/accounting-v2.webp",
    imageAlt: "Accounting reports and a calculator on a desk",
    metric: {
      label: "Net profit",
      value: "₹2,45,788",
      delta: "+8.7%",
      chart: "trend",
    },
  },
  ecommerce: {
    accent: "#ec4899",
    description:
      "Catalog, orders, and storefront connected to inventory truth.",
    image: "/images/product/day-in-life/day-counter-sale.webp",
    imageAlt: "A retail team processing an omnichannel customer order",
  },
  analytics: {
    accent: "#2f6bff",
    description: "One view on sales, stock, and margin across entities.",
    image: "/images/modules/overview/editorial/analytics-v2.webp",
    imageAlt: "An analytics dashboard displayed on a laptop",
    metric: { label: "Margin view", value: "Sample", chart: "trend" },
  },
  security: {
    accent: "#64748b",
    description: "Roles, permissions, and entity-aware control.",
    image: "/images/product/pillars/pillar-network.jpg",
    imageAlt: "A secure enterprise operations and data centre",
  },
} as const satisfies Record<
  string,
  Pick<ShowcaseModule, "accent" | "description" | "image" | "imageAlt"> & {
    metric?: ShowcaseModule["metric"];
  }
>;

export const showcaseModules: readonly ShowcaseModule[] = moduleIndexItems.map(
  (item, index) => ({
    id: item.slug,
    slug: item.slug,
    title: item.title,
    number: String(index + 1).padStart(2, "0"),
    icon: item.icon,
    route: `/modules/${item.slug}`,
    ...showcaseDetails[item.slug as keyof typeof showcaseDetails],
  }),
);

/** The single CTA destination for the section. */
export const exploreAllModulesRoute = "/modules";
