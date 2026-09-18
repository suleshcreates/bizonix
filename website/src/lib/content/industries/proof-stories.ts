export type ProofMode = "verified" | "anonymized";
export type EvidenceType = "metric" | "qualitative";

export interface EvidenceItem {
  type: EvidenceType;
  value: string;
  label: string;
  detail?: string;
  iconName: "eye" | "clock" | "file-check" | "shield-check";
}

export interface ProofStory {
  id: string;
  mode: ProofMode;
  industry: string;
  identity: {
    name: string;
    role: string;
    attribution: string;
  };
  image: string;
  imageAlt: string;
  objectPosition: string;
  headline: string;
  before: string;
  after: string;
  storyParagraph1: string;
  storyParagraph2: string;
  turningPoint: string;
  quote?: {
    text: string;
    attribution: string;
  };
  evidence: EvidenceItem[];
}

/**
 * CONTENT SOURCE: representative operating-model copy
 *
 * Mode: "anonymized" — because we have no verified personal photo.
 * The story content is drawn from approved transformation language
 * already present in the codebase's case study teaser component.
 *
 * All qualitative outcomes are sourced from the approved
 * transformationComparison array and before/after copy blocks.
 */
export const proofStories: ProofStory[] = [
  {
    id: "representative-retail-network",
    mode: "anonymized",
    industry: "JEWELLERY & MULTI-ENTITY RETAIL",
    identity: {
      name: "Anonymized customer story",
      role: "Multi-entity retail operations",
      attribution: "Jewellery & franchise network",
    },
    image: "/images/industries/proof/customer-story.webp",
    imageAlt: "Anonymized customer operating in a jewellery retail environment",
    objectPosition: "50% 34%",
    headline: "From scattered operations\nto a single operating view.",
    before:
      "Store billing, warehouse allocation, and franchise coordination lived in separate tools.",
    after:
      "Headquarters, stores, franchise outlets, and accounts now share one operating truth.",
    storyParagraph1:
      "Inventory, franchise indents, and month-end books were managed across disconnected tools, spreadsheets, and manual coordination.",
    storyParagraph2:
      "With Bizonix, barcode transactions, partner indents, stock visibility, and financial reconciliation now share one operating record.",
    turningPoint:
      "Connected inventory, sales, and franchise operations into one operating view across all entities.",
    quote: {
      text: "Bizonix is designed to keep warehouse, stores and franchise operations on one connected record, so teams can trace movement without stitching together separate systems.",
      attribution: "Representative operating model",
    },
    evidence: [
      {
        type: "qualitative",
        value: "Real-time",
        label: "Inventory visibility",
        detail: "Single piece-level barcode truth across all locations",
        iconName: "eye",
      },
      {
        type: "qualitative",
        value: "Automated",
        label: "Franchise governance",
        detail: "Rules-based partner indents locked to live credit limits",
        iconName: "shield-check",
      },
      {
        type: "qualitative",
        value: "Continuous",
        label: "Financial reconciliation",
        detail: "Operations and general ledger reconcile in real time",
        iconName: "clock",
      },
      {
        type: "qualitative",
        value: "Audit-ready",
        label: "GST compliance",
        detail: "Automated e-Invoices, e-Way bills, and GSTR preparation",
        iconName: "file-check",
      },
    ],
  },
];
