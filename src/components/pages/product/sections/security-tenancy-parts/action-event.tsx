import { ArrowLeftRight, FilePlus2, PackagePlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SecurityEntity, SecurityEntityId } from "@/lib/content/product/security-access-model";
import { LAYER, px, py } from "./architecture-geometry";
import styles from "@/components/pages/product/product.module.css";

const actionIcon: Record<SecurityEntityId, LucideIcon> = {
  warehouse: PackagePlus,
  retail: FilePlus2,
  franchise: ArrowLeftRight,
};

/**
 * The single operational event the active path produces — an inline system
 * moment on the architecture floor, not a panel.
 */
export function ActionEvent({
  entity,
  layout = "stage",
}: {
  entity: SecurityEntity;
  layout?: "stage" | "flow";
}) {
  const Icon = actionIcon[entity.id];
  return (
    <div
      className={layout === "stage" ? styles.securityTenancy__action : styles.securityTenancy__flowAction}
      style={
        layout === "stage"
          ? {
              left: px(LAYER.actionX),
              top: py(LAYER.actionY),
              width: px(LAYER.actionEndX - LAYER.actionX),
            }
          : undefined
      }
      data-accent={entity.accent}
    >
      <span className={styles.securityTenancy__actionIcon} aria-hidden="true">
        <Icon size={14} strokeWidth={2.1} />
      </span>
      <span className={styles.securityTenancy__actionBody}>
        <span className={styles.securityTenancy__actionTitle}>{entity.action.title}</span>
        <span className={styles.securityTenancy__actionMeta}>
          {entity.action.recordId}
          <i aria-hidden="true" />
          {entity.location}
          <i aria-hidden="true" />
          {entity.action.time}
        </span>
      </span>
    </div>
  );
}
