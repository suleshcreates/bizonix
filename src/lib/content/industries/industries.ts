export type IndustryId = "apparel" | "jewellery" | "franchise";

export type Industry = {
  id: IndustryId;
  number: string;
  name: string;
  description: string;
  image: string;
  href: string;
  accent: "blue" | "teal" | "violet";
};

export type IndustryPressure = {
  id: IndustryId;
  name: string;
  number: string;
  image: string;
  bottleneck: string;
  bottleneckDetail: string;
  response: string;
  responseDetail: string;
  href: string;
  accent: Industry["accent"];
};

export const industries: readonly Industry[] = [
  {
    id: "apparel",
    number: "01",
    name: "Apparel & Footwear",
    description: "Size, colour, season and piece-aware operations.",
    image: "/images/industries/overview/apparel-footwear.webp",
    href: "/industries/apparel-footwear",
    accent: "blue",
  },
  {
    id: "jewellery",
    number: "02",
    name: "Imitation Jewellery",
    description: "Design-heavy SKUs, piece barcodes and fast POS.",
    image: "/images/industries/overview/imitation-jewellery.webp",
    href: "/industries/imitation-jewellery",
    accent: "teal",
  },
  {
    id: "franchise",
    number: "03",
    name: "Franchise Networks",
    description: "Central control, allocation and entity-aware operations.",
    image: "/images/industries/overview/franchise-networks.webp",
    href: "/industries/franchise-networks",
    accent: "violet",
  },
] as const;

export const industryPressures: readonly IndustryPressure[] = [
  {
    id: "apparel",
    name: "Apparel & Footwear",
    number: "01",
    image: "/images/industries/overview/apparel-operations.webp",
    bottleneck: "Too many variants. Not enough clarity.",
    bottleneckDetail:
      "Size, colour and seasonal inventory create too many stock decisions.",
    response: "One stock view. Every variant connected.",
    responseDetail: "Unified visibility across inventory movement.",
    href: "/industries/apparel-footwear",
    accent: "blue",
  },
  {
    id: "jewellery",
    name: "Imitation Jewellery",
    number: "02",
    image: "/images/industries/overview/jewellery-operations.webp",
    bottleneck: "Piece-level data. Easy to break.",
    bottleneckDetail:
      "Design-heavy assortments make piece tracking and fast billing harder.",
    response: "Piece control that stays connected.",
    responseDetail: "Barcode, POS and supplier movement stay linked.",
    href: "/industries/imitation-jewellery",
    accent: "teal",
  },
  {
    id: "franchise",
    name: "Franchise Networks",
    number: "03",
    image: "/images/industries/overview/franchise-operations.webp",
    bottleneck: "Control vs. autonomy. Hard to balance.",
    bottleneckDetail:
      "Central standards often collide with local responsibility.",
    response: "Central control. Local freedom.",
    responseDetail: "Allocation and entity boundaries stay clear.",
    href: "/industries/franchise-networks",
    accent: "violet",
  },
] as const;
