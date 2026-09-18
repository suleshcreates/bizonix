// Marketing-only demo data for the Product hero workspace.
//
// SAFETY: every value below is invented for the public website. This file must
// stay disconnected from product, customer, authentication, or API data
// sources — nothing here may ever be replaced with live tenant records.

export type Trend = "up" | "down" | "flat";

export const heroWorkspace = {
  title: "Operations Command Center",
  entity: "Meridian Retail Group",
  scope: "All operating entities",
  periods: ["Today", "MTD", "QTD"] as const,
  activePeriod: "MTD",
  status: "Live · synced 40s ago",
} as const;

export const heroNav = [
  "Overview",
  "Sales",
  "Purchase",
  "Inventory",
  "Billing",
  "Finance",
] as const;

export const heroKpis: {
  label: string;
  value: string;
  note: string;
  delta: string;
  trend: Trend;
}[] = [
  {
    label: "Total revenue",
    value: "₹6.42L",
    note: "current period",
    delta: "14.2%",
    trend: "up",
  },
  {
    label: "Total orders",
    value: "291",
    note: "across 4 entities",
    delta: "8.6%",
    trend: "up",
  },
  {
    label: "Avg order value",
    value: "₹2,217",
    note: "per completed order",
    delta: "3.1%",
    trend: "up",
  },
  {
    label: "Estimated profit",
    value: "₹3.05L",
    note: "after COGS",
    delta: "5.4%",
    trend: "up",
  },
  {
    label: "Stock value",
    value: "₹64.6L",
    note: "on hand",
    delta: "1.8%",
    trend: "flat",
  },
  {
    label: "Pending payments",
    value: "₹18,420",
    note: "collections needed",
    delta: "2.2%",
    trend: "flat",
  },
];

export const heroAlerts: {
  label: string;
  detail: string;
  tone: "warn" | "critical" | "info";
}[] = [
  { label: "Low stock items", detail: "3 SKUs below reorder", tone: "warn" },
  { label: "Overdue payments", detail: "2 invoices overdue", tone: "critical" },
  { label: "Pending GRN", detail: "4 inward notes pending", tone: "info" },
  { label: "Dead stock", detail: "₹42K aging > 120 days", tone: "critical" },
  { label: "High return %", detail: "2.4% this period", tone: "warn" },
];

// 16 synthetic daily buckets, expressed in thousands of rupees.
export const heroSalesTrend = [
  44, 52, 47, 58, 51, 64, 57, 70, 62, 76, 68, 83, 73, 88, 79, 94,
] as const;

export const heroSalesTrendAxis = {
  from: "01 Aug",
  to: "16 Aug",
  peak: "₹94K",
  total: "₹6.42L",
  delta: "14.2%",
} as const;

export const heroBranchSales: { name: string; value: string; pct: number }[] = [
  { name: "Mumbai · HQ", value: "₹2.48L", pct: 100 },
  { name: "Pune · West", value: "₹1.71L", pct: 69 },
  { name: "Surat · Hub", value: "₹1.32L", pct: 53 },
  { name: "Nagpur · Store", value: "₹0.91L", pct: 37 },
];

export const heroActivity: {
  title: string;
  ref: string;
  time: string;
  tone: "sale" | "move" | "money" | "inward" | "return";
}[] = [
  { title: "Order placed", ref: "ORD-20481", time: "2 min", tone: "sale" },
  { title: "Stock transfer completed", ref: "TRF-1174", time: "8 min", tone: "move" },
  { title: "Payment reconciled", ref: "PAY-8830", time: "14 min", tone: "money" },
  { title: "GRN received", ref: "GRN-4412", time: "22 min", tone: "inward" },
  { title: "Return processed", ref: "RET-0925", time: "35 min", tone: "return" },
];

export const heroTopProducts: { name: string; units: string; pct: number }[] = [
  { name: "Aurora Stone Ring", units: "148", pct: 100 },
  { name: "Celeste Pearl Drop", units: "126", pct: 85 },
  { name: "Meridian Gold Bali", units: "94", pct: 63 },
  { name: "Halo Solitaire Nath", units: "71", pct: 48 },
];

export const heroWorstProducts: { name: string; units: string }[] = [
  { name: "Onyx Square Stud", units: "3" },
  { name: "Petal Long Chain", units: "2" },
  { name: "Ivory Twist Cuff", units: "1" },
  { name: "Dusk Coral Bangle", units: "1" },
];

export const heroInventory: {
  label: string;
  value: string;
  pct: number;
  note: string;
  tone: "good" | "watch" | "risk";
}[] = [
  { label: "Total stock value", value: "₹64.6L", pct: 88, note: "Balanced", tone: "good" },
  { label: "Fast movers", value: "72 SKUs", pct: 71, note: "+6 this week", tone: "good" },
  { label: "Low stock", value: "8 SKUs", pct: 18, note: "Reorder", tone: "watch" },
  { label: "Dead stock value", value: "₹42K", pct: 9, note: "> 120 days", tone: "risk" },
];

export const heroInsights = {
  revenue: {
    label: "Real-time revenue",
    value: "₹6.42L",
    delta: "14.2%",
    caption: "vs previous",
  },
  inventory: {
    label: "Inventory health",
    value: "94.8%",
    delta: "Healthy",
    caption: "4 locations",
  },
} as const;
