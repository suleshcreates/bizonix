import type { IndustryId } from "./industries";

export type WorkflowIconName =
  | "receive"
  | "prepare"
  | "sell"
  | "move"
  | "close";

export type IndustryWorkflowStage = {
  id: string;
  order: string;
  time: string;
  title: string;
  description: string;
  actions: readonly string[];
  icon: WorkflowIconName;
};

export type IndustryWorkflow = {
  label: string;
  descriptor: string;
  stages: readonly IndustryWorkflowStage[];
};

// Times are marketing placeholders, isolated here for easy replacement when
// approved industry-specific timing becomes available.
export const industryWorkflowData: Record<IndustryId, IndustryWorkflow> = {
  apparel: {
    label: "Apparel & Footwear",
    descriptor: "Size · Colour · Season",
    stages: [
      { id: "apparel-receive", order: "01", time: "09:00", title: "Receive", description: "Bring size and colour stock into one operating record.", actions: ["Confirm supplier GRNs", "Verify variant labels", "Release available stock"], icon: "receive" },
      { id: "apparel-prepare", order: "02", time: "11:30", title: "Prepare", description: "Shape assortments for stores, franchise and wholesale demand.", actions: ["Review seasonal stock", "Build wholesale packs", "Allocate by location"], icon: "prepare" },
      { id: "apparel-sell", order: "03", time: "14:00", title: "Sell", description: "Keep every sold variant connected to current inventory.", actions: ["Scan piece barcodes", "Apply selling rules", "Update store stock"], icon: "sell" },
      { id: "apparel-move", order: "04", time: "17:30", title: "Move", description: "Replenish locations with source and destination preserved.", actions: ["Review sell-through", "Approve transfers", "Track stock movement"], icon: "move" },
      { id: "apparel-close", order: "05", time: "19:00", title: "Close", description: "Reconcile the day across inventory, sales and books.", actions: ["Resolve exceptions", "Post final movements", "Review connected books"], icon: "close" },
    ],
  },
  jewellery: {
    label: "Imitation Jewellery",
    descriptor: "Piece · Barcode · GRN",
    stages: [
      { id: "jewellery-receive", order: "01", time: "09:00", title: "Receive", description: "Record supplier receipts at design and piece level.", actions: ["Confirm supplier GRNs", "Inspect individual pieces", "Assign piece barcodes"], icon: "receive" },
      { id: "jewellery-prepare", order: "02", time: "11:30", title: "Prepare", description: "Organize design-heavy assortments for fast counter handling.", actions: ["Group design variants", "Verify barcode labels", "Release counter stock"], icon: "prepare" },
      { id: "jewellery-sell", order: "03", time: "14:00", title: "Sell", description: "Bill each piece without separating the sale from stock.", actions: ["Scan the piece", "Complete fast POS", "Update piece status"], icon: "sell" },
      { id: "jewellery-move", order: "04", time: "17:30", title: "Move", description: "Transfer selected pieces with identity and location intact.", actions: ["Select piece inventory", "Approve destination", "Confirm receiving"], icon: "move" },
      { id: "jewellery-close", order: "05", time: "19:00", title: "Close", description: "Reconcile supplier, stock and sales movements together.", actions: ["Review barcode gaps", "Resolve GRN differences", "Post connected books"], icon: "close" },
    ],
  },
  franchise: {
    label: "Franchise Networks",
    descriptor: "Control · Allocation · Entities",
    stages: [
      { id: "franchise-receive", order: "01", time: "09:00", title: "Review", description: "Start with current stock and demand across the outlet network.", actions: ["Read outlet demand", "Check central stock", "Confirm entity scope"], icon: "receive" },
      { id: "franchise-prepare", order: "02", time: "11:30", title: "Allocate", description: "Prepare replenishment within central operating guardrails.", actions: ["Prioritize locations", "Approve allocation", "Respect entity boundaries"], icon: "prepare" },
      { id: "franchise-sell", order: "03", time: "14:00", title: "Sell", description: "Let each outlet transact inside its own responsibility.", actions: ["Run outlet POS", "Update local stock", "Preserve central visibility"], icon: "sell" },
      { id: "franchise-move", order: "04", time: "17:30", title: "Replenish", description: "Move inventory through the network with clear ownership.", actions: ["Request replenishment", "Confirm allocation", "Track dispatch"], icon: "move" },
      { id: "franchise-close", order: "05", time: "19:00", title: "Consolidate", description: "Close each entity while retaining one network-wide view.", actions: ["Review outlet activity", "Reconcile movements", "Read consolidated books"], icon: "close" },
    ],
  },
};
