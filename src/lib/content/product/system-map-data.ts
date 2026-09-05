export type ConnectionType = "operational" | "data" | "visibility";

export interface SystemNodeData {
  id: string;
  title: string;
  description: string;
  icon: "orders" | "inventory" | "catalog" | "customers" | "finance" | "insights";
  x: number;
  y: number;
  connectionType: ConnectionType;
  pathDefinition: string;
}

export interface SupportRailItemData {
  id: string;
  title: string;
  description: string;
  iconName: "network" | "zap" | "trending" | "shield";
}

export const systemMapNodes: SystemNodeData[] = [
  { id: "orders", title: "Orders", description: "Capture. Validate.\nFulfill.", icon: "orders", x: 27, y: 23, connectionType: "operational", pathDefinition: "M 282 153 C 362 154, 345 244, 417 274" },
  { id: "inventory", title: "Inventory", description: "Real-time stock\nacross locations.", icon: "inventory", x: 75, y: 15, connectionType: "operational", pathDefinition: "M 645 124 C 560 124, 582 222, 490 270" },
  { id: "catalog", title: "Catalog", description: "Products. Pricing.\nVariants.", icon: "catalog", x: 13, y: 48, connectionType: "data", pathDefinition: "M 180 288 C 275 288, 327 286, 414 294" },
  { id: "customers", title: "Customers", description: "Profiles. History.\nPreferences.", icon: "customers", x: 87, y: 40, connectionType: "data", pathDefinition: "M 674 250 C 602 250, 576 300, 494 297" },
  { id: "finance", title: "Finance", description: "Invoicing. Payments.\nReconciliation.", icon: "finance", x: 84, y: 72, connectionType: "visibility", pathDefinition: "M 660 421 C 588 421, 571 368, 492 332" },
  { id: "insights", title: "Insights", description: "Performance that\ndrives decisions.", icon: "insights", x: 52, y: 87, connectionType: "visibility", pathDefinition: "M 451 487 C 451 423, 429 392, 447 350" },
];

export const supportRailItems: SupportRailItemData[] = [
  { id: "connected-view", title: "One connected view", description: "See your business as one operating system.", iconName: "network" },
  { id: "faster-decisions", title: "Faster decisions", description: "Clean data. Clear signals. Confident action.", iconName: "zap" },
  { id: "built-for-scale", title: "Built for scale", description: "Add locations, users and workflows with ease.", iconName: "trending" },
  { id: "enterprise-grade", title: "Enterprise grade", description: "Secure, reliable and ready for real business.", iconName: "shield" },
];
