import {
  BarChart3,
  Boxes,
  Building2,
  Calculator,
  ScanBarcode,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  type LucideIcon,
} from "lucide-react";

export const moduleFilters = [
  { id: "all", label: "All" },
  { id: "inventory", label: "Inventory" },
  { id: "sales", label: "Sales" },
  { id: "network", label: "Network" },
  { id: "finance", label: "Finance" },
  { id: "commerce", label: "Commerce" },
] as const;

export type ModuleFilter = (typeof moduleFilters)[number]["id"];

/**
 * Each business function carries its own hue so the filter rail, the result
 * meter and the deck all read as one colour system rather than three.
 */
export const moduleFilterAccents: Record<ModuleFilter, string> = {
  all: "#2f6bff",
  inventory: "#22b8cf",
  sales: "#ff6b6b",
  network: "#2d9d78",
  finance: "#8b5cf6",
  commerce: "#ec4899",
};

export type ModuleIndexItem = {
  slug: string;
  title: string;
  summary: string;
  /** One-line operating result, used as the caption under the card visual. */
  outcome: string;
  capabilities: readonly string[];
  filters: readonly Exclude<ModuleFilter, "all">[];
  accent: string;
  accentDark: string;
  icon: LucideIcon;
};

export const moduleIndexItems: readonly ModuleIndexItem[] = [
  {
    slug: "inventory",
    title: "Inventory",
    summary:
      "Real-time stock visibility across locations, with control at piece and series level.",
    outcome: "Piece-level truth, live across every location.",
    capabilities: [
      "Stock overview",
      "Series / piece barcodes",
      "Transfers",
      "Audit",
      "Damage & adjustment",
      "Low-stock alerts",
    ],
    filters: ["inventory"],
    accent: "#22b8cf",
    accentDark: "#087f8c",
    icon: Boxes,
  },
  {
    slug: "procurement",
    title: "Procurement",
    summary:
      "From purchase order to payment, with receiving and supplier context kept together.",
    outcome: "Receiving, pricing and payables on one trail.",
    capabilities: [
      "Direct purchases",
      "GRN / receiving",
      "Purchase returns",
      "Supplier ledger",
      "Series pricing",
    ],
    filters: ["inventory", "finance"],
    accent: "#ff9f43",
    accentDark: "#c66a00",
    icon: Truck,
  },
  {
    slug: "sales-pos",
    title: "Sales & POS",
    summary:
      "Retail, wholesale and counter billing on the same stock and accounting foundation.",
    outcome: "Every bill posts itself to stock and to books.",
    capabilities: [
      "Retail POS",
      "Billing sessions",
      "Cash handover",
      "Returns",
      "Payment status",
    ],
    filters: ["sales", "commerce"],
    accent: "#ff6b6b",
    accentDark: "#c53d3d",
    icon: ScanBarcode,
  },
  {
    slug: "wholesale",
    title: "Wholesale",
    summary:
      "Bulk orders, fulfilment, dispatch and partner credit without side systems.",
    outcome: "Bulk orders that dispatch without a spreadsheet.",
    capabilities: [
      "Wholesale billing",
      "Fulfilment / cartons",
      "Dispatch",
      "Credit management",
      "Partner context",
    ],
    filters: ["sales", "commerce", "network"],
    accent: "#2d9d78",
    accentDark: "#216e56",
    icon: Building2,
  },
  {
    slug: "franchise",
    title: "Franchise",
    summary:
      "Network control without micromanagement—partner autonomy with central oversight.",
    outcome: "Autonomy at the outlet, oversight at the centre.",
    capabilities: [
      "Franchise list",
      "Stock transfer",
      "Subscriptions / plans",
      "Outlet dashboard",
      "Entity boundaries",
    ],
    filters: ["network", "sales"],
    accent: "#2f6bff",
    accentDark: "#1748c7",
    icon: Store,
  },
  {
    slug: "accounting",
    title: "Accounting",
    summary:
      "Books that retain operating context, with multi-entity control and GST-ready reporting.",
    outcome: "Books that already know what operations did.",
    capabilities: [
      "Chart of accounts",
      "Journals & ledgers",
      "AR / AP",
      "P&L & balance sheet",
      "GST reports",
    ],
    filters: ["finance"],
    accent: "#8b5cf6",
    accentDark: "#6437c8",
    icon: Calculator,
  },
  {
    slug: "ecommerce",
    title: "Ecommerce",
    summary:
      "Catalog, storefront and order flow connected to the same inventory truth.",
    outcome: "One catalogue, one stock number, everywhere.",
    capabilities: [
      "Catalog sync",
      "Orders",
      "CMS",
      "Storefront",
      "Stock availability",
    ],
    filters: ["commerce", "sales"],
    accent: "#ec4899",
    accentDark: "#b42e72",
    icon: ShoppingBag,
  },
  {
    slug: "analytics",
    title: "Analytics",
    summary:
      "Real-time dashboards across purchase, inventory, sales and every operating entity.",
    outcome: "The whole network on one screen, in real time.",
    capabilities: [
      "Dashboards",
      "Purchase analytics",
      "Inventory analytics",
      "Sales analytics",
      "Consolidated views",
    ],
    filters: ["finance", "sales", "network"],
    accent: "#6366f1",
    accentDark: "#4144bd",
    icon: BarChart3,
  },
  {
    slug: "security",
    title: "Security",
    summary:
      "Users, roles, permissions and entity scope shaped around real responsibilities.",
    outcome: "People see exactly the entity they run.",
    capabilities: [
      "Users & roles",
      "Permissions",
      "Entity scope",
      "Audit trail",
      "Approval boundaries",
    ],
    filters: ["network"],
    accent: "#64748b",
    accentDark: "#405065",
    icon: ShieldCheck,
  },
] as const;

/**
 * Hero constellation geometry.
 *
 * All nine SRS modules are placed — there is no slice. Angles run at 40°
 * increments from the top so every module gets a real slot rather than being
 * squeezed in, and `ring` interleaves them across three orbital bands so
 * neighbouring cards never collide at the same radius.
 *
 * `tier` drives visual weight only (opacity/scale), independent of geometry:
 * core operations read strongest, extended functions lightest.
 */
export type ConstellationTier = "primary" | "secondary" | "supporting";

/** Radius multipliers for the three rings, inner → outer. */
export const ringScales = [0.84, 0.98, 1.06] as const;

/** Base ellipse inside the 1000 × 940 constellation viewBox. */
export const constellationGeometry = {
  viewBox: { width: 1000, height: 940 },
  center: { x: 500, y: 470 },
  radius: { x: 360, y: 336 },
  coreRadius: 140,
} as const;

const tierBySlug: Record<string, ConstellationTier> = {
  inventory: "primary",
  "sales-pos": "primary",
  accounting: "primary",
  procurement: "secondary",
  wholesale: "secondary",
  franchise: "secondary",
  ecommerce: "supporting",
  analytics: "supporting",
  security: "supporting",
};

/** Compass order from the top, matching the SRS module sequence. */
const angleBySlug: Record<string, number> = {
  inventory: -90,
  procurement: -50,
  "sales-pos": -10,
  wholesale: 30,
  franchise: 70,
  security: 110,
  accounting: 150,
  ecommerce: 190,
  analytics: 230,
};

export type ConstellationNode = ModuleIndexItem & {
  angle: number;
  ring: 0 | 1 | 2;
  tier: ConstellationTier;
  /** Position as a percentage of the constellation box. */
  left: number;
  top: number;
};

export const constellationNodes: readonly ConstellationNode[] =
  moduleIndexItems.map((item, index) => {
    const angle = angleBySlug[item.slug];
    const ring = (index % 3) as 0 | 1 | 2;
    const scale = ringScales[ring];
    const radians = (angle * Math.PI) / 180;
    const { center, radius, viewBox } = constellationGeometry;
    const x = center.x + Math.cos(radians) * radius.x * scale;
    const y = center.y + Math.sin(radians) * radius.y * scale;
    return {
      ...item,
      angle,
      ring,
      tier: tierBySlug[item.slug],
      left: (x / viewBox.width) * 100,
      top: (y / viewBox.height) * 100,
    };
  });

/**
 * Contextual design labels that give the empty orbital bands meaning. These are
 * conceptual zone names, not capabilities — capability items belong to the
 * module pages, never the hero.
 */
export const constellationZones = [
  { id: "master-data", label: "Master data", angle: -115 },
  { id: "stock-movement", label: "Stock movement", angle: -30 },
  { id: "commerce", label: "Commerce", angle: 50 },
  { id: "finance-flow", label: "Finance flow", angle: 170 },
].map((zone) => {
  const radians = (zone.angle * Math.PI) / 180;
  const { center, radius, viewBox } = constellationGeometry;
  const x = center.x + Math.cos(radians) * radius.x * 0.74;
  const y = center.y + Math.sin(radians) * radius.y * 0.74;
  return {
    ...zone,
    left: (x / viewBox.width) * 100,
    top: (y / viewBox.height) * 100,
  };
});
