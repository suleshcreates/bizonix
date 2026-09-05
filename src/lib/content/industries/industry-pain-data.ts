import type { Industry, IndustryId } from "./industries";

export type IndustryPainStory = {
  id: IndustryId;
  name: string;
  number: string;
  collapsedImage: string;
  detailImage: string;
  pressure: string;
  pressureDetail: string;
  pains: readonly string[];
  response: string;
  responseDetail: string;
  accent: Industry["accent"];
};

export const industryPainData: readonly IndustryPainStory[] = [
  {
    id: "apparel",
    name: "Apparel & Footwear",
    number: "01",
    collapsedImage: "/images/industries/overview/apparel-operations.webp",
    detailImage: "/images/industries/pains/apparel-detail.webp",
    pressure: "Too many variants. Not enough clarity.",
    pressureDetail:
      "Size, colour and seasonal inventory create too many stock decisions.",
    pains: [
      "Size and colour fragmentation",
      "Seasonal stock imbalance",
      "Franchise sell-through gaps",
      "Wholesale pack complexity",
      "Cross-channel visibility gaps",
    ],
    response: "One stock view. Every variant connected.",
    responseDetail: "Unified visibility across inventory movement.",
    accent: "blue",
  },
  {
    id: "jewellery",
    name: "Imitation Jewellery",
    number: "02",
    collapsedImage: "/images/industries/overview/jewellery-operations.webp",
    detailImage: "/images/industries/pains/jewellery-detail.webp",
    pressure: "Piece-level data. Easy to break.",
    pressureDetail:
      "Design-heavy assortments make piece tracking and fast billing harder.",
    pains: [
      "Design-heavy SKU growth",
      "Piece barcode breaks",
      "Fast POS pressure",
      "Supplier GRN mismatches",
      "Receiving traceability gaps",
    ],
    response: "Piece control that stays connected.",
    responseDetail: "Barcode, POS and supplier movement stay linked.",
    accent: "teal",
  },
  {
    id: "franchise",
    name: "Franchise Networks",
    number: "03",
    collapsedImage: "/images/industries/overview/franchise-operations.webp",
    detailImage: "/images/industries/pains/franchise-detail.webp",
    pressure: "Control vs. autonomy. Hard to balance.",
    pressureDetail: "Central standards often collide with local responsibility.",
    pains: [
      "Central control tension",
      "Allocation complexity",
      "Subscription governance",
      "Entity isolation risk",
      "Outlet visibility gaps",
    ],
    response: "Central control. Local freedom.",
    responseDetail: "Allocation and entity boundaries stay clear.",
    accent: "violet",
  },
] as const;
