import {
  Building2,
  ScanBarcode,
  Truck,
  type LucideIcon,
} from "lucide-react";

/**
 * The closing argument of the modules index: modules are not nine products,
 * they are nine views of one record. Each scenario is a single operator action
 * and the three consequences the platform writes for it — the exact work a
 * disconnected stack leaves to a person at month end.
 */
export type ConsequenceLane = {
  id: "inventory" | "books" | "network";
  label: string;
  module: string;
  /** Ledger-style entries the action writes into this lane. */
  entries: readonly { key: string; value: string }[];
};

export type ConsequenceScenario = {
  id: string;
  action: string;
  where: string;
  detail: string;
  icon: LucideIcon;
  accent: string;
  lanes: readonly ConsequenceLane[];
};

export const consequenceScenarios: readonly ConsequenceScenario[] = [
  {
    id: "counter-sale",
    action: "A counter sale is billed",
    where: "Store 02 · Counter 1",
    detail:
      "The cashier scans one piece and takes the payment. Nothing else is typed anywhere.",
    icon: ScanBarcode,
    accent: "#ff6b6b",
    lanes: [
      {
        id: "inventory",
        label: "Inventory",
        module: "Inventory",
        entries: [
          { key: "Piece", value: "BZX-4471-08 → sold" },
          { key: "Stock", value: "Store 02 · 14 → 13" },
          { key: "Series", value: "AW-24 rate held" },
        ],
      },
      {
        id: "books",
        label: "Books",
        module: "Accounting",
        entries: [
          { key: "Dr", value: "Cash / UPI  2,450.00" },
          { key: "Cr", value: "Sales  2,076.27" },
          { key: "Cr", value: "GST output  373.73" },
        ],
      },
      {
        id: "network",
        label: "Network",
        module: "Analytics",
        entries: [
          { key: "Outlet", value: "Store 02 day sheet live" },
          { key: "Session", value: "Counter 1 cash expected" },
          { key: "Brand", value: "Consolidated view updated" },
        ],
      },
    ],
  },
  {
    id: "franchise-transfer",
    action: "Stock moves to a franchise",
    where: "HQ warehouse → Nashik outlet",
    detail:
      "A transfer is dispatched to a partner outlet. Two entities, two sets of books, one movement.",
    icon: Building2,
    accent: "#2f6bff",
    lanes: [
      {
        id: "inventory",
        label: "Inventory",
        module: "Inventory",
        entries: [
          { key: "Out", value: "HQ · 48 pieces scanned" },
          { key: "In", value: "Nashik · awaiting receipt" },
          { key: "Trail", value: "Carton IDs preserved" },
        ],
      },
      {
        id: "books",
        label: "Books",
        module: "Accounting",
        entries: [
          { key: "Dr", value: "Franchise receivable" },
          { key: "Cr", value: "Inter-entity transfer" },
          { key: "Tax", value: "Invoice raised, GST ready" },
        ],
      },
      {
        id: "network",
        label: "Network",
        module: "Franchise",
        entries: [
          { key: "Outlet", value: "Nashik stock in transit" },
          { key: "Credit", value: "Partner limit re-checked" },
          { key: "Scope", value: "Partner sees only Nashik" },
        ],
      },
    ],
  },
  {
    id: "goods-received",
    action: "A purchase is received",
    where: "Central warehouse · GRN",
    detail:
      "Goods land against a purchase order. Costing, labels and payables are settled in the same pass.",
    icon: Truck,
    accent: "#ff9f43",
    lanes: [
      {
        id: "inventory",
        label: "Inventory",
        module: "Procurement",
        entries: [
          { key: "GRN", value: "PO-1182 · 120 of 120" },
          { key: "Labels", value: "Piece barcodes queued" },
          { key: "Series", value: "Landed cost applied" },
        ],
      },
      {
        id: "books",
        label: "Books",
        module: "Accounting",
        entries: [
          { key: "Dr", value: "Inventory  1,84,000.00" },
          { key: "Cr", value: "Supplier payable" },
          { key: "Input", value: "GST credit recorded" },
        ],
      },
      {
        id: "network",
        label: "Network",
        module: "Analytics",
        entries: [
          { key: "Cover", value: "Days of stock recalculated" },
          { key: "Alerts", value: "3 low-stock flags cleared" },
          { key: "Supplier", value: "Fill-rate score updated" },
        ],
      },
    ],
  },
];

/** Milliseconds each scenario holds before the stage advances on its own. */
export const SCENARIO_DWELL = 7200;
