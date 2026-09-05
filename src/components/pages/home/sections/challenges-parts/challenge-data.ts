import {
  Clock,
  Copy,
  MapPin,
  MessageSquareOff,
  ScanBarcode,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * The six operating problems behind "Why brands outgrow spreadsheets".
 *
 * One list, two renderers: the desktop radial constellation and the mobile
 * vertical flow both read from here, so the story can never drift between
 * breakpoints.
 */
export type ChallengeItem = {
  /** Display index, also the label on the flow node. */
  number: string;
  /** Short uppercase context line ("24 hours blind"). */
  tag: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Status chip copy ("T+24H delay"). */
  stat: string;
  /** Warning-toned chip, as opposed to a neutral measurement. */
  statAlert: boolean;
};

export const challengeItems: readonly ChallengeItem[] = [
  {
    number: "01",
    tag: "24 hours blind",
    title: "Visibility arrives late",
    description:
      "By the time spreadsheets reconcile, yesterday's stock decisions have already aged.",
    icon: Clock,
    stat: "T+24H delay",
    statAlert: true,
  },
  {
    number: "02",
    tag: "1,248 here · 0 there",
    title: "Stock exists—but not where needed",
    description:
      "Warehouse totals hide store-level gaps, variants and sell-through.",
    icon: MapPin,
    stat: "1,248 vs 0",
    statAlert: false,
  },
  {
    number: "03",
    tag: "Order never entered",
    title: "Franchise orders drift off-system",
    description: "Calls and chat threads turn allocation into guesswork.",
    icon: MessageSquareOff,
    stat: "Untracked chat",
    statAlert: true,
  },
  {
    number: "04",
    tag: "₹30K unexplained",
    title: "Month-end becomes detective work",
    description:
      "Sales, returns, receipts and transfers do not meet in one ledger.",
    icon: Search,
    stat: "₹30K mismatch",
    statAlert: true,
  },
  {
    number: "05",
    tag: "Same data. Typed twice.",
    title: "GST context gets re-entered",
    description:
      "Operational documents and accounting records fall out of sync.",
    icon: Copy,
    stat: "Duplicate risk",
    statAlert: true,
  },
  {
    number: "06",
    tag: "The return has no memory",
    title: "Piece identity disappears",
    description:
      "Without barcode truth, returns and transfers lose traceability.",
    icon: ScanBarcode,
    stat: "Unknown piece",
    statAlert: true,
  },
];

/** Where the story turns: the three problems above sit before the hub. */
export const HUB_SPLIT = 3;
