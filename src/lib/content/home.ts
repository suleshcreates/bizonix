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
} from "lucide-react";

export const trustPoints = [
  {
    title: "Live with Pratyush",
    body: "Built around the realities of a working wholesale, retail and franchise operation.",
  },
  {
    title: "Barcode-level stock",
    body: "Track individual pieces from receiving to transfer, sale and return.",
  },
  {
    title: "Books that follow operations",
    body: "GST-ready invoices, ledgers and controls connected to daily movement.",
  },
  {
    title: "Entity-aware access",
    body: "Keep warehouse, brand and franchise visibility precise without fragmenting the system.",
  },
];

export const audiences = [
  {
    icon: Building2,
    title: "Wholesale HQ",
    body: "See purchasing, fulfillment, stock and credit without stitching together reports.",
  },
  {
    icon: Store,
    title: "Company retail / POS",
    body: "Keep every counter fast while central teams retain control of stock and cash.",
  },
  {
    icon: ShoppingBag,
    title: "Franchise outlets",
    body: "Give partners a focused workflow while the brand governs allocation and visibility.",
  },
];

export const challenges = [
  [
    "Visibility arrives late",
    "By the time spreadsheets reconcile, yesterday's stock decisions have already aged.",
  ],
  [
    "Stock exists—but not where needed",
    "Warehouse totals hide store-level gaps, variants and sell-through.",
  ],
  [
    "Franchise orders drift off-system",
    "Calls and chat threads turn allocation into guesswork.",
  ],
  [
    "Month-end becomes detective work",
    "Sales, returns, receipts and transfers do not meet in one ledger.",
  ],
  [
    "GST context gets re-entered",
    "Operational documents and accounting records fall out of sync.",
  ],
  [
    "Piece identity disappears",
    "Without barcode truth, returns and transfers lose traceability.",
  ],
];

export const spine = [
  ["Purchase / GRN", "Receive against the supplier and establish cost."],
  ["Barcode", "Give each piece or series an identity."],
  ["Stock transfer", "Move inventory with an auditable trail."],
  ["POS / Wholesale", "Sell through the right entity and channel."],
  ["Returns", "Reverse stock and value without losing context."],
  ["Accounting", "Let ledgers reflect the operation."],
];

export const modules = [
  {
    slug: "inventory",
    title: "Inventory",
    body: "Piece-level visibility across warehouse, branch and franchise.",
    icon: Boxes,
  },
  {
    slug: "procurement",
    title: "Procurement",
    body: "Purchase, receive, return and price with supplier context.",
    icon: Truck,
  },
  {
    slug: "sales-pos",
    title: "Sales & POS",
    body: "Fast billing counters with session and cash discipline.",
    icon: ScanBarcode,
  },
  {
    slug: "wholesale",
    title: "Wholesale",
    body: "Bill, fulfill, cartonise and dispatch without side systems.",
    icon: Building2,
  },
  {
    slug: "franchise",
    title: "Franchise",
    body: "Allocate stock and govern the network without blocking partners.",
    icon: Store,
  },
  {
    slug: "accounting",
    title: "Accounting",
    body: "Ledgers, AR/AP, receipts and statements tied to operations.",
    icon: Calculator,
  },
  {
    slug: "ecommerce",
    title: "Ecommerce",
    body: "Keep catalog and orders connected to the same inventory truth.",
    icon: ShoppingBag,
  },
  {
    slug: "analytics",
    title: "Analytics",
    body: "Read purchase, inventory and sales across entities.",
    icon: BarChart3,
  },
  {
    slug: "security",
    title: "Security",
    body: "Shape roles and entity scope around real responsibilities.",
    icon: ShieldCheck,
  },
];

export const faqs = [
  [
    "How is Bizonix deployed?",
    "Bizonix is designed as a central operating platform for warehouse, retail, franchise and ecommerce teams. The exact rollout, migration and hosting approach is scoped during the workflow demo.",
  ],
  [
    "Can franchise outlets see only their own operations?",
    "Yes. Entity-scoped roles are designed to keep each franchise focused on its own stock and workflows while the central team retains consolidated oversight.",
  ],
  [
    "Does it support individual-piece barcodes?",
    "Yes. Bizonix supports piece and series barcode workflows for receiving, label printing, transfers, billing and returns.",
  ],
  [
    "Are accounting and GST workflows included?",
    "The platform covers tax invoices, chart of accounts, journals, ledgers, receivables, payables and GST-oriented reporting. Your exact compliance workflow should be confirmed during implementation.",
  ],
  [
    "Can it connect ecommerce and store inventory?",
    "Bizonix includes ecommerce catalog, order and storefront capabilities so commerce can operate against the same product and stock foundation.",
  ],
  [
    "What support is available during rollout?",
    "Fibonce works with your team to understand operating entities, masters, permissions and migration needs before defining the rollout and training plan.",
  ],
];
