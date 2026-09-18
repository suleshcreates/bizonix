/**
 * The registry of **real captured Bizonix product screens**.
 *
 * This file is the single place a module page may take a screenshot from. If a
 * screen is not listed here it does not exist as a capture, and the module data
 * must declare a `pending` shot instead — the gallery then renders a labelled
 * "capture pending" frame rather than a fabricated one. Nothing on a module
 * page may point at an invented image path, an AI-rendered dashboard, or a
 * marketing mock dressed up as product UI.
 *
 * `width` / `height` are the intrinsic pixel sizes of the files on disk, so
 * every consumer can reserve space and avoid layout shift.
 *
 * `reads` describes, factually, what is visible in the frame. It is written
 * from the capture itself and is the only thing captions and annotations are
 * allowed to assert about a screen.
 */

export type ProductScreenId =
  | "stock-list"
  | "series-ledger"
  | "barcode-queue"
  | "purchase-list"
  | "order-list";

export type ProductScreen = {
  id: ProductScreenId;
  src: string;
  width: number;
  height: number;
  /** Screen name as it reads inside the product. */
  screen: string;
  /** Factual description of what the capture actually shows. */
  reads: string;
  /** Default alt text; a module may narrow it for its own context. */
  alt: string;
};

export const productScreens = {
  "stock-list": {
    id: "stock-list",
    src: "/images/shared/product-screens/stock-list.png",
    width: 1817,
    height: 771,
    screen: "Inventory · Stock list",
    reads:
      "Stock summary tiles above a per-line stock table with code, name, current stock, quantity, sale rate, MRP, cost, MRC reference, warehouse, barcode, pack, tax inclusion, tax rate and HSN columns.",
    alt: "Bizonix stock list screen showing summary tiles above a stock table with code, quantity, rate, warehouse and barcode columns.",
  },
  "series-ledger": {
    id: "series-ledger",
    src: "/images/shared/product-screens/series-ledger.png",
    width: 1587,
    height: 878,
    screen: "Inventory · Series entries",
    reads:
      "One row per stock entry with its location, line count, opened quantity, sold quantity, quantity still in stock, a sell-through bar and the entry value.",
    alt: "Bizonix series entry ledger listing each stock entry with location, opened, sold, in-stock, sell-through and value columns.",
  },
  "barcode-queue": {
    id: "barcode-queue",
    src: "/images/shared/product-screens/barcodes.png",
    width: 1229,
    height: 771,
    screen: "Inventory · Barcode printing",
    reads:
      "A print queue listing each new barcode against its in-stock count, print quantity, legacy code, design name, MRP, selling price and the time it was migrated.",
    alt: "Bizonix barcode printing screen listing new barcodes with in-stock counts, print quantities, legacy codes and design names.",
  },
  "purchase-list": {
    id: "purchase-list",
    src: "/images/shared/product-screens/purchases.png",
    width: 1645,
    height: 685,
    screen: "Procurement · Purchases",
    reads:
      "Purchases filtered by state — all, received, draft, cancelled — with purchase number, date, supplier, supplier invoice, quantity, amount and status per row.",
    alt: "Bizonix purchases screen with received, draft and cancelled filters over a table of purchase number, supplier, quantity, amount and status.",
  },
  "order-list": {
    id: "order-list",
    src: "/images/shared/product-screens/orders.png",
    width: 1803,
    height: 759,
    screen: "Sales · Orders",
    reads:
      "A totals bar over the filtered orders, then one row per order with its date, customer, billing counter, payment state, paid and total value, item count and fulfilment state.",
    alt: "Bizonix orders screen showing order totals above a table of order number, date, customer, counter, payment, amount, items and fulfilment.",
  },
} as const satisfies Record<ProductScreenId, ProductScreen>;

export function getProductScreen(id: ProductScreenId): ProductScreen {
  return productScreens[id];
}
