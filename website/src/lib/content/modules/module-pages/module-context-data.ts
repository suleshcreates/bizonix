import type { ModuleSlug, VerticalRelevance } from "./types";

export type ModuleContextKey = keyof VerticalRelevance;

export type ModuleContextItem = {
  key: ModuleContextKey;
  title: string;
  microLabel: string;
  indicatorLabel: string;
  indicatorValue: string;
};

export type ModuleContextData = {
  heading: string;
  headingAccent: string;
  intro: string;
  contexts: readonly [ModuleContextItem, ModuleContextItem, ModuleContextItem];
  statement: string;
};

export const moduleContextData = {
  inventory: {
    heading: "Inventory across every location.",
    headingAccent: "every location.",
    intro:
      "The same stock record stays precise across variant-heavy ranges, high-count catalogues and distributed outlet networks.",
    contexts: [
      {
        key: "apparel",
        title: "Variant stock",
        microLabel: "Apparel",
        indicatorLabel: "Record level",
        indicatorValue: "Size + colour",
      },
      {
        key: "jewellery",
        title: "Piece identity",
        microLabel: "Jewellery",
        indicatorLabel: "Record level",
        indicatorValue: "Individual piece",
      },
      {
        key: "franchise",
        title: "Network stock",
        microLabel: "Franchise",
        indicatorLabel: "Record level",
        indicatorValue: "Named outlet",
      },
    ],
    statement: "One inventory record. Every location.",
  },
  procurement: {
    heading: "Buying follows real demand.",
    headingAccent: "real demand.",
    intro:
      "Procurement keeps each intake, supplier reference and carried cost readable across the businesses that depend on them.",
    contexts: [
      {
        key: "apparel",
        title: "Seasonal intake",
        microLabel: "Apparel",
        indicatorLabel: "Operating view",
        indicatorValue: "By consignment",
      },
      {
        key: "jewellery",
        title: "Supplier designs",
        microLabel: "Jewellery",
        indicatorLabel: "Operating view",
        indicatorValue: "Intake-linked",
      },
      {
        key: "franchise",
        title: "Central buying",
        microLabel: "Franchise",
        indicatorLabel: "Operating view",
        indicatorValue: "Cost carried",
      },
    ],
    statement: "One buying trail. Every intake accounted for.",
  },
  "sales-pos": {
    heading: "Every sale updates the operation.",
    headingAccent: "the operation.",
    intro:
      "Counter activity stays attached to the piece, session and outlet behind it, even when the selling context changes.",
    contexts: [
      {
        key: "apparel",
        title: "Size exchanges",
        microLabel: "Apparel",
        indicatorLabel: "Operating view",
        indicatorValue: "Bill-linked",
      },
      {
        key: "jewellery",
        title: "Scanned pieces",
        microLabel: "Jewellery",
        indicatorLabel: "Operating view",
        indicatorValue: "Piece-specific",
      },
      {
        key: "franchise",
        title: "Outlet counters",
        microLabel: "Franchise",
        indicatorLabel: "Operating view",
        indicatorValue: "Shared record",
      },
    ],
    statement: "One sale record. Every counter connected.",
  },
  wholesale: {
    heading: "Wholesale in three operating contexts.",
    headingAccent: "operating contexts.",
    intro:
      "The same wholesale engine adapts to different business realities, from brands and manufacturers to franchise networks.",
    contexts: [
      {
        key: "apparel",
        title: "Bulk goods",
        microLabel: "Brand / manufacturer",
        indicatorLabel: "Operating view",
        indicatorValue: "Size ratios",
      },
      {
        key: "jewellery",
        title: "Assorted designs",
        microLabel: "Distribution",
        indicatorLabel: "Operating view",
        indicatorValue: "Design-level",
      },
      {
        key: "franchise",
        title: "Partner outlets",
        microLabel: "Franchise network",
        indicatorLabel: "Operating view",
        indicatorValue: "Outlet-ready",
      },
    ],
    statement: "One wholesale engine. Multiple realities.",
  },
  franchise: {
    heading: "One network, every outlet visible.",
    headingAccent: "every outlet visible.",
    intro:
      "Franchise operations keep allocation, piece identity and outlet autonomy visible inside one governed network.",
    contexts: [
      {
        key: "apparel",
        title: "Variant allocation",
        microLabel: "Apparel",
        indicatorLabel: "Operating view",
        indicatorValue: "Outlet demand",
      },
      {
        key: "jewellery",
        title: "Shared identity",
        microLabel: "Jewellery",
        indicatorLabel: "Operating view",
        indicatorValue: "Piece-traced",
      },
      {
        key: "franchise",
        title: "Network control",
        microLabel: "Franchise",
        indicatorLabel: "Operating view",
        indicatorValue: "Entity-scoped",
      },
    ],
    statement: "One network model. Every outlet distinct.",
  },
  accounting: {
    heading: "Books follow the work.",
    headingAccent: "the work.",
    intro:
      "Accounting stays connected to the document, piece and entity that created each financial movement.",
    contexts: [
      {
        key: "apparel",
        title: "Margin movement",
        microLabel: "Apparel",
        indicatorLabel: "Accounting view",
        indicatorValue: "Document-linked",
      },
      {
        key: "jewellery",
        title: "Piece to ledger",
        microLabel: "Jewellery",
        indicatorLabel: "Accounting view",
        indicatorValue: "Piece-linked",
      },
      {
        key: "franchise",
        title: "Entity books",
        microLabel: "Franchise",
        indicatorLabel: "Accounting view",
        indicatorValue: "Group-readable",
      },
    ],
    statement: "One operating trail. Books that follow it.",
  },
  ecommerce: {
    heading: "Online orders stay connected.",
    headingAccent: "stay connected.",
    intro:
      "The storefront stays tied to variant availability, product identity and the operating network underneath it.",
    contexts: [
      {
        key: "apparel",
        title: "Variant listings",
        microLabel: "Apparel",
        indicatorLabel: "Commerce view",
        indicatorValue: "Variant-aware",
      },
      {
        key: "jewellery",
        title: "Deep catalogues",
        microLabel: "Jewellery",
        indicatorLabel: "Commerce view",
        indicatorValue: "Design-linked",
      },
      {
        key: "franchise",
        title: "Central storefront",
        microLabel: "Franchise",
        indicatorLabel: "Commerce view",
        indicatorValue: "Network-backed",
      },
    ],
    statement: "One commerce layer. Every order connected.",
  },
  analytics: {
    heading: "One view across the operation.",
    headingAccent: "the operation.",
    intro:
      "Analytics reads the detail already held in each record, from a single variant to the whole outlet network.",
    contexts: [
      {
        key: "apparel",
        title: "Variant sell-through",
        microLabel: "Apparel",
        indicatorLabel: "Analysis level",
        indicatorValue: "Size + colour",
      },
      {
        key: "jewellery",
        title: "Design movement",
        microLabel: "Jewellery",
        indicatorLabel: "Analysis level",
        indicatorValue: "Entry-level",
      },
      {
        key: "franchise",
        title: "Network view",
        microLabel: "Franchise",
        indicatorLabel: "Analysis level",
        indicatorValue: "Outlet to group",
      },
    ],
    statement: "One analytical view. Every operating level.",
  },
  security: {
    heading: "Every action leaves a trace.",
    headingAccent: "leaves a trace.",
    intro:
      "Security applies responsibility, authority and entity boundaries to the real operating context of each user.",
    contexts: [
      {
        key: "apparel",
        title: "Store roles",
        microLabel: "Apparel",
        indicatorLabel: "Control level",
        indicatorValue: "Role-defined",
      },
      {
        key: "jewellery",
        title: "High-value control",
        microLabel: "Jewellery",
        indicatorLabel: "Control level",
        indicatorValue: "Right-restricted",
      },
      {
        key: "franchise",
        title: "Entity boundaries",
        microLabel: "Franchise",
        indicatorLabel: "Control level",
        indicatorValue: "Entity-scoped",
      },
    ],
    statement: "One security model. Every action attributable.",
  },
} satisfies Record<ModuleSlug, ModuleContextData>;
