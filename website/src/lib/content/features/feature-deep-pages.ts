import {
  ArrowLeftRight,
  Barcode,
  BadgeCheck,
  CalendarClock,
  ClipboardCheck,
  Coins,
  FileCheck2,
  Fingerprint,
  Gauge,
  History,
  LockKeyhole,
  MapPin,
  Percent,
  Printer,
  ReceiptIndianRupee,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Tags,
  Timer,
  Truck,
  Undo2,
  UserCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { FeatureId } from "./features";

/**
 * Content for the two sections that follow the hero on every feature deep
 * page — "Why it matters" and "How it works".
 *
 * ONE template renders all five. This file carries content only: no widths,
 * no spacing, no layout decisions. The shared components in
 * components/pages/features/deep/ own the geometry, and that geometry is the
 * same on /features/barcode as it is on /features/stock-transfer.
 *
 * The product simulation is a real application shell — chrome, breadcrumb, a
 * record list and a detail pane — identical on all five pages. What changes is
 * the records it lists and the mechanism its detail pane draws.
 */

/* --------------------------------------------------------------- section 01 */

export type BenefitItem = { label: string; icon: LucideIcon };

/** The one mechanism a feature is allowed to draw differently. */
export type SimVisual =
  | { kind: "barcode"; code: string; caption: string }
  | {
      kind: "session";
      counter: string;
      operator: string;
      opened: string;
      progress: number;
    }
  | {
      kind: "tax";
      total: string;
      segments: readonly { label: string; value: string; share: number }[];
    }
  | {
      kind: "ladder";
      applied: string;
      rungs: readonly { label: string; value: string; share: number }[];
    }
  | {
      kind: "route";
      from: string;
      fromPlace: string;
      to: string;
      toPlace: string;
      progress: number;
    };

export type SimRecord = { label: string; value: string };

/** One selectable row in the simulation's record list. */
export type SimRow = {
  id: string;
  primary: string;
  secondary: string;
  value: string;
  state: string;
  tone: "ok" | "live" | "warn";
  /** What the detail pane shows while this row is selected. */
  detail: {
    title: string;
    plate: SimVisual;
    record: readonly [SimRecord, SimRecord, SimRecord, SimRecord];
    footer: string;
  };
};

export type FeatureSimulationData = {
  /** Application chrome. */
  workspace: string;
  crumb: string;
  /** Column headers over the record list. */
  columns: readonly [string, string, string];
  /** How many records the filtered view holds, for the list footer. */
  total: string;
  rows: readonly [SimRow, SimRow, SimRow];
  /** Detail-pane actions: one solid, one quiet. */
  actions: readonly [string, string];
};

/* --------------------------------------------------------------- section 02 */

export type ProcessStep = {
  title: string;
  body: string;
  /** The product fragment beside the step copy. */
  ui: {
    icon: LucideIcon;
    label: string;
    field: string;
    pill: string;
    tone: "ok" | "live" | "action";
    meta: string;
  };
};

export type FeatureDeepPage = {
  /**
   * Headline in two parts: the plain half, then the half carrying the
   * blue→cyan emphasis. Each half stays on one line at the locked type size.
   */
  whyHeadline: readonly [string, string];
  whyBody: string;
  benefits: readonly [BenefitItem, BenefitItem, BenefitItem];
  simulation: FeatureSimulationData;
  howHeadline: readonly [string, string];
  howBody: string;
  /** Exactly four. The timeline geometry is locked to four. */
  steps: readonly [ProcessStep, ProcessStep, ProcessStep, ProcessStep];
};

export const featureDeepPages: Record<FeatureId, FeatureDeepPage> = {
  /* ------------------------------------------------------------- 01 barcode */
  barcode: {
    whyHeadline: ["Every piece keeps", "its own identity."],
    whyBody:
      "A code is issued as the goods are received and read the same way at print, sale and return — so a count names the piece rather than a quantity.",
    benefits: [
      { label: "Fewer mismatches", icon: Fingerprint },
      { label: "Faster transactions", icon: ScanLine },
      { label: "Complete piece history", icon: History },
    ],
    simulation: {
      workspace: "Inventory",
      crumb: "Piece register",
      columns: ["Piece", "Item", "Status"],
      total: "1,284",
      actions: ["Print label", "View history"],
      rows: [
        {
          id: "p-0187",
          primary: "BZ-KUR-4412-0187",
          secondary: "Anarkali kurta · M · Indigo",
          value: "0187 / 0240",
          state: "In stock",
          tone: "ok",
          detail: {
            title: "Piece 0187",
            plate: {
              kind: "barcode",
              code: "BZ-KUR-4412-0187",
              caption: "Piece 0187 of 0240",
            },
            record: [
              { label: "Product", value: "Anarkali kurta" },
              { label: "Variant", value: "M · Indigo" },
              { label: "Series", value: "S-2451" },
              { label: "Location", value: "HQ warehouse" },
            ],
            footer: "Label printed 18 Aug · never reissued",
          },
        },
        {
          id: "p-0061",
          primary: "BZ-JWL-1180-0061",
          secondary: "Imitation set · Gold tone",
          value: "0061 / 0120",
          state: "Sold",
          tone: "live",
          detail: {
            title: "Piece 0061",
            plate: {
              kind: "barcode",
              code: "BZ-JWL-1180-0061",
              caption: "Piece 0061 of 0120",
            },
            record: [
              { label: "Product", value: "Imitation set" },
              { label: "Variant", value: "Gold tone" },
              { label: "Series", value: "S-2462" },
              { label: "Location", value: "Kalyan · Counter 2" },
            ],
            footer: "Sold 24 Aug · bill INV/27/1184",
          },
        },
        {
          id: "p-0143",
          primary: "BZ-DUP-2207-0143",
          secondary: "Banarasi dupatta · Maroon",
          value: "0143 / 0200",
          state: "Returned",
          tone: "warn",
          detail: {
            title: "Piece 0143",
            plate: {
              kind: "barcode",
              code: "BZ-DUP-2207-0143",
              caption: "Piece 0143 of 0200",
            },
            record: [
              { label: "Product", value: "Banarasi dupatta" },
              { label: "Variant", value: "Maroon" },
              { label: "Series", value: "S-2455" },
              { label: "Location", value: "Kalyan · returns" },
            ],
            footer: "Returned 26 Aug · original bill matched",
          },
        },
      ],
    },
    howHeadline: ["One identity,", "four moments."],
    howBody:
      "The same code is read by every counter, every return desk and every audit — nothing is keyed by hand.",
    steps: [
      {
        title: "Identify",
        body: "Each piece gets its own code as the goods arrive.",
        ui: {
          icon: Barcode,
          label: "Piece register",
          field: "BZ-KUR-4412-0187",
          pill: "Identified",
          tone: "ok",
          meta: "Issued against GRN 18 Aug",
        },
      },
      {
        title: "Print or reprint",
        body: "The label is replaceable; the identity never is.",
        ui: {
          icon: Printer,
          label: "Label preview",
          field: "KUR-4412 · M · Indigo",
          pill: "Print",
          tone: "action",
          meta: "Reprint keeps the same code",
        },
      },
      {
        title: "Scan sale",
        body: "The counter resolves the exact piece, not just the style.",
        ui: {
          icon: ScanLine,
          label: "Counter scan",
          field: "BZ-KUR-4412-0187",
          pill: "Resolved",
          tone: "live",
          meta: "Counter 2 · 19:22",
        },
      },
      {
        title: "Scan return",
        body: "The original record comes back with the piece.",
        ui: {
          icon: Undo2,
          label: "Return lookup",
          field: "INV/27/1184",
          pill: "Matched",
          tone: "ok",
          meta: "Original bill and rate found",
        },
      },
    ],
  },

  /* ---------------------------------------------------- 02 billing counters */
  "billing-counters": {
    whyHeadline: ["Every shift", "closes clean."],
    whyBody:
      "A counter belongs to one person for the length of a shift, and every bill, return and payment mode is stamped with that session before it can be closed.",
    benefits: [
      { label: "Clear counter ownership", icon: UserCheck },
      { label: "Faster reconciliation", icon: Wallet },
      { label: "Accountable sessions", icon: LockKeyhole },
    ],
    simulation: {
      workspace: "Billing",
      crumb: "Counter sessions",
      columns: ["Counter", "Operator", "State"],
      total: "3",
      actions: ["Close session", "Cash summary"],
      rows: [
        {
          id: "c-2",
          primary: "Counter 2",
          secondary: "Meera S. · since 09:04",
          value: "48 bills",
          state: "Open",
          tone: "live",
          detail: {
            title: "Session SES-0914",
            plate: {
              kind: "session",
              counter: "Counter 2",
              operator: "Meera S.",
              opened: "09:04",
              progress: 78,
            },
            record: [
              { label: "Opening float", value: "₹2,000" },
              { label: "Bills · returns", value: "48 · 3" },
              { label: "Cash sales", value: "₹41,350" },
              { label: "Expected", value: "₹41,450" },
            ],
            footer: "Counted ₹41,450 · balanced, ready to close",
          },
        },
        {
          id: "c-1",
          primary: "Counter 1",
          secondary: "Anil K. · 09:00 – 18:00",
          value: "62 bills",
          state: "Closed",
          tone: "ok",
          detail: {
            title: "Session SES-0912",
            plate: {
              kind: "session",
              counter: "Counter 1",
              operator: "Anil K.",
              opened: "09:00",
              progress: 100,
            },
            record: [
              { label: "Opening float", value: "₹2,000" },
              { label: "Bills · returns", value: "62 · 1" },
              { label: "Cash sales", value: "₹56,180" },
              { label: "Expected", value: "₹58,180" },
            ],
            footer: "Closed 18:04 · no variance, locked to re-billing",
          },
        },
        {
          id: "c-3",
          primary: "Counter 3",
          secondary: "Unassigned · festival counter",
          value: "0 bills",
          state: "Idle",
          tone: "warn",
          detail: {
            title: "No open session",
            plate: {
              kind: "session",
              counter: "Counter 3",
              operator: "Unassigned",
              opened: "—",
              progress: 0,
            },
            record: [
              { label: "Opening float", value: "—" },
              { label: "Bills · returns", value: "0 · 0" },
              { label: "Cash sales", value: "₹0" },
              { label: "Expected", value: "₹0" },
            ],
            footer: "Assign an operator before this counter can bill",
          },
        },
      ],
    },
    howHeadline: ["A shift that", "has to balance."],
    howBody:
      "Assignment, float, activity and handover are four states of one session — and a closed session cannot be re-billed into.",
    steps: [
      {
        title: "Open counter",
        body: "One operator holds the counter for a whole shift.",
        ui: {
          icon: UserCheck,
          label: "Counter assignment",
          field: "Counter 2 → Meera S.",
          pill: "Assigned",
          tone: "ok",
          meta: "Morning shift · float ₹2,000",
        },
      },
      {
        title: "Record sales",
        body: "Every bill, return and payment mode carries the session.",
        ui: {
          icon: ReceiptIndianRupee,
          label: "Session activity",
          field: "48 bills · 3 returns",
          pill: "Stamped",
          tone: "live",
          meta: "₹41,350 across cash, card and UPI",
        },
      },
      {
        title: "Track session",
        body: "The drawer's expected position stays live all day.",
        ui: {
          icon: CalendarClock,
          label: "Expected in drawer",
          field: "₹41,450",
          pill: "Live",
          tone: "action",
          meta: "Float + cash sales − returns paid out",
        },
      },
      {
        title: "Close and reconcile",
        body: "Counted cash is set against what the session holds.",
        ui: {
          icon: LockKeyhole,
          label: "Handover",
          field: "₹41,450 counted",
          pill: "Balanced",
          tone: "ok",
          meta: "Closed sessions cannot be re-billed",
        },
      },
    ],
  },

  /* ----------------------------------------------------- 03 gst compliance */
  "gst-compliance": {
    whyHeadline: ["Tax truth,", "at the source."],
    whyBody:
      "GSTIN, place of supply and rate are settled while the bill is being raised, so the return is assembled from records that were already correct.",
    benefits: [
      { label: "Accurate tax capture", icon: Percent },
      { label: "Traceable invoices", icon: FileCheck2 },
      { label: "Cleaner compliance", icon: ShieldCheck },
    ],
    simulation: {
      workspace: "Compliance",
      crumb: "Tax invoices",
      columns: ["Invoice", "Party", "State"],
      total: "486",
      actions: ["Download invoice", "Open ledger"],
      rows: [
        {
          id: "inv-1184",
          primary: "INV/27/1184",
          secondary: "Shree Fashion House · 27",
          value: "₹32,748.80",
          state: "Validated",
          tone: "ok",
          detail: {
            title: "Intra-state supply",
            plate: {
              kind: "tax",
              total: "₹32,748.80",
              segments: [
                { label: "Taxable", value: "₹29,240.00", share: 62 },
                { label: "CGST 6%", value: "₹1,754.40", share: 19 },
                { label: "SGST 6%", value: "₹1,754.40", share: 19 },
              ],
            },
            record: [
              { label: "Party", value: "Shree Fashion House" },
              { label: "GSTIN", value: "27AABCS1429B1ZP" },
              { label: "Place of supply", value: "Maharashtra · 27" },
              { label: "HSN · rate", value: "6204 · 12%" },
            ],
            footer: "Ready for GSTR-1 · September · no re-entry",
          },
        },
        {
          id: "inv-1183",
          primary: "INV/27/1183",
          secondary: "Kalyan Retail · 27",
          value: "₹8,940.00",
          state: "Validated",
          tone: "ok",
          detail: {
            title: "Intra-state supply",
            plate: {
              kind: "tax",
              total: "₹8,940.00",
              segments: [
                { label: "Taxable", value: "₹7,982.14", share: 66 },
                { label: "CGST 6%", value: "₹478.93", share: 17 },
                { label: "SGST 6%", value: "₹478.93", share: 17 },
              ],
            },
            record: [
              { label: "Party", value: "Kalyan Retail" },
              { label: "GSTIN", value: "27AAFCK9921L1ZQ" },
              { label: "Place of supply", value: "Maharashtra · 27" },
              { label: "HSN · rate", value: "6204 · 12%" },
            ],
            footer: "Raised at Counter 2 · captured at the transaction",
          },
        },
        {
          id: "inv-1182",
          primary: "INV/27/1182",
          secondary: "Nashik Distributors · 24",
          value: "₹1,24,600.00",
          state: "IGST",
          tone: "live",
          detail: {
            title: "Inter-state supply",
            plate: {
              kind: "tax",
              total: "₹1,24,600.00",
              segments: [
                { label: "Taxable", value: "₹1,11,250.00", share: 74 },
                { label: "IGST 12%", value: "₹13,350.00", share: 26 },
                { label: "Cess", value: "₹0.00", share: 0 },
              ],
            },
            record: [
              { label: "Party", value: "Nashik Distributors" },
              { label: "GSTIN", value: "24AACCN4471M1Z8" },
              { label: "Place of supply", value: "Gujarat · 24" },
              { label: "HSN · rate", value: "6204 · 12%" },
            ],
            footer: "Place of supply decided IGST at billing, not month-end",
          },
        },
      ],
    },
    howHeadline: ["Compliance as", "a by-product."],
    howBody:
      "Nothing is retyped at month-end. The document the counter raised is the document the return is built from.",
    steps: [
      {
        title: "Capture tax",
        body: "Party context and place of supply come off the master.",
        ui: {
          icon: ClipboardCheck,
          label: "Party context",
          field: "27AABCS1429B1ZP",
          pill: "Verified",
          tone: "ok",
          meta: "Maharashtra · intra-state supply",
        },
      },
      {
        title: "Validate",
        body: "HSN and rate are carried by the item, not chosen by hand.",
        ui: {
          icon: Percent,
          label: "Rate resolution",
          field: "HSN 6204 · 12%",
          pill: "Resolved",
          tone: "live",
          meta: "6% + 6% on ₹29,240 taxable value",
        },
      },
      {
        title: "Generate invoice",
        body: "Numbering is controlled per entity, with no gaps.",
        ui: {
          icon: FileCheck2,
          label: "Invoice series",
          field: "INV/27/1184",
          pill: "Issued",
          tone: "action",
          meta: "₹32,748.80 · 3 line items",
        },
      },
      {
        title: "Reconcile",
        body: "The books and the return read the same transaction.",
        ui: {
          icon: BadgeCheck,
          label: "Return workspace",
          field: "GSTR-1 · September",
          pill: "Ready",
          tone: "ok",
          meta: "Assembled from records already captured",
        },
      },
    ],
  },

  /* ------------------------------------------------------ 04 series pricing */
  "series-pricing": {
    whyHeadline: ["One series,", "one approved rate."],
    whyBody:
      "Each purchase series carries the rates it is allowed to sell at, so the counter, the distributor and the franchise never quote three different numbers.",
    benefits: [
      { label: "Controlled prices", icon: Tags },
      { label: "Fewer pricing errors", icon: Gauge },
      { label: "Consistent selling", icon: Coins },
    ],
    simulation: {
      workspace: "Pricing",
      crumb: "Rate approvals",
      columns: ["Series", "Item", "State"],
      total: "62",
      actions: ["Approve rates", "Price history"],
      rows: [
        {
          id: "s-2451",
          primary: "S-2451",
          secondary: "Anarkali kurta · festive",
          value: "₹1,340",
          state: "Approved",
          tone: "ok",
          detail: {
            title: "Franchise rate applied",
            plate: {
              kind: "ladder",
              applied: "Franchise",
              rungs: [
                { label: "Landed cost", value: "₹905", share: 50 },
                { label: "Wholesale", value: "₹1,180", share: 66 },
                { label: "Franchise", value: "₹1,340", share: 75 },
                { label: "Retail MRP", value: "₹1,799", share: 100 },
              ],
            },
            record: [
              { label: "Received", value: "18 Aug · 240 pcs" },
              { label: "Landed cost", value: "₹905" },
              { label: "Approved by", value: "HQ pricing" },
              { label: "Applied rate", value: "₹1,340" },
            ],
            footer: "Approved 19 Aug · overrides need a second approval",
          },
        },
        {
          id: "s-2438",
          primary: "S-2438",
          secondary: "Cotton kurta · core",
          value: "₹1,090",
          state: "Approved",
          tone: "ok",
          detail: {
            title: "Franchise rate applied",
            plate: {
              kind: "ladder",
              applied: "Franchise",
              rungs: [
                { label: "Landed cost", value: "₹712", share: 46 },
                { label: "Wholesale", value: "₹940", share: 61 },
                { label: "Franchise", value: "₹1,090", share: 71 },
                { label: "Retail MRP", value: "₹1,540", share: 100 },
              ],
            },
            record: [
              { label: "Received", value: "04 Aug · 480 pcs" },
              { label: "Landed cost", value: "₹712" },
              { label: "Approved by", value: "HQ pricing" },
              { label: "Applied rate", value: "₹1,090" },
            ],
            footer: "Two revisions since receipt · both authored and dated",
          },
        },
        {
          id: "s-2462",
          primary: "S-2462",
          secondary: "Imitation set · gold tone",
          value: "₹1,060",
          state: "Draft",
          tone: "warn",
          detail: {
            title: "Awaiting approval",
            plate: {
              kind: "ladder",
              applied: "Wholesale",
              rungs: [
                { label: "Landed cost", value: "₹690", share: 52 },
                { label: "Wholesale", value: "₹940", share: 71 },
                { label: "Franchise", value: "₹1,060", share: 80 },
                { label: "Retail MRP", value: "₹1,320", share: 100 },
              ],
            },
            record: [
              { label: "Received", value: "26 Aug · 120 pcs" },
              { label: "Landed cost", value: "₹690" },
              { label: "Approved by", value: "Pending" },
              { label: "Applied rate", value: "Not sellable" },
            ],
            footer: "Cannot be billed until HQ approves the ladder",
          },
        },
      ],
    },
    howHeadline: ["Price kept", "on a leash."],
    howBody:
      "Rates are set once against the series that arrived, and every downstream sale reads them rather than inventing its own.",
    steps: [
      {
        title: "Define series",
        body: "A goods receipt creates the series the rates will hang on.",
        ui: {
          icon: Tags,
          label: "Purchase series",
          field: "S-2451 · 240 pieces",
          pill: "Open",
          tone: "live",
          meta: "Landed cost ₹905 after freight",
        },
      },
      {
        title: "Assign rate",
        body: "HQ fixes wholesale, franchise and retail in one pass.",
        ui: {
          icon: BadgeCheck,
          label: "Rate approval",
          field: "₹1,180 · ₹1,340 · ₹1,799",
          pill: "Approved",
          tone: "ok",
          meta: "HQ pricing · 19 Aug",
        },
      },
      {
        title: "Apply at sale",
        body: "The counter is offered its channel's approved rate.",
        ui: {
          icon: Coins,
          label: "Applied rate",
          field: "₹1,340",
          pill: "Franchise",
          tone: "action",
          meta: "An override needs a second approval",
        },
      },
      {
        title: "Audit changes",
        body: "Every change to a series rate keeps its author and date.",
        ui: {
          icon: History,
          label: "Rate history",
          field: "3 revisions",
          pill: "Tracked",
          tone: "ok",
          meta: "Last change 19 Aug · HQ pricing",
        },
      },
    ],
  },

  /* ------------------------------------------------------ 05 stock transfer */
  "stock-transfer": {
    whyHeadline: ["Movement stays", "on the record."],
    whyBody:
      "A consignment is owned, counted and visible from the moment it is raised to the moment it is received — so stock in transit is still stock you can see.",
    benefits: [
      { label: "Clear movement trail", icon: ArrowLeftRight },
      { label: "Fewer transfer errors", icon: ClipboardCheck },
      { label: "Real-time visibility", icon: Timer },
    ],
    simulation: {
      workspace: "Transfers",
      crumb: "Consignments",
      columns: ["Reference", "Route", "State"],
      total: "24",
      actions: ["Receive consignment", "Movement log"],
      rows: [
        {
          id: "trf-1184",
          primary: "TRF-1184",
          secondary: "Bhiwandi → Kalyan",
          value: "48 pcs",
          state: "In transit",
          tone: "live",
          detail: {
            title: "On the road",
            plate: {
              kind: "route",
              from: "HQ warehouse",
              fromPlace: "Bhiwandi",
              to: "Franchise outlet",
              toPlace: "Kalyan",
              progress: 62,
            },
            record: [
              { label: "Pieces", value: "48" },
              { label: "Dispatched", value: "24 Aug · 11:40" },
              { label: "Value", value: "₹64,320" },
              { label: "Expected", value: "24 Aug · 17:30" },
            ],
            footer: "HQ stock 1,284 → 1,236 · counted out at source",
          },
        },
        {
          id: "trf-1181",
          primary: "TRF-1181",
          secondary: "Bhiwandi → Thane",
          value: "120 pcs",
          state: "Received",
          tone: "ok",
          detail: {
            title: "Settled",
            plate: {
              kind: "route",
              from: "HQ warehouse",
              fromPlace: "Bhiwandi",
              to: "Company store",
              toPlace: "Thane",
              progress: 100,
            },
            record: [
              { label: "Pieces", value: "120" },
              { label: "Dispatched", value: "22 Aug · 08:10" },
              { label: "Value", value: "₹1,42,800" },
              { label: "Received", value: "22 Aug · 13:55" },
            ],
            footer: "120 of 120 scanned · both entity books updated",
          },
        },
        {
          id: "trf-1186",
          primary: "TRF-1186",
          secondary: "Kalyan → Bhiwandi",
          value: "12 pcs",
          state: "Draft",
          tone: "warn",
          detail: {
            title: "Awaiting approval",
            plate: {
              kind: "route",
              from: "Franchise outlet",
              fromPlace: "Kalyan",
              to: "HQ warehouse",
              toPlace: "Bhiwandi",
              progress: 8,
            },
            record: [
              { label: "Pieces", value: "12" },
              { label: "Raised", value: "26 Aug · 10:20" },
              { label: "Value", value: "₹16,080" },
              { label: "Expected", value: "Pending HQ" },
            ],
            footer: "Return-to-HQ request · nothing leaves until approved",
          },
        },
      ],
    },
    howHeadline: ["Four legs,", "one record."],
    howBody:
      "Every leg of a transfer has someone accountable for it, and the books settle themselves once the count agrees.",
    steps: [
      {
        title: "Create transfer",
        body: "The outlet asks; HQ approves the quantity.",
        ui: {
          icon: ClipboardCheck,
          label: "Transfer request",
          field: "TRF-1184 · 48 pieces",
          pill: "Approved",
          tone: "ok",
          meta: "Raised by Kalyan · 24 Aug 09:12",
        },
      },
      {
        title: "Confirm source",
        body: "Pieces are scanned out and HQ stock drops immediately.",
        ui: {
          icon: Truck,
          label: "Dispatch",
          field: "1,284 → 1,236",
          pill: "Dispatched",
          tone: "action",
          meta: "Bhiwandi · 24 Aug 11:40",
        },
      },
      {
        title: "Receive destination",
        body: "Receiving scans each piece and names any shortfall.",
        ui: {
          icon: MapPin,
          label: "Receipt",
          field: "48 of 48 scanned",
          pill: "Received",
          tone: "live",
          meta: "Kalyan · no variance against dispatch",
        },
      },
      {
        title: "Trace movement",
        body: "Entity books settle without a journal typed twice.",
        ui: {
          icon: RotateCcw,
          label: "Posted movement",
          field: "TRF-1184 closed",
          pill: "Settled",
          tone: "ok",
          meta: "Both entity books updated automatically",
        },
      },
    ],
  },
};
