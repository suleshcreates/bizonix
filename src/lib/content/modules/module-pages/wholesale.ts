import { Building2 } from "lucide-react";
import type { ModuleData } from "./types";

export const wholesaleModule: ModuleData = {
  slug: "wholesale",
  title: "Wholesale",
  eyebrow: "Bulk operations",
  outcome: "Bulk orders that dispatch without a spreadsheet.",
  intro:
    "Wholesale is the same stock sold in a different shape: larger orders, staged fulfilment, and a buyer who has a running account rather than a single payment.",
  icon: Building2,
  theme: {
    accent: "#2d9d78",
    accentDark: "#216e56",
    accentSoft: "rgba(45, 157, 120, 0.12)",
  },

  hero: {
    eyebrow: "Wholesale",
    headline: "One order, billed and dispatched.",
    headlineAccent: "and dispatched.",
    body: "Hold what was ordered, fulfilled and still owed on one record.",
    primaryCta: { label: "Book a demo", href: "/contact" },
    secondaryCta: { label: "Explore all modules", href: "/modules" },
    visualVariant: "wholesale",
    chain: [
      { id: "order", label: "Order", detail: "Buyer · lines" },
      { id: "pick", label: "Fulfil", detail: "What is packed" },
      { id: "dispatch", label: "Dispatch", detail: "What has left" },
      { id: "credit", label: "Credit", detail: "What is still owed" },
    ],
    facts: [
      { label: "Sells from", value: "The same stock lines" },
      { label: "Tracks", value: "Fulfilment separately from billing" },
      { label: "Holds", value: "A running buyer position" },
    ],
  },

  problemSection: {
    eyebrow: "Before Wholesale",
    title: "Where a bulk order stops behaving like one order.",
    intro:
      "Three failures that appear the moment an order leaves the warehouse in more than one consignment.",
    problems: [
      {
        id: "part-shipment",
        number: "01",
        title: "Part-shipped orders lose their shape",
        description:
          "An order goes out in two or three consignments, but the system only understands whole orders. What is still owed to the buyer ends up being tracked in a side file that only one person maintains.",
        quote: "A pending list that lives in a spreadsheet on one laptop.",
        visual: "partial-shipment",
      },
      {
        id: "picking-blind",
        number: "02",
        title: "Picking works from a printout",
        description:
          "The warehouse packs from a printed order while stock keeps moving underneath it. By the time the carton is sealed, the availability it was picked against is out of date.",
        quote: "Two orders promised the same forty pieces.",
        visual: "stale-pick",
      },
      {
        id: "credit",
        number: "03",
        title: "Credit is an opinion",
        description:
          "Bulk buyers pay against a running account, but billing, returns and receipts sit in different places — so the exposure to a partner is assembled by hand before every conversation about it.",
        quote: "Nobody can say what a buyer owes without opening three files.",
        visual: "credit-scatter",
      },
    ],
    consequence: {
      title:
        "Volume is not the hard part. Holding one order together across three separate events is.",
      items: [
        {
          id: "pending",
          label: "Pending held in memory",
          body: "What is still due to a buyer survives in a side file that one person maintains.",
        },
        {
          id: "collide",
          label: "Promises that collide",
          body: "Two orders are committed against the same pieces because picking read a printout.",
        },
        {
          id: "exposure",
          label: "Exposure assembled by hand",
          body: "A buyer's balance is rebuilt from billing, returns and receipts before every conversation.",
        },
      ],
    },
  },

  outcomesSection: {
    eyebrow: "After Wholesale",
    title: "Three things change about",
    highlight: "how bulk orders move.",
    intro: "Orders, stock commitments and buyer positions stay on one record.",
    outcomes: [
      {
        id: "order-truth",
        number: "01",
        visualVariant: "order-fulfillment",
        accent: "#2d9d78",
        title: "An order that knows what is still outstanding",
        description: "Billing and fulfilment are tracked separately on the same order, so a partly dispatched order reads as partly dispatched rather than as done or not started.",
      },
      {
        id: "one-stock",
        number: "02",
        visualVariant: "shared-stock",
        accent: "#2d9d78",
        title: "One stock pool, not a wholesale copy of it",
        description: "Wholesale sells from the same stock lines the counter and the warehouse read, so a commitment made in bulk is visible everywhere else immediately.",
      },
      {
        id: "buyer-position",
        number: "03",
        visualVariant: "credit-context",
        accent: "#2d9d78",
        title: "A buyer position that is already assembled",
        description: "Bills, returns and receipts post against the same partner, so the amount outstanding is read off the record instead of being reconstructed.",
      },
    ],
  },

  capabilities: {
    groups: [
      {
        id: "selling",
        title: "Selling in bulk",
        context: "Raising and pricing an order that is larger than a counter sale.",
        items: [
          "Wholesale billing",
          "Partner / buyer records",
          "Rate and series pricing",
          "Multi-line orders",
        ],
      },
      {
        id: "fulfilment",
        title: "Fulfilment & dispatch",
        context:
          "The part that happens after the bill and before the goods arrive.",
        items: [
          "Fulfilment against an order",
          "Carton packing",
          "Dispatch records",
          "Pending fulfilment view",
        ],
      },
      {
        id: "credit",
        title: "Credit & settlement",
        context: "What the buyer owes, and what has actually been received.",
        items: [
          "Credit management",
          "Receipts against a partner",
          "Sales returns",
          "Outstanding position",
        ],
      },
    ],
  },

  workflow: {
    variant: "operational-flow",
    title: "From order to dispatch",
    intro:
      "Bulk selling is a sequence of partial states. These are the five, and what the record holds at each.",
    steps: [
      {
        id: "order",
        index: "01",
        title: "The order is raised",
        body: "A wholesale order is created against a buyer, with the lines, quantities and rates being committed to.",
        record: "Order · lines committed",
      },
      {
        id: "reserve",
        index: "02",
        title: "Stock is drawn against",
        body: "The order is picked from the same stock lines everything else reads, so the commitment is visible to the counter and the warehouse at once.",
        record: "Stock drawn from live lines",
      },
      {
        id: "pack",
        index: "03",
        title: "Goods are packed",
        body: "Fulfilment records what has actually been packed against the order, which may be less than the whole order.",
        record: "Fulfilled quantity · per line",
      },
      {
        id: "dispatch",
        index: "04",
        title: "The consignment leaves",
        body: "Dispatch marks the packed goods as gone and leaves the unfulfilled remainder still open on the order.",
        record: "Dispatched · remainder pending",
      },
      {
        id: "settle",
        index: "05",
        title: "The buyer position moves",
        body: "The billed value, any return and any receipt post against the buyer, so the outstanding amount reflects the goods that actually shipped.",
        record: "Partner position · updated",
      },
    ],
  },

  gallery: {
    variant: "stacked",
    title: "The screens this runs on",
    intro:
      "One real capture of the stock these orders are drawn from. The wholesale-specific screens have not been captured yet and are marked as such rather than mocked up.",
    shots: [
      {
        id: "stock-source",
        state: "captured",
        screen: "stock-list",
        featured: true,
        order: 1,
        context: "What fulfilment draws from",
        title: "The stock a bulk order is picked from",
        description:
          "Wholesale is not a separate stock pool. Orders are picked from the same lines shown here, with the warehouse column deciding which location a consignment can actually ship from.",
        alt: "Bizonix stock list showing available quantity and warehouse per line, the pool wholesale orders are picked from.",
        annotations: [
          {
            id: "qty",
            x: 29,
            y: 42,
            label: "QTY",
            detail: "The quantity a bulk order can be committed against.",
          },
          {
            id: "warehouse",
            x: 64,
            y: 22,
            label: "WAREHOUSE",
            detail: "Which location the consignment would ship from.",
          },
        ],
      },
      {
        id: "wholesale-bill",
        state: "pending",
        order: 2,
        context: "Order entry",
        title: "Wholesale billing",
        description:
          "A multi-line bulk order raised against a partner, at partner rates.",
      },
      {
        id: "fulfilment",
        state: "pending",
        order: 3,
        context: "In the warehouse",
        title: "Fulfilment & cartons",
        description:
          "What has been packed against an order, and what is still outstanding on it.",
      },
      {
        id: "dispatch",
        state: "pending",
        order: 4,
        context: "Leaving the building",
        title: "Dispatch",
        description: "The consignment record for goods that have left.",
      },
      {
        id: "credit",
        state: "pending",
        order: 5,
        context: "Accounts",
        title: "Partner credit position",
        description:
          "Bills, returns and receipts against one buyer on a running position.",
      },
    ],
  },

  verticalRelevance: {
    apparel:
      "Bulk orders arrive as size ratios rather than single quantities, so a part shipment has to be readable at the size that is short.",
    jewellery:
      "Assorted bulk lots are made of many small designs; fulfilment has to record which designs were actually packed, not just a carton count.",
    franchise:
      "The same fulfilment path serves partner outlets, which is why a franchise transfer and a wholesale dispatch behave like relatives rather than strangers.",
  },

  faq: [
    {
      id: "part",
      question: "Can an order be dispatched in parts?",
      answer:
        "Yes. Fulfilment is recorded against the order rather than replacing it, so a partly shipped order keeps its remainder open instead of being closed early or duplicated.",
    },
    {
      id: "stock-pool",
      question: "Does wholesale keep its own stock?",
      answer:
        "No. It sells from the same stock lines as the counter and the warehouse. That is the point — a bulk commitment is visible to everyone reading stock, immediately.",
    },
    {
      id: "pricing",
      question: "Can wholesale buyers have their own rates?",
      answer:
        "Rates are set on the order, and series pricing lets an intake carry its own rate, so partner pricing does not force a change to the master price of the style.",
    },
    {
      id: "credit",
      question: "How is buyer credit tracked?",
      answer:
        "Bills, sales returns and receipts post against the same partner record, so the outstanding position is read from the account rather than assembled before each conversation.",
    },
    {
      id: "returns",
      question: "What happens when a partner sends stock back?",
      answer:
        "A sales return posts against the order it came from and moves the stock back into the location that receives it, so both the goods and the amount owed move together.",
    },
  ],

  relatedModules: ["inventory", "franchise", "accounting"],

  seo: {
    title: "Wholesale module",
    description:
      "Bulk billing, fulfilment, dispatch and partner credit on one order record — drawn from the same stock the counter and warehouse read.",
    ogTitle: "Bizonix Wholesale — orders that survive partial dispatch",
    ogDescription:
      "Billing and fulfilment tracked separately on one order, with a running buyer position behind it.",
  },
};
