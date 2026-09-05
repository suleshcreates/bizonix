// Marketing-only demo data for the Home hero stock console.
//
// SAFETY: every value below is invented for the public website. This file must
// stay disconnected from product, customer, authentication, or API data
// sources — nothing here may ever be replaced with live tenant records.

export const consoleWorkspace = {
  module: "Inventory",
  view: "Stock list",
  scope: "Central Warehouse",
  status: "Live",
} as const;

export const consoleNav = [
  "Overview",
  "Purchase",
  "Inventory",
  "Billing",
  "Transfers",
  "Finance",
] as const;

export const consoleKpis: {
  label: string;
  /** Numeric part animated on entry; prefix and suffix stay fixed. */
  prefix: string;
  value: number;
  decimals: number;
  suffix: string;
  note: string;
  tone: "blue" | "teal" | "navy";
}[] = [
  {
    label: "In stock",
    prefix: "",
    value: 10.2,
    decimals: 1,
    suffix: "K",
    note: "pieces, counted",
    tone: "blue",
  },
  {
    label: "Stock value",
    prefix: "₹",
    value: 1.36,
    decimals: 2,
    suffix: " Cr",
    note: "at cost / value",
    tone: "teal",
  },
  {
    label: "Lines",
    prefix: "",
    value: 1000,
    decimals: 0,
    suffix: "",
    note: "SKU / batch rows",
    tone: "navy",
  },
  {
    label: "Locations",
    prefix: "",
    value: 4,
    decimals: 0,
    suffix: "",
    note: "1 warehouse · 3 stores",
    tone: "navy",
  },
];

export const consoleFilters = ["All expiry", "Low stock", "Hide zero qty"];
export const consoleTabs = ["Stock list", "Analytics"] as const;

export type ConsoleRow = {
  code: string;
  name: string;
  variant: string;
  qty: number;
  /** Pieces opened for this line — drives the sell-through bar. */
  opened: number;
  rate: string;
  mrp: string;
  barcode: string;
  location: string;
  updated: string;
};

export const consoleRows: ConsoleRow[] = [
  {
    code: "A7-000001-BR01",
    name: "Bangles royal diamond cut",
    variant: "ALL · NO",
    qty: 11,
    opened: 24,
    rate: "1,599.00",
    mrp: "2,000.00",
    barcode: "000000009136",
    location: "Central Warehouse",
    updated: "18 Jul",
  },
  {
    code: "A7-000002-BR01",
    name: "Chain plane flat",
    variant: "FREE / GOLD",
    qty: 37,
    opened: 50,
    rate: "499.00",
    mrp: "1,000.00",
    barcode: "000000009137",
    location: "Central Warehouse",
    updated: "18 Jul",
  },
  {
    code: "000000009138",
    name: "Golden grace ring",
    variant: "ALL · —",
    qty: 85,
    opened: 126,
    rate: "129.00",
    mrp: "300.00",
    barcode: "000000009138",
    location: "Branch Store 1",
    updated: "18 Jul",
  },
  {
    code: "000000009139",
    name: "Kada gold lion kada",
    variant: "ALL · —",
    qty: 19,
    opened: 21,
    rate: "2,799.00",
    mrp: "4,000.00",
    barcode: "000000009139",
    location: "Branch Store 1",
    updated: "18 Jul",
  },
  {
    code: "A7-000006-BR01",
    name: "Matt 3 line pink stone haar",
    variant: "ALL · NO",
    qty: 20,
    opened: 20,
    rate: "699.00",
    mrp: "1,000.00",
    barcode: "000000009141",
    location: "Central Warehouse",
    updated: "17 Jul",
  },
  {
    code: "A7-000013-BR01",
    name: "Matt antic combo multicolour",
    variant: "ALL · NO",
    qty: 14,
    opened: 15,
    rate: "1,599.00",
    mrp: "2,000.00",
    barcode: "000000009148",
    location: "Branch Store 2",
    updated: "17 Jul",
  },
  {
    code: "A7-000025-BR01",
    name: "Earrings unique flower design",
    variant: "ALL · NO",
    qty: 1,
    opened: 24,
    rate: "249.00",
    mrp: "500.00",
    barcode: "000000009160",
    location: "Branch Store 1",
    updated: "16 Jul",
  },
  {
    code: "A7-000003-BR01",
    name: "Kada big size stone elephant",
    variant: "ALL · NO",
    qty: 4,
    opened: 9,
    rate: "3,699.00",
    mrp: "4,500.00",
    barcode: "000000009142",
    location: "Central Warehouse",
    updated: "16 Jul",
  },
  {
    code: "A7-000035-BR01",
    name: "Matt flower temple multicolour",
    variant: "ALL · NO",
    qty: 4,
    opened: 5,
    rate: "1,499.00",
    mrp: "2,000.00",
    barcode: "000000009170",
    location: "Branch Store 3",
    updated: "15 Jul",
  },
  {
    code: "A7-000021-BR01",
    name: "Matt multi stone beeds pendant",
    variant: "ALL · NO",
    qty: 2,
    opened: 2,
    rate: "1,699.00",
    mrp: "2,500.00",
    barcode: "000000009156",
    location: "Branch Store 1",
    updated: "15 Jul",
  },
];

/** Read out by assistive tech in place of the decorative console markup. */
export const consoleAriaLabel =
  "The Bizonix inventory stock list, showing pieces in stock, stock value, SKU lines and locations, above a table of products with quantity, selling rate, MRP, piece barcode and warehouse. All figures shown are illustrative demo data.";

/**
 * States the hero product stage cycles through — Inventory, Billing,
 * Transfers, Finance. The initial state is always Inventory. Labels feed the
 * editorial rail below the stage; `workspace` mirrors the window title of the
 * in-product console for each state.
 */
export const consoleStates = [
  { id: "inventory", label: "Inventory", workspace: "Inventory · Stock list" },
  { id: "billing", label: "Billing", workspace: "Billing · Tax invoice" },
  { id: "transfers", label: "Transfers", workspace: "Transfers · Consignment" },
  { id: "finance", label: "Finance", workspace: "Finance · Books" },
] as const;

export type ConsoleStateId = (typeof consoleStates)[number]["id"];
