/** Product-view data for the barcode section's scan stage. */
export const pieceRecord = [
  { label: "Style", value: "KUR-4412 · Anarkali" },
  { label: "Size / colour", value: "M · Indigo" },
  { label: "Series", value: "S-2451" },
  { label: "Piece", value: "0187 of 0240" },
  { label: "Location", value: "Franchise · Kalyan" },
  { label: "Status", value: "In stock" },
] as const;

export const barcodeSteps = [
  {
    step: "Print",
    title: "Identity is issued at receiving",
    body: "Every piece gets its own code as the GRN is posted — not one code shared across the style. Labels print in the same pass.",
  },
  {
    step: "Scan",
    title: "One code, read by everything",
    body: "POS billing, returns, franchise transfer and stock audit all read the same identity. Nobody keys a style code by hand.",
  },
  {
    step: "Reconcile",
    title: "The count stops being an argument",
    body: "Physical stock and the ledger refer to the same pieces, so a mismatch names the piece instead of a quantity.",
  },
] as const;

export const barcodeAside = {
  title: "Label damaged?",
  body: "Reprint against the same piece. The label is replaceable — the identity behind it never changes hands.",
} as const;
