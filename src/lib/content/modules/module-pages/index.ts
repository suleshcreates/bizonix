import { accountingModule } from "./accounting";
import { analyticsModule } from "./analytics";
import { ecommerceModule } from "./ecommerce";
import { franchiseModule } from "./franchise";
import { inventoryModule } from "./inventory";
import { procurementModule } from "./procurement";
import { salesPosModule } from "./sales-pos";
import { securityModule } from "./security";
import { moduleSlugs, type ModuleData, type ModuleSlug } from "./types";
import { wholesaleModule } from "./wholesale";

/**
 * The module registry.
 *
 * `/modules/[slug]` resolves through this map and nothing else. Adding a
 * module means adding a data file here — no route, template or component
 * changes are involved.
 */
export const modulePages: Record<ModuleSlug, ModuleData> = {
  inventory: inventoryModule,
  procurement: procurementModule,
  "sales-pos": salesPosModule,
  wholesale: wholesaleModule,
  franchise: franchiseModule,
  accounting: accountingModule,
  ecommerce: ecommerceModule,
  analytics: analyticsModule,
  security: securityModule,
};

/** Ordered list, in the approved SRS module sequence. */
export const modulePageList: readonly ModuleData[] = moduleSlugs.map(
  (slug) => modulePages[slug],
);

function isModuleSlug(value: string): value is ModuleSlug {
  return (moduleSlugs as readonly string[]).includes(value);
}

/** Resolves a URL segment to module data, or `undefined` for an unknown slug. */
export function getModulePage(slug: string): ModuleData | undefined {
  return isModuleSlug(slug) ? modulePages[slug] : undefined;
}

export { moduleSlugs, moduleRoute } from "./types";
export type * from "./types";
