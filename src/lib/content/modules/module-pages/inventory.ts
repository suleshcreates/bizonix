import { Boxes } from "lucide-react";
import type { ModuleData } from "./types";

export const inventoryModule: ModuleData = {
  slug: "inventory",
  title: "Inventory",
  eyebrow: "Stock control",
  outcome: "Piece-level truth, live across every location.",
  intro:
    "Inventory holds what the business physically owns — every piece, in the location that actually has it. It is the record the counter, the warehouse and the books all read from.",
  icon: Boxes,
  theme: {
    accent: "#22b8cf",
    accentDark: "#087f8c",
    accentSoft: "rgba(34, 184, 207, 0.1)",
  },

  hero: {
    eyebrow: "Inventory",
    headline: "Know every piece. Stay in control.",
    headlineAccent: "Stay in control.",
    body: "Track every piece across locations, movements and counts.",
    primaryCta: { label: "Book a demo", href: "/contact" },
    secondaryCta: { label: "Explore all modules", href: "/modules" },
    visualVariant: "inventory",
    chain: [
      { id: "piece", label: "Piece", detail: "Own barcode" },
      { id: "entry", label: "Entry", detail: "Opened · sold · left" },
      { id: "location", label: "Location", detail: "Warehouse or store" },
      { id: "count", label: "Count", detail: "Variance by entry" },
    ],
    screen: {
      id: "stock-list",
      focus: "left top",
      alt: "Bizonix stock list showing quantity, rate, warehouse and barcode for each stock line.",
      annotations: [
        {
          id: "in-stock",
          x: 5,
          y: 7,
          side: "right",
          label: "In stock",
          detail: "Counted in pieces, not in lines — the tile reads the rows below it.",
        },
        {
          id: "qty",
          x: 29,
          y: 40,
          side: "right",
          label: "QTY",
          detail: "What is held against this line right now, at this location.",
        },
        {
          id: "mrc",
          x: 57,
          y: 68,
          side: "left",
          label: "MRC no",
          detail: "The entry the line came in on, so a shortage names a receipt.",
        },
      ],
    },
    facts: [
      { label: "Held at", value: "Piece & entry" },
      { label: "Scoped to", value: "Warehouse, store, partner" },
      { label: "Read by", value: "POS, transfers, books" },
    ],
  },

  problemSection: {
    eyebrow: "Before Inventory",
    title: "What a stock count actually costs a team today.",
    intro:
      "Three operational failures that turn a physical count into a negotiation, and an available piece into a refused sale.",
    problems: [
      {
        id: "count-argument",
        number: "01",
        title: "The count is a negotiation",
        description:
          "Two people count the same rack and produce two numbers. Because stock is held as a quantity against a style, neither figure can be traced back to a specific piece — so the difference gets written off rather than explained.",
        quote: "Rack says 38. System says 41. Nobody can name the three.",
        visual: "count-mismatch",
      },
      {
        id: "wrong-place",
        number: "02",
        title: "Stock is in the wrong place, and nobody can see it",
        description:
          "Availability is reported for the business rather than for the shelf a customer is standing at. Stock exists, but it exists somewhere else, and the counter has no way to find out without a phone call.",
        quote: "Sold out at the counter while the warehouse is holding forty.",
        visual: "location-mismatch",
      },
      {
        id: "identity-lost",
        number: "03",
        title: "Identity is lost at receiving",
        description:
          "One code is shared across an entire style, so the moment goods are put away the system can no longer say which intake a piece came from, what it cost, or which price series it belongs to.",
        quote: "A return arrives and nothing says which entry it came out of.",
        visual: "identity-loss",
      },
    ],
    consequence: {
      title:
        "None of this arrives as a loss. It arrives as time spent arguing, and as sales that quietly did not happen.",
      items: [
        {
          id: "variance",
          label: "Variance without a cause",
          body: "A difference is written off because no entry can be named as the one that is short.",
        },
        {
          id: "refused",
          label: "Available stock refused",
          body: "The counter turns a customer away while the piece sits in a location it cannot see.",
        },
        {
          id: "returns",
          label: "Returns nobody can place",
          body: "A piece comes back and no record says which intake, cost or price series it belongs to.",
        },
      ],
    },
  },

  outcomesSection: {
    eyebrow: "After Inventory",
    title: "Three things change about",
    highlight: "how stock moves.",
    intro: "Piece-level identity. Location-aware stock. A history that stays intact.",
    outcomes: [
      {
        id: "named-variance",
        number: "01",
        visualVariant: "piece-identity",
        accent: "#22b8cf",
        title: "A count that names the piece",
        description: "Stock audit compares physical scans against the entries the system is holding, so a variance points at a specific entry and location instead of producing a bare quantity gap.",
      },
      {
        id: "location-truth",
        number: "02",
        visualVariant: "location-aware",
        accent: "#22b8cf",
        title: "Availability that knows where it is",
        description: "Every line carries the warehouse or store holding it. The counter, the transfer screen and the stock list are all reading the same location-aware number.",
      },
      {
        id: "movement-trail",
        number: "03",
        visualVariant: "movement-trace",
        accent: "#22b8cf",
        title: "Movement that leaves a trail",
        description: "Transfers, damage entries and adjustments post against the same piece identity that receiving issued, so the history of a piece survives every hand it passes through.",
      },
    ],
  },

  capabilities: {
    groups: [
      {
        id: "visibility",
        title: "Stock visibility",
        context:
          "One list that answers what is on hand, what it is worth and where it is sitting.",
        items: [
          "Stock overview",
          "Location-wise stock",
          "Low-stock alerts",
          "Expiry filtering",
          "Stock value at cost",
          "Stock list export",
        ],
      },
      {
        id: "identity",
        title: "Piece & series identity",
        context:
          "Identity is issued once, at intake, and every later screen reads it.",
        items: [
          "Series entries",
          "Piece barcodes",
          "Barcode printing",
          "Legacy code mapping",
          "Label reprint",
          "Pack and HSN attributes",
        ],
      },
      {
        id: "movement",
        title: "Movement & correction",
        context:
          "The three things that actually change a stock number, all posted against the same record.",
        items: [
          "Stock transfers",
          "Stock audit",
          "Damage entries",
          "Quantity adjustments",
        ],
      },
    ],
  },

  workflow: {
    variant: "timeline",
    title: "How stock actually moves",
    intro:
      "Five operational steps. Each one hands the next a record rather than a spreadsheet row.",
    steps: [
      {
        id: "receive",
        index: "01",
        title: "Stock is received",
        body: "Goods arrive against a purchase and are opened as a stock entry for the receiving location.",
        record: "Entry created · opened quantity set",
      },
      {
        id: "identify",
        index: "02",
        title: "Identity is issued",
        body: "Each piece is given its own barcode and the labels are printed in the same pass, before anything is put away.",
        record: "Barcode issued against the entry",
      },
      {
        id: "hold",
        index: "03",
        title: "Stock is held at a location",
        body: "The line joins the stock list under the warehouse or store that physically holds it, with rate, MRP and tax attributes attached.",
        record: "Line live in the stock list",
      },
      {
        id: "move",
        index: "04",
        title: "Stock moves",
        body: "A transfer takes pieces out of the source location and leaves them awaiting receipt at the destination — the same identity on both sides.",
        record: "Out at source · awaiting receipt",
      },
      {
        id: "count",
        index: "05",
        title: "Stock is counted",
        body: "An audit scans what is physically there and compares it with the entries on file, so a difference names the entry it belongs to.",
        record: "Variance attached to an entry",
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
        id: "stock-list",
        state: "captured",
        screen: "stock-list",
        featured: true,
        order: 1,
        context: "Daily view",
        title: "Stock list",
        description:
          "Every stock line with its current quantity, sale rate, MRP, cost, warehouse and barcode, filtered by expiry or low stock and exportable as it stands.",
        alt: "Bizonix stock list screen with in-stock, stock value, lines and locations tiles above a table of stock lines.",
        annotations: [
          {
            id: "qty",
            x: 29,
            y: 42,
            label: "QTY",
            detail: "Quantity currently held, per line and per location.",
          },
          {
            id: "warehouse",
            x: 64,
            y: 22,
            label: "WAREHOUSE",
            detail: "The location actually holding the line.",
          },
          {
            id: "barcode",
            x: 76,
            y: 22,
            label: "BARCODE",
            detail: "The piece identity issued at receiving.",
          },
          {
            id: "value",
            x: 31,
            y: 7,
            label: "Stock value",
            detail: "At cost, computed from the lines below it.",
          },
        ],
      },
      {
        id: "series-ledger",
        state: "captured",
        screen: "series-ledger",
        order: 2,
        context: "Per entry",
        title: "Series entries",
        description:
          "Each stock entry with the quantity opened, the quantity sold, what is still in stock and the sell-through that follows from those three numbers.",
        alt: "Bizonix series entry ledger with location, opened, sold, in-stock, sell-through and value columns.",
        annotations: [
          {
            id: "opened",
            x: 38,
            y: 5,
            label: "OPENED vs SOLD",
            detail: "What went in against what has left, per entry.",
          },
          {
            id: "sell-through",
            x: 62,
            y: 5,
            label: "SELL-THROUGH",
            detail: "Derived from the same two columns, not entered.",
          },
        ],
      },
      {
        id: "barcode-queue",
        state: "captured",
        screen: "barcode-queue",
        order: 3,
        context: "At intake",
        title: "Barcode printing",
        description:
          "The print queue that turns a received entry into labels — new barcode, in-stock count, print quantity and the legacy code it replaces.",
        alt: "Bizonix barcode printing queue listing new barcodes against in-stock counts, print quantities and legacy codes.",
        annotations: [
          {
            id: "legacy",
            x: 31,
            y: 15,
            label: "Legacy",
            detail: "The old code the new barcode is mapped to.",
          },
          {
            id: "print-qty",
            x: 24,
            y: 15,
            label: "Print qty",
            detail: "Labels to produce for this line.",
          },
        ],
      },
      {
        id: "transfer",
        state: "pending",
        order: 4,
        context: "Between locations",
        title: "Stock transfer",
        description:
          "Dispatch from one location and receipt at the other, against the same piece identity.",
      },
      {
        id: "audit",
        state: "pending",
        order: 5,
        context: "Verification",
        title: "Stock audit",
        description:
          "A physical count reconciled against the entries the system is holding.",
      },
    ],
  },

  verticalRelevance: {
    apparel:
      "Size and colour are separate pieces, not one style quantity, so a rack that is short is short in a specific size rather than in the abstract.",
    jewellery:
      "High-SKU assortments with near-identical designs stay separable, because the piece carries the barcode rather than the design name.",
    franchise:
      "Every line names the outlet holding it, so head office reads one stock list without asking nine people for theirs.",
  },

  faq: [
    {
      id: "piece-vs-batch",
      question: "Is stock tracked per piece or per batch?",
      answer:
        "Both are represented. A stock entry holds the intake — what was opened, what has sold and what remains — and individual pieces within it carry their own barcode. That is why a variance can name an entry instead of reporting a bare quantity gap.",
    },
    {
      id: "legacy-codes",
      question: "We already have barcodes from an older system. Do they survive?",
      answer:
        "Existing codes are held against the new barcode as the legacy code, and both appear on the printing screen. Scanning history and old labels stay meaningful while the new identity takes over.",
    },
    {
      id: "locations",
      question: "Does the stock number differ by location?",
      answer:
        "Yes. Every line is held against the warehouse or store that has it, and the stock list can be read for one location or across them. There is no single blended figure that hides where stock actually is.",
    },
    {
      id: "damage",
      question: "How are damage and shrinkage handled?",
      answer:
        "Through damage entries and adjustments, posted against the affected stock entry rather than typed over the quantity. The stock number changes and the reason for the change stays attached to it.",
    },
    {
      id: "counts",
      question: "How often do we have to do a full count?",
      answer:
        "That remains an operating decision. Stock audit supports counting a location or a section against the entries on file, so partial counts are meaningful on their own instead of only being useful once everything is counted.",
    },
  ],

  relatedModules: ["procurement", "sales-pos", "franchise"],

  seo: {
    title: "Inventory module",
    description:
      "Piece and series level stock control across warehouses, stores and partner outlets — barcodes issued at receiving, transfers, audits and damage entries on one record.",
    ogTitle: "Bizonix Inventory — piece-level stock, live by location",
    ogDescription:
      "Stock held as pieces against the location that has them, with barcode identity issued at intake and carried through every movement.",
  },
};
