import {
  Barcode,
  Clock,
  ReceiptIndianRupee,
  Tags,
  Truck,
  type LucideIcon,
} from "lucide-react";

/**
 * The five cross-cutting features (SRS 5.5). Modules are what a brand buys;
 * these are the details that decide whether the numbers the modules report
 * are actually true. Each one owns a full viewport on /features and is
 * showcased through its own mechanism, so this file carries only the shared
 * spine: identity, index-rail copy and the module cross-links.
 */
export type FeatureId =
  | "barcode"
  | "billing-counters"
  | "gst-compliance"
  | "series-pricing"
  | "stock-transfer";

export type FeatureSummary = {
  id: FeatureId;
  index: string;
  title: string;
  discipline: string;
  rail: string;
  icon: LucideIcon;
  /** Tints the section, its rail marker and the hero instrument. */
  accent: string;
  /** Light sections read on white; dark ones on navy. */
  tone: "light" | "dark";
};

export const featureSummaries: readonly FeatureSummary[] = [
  {
    id: "barcode",
    index: "01",
    title: "Barcode",
    discipline: "Piece identity",
    rail: "Which one it is — not just what it is",
    icon: Barcode,
    accent: "#2f6bff",
    tone: "light",
  },
  {
    id: "billing-counters",
    index: "02",
    title: "Billing counters",
    discipline: "Counter control",
    rail: "A shift that has to balance before it closes",
    icon: Clock,
    accent: "#2ec4b6",
    tone: "dark",
  },
  {
    id: "gst-compliance",
    index: "03",
    title: "GST compliance",
    discipline: "Tax truth",
    rail: "Captured at the transaction, not at month-end",
    icon: ReceiptIndianRupee,
    accent: "#4a86ff",
    tone: "light",
  },
  {
    id: "series-pricing",
    index: "04",
    title: "Series pricing",
    discipline: "Price discipline",
    rail: "One series, one approved set of rates",
    icon: Tags,
    accent: "#f0a020",
    tone: "dark",
  },
  {
    id: "stock-transfer",
    index: "05",
    title: "Stock transfer",
    discipline: "Movement visibility",
    rail: "Stock in transit is still stock you can see",
    icon: Truck,
    accent: "#2ec4b6",
    tone: "light",
  },
];

export type RelatedModule = { label: string; href: string };

export const relatedModules: Record<FeatureId, readonly RelatedModule[]> = {
  barcode: [
    { label: "Inventory", href: "/modules/inventory" },
    { label: "Procurement", href: "/modules/procurement" },
    { label: "Sales & POS", href: "/modules/sales-pos" },
  ],
  "billing-counters": [
    { label: "Sales & POS", href: "/modules/sales-pos" },
    { label: "Accounting", href: "/modules/accounting" },
    { label: "Security", href: "/modules/security" },
  ],
  "gst-compliance": [
    { label: "Accounting", href: "/modules/accounting" },
    { label: "Wholesale", href: "/modules/wholesale" },
    { label: "Sales & POS", href: "/modules/sales-pos" },
  ],
  "series-pricing": [
    { label: "Procurement", href: "/modules/procurement" },
    { label: "Wholesale", href: "/modules/wholesale" },
    { label: "Franchise", href: "/modules/franchise" },
  ],
  "stock-transfer": [
    { label: "Inventory", href: "/modules/inventory" },
    { label: "Franchise", href: "/modules/franchise" },
    { label: "Analytics", href: "/modules/analytics" },
  ],
};
