import type { LucideIcon } from "lucide-react";
import type { ProductScreenId } from "./product-screens";

/**
 * The universal module deep-page contract.
 *
 * Nine module pages render through one template. Everything that differs
 * between them — copy, evidence, workflow shape, accent, visual emphasis —
 * lives in this structure. Nothing module-specific belongs in JSX, and the
 * template never branches on a slug.
 *
 * Honesty rules encoded here rather than left to prose:
 *  - a screenshot is either a real capture from `productScreens`, or it is
 *    explicitly `pending`; there is no third state that lets a fabricated
 *    image through;
 *  - `proof` and `video` are optional because no approved customer evidence or
 *    walkthrough recording exists yet. They stay absent until one does.
 */

export const moduleSlugs = [
  "inventory",
  "procurement",
  "sales-pos",
  "wholesale",
  "franchise",
  "accounting",
  "ecommerce",
  "analytics",
  "security",
] as const;

export type ModuleSlug = (typeof moduleSlugs)[number];

/* ----------------------------------------------------------------- variants */

/**
 * Which operating chain the hero stage draws. This changes the *emphasis* of
 * the hero — the shape of the chain and what the record chip highlights — not
 * the layout. All nine share one hero component.
 */
export type HeroVisualVariant =
  | "inventory"
  | "procurement"
  | "pos"
  | "wholesale"
  | "network"
  | "finance"
  | "commerce"
  | "analytics"
  | "security";

/** Layout mode for the workflow section. One component, five presentations. */
export type WorkflowVariant =
  | "timeline"
  | "step-cards"
  | "operational-flow"
  | "entity-lanes"
  | "data-to-report";

/** Layout mode for the screenshot gallery. */
export type GalleryVariant =
  | "single-featured"
  | "featured-plus-grid"
  | "stacked"
  | "annotated-large";

/* -------------------------------------------------------------------- parts */

export type ModuleTheme = {
  /** Accent hue, taken from the canonical module index so the whole site agrees. */
  accent: string;
  /** Darker step of the same hue, for text on light surfaces. */
  accentDark: string;
  /** Very light wash of the hue, for chips and active states. */
  accentSoft: string;
};

/** A single node on the hero's operating chain. */
export type HeroChainNode = {
  id: string;
  label: string;
  /** Two or three words describing what the system holds at this point. */
  detail: string;
};

/**
 * An editorial note against a real region of the hero capture.
 *
 * `x` / `y` are per-cent of the **source capture**, which is the space you can
 * check by opening the PNG and measuring. The hero canvas crops that capture,
 * so the renderer projects the point through `frame-geometry` before drawing
 * it, and validation rejects a point the crop has removed rather than letting a
 * note point at empty space.
 *
 * `side` is which way the note sits from its anchor on wide viewports; below
 * that the notes stack under the canvas as a numbered list. Three is the
 * working maximum — the hero is evidence, not a topology diagram.
 */
export type HeroAnnotation = {
  id: string;
  x: number;
  y: number;
  side: "left" | "right";
  /** What the region is, in product language. */
  label: string;
  /** Why it matters operationally. One sentence. */
  detail: string;
};

export type ModuleHeroData = {
  /** Small label above the H1 — the operating discipline, not a tagline. */
  eyebrow: string;
  /**
   * The H1. A short outcome — five to nine words, two lines at the hero's
   * type size. Never a sentence that explains the module; the sections below
   * do that.
   */
  headline: string;
  /**
   * The tail of `headline` that carries the blue→teal accent. It must be a
   * suffix of the headline (the build checks), which is what keeps the
   * emphasis on one deliberate phrase rather than scattered words.
   */
  headlineAccent: string;
  /** One paragraph of supporting statement below the H1. */
  body: string;
  primaryCta: { label: string; href: string };
  /** Only set where a second destination genuinely helps. */
  secondaryCta?: { label: string; href: string };
  visualVariant: HeroVisualVariant;
  /**
   * The operating chain this module owns, drawn under the product canvas.
   * Three to five nodes; this is what gives each hero its own identity.
   */
  chain: readonly HeroChainNode[];
  /** Real product screen behind the hero stage, when one has been captured. */
  screen?: {
    id: ProductScreenId;
    /** Which part of the capture to hold in frame, as a CSS object-position. */
    focus?: string;
    /** Alt text narrowed to this module's context. */
    alt: string;
    /** Up to three editorial notes against regions visible in the crop. */
    annotations?: readonly HeroAnnotation[];
  };
  /** Three short operating facts. Structural statements only — never metrics. */
  facts: readonly { label: string; value: string }[];
};

/* ------------------------------------------------------------ problem layer */

/**
 * Every conceptual problem visualisation the nine modules draw on.
 *
 * These are diagrams of *friction*, never of the product: a count that
 * disagrees with itself, an order that drifts from its receipt, a permission
 * that outgrows its boundary. A visual that explains the solution — or that
 * imitates a Bizonix screen — does not belong in this list; real captures live
 * in `gallery`.
 *
 * The identifier is the contract between data and the visual registry. A
 * module may only name one that exists, which `validate.ts` enforces, so a
 * typo fails the build rather than rendering an empty column.
 */
export const problemVisualIds = [
  /* inventory */
  "count-mismatch",
  "location-mismatch",
  "identity-loss",
  /* procurement */
  "order-receipt-drift",
  "cost-detached",
  "supplier-scatter",
  /* sales & pos */
  "duplicate-entry",
  "session-boundary",
  "return-orphan",
  /* wholesale */
  "partial-shipment",
  "stale-pick",
  "credit-scatter",
  /* franchise */
  "off-system-outlet",
  "transfer-limbo",
  "access-overreach",
  /* accounting */
  "period-relay",
  "context-stripped",
  "entity-split",
  /* ecommerce */
  "duplicate-catalogue",
  "stale-availability",
  "batched-orders",
  /* analytics */
  "assembled-report",
  "dead-end-number",
  "unreadable-network",
  /* security */
  "permission-creep",
  "absent-boundary",
  "unattributed-change",
] as const;

export type ProblemVisualId = (typeof problemVisualIds)[number];

export type ModuleProblem = {
  id: string;
  /** "01" | "02" | "03". Authored, not derived, so the data reads as it renders. */
  number: string;
  /** The pain, in operator language. Short and memorable. */
  title: string;
  /** Two to four sentences on why the operation breaks here. */
  description: string;
  /** One line as an operator would say it. An observation, never a testimonial. */
  quote: string;
  /** Which conceptual diagram this problem draws. */
  visual: ProblemVisualId;
};

/** One qualitative cost of the three problems standing together. */
export type ProblemConsequenceItem = {
  id: string;
  /** Two or three words naming the cost. */
  label: string;
  /** One sentence. Qualitative only — this section never carries a number. */
  body: string;
};

/**
 * The problem beat of the module page, in full.
 *
 * It sits immediately after the hero and answers a different question: the
 * hero says what the module does, this says why the current operation breaks.
 * It carries no proof, no metric and no product screen — only friction and
 * what that friction costs.
 */
export type ProblemSectionData = {
  /** Small label above the headline, e.g. "Before Inventory". */
  eyebrow: string;
  /** Module-specific H2. Names the operational failure, not the product. */
  title: string;
  /** One sentence framing the three columns below. */
  intro: string;
  /** Exactly three. Validated. */
  problems: readonly ModuleProblem[];
  consequence: {
    /** What the three problems cost together. */
    title: string;
    /** Exactly three qualitative consequences. */
    items: readonly ProblemConsequenceItem[];
  };
};

export type ModuleOutcome = {
  id: string;
  number: string;
  visualVariant: import("./outcome-visuals").OutcomeVisualVariant;
  accent: string;
  /** What changes operationally. Not a feature name. */
  title: string;
  description: string;
};

export type OutcomesSectionData = {
  eyebrow: string;
  title: string;
  highlight: string;
  intro?: string;
  outcomes: readonly ModuleOutcome[];
};

export type CapabilityGroup = {
  id: string;
  title: string;
  /** One line of context so the group is not a bare bullet wall. */
  context: string;
  /** Real ERP function names, 3–6 per group. */
  items: readonly string[];
};

export type ModuleCapabilities = {
  groups: readonly CapabilityGroup[];
  /**
   * Documented boundaries of the module. Rendered as-is when present. Never
   * invent an entry here; an empty list simply hides the block.
   */
  limitations?: readonly string[];
};

export type WorkflowStep = {
  id: string;
  /** "01" … "06". */
  index: string;
  title: string;
  body: string;
  /** What the system holds once this step is done. */
  record: string;
  /** Optional lane name — used by the entity-lanes variant. */
  lane?: string;
};

export type ModuleWorkflowData = {
  variant: WorkflowVariant;
  title: string;
  intro: string;
  steps: readonly WorkflowStep[];
};

/**
 * A pin on a real screenshot. Only ever points at something visible.
 *
 * `x` / `y` are per-cent of the **source capture**, measured from the file
 * itself. The gallery shows captures uncropped, so the mapping to the rendered
 * frame is one-to-one there; the shared projection in `frame-geometry` still
 * runs, so the coordinate space stays the same one the hero uses.
 */
export type ScreenshotAnnotation = {
  id: string;
  x: number;
  y: number;
  label: string;
  detail: string;
};

export type ModuleScreenshot = {
  id: string;
  title: string;
  description: string;
  order: number;
  /** Context line: where in the operating flow this screen sits. */
  context: string;
  featured?: boolean;
} & (
  | {
      state: "captured";
      screen: ProductScreenId;
      alt: string;
      /** Focal point for tight crops. */
      focus?: string;
      annotations?: readonly ScreenshotAnnotation[];
    }
  | {
      /** No capture exists yet. Renders a labelled placeholder, never an image. */
      state: "pending";
    }
);

export type ModuleGallery = {
  variant: GalleryVariant;
  title: string;
  intro: string;
  shots: readonly ModuleScreenshot[];
};

export type VerticalRelevance = {
  apparel?: string;
  jewellery?: string;
  franchise?: string;
};

/**
 * Approved customer evidence. Absent everywhere until a named customer, an
 * exact quote and a written permission exist. No placeholder telemetry.
 */
export type ModuleProof = {
  kind: "quote" | "metric";
  statement: string;
  attribution: string;
};

/** A real recorded walkthrough. Absent until the file exists. */
export type ModuleVideo = {
  url: string;
  poster: string;
  title: string;
  /** Seconds. */
  duration: number;
};

export type ModuleFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type ModuleSeo = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
};

/* ------------------------------------------------------------------- module */

export type ModuleData = {
  slug: ModuleSlug;
  /** Module name as it appears in navigation and breadcrumbs. */
  title: string;
  eyebrow: string;
  /** One-line operating outcome. Reused in related-module cards. */
  outcome: string;
  /** Two-sentence intro used by the index and by structured data. */
  intro: string;
  icon: LucideIcon;
  theme: ModuleTheme;
  hero: ModuleHeroData;
  /** The problem beat. One universal component, nine operational stories. */
  problemSection: ProblemSectionData;
  outcomesSection: OutcomesSectionData;
  capabilities: ModuleCapabilities;
  workflow: ModuleWorkflowData;
  gallery: ModuleGallery;
  verticalRelevance?: VerticalRelevance;
  proof?: ModuleProof;
  video?: ModuleVideo;
  faq: readonly ModuleFaqItem[];
  /** Exactly three sibling modules. Validated at build time. */
  relatedModules: readonly ModuleSlug[];
  seo: ModuleSeo;
};

/** Canonical route for a module page. Nothing builds this string by hand. */
export function moduleRoute(slug: ModuleSlug): string {
  return `/modules/${slug}`;
}
