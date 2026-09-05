/**
 * Single source of truth for /contact copy.
 *
 * CONTENT SAFETY — read before editing.
 * This repository keeps a BUILT & REAL vs GUESSED audit (see
 * `bizonix-website-content-gaps.md`). Bizonix has one deployment reference and
 * it is published anonymously and qualitatively (`proof-stories.ts`); the
 * product content files state explicitly that no certification claim is made.
 *
 * Therefore this file MUST NOT carry invented metrics, named testimonials,
 * customer logos, certifications, or price bands. Unverified proof is modelled
 * as `null` and the UI falls back to approved qualitative evidence, exactly the
 * way `site-config.ts` models unconfigured contact details as `_TBD`.
 *
 * To publish real proof: fill `verifiedProof` once the numbers are approved for
 * public use, and the stat band renders automatically.
 */

export type DemoTrack = "book" | "brief";

export const contactHero = {
  eyebrow: "Book a demo",
  /** Warm traffic: already convinced, arriving to schedule. Confirmation, not selling. */
  book: {
    headline: "Your Bizonix demo",
    headlineAccent: "is two steps away.",
    lede: "Pick a time that suits your team. Thirty minutes, no preparation needed — bring a real problem from your operation and we will work through it on screen.",
  },
  /** Cold traffic: needs to understand relevance before spending time. */
  brief: {
    headline: "See Bizonix run",
    headlineAccent: "your workflows.",
    lede: "Tell us how your warehouse, stores and franchise outlets actually operate. We will shape the session around that instead of running a generic product tour.",
  },
} as const;

export const heroCta = {
  primary: { id: "brief" as const, label: "Tell us your priorities first" },
  secondary: { id: "book" as const, label: "I know what Bizonix does" },
  skip: "Already familiar? Skip to the calendar",
} as const;

export const trackToggle = {
  label: "Choose how you would like to start",
  options: [
    {
      id: "book" as const,
      label: "Find a time",
      /** Short form for the compact segmented control, which wraps on phones. */
      short: "Find a time",
      hint: "I know what Bizonix does",
    },
    {
      id: "brief" as const,
      label: "Tell us your priorities first",
      short: "Share priorities",
      hint: "I want a relevant session",
    },
  ],
} as const;

/** Removes time and preparation anxiety — the top objection for a 30-minute call. */
export const demoAgenda = {
  title: "What the 30 minutes covers",
  note: "No slides. We open the product and work through your operation.",
  items: [
    {
      duration: "5 min",
      title: "Your operation",
      body: "How stock, billing and books move between HQ, stores and franchise outlets today.",
    },
    {
      duration: "15 min",
      title: "The workflow, live",
      body: "We run your priorities through the product — receiving, transfer, billing, returns, reconciliation.",
    },
    {
      duration: "7 min",
      title: "Fit and gaps",
      body: "What Bizonix handles, what it does not, and where you would still need a workaround.",
    },
    {
      duration: "3 min",
      title: "Next steps",
      body: "Scope, rollout sequence and commercials, if it is worth continuing.",
    },
  ],
} as const;

/** Short, defensible reassurances. No numbers, no unverifiable claims. */
export const trustPoints = [
  "One working session, not a sales pitch",
  "Run by someone who knows your workflows",
  "We show you where the product does not fit",
] as const;

/**
 * The hero visual: the operating chain a demo actually walks through. Vector,
 * not a screenshot, so it costs no image bytes and invents no dashboard data.
 */
export const workflowNodes = [
  { id: "warehouse", label: "Warehouse", icon: "warehouse" as const },
  { id: "hq", label: "Head office", icon: "hq" as const },
  { id: "stores", label: "Stores", icon: "store" as const },
  { id: "franchise", label: "Franchise", icon: "franchise" as const },
] as const;

export const roleOptions = [
  { value: "founder-director", label: "Founder / Director", weight: 30 },
  { value: "finance", label: "Finance / Accounts", weight: 30 },
  { value: "operations", label: "Operations / Warehouse", weight: 20 },
  { value: "retail", label: "Retail / Store operations", weight: 20 },
  { value: "franchise", label: "Franchise / Channel", weight: 20 },
  { value: "it", label: "IT / Systems", weight: 15 },
  { value: "other", label: "Other", weight: 5 },
] as const;

/**
 * Priorities mirror the approved problem language already published on the home
 * page (`home.ts` → `challenges`), so the demo agenda is built from wording the
 * business has already signed off on.
 */
export const priorityOptions = [
  { value: "visibility", label: "Live stock visibility across locations" },
  { value: "allocation", label: "Getting stock to the right store" },
  { value: "franchise", label: "Franchise orders drifting off-system" },
  { value: "reconciliation", label: "Month-end reconciliation" },
  { value: "gst", label: "GST-ready books without re-entry" },
  { value: "barcode", label: "Piece-level identity and traceability" },
] as const;

export const MAX_PRIORITIES = 2;

export const timelineOptions = [
  {
    value: "this-quarter",
    label: "This quarter",
    hint: "Next 90 days",
    weight: 40,
  },
  {
    value: "next-quarter",
    label: "Next quarter",
    hint: "3–6 months",
    weight: 20,
  },
  {
    value: "exploring",
    label: "Exploring options",
    hint: "6 months or more",
    weight: 5,
    /** Shown when selected: sets expectations honestly instead of pushing. */
    note: "No pressure. We will keep the session short and send material you can share internally.",
  },
] as const;

/**
 * Verified, publicly approved outcome metrics.
 *
 * Leave as `null` until Fibonce confirms figures AND the referenced customer
 * approves public use. When populated, `ProofBand` renders the stat row in
 * place of the qualitative evidence fallback.
 *
 * Shape when ready, e.g.:
 *   [{ value: "3 days", label: "Month-end close", detail: "Down from 15" }]
 */
export const verifiedProof:
  | {
      value: string;
      label: string;
      detail: string;
    }[]
  | null = null;

/**
 * Customer logos approved for public display. Empty until written permission
 * exists — an unauthorised logo wall is a legal problem, not a design choice.
 */
export const approvedLogos: { name: string; src: string }[] = [];

/**
 * Qualitative evidence fallback, lifted verbatim from the approved anonymized
 * story in `proof-stories.ts`. Safe to publish today.
 */
export const qualitativeEvidence = [
  { value: "Real-time", label: "Inventory visibility" },
  { value: "Automated", label: "Franchise governance" },
  { value: "Continuous", label: "Financial reconciliation" },
  { value: "Audit-ready", label: "GST compliance" },
] as const;

export const proofQuote = {
  text: "Bizonix is designed to keep warehouse, stores and franchise operations on one connected record, so teams can trace movement without stitching together separate systems.",
  attribution: "Representative operating model",
  context: "Illustrative product walkthrough",
} as const;

/**
 * Objection handling. Every answer is written to be true today for a pre-launch
 * India ERP. Nothing here asserts a certification, an average implementation
 * time, or a price band, because none of those are verified in this repository.
 */
export const demoFaq = [
  {
    id: "length",
    question: "How long is the demo, and do I need to prepare?",
    answer:
      "Thirty minutes, and no preparation. It helps if you bring two or three real situations — a transfer that went wrong, a stock count that did not match, a month-end that took too long. We work through those on screen.",
  },
  {
    id: "not-ready",
    question: "What if we are not ready to buy?",
    answer:
      "That is a normal reason to take the call. A lot of teams use the session to understand what a connected system would change before they budget for one. If it is not the right time, we will say so and leave you with something useful.",
  },
  {
    id: "security",
    question: "Where does our data live, and who can see it?",
    answer:
      "Access is scoped per entity, so a franchise outlet sees its own operation and head office sees the network. Data is encrypted in transit. Hosting region, retention and the full security posture are covered in writing during evaluation — ask on the call and we will send the current documentation rather than a marketing summary.",
  },
  {
    id: "implementation",
    question: "How long does implementation take?",
    answer:
      "It depends on how many entities, locations and existing records are involved, and on how clean the opening stock and master data are. We scope it against your actual setup on the call instead of quoting an average that would not apply to you.",
  },
  {
    id: "existing-systems",
    question: "Will this replace our current systems or work alongside them?",
    answer:
      "Both are possible. Most operations keep something in place — a billing tool, an accounting package, a marketplace panel — and use Bizonix as the operating record underneath. Bring your current stack to the call and we will map what moves and what stays.",
  },
  {
    id: "pricing",
    question: "What does it cost?",
    answer:
      "Pricing depends on entities, modules and users, so there is no single number that would be honest here. We will walk through the commercial model against your scope on the call, and you will get it in writing afterwards.",
  },
  {
    id: "after-golive",
    question: "What happens after go-live?",
    answer:
      "The same people who scoped the rollout stay on it. Expect hands-on support through the first close and the first full stock cycle, because that is when the real edge cases surface. We will set out exactly what ongoing support looks like in writing before you commit.",
  },
] as const;

export const calendarSection = {
  title: "Pick your preferred time",
  body: "Availability updates in real time. Thirty minutes, no preparation needed.",
  /**
   * Scarcity line. Null unless a real remaining-slot count is available from the
   * scheduling provider — a fabricated countdown is the fastest way to lose an
   * enterprise buyer's trust.
   */
  slotsLeft: null as number | null,
} as const;

export const successCopy = {
  title: "Demo request received.",
  /** Deliberately does not promise a response time faster than the team can hold. */
  body: "We will confirm a time by email, usually within one business day. If your timeline is this quarter, expect to hear from us sooner.",
  stepsTitle: "What happens next",
  steps: [
    "You get a confirmation email with the agenda and the joining link.",
    "We prepare the session around the priorities you selected.",
    "If anything changes, reply to that email and we will move the slot.",
  ],
} as const;

export const altContact = {
  title: "Would rather not fill a form?",
  body: "Both of these reach the same team.",
  whatsappMessage:
    "Hi Bizonix, I would like to book a product demo. Can you help me find a time?",
} as const;
