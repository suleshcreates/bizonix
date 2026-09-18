/** Product-view data for the GST section's assembling tax invoice. */
export const invoiceParty = {
  name: "Shree Fashion House",
  gstin: "27AABCS1429B1ZP",
  place: "Maharashtra · 27",
  supply: "Intra-state",
} as const;

export const invoiceLines = [
  {
    hsn: "6204",
    item: "Anarkali kurta · M",
    qty: "12",
    rate: "1,180",
    taxable: "14,160",
  },
  {
    hsn: "6204",
    item: "Anarkali kurta · L",
    qty: "8",
    rate: "1,180",
    taxable: "9,440",
  },
  {
    hsn: "7117",
    item: "Imitation set · gold",
    qty: "6",
    rate: "940",
    taxable: "5,640",
  },
] as const;

export const invoiceTax = [
  { label: "Taxable value", value: "₹29,240" },
  { label: "CGST 6%", value: "₹1,754.40" },
  { label: "SGST 6%", value: "₹1,754.40" },
  { label: "Invoice total", value: "₹32,748.80", emphasis: true },
] as const;

export const gstCaptures = [
  {
    label: "Party GSTIN",
    body: "Held on the party master and validated once, so it is never retyped on a bill.",
  },
  {
    label: "Place of supply",
    body: "Decides CGST + SGST or IGST at the moment of billing, not in a spreadsheet later.",
  },
  {
    label: "HSN and rate",
    body: "Carried by the item, so the same product is taxed the same way at every counter.",
  },
  {
    label: "Invoice series",
    body: "Numbering is controlled per entity — no duplicate or missing invoice numbers to explain.",
  },
] as const;
