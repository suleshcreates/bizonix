import {
  ArrowUpRight,
  Barcode,
  Calculator,
  Eye,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * The Operating Workflow: one record moving through six steps.
 *
 * Shared by both renderers. The desktop map adds its own canvas coordinates
 * and per-step accent on top of this list; the handset flow deliberately
 * takes neither, so the story can never drift between breakpoints while the
 * compositions stay independent.
 */
export type JourneyStep = {
  number: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

export const journey: readonly JourneyStep[] = [
  {
    number: "01",
    title: "Purchase / GRN",
    body: "Goods received from suppliers and recorded as GRN.",
    icon: ShoppingCart,
  },
  {
    number: "02",
    title: "Stock Transfer",
    body: "Move stock between locations and warehouses efficiently.",
    icon: Truck,
  },
  {
    number: "03",
    title: "Barcode",
    body: "Generate and scan barcodes for accurate tracking and traceability.",
    icon: Barcode,
  },
  {
    number: "04",
    title: "POS / Wholesale",
    body: "Sell via POS or manage wholesale transactions seamlessly.",
    icon: Calculator,
  },
  {
    number: "05",
    title: "Returns",
    body: "Handle product returns and reverse flow smoothly.",
    icon: RotateCcw,
  },
  {
    number: "06",
    title: "Accounting",
    body: "All transactions flow into accounting for real-time reconciliation.",
    icon: Calculator,
  },
];

/** Where the Operating Core sits: the flow passes through it after step 03. */
export const CORE_SPLIT = 3;

export type Principle = {
  title: string;
  body: string;
  icon: LucideIcon;
};

export const principles: readonly Principle[] = [
  {
    title: "Same Piece Identity",
    body: "Track the same item across every step",
    icon: ShieldCheck,
  },
  {
    title: "Entity-Aware Movement",
    body: "Every movement is linked to the right entity",
    icon: Eye,
  },
  {
    title: "Nothing is Re-entered",
    body: "Data flows automatically without duplicate entry",
    icon: LockKeyhole,
  },
  {
    title: "Real-time Visibility",
    body: "Complete transparency at every step",
    icon: ArrowUpRight,
  },
];
