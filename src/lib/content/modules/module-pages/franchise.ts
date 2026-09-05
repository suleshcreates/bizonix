import { Store } from "lucide-react";
import type { ModuleData } from "./types";

export const franchiseModule: ModuleData = {
  slug: "franchise",
  title: "Franchise",
  eyebrow: "Network operations",
  outcome: "Autonomy at the outlet, oversight at the centre.",
  intro:
    "Franchise is about two things being true at once: a partner runs their own outlet, and the brand can still see the network. The module exists to keep both without either one having to ask permission.",
  icon: Store,
  theme: {
    accent: "#2f6bff",
    accentDark: "#1748c7",
    accentSoft: "rgba(47, 107, 255, 0.1)",
  },

  hero: {
    eyebrow: "Franchise",
    headline: "One network. Every outlet visible.",
    headlineAccent: "outlet visible.",
    body: "Give partners independence while head office reads one position.",
    primaryCta: { label: "Book a demo", href: "/contact" },
    secondaryCta: { label: "Explore all modules", href: "/modules" },
    visualVariant: "network",
    chain: [
      { id: "hq", label: "HQ", detail: "Shared masters" },
      { id: "entity", label: "Entity", detail: "Outlet boundary" },
      { id: "transfer", label: "Transfer", detail: "Out · awaiting receipt" },
      { id: "view", label: "Oversight", detail: "Network position" },
    ],
    facts: [
      { label: "Separated by", value: "Entity boundary" },
      { label: "Shared", value: "Masters and identity" },
      { label: "Moved by", value: "Recorded transfers" },
    ],
  },

  problemSection: {
    eyebrow: "Before Franchise",
    title: "What head office cannot see across its own network.",
    intro:
      "Three failures that reduce a network of outlets to a summary assembled at the end of the month.",
    problems: [
      {
        id: "off-system",
        number: "01",
        title: "Outlets operate off-system",
        description:
          "A partner bills on whatever they already have, and the brand receives a summary at the end of the month. What sold, at what price, and what is still on the shelf are all reconstructions.",
        quote: "The network's stock position is a WhatsApp thread.",
        visual: "off-system-outlet",
      },
      {
        id: "transfer-limbo",
        number: "02",
        title: "Transfers sit in limbo",
        description:
          "Goods leave the warehouse and arrive at the outlet, but the two events are recorded — if at all — in separate places. Between dispatch and receipt the stock belongs to nobody.",
        quote: "Sent 48. Received 44. No document holds both numbers.",
        visual: "transfer-limbo",
      },
      {
        id: "boundary",
        number: "03",
        title: "Visibility and control get confused",
        description:
          "Giving head office a view usually means giving it the ability to act inside the outlet, so brands either over-share access or under-share information. Neither is what anyone wanted.",
        quote: "Either everyone is an admin, or nobody can see anything.",
        visual: "access-overreach",
      },
    ],
    consequence: {
      title: "The brand is distributed. The record of the brand is not.",
      items: [
        {
          id: "monthly",
          label: "A network described monthly",
          body: "What sold, at what price, and what is still on a shelf all arrive after the fact.",
        },
        {
          id: "orphan",
          label: "Stock that belongs to nobody",
          body: "Between dispatch and receipt the goods sit outside every location's record.",
        },
        {
          id: "switch",
          label: "Access as a blunt switch",
          body: "Visibility can only be bought with control, so brands over-share rights or under-see the network.",
        },
      ],
    },
  },

  outcomesSection: {
    eyebrow: "After Franchise",
    title: "Three things change about",
    highlight: "how the network runs.",
    intro: "Independent outlets. Connected movements. A shared operating view.",
    outcomes: [
      {
        id: "entity-real",
        number: "01",
        visualVariant: "outlet-control",
        accent: "#2f6bff",
        title: "The outlet is a real boundary, not a filter",
        description: "Each franchise operates as its own entity with its own stock and counters, so partner autonomy is a structural fact rather than a permission that can be forgotten.",
      },
      {
        id: "transfer-record",
        number: "02",
        visualVariant: "entity-transfer",
        accent: "#2f6bff",
        title: "A transfer that has two ends",
        description: "Stock leaves the source and is awaiting receipt at the destination. Both sides of the movement exist on the same record, which is what makes a short receipt a question instead of a loss.",
      },
      {
        id: "read-not-ask",
        number: "03",
        visualVariant: "hq-allocation",
        accent: "#2f6bff",
        title: "Oversight without micromanagement",
        description: "The centre reads outlet positions from the same operating records the outlet is creating, so seeing the network does not require reaching into it.",
      },
    ],
  },

  capabilities: {
    groups: [
      {
        id: "network",
        title: "Network structure",
        context: "How the brand and its outlets are actually modelled.",
        items: [
          "Franchise list",
          "Entity boundaries",
          "Shared product masters",
          "Outlet-scoped users",
        ],
      },
      {
        id: "supply",
        title: "Supplying the outlet",
        context: "Moving goods to a partner and knowing that they arrived.",
        items: [
          "Stock transfer to outlet",
          "Dispatch and receipt states",
          "Piece identity across entities",
          "Transfer history",
        ],
      },
      {
        id: "oversight",
        title: "Oversight & commercials",
        context:
          "What head office reads, and how the relationship itself is administered.",
        items: [
          "Franchise dashboard",
          "Outlet-wise stock position",
          "Subscriptions and plans",
          "Consolidated network view",
        ],
      },
    ],
  },

  workflow: {
    variant: "entity-lanes",
    title: "How the network operates",
    intro:
      "Two entities, one movement. The lane shows which side of the network is holding the record at each step.",
    steps: [
      {
        id: "onboard",
        index: "01",
        lane: "Head office",
        title: "The outlet is set up as an entity",
        body: "A franchise is created with its own scope, its own users and access to the shared product masters.",
        record: "Entity created · masters shared",
      },
      {
        id: "dispatch",
        index: "02",
        lane: "Head office",
        title: "Stock is transferred out",
        body: "Pieces are dispatched from the central location to the outlet, carrying the identity they were issued at receiving.",
        record: "Out at source · awaiting receipt",
      },
      {
        id: "receive",
        index: "03",
        lane: "Outlet",
        title: "The outlet receives",
        body: "The partner receipts the transfer. Any difference between what was sent and what arrived stays on the same record.",
        record: "Received · variance visible",
      },
      {
        id: "sell",
        index: "04",
        lane: "Outlet",
        title: "The outlet sells",
        body: "The partner bills on their own counters, against their own stock, as an independent operation.",
        record: "Outlet orders · outlet stock",
      },
      {
        id: "consolidate",
        index: "05",
        lane: "Head office",
        title: "The centre reads the network",
        body: "Head office sees each outlet's position from the records the outlet created, without operating inside it.",
        record: "Network position · read only",
      },
    ],
  },

  gallery: {
    variant: "stacked",
    title: "The screens this runs on",
    intro:
      "One real capture showing how stock is held against a location. The franchise-specific screens have not been captured yet and are marked as such rather than mocked up.",
    shots: [
      {
        id: "location-entries",
        state: "captured",
        screen: "series-ledger",
        featured: true,
        order: 1,
        context: "How location is held",
        title: "Stock entries carry their location",
        description:
          "Every stock entry names the location holding it. That column is what lets a network be read outlet by outlet instead of as one merged number.",
        alt: "Bizonix series entry ledger with a location column naming the store that holds each entry.",
        annotations: [
          {
            id: "location",
            x: 24,
            y: 5,
            label: "LOCATION",
            detail: "The outlet or warehouse the entry belongs to.",
          },
          {
            id: "instock",
            x: 51,
            y: 5,
            label: "IN STOCK",
            detail: "What remains at that location, per entry.",
          },
        ],
      },
      {
        id: "franchise-list",
        state: "pending",
        order: 2,
        context: "Network",
        title: "Franchise list",
        description: "Every outlet in the network with its operating scope.",
      },
      {
        id: "transfer",
        state: "pending",
        order: 3,
        context: "Supply",
        title: "Stock transfer to an outlet",
        description:
          "Dispatch and receipt across an entity boundary, on one record.",
      },
      {
        id: "outlet-dashboard",
        state: "pending",
        order: 4,
        context: "Oversight",
        title: "Franchise dashboard",
        description: "Outlet-wise position as head office reads it.",
      },
      {
        id: "plans",
        state: "pending",
        order: 5,
        context: "Commercials",
        title: "Subscriptions & plans",
        description: "The commercial arrangement attached to each partner.",
      },
    ],
  },

  verticalRelevance: {
    apparel:
      "Allocation to outlets is a size-and-colour decision, so a transfer has to be readable at the variant an outlet is actually short of.",
    jewellery:
      "Partner outlets carry deep assortments of similar designs, which is exactly where a shared piece identity stops a transfer from becoming an argument.",
    franchise:
      "This is the module the model is built around — entity separation, recorded transfers and a network view that does not require asking each partner for numbers.",
  },

  faq: [
    {
      id: "autonomy",
      question: "Does head office control the outlet's day-to-day?",
      answer:
        "No. The outlet operates as its own entity — its own stock, its own counters and its own users. The centre reads the network position; it does not have to bill on the partner's behalf to see it.",
    },
    {
      id: "transfer",
      question: "What happens between dispatch and receipt?",
      answer:
        "The stock is out at the source and awaiting receipt at the destination. Both states sit on the same transfer, so goods in transit are never unaccounted for.",
    },
    {
      id: "masters",
      question: "Do outlets have to maintain their own product data?",
      answer:
        "Product masters are shared, so a style means the same thing everywhere in the network. Stock, orders and counters remain the outlet's own.",
    },
    {
      id: "short-receipt",
      question: "What if an outlet receives less than was sent?",
      answer:
        "The difference stays visible on the transfer rather than being absorbed. The conversation then starts from a document instead of from two conflicting counts.",
    },
    {
      id: "access",
      question: "How is partner access restricted?",
      answer:
        "Through entity scope in the Security module — a user is attached to the entity they work in, which is what keeps one outlet from reading another.",
    },
  ],

  relatedModules: ["inventory", "security", "analytics"],

  seo: {
    title: "Franchise module",
    description:
      "Run a franchise network as separate operating entities with shared masters, recorded stock transfers between centre and outlet, and network-level oversight.",
    ogTitle: "Bizonix Franchise — autonomy at the outlet, oversight at the centre",
    ogDescription:
      "Outlets operate as their own entities while head office reads the whole network from the same operating records.",
  },
};
