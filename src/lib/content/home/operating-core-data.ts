/**
 * Marketing-only local data for the "Three entities. One set of books."
 * section. Nothing here is connected to customer, operational or production
 * data — every figure on the three illustrative cards is invented, derives
 * arithmetically from the figure above it, and is labelled "Sample data" in
 * the UI.
 */

/** The three operating entities. Order is left → middle → right on desktop. */
export const operatingLanes = [
  {
    id: "wholesale",
    label: "Wholesale HQ",
    title: "Allocate before you dispatch.",
    body: "Hold stock for the network, release it against real demand, and always know what is committed where.",
    image: "/images/product/ecosystem/wholesale.png",
    /** The document this lane sends into the core. Shown on its card too. */
    token: "GRN #4821",
  },
  {
    id: "retail",
    label: "Company retail / POS",
    title: "Bill without slowing the counter.",
    body: "Sell, exchange and close the till on the same record your books and your GST returns read from.",
    image: "/images/product/ecosystem/retail-pos.png",
    token: "INV-2231",
  },
  {
    id: "franchise",
    label: "Franchise outlets",
    title: "Autonomy inside your guardrails.",
    body: "Partners request, receive and sell on their own — within the pricing and stock rules you set for them.",
    image: "/images/product/ecosystem/franchise.png",
    token: "TRF-118",
  },
] as const;

export type OperatingLane = (typeof operatingLanes)[number];

/**
 * Allocation split. Both rows derive from Committed (6,280):
 *   6,280 × 0.72 = 4,521.6 → 4,522 pcs
 *   6,280 × 0.28 = 1,758.4 → 1,758 pcs
 *   4,522 + 1,758 = 6,280
 */
export const allocation = {
  available: "18,420",
  committed: "6,280",
  splits: [
    { label: "Retail network", share: 0.72, pct: "72%", pieces: "4,522 pcs" },
    { label: "Franchise pool", share: 0.28, pct: "28%", pieces: "1,758 pcs" },
  ],
} as const;

/**
 * Counter sale. Both lines are apparel at the 12% slab, so a single
 * CGST/SGST pair is honest:
 *   1,650 + 2,270            = 3,920.00 taxable
 *   3,920 × 6%               =   235.20 CGST  (and the same again as SGST)
 *   3,920 + 235.20 + 235.20  = 4,390.40 payable
 * Line amounts are shown exclusive of tax, which is what makes the card
 * checkable — an MRP-inclusive basket at mixed slabs would not be.
 */
export const counterSale = {
  counter: "Counter 04",
  lines: [
    { name: "Cotton Kurta — Indigo", amount: "₹1,650.00" },
    { name: "Classic Oxford Shirt", amount: "₹2,270.00" },
  ],
  taxable: "₹3,920.00",
  cgst: "₹235.20",
  sgst: "₹235.20",
  total: "₹4,390.40",
} as const;

/** Franchise replenishment request, sitting inside its outlet's permissions. */
export const replenishment = {
  item: "Jhumka set — antique gold",
  pieces: "24 pieces",
  state: "Ready",
  steps: [
    { label: "Requested", done: true },
    { label: "Allocated", done: true },
    { label: "Dispatch", done: false },
  ],
} as const;

/** The four consequences, revealed after the convergence resolves. */
export const coreCards = [
  {
    title: "Same piece identity",
    body: "The barcode printed at goods receipt is the barcode scanned at the franchise till. Nobody re-labels a piece when it changes hands.",
  },
  {
    title: "Entity-aware movement",
    body: "Send stock between legal entities and Bizonix records the outward sale and inward purchase in the right books automatically.",
  },
  {
    title: "Nothing is re-entered",
    body: "Billed once at the counter. Stock, ledger and GST all move from that one entry.",
  },
  {
    title: "Real-time visibility",
    body: "What a franchise sold this morning is reflected in HQ’s stock position now—not after monthly reconciliation.",
  },
] as const;
