/**
 * Illustrative stock for the variant matrix. Quantities are sample data for a
 * single style, held per location so the grid can be re-read location by
 * location the way an apparel team actually reads it.
 */
export type VariantMatrix = {
  style: string;
  sizes: readonly string[];
  locations: readonly { id: string; label: string; note: string }[];
  colourways: readonly {
    name: string;
    swatch: string;
    /** Units per size, keyed by location id. Same length as `sizes`. */
    stock: Readonly<Record<string, readonly number[]>>;
  }[];
  /** At or below this a cell is running out; 0 is empty. */
  lowAt: number;
};

export type IndustryDetail = {
  slug: "apparel-footwear" | "imitation-jewellery" | "franchise-networks";
  name: string;
  eyebrow: string;
  hero: {
    title: string;
    body: string;
    image: string;
    alt: string;
  };
  pains: { title: string; body: string }[];
  fit: {
    title: string;
    body: string;
    modules: { name: string; body: string }[];
  };
  matrix?: VariantMatrix;
  workflow: {
    order: string;
    title: string;
    body: string;
    /** Modules that write to the record at this point in the day. */
    systems?: readonly string[];
    image: string;
    alt: string;
  }[];
  proof: {
    label: string;
    title: string;
    before: string;
    after: string;
    turningPoint: string;
    image: string;
    alt: string;
  };
  cta: { title: string; body: string };
};

export const industryDetails: Partial<
  Record<IndustryDetail["slug"], IndustryDetail>
> = {
  "franchise-networks": {
    slug: "franchise-networks",
    name: "Franchise Networks",
    eyebrow: "Franchise Networks",
    hero: {
      title: "Control the network. Keep every entity clear.",
      body: "Give head office the visibility to plan and allocate while each outlet keeps responsibility for its own operation.",
      image: "/images/industries/franchise-networks/hero.png",
      alt: "Franchise retail manager reviewing inventory in a contemporary Indian store.",
    },
    pains: [
      {
        title: "Every outlet has a different operating context",
        body: "A network needs one view without treating all locations as the same entity.",
      },
      {
        title: "Central standards can blur local ownership",
        body: "Head office control must not remove the responsibility that belongs at an outlet.",
      },
      {
        title: "Allocation decisions need live context",
        body: "Stock needs to move to the right outlet with clear source, destination and ownership.",
      },
      {
        title: "Plans and subscriptions need network discipline",
        body: "Partner operating context needs to remain clear as the network evolves.",
      },
      {
        title: "Consolidation cannot erase boundaries",
        body: "Network visibility is useful only when entity-level records and books remain distinct.",
      },
    ],
    fit: {
      title:
        "Centralize the rules and visibility. Keep ownership where it belongs.",
      body: "Bizonix connects head-office planning to outlet operations without mixing entities or their records.",
      modules: [
        {
          name: "Franchise",
          body: "Outlet structure, plans and network control.",
        },
        { name: "Inventory", body: "Stock movement by entity." },
        { name: "Wholesale", body: "Allocation and partner fulfilment." },
        { name: "Accounting", body: "Books that retain operating context." },
        { name: "Analytics", body: "Consolidated network visibility." },
      ],
    },
    matrix: {
      style: "Network allocation · Week 24",
      sizes: ["North", "West", "South", "East", "Online", "Reserve"],
      locations: [
        { id: "all", label: "Network", note: "Consolidated view" },
        { id: "warehouse", label: "Central", note: "Allocation stock" },
        { id: "flagship", label: "Outlet A", note: "Local entity" },
        { id: "franchise", label: "Outlet B", note: "Partner entity" },
      ],
      colourways: [
        {
          name: "Planned",
          swatch: "#2f6bff",
          stock: {
            warehouse: [18, 14, 12, 9, 7, 5],
            flagship: [8, 6, 9, 5, 4, 3],
            franchise: [6, 5, 7, 4, 3, 2],
          },
        },
        {
          name: "Available",
          swatch: "#2ec4b6",
          stock: {
            warehouse: [22, 18, 15, 11, 8, 6],
            flagship: [10, 8, 11, 7, 5, 4],
            franchise: [7, 6, 8, 6, 4, 3],
          },
        },
      ],
      lowAt: 3,
    },
    workflow: [
      {
        order: "01",
        title: "Central planning",
        body: "Start with a network view of demand, stock and the entity context behind each outlet.",
        systems: ["Franchise", "Analytics"],
        image: "/images/product/personas/franchise.png",
        alt: "Illustrative franchise operations planning scene.",
      },
      {
        order: "02",
        title: "Stock allocation",
        body: "Allocate available stock with the destination, partner and operating rules intact.",
        systems: ["Inventory", "Wholesale"],
        image: "/images/industries/overview/franchise-operations.webp",
        alt: "Illustrative stock preparation for a retail network.",
      },
      {
        order: "03",
        title: "Outlet receiving",
        body: "Let the receiving outlet act in its own entity context as stock arrives.",
        systems: ["Franchise", "Inventory"],
        image: "/images/product/security/security-warehouse-v2.png",
        alt: "Warehouse associate scanning an incoming carton.",
      },
      {
        order: "04",
        title: "Local selling",
        body: "Keep each outlet moving at the counter while its activity remains visible to the network.",
        systems: ["Sales & POS", "Inventory"],
        image: "/images/product/day-in-life/day-counter-sale.webp",
        alt: "Retail associate completing a sale at a checkout counter.",
      },
      {
        order: "05",
        title: "Replenishment and transfer",
        body: "Rebalance stock while retaining the source, destination and entity responsibilities.",
        systems: ["Inventory", "Franchise"],
        image: "/images/product/operating-model/journey-movement.webp",
        alt: "Delivery truck transporting stock between locations.",
      },
      {
        order: "06",
        title: "Network review",
        body: "Review the whole network without losing sight of the records each entity owns.",
        systems: ["Analytics", "Accounting"],
        image: "/images/product/day-in-life/day-month-end-books.webp",
        alt: "Reports and a laptop prepared for an operations review.",
      },
    ],
    proof: {
      label: "Approved customer story",
      title: "One network view can retain each entity's operating context.",
      before:
        "Warehouse allocation and franchise coordination were managed across disconnected tools and manual communication.",
      after:
        "Central teams, stores and franchise outlets can work from one operating view with clear entity responsibilities.",
      turningPoint:
        "Connected inventory and franchise operations into one operating view across entities.",
      image: "/images/industries/proof/customer-story.webp",
      alt: "Retail leadership team reviewing a connected operating model.",
    },
    cta: {
      title:
        "Bring central control and outlet responsibility into one operating model.",
      body: "Book a walkthrough tailored to the way your network plans, allocates and runs today.",
    },
  },
  "imitation-jewellery": {
    slug: "imitation-jewellery",
    name: "Imitation Jewellery",
    eyebrow: "Imitation Jewellery",
    hero: {
      title: "Keep every design, piece and sale in view.",
      body: "Connect supplier GRNs, piece barcodes and fast counter movement without losing the identity of the jewellery that moves through the operation.",
      image: "/images/industries/imitation-jewellery/hero.png",
      alt: "Jewellery store team checking pieces and inventory at a display counter.",
    },
    pains: [
      {
        title: "Design-heavy SKUs quickly lose their structure",
        body: "Small variations across collections make a simple product list difficult to trust.",
      },
      {
        title: "Piece-level certainty is hard to maintain",
        body: "A piece needs to remain identifiable from supplier receipt through display, sale and return.",
      },
      {
        title: "Supplier receiving can fragment the record",
        body: "GRN context and physical pieces need to arrive together, not be reconciled later.",
      },
      {
        title: "The counter cannot wait for the back office",
        body: "Fast POS needs to stay connected to the exact piece that has just moved.",
      },
      {
        title: "Movement needs a traceable identity",
        body: "Transfers, returns and location changes should not separate a piece from its operating history.",
      },
    ],
    fit: {
      title: "A connected operating path for every piece—from receipt to sale.",
      body: "Bizonix links piece identity, supplier context and counter movement into one usable operating view.",
      modules: [
        { name: "Inventory", body: "Piece-level stock visibility." },
        { name: "Procurement", body: "Supplier receiving and GRN context." },
        { name: "Sales & POS", body: "Fast counter movement." },
        { name: "Analytics", body: "Consolidated sales and stock visibility." },
      ],
    },
    workflow: [
      {
        order: "01",
        title: "Supplier receipt / GRN",
        body: "Receive new designs with the supplier context that gives each piece a starting point.",
        systems: ["Procurement", "Inventory"],
        image: "/images/industries/imitation-jewellery/hero.png",
        alt: "Associate checking trays of incoming fashion jewellery.",
      },
      {
        order: "02",
        title: "Piece identification",
        body: "Give pieces a barcode identity before they move to a counter or another location.",
        systems: ["Inventory"],
        image: "/images/industries/pains/jewellery-detail.webp",
        alt: "Close-up of a scanner identifying individually tagged jewellery pieces.",
      },
      {
        order: "03",
        title: "Stock placement",
        body: "Place designs where they need to be while retaining their location and piece context.",
        systems: ["Inventory"],
        image: "/images/industries/overview/imitation-jewellery.webp",
        alt: "Jewellery designs organised in display trays and shelves.",
      },
      {
        order: "04",
        title: "Fast counter sale",
        body: "Keep the sale quick without detaching the sold piece from the operating record.",
        systems: ["Sales & POS", "Inventory"],
        image: "/images/industries/imitation-jewellery/workflow/counter-sale.webp",
        alt: "Illustrative jewellery checkout with an associate scanning a tagged fashion accessory.",
      },
      {
        order: "05",
        title: "Returns and movement",
        body: "Retain the piece identity when items return or move between operating locations.",
        systems: ["Inventory", "Sales & POS"],
        image: "/images/industries/overview/jewellery-operations.webp",
        alt: "Associate scanning jewellery pieces as they return to inventory trays.",
      },
      {
        order: "06",
        title: "Inventory visibility",
        body: "Close the day with a connected view of pieces, stock and sales movement.",
        systems: ["Inventory", "Analytics"],
        image: "/images/product/day-in-life/day-month-end-books.webp",
        alt: "Laptop charts and printed reports used to review inventory and sales.",
      },
    ],
    proof: {
      label: "Approved customer story",
      title: "A single operating view gives every piece its context.",
      before:
        "Store billing, warehouse allocation and franchise coordination were managed across separate tools and manual coordination.",
      after:
        "Barcode transactions, stock visibility and financial reconciliation share one connected operating record.",
      turningPoint:
        "Connected inventory, sales and franchise operations into one operating view across operating entities.",
      image: "/images/industries/proof/customer-story.webp",
      alt: "Retail operations team working together in a jewellery environment.",
    },
    cta: {
      title:
        "Bring piece identity and retail movement into one operating view.",
      body: "Book a walkthrough tailored to the way your suppliers, stock and counters work today.",
    },
  },
  "apparel-footwear": {
    slug: "apparel-footwear",
    name: "Apparel & Footwear",
    eyebrow: "Apparel & Footwear",
    hero: {
      title: "See size, colour and movement as one.",
      body: "Keep variant-level stock, wholesale packs and franchise sell-through connected from the back room to the counter.",
      image: "/images/industries/apparel-footwear/hero.png",
      alt: "Apparel operations team checking inventory in a contemporary Indian retail store.",
    },
    pains: [
      {
        title: "Variants multiply faster than visibility",
        body: "Size, colour and seasonal ranges make a single stock number too blunt for daily decisions.",
      },
      {
        title: "Stock is not where demand is",
        body: "Warehouse, store and back-room availability can drift apart when movement is handled separately.",
      },
      {
        title: "Franchise sell-through arrives late",
        body: "Partner outlet movement needs to remain visible without taking away local operating responsibility.",
      },
      {
        title: "Wholesale packs need their own logic",
        body: "Pack-level fulfilment has to stay tied to the exact variants that are actually available.",
      },
      {
        title: "Channel movement can tell different stories",
        body: "Retail sales, transfers and wholesale dispatches must resolve into one usable view of stock.",
      },
    ],
    fit: {
      title:
        "One operating view for the pressures apparel teams manage every day.",
      body: "Bizonix connects the workflows around the garment—not just the systems around the business.",
      modules: [
        {
          name: "Inventory",
          body: "Size, colour and location-level stock visibility.",
        },
        {
          name: "Sales & POS",
          body: "Retail movement at the counter, connected to stock.",
        },
        { name: "Wholesale", body: "Pack-level movement and fulfilment." },
        { name: "Franchise", body: "Outlet sell-through and allocation." },
        { name: "Analytics", body: "Consolidated sales and stock visibility." },
      ],
    },
    matrix: {
      style: "Oxford Shirt · SS26",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      locations: [
        { id: "all", label: "All locations", note: "Everything, everywhere" },
        { id: "warehouse", label: "Warehouse", note: "Central stock" },
        { id: "flagship", label: "Flagship store", note: "Own retail" },
        { id: "franchise", label: "Franchise", note: "Partner outlets" },
      ],
      colourways: [
        {
          name: "Navy",
          swatch: "#1f2d4a",
          stock: {
            warehouse: [6, 18, 34, 30, 14, 5],
            flagship: [2, 7, 12, 9, 4, 1],
            franchise: [1, 5, 9, 8, 3, 0],
          },
        },
        {
          name: "Ecru",
          swatch: "#ddd3bf",
          stock: {
            warehouse: [4, 12, 22, 19, 8, 3],
            flagship: [1, 4, 8, 6, 2, 0],
            franchise: [0, 3, 6, 5, 2, 1],
          },
        },
        {
          name: "Olive",
          swatch: "#5a6448",
          stock: {
            warehouse: [2, 9, 16, 15, 7, 0],
            flagship: [0, 3, 6, 5, 1, 0],
            franchise: [1, 2, 4, 4, 1, 0],
          },
        },
        {
          name: "Rust",
          swatch: "#b5542f",
          stock: {
            warehouse: [0, 5, 11, 9, 4, 0],
            flagship: [0, 2, 3, 2, 1, 0],
            franchise: [0, 1, 2, 2, 0, 0],
          },
        },
        {
          name: "Sky",
          swatch: "#7ba8d9",
          stock: {
            warehouse: [3, 10, 19, 17, 6, 2],
            flagship: [1, 3, 7, 5, 2, 0],
            franchise: [0, 2, 5, 3, 1, 0],
          },
        },
      ],
      lowAt: 3,
    },
    workflow: [
      {
        order: "01",
        title: "Morning stock check",
        body: "Start with size, colour and location-level availability before the day begins.",
        systems: ["Inventory", "Analytics"],
        image: "/images/industries/apparel-footwear/workflow-stock.png",
        alt: "Merchandiser checking folded apparel inventory with a handheld scanner.",
      },
      {
        order: "02",
        title: "Receive and replenish",
        body: "Bring incoming variants into the operating record and direct stock where it is needed.",
        systems: ["Inventory", "Procurement"],
        image: "/images/industries/pains/apparel-detail.webp",
        alt: "Apparel team scanning garment tags while receiving stock into bins.",
      },
      {
        order: "03",
        title: "Retail sale",
        body: "Keep the counter moving while the exact sold variant updates the wider stock picture.",
        systems: ["Sales & POS", "Inventory"],
        image: "/images/industries/overview/apparel-footwear.webp",
        alt: "Apparel retail operation in a contemporary store.",
      },
      {
        order: "04",
        title: "Wholesale and franchise movement",
        body: "Allocate packs and replenishment with the destination and sell-through context intact.",
        systems: ["Wholesale", "Franchise", "Inventory"],
        image: "/images/industries/overview/apparel-operations.webp",
        alt: "Apparel operations team reviewing stock movement.",
      },
      {
        order: "05",
        title: "End-of-day visibility",
        body: "Review sales and movement from one connected operational view.",
        systems: ["Analytics", "Accounting"],
        image: "/images/industries/apparel-footwear/hero.png",
        alt: "Store manager reviewing the day's movement on a tablet in an apparel showroom.",
      },
    ],
    proof: {
      label: "Operational proof",
      title: "A single record gives each movement the context it needs.",
      before:
        "Store billing, allocation and stock movement can be split across disconnected tools and manual coordination.",
      after:
        "Inventory, retail movement, wholesale fulfilment and franchise allocation can share one operating record.",
      turningPoint:
        "When the variant, location and movement stay connected, teams can act from the same operating view.",
      image: "/images/industries/pains/apparel-detail.webp",
      alt: "Apparel team reviewing operations together in a store back office.",
    },
    cta: {
      title: "See the apparel operation as one connected system.",
      body: "Book a walkthrough tailored to the way your stores, warehouse and partners run today.",
    },
  },
};

export function getIndustryDetail(slug: string) {
  return industryDetails[slug as IndustryDetail["slug"]];
}
