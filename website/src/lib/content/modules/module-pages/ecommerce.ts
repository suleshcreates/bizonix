import { ShoppingBag } from "lucide-react";
import type { ModuleData } from "./types";

export const ecommerceModule: ModuleData = {
  slug: "ecommerce",
  title: "Ecommerce",
  eyebrow: "Online storefront",
  outcome: "One catalogue, one stock number, everywhere.",
  intro:
    "Ecommerce puts the same catalogue and the same stock online that the counter and the warehouse are already working from — so an online order is another order, not an import.",
  icon: ShoppingBag,
  theme: {
    accent: "#ec4899",
    accentDark: "#b42e72",
    accentSoft: "rgba(236, 72, 153, 0.1)",
  },

  hero: {
    eyebrow: "Ecommerce",
    headline: "Sell the stock you actually have.",
    headlineAccent: "actually have.",
    body: "Catalogue, orders and availability run on the warehouse's own stock.",
    primaryCta: { label: "Book a demo", href: "/contact" },
    secondaryCta: { label: "Explore all modules", href: "/modules" },
    visualVariant: "commerce",
    chain: [
      { id: "catalog", label: "Catalogue", detail: "Shared masters" },
      { id: "storefront", label: "Storefront", detail: "What shoppers see" },
      { id: "order", label: "Order", detail: "Same order flow" },
      { id: "stock", label: "Stock", detail: "Same lines" },
    ],
    facts: [
      { label: "Publishes", value: "The existing catalogue" },
      { label: "Sells against", value: "The same stock lines" },
      { label: "Lands in", value: "The order list" },
    ],
  },

  problemSection: {
    presentation: "visual-stories",
    eyebrow: "Before Ecommerce",
    title: "Where online stock drifts apart.",
    intro:
      "Three failures that make an online channel a second business to run rather than a second counter.",
    problems: [
      {
        id: "two-catalogues",
        number: "01",
        title: "The catalogue exists twice",
        description:
          "Shop and website catalogues drift whenever one copy changes.",
        quote: "The site is still selling last season's price.",
        visual: "duplicate-catalogue",
      },
      {
        id: "oversell",
        number: "02",
        title: "Online stock is a copy that goes stale",
        description:
          "Scheduled stock copies oversell pieces already sold at the counter.",
        quote: "An order is confirmed for a piece that sold an hour ago.",
        visual: "stale-availability",
      },
      {
        id: "order-import",
        number: "03",
        title: "Online orders arrive as an import job",
        description:
          "Web orders are re-entered before fulfilment and accounting.",
        quote: "Web orders are processed in a batch, once a day.",
        visual: "batched-orders",
      },
    ],
    consequence: {
      title:
        "The website works perfectly. It is simply describing a shop that has already moved on.",
      items: [
        {
          id: "twice",
          label: "Two versions of one product",
          body: "A price or a design is maintained in two places, and is inevitably changed in one.",
        },
        {
          id: "gone",
          label: "Confidence in stock that is gone",
          body: "Between two syncs the storefront sells what the counter has already sold.",
        },
        {
          id: "backlog",
          label: "A channel with its own backlog",
          body: "Web orders wait for an import before they can be fulfilled or accounted for.",
        },
      ],
    },
  },

  outcomesSection: {
    eyebrow: "After Ecommerce",
    title: "Three things change about",
    highlight: "how channels connect.",
    intro: "One catalogue, one stock position and a connected order flow.",
    outcomes: [
      {
        id: "one-catalogue",
        number: "01",
        visualVariant: "catalog-order",
        accent: "#ec4899",
        title: "One catalogue, maintained once",
        description: "The storefront publishes the product masters the rest of the business already uses, so a change is made in one place and is true everywhere.",
      },
      {
        id: "one-number",
        number: "02",
        visualVariant: "inventory-connection",
        accent: "#ec4899",
        title: "One stock number, not a synced copy",
        description: "Online availability is read from the same stock lines the counter sells from, which removes the window in which the two disagree.",
      },
      {
        id: "one-order-flow",
        number: "03",
        visualVariant: "storefront-sync",
        accent: "#ec4899",
        title: "One order flow for every channel",
        description: "An online order is fulfilled and accounted for the same way a counter order is, so the channel does not need its own process behind it.",
      },
    ],
  },

  capabilities: {
    groups: [
      {
        id: "catalogue",
        title: "Catalogue",
        context: "What is published, and where the product information comes from.",
        items: [
          "Catalog sync from product masters",
          "Product content and media",
          "Pricing and MRP display",
          "Stock availability",
        ],
      },
      {
        id: "storefront",
        title: "Storefront & content",
        context: "The customer-facing surface and the pages around it.",
        items: ["Storefront", "CMS pages", "Category and collection structure"],
      },
      {
        id: "orders",
        title: "Orders",
        context: "What happens after a shopper checks out.",
        items: [
          "Online orders in the same order list",
          "Payment status",
          "Fulfilment state",
          "Returns",
        ],
      },
    ],
    limitations: [
      "A public API is not yet available — the site states it as coming soon. Integrations that would depend on one should be scoped during implementation rather than assumed.",
    ],
  },

  workflow: {
    title: "From catalogue to delivered order",
    intro:
      "The online channel reuses the operating path the rest of the business is already on.",
    steps: [
      {
        id: "publish",
        index: "01",
        title: "The catalogue is published",
        body: "Products already held as masters are made available on the storefront, with their content and pricing.",
        record: "Catalogue · live",
      },
      {
        id: "availability",
        index: "02",
        title: "Availability is read, not copied",
        body: "What the storefront can sell is drawn from the same stock lines the counter and the warehouse read.",
        record: "Availability · from live stock",
      },
      {
        id: "order",
        index: "03",
        title: "An order is placed",
        body: "Checkout creates an order in the same order list as every other channel, with its payment state attached.",
        record: "Order · payment state",
      },
      {
        id: "fulfil",
        index: "04",
        title: "The order is fulfilled",
        body: "Goods are picked and dispatched, and the stock line they came from moves at that point.",
        record: "Fulfilled · stock reduced",
      },
      {
        id: "account",
        index: "05",
        title: "The sale reaches the books",
        body: "The order posts like any other sale, so the online channel does not need its own reconciliation.",
        record: "Posted to books",
      },
    ],
  },

  gallery: {
    variant: "stacked",
    title: "The screens this runs on",
    intro:
      "The ecommerce screens have not been captured for the website yet. They are listed here as the actual set rather than represented by a mock-up.",
    shots: [
      {
        id: "catalog",
        state: "pending",
        featured: true,
        order: 1,
        context: "Publishing",
        title: "Catalog sync",
        description:
          "Which products are published to the storefront, and with what content.",
      },
      {
        id: "storefront",
        state: "pending",
        order: 2,
        context: "Customer-facing",
        title: "Storefront",
        description: "The shopping surface built on the same catalogue.",
      },
      {
        id: "cms",
        state: "pending",
        order: 3,
        context: "Content",
        title: "CMS pages",
        description: "Editorial and category pages around the catalogue.",
      },
      {
        id: "online-orders",
        state: "pending",
        order: 4,
        context: "Fulfilment",
        title: "Online orders",
        description: "Web orders inside the same order list as every channel.",
      },
    ],
  },

  verticalRelevance: {
    apparel:
      "Size and colour are separate sellable pieces, so an online listing can go out of stock in one variant without pulling the whole style down.",
    jewellery:
      "Deep catalogues of similar designs need product content and identity that stay attached to the specific design being sold.",
    franchise:
      "One brand storefront can be operated centrally while outlets keep their own counters and stock underneath it.",
  },

  faq: [
    {
      id: "sync",
      question: "How often does stock sync to the storefront?",
      answer:
        "The storefront reads the same stock the rest of the system uses rather than maintaining a copy on a schedule. That is what closes the window in which online and in-store availability disagree.",
    },
    {
      id: "orders",
      question: "Where do online orders arrive?",
      answer:
        "In the same order list as counter and wholesale orders, carrying their own payment and fulfilment state, so there is no separate import step.",
    },
    {
      id: "content",
      question: "Can we manage content as well as products?",
      answer:
        "Yes — CMS pages sit alongside the catalogue so category, collection and editorial pages are maintained in the same place as the products they point at.",
    },
    {
      id: "api",
      question: "Can we connect our own storefront or marketplace?",
      answer:
        "A public API is listed as coming soon, so any external connection should be scoped during implementation rather than assumed to be available today.",
    },
    {
      id: "returns",
      question: "How are online returns handled?",
      answer:
        "As sales returns against the order that shipped, moving the stock back into the location that receives it — the same path an in-store return follows.",
    },
  ],

  relatedModules: ["inventory", "sales-pos", "analytics"],

  seo: {
    title: "Ecommerce module",
    description:
      "Catalog, CMS, storefront and online orders connected to the same product masters and stock lines the counter and warehouse already use.",
    ogTitle: "Bizonix Ecommerce — one catalogue, one stock number",
    ogDescription:
      "A storefront that sells from live stock, with online orders landing in the same order flow as every other channel.",
  },
};
