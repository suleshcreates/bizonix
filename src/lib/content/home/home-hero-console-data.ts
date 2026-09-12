// Marketing-only demo data for the Home hero stock console.
//
// SAFETY: every value below is invented for the public website. This file must
// stay disconnected from product, customer, authentication, or API data
// sources — nothing here may ever be replaced with live tenant records.

export const consoleWorkspace = {
  module: "Inventory",
  view: "Stock list",
  scope: "Central Warehouse",
  status: "Demo",
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
    "code": "DEMO-JWL-001",
    "name": "Floral bangle set",
    "variant": "ANTIQUE / GLASS",
    "qty": 12,
    "opened": 24,
    "rate": "150.00",
    "mrp": "300.00",
    "barcode": "DEMO-PIECE-0001",
    "location": "Demo Warehouse",
    "updated": "Sample"
  },
  {
    "code": "DEMO-JWL-002",
    "name": "Flat-link fashion chain",
    "variant": "MATT / PLAIN",
    "qty": 30,
    "opened": 40,
    "rate": "215.00",
    "mrp": "400.00",
    "barcode": "DEMO-PIECE-0002",
    "location": "Demo Store North",
    "updated": "Sample"
  },
  {
    "code": "DEMO-JWL-003",
    "name": "Glass-stone adjustable ring",
    "variant": "RHODIUM / GLASS",
    "qty": 48,
    "opened": 60,
    "rate": "280.00",
    "mrp": "500.00",
    "barcode": "DEMO-PIECE-0003",
    "location": "Demo Store South",
    "updated": "Sample"
  },
  {
    "code": "DEMO-JWL-004",
    "name": "Textured cuff bracelet",
    "variant": "ANTIQUE / GLASS",
    "qty": 16,
    "opened": 24,
    "rate": "345.00",
    "mrp": "600.00",
    "barcode": "DEMO-PIECE-0004",
    "location": "Demo Store West",
    "updated": "Sample"
  },
  {
    "code": "DEMO-JWL-005",
    "name": "Three-strand bead necklace",
    "variant": "MATT / PLAIN",
    "qty": 20,
    "opened": 30,
    "rate": "410.00",
    "mrp": "700.00",
    "barcode": "DEMO-PIECE-0005",
    "location": "Demo Warehouse",
    "updated": "Sample"
  },
  {
    "code": "DEMO-JWL-006",
    "name": "Antique-finish pendant set",
    "variant": "RHODIUM / GLASS",
    "qty": 9,
    "opened": 18,
    "rate": "475.00",
    "mrp": "800.00",
    "barcode": "DEMO-PIECE-0006",
    "location": "Demo Store North",
    "updated": "Sample"
  },
  {
    "code": "DEMO-JWL-007",
    "name": "Petal stud earrings",
    "variant": "ANTIQUE / GLASS",
    "qty": 3,
    "opened": 12,
    "rate": "540.00",
    "mrp": "900.00",
    "barcode": "DEMO-PIECE-0007",
    "location": "Demo Store South",
    "updated": "Sample"
  },
  {
    "code": "DEMO-JWL-008",
    "name": "Leaf-pattern cuff",
    "variant": "MATT / PLAIN",
    "qty": 6,
    "opened": 12,
    "rate": "605.00",
    "mrp": "1,000.00",
    "barcode": "DEMO-PIECE-0008",
    "location": "Demo Store West",
    "updated": "Sample"
  },
  {
    "code": "DEMO-JWL-009",
    "name": "Temple-style necklace",
    "variant": "RHODIUM / GLASS",
    "qty": 8,
    "opened": 16,
    "rate": "670.00",
    "mrp": "1,100.00",
    "barcode": "DEMO-PIECE-0009",
    "location": "Demo Warehouse",
    "updated": "Sample"
  },
  {
    "code": "DEMO-JWL-010",
    "name": "Colour-bead pendant",
    "variant": "ANTIQUE / GLASS",
    "qty": 4,
    "opened": 8,
    "rate": "735.00",
    "mrp": "1,200.00",
    "barcode": "DEMO-PIECE-0010",
    "location": "Demo Store North",
    "updated": "Sample"
  }
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
