import { featureSummaries } from "@/lib/content/features/features";
import { industries } from "@/lib/content/industries/industries";
import { moduleIndexItems } from "@/lib/content/modules/modules-index";

export type MegaMenuKind = "solutions" | "features" | "industries";

export type MegaMenuItem = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export type MegaMenuGroup = {
  label: string;
  items: readonly MegaMenuItem[];
};

export type MegaMenuDefinition = {
  id: MegaMenuKind;
  label: string;
  href: string;
  summary: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  footerLabel: string;
  items: readonly MegaMenuItem[];
  groups: readonly MegaMenuGroup[];
};

function selectItems(
  items: readonly MegaMenuItem[],
  ids: readonly string[],
): readonly MegaMenuItem[] {
  return ids
    .map((id) => items.find((candidate) => candidate.id === id))
    .filter((item): item is MegaMenuItem => Boolean(item));
}

/**
 * Menu-length descriptions.
 *
 * The module index carries an editorial `outcome` line for each module, and it
 * is the right length for a page and too long for a dropdown column roughly
 * 160px wide — several of them wrap to a third line, and one long row pushes
 * every row beneath it in that column out of step with the other two, so the
 * three columns stop reading as one grid.
 *
 * Every line here fits two lines at 12px in that column. The menu also clamps
 * to two lines as a backstop, but nothing should ever reach it: a truncated
 * description in a navigation menu hides the thing the reader came to read.
 */
const solutionMenuCopy: Record<string, string> = {
  inventory: "Stock, transfers and multi-location control.",
  "sales-pos": "Sell, bill and keep stock connected.",
  procurement: "Receiving, pricing and payables.",
  wholesale: "Bulk orders and distribution.",
  ecommerce: "Online store and order management.",
  analytics: "Insights across your operation.",
  franchise: "Outlet operations and oversight.",
  accounting: "Books that already know your operations.",
  security: "Access, roles and data protection.",
};

const solutionItems: readonly MegaMenuItem[] = moduleIndexItems.map((item) => ({
  id: item.slug,
  title: item.title,
  description: solutionMenuCopy[item.slug] ?? item.outcome,
  href: `/modules/${item.slug}`,
}));

/** Menu-length lines for the feature rails, on the same rule as the modules. */
const featureMenuCopy: Record<string, string> = {
  barcode: "Which one it is, not just what it is.",
  "gst-compliance": "Captured on the transaction.",
  "billing-counters": "A shift that balances before it closes.",
  "series-pricing": "One series, one approved set of rates.",
  "stock-transfer": "Stock in transit is still visible.",
};

const featureItems: readonly MegaMenuItem[] = featureSummaries.map((item) => ({
  id: item.id,
  title: item.title,
  description: featureMenuCopy[item.id] ?? item.rail,
  href: `/features/${item.id}`,
}));

const industryItems: readonly MegaMenuItem[] = industries.map((item) => ({
  id: item.id,
  title: item.name,
  description: item.description,
  href: item.href,
}));

/**
 * Desktop groups surface the fastest paths through Bizonix; the complete item
 * arrays remain available to the mobile accordion and the category index link.
 */
export const megaMenuDefinitions: Record<MegaMenuKind, MegaMenuDefinition> = {
  solutions: {
    id: "solutions",
    label: "Solutions",
    href: "/modules",
    summary: {
      eyebrow: "Built for operations",
      title: "One system for the way your business runs.",
      description:
        "Connect inventory, sales, purchasing, finance and growth across every operating entity.",
      ctaLabel: "Explore the platform",
      ctaHref: "/product",
    },
    footerLabel: "Explore all modules",
    items: solutionItems,
    /* Three columns of three: what you run day to day, what you sell through,
       and what you add as the operation gets bigger. The grouping is the whole
       argument of the menu — nine modules in one list is a directory, and the
       directory already exists at /modules. */
    groups: [
      {
        label: "Operate",
        items: selectItems(solutionItems, [
          "inventory",
          "sales-pos",
          "procurement",
        ]),
      },
      {
        label: "Grow",
        items: selectItems(solutionItems, [
          "wholesale",
          "ecommerce",
          "analytics",
        ]),
      },
      {
        label: "Scale",
        items: selectItems(solutionItems, [
          "franchise",
          "accounting",
          "security",
        ]),
      },
    ],
  },
  features: {
    id: "features",
    label: "Features",
    href: "/features",
    summary: {
      eyebrow: "Built for precision",
      title: "The controls behind reliable operations.",
      description:
        "Keep identity, counters, tax, pricing and stock movement precise from the first transaction.",
      ctaLabel: "Explore the platform",
      ctaHref: "/product",
    },
    footerLabel: "Explore all features",
    items: featureItems,
    groups: [
      {
        label: "Record",
        items: selectItems(featureItems, ["barcode", "gst-compliance"]),
      },
      {
        label: "Transact",
        items: selectItems(featureItems, [
          "billing-counters",
          "series-pricing",
        ]),
      },
      {
        label: "Move",
        items: selectItems(featureItems, ["stock-transfer"]),
      },
    ],
  },
  industries: {
    id: "industries",
    label: "Industries",
    href: "/industries",
    summary: {
      eyebrow: "Built for your model",
      title: "Control shaped around how your business operates.",
      description:
        "Connect stock, selling and responsibility without flattening the realities of each retail model.",
      ctaLabel: "Explore the platform",
      ctaHref: "/product",
    },
    footerLabel: "Explore all industries",
    items: industryItems,
    groups: [
      {
        label: "Retail models",
        items: selectItems(industryItems, ["apparel", "jewellery"]),
      },
      {
        label: "Networks",
        items: selectItems(industryItems, ["franchise"]),
      },
    ],
  },
};
