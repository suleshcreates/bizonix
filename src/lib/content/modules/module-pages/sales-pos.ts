import { ScanBarcode } from "lucide-react";
import type { ModuleData } from "./types";

export const salesPosModule: ModuleData = {
  slug: "sales-pos",
  title: "Sales & POS",
  eyebrow: "Counter operations",
  outcome: "Every bill posts itself to stock and to books.",
  intro:
    "Sales & POS is the counter: a scan, a payment, a bill. The value of the module is what happens behind that — the piece leaves stock and the sale reaches the books without anybody re-entering it.",
  icon: ScanBarcode,
  theme: {
    accent: "#ff6b6b",
    accentDark: "#c53d3d",
    accentSoft: "rgba(255, 107, 107, 0.1)",
  },

  hero: {
    eyebrow: "Sales & POS",
    headline: "Every sale closes the stock line.",
    headlineAccent: "the stock line.",
    body: "Billing, stock and the counter's shift all close together.",
    primaryCta: { label: "Book a demo", href: "/contact" },
    secondaryCta: { label: "Explore all modules", href: "/modules" },
    visualVariant: "pos",
    chain: [
      { id: "scan", label: "Scan", detail: "Piece identity" },
      { id: "bill", label: "Bill", detail: "Counter · payment" },
      { id: "fulfil", label: "Fulfil", detail: "Goods handed over" },
      { id: "close", label: "Close", detail: "Session totals" },
    ],
    screen: {
      id: "order-list",
      focus: "left top",
      alt: "Bizonix orders screen showing order totals above rows with customer, billing counter, payment state, amount and fulfilment.",
      annotations: [
        {
          id: "totals",
          x: 8,
          y: 5,
          side: "right",
          label: "Totals",
          detail: "The filtered set summed — the day as it currently stands.",
        },
        {
          id: "counter",
          x: 39,
          y: 30,
          side: "left",
          label: "Counter",
          detail: "Which billing counter raised the order, so a session can be closed.",
        },
        {
          id: "payment",
          x: 47,
          y: 62,
          side: "left",
          label: "Payment",
          detail: "Whether the counter actually took the money, held per order.",
        },
      ],
    },
    facts: [
      { label: "Raised at", value: "A named counter" },
      { label: "Carries", value: "Payment & fulfilment state" },
      { label: "Moves", value: "Stock and books together" },
    ],
  },

  problemSection: {
    presentation: "visual-stories",
    eyebrow: "Before Sales & POS",
    title: "Where counter days stop closing.",
    intro:
      "Three failures that put the day's work back on somebody's desk long after the customer has left.",
    problems: [
      {
        id: "double-entry",
        number: "01",
        title: "The sale is typed twice",
        description:
          "Counter sales are re-keyed into stock and accounts after the day.",
        quote: "Yesterday's sales get entered tomorrow, from a printout.",
        visual: "duplicate-entry",
      },
      {
        id: "session-blind",
        number: "02",
        title: "Nobody can close a counter",
        description:
          "Without shift boundaries, a cash difference has nowhere to belong.",
        quote: "The drawer is short and the day is the only suspect.",
        visual: "session-boundary",
      },
      {
        id: "returns",
        number: "03",
        title: "Returns break the record",
        description:
          "A returned piece no longer points to the bill that sold it.",
        quote: "Two records for one piece, and stock believes both.",
        visual: "return-orphan",
      },
    ],
    consequence: {
      title:
        "The counter is fast. Everything that happens behind the counter is not.",
      items: [
        {
          id: "late",
          label: "The day arrives late",
          body: "Stock and books describe yesterday, because yesterday is still being typed in.",
        },
        {
          id: "unbounded",
          label: "Shortfalls with no boundary",
          body: "Cash cannot be attributed to a counter, a shift or a person, so the difference is absorbed.",
        },
        {
          id: "twice",
          label: "Stock counted twice",
          body: "A returned piece re-enters as new quantity while the sale that released it still reads complete.",
        },
      ],
    },
  },

  outcomesSection: {
    eyebrow: "After Sales & POS",
    title: "Three things change about",
    highlight: "how the counter runs.",
    intro: "Billing, stock and books stay connected through the trading day.",
    outcomes: [
      {
        id: "posts-itself",
        number: "01",
        visualVariant: "payment-flow",
        accent: "#ff6b6b",
        title: "The bill posts itself",
        description: "Billing moves the piece out of the stock line it was held on and lands the sale value in the books. There is no end-of-day re-entry step to get wrong.",
      },
      {
        id: "counter-boundary",
        number: "02",
        visualVariant: "counter-session",
        accent: "#ff6b6b",
        title: "A counter you can actually close",
        description: "Every order carries the counter it was raised at and the state of its payment, so the day can be read one counter at a time instead of as a single blur.",
      },
      {
        id: "return-to-source",
        number: "03",
        visualVariant: "return-record",
        accent: "#ff6b6b",
        title: "A return that finds its bill",
        description: "Because the piece carries its own identity, a return posts against the sale that issued it — the stock goes back to a real line rather than becoming a new one.",
      },
    ],
  },

  capabilities: {
    groups: [
      {
        id: "counter",
        title: "At the counter",
        context: "What the person serving a customer actually touches.",
        items: [
          "Retail POS billing",
          "Barcode scanning",
          "Walk-in and named customers",
          "Multi-counter billing",
          "Item-level discounting",
        ],
      },
      {
        id: "money",
        title: "Payment & session",
        context:
          "The controls that let a shift be reconciled rather than estimated.",
        items: [
          "Billing sessions",
          "Payment status per order",
          "Cash handover",
          "Order totals by filter",
        ],
      },
      {
        id: "aftersale",
        title: "After the sale",
        context: "What happens once the customer has the goods — or brings them back.",
        items: [
          "Fulfilment state",
          "Sales returns",
          "Order lookup and reprint",
          "Order-level item history",
        ],
      },
    ],
  },

  workflow: {
    title: "A sale, end to end",
    intro:
      "Five steps at the counter, and the record the system is holding after each one.",
    steps: [
      {
        id: "open",
        index: "01",
        title: "The counter opens",
        body: "A billing session is started for the counter, so everything billed from here belongs to a shift that can be closed later.",
        record: "Session open at a named counter",
      },
      {
        id: "scan",
        index: "02",
        title: "The piece is scanned",
        body: "The barcode issued at receiving is read at the counter. Price, tax treatment and the stock line it belongs to come with it.",
        record: "Line added against a real piece",
      },
      {
        id: "pay",
        index: "03",
        title: "Payment is taken",
        body: "The order records what was paid against what was owed, and the payment state moves with it.",
        record: "Order · paid / total",
      },
      {
        id: "fulfil",
        index: "04",
        title: "Goods are handed over",
        body: "Fulfilment marks the pieces as gone. The stock line they were held on drops by exactly those pieces.",
        record: "Order fulfilled · stock reduced",
      },
      {
        id: "close",
        index: "05",
        title: "The session is closed",
        body: "The counter is handed over against its own totals, and the day's sales are already sitting in the books.",
        record: "Session closed · books posted",
      },
    ],
  },

  gallery: {
    variant: "featured-plus-grid",
    title: "The screens this runs on",
    intro:
      "Real captures from the product. Annotations point only at fields that are visible in the frame.",
    shots: [
      {
        id: "order-list",
        state: "captured",
        screen: "order-list",
        featured: true,
        order: 1,
        context: "Daily view",
        title: "Orders",
        description:
          "The day's orders with customer, billing counter, payment state, paid and total value, item count and fulfilment state — totalled across whatever filter is applied.",
        alt: "Bizonix orders screen with a totals bar above rows showing customer, counter, payment, paid, total, items and fulfilment.",
        annotations: [
          {
            id: "counter",
            x: 39,
            y: 9,
            label: "COUNTER",
            detail: "The billing counter the order was raised at.",
          },
          {
            id: "payment",
            x: 48,
            y: 9,
            label: "PAYMENT",
            detail: "Whether the money against this order actually landed.",
          },
          {
            id: "fulfilment",
            x: 82,
            y: 9,
            label: "FULFILMENT",
            detail: "Whether the goods have left the counter.",
          },
          {
            id: "totals",
            x: 60,
            y: 5,
            label: "Totals bar",
            detail: "Paid, total and item count for the current filter.",
          },
        ],
      },
      {
        id: "scan-identity",
        state: "captured",
        screen: "barcode-queue",
        order: 2,
        context: "What the counter scans",
        title: "The identity behind the scan",
        description:
          "The barcodes the counter reads are the ones issued at intake — each one already tied to a design, an in-stock count, an MRP and a selling price.",
        alt: "Bizonix barcode screen listing new barcodes with in-stock counts, design names, MRP and selling price.",
        annotations: [
          {
            id: "sell",
            x: 73,
            y: 15,
            label: "MRP / Sell",
            detail: "The price the counter reads, held against the barcode.",
          },
        ],
      },
      {
        id: "pos-counter",
        state: "pending",
        order: 3,
        context: "At the counter",
        title: "POS billing screen",
        description:
          "The live counter view: scan, cart, discount and payment in one pass.",
      },
      {
        id: "session",
        state: "pending",
        order: 4,
        context: "Shift control",
        title: "Billing session & handover",
        description:
          "Opening, closing and handing over a counter against its own totals.",
      },
      {
        id: "sales-return",
        state: "pending",
        order: 5,
        context: "Exceptions",
        title: "Sales return",
        description: "A piece coming back, posted against the bill that sold it.",
      },
    ],
  },

  verticalRelevance: {
    apparel:
      "Exchanges are the normal case, not the exception; a size swap posts against the original bill instead of becoming an unexplained pair of movements.",
    jewellery:
      "Small, high-value, visually similar pieces make scanning the only reliable way to know which one actually left the counter.",
    franchise:
      "An outlet bills on its own counters while head office reads the same order records, without the outlet having to send a day sheet.",
  },

  faq: [
    {
      id: "offline",
      question: "What is a billing session for?",
      answer:
        "It gives the day a boundary. Bills belong to a session at a named counter, so cash can be handed over against what that counter actually took rather than against a whole-day estimate.",
    },
    {
      id: "walk-in",
      question: "Do we have to capture customer details for every sale?",
      answer:
        "No. Orders can be raised as walk-in, and a name is attached only when it is useful — both appear on the same order list.",
    },
    {
      id: "stock",
      question: "When does stock actually reduce?",
      answer:
        "At fulfilment, when the goods are handed over. The order carries its fulfilment state, so a billed-but-not-yet-collected order does not silently disappear from stock.",
    },
    {
      id: "returns",
      question: "How is a return connected to the original sale?",
      answer:
        "Through the piece. The barcode scanned on the way out is the same one scanned on the way back, which is what lets the return post against the order it came from.",
    },
    {
      id: "multi-counter",
      question: "Can more than one counter bill at the same time?",
      answer:
        "Yes. Each order records the counter it was raised at, which is what makes per-counter totals and separate handovers possible.",
    },
  ],

  relatedModules: ["inventory", "accounting", "ecommerce"],

  seo: {
    title: "Sales & POS module",
    description:
      "Retail counter billing with barcode scanning, billing sessions, cash handover and returns — every bill moving stock and books in the same pass.",
    ogTitle: "Bizonix Sales & POS — a bill that posts itself",
    ogDescription:
      "Scan, bill, fulfil and close a counter against its own session, with stock and accounts already updated.",
  },
};
