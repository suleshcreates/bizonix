// Marketing-only content for the "A Day In The System" section.
//
// SAFETY: every record below is synthetic and invented for the public website.
// This file is strictly disconnected from product, customer, authentication, or API data.

export type DayMomentId =
  | "morning-stock"
  | "counter-sale"
  | "franchise-transfer"
  | "month-end-books";

export interface DayMomentMetric {
  value: string;
  label: string;
}

export interface DayMomentAction {
  index: string;
  title: string;
  description: string;
}

export interface DayMoment {
  id: DayMomentId;
  index: string;
  time: string;
  area: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  accent: "blue" | "teal";
  metrics: DayMomentMetric[];
  actions: DayMomentAction[];
}

export const dayMoments: DayMoment[] = [
  {
    id: "morning-stock",
    index: "01",
    time: "09:00",
    area: "WAREHOUSE",
    title: "Morning stock",
    description:
      "Review receiving, exceptions and availability before allocation begins.",
    image: "/images/product/day-in-life/day-morning-stock.webp",
    alt: "Modern enterprise warehouse environment with tall organized racking and stock inspection.",
    accent: "blue",
    metrics: [
      { value: "26", label: "GRNs Received" },
      { value: "3", label: "Exceptions Pending" },
      { value: "1,245", label: "SKUs In Scope" },
      { value: "100%", label: "Sync Status" },
    ],
    actions: [
      {
        index: "01",
        title: "Confirm supplier GRNs",
        description:
          "Validate received quantities and documents against purchase orders.",
      },
      {
        index: "02",
        title: "Resolve barcode exceptions",
        description:
          "Identify mismatches and correct automatically or manually.",
      },
      {
        index: "03",
        title: "Release stock for stores and franchise",
        description:
          "Approve availability and push to network for fulfillment.",
      },
    ],
  },
  {
    id: "counter-sale",
    index: "02",
    time: "13:10",
    area: "COMPANY RETAIL",
    title: "Counter sale",
    description:
      "Serve customers, reconcile payments, and close the counter without breaking the operating record.",
    image: "/images/product/day-in-life/day-counter-sale.webp",
    alt: "Contemporary retail checkout counter with point-of-sale terminal and live transactions.",
    accent: "teal",
    metrics: [
      { value: "184", label: "Orders" },
      { value: "₹2.84L", label: "Sales" },
      { value: "97.8%", label: "Payment Success" },
      { value: "12", label: "Open Carts" },
    ],
    actions: [
      {
        index: "01",
        title: "Scan and price items",
        description:
          "Read barcodes, apply promotional rules, and query live unit inventory.",
      },
      {
        index: "02",
        title: "Capture payment",
        description:
          "Accept multi-tender payments with instant reconciliation against gateway.",
      },
      {
        index: "03",
        title: "Close and post the sale",
        description:
          "Update store stock and generate automated accounting ledger entry.",
      },
    ],
  },
  {
    id: "franchise-transfer",
    index: "03",
    time: "16:30",
    area: "NETWORK",
    title: "Franchise transfer",
    description:
      "Move stock between entities with source, destination, and authorization preserved.",
    image: "/images/product/day-in-life/day-franchise-transfer.webp",
    alt: "Modern logistics operations center coordinating multi-entity stock transit and dispatch.",
    accent: "blue",
    metrics: [
      { value: "42", label: "Units Transferred" },
      { value: "18", label: "Stores In Scope" },
      { value: "4", label: "Transfer Orders" },
      { value: "100%", label: "Context Preserved" },
    ],
    actions: [
      {
        index: "01",
        title: "Confirm source availability",
        description:
          "Verify physical allocations at origin warehouse before dispatch.",
      },
      {
        index: "02",
        title: "Approve destination allocation",
        description:
          "Validate partner credit, tax jurisdiction, and destination entity limits.",
      },
      {
        index: "03",
        title: "Dispatch and track movement",
        description:
          "Monitor transit milestones and auto-reconcile stock at receiving dock.",
      },
    ],
  },
  {
    id: "month-end-books",
    index: "04",
    time: "18:00",
    area: "FINANCE",
    title: "Month-end books",
    description:
      "Reconcile the day, post the final movements, and close the books with complete traceability.",
    image: "/images/product/day-in-life/day-month-end-books.webp",
    alt: "Professional finance office environment with accounting ledgers, reports, and double-entry journals.",
    accent: "teal",
    metrics: [
      { value: "₹6.42L", label: "Revenue Posted" },
      { value: "₹3.05L", label: "Gross Profit" },
      { value: "18", label: "Reconciliations" },
      { value: "100%", label: "Posting Complete" },
    ],
    actions: [
      {
        index: "01",
        title: "Reconcile transactions",
        description:
          "Match operational payment logs against bank statements and gateway batches.",
      },
      {
        index: "02",
        title: "Post journals",
        description:
          "Commit balanced double-entry vouchers linked to source transaction IDs.",
      },
      {
        index: "03",
        title: "Close and report",
        description:
          "Lock the period, update trial balances, and publish consolidated metrics.",
      },
    ],
  },
];
