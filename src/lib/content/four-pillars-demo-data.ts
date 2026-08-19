// Marketing-only content for the "Four pillars, one record" section.
//
// SAFETY: every record below is invented for the public website. This file must
// stay disconnected from product, customer, authentication, or API data.

export type PillarId = "inventory" | "commerce" | "network" | "finance";

export const pillars: {
  id: PillarId;
  index: string;
  name: string;
  lines: [string, string];
  image: string;
  alt: string;
  accent: "blue" | "teal";
  modelDescription: string;
}[] = [
  {
    id: "inventory",
    index: "01",
    name: "Inventory",
    lines: ["Every item.", "Every movement."],
    image: "/product/pillars/pillar-inventory.jpg",
    alt: "A wide aisle in a modern distribution warehouse lined with tall racks of neatly stacked cartons.",
    accent: "blue",
    modelDescription:
      "Capture, track, and update every item with accuracy.",
  },
  {
    id: "commerce",
    index: "02",
    name: "Commerce",
    lines: ["Every sale.", "Every order."],
    image: "/product/pillars/pillar-commerce.jpg",
    alt: "A contemporary retail checkout counter with a point-of-sale terminal and receipt printer.",
    accent: "teal",
    modelDescription:
      "Create, fulfill, and reconcile every order seamlessly.",
  },
  {
    id: "network",
    index: "03",
    name: "Network",
    lines: ["Every allocation.", "Every access."],
    image: "/product/pillars/pillar-network.jpg",
    alt: "An enterprise network operations room with large wall displays under cool blue lighting.",
    accent: "blue",
    modelDescription:
      "Control access, allocation, and visibility across entities.",
  },
  {
    id: "finance",
    index: "04",
    name: "Finance",
    lines: ["Every entry.", "Every ledger."],
    image: "/product/pillars/pillar-finance.jpg",
    alt: "A finance operations desk with ledgers, a calculator and a laptop showing abstract charts.",
    accent: "teal",
    modelDescription:
      "Record and close every transaction with confidence.",
  },
];

/** Where each stream leaves the source column, in convergence viewBox units. */
export const streamGeometry: {
  id: PillarId;
  y: number;
  d: string;
  color: string;
  begin: string;
}[] = [
  {
    id: "inventory",
    y: 60,
    d: "M0 60 C180 60 320 150 500 150 L620 150",
    color: "#2f6bff",
    begin: "0s",
  },
  {
    id: "commerce",
    y: 114,
    d: "M0 114 C180 114 340 150 500 150 L620 150",
    color: "#2ec4b6",
    begin: "-2s",
  },
  {
    id: "network",
    y: 186,
    d: "M0 186 C180 186 340 150 500 150 L620 150",
    color: "#4f83ff",
    begin: "-4s",
  },
  {
    id: "finance",
    y: 240,
    d: "M0 240 C180 240 320 150 500 150 L620 150",
    color: "#37cbbd",
    begin: "-6s",
  },
];

/** Below 900px the same four streams converge downward instead of rightward. */
export const streamGeometryVertical: {
  id: PillarId;
  d: string;
  color: string;
  begin: string;
}[] = [
  { id: "inventory", d: "M100 0 C100 66 400 56 400 128", color: "#2f6bff", begin: "0s" },
  { id: "commerce", d: "M300 0 C300 66 400 56 400 128", color: "#2ec4b6", begin: "-2s" },
  { id: "network", d: "M500 0 C500 66 400 56 400 128", color: "#4f83ff", begin: "-4s" },
  { id: "finance", d: "M700 0 C700 66 400 56 400 128", color: "#37cbbd", begin: "-6s" },
];

export const recordFields: { label: string; value: string }[] = [
  { label: "Product", value: "SKU-4021" },
  { label: "Entity", value: "Retail Division" },
  { label: "Location", value: "North Warehouse" },
  { label: "Channel", value: "Store 04" },
  { label: "Ledger", value: "Books" },
];

export const timelineEvents: {
  id: string;
  title: string;
  context: string;
  time: string;
  accent: "blue" | "teal";
}[] = [
  {
    id: "grn",
    title: "GRN created",
    context: "North Warehouse",
    time: "09:14 AM",
    accent: "blue",
  },
  {
    id: "allocated",
    title: "Stock allocated",
    context: "Retail Store 04",
    time: "09:15 AM",
    accent: "teal",
  },
  {
    id: "transferred",
    title: "Stock transferred",
    context: "North → Store 04",
    time: "09:42 AM",
    accent: "blue",
  },
  {
    id: "sale",
    title: "Sale completed",
    context: "Store 04",
    time: "11:08 AM",
    accent: "teal",
  },
  {
    id: "ledger",
    title: "Ledger updated",
    context: "Books",
    time: "11:09 AM",
    accent: "blue",
  },
];
