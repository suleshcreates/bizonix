import { BarChart3 } from "lucide-react";
import type { ModuleData } from "./types";

export const analyticsModule: ModuleData = {
  slug: "analytics",
  title: "Analytics",
  eyebrow: "Decision surface",
  outcome: "The whole network on one screen, in real time.",
  intro:
    "Analytics does not collect data separately. It reads the operating records the other modules are already writing, which is why a number on a dashboard can be opened rather than only believed.",
  icon: BarChart3,
  theme: {
    accent: "#6366f1",
    accentDark: "#4144bd",
    accentSoft: "rgba(99, 102, 241, 0.1)",
  },

  hero: {
    eyebrow: "Analytics",
    headline: "Numbers you open, not just read.",
    headlineAccent: "not just read.",
    body: "Every figure leads back to the transactions that produced it.",
    primaryCta: { label: "Book a demo", href: "/contact" },
    secondaryCta: { label: "Explore all modules", href: "/modules" },
    visualVariant: "analytics",
    chain: [
      { id: "records", label: "Records", detail: "Bills · receipts · stock" },
      { id: "entity", label: "Entity", detail: "Whose numbers" },
      { id: "view", label: "View", detail: "Purchase · stock · sales" },
      { id: "decision", label: "Decision", detail: "What to do next" },
    ],
    screen: {
      id: "stock-list",
      focus: "left top",
      alt: "Bizonix stock screen showing summary tiles and an Analytics tab beside the stock list.",
      annotations: [
        {
          id: "tile",
          x: 5,
          y: 7,
          side: "right",
          label: "In stock",
          detail: "A figure computed from the lines below, not typed into a report.",
        },
        {
          id: "tab",
          x: 44,
          y: 15,
          side: "left",
          label: "Analytics",
          detail: "The same screen and the same records, read as analysis.",
        },
        {
          id: "rates",
          x: 42,
          y: 55,
          side: "left",
          label: "SRATE / MRP",
          detail: "Per-line figures the analytics views are built from.",
        },
      ],
    },
    facts: [
      { label: "Built from", value: "Operating documents" },
      { label: "Scoped to", value: "One entity or the group" },
      { label: "Covers", value: "Purchase, stock, sales" },
    ],
  },

  problemSection: {
    eyebrow: "Before Analytics",
    title: "Why the number arrives too late to decide anything.",
    intro:
      "Three failures between the operation producing data and anybody being able to read it together.",
    problems: [
      {
        id: "assembled",
        number: "01",
        title: "Reporting is an assembly job",
        description:
          "Numbers are exported from several places and joined in a spreadsheet, so the report is always a few days old and always slightly different depending on who built it.",
        quote: "Two people, two exports, two versions of last week.",
        visual: "assembled-report",
      },
      {
        id: "dead-end",
        number: "02",
        title: "A number is a dead end",
        description:
          "A dashboard shows a total but nothing behind it. Anyone who wants to know why has to leave the report and start searching the underlying system by hand.",
        quote: "The chart raises a question the chart cannot answer.",
        visual: "dead-end-number",
      },
      {
        id: "no-network",
        number: "03",
        title: "The network cannot be read together",
        description:
          "Each outlet or company reports on itself, and the group view only exists once someone has manually stacked those reports side by side.",
        quote: "Group performance is a quarterly spreadsheet exercise.",
        visual: "unreadable-network",
      },
    ],
    consequence: {
      title: "The data already exists. It is the reading of it that costs a week.",
      items: [
        {
          id: "disagree",
          label: "Reports that disagree",
          body: "Two people export the same period and produce two versions of it.",
        },
        {
          id: "unanswerable",
          label: "Questions the report cannot take",
          body: "A total shows what happened and nothing about why, so the search restarts by hand.",
        },
        {
          id: "quarterly",
          label: "A group view once a quarter",
          body: "Outlets report on themselves, and the network exists only when someone stacks them.",
        },
      ],
    },
  },

  outcomesSection: {
    eyebrow: "After Analytics",
    title: "Three things change about",
    highlight: "how the business sees.",
    intro: "Read the operation, reach the source and see the group together.",
    outcomes: [
      {
        id: "same-source",
        number: "01",
        visualVariant: "data-signal",
        accent: "#6366f1",
        title: "One source for every view",
        description: "Purchase, inventory and sales analytics all read the operating records rather than an extract, so two people asking the same question get the same answer.",
      },
      {
        id: "openable",
        number: "02",
        visualVariant: "decision-state",
        accent: "#6366f1",
        title: "A total that can be opened",
        description: "Because the view is built on documents, the lines behind a figure are still reachable — the report is a way into the detail rather than a substitute for it.",
      },
      {
        id: "consolidated",
        number: "03",
        visualVariant: "consolidated-view",
        accent: "#6366f1",
        title: "Entity and group in the same place",
        description: "Numbers can be read for one outlet or across the network without anybody rebuilding the consolidation each time.",
      },
    ],
  },

  capabilities: {
    groups: [
      {
        id: "operational",
        title: "Operational views",
        context: "The three questions asked most often, each on its own records.",
        items: [
          "Purchase analytics",
          "Inventory analytics",
          "Sales analytics",
          "Sell-through by entry",
        ],
      },
      {
        id: "dashboards",
        title: "Dashboards",
        context: "The at-a-glance surface, and the summary tiles behind it.",
        items: [
          "Dashboards",
          "Stock value and stock count summaries",
          "Order totals by filter",
          "Low-stock signals",
        ],
      },
      {
        id: "scope",
        title: "Scope & export",
        context: "Reading the same view for a location, an entity or the group.",
        items: [
          "Entity-wise views",
          "Consolidated network view",
          "Location filtering",
          "CSV export",
        ],
      },
    ],
    limitations: [
      "A public API is not yet available — the site states it as coming soon. External BI connections should be scoped during implementation rather than assumed.",
    ],
  },

  workflow: {
    variant: "data-to-report",
    title: "From an operating record to a decision",
    intro:
      "Analytics is the last step of a chain that has already happened. Nothing here is entered.",
    steps: [
      {
        id: "capture",
        index: "01",
        title: "Operations write the record",
        body: "Receiving, billing, transfers and returns each create a document with its entity, value and location attached.",
        record: "Documents · with context",
      },
      {
        id: "scope",
        index: "02",
        title: "Records are scoped",
        body: "Every record already knows which entity and location it belongs to, so a view can be built for one outlet or for all of them.",
        record: "Scope · entity and location",
      },
      {
        id: "aggregate",
        index: "03",
        title: "Views are built",
        body: "Purchase, inventory and sales views summarise those records — stock value, sell-through, order totals — without a separate load step.",
        record: "View · derived, not entered",
      },
      {
        id: "inspect",
        index: "04",
        title: "A figure is opened",
        body: "The lines behind a summary remain reachable, so a surprising number can be examined rather than argued about.",
        record: "Lines behind the total",
      },
      {
        id: "act",
        index: "05",
        title: "The decision goes back into the system",
        body: "A transfer, a purchase or a price change is made in the module that owns it, and the next view already reflects it.",
        record: "Action · back on the record",
      },
    ],
  },

  gallery: {
    variant: "featured-plus-grid",
    title: "The screens this runs on",
    intro:
      "One real capture showing how summaries and detail share a screen. The dedicated dashboards have not been captured yet and are marked as such.",
    shots: [
      {
        id: "summary-tiles",
        state: "captured",
        screen: "stock-list",
        featured: true,
        order: 1,
        context: "Summary and detail together",
        title: "Summaries sit on top of the records",
        description:
          "Stock count, stock value, line count and location count are summarised above the very lines they are computed from, with an Analytics tab beside the list.",
        alt: "Bizonix stock screen with in-stock, stock value, lines and locations tiles above the stock list, next to an Analytics tab.",
        annotations: [
          {
            id: "tiles",
            x: 20,
            y: 7,
            label: "Summary tiles",
            detail: "Computed from the rows underneath, not entered.",
          },
          {
            id: "tab",
            x: 44,
            y: 15,
            label: "Analytics tab",
            detail: "The analysed view of the same records.",
          },
          {
            id: "export",
            x: 87,
            y: 15,
            label: "Export CSV",
            detail: "The current view, exported as it stands.",
          },
        ],
      },
      {
        id: "sell-through",
        state: "captured",
        screen: "series-ledger",
        order: 2,
        context: "Inventory analytics",
        title: "Sell-through per entry",
        description:
          "Opened, sold and remaining quantity on each entry, with the sell-through that follows from them — analysis on the operating record itself.",
        alt: "Bizonix series entry ledger showing opened, sold, in-stock and a sell-through bar per entry.",
        annotations: [
          {
            id: "bar",
            x: 62,
            y: 5,
            label: "SELL-THROUGH",
            detail: "Derived from opened and sold on the same row.",
          },
        ],
      },
      {
        id: "order-totals",
        state: "captured",
        screen: "order-list",
        order: 3,
        context: "Sales analytics",
        title: "Totals across a filter",
        description:
          "Order count, paid value, total value and item count for whatever filter is applied — the sales view resolving on the orders themselves.",
        alt: "Bizonix orders screen showing a totals bar with order count, paid, total and item count above the order rows.",
        annotations: [
          {
            id: "totals",
            x: 40,
            y: 5,
            label: "Totals",
            detail: "Recomputed for the current filter.",
          },
        ],
      },
      {
        id: "dashboard",
        state: "pending",
        order: 4,
        context: "At a glance",
        title: "Dashboard",
        description: "The consolidated operating view across modules.",
      },
      {
        id: "purchase-analytics",
        state: "pending",
        order: 5,
        context: "Buying",
        title: "Purchase analytics",
        description: "Buying patterns read from the purchase records.",
      },
    ],
  },

  verticalRelevance: {
    apparel:
      "Sell-through matters at size and colour, which is only possible because the record underneath is held at that level.",
    jewellery:
      "With very large design counts, the useful question is which entries are moving — not which category is.",
    franchise:
      "The same view can be read for one outlet or for the whole network, which is what makes a partner conversation factual.",
  },

  faq: [
    {
      id: "realtime",
      question: "How current are the numbers?",
      answer:
        "Views are built from the operating records rather than a nightly extract, so what a dashboard shows moves with the documents the business is creating.",
    },
    {
      id: "consolidated",
      question: "Can we see the whole network in one place?",
      answer:
        "Yes. Records carry the entity and location they belong to, so the same view can be read for one outlet or consolidated across the group.",
    },
    {
      id: "drill",
      question: "Can we get from a summary to the underlying lines?",
      answer:
        "The summaries are computed from records that stay in the system — the stock tiles sit directly above the lines they are derived from, and order totals recompute against the orders in view.",
    },
    {
      id: "export",
      question: "Can we take the data out?",
      answer:
        "Views can be exported as CSV as they stand. A public API is listed as coming soon, so a live BI connection should be scoped during implementation.",
    },
    {
      id: "custom",
      question: "Can reports be tailored to how we work?",
      answer:
        "The shipped views cover purchase, inventory and sales with entity and location filtering. Anything beyond that is worth walking through in a demo against your actual reporting pack.",
    },
  ],

  relatedModules: ["inventory", "accounting", "franchise"],

  seo: {
    title: "Analytics module",
    description:
      "Purchase, inventory and sales views built on the operating records themselves, readable per entity or consolidated across the network.",
    ogTitle: "Bizonix Analytics — numbers you can open",
    ogDescription:
      "Dashboards derived from live operating documents, scoped to one entity or the whole group.",
  },
};
