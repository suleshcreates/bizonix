import { Truck } from "lucide-react";
import type { ModuleData } from "./types";

export const procurementModule: ModuleData = {
  slug: "procurement",
  title: "Procurement",
  eyebrow: "Buying & receiving",
  outcome: "Receiving, pricing and payables on one trail.",
  intro:
    "Procurement covers what the business buys and what actually turned up. The purchase, the receipt and the supplier's position stay on the same document trail instead of being reconciled later.",
  icon: Truck,
  theme: {
    accent: "#ff9f43",
    accentDark: "#c66a00",
    accentSoft: "rgba(255, 159, 67, 0.12)",
  },

  hero: {
    eyebrow: "Procurement",
    headline: "What you order is what arrives.",
    headlineAccent: "what arrives.",
    body: "Keep the order, the receipt and the shortfall on one document.",
    primaryCta: { label: "Book a demo", href: "/contact" },
    secondaryCta: { label: "Explore all modules", href: "/modules" },
    visualVariant: "procurement",
    chain: [
      { id: "purchase", label: "Purchase", detail: "Supplier · quantity" },
      { id: "receive", label: "Receive", detail: "What actually arrived" },
      { id: "stock", label: "Stock", detail: "Entry opened" },
      { id: "payable", label: "Payable", detail: "Supplier position" },
    ],
    screen: {
      id: "purchase-list",
      focus: "left top",
      alt: "Bizonix purchases screen filtered by received, draft and cancelled, showing supplier, quantity, amount and status per purchase.",
      annotations: [
        {
          id: "received",
          x: 24,
          y: 5,
          side: "right",
          label: "Received",
          detail: "Separates what has physically arrived from what is still on order.",
        },
        {
          id: "purchase-no",
          x: 11,
          y: 32,
          side: "right",
          label: "Purchase no",
          detail: "One number the document keeps from draft through to received.",
        },
        {
          id: "supplier",
          x: 34,
          y: 62,
          side: "right",
          label: "Supplier",
          detail: "The party the payable belongs to, carried on the same record.",
        },
      ],
    },
    facts: [
      { label: "States", value: "Draft · received · cancelled" },
      { label: "Carries", value: "Supplier, invoice, cost" },
      { label: "Opens", value: "Stock at the location" },
    ],
  },

  problemSection: {
    eyebrow: "Before Procurement",
    title: "Where a purchase quietly loses its thread.",
    intro:
      "Three breaks between agreeing an order, receiving what actually turned up, and knowing what a supplier is owed.",
    problems: [
      {
        id: "receipt-drift",
        number: "01",
        title: "The order and the receipt drift apart",
        description:
          "The purchase is agreed in one place and what physically arrives is recorded in another. By the time the difference is noticed, the goods are already on the shelf and the short quantity has no document to attach itself to.",
        quote: "Ordered 120, received 108, and the file still reads 120.",
        visual: "order-receipt-drift",
      },
      {
        id: "cost-lost",
        number: "02",
        title: "Landed cost stops travelling with the goods",
        description:
          "Purchase rate is captured for the invoice and then abandoned, so once the stock is put away the business can only see what it sells for — never what this particular intake cost it.",
        quote: "Margin is a guess because cost is an average of everything.",
        visual: "cost-detached",
      },
      {
        id: "supplier-blind",
        number: "03",
        title: "The supplier position lives outside the system",
        description:
          "Purchases, returns and payments are kept in three places, so the amount actually owed to a supplier is assembled by hand every time somebody asks for it.",
        quote: "A payment run starts with a phone call to the supplier.",
        visual: "supplier-scatter",
      },
    ],
    consequence: {
      title:
        "The order itself is rarely the problem. Everything downstream of it is rebuilt by hand.",
      items: [
        {
          id: "absorbed",
          label: "Short receipts absorbed",
          body: "A shortfall reaches the shelf before anyone notices, and no document is left holding the difference.",
        },
        {
          id: "margin",
          label: "Margin as an estimate",
          body: "Selling price is exact and cost is an average, so profitability is stated with more confidence than it has.",
        },
        {
          id: "payment",
          label: "Payment runs by phone",
          body: "What is owed to a supplier is reassembled from three places every time somebody asks.",
        },
      ],
    },
  },

  outcomesSection: {
    eyebrow: "After Procurement",
    title: "Three things change about",
    highlight: "how purchasing connects.",
    intro: "From purchase to receipt, with costs and supplier context intact.",
    outcomes: [
      {
        id: "one-document",
        number: "01",
        visualVariant: "purchase-receiving",
        accent: "#ff9f43",
        title: "One document from order to receipt",
        description: "A purchase moves through draft, received and cancelled states on the same record, so the quantity and the amount always describe the same transaction rather than two versions of it.",
      },
      {
        id: "cost-survives",
        number: "02",
        visualVariant: "supplier-context",
        accent: "#ff9f43",
        title: "Cost survives the put-away",
        description: "Purchase rate and cost stay attached to the stock the receipt opened, which is why the stock list can show cost and value alongside sale rate and MRP.",
      },
      {
        id: "supplier-position",
        number: "03",
        visualVariant: "return-continuity",
        accent: "#ff9f43",
        title: "A supplier position that is already assembled",
        description: "Purchases, purchase returns and payments post against the same supplier, so what is owed is read rather than reconstructed.",
      },
    ],
  },

  capabilities: {
    groups: [
      {
        id: "buying",
        title: "Buying",
        context: "Raising and tracking what has been committed to a supplier.",
        items: [
          "Direct purchases",
          "Draft purchases",
          "Supplier invoice reference",
          "Purchase cancellation",
          "Supplier-wise filtering",
        ],
      },
      {
        id: "receiving",
        title: "Receiving",
        context:
          "The step that turns a commitment into stock, and issues identity while doing it.",
        items: [
          "Goods receipt against a purchase",
          "Received / pending states",
          "Stock entry creation",
          "Barcode issue at intake",
          "Purchase returns",
        ],
      },
      {
        id: "payables",
        title: "Cost & payables",
        context:
          "What the intake cost and what is still owed for it, held against the same trail.",
        items: [
          "Purchase rate and cost capture",
          "Series pricing",
          "Supplier ledger",
          "Purchase value reporting",
        ],
      },
    ],
  },

  workflow: {
    variant: "operational-flow",
    title: "From commitment to shelf",
    intro:
      "Procurement is a hand-off problem. These are the five hand-offs, and what the system is holding after each one.",
    steps: [
      {
        id: "raise",
        index: "01",
        title: "The purchase is raised",
        body: "A purchase is created against a supplier with the lines, quantities and rates being committed to. It sits in draft until it is acted on.",
        record: "Purchase · draft",
      },
      {
        id: "receive",
        index: "02",
        title: "Goods are received",
        body: "What physically arrived is receipted against that purchase. The purchase moves to received and the supplier's invoice reference is captured with it.",
        record: "Purchase · received",
      },
      {
        id: "open",
        index: "03",
        title: "Stock is opened",
        body: "The receipt opens a stock entry at the receiving location, carrying purchase rate, MRP and tax attributes across with it.",
        record: "Stock entry · opened quantity",
      },
      {
        id: "label",
        index: "04",
        title: "Identity is printed",
        body: "Barcodes are issued for the received pieces and labels are printed before the goods are put away.",
        record: "Barcodes issued",
      },
      {
        id: "settle",
        index: "05",
        title: "The supplier position updates",
        body: "The received value and any purchase return post against the supplier, so payables reflect the goods that were actually accepted.",
        record: "Supplier ledger · updated",
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
        id: "purchase-list",
        state: "captured",
        screen: "purchase-list",
        featured: true,
        order: 1,
        context: "Daily view",
        title: "Purchases",
        description:
          "Every purchase with its supplier, date, invoice reference, quantity, amount and state — filtered to all, received, draft or cancelled.",
        alt: "Bizonix purchases screen showing received, draft and cancelled filters over purchase number, supplier, quantity, amount and status columns.",
        annotations: [
          {
            id: "states",
            x: 24,
            y: 5,
            label: "Received / Draft / Cancelled",
            detail: "The states a purchase moves through, with counts.",
          },
          {
            id: "invoice",
            x: 50,
            y: 13,
            label: "INVOICE",
            detail: "The supplier's own reference held on the purchase.",
          },
          {
            id: "status",
            x: 82,
            y: 19,
            label: "STATUS",
            detail: "Whether the goods have actually been received.",
          },
        ],
      },
      {
        id: "stock-after-receipt",
        state: "captured",
        screen: "stock-list",
        order: 2,
        context: "After receiving",
        title: "What receiving opened",
        description:
          "The stock list a receipt writes into — the same line now carrying purchase rate, cost, MRC reference and the warehouse holding it.",
        alt: "Bizonix stock list showing cost, MRC number and warehouse columns for lines opened by receiving.",
        annotations: [
          {
            id: "mrc",
            x: 56,
            y: 22,
            label: "MRC NO",
            detail: "The intake reference the line was opened against.",
          },
          {
            id: "rates",
            x: 40,
            y: 22,
            label: "SRATE / MRP / COST",
            detail: "Sale rate, MRP and cost held on the same line.",
          },
        ],
      },
      {
        id: "grn-detail",
        state: "pending",
        order: 3,
        context: "At the dock",
        title: "Goods receipt",
        description:
          "Line-by-line receipt against a purchase, including short and excess quantities.",
      },
      {
        id: "supplier-ledger",
        state: "pending",
        order: 4,
        context: "Payables",
        title: "Supplier ledger",
        description:
          "Purchases, returns and payments against one supplier on a single running position.",
      },
      {
        id: "purchase-return",
        state: "pending",
        order: 5,
        context: "Exceptions",
        title: "Purchase return",
        description:
          "Goods sent back to a supplier, posted against the purchase they arrived on.",
      },
    ],
  },

  verticalRelevance: {
    apparel:
      "Season intakes arrive as many small consignments; each one stays separable, so a slow-moving colour can be traced back to the buy that brought it in.",
    jewellery:
      "Designs repeat across suppliers, so holding the intake reference on the line is what keeps two visually identical items from merging into one cost.",
    franchise:
      "Central buying keeps the cost on the record that is later transferred out, so an outlet is not receiving stock with an unexplained value.",
  },

  faq: [
    {
      id: "grn",
      question: "Can we receive less than we ordered?",
      answer:
        "Yes. Receiving is recorded against the purchase, so the received quantity can differ from the ordered quantity and the difference stays visible on the purchase rather than being edited away.",
    },
    {
      id: "cost",
      question: "Which cost does the stock carry?",
      answer:
        "The cost captured on the intake that opened the line. That is why the stock list can show purchase rate and cost next to sale rate and MRP for the same row.",
    },
    {
      id: "returns",
      question: "How are supplier returns handled?",
      answer:
        "As purchase returns posted against the supplier and the stock they came from, so both the stock position and the amount owed move together.",
    },
    {
      id: "series-pricing",
      question: "What is series pricing used for here?",
      answer:
        "It lets an intake carry its own rate rather than inheriting a single price for the style, so two consignments bought at different rates stay priced as they were bought.",
    },
    {
      id: "opening-stock",
      question: "How does opening stock come in?",
      answer:
        "Through the same purchase and receiving path, recorded as a system opening entry. The stock arrives with a reference attached instead of appearing as an unexplained quantity.",
    },
  ],

  relatedModules: ["inventory", "accounting", "wholesale"],

  seo: {
    title: "Procurement module",
    description:
      "Purchases, goods receipt, purchase returns and supplier position on one trail — with intake cost and series pricing carried through to stock.",
    ogTitle: "Bizonix Procurement — order, receipt and payables on one trail",
    ogDescription:
      "A purchase that moves through draft, received and cancelled while opening stock and updating the supplier position.",
  },
};
