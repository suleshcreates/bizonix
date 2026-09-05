import type { ProblemVisualId } from "@/lib/content/modules/module-pages/types";
import {
  ContextStrippedVisual,
  EntitySplitVisual,
  PeriodRelayVisual,
} from "./visuals/accounting-visuals";
import {
  AssembledReportVisual,
  DeadEndNumberVisual,
  UnreadableNetworkVisual,
} from "./visuals/analytics-visuals";
import {
  BatchedOrdersVisual,
  DuplicateCatalogueVisual,
  StaleAvailabilityVisual,
} from "./visuals/ecommerce-visuals";
import {
  AccessOverreachVisual,
  OffSystemOutletVisual,
  TransferLimboVisual,
} from "./visuals/franchise-visuals";
import {
  CountMismatchVisual,
  IdentityLossVisual,
  LocationMismatchVisual,
} from "./visuals/inventory-visuals";
import {
  CostDetachedVisual,
  OrderReceiptDriftVisual,
  SupplierScatterVisual,
} from "./visuals/procurement-visuals";
import {
  DuplicateEntryVisual,
  ReturnOrphanVisual,
  SessionBoundaryVisual,
} from "./visuals/sales-pos-visuals";
import {
  AbsentBoundaryVisual,
  PermissionCreepVisual,
  UnattributedChangeVisual,
} from "./visuals/security-visuals";
import {
  CreditScatterVisual,
  PartialShipmentVisual,
  StalePickVisual,
} from "./visuals/wholesale-visuals";
import type { ProblemVisualComponent } from "./visual-kit";

/**
 * Every conceptual diagram, addressed by the identifier module data names.
 *
 * The map is typed `Record<ProblemVisualId, …>`, so the compiler enforces both
 * halves of the contract: data may only reference a visual that exists, and
 * every declared visual must be implemented here. A story added to
 * `problemVisualIds` without a drawing fails to build.
 */
export const problemVisualRegistry: Record<
  ProblemVisualId,
  ProblemVisualComponent
> = {
  /* inventory */
  "count-mismatch": CountMismatchVisual,
  "location-mismatch": LocationMismatchVisual,
  "identity-loss": IdentityLossVisual,

  /* procurement */
  "order-receipt-drift": OrderReceiptDriftVisual,
  "cost-detached": CostDetachedVisual,
  "supplier-scatter": SupplierScatterVisual,

  /* sales & pos */
  "duplicate-entry": DuplicateEntryVisual,
  "session-boundary": SessionBoundaryVisual,
  "return-orphan": ReturnOrphanVisual,

  /* wholesale */
  "partial-shipment": PartialShipmentVisual,
  "stale-pick": StalePickVisual,
  "credit-scatter": CreditScatterVisual,

  /* franchise */
  "off-system-outlet": OffSystemOutletVisual,
  "transfer-limbo": TransferLimboVisual,
  "access-overreach": AccessOverreachVisual,

  /* accounting */
  "period-relay": PeriodRelayVisual,
  "context-stripped": ContextStrippedVisual,
  "entity-split": EntitySplitVisual,

  /* ecommerce */
  "duplicate-catalogue": DuplicateCatalogueVisual,
  "stale-availability": StaleAvailabilityVisual,
  "batched-orders": BatchedOrdersVisual,

  /* analytics */
  "assembled-report": AssembledReportVisual,
  "dead-end-number": DeadEndNumberVisual,
  "unreadable-network": UnreadableNetworkVisual,

  /* security */
  "permission-creep": PermissionCreepVisual,
  "absent-boundary": AbsentBoundaryVisual,
  "unattributed-change": UnattributedChangeVisual,
};
