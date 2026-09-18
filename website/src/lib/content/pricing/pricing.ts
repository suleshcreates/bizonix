import {
  DatabaseBackup,
  FileCheck2,
  KeyRound,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { moduleIndexItems } from "@/lib/content/modules/modules-index";

/**
 * The PUBLIC pricing content model.
 *
 * Everything in this file is safe to render, and safe to bundle into a client
 * chunk. It carries no rates, no seat counts and no substitution tokens — the
 * unsettled commercial inputs live in ./pricing-rates.ts, which is marked
 * `server-only` so it cannot follow a client component into the browser.
 *
 * That split is the whole point. Before it, `pricing-tiers.tsx` was a client
 * component importing the single combined content module, which put every
 * token into `static/chunks` — including the annual rates the page never even
 * rendered. A reader could not see them; anyone opening the bundle could.
 */

/* --------------------------------------------------------- disclosure gate */

/**
 * Whether the page may print a figure.
 *
 * One switch, read by every price surface below. It is `false` because no
 * commercial terms are approved: until they are, every price slot on the page
 * reads "Contact sales", so nothing on it can be mistaken for a quote or
 * scraped as one.
 *
 * Turning this on is a deliberate commercial decision, not a formatting one.
 * It requires: real figures in ./pricing-rates.ts, a presentation layer that
 * reads them on the server, and sign-off that the numbers may be published.
 */
export const priceDisclosure = { enabled: false } as const;

/**
 * What every price slot says while `priceDisclosure` is off.
 *
 * A sentence, not a mask. The rules this replaces — "₹ ******" — still put a
 * rupee sign in front of a withheld figure, which implies an amount nobody has
 * approved. This states the commercial model instead, which is sales-led, and
 * it is real text: no decorative glyph to hide from assistive technology, and
 * no token to leak. It is announced exactly as it is read.
 */
export const CONTACT_PRICE = "Contact sales";

/* ------------------------------------------------------------------ types */

export type BillingPeriod = "monthly" | "annual";

export type TierId = "starter" | "growth" | "enterprise";

export type PricingTier = {
  id: TierId;
  name: string;
  /** One line on who the tier is for. Never a feature list. */
  audience: string;
  /**
   * A two- or three-word compression of `audience`, for the comparison grid's
   * column headers where a full sentence will not fit. Every one of these is a
   * literal fragment of the `audience` line above it, so the short form can
   * never drift into a claim the long form does not already make.
   */
  shortAudience: string;
  /**
   * What the price line shows. `contact` renders `CONTACT_PRICE`, which is what
   * all three tiers carry while pricing is unapproved; `quoted` renders its
   * literal `label`, and is the branch a tier takes once an approved figure may
   * be published. No branch of this type can carry an unapproved figure.
   */
  price: { kind: "contact" } | { kind: "quoted"; label: string };
  /** Billing cadence per period. A cadence, never an amount. */
  unit?: Record<BillingPeriod, string>;
  /** Small print under the price. Identical in both billing periods. */
  note: string;
  inclusions: readonly string[];
  cta: { label: string; href: string };
  /** Exactly one tier carries this. It is the page's only bold moment. */
  featured?: boolean;
  badge?: string;
};

/* ------------------------------------------------------------------ tiers */

export const pricingTiers: readonly PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    audience:
      "For a single store or warehouse putting its operation on record.",
    shortAudience: "Single store or warehouse",
    price: { kind: "contact" },
    unit: { monthly: "billed monthly", annual: "billed annually" },
    note: "Final pricing based on your setup.",
    /* Capacity limits are commercial terms as much as the rate is, so the
       bullets describe the shape of the plan rather than counting seats. */
    inclusions: [
      "One operating entity",
      "A fixed user allowance",
      "Inventory, procurement and POS",
      "Piece and series barcodes",
      "GST-ready billing and returns",
      "Accounting with entity-level books",
      "Email support",
    ],
    cta: { label: "Book a Demo", href: "/contact?utm_source=pricing-starter" },
  },
  {
    id: "growth",
    name: "Growth",
    audience:
      "For brands running several locations and a partner network together.",
    shortAudience: "Several locations",
    price: { kind: "contact" },
    unit: { monthly: "billed monthly", annual: "billed annually" },
    note: "Final pricing based on your setup.",
    inclusions: [
      "Multiple operating entities",
      "A larger user allowance",
      "Everything in Starter, plus wholesale",
      "Ecommerce catalogue and online orders",
      "Analytics across every entity",
      "Stock transfers with in-transit visibility",
      "Priority support and onboarding",
    ],
    cta: { label: "Book a Demo", href: "/contact?utm_source=pricing-growth" },
    featured: true,
    badge: "Most popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    audience:
      "For multi-entity groups running franchise networks and consolidated books.",
    shortAudience: "Multi-entity groups",
    price: { kind: "contact" },
    note: "Scoped to your operating structure.",
    inclusions: [
      "Unlimited operating entities",
      "Unlimited users",
      "Everything in Growth, plus franchise",
      "Network-level oversight and allocation",
      "Consolidated and per-entity reporting",
      "Custom roles and entity scope",
      "Named contact and migration support",
    ],
    cta: {
      label: "Talk to sales",
      href: "/contact?utm_source=pricing-enterprise",
    },
  },
];

/* ------------------------------------------------------- comparison matrix */

export type ModuleRow = {
  /** Canonical module slug, and the key this row is addressed by. */
  slug: string;
  name: string;
  /** One-line operating result. Approved copy, from the module index. */
  outcome: string;
  /** The longer approved summary, shown when the row is expanded. */
  summary: string;
  capabilities: readonly string[];
  /** The module's existing route. Never constructed anywhere else. */
  route: string;
  icon: LucideIcon;
  /** Ordered to match `pricingTiers`. */
  availability: Record<TierId, boolean>;
};

/**
 * Which tiers carry which module.
 *
 * This map is the only thing about the comparison that is a pricing decision,
 * so it is the only thing kept here. Names, icons, one-line outcomes, summaries
 * and routes all come from `moduleIndexItems`, which is the canonical module
 * record for the whole site — /modules, the home showcase and now this grid all
 * read the same nine rows. Duplicating a module's description into the pricing
 * model would mean a wording change on /modules silently disagreeing with the
 * pricing page.
 *
 * Wholesale, ecommerce, analytics and franchise are the four that separate the
 * tiers, which is what makes the grid worth reading. Everything a business
 * needs to record a transaction correctly — stock, purchasing, billing, books
 * and access control — is in every tier, because a partial one of those is not
 * a cheaper product, it is a broken one.
 */
const moduleAvailability: Record<string, Record<TierId, boolean>> = {
  inventory: { starter: true, growth: true, enterprise: true },
  procurement: { starter: true, growth: true, enterprise: true },
  "sales-pos": { starter: true, growth: true, enterprise: true },
  wholesale: { starter: false, growth: true, enterprise: true },
  franchise: { starter: false, growth: false, enterprise: true },
  accounting: { starter: true, growth: true, enterprise: true },
  ecommerce: { starter: false, growth: true, enterprise: true },
  analytics: { starter: false, growth: true, enterprise: true },
  security: { starter: true, growth: true, enterprise: true },
};

/** The nine modules against the three tiers, in the canonical module order. */
export const comparisonModules: readonly ModuleRow[] = moduleIndexItems.map(
  (item) => ({
    slug: item.slug,
    name: item.title,
    outcome: item.outcome,
    summary: item.summary,
    capabilities: item.capabilities,
    route: `/modules/${item.slug}`,
    icon: item.icon,
    availability: moduleAvailability[item.slug],
  }),
);

/* ------------------------------------------------------ included in every plan */

export type IncludedItem = {
  title: string;
  body: string;
  icon: LucideIcon;
};

/**
 * Four things that are never a tier decision.
 *
 * Each one is already claimed elsewhere on the site — the GST feature page,
 * the security module and the demo FAQ — so this strip repeats existing
 * commitments rather than making new ones.
 */
export const includedInEveryPlan: readonly IncludedItem[] = [
  {
    title: "GST compliance",
    body: "Tax treatment captured on the transaction, not rebuilt at month-end.",
    icon: FileCheck2,
  },
  {
    title: "Roles and entity scope",
    body: "A role decides what a person may do; entity scope decides where.",
    icon: KeyRound,
  },
  {
    title: "Your data, exportable",
    body: "Your operating records stay yours, and leave in an open format.",
    icon: DatabaseBackup,
  },
  {
    title: "Encrypted in transit",
    body: "Every session secured, with actions recorded against the document.",
    icon: Lock,
  },
];

/* ---------------------------------------------------------------- add-ons */

export type AddOn = {
  id: string;
  name: string;
  body: string;
  /** Cadence, or "one-time" for a fixed engagement. Never an amount. */
  cadence: string;
};

/**
 * Optional extras. The rate slots for these live in ./pricing-rates.ts under
 * the same ids; nothing here carries one.
 */
export const addOns: readonly AddOn[] = [
  {
    id: "entity",
    name: "Additional operating entity",
    body: "A further store, warehouse or company with its own books and scope.",
    cadence: "per month",
  },
  {
    id: "franchise",
    name: "Franchise module",
    body: "Outlet structure, allocation and network oversight on Starter or Growth.",
    cadence: "per month",
  },
  {
    id: "ecommerce",
    name: "Ecommerce storefront",
    body: "Catalogue, CMS and online orders drawn from live stock, on Starter.",
    cadence: "per month",
  },
  {
    id: "counter",
    name: "Additional billing counter",
    body: "One more concurrent POS session with its own operator and close.",
    cadence: "per month",
  },
  {
    id: "migration",
    name: "Onboarding and data migration",
    body: "Masters, opening stock and balances brought across and reconciled.",
    cadence: "one-time",
  },
];

/* -------------------------------------------------------------------- faq */

export type PricingFaqItem = { id: string; question: string; answer: string };

/**
 * Answers are complete sentences on their own. The unsettled terms that used
 * to be appended to them as visible `{{…}}` fragments now sit in
 * ./pricing-rates.ts under matching ids, ready to be folded back in once the
 * wording is approved.
 */
export const pricingFaq: readonly PricingFaqItem[] = [
  {
    id: "counted",
    question: "What exactly is a plan priced on?",
    answer:
      "Operating entities and users, not transaction volume. A busy month costs the same as a quiet one, so the bill does not punish a good season.",
  },
  {
    id: "entity",
    question: "What counts as an operating entity?",
    answer:
      "Anything that keeps its own books and its own stock position — a company, a warehouse, a retail store or a franchise outlet. Locations that post into the same set of books are one entity, not several.",
  },
  {
    id: "switch",
    question: "Can we move between tiers later?",
    answer:
      "Yes, in both directions, and your records come with you. Moving up opens the additional modules immediately; moving down keeps historical documents readable even where a module is no longer active.",
  },
  {
    id: "annual",
    question: "How does annual billing work?",
    answer:
      "One invoice for twelve months instead of twelve invoices, at a lower effective rate. We will confirm the exact figure for your setup when we scope it.",
  },
  {
    id: "implementation",
    question: "Is there an implementation cost?",
    answer:
      "Onboarding and data migration are quoted separately, because the work depends on what you are moving from. A single store with clean masters is a different engagement from a network with five years of history.",
  },
  {
    id: "trial",
    question: "Can we try it before committing?",
    answer:
      "Start with a demo on your own workflows rather than a sandbox with sample data. Bring two or three real situations and we will walk them through the system on screen.",
  },
  {
    id: "support",
    question: "What support is included?",
    answer:
      "Every plan includes email support. Growth and Enterprise add priority response, and Enterprise adds a named contact who knows your operating structure.",
  },
  {
    id: "contract",
    question: "Are we locked into a contract?",
    answer:
      "Monthly plans can be cancelled at any time. Annual plans run for the term you have paid for. Your data stays exportable throughout, and on the way out.",
  },
];
