import type { FeatureId } from "./features";

export type StoryStep = {
  title: string;
  label: string;
  value: string;
  detail: string;
  stamp: string;
  marks: readonly string[];
};
export type FeatureStory = {
  index: string;
  name: string;
  title: string;
  description: string;
  record: string;
  principle: string;
  note: string;
  kind: "barcode" | "ledger" | "split" | "series" | "movement";
  steps: readonly [StoryStep, StoryStep, StoryStep, StoryStep];
};

export const featureStories = {
  barcode: {
    index: "01",
    name: "Barcode",
    title: "Every piece has a trail.",
    description:
      "A label becomes a lasting identity. Follow one piece from the warehouse to a sale—and back again.",
    record: "PIECE / 0187",
    principle: "The piece changes hands. Its identity stays.",
    note: "Illustrative piece journey",
    kind: "barcode",
    steps: [
      {
        title: "Identify",
        label: "Piece registered",
        value: "0187",
        detail: "Anarkali kurta · M · Indigo",
        stamp: "HQ warehouse",
        marks: ["S-2451", "ONE PIECE"],
      },
      {
        title: "Print",
        label: "Identity on the label",
        value: "0187",
        detail: "The same ID, ready to scan.",
        stamp: "Label issued",
        marks: ["S-2451", "ONE LABEL"],
      },
      {
        title: "Scan sale",
        label: "Piece matched",
        value: "0187",
        detail: "The sale resolves to this piece.",
        stamp: "Kalyan · Counter 02",
        marks: ["S-2451", "ONE MATCH"],
      },
      {
        title: "Trace return",
        label: "Original identity retained",
        value: "0187",
        detail: "A return finds the original record.",
        stamp: "Identity confirmed",
        marks: ["S-2451", "SAME IDENTITY"],
      },
    ],
  },
  "billing-counters": {
    index: "02",
    name: "Billing Counters",
    title: "Every shift closes clean.",
    description:
      "A named operator. A running record. A close that explains every rupee, from the first sale to the final count.",
    record: "COUNTER / 02",
    principle: "One shift. A clear owner. A balanced close.",
    note: "Illustrative cash-only shift",
    kind: "ledger",
    steps: [
      {
        title: "Open shift",
        label: "Opening cash",
        value: "₹2,000",
        detail: "Riya takes ownership of Counter 02.",
        stamp: "09:00 · Shift opened",
        marks: ["RIYA S.", "COUNTER 02"],
      },
      {
        title: "Record sales",
        label: "Cash sales",
        value: "+₹18,400",
        detail: "Each sale belongs to this session.",
        stamp: "09:00–18:00",
        marks: ["SALES", "+18,400"],
      },
      {
        title: "Reconcile",
        label: "Expected after returns",
        value: "₹20,000",
        detail: "Opening + sales − ₹400 returns.",
        stamp: "Returns accounted for",
        marks: ["RETURNS", "−400"],
      },
      {
        title: "Close shift",
        label: "Counted cash",
        value: "₹20,000",
        detail: "Expected and counted agree.",
        stamp: "18:00 · Reconciled",
        marks: ["DIFFERENCE", "₹0"],
      },
    ],
  },
  "gst-compliance": {
    index: "03",
    name: "GST Compliance",
    title: "Tax follows the transaction.",
    description:
      "The value, the treatment and the tax split stay connected. Nothing loses its context on the way to the invoice.",
    record: "INVOICE / 0184",
    principle: "One transaction. Its tax context intact.",
    note: "Illustrative intra-state supply · 12% GST",
    kind: "split",
    steps: [
      {
        title: "Transaction",
        label: "Taxable value",
        value: "₹1,000",
        detail: "The line value starts the record.",
        stamp: "Value captured",
        marks: ["NET", "₹1,000"],
      },
      {
        title: "Capture tax",
        label: "Tax treatment",
        value: "12%",
        detail: "Intra-state supply, with a split levy.",
        stamp: "Treatment applied",
        marks: ["CGST 6%", "SGST 6%"],
      },
      {
        title: "Validate",
        label: "Total tax",
        value: "₹120",
        detail: "Two parts. One reconciled tax amount.",
        stamp: "Split validated",
        marks: ["CGST ₹60", "SGST ₹60"],
      },
      {
        title: "Issue invoice",
        label: "Invoice total",
        value: "₹1,120",
        detail: "Value and tax carried together.",
        stamp: "Ready for the books",
        marks: ["VALUE ₹1,000", "TAX ₹120"],
      },
    ],
  },
  "series-pricing": {
    index: "04",
    name: "Series Pricing",
    title: "One series. One price.",
    description:
      "Make the pricing decision once. Let the approved series rate follow every related piece into the transaction.",
    record: "SERIES / S-2451",
    principle: "Different variants. The same approved rate.",
    note: "Illustrative series pricing rule",
    kind: "series",
    steps: [
      {
        title: "Define series",
        label: "Related pieces",
        value: "S-2451",
        detail: "Three sizes, grouped as one series.",
        stamp: "Anarkali kurta",
        marks: ["S", "M", "L"],
      },
      {
        title: "Set rate",
        label: "Approved price / piece",
        value: "₹1,250",
        detail: "One pricing rule for the series.",
        stamp: "Rate approved",
        marks: ["S", "M", "L"],
      },
      {
        title: "Apply rule",
        label: "Rate resolved",
        value: "₹1,250",
        detail: "The transaction uses the series rate.",
        stamp: "₹1,290 → ₹1,250",
        marks: ["S", "M", "L"],
      },
      {
        title: "Keep consistent",
        label: "Price across variants",
        value: "₹1,250",
        detail: "Every related piece stays aligned.",
        stamp: "3 of 3 variants aligned",
        marks: ["S", "M", "L"],
      },
    ],
  },
  "stock-transfer": {
    index: "05",
    name: "Stock Transfer",
    title: "Movement stays visible.",
    description:
      "Dispatch is only half the story. Keep the source, the journey and the receipt on one connected movement record.",
    record: "TRANSFER / TR-0184",
    principle: "What left is exactly what arrived.",
    note: "Illustrative warehouse-to-store transfer",
    kind: "movement",
    steps: [
      {
        title: "Create movement",
        label: "Quantity committed",
        value: "24 pcs",
        detail: "Bhiwandi warehouse → Kalyan store.",
        stamp: "Transfer created",
        marks: ["SOURCE", "BHIWANDI"],
      },
      {
        title: "Dispatch",
        label: "Pieces in transit",
        value: "24 pcs",
        detail: "The source hands off the stock.",
        stamp: "10:24 · Dispatched",
        marks: ["STATUS", "IN TRANSIT"],
      },
      {
        title: "Receive",
        label: "Pieces acknowledged",
        value: "24 pcs",
        detail: "Kalyan confirms the incoming pieces.",
        stamp: "14:08 · Received",
        marks: ["DESTINATION", "KALYAN"],
      },
      {
        title: "Reconcile",
        label: "Quantity difference",
        value: "0 pcs",
        detail: "All 24 dispatched pieces accounted for.",
        stamp: "Movement complete",
        marks: ["DISPATCHED 24", "RECEIVED 24"],
      },
    ],
  },
} satisfies Record<FeatureId, FeatureStory>;
