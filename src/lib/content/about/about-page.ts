/**
 * Copy and diagram data for /about.
 *
 * The page is a scroll narrative: every block below owns a full viewport and a
 * bespoke visual, so the data here is shaped per-section rather than as one
 * generic list. Claims stay qualitative per the content policy — the diagrams
 * are labelled illustrative where they show sample records.
 */

export const aboutHero = {
  eyebrow: "About Fibonce",
  headlinePrimary: "One operation. One record.",
  headlineAccent: "One truth.",
  /** Rendered word-by-word; `accent` gets the brand gradient. */
  headline: [
    { text: "One operation.", accent: false },
    { text: "One record.", accent: false },
    { text: "One truth.", accent: true },
  ],
  summary:
    "Fibonce Tech Solutions builds Bizonix — an enterprise ERP for Indian brands running wholesale, retail and franchise together. We start with the operation on the floor, then build the software around it.",
  primaryCta: { label: "Book a demo", href: "/contact" },
  secondaryCta: { label: "Why we built it", href: "#mission" },
  /** The hero centrepiece — a photograph, framed as the subject. */
  image: {
    src: "/images/about/hero/about-hero.webp",
    alt: "The Fibonce team reading one operating picture together",
    objectPosition: "92% 50%",
    credit: "Fibonce Tech Solutions Pvt. Ltd.",
    creditNote: "Makers of Bizonix",
  },
  rail: [
    "Business and Operations, Smarter Together",
    "Wholesale · Retail · Franchise",
    "Live with Pratyush",
  ],
  scrollCue: "Scroll",
} as const;

export const aboutMission = {
  eyebrow: "Our mission",
  headlinePrimary: "Close the distance ",
  headlineAccent: "between operations.",
  /** Illuminated word-by-word as the sticky frame is scrolled. */
  statement:
    "Most brands do not fail at operations. They fail in the distance between them — the gap where a stock count, a franchise order and a ledger entry quietly stop agreeing. Fibonce exists to close that distance, so one movement on the floor becomes one record in the books, across every entity you run.",
  signature:
    "Technology should connect the operation, not add another layer between it.",
  attribution: "Fibonce Tech Solutions Pvt. Ltd.",
} as const;

export type OriginIcon =
  | "sheet"
  | "message"
  | "unlink"
  | "clock"
  | "network"
  | "workflow"
  | "database"
  | "insights";

/**
 * Each row is one operating reality shown twice: the chip travels from
 * scattered disorder into an ordered column while its content crossfades from
 * the `before` state to the `after` state.
 */
export const aboutOrigin = {
  eyebrow: "Our story",
  chapter: "02 / THE ORIGIN",
  headlinePrimary: "The problem was never the number of tools, it was the ",
  headlineAccent: "distance between them.",
  headline: [
    "The problem was never the number of tools,",
    "it was the distance between them.",
  ],
  headlineAccentWords: "distance between them.",
  paragraphs: [
    "Teams were working harder, not smarter. Critical data sat in silos, processes leaned on manual steps, and every decision arrived a step behind the operation it described.",
    "So we built the opposite: one connected flow where people, process and systems finally agree on the same record.",
  ],
  quote:
    "Built from the floor backwards — so every screen reflects the physical movement of stock.",
  beforeLabel: "Disconnected",
  afterLabel: "One operating flow",
  image: {
    src: "/images/about/story/our-story.webp",
    alt: "A supervisor and a stock handler checking a carton against a printed list",
    objectPosition: "78% 48%",
    caption: "Where the record is actually made.",
  },
  rows: [
    {
      before: { label: "Spreadsheets everywhere", icon: "sheet" as OriginIcon },
      after: {
        label: "Single source of truth",
        icon: "database" as OriginIcon,
      },
      scatter: { x: -16, y: -24, r: -5 },
    },
    {
      before: { label: "Manual follow-ups", icon: "message" as OriginIcon },
      after: { label: "Connected workflows", icon: "workflow" as OriginIcon },
      scatter: { x: 64, y: -12, r: 5 },
    },
    {
      before: { label: "Disconnected systems", icon: "unlink" as OriginIcon },
      after: { label: "Unified operating view", icon: "network" as OriginIcon },
      scatter: { x: -20, y: 16, r: -4 },
    },
    {
      before: { label: "Delayed decisions", icon: "clock" as OriginIcon },
      after: { label: "Real-time visibility", icon: "insights" as OriginIcon },
      scatter: { x: 58, y: 28, r: 4 },
    },
  ],
} as const;

export type ValueId = "reliability" | "operational-depth" | "partner-success";

export type AboutValue = {
  id: ValueId;
  number: "01" | "02" | "03";
  label: string;
  headline: string;
  headlinePrimary: string;
  headlineAccent: string;
  body: string;
  /** Short line printed under the bespoke visual. */
  caption: string;
  image: string;
  imageAlt: string;
  objectPosition: string;
};

export const aboutValues: AboutValue[] = [
  {
    id: "reliability",
    number: "01",
    label: "Reliability",
    headline: "Boring, on purpose.",
    headlinePrimary: "Boring, ",
    headlineAccent: "on purpose.",
    body: "An ERP earns trust the way a warehouse does — by behaving identically on the busiest day of the season and the quietest day of the month. We optimise for the run nobody has to talk about afterwards.",
    caption: "Every workflow. Every record. Every day.",
    image: "/images/about/values/reliability.webp",
    imageAlt:
      "A warehouse operator scanning the barcode on a carton before it moves",
    objectPosition: "56% 50%",
  },
  {
    id: "operational-depth",
    number: "02",
    label: "Operational depth",
    headline: "We read the floor, not the brief.",
    headlinePrimary: "We read the floor, ",
    headlineAccent: "not the brief.",
    body: "Behind every screen is a counter, a carton and a person under time pressure. We go down through the layers — interface, workflow, operation, people — until the software matches how the work is actually done.",
    caption: "Understand the work behind the screen.",
    image: "/images/about/values/operational-depth.webp",
    imageAlt: "",
    objectPosition: "52% 48%",
  },
  {
    id: "partner-success",
    number: "03",
    label: "Partner success",
    headline: "Go-live is the middle, not the end.",
    headlinePrimary: "Go-live is the middle, ",
    headlineAccent: "not the end.",
    body: "The interesting problems arrive after launch — a new outlet, a new season, a process that changed on the ground. We stay in the operation with you, so the system keeps earning its place.",
    caption: "Build with the business. Stay useful beyond delivery.",
    image: "/images/about/values/partner-success.webp",
    imageAlt: "",
    objectPosition: "51% 47%",
  },
];

/** The partner rail deliberately continues past the go-live marker. */
export const partnerJourney = [
  { label: "Discovery", note: "Walk the operation" },
  { label: "Build", note: "Shape to real workflows" },
  { label: "Go live", note: "Cutover with the team" },
  { label: "Adoption", note: "Habits, not training decks" },
  { label: "Growth", note: "New outlets, new entities" },
] as const;

/** Layers peeled apart in the operational-depth cross-section. */
export const depthLayers = [
  { label: "Interface", note: "What the user touches" },
  { label: "Workflow", note: "The sequence it belongs to" },
  { label: "Operation", note: "Stock, money, movement" },
  { label: "People", note: "Who is accountable" },
] as const;

export type PrincipleId =
  "entity-isolation" | "barcode-truth" | "books-match-ops";

export type AboutPrinciple = {
  id: PrincipleId;
  number: "01" | "02" | "03";
  label: string;
  headline: string;
  headlinePrimary: string;
  headlineAccent: string;
  body: string;
  frame: string;
  caption: string;
};

export const aboutPrinciples: AboutPrinciple[] = [
  {
    id: "entity-isolation",
    number: "01",
    label: "Entity isolation",
    headline: "Shared platform. Separate books.",
    headlinePrimary: "Shared platform. ",
    headlineAccent: "Separate books.",
    body: "A franchise outlet, a company store and the wholesale HQ run on one platform without ever reading each other’s ledgers. Scope is a boundary in the data model, not a filter someone remembers to apply.",
    frame: "Separate environments",
    caption:
      "Clear boundaries between entities — one consolidated view above them.",
  },
  {
    id: "barcode-truth",
    number: "02",
    label: "Barcode truth",
    headline: "One item. One identity. Every movement.",
    headlinePrimary: "One item. One identity. ",
    headlineAccent: "Every movement.",
    body: "A piece is scanned when it is received, when it moves, when it sells and when it comes back. The identity never changes hands, so stock is something you verify rather than estimate.",
    frame: "One item, one identity",
    caption: "The same identity travels through every checkpoint.",
  },
  {
    id: "books-match-ops",
    number: "03",
    label: "Books that match ops",
    headline: "The ledger is a consequence, not a re-entry.",
    headlinePrimary: "The ledger is a consequence, ",
    headlineAccent: "not a re-entry.",
    body: "Every operational event carries its own accounting meaning. Nothing is re-keyed at month end, so the books describe what actually happened on the floor, in the order it happened.",
    frame: "Operation to record",
    caption: "Each event on the floor writes its own line in the books.",
  },
];

export const entityEnvironments = [
  {
    id: "hq",
    name: "Wholesale HQ",
    scope: "Brand-owned",
    rows: ["Inventory", "Purchases", "Sales"],
  },
  {
    id: "retail",
    name: "Company retail",
    scope: "Brand-owned",
    rows: ["Inventory", "Counters", "Sales"],
  },
  {
    id: "franchise",
    name: "Franchise outlet",
    scope: "Partner-owned",
    rows: ["Allocation", "Sales", "Ledger"],
  },
] as const;

export const barcodeCheckpoints = [
  { id: "receive", label: "Receive", note: "GRN at the warehouse" },
  { id: "move", label: "Move", note: "Transfer to an outlet" },
  { id: "sell", label: "Sell", note: "Scanned at the counter" },
  { id: "record", label: "Record", note: "Posted to the books" },
] as const;

export const sampleBarcodeId = "BZX-4471-0093";

/** Illustrative — labelled as such in the UI. */
export const booksEvents = [
  {
    event: "Goods received",
    detail: "GRN · 42 pcs",
    entry: "Inventory Dr · Supplier Cr",
  },
  {
    event: "Stock transferred",
    detail: "HQ → Outlet 04",
    entry: "Entity stock reallocated",
  },
  {
    event: "Counter sale",
    detail: "Invoice · GST applied",
    entry: "Debtor Dr · Sales + Tax Cr",
  },
  {
    event: "Payment received",
    detail: "Receipt against invoice",
    entry: "Bank Dr · Debtor Cr",
  },
] as const;

/**
 * Closing coda, not a call to action — the layout already ends every page with
 * a full conversion band, so this one lands the narrative and hands over.
 */
export const aboutClose = {
  eyebrow: "Where this leads",
  headline: ["One operation.", "One record.", "One truth."],
  body: "That is the whole ambition. It is why every screen in Bizonix is built backwards from the floor it describes — and why we are still there long after go-live.",
  link: { label: "Bring us your workflows", href: "/contact" },
  tagline: "Business and Operations, Smarter Together",
  company: "Fibonce Tech Solutions Pvt. Ltd.",
} as const;
