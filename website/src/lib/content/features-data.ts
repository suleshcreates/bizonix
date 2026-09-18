import {
  Barcode,
  Calculator,
  ReceiptText,
  ScanLine,
  Truck,
} from "lucide-react";

/**
 * Summary rows for the /features/[slug] deep pages. The /features index runs
 * off the richer model in `content/features/`, which carries the per-feature
 * product data those viewports animate.
 */
export const featuresData = [
  {
    slug: "barcode",
    title: "Barcode",
    description:
      "Unique piece identity across print, reprint, sales and returns.",
    annotation: "Piece identity",
    icon: Barcode,
    image: "/images/industries/overview/apparel-operations.webp",
  },
  {
    slug: "billing-counters",
    title: "Billing Counters",
    description:
      "Counter assignment, open and close sessions, and cash controls.",
    annotation: "Counter control",
    icon: ReceiptText,
    image: "/images/product/day-in-life/day-counter-sale.webp",
  },
  {
    slug: "gst-compliance",
    title: "GST Compliance",
    description:
      "Tax invoices, party GSTIN and e-way adjacency in the operating flow.",
    annotation: "Tax context",
    icon: Calculator,
    image: "/images/product/day-in-life/day-month-end-books.webp",
  },
  {
    slug: "series-pricing",
    title: "Series Pricing",
    description: "Purchase series and selling rates with disciplined context.",
    annotation: "Price discipline",
    icon: ScanLine,
    image: "/images/modules/overview/inventory.jpg",
  },
  {
    slug: "stock-transfer",
    title: "Stock Transfer",
    description: "HQ to franchise and branch movement with clear visibility.",
    annotation: "Movement context",
    icon: Truck,
    image: "/images/product/day-in-life/day-franchise-transfer.webp",
  },
] as const;
