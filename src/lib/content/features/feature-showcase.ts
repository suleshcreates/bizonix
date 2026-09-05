import type { FeatureId } from "./features";

/**
 * The page-level copy for /features.
 *
 * `features.ts` holds the spine (identity, accent, rail line). This holds what
 * the page argues with: the promise each feature makes in the hero, the real
 * product screen it is shown on, and the headline / reasoning / proof its slab
 * carries further down. Mechanism data — a piece record, a session ledger, a
 * price ladder — stays in its own file next to this one.
 */
export type FeatureShowcase = {
  /** Hero: the sentence that lands when this row opens. */
  promise: string;
  /** Hero: the real product screen behind the promise. */
  screen: {
    src: string;
    alt: string;
    /** Window-chrome label on the hero frame. */
    label: string;
    /** Crop anchor for the screenshot. */
    position: string;
  };
  /** Hero: the annotation pinned over the screen. */
  chip: { value: string; note: string };
  /** Slab: the argument. */
  headline: string;
  why: string;
  proof: readonly { label: string; body: string }[];
};

export const featureShowcase: Record<FeatureId, FeatureShowcase> = {
  barcode: {
    promise: "Every piece carries its own code, from receiving to the counter.",
    screen: {
      src: "/images/shared/product-screens/barcodes.png",
      alt: "Bizonix barcode register: one generated code per piece, with in-stock counts, print quantities and the legacy design code beside it.",
      label: "Inventory · barcode register",
      position: "left top",
    },
    chip: { value: "000000009139", note: "one code, one piece" },
    headline: "Every piece has to answer for itself.",
    why: "A style code tells you what something is. A piece barcode tells you which one — which purchase series it arrived on, which outlet holds it, which bill it left on. Identity at the piece level is what stops a stock count from becoming an argument.",
    proof: [
      {
        label: "Issued at receiving",
        body: "Codes are generated as the GRN posts and labels print in the same pass. Nothing enters stock unidentified.",
      },
      {
        label: "Read by everything",
        body: "Billing, returns, transfer and audit all read the same identity. Nobody keys a style code by hand.",
      },
      {
        label: "Replaceable label, fixed identity",
        body: "A damaged label reprints against the same piece. The sticker changes; what it points at never does.",
      },
    ],
  },

  "billing-counters": {
    promise:
      "A shift opens with a declared float and closes only when it balances.",
    screen: {
      src: "/images/shared/product-screens/orders.png",
      alt: "Bizonix order log: every bill stamped with its counter, payment state, paid amount and fulfilment status.",
      label: "Sales · counter order log",
      position: "left top",
    },
    chip: { value: "₹41,450", note: "expected = counted" },
    headline: "A shift that has to balance before it closes.",
    why: "The counter is where cash and stock meet, and where both quietly go missing. In Bizonix a counter belongs to one person for the length of a session: every bill, return and payment mode is stamped with it, and the session cannot close until the drawer agrees with the ledger.",
    proof: [
      {
        label: "One counter, one owner",
        body: "A session names the operator and the terminal. Activity without an open session has nowhere to go.",
      },
      {
        label: "Cash declared at both ends",
        body: "An opening float is entered and timestamped; closing cash is counted against what the session says it holds.",
      },
      {
        label: "Closed means closed",
        body: "A shut session cannot be re-billed into or quietly edited, so yesterday stops moving while you report on it.",
      },
    ],
  },

  "gst-compliance": {
    promise: "Tax position is decided at the bill, not rebuilt at month-end.",
    screen: {
      src: "/images/shared/product-screens/purchases.png",
      alt: "Bizonix purchase register: supplier documents with invoice reference, quantity, amount and received status per entry.",
      label: "Accounting · document trail",
      position: "left top",
    },
    chip: {
      value: "27AABCS1429B1ZP",
      note: "validated once, carried everywhere",
    },
    headline: "Tax truth is captured at the transaction.",
    why: "Month-end GST work is usually archaeology — chasing party GSTINs, guessing the place of supply, correcting HSN on invoices already issued. Bizonix settles all of it the moment a bill is raised, from masters that were validated once and are carried everywhere after.",
    proof: [
      {
        label: "Party GSTIN",
        body: "Held on the party master and validated once, so it is never retyped onto a bill.",
      },
      {
        label: "Place of supply",
        body: "Decides CGST + SGST or IGST while billing, instead of in a spreadsheet three weeks later.",
      },
      {
        label: "HSN and rate",
        body: "Carried by the item, so a product is taxed the same way at every counter and every entity.",
      },
      {
        label: "Invoice series",
        body: "Numbering is controlled per entity — no duplicate and no missing invoice number to explain.",
      },
    ],
  },

  "series-pricing": {
    promise: "One purchase series carries one approved set of rates.",
    screen: {
      src: "/images/shared/product-screens/series-ledger.png",
      alt: "Bizonix series ledger: each purchase entry with pieces opened, sold, in stock, sell-through and value.",
      label: "Procurement · series ledger",
      position: "left top",
    },
    chip: { value: "S-2451", note: "240 pieces · one rate card" },
    headline: "One series, one approved set of rates.",
    why: "Rates drift when they live in memory. A series arrives with its purchase rate, picks up landed cost, and then carries the wholesale, franchise and retail rates it is allowed to be sold at — so the counter bills from the series the piece arrived on rather than from what someone recalls.",
    proof: [
      {
        label: "Cost is the base, not a note",
        body: "Freight and handling land on the series, so landed cost is the number the ladder is built on.",
      },
      {
        label: "Discount needs a role",
        body: "Going below the approved floor is a permission, not a habit. The bill records who allowed it.",
      },
      {
        label: "Each partner sees its own rung",
        body: "Franchise outlets bill at the franchise rate and never see the wholesale sheet behind it.",
      },
    ],
  },

  "stock-transfer": {
    promise: "Stock in transit is still stock you can see, count and own.",
    screen: {
      src: "/images/shared/product-screens/stock-list.png",
      alt: "Bizonix stock list: pieces, stock value and lines by location, with per-line quantity, rate and warehouse.",
      label: "Inventory · stock by location",
      position: "left top",
    },
    chip: { value: "TRF-1184", note: "48 pieces on the road" },
    headline: "Stock in transit is still stock you can see.",
    why: "Between the warehouse gate and the outlet shelf most systems lose the consignment: HQ has written it off, the outlet has not received it, and nobody owns the difference. Bizonix keeps the movement as a position of its own — requested, approved, dispatched, in transit, received, posted.",
    proof: [
      {
        label: "Dispatch moves the number",
        body: "HQ stock drops when pieces are scanned out, not when someone remembers to file the challan.",
      },
      {
        label: "In transit is a real place",
        body: "The consignment sits in a visible position that is owned, counted and on the books while it travels.",
      },
      {
        label: "Shortfalls name the piece",
        body: "Receiving scans each piece, so a short receipt shows as a variance against dispatch — by piece.",
      },
    ],
  },
};

/**
 * The dark band mid-page: what each of the five stamps onto the one record
 * every module reads afterwards. Order matches `featureSummaries`.
 */
export const recordStamps: readonly {
  id: FeatureId;
  field: string;
  value: string;
  note: string;
}[] = [
  {
    id: "barcode",
    field: "Piece",
    value: "0187 of 0240 · S-2451",
    note: "Which physical piece this is — not which style.",
  },
  {
    id: "billing-counters",
    field: "Session",
    value: "Counter 2 · Meera S.",
    note: "Who was on the counter, in which shift, against which float.",
  },
  {
    id: "gst-compliance",
    field: "Tax position",
    value: "27AABCS1429B1ZP · CGST + SGST",
    note: "Settled from the party and the place of supply while billing.",
  },
  {
    id: "series-pricing",
    field: "Rate",
    value: "₹1,340 · franchise rung",
    note: "The approved rate the arriving series carries.",
  },
  {
    id: "stock-transfer",
    field: "Position",
    value: "In transit · TRF-1184",
    note: "Where the piece is, including while it is on the road.",
  },
];

/** Base fields on the record before any of the five write to it. */
export const recordBase = [
  { field: "Style", value: "KUR-4412 · Anarkali" },
  { field: "Size / colour", value: "M · Indigo" },
] as const;
