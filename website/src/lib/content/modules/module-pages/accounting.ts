import { Calculator } from "lucide-react";
import type { ModuleData } from "./types";

export const accountingModule: ModuleData = {
  slug: "accounting",
  title: "Accounting",
  eyebrow: "Books & compliance",
  outcome: "Books that already know what operations did.",
  intro:
    "Accounting is where operations become a financial record. Because the sale, the receipt and the transfer are already documents in the same system, the books are a consequence of the day rather than a re-typing of it.",
  icon: Calculator,
  theme: {
    accent: "#8b5cf6",
    accentDark: "#6437c8",
    accentSoft: "rgba(139, 92, 246, 0.1)",
  },

  hero: {
    eyebrow: "Accounting",
    headline: "Your books follow the work.",
    headlineAccent: "the work.",
    body: "Operating documents become journals, ledgers and returns without re-entry.",
    primaryCta: { label: "Book a demo", href: "/contact" },
    secondaryCta: { label: "Explore all modules", href: "/modules" },
    visualVariant: "finance",
    chain: [
      { id: "event", label: "Operation", detail: "Bill · receipt · return" },
      { id: "journal", label: "Journal", detail: "Dr · Cr" },
      { id: "ledger", label: "Ledger", detail: "Account position" },
      { id: "report", label: "Report", detail: "P&L · balance sheet" },
    ],
    facts: [
      { label: "Posted from", value: "Operating documents" },
      { label: "Scoped by", value: "Operating entity" },
      { label: "Produces", value: "Ledgers, P&L, GST reports" },
    ],
  },

  problemSection: {
    presentation: "visual-stories",
    eyebrow: "Before Accounting",
    title: "Where books lose the day.",
    intro: "Three gaps between what happened and what the ledger knows.",
    problems: [
      {
        id: "re-entry",
        number: "01",
        title: "Month typed twice",
        description: "Same activity entered in operations and again in books.",
        quote: "Closing starts with a CSV and ends with a reconciliation.",
        visual: "period-relay",
      },
      {
        id: "context-lost",
        number: "02",
        title: "Ledger loses the trail",
        description: "A simple line hides the full story behind the numbers.",
        quote: '"What is this ₹ figure?" takes two people and an afternoon.',
        visual: "context-stripped",
      },
      {
        id: "multi-entity",
        number: "03",
        title: "Multiple books, one truth gap",
        description:
          "Each entity keeps its own books, and the group view comes later.",
        quote: "Consolidation is an event, not a report.",
        visual: "entity-split",
      },
    ],
    consequence: {
      title:
        "The books still close. They simply close on a period nobody can interrogate.",
      items: [
        {
          id: "behind",
          label: "Books behind the operation",
          body: "The accounts describe a period that has already ended, from a summary that lost its detail.",
        },
        {
          id: "investigate",
          label: "Figures that need an investigation",
          body: "A ledger line no longer carries the piece, counter or outlet that produced it.",
        },
        {
          id: "event",
          label: "Consolidation as an event",
          body: "The group position is assembled once a quarter, in a file outside the system.",
        },
      ],
    },
  },

  outcomesSection: {
    eyebrow: "After Accounting",
    title: "Three things change about",
    highlight: "how the work runs.",
    intro: "From operating documents to traceable, connected accounting.",
    outcomes: [
      {
        id: "posted-not-typed",
        number: "01",
        visualVariant: "document-posted",
        accent: "#8b5cf6",
        title: "Entries that are posted, not typed",
        description:
          "Operating documents create the accounting record, so the books move at the same speed as the business rather than trailing it by a month.",
      },
      {
        id: "traceable",
        number: "02",
        visualVariant: "traceable-number",
        accent: "#8b5cf6",
        title: "A number you can walk back",
        description:
          "Because the journal is created from a document, a ledger line still points at the bill, receipt or transfer that caused it.",
      },
      {
        id: "entity-clean",
        number: "03",
        visualVariant: "entity-consolidation",
        accent: "#8b5cf6",
        title: "Entities that stay separate and still add up",
        description:
          "Each operating entity keeps its own books while the group can be read across them, without a manual consolidation step in between.",
      },
    ],
  },

  capabilities: {
    groups: [
      {
        id: "structure",
        title: "Book structure",
        context: "The chart the rest of the module posts into.",
        items: [
          "Chart of accounts",
          "Journals",
          "Ledgers",
          "Entity-wise books",
        ],
      },
      {
        id: "flows",
        title: "Money in and out",
        context: "The two running positions most operators check first.",
        items: [
          "Accounts receivable",
          "Accounts payable",
          "Receipts",
          "Supplier and customer positions",
        ],
      },
      {
        id: "reporting",
        title: "Statements & tax",
        context:
          "What the business, the auditor and the tax filing need to read.",
        items: [
          "Profit & loss",
          "Balance sheet",
          "GST reports",
          "Tax treatment carried on the document",
        ],
      },
    ],
  },

  workflow: {
    title: "From an operating event to a statement",
    intro:
      "The path a single transaction takes. Nothing on it is re-keyed; each step reads the one before it.",
    steps: [
      {
        id: "event",
        index: "01",
        title: "An operating document is created",
        body: "A bill is raised, goods are received, a return is processed. The document carries its entity, its value and its tax treatment.",
        record: "Document · with context attached",
      },
      {
        id: "post",
        index: "02",
        title: "The entry is posted",
        body: "The document becomes a journal entry against the chart of accounts for the entity it belongs to.",
        record: "Journal · Dr / Cr",
      },
      {
        id: "ledger",
        index: "03",
        title: "Ledgers move",
        body: "Account positions update — including the receivable or payable side for the customer or supplier involved.",
        record: "Ledger balances · updated",
      },
      {
        id: "settle",
        index: "04",
        title: "Settlement is recorded",
        body: "A receipt or payment closes the open position, leaving the trail from invoice to cash intact.",
        record: "Open item · settled",
      },
      {
        id: "report",
        index: "05",
        title: "Statements are read",
        body: "Profit & loss, balance sheet and GST reports are produced from those ledgers for the entity or across entities.",
        record: "Statements · per entity or group",
      },
    ],
  },

  gallery: {
    variant: "stacked",
    title: "The screens this runs on",
    intro:
      "The accounting screens have not been captured for the website yet. They are listed here as the actual set rather than represented by a mock-up.",
    shots: [
      {
        id: "coa",
        state: "pending",
        featured: true,
        order: 1,
        context: "Structure",
        title: "Chart of accounts",
        description: "The account structure each entity's books post into.",
      },
      {
        id: "journal",
        state: "pending",
        order: 2,
        context: "Posting",
        title: "Journal entries",
        description:
          "Entries created from operating documents, with the source still attached.",
      },
      {
        id: "ledger",
        state: "pending",
        order: 3,
        context: "Positions",
        title: "Ledgers",
        description: "Running account positions across a period.",
      },
      {
        id: "ar-ap",
        state: "pending",
        order: 4,
        context: "Money",
        title: "Receivables & payables",
        description: "Open items by customer and supplier, and their receipts.",
      },
      {
        id: "statements",
        state: "pending",
        order: 5,
        context: "Reporting",
        title: "P&L, balance sheet and GST reports",
        description: "Statements read from the same ledgers.",
      },
    ],
  },

  verticalRelevance: {
    apparel:
      "Season-end markdowns and returns move margin after the sale, so the books have to follow the document rather than the original price.",
    jewellery:
      "High-value, high-count movement makes the link between a ledger line and the specific piece behind it worth keeping.",
    franchise:
      "Each outlet is its own set of books, and the group is readable across them without a manual consolidation pass.",
  },

  faq: [
    {
      id: "when-posted",
      question: "When does an operating document reach the books?",
      answer:
        "As part of the same flow that creates it. A bill, receipt or return is an accounting event as well as an operating one, which is why closing does not begin with an export.",
    },
    {
      id: "entities",
      question: "Can we keep separate books per company or outlet?",
      answer:
        "Yes. Books are held per operating entity, and reporting can be read for one entity or across the group.",
    },
    {
      id: "gst",
      question: "What does GST support cover?",
      answer:
        "Tax treatment is captured on the transaction — the stock line itself carries tax inclusion, tax rate and HSN — and GST reports are produced from those postings. The exact filing workflow should be confirmed against your own compliance process during a demo.",
    },
    {
      id: "trace",
      question: "Can we get from a ledger line back to the transaction?",
      answer:
        "That is the design intent of posting from documents: the entry exists because a document does, so the operating record behind a number is still identifiable.",
    },
    {
      id: "opening",
      question: "How are opening balances handled at go-live?",
      answer:
        "Through opening entries in the same structure, so the first period starts from a recorded position rather than an assumed one. The scope of migration is agreed during implementation.",
    },
  ],

  relatedModules: ["procurement", "sales-pos", "analytics"],

  seo: {
    title: "Accounting module",
    description:
      "Chart of accounts, journals, ledgers, AR/AP, receipts, P&L, balance sheet and GST reports — posted from the operating documents that created them.",
    ogTitle: "Bizonix Accounting — books downstream of the work",
    ogDescription:
      "Operating documents become journals and ledgers per entity, so the month is read rather than re-typed.",
  },
};
