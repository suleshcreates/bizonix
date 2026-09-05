import {
  Barcode,
  MonitorCheck,
  ReceiptIndianRupee,
  Tags,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { FeatureId } from "./features";

export type CalloutSlot =
  "top-left" | "top-right" | "bottom-left" | "bottom-right" | "bottom-center";

export type ProductKpi = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "flat";
  spark: readonly number[];
};

export type ProductRow = {
  code: string;
  item: string;
  itemMeta: string;
  context: string;
  contextMeta: string;
  measure: string;
  status: string;
  tone: "ok" | "warn" | "move";
  focus?: boolean;
};

export type FeatureProduct = {
  title: string;
  subtitle: string;
  search: string;
  location: string;
  scope: string;
  action: string;
  columns: readonly [string, string, string, string, string];
  kpis: readonly ProductKpi[];
  rows: readonly ProductRow[];
};

export type HeroFeature = {
  id: FeatureId;
  number: string;
  name: string;
  eyebrow: string;
  headline: readonly [string, string];
  description: string;
  discipline: string;
  blurb: string;
  icon: LucideIcon;
  accent: string;
  ambient: string;
  href: string;
  slot: CalloutSlot;
  nav: string;
  chip: string;
  state: readonly { label: string; value: string }[];
  product: FeatureProduct;
};

const sparkA = [22, 38, 30, 48, 44, 62, 58, 76];
const sparkB = [40, 34, 46, 42, 58, 54, 66, 72];
const sparkC = [18, 26, 24, 40, 52, 48, 68, 84];
const sparkD = [56, 52, 58, 50, 60, 54, 58, 56];

export const heroFeatures: readonly HeroFeature[] = [
  {
    id: "barcode",
    number: "01",
    name: "Barcode",
    eyebrow: "Barcode",
    headline: ["Every piece has", "an identity."],
    description:
      "Trace every physical piece from receiving to sale, return and movement with one persistent identity.",
    discipline: "Piece identity",
    blurb: "Piece identity, not just what it is.",
    icon: Barcode,
    accent: "#2f6bff",
    ambient: "#35b9ee",
    href: "/features/barcode",
    slot: "top-left",
    nav: "Piece identity",
    chip: "Verified",
    state: [
      { label: "Piece ID", value: "BZ-4412-0187" },
      { label: "SKU", value: "KUR-4412" },
      { label: "Scan state", value: "Verified" },
    ],
    product: {
      title: "Piece identity",
      subtitle: "18,432 individually traced pieces · live across 14 locations",
      search: "Scan barcode or search piece ID",
      location: "Kalyan · Store 04",
      scope: "Piece register",
      action: "Scan piece",
      columns: ["Piece ID", "Item", "Location / Event", "Movement", "Status"],
      kpis: [
        {
          label: "Piece records",
          value: "18,432",
          delta: "+312",
          trend: "up",
          spark: sparkA,
        },
        {
          label: "Verified today",
          value: "1,286",
          delta: "99.8%",
          trend: "up",
          spark: sparkB,
        },
        {
          label: "In movement",
          value: "48",
          delta: "3 transfers",
          trend: "flat",
          spark: sparkD,
        },
        {
          label: "Exceptions",
          value: "3",
          delta: "needs review",
          trend: "flat",
          spark: sparkC,
        },
      ],
      rows: [
        {
          code: "BZ-4412-0187",
          item: "Anarkali kurta",
          itemMeta: "M · Indigo · KUR-4412",
          context: "Kalyan Store 04",
          contextMeta: "Sale scan · 10:42",
          measure: "GRN-4821",
          status: "Verified",
          tone: "ok",
          focus: true,
        },
        {
          code: "BZ-4412-0188",
          item: "Anarkali kurta",
          itemMeta: "M · Indigo · KUR-4412",
          context: "Warehouse A",
          contextMeta: "Received · 09:18",
          measure: "GRN-4821",
          status: "In stock",
          tone: "ok",
        },
        {
          code: "BZ-4390-0062",
          item: "Cotton kurta",
          itemMeta: "L · Sand · KUR-4390",
          context: "Bhiwandi",
          contextMeta: "Transfer scan",
          measure: "TRF-118",
          status: "Moving",
          tone: "move",
        },
        {
          code: "BZ-1180-0024",
          item: "Imitation set",
          itemMeta: "Gold tone · JWL-1180",
          context: "Kalyan Store 04",
          contextMeta: "Return linked",
          measure: "RET-041",
          status: "Verified",
          tone: "ok",
        },
      ],
    },
  },
  {
    id: "billing-counters",
    number: "02",
    name: "Billing Counters",
    eyebrow: "Billing counters",
    headline: ["Every counter.", "Fully accounted."],
    description:
      "Control operators, sessions, bills, returns and drawer reconciliation from open to close.",
    discipline: "Counter control",
    blurb: "Counter control that keeps every shift in check.",
    icon: MonitorCheck,
    accent: "#2ec4b6",
    ambient: "#2ec4b6",
    href: "/features/billing-counters",
    slot: "top-right",
    nav: "Counters",
    chip: "Open",
    state: [
      { label: "Counter", value: "Counter 04" },
      { label: "Operator", value: "Meera S." },
      { label: "Session", value: "Open · controlled" },
    ],
    product: {
      title: "Counter sessions",
      subtitle: "8 counters · 6 open · shift reconciliation live",
      search: "Search counter, operator or bill",
      location: "Kalyan · Store 04",
      scope: "Counter control",
      action: "Open session",
      columns: [
        "Counter",
        "Operator",
        "Session activity",
        "Expected drawer",
        "Status",
      ],
      kpis: [
        {
          label: "Open counters",
          value: "6 / 8",
          delta: "2 ready",
          trend: "flat",
          spark: sparkB,
        },
        {
          label: "Bills today",
          value: "342",
          delta: "+12.4%",
          trend: "up",
          spark: sparkC,
        },
        {
          label: "Cash sales",
          value: "₹2,84,560",
          delta: "186 bills",
          trend: "up",
          spark: sparkA,
        },
        {
          label: "Variance",
          value: "₹0.00",
          delta: "balanced",
          trend: "flat",
          spark: sparkD,
        },
      ],
      rows: [
        {
          code: "COUNTER 04",
          item: "Meera S.",
          itemMeta: "Opened 09:02",
          context: "86 bills · 3 returns",
          contextMeta: "Float ₹8,000",
          measure: "₹72,480",
          status: "Open",
          tone: "ok",
          focus: true,
        },
        {
          code: "COUNTER 01",
          item: "Rahul K.",
          itemMeta: "Opened 08:54",
          context: "104 bills · 2 returns",
          contextMeta: "Float ₹10,000",
          measure: "₹94,620",
          status: "Open",
          tone: "ok",
        },
        {
          code: "COUNTER 02",
          item: "Anil P.",
          itemMeta: "Closing 18:05",
          context: "79 bills · 5 returns",
          contextMeta: "Counted ₹68,140",
          measure: "₹68,140",
          status: "Reconciling",
          tone: "move",
        },
        {
          code: "COUNTER 03",
          item: "Unassigned",
          itemMeta: "No active operator",
          context: "0 bills · 0 returns",
          contextMeta: "No opening float",
          measure: "—",
          status: "Closed",
          tone: "warn",
        },
      ],
    },
  },
  {
    id: "gst-compliance",
    number: "03",
    name: "GST Compliance",
    eyebrow: "GST compliance",
    headline: ["Tax truth,", "captured at sale."],
    description:
      "Capture GSTIN, HSN, place of supply and tax values on the transaction—not in a spreadsheet later.",
    discipline: "Tax truth",
    blurb: "Tax truth, captured at the transaction.",
    icon: ReceiptIndianRupee,
    accent: "#7771f7",
    ambient: "#5867ef",
    href: "/features/gst-compliance",
    slot: "bottom-left",
    nav: "GST & tax",
    chip: "Validated",
    state: [
      { label: "Taxable value", value: "₹1,196.43" },
      { label: "CGST", value: "₹71.79" },
      { label: "SGST", value: "₹71.79 · validated" },
    ],
    product: {
      title: "GST invoice register",
      subtitle: "Transaction-level tax capture · September 2026",
      search: "Search invoice, GSTIN or party",
      location: "Fibonce Retail Pvt. Ltd.",
      scope: "GSTIN 27AABCF4412K1Z7",
      action: "New invoice",
      columns: [
        "Invoice",
        "Customer / Entity",
        "Tax structure",
        "Taxable value",
        "Status",
      ],
      kpis: [
        {
          label: "Taxable today",
          value: "₹8,42,680",
          delta: "+9.2%",
          trend: "up",
          spark: sparkC,
        },
        {
          label: "CGST",
          value: "₹50,560",
          delta: "6.0%",
          trend: "flat",
          spark: sparkA,
        },
        {
          label: "SGST",
          value: "₹50,560",
          delta: "6.0%",
          trend: "flat",
          spark: sparkB,
        },
        {
          label: "Validated",
          value: "338 / 342",
          delta: "98.8%",
          trend: "up",
          spark: sparkD,
        },
      ],
      rows: [
        {
          code: "INV-26-4182",
          item: "Aarav Retail · Kalyan",
          itemMeta: "GSTIN 27AAHCA1824P1ZQ",
          context: "CGST 6% + SGST 6%",
          contextMeta: "HSN 6204",
          measure: "₹1,196.43",
          status: "Validated",
          tone: "ok",
          focus: true,
        },
        {
          code: "INV-26-4181",
          item: "Walk-in customer",
          itemMeta: "B2C · Maharashtra",
          context: "CGST 2.5% + SGST 2.5%",
          contextMeta: "HSN 6104",
          measure: "₹4,280.00",
          status: "Posted",
          tone: "ok",
        },
        {
          code: "INV-26-4180",
          item: "Nexus Fashion · Surat",
          itemMeta: "GSTIN 24AAFCN8201D1ZW",
          context: "IGST 12%",
          contextMeta: "Interstate · HSN 7117",
          measure: "₹28,450.00",
          status: "E-invoice",
          tone: "move",
        },
        {
          code: "INV-26-4179",
          item: "Riya Collection · Pune",
          itemMeta: "GSTIN pending review",
          context: "CGST 6% + SGST 6%",
          contextMeta: "HSN 6204",
          measure: "₹9,860.00",
          status: "Review",
          tone: "warn",
        },
      ],
    },
  },
  {
    id: "series-pricing",
    number: "04",
    name: "Series Pricing",
    eyebrow: "Series pricing",
    headline: ["One series.", "One approved price."],
    description:
      "Carry approved purchase, wholesale, franchise and retail rates from one governed series.",
    discipline: "Price discipline",
    blurb: "One series, one approved set of rates.",
    icon: Tags,
    accent: "#f0a020",
    ambient: "#416ff4",
    href: "/features/series-pricing",
    slot: "bottom-right",
    nav: "Rate series",
    chip: "Active",
    state: [
      { label: "Applicable series", value: "S-2451" },
      { label: "Approved price", value: "₹1,340" },
      { label: "Selling price", value: "₹1,340 · resolved" },
    ],
    product: {
      title: "Series pricing",
      subtitle: "Approved rate ladders across every selling channel",
      search: "Search series, SKU or outlet",
      location: "All operating entities",
      scope: "Pricing control",
      action: "Create series",
      columns: ["Series", "Item", "Tier / Location", "Approved rate", "Status"],
      kpis: [
        {
          label: "Active series",
          value: "24",
          delta: "+3 this month",
          trend: "up",
          spark: sparkB,
        },
        {
          label: "Mapped SKUs",
          value: "8,426",
          delta: "99.4%",
          trend: "up",
          spark: sparkA,
        },
        {
          label: "Avg margin",
          value: "34.8%",
          delta: "+1.6%",
          trend: "up",
          spark: sparkC,
        },
        {
          label: "Overrides",
          value: "7",
          delta: "controlled",
          trend: "flat",
          spark: sparkD,
        },
      ],
      rows: [
        {
          code: "S-2451",
          item: "Anarkali kurta",
          itemMeta: "KUR-4412 · M · Indigo",
          context: "Franchise · Kalyan",
          contextMeta: "Effective 01 Sep 2026",
          measure: "₹1,340",
          status: "Active",
          tone: "ok",
          focus: true,
        },
        {
          code: "S-2451",
          item: "Anarkali kurta",
          itemMeta: "KUR-4412 · M · Indigo",
          context: "Retail · Main Store",
          contextMeta: "MRP ₹1,999",
          measure: "₹1,699",
          status: "Active",
          tone: "ok",
        },
        {
          code: "S-2478",
          item: "Imitation set",
          itemMeta: "JWL-1180 · Gold tone",
          context: "Wholesale · West",
          contextMeta: "Effective 12 Aug 2026",
          measure: "₹940",
          status: "Active",
          tone: "ok",
        },
        {
          code: "S-2438",
          item: "Cotton kurta",
          itemMeta: "KUR-4390 · L · Sand",
          context: "Franchise · Pune",
          contextMeta: "Ends 05 Sep 2026",
          measure: "₹1,080",
          status: "Expiring",
          tone: "warn",
        },
      ],
    },
  },
  {
    id: "stock-transfer",
    number: "05",
    name: "Stock Transfer",
    eyebrow: "Stock transfer",
    headline: ["Know where every", "movement goes."],
    description:
      "Follow stock from request and dispatch through transit, receipt and posting across every location.",
    discipline: "Movement visibility",
    blurb: "Movement visibility across every location.",
    icon: Truck,
    accent: "#2ec4b6",
    ambient: "#24a9d8",
    href: "/features/stock-transfer",
    slot: "bottom-center",
    nav: "Transfers",
    chip: "In transit",
    state: [
      { label: "From", value: "Bhiwandi" },
      { label: "To", value: "Kalyan" },
      { label: "Movement", value: "09:42 · in transit" },
    ],
    product: {
      title: "Stock transfers",
      subtitle: "Live movement visibility across warehouses and outlets",
      search: "Search transfer, source or destination",
      location: "Western region",
      scope: "Movement control",
      action: "New transfer",
      columns: [
        "Transfer",
        "Items / Quantity",
        "Route",
        "Last event",
        "Status",
      ],
      kpis: [
        {
          label: "In transit",
          value: "1,236 pcs",
          delta: "6 transfers",
          trend: "flat",
          spark: sparkD,
        },
        {
          label: "Dispatched",
          value: "842 pcs",
          delta: "today",
          trend: "up",
          spark: sparkC,
        },
        {
          label: "Received",
          value: "794 pcs",
          delta: "94.3%",
          trend: "up",
          spark: sparkB,
        },
        {
          label: "Exceptions",
          value: "2",
          delta: "needs action",
          trend: "flat",
          spark: sparkA,
        },
      ],
      rows: [
        {
          code: "TRF-118",
          item: "48 pieces · 3 SKUs",
          itemMeta: "Requested by Kalyan Store 04",
          context: "Bhiwandi → Kalyan",
          contextMeta: "Dispatched 09:42",
          measure: "ETA 14:30",
          status: "In transit",
          tone: "move",
          focus: true,
        },
        {
          code: "TRF-117",
          item: "72 pieces · 5 SKUs",
          itemMeta: "Requested by Main Store",
          context: "Warehouse A → Main Store",
          contextMeta: "Received 11:08",
          measure: "11:08",
          status: "Received",
          tone: "ok",
        },
        {
          code: "TRF-116",
          item: "24 pieces · 2 SKUs",
          itemMeta: "Requested by Pune outlet",
          context: "Bhiwandi → Pune",
          contextMeta: "Allocated 10:26",
          measure: "Awaiting gate",
          status: "Allocated",
          tone: "warn",
        },
        {
          code: "TRF-115",
          item: "120 pieces · 8 SKUs",
          itemMeta: "Network replenishment",
          context: "Warehouse A → 3 outlets",
          contextMeta: "Posted 08:35",
          measure: "Complete",
          status: "Posted",
          tone: "ok",
        },
      ],
    },
  },
];

export const featureById = Object.fromEntries(
  heroFeatures.map((feature) => [feature.id, feature]),
) as Record<FeatureId, HeroFeature>;

export const screenNav = heroFeatures.map((feature) => feature.nav);
