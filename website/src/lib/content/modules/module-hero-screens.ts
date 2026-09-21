import type { ModuleSlug } from "./module-pages/types";

/**
 * The operational screen each module hero draws.
 *
 * One universal hero frame renders all nine; this file is the only thing that
 * differs between them. A module declares which SHAPE of screen it needs —
 * a register, a ledger, a work board, a network view, a counter, a fulfilment
 * pipeline or an insight surface — and the data that fills it.
 *
 * Nothing here is a screenshot and nothing is captured from a real tenant:
 * every figure is synthetic and written to be believable at hero scale.
 */

export type ScreenShape =
  | "register"
  | "ledger"
  | "board"
  | "network"
  | "counter"
  | "pipeline"
  | "insight";

export type Tone = "ok" | "live" | "warn" | "info";

export type ScreenMetric = {
  label: string;
  value: string;
  note: string;
  tone?: Tone;
};

/** A row in a register-shaped screen. */
export type ScreenRow = {
  id: string;
  cells: readonly string[];
  state: string;
  tone: Tone;
};

/** A card on a board-shaped screen. */
export type BoardCard = {
  id: string;
  title: string;
  meta: string;
  value: string;
};

type Base = {
  /** Workspace name in the application chrome. */
  app: string;
  /** Page title and the line under it. */
  title: string;
  context: string;
  /** A single control chip on the right of the page head. */
  control: string;
  /** Three operating figures above the main content. */
  metrics: readonly [ScreenMetric, ScreenMetric, ScreenMetric];
  /** The status line under the screen. */
  foot: string;
};

export type ModuleScreen = Base &
  (
    | {
        shape: "register";
        columns: readonly string[];
        rows: readonly ScreenRow[];
        /**
         * Which two cells the narrow preview keeps, as `[main, detail]` indexes
         * into `cells`. A phone has room for one text column, one figure and
         * the status pill, and which cells those are is a content decision: a
         * stock register keeps the item and the quantity, an access log keeps
         * the action and the time. The status pill is always kept.
         */
        compact: readonly [number, number];
      }
    | {
        shape: "ledger";
        entry: { ref: string; source: string; date: string };
        lines: readonly {
          account: string;
          debit: string;
          credit: string;
          note: string;
        }[];
        balance: { label: string; value: string; state: string };
      }
    | {
        shape: "board";
        lanes: readonly {
          title: string;
          tone: Tone;
          count: string;
          cards: readonly BoardCard[];
        }[];
      }
    | {
        shape: "network";
        hub: { label: string; place: string; note: string };
        outlets: readonly {
          name: string;
          place: string;
          state: string;
          tone: Tone;
          value: string;
        }[];
        transfer: { ref: string; from: string; to: string; note: string };
      }
    | {
        shape: "counter";
        session: { counter: string; operator: string; opened: string };
        bill: { ref: string; customer: string; time: string };
        lines: readonly { item: string; meta: string; qty: string; amount: string }[];
        totals: readonly { label: string; value: string; strong?: boolean }[];
        payment: { method: string; state: string };
      }
    | {
        shape: "pipeline";
        order: { ref: string; channel: string; customer: string; value: string };
        stages: readonly { label: string; meta: string; state: "done" | "live" | "next" }[];
        stock: readonly { label: string; value: string }[];
      }
    | {
        shape: "insight";
        trend: readonly number[];
        trendLabel: string;
        trendRange: string;
        breakdown: readonly { label: string; value: string; share: number }[];
      }
  );

export const moduleScreens: Record<ModuleSlug, ModuleScreen> = {
  /* ----------------------------------------------------------- inventory */
  inventory: {
    shape: "register",
    app: "Inventory",
    title: "Stock register",
    context: "Bhiwandi warehouse · 14 locations",
    control: "All locations",
    metrics: [
      { label: "Pieces in stock", value: "18,432", note: "+312 today" },
      { label: "Stock value", value: "₹1.24 Cr", note: "at landed cost" },
      { label: "Below reorder", value: "12", note: "across 4 outlets", tone: "warn" },
    ],
    columns: ["SKU", "Item", "Location", "Qty", "Status"],
    compact: [1, 3],
    rows: [
      {
        id: "r1",
        cells: ["KUR-4412", "Anarkali kurta · M · Indigo", "Bhiwandi · A-14", "48"],
        state: "In stock",
        tone: "ok",
      },
      {
        id: "r2",
        cells: ["JWL-1180", "Imitation set · Gold tone", "Kalyan · Floor", "6"],
        state: "Low stock",
        tone: "warn",
      },
      {
        id: "r3",
        cells: ["DUP-2207", "Banarasi dupatta · Maroon", "Bhiwandi · B-02", "51"],
        state: "In stock",
        tone: "ok",
      },
      {
        id: "r4",
        cells: ["FTW-3301", "Embroidered juti · 38 · Tan", "In transit", "18"],
        state: "Moving",
        tone: "info",
      },
    ],
    foot: "Count 24 Aug · variance named by entry, not by quantity",
  },

  /* ---------------------------------------------------------- procurement */
  procurement: {
    shape: "board",
    app: "Procurement",
    title: "Purchase orders",
    context: "September · 3 vendors awaiting approval",
    control: "This month",
    metrics: [
      { label: "Open orders", value: "9", note: "4 vendors" },
      { label: "Awaiting approval", value: "3", note: "₹6.2 L held", tone: "warn" },
      { label: "Committed value", value: "₹18.4 L", note: "not yet received" },
    ],
    lanes: [
      {
        title: "Requested",
        tone: "info",
        count: "3",
        cards: [
          { id: "p1", title: "PO-2291", meta: "Surat Textiles · 240 pcs", value: "₹2,17,200" },
          { id: "p2", title: "PO-2292", meta: "Jaipur Crafts · 120 pcs", value: "₹82,800" },
        ],
      },
      {
        title: "Approved",
        tone: "ok",
        count: "4",
        cards: [
          { id: "p3", title: "PO-2288", meta: "Surat Textiles · 480 pcs", value: "₹4,18,000" },
          { id: "p4", title: "PO-2287", meta: "Ludhiana Mills · 300 pcs", value: "₹2,64,000" },
        ],
      },
      {
        title: "Receiving",
        tone: "live",
        count: "2",
        cards: [
          { id: "p5", title: "PO-2284", meta: "GRN 18 Aug · 232 of 240", value: "₹2,09,880" },
          { id: "p6", title: "PO-2281", meta: "GRN 16 Aug · complete", value: "₹1,44,500" },
        ],
      },
    ],
    foot: "Short receipt on PO-2284 stays on the same document as the order",
  },

  /* ------------------------------------------------------------ sales-pos */
  "sales-pos": {
    shape: "counter",
    app: "Sales & POS",
    title: "Counter 2 · billing",
    context: "Kalyan outlet · session SES-0914",
    control: "Open session",
    metrics: [
      { label: "Bills today", value: "110", note: "across 2 counters" },
      { label: "Collected", value: "₹97,530", note: "cash, card, UPI" },
      { label: "Returns", value: "4", note: "₹5,120 paid out", tone: "warn" },
    ],
    session: { counter: "Counter 2", operator: "Meera S.", opened: "09:04" },
    bill: { ref: "INV/27/1184", customer: "Walk-in · 98•••4471", time: "19:22" },
    lines: [
      { item: "Anarkali kurta", meta: "M · Indigo · KUR-4412", qty: "1", amount: "₹1,340" },
      { item: "Banarasi dupatta", meta: "Maroon · DUP-2207", qty: "2", amount: "₹1,440" },
      { item: "Imitation set", meta: "Gold tone · JWL-1180", qty: "1", amount: "₹1,060" },
    ],
    totals: [
      { label: "Taxable value", value: "₹3,428.57" },
      { label: "CGST 6% + SGST 6%", value: "₹411.43" },
      { label: "Bill total", value: "₹3,840.00", strong: true },
    ],
    payment: { method: "UPI · ICICI", state: "Captured" },
    foot: "Each line resolves the exact piece — the stock entry closes with the sale",
  },

  /* ------------------------------------------------------------ wholesale */
  wholesale: {
    shape: "board",
    app: "Wholesale",
    title: "Order book",
    context: "12 open orders · 4 dispatching today",
    control: "Open orders",
    metrics: [
      { label: "Open orders", value: "12", note: "9 accounts" },
      { label: "Allocated", value: "78%", note: "of ordered quantity" },
      { label: "Dispatch today", value: "4", note: "₹7.8 L", tone: "live" },
    ],
    lanes: [
      {
        title: "Confirmed",
        tone: "info",
        count: "5",
        cards: [
          { id: "w1", title: "WO-4471", meta: "Nashik Distributors · 320 pcs", value: "₹3,77,600" },
          { id: "w2", title: "WO-4470", meta: "Pune Traders · 180 pcs", value: "₹2,12,400" },
        ],
      },
      {
        title: "Allocated",
        tone: "ok",
        count: "3",
        cards: [
          { id: "w3", title: "WO-4466", meta: "Surat Retail · 240 of 240", value: "₹2,83,200" },
          { id: "w4", title: "WO-4464", meta: "Indore Bazaar · 96 of 120", value: "₹1,13,280" },
        ],
      },
      {
        title: "Dispatching",
        tone: "live",
        count: "4",
        cards: [
          { id: "w5", title: "WO-4459", meta: "Nagpur Wholesale · packed", value: "₹4,06,000" },
          { id: "w6", title: "WO-4458", meta: "Thane Traders · invoiced", value: "₹1,68,400" },
        ],
      },
    ],
    foot: "Rate on every line comes from the approved series, not the last quote",
  },

  /* ------------------------------------------------------------ franchise */
  franchise: {
    shape: "network",
    app: "Franchise",
    title: "Network position",
    context: "14 outlets · 3 consignments moving",
    control: "Western region",
    metrics: [
      { label: "Outlets", value: "14", note: "11 partner-owned" },
      { label: "In transit", value: "3", note: "204 pieces", tone: "live" },
      { label: "Masters synced", value: "14 / 14", note: "rates and items" },
    ],
    hub: { label: "HQ warehouse", place: "Bhiwandi", note: "1,236 pieces on hand" },
    outlets: [
      { name: "Kalyan", place: "Partner · Ramesh J.", state: "Open", tone: "ok", value: "₹1.42 L" },
      { name: "Thane", place: "Company store", state: "Open", tone: "ok", value: "₹2.06 L" },
      { name: "Nashik", place: "Partner · Sunita M.", state: "Receiving", tone: "live", value: "₹0.94 L" },
      { name: "Pune FC", place: "Partner · Anil V.", state: "Stock low", tone: "warn", value: "₹0.61 L" },
    ],
    transfer: {
      ref: "TRF-1184",
      from: "Bhiwandi",
      to: "Kalyan",
      note: "48 pieces · scanned out 11:40",
    },
    foot: "The partner owns their books; the brand still reads one network",
  },

  /* ------------------------------------------------------------ ecommerce */
  ecommerce: {
    shape: "pipeline",
    app: "Ecommerce",
    title: "Online order",
    context: "46 orders today · stock synced 2 min ago",
    control: "All channels",
    metrics: [
      { label: "Orders today", value: "46", note: "3 channels" },
      { label: "Captured", value: "₹2.14 L", note: "payments settled" },
      { label: "Sync status", value: "Live", note: "stock to channel", tone: "ok" },
    ],
    order: {
      ref: "ORD-88214",
      channel: "Website · D2C",
      customer: "Priya N. · Pune 411004",
      value: "₹4,280",
    },
    stages: [
      { label: "Placed", meta: "24 Aug · 10:12", state: "done" },
      { label: "Payment captured", meta: "UPI · ₹4,280", state: "done" },
      { label: "Allocated", meta: "Bhiwandi · 3 pieces", state: "live" },
      { label: "Packed", meta: "awaiting pick", state: "next" },
      { label: "Shipped", meta: "—", state: "next" },
    ],
    stock: [
      { label: "Held for this order", value: "3 pieces" },
      { label: "Channel availability", value: "1,233" },
      { label: "Oversell risk", value: "None" },
    ],
    foot: "Allocation holds the piece, so the channel cannot sell it twice",
  },

  /* ----------------------------------------------------------- accounting */
  accounting: {
    shape: "ledger",
    app: "Accounting",
    title: "Journal entry",
    context: "Posted from Sales & POS · September",
    control: "Sep 2025",
    metrics: [
      { label: "Unposted", value: "4", note: "awaiting review", tone: "warn" },
      { label: "GST payable", value: "₹1.84 L", note: "September" },
      { label: "Trial balance", value: "Nil diff", note: "as at 24 Aug", tone: "ok" },
    ],
    entry: { ref: "JV-10442", source: "INV/27/1184 · Counter 2", date: "24 Aug 2025" },
    lines: [
      { account: "Cash · Kalyan", debit: "₹3,840.00", credit: "—", note: "UPI settlement" },
      { account: "Sales · Apparel", debit: "—", credit: "₹3,428.57", note: "Taxable value" },
      { account: "CGST payable", debit: "—", credit: "₹205.72", note: "6% · HSN 6204" },
      { account: "SGST payable", debit: "—", credit: "₹205.71", note: "6% · HSN 6204" },
    ],
    balance: { label: "Debits equal credits", value: "₹3,840.00", state: "Posted" },
    foot: "The entry carries its source — the bill it came from is one click away",
  },

  /* ------------------------------------------------------------- analytics */
  analytics: {
    shape: "insight",
    app: "Analytics",
    title: "Revenue and margin",
    context: "September to date · all entities",
    control: "Last 30 days",
    metrics: [
      { label: "Revenue", value: "₹42.6 L", note: "+8.4% vs Aug", tone: "ok" },
      { label: "Gross margin", value: "34.2%", note: "+1.1 pts", tone: "ok" },
      { label: "Sell-through", value: "62%", note: "of season intake" },
    ],
    trend: [28, 34, 31, 40, 38, 47, 44, 52, 49, 58, 61, 68],
    trendLabel: "Daily revenue",
    trendRange: "01 Sep – 24 Sep",
    breakdown: [
      { label: "Retail counters", value: "₹19.8 L", share: 100 },
      { label: "Wholesale", value: "₹14.2 L", share: 72 },
      { label: "Franchise", value: "₹6.1 L", share: 31 },
      { label: "Online", value: "₹2.5 L", share: 13 },
    ],
    foot: "Every figure opens to the transactions behind it",
  },

  /* -------------------------------------------------------------- security */
  security: {
    shape: "register",
    app: "Security",
    title: "Access and activity",
    context: "38 active sessions · 6 entities",
    control: "Last 24 hours",
    metrics: [
      { label: "Active sessions", value: "38", note: "6 entities" },
      { label: "Pending review", value: "2", note: "rate overrides", tone: "warn" },
      { label: "Policy", value: "Enforced", note: "entity boundaries", tone: "ok" },
    ],
    columns: ["Time", "User", "Action", "Entity", "Status"],
    compact: [2, 0],
    rows: [
      {
        id: "s1",
        cells: ["19:22", "Meera S. · Cashier", "Raised bill INV/27/1184", "Kalyan outlet"],
        state: "Allowed",
        tone: "ok",
      },
      {
        id: "s2",
        cells: ["18:04", "Anil K. · Cashier", "Closed session SES-0912", "Kalyan outlet"],
        state: "Allowed",
        tone: "ok",
      },
      {
        id: "s3",
        cells: ["16:41", "Ramesh J. · Partner", "Viewed HQ cost price", "Kalyan outlet"],
        state: "Blocked",
        tone: "warn",
      },
      {
        id: "s4",
        cells: ["11:40", "HQ dispatch", "Scanned out TRF-1184", "Bhiwandi"],
        state: "Allowed",
        tone: "info",
      },
    ],
    foot: "A blocked action is still recorded — the trail does not have gaps",
  },
};

export const standardScreen: ModuleScreen = {
  shape: "register",
  app: "Operating Core",
  title: "Live Activity Ledger",
  context: "Real-time records across every location",
  control: "Filter by outlet",
  metrics: [
    { label: "Active Nodes", value: "24", note: "All online", tone: "live" },
    { label: "Ledger State", value: "Settled", note: "Zero drift", tone: "ok" },
    { label: "Sync Latency", value: "< 120ms", note: "Direct link", tone: "info" },
  ],
  columns: ["Transaction ID", "Outlet / Hub", "Action Type", "Status"],
  compact: [2, 0],
  rows: [
    { id: "TX-9041", cells: ["TX-9041", "Flagship Store · BLR", "Stock Movement", "Posted"], state: "Verified", tone: "ok" },
    { id: "TX-9042", cells: ["TX-9042", "Central Warehouse · PNE", "Inward Processing", "Active"], state: "Processing", tone: "live" },
    { id: "TX-9043", cells: ["TX-9043", "Franchise Hub · DEL", "Session Close", "Settled"], state: "Audited", tone: "ok" },
    { id: "TX-9044", cells: ["TX-9044", "Omnichannel Fulfillment", "Order Dispatched", "Delivered"], state: "Closed", tone: "info" },
  ],
  foot: "Continuous operational truth across multi-entity retail networks",
};

