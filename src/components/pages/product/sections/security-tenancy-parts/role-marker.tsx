import type { SecurityEntity } from "@/lib/content/product/security-access-model";
import { LAYER, centerX, px, py } from "./architecture-geometry";
import styles from "@/components/pages/product/product.module.css";

/**
 * A person operating inside one entity. Rendered as an open marker — portrait,
 * role, scope — hanging off the connector that ties them to their environment.
 */
export function RoleMarker({
  entity,
  state,
  layout = "stage",
}: {
  entity: SecurityEntity;
  state: "active" | "muted";
  layout?: "stage" | "flow";
}) {
  return (
    <div
      className={layout === "stage" ? styles.securityTenancy__role : styles.securityTenancy__flowRole}
      style={
        layout === "stage"
          ? { left: px(centerX(entity.frame)), top: py(LAYER.roleNodeY + 12) }
          : undefined
      }
      data-state={state}
      data-accent={entity.accent}
    >
      <span className={styles.securityTenancy__roleAvatar} aria-hidden="true">
        <svg viewBox="0 0 40 40" className={styles.securityTenancy__roleAvatarArt}>
          <circle className={styles.securityTenancy__avatarField} cx="20" cy="20" r="20" />
          <circle className={styles.securityTenancy__avatarFigure} cx="20" cy="16" r="6.4" />
          <path
            className={styles.securityTenancy__avatarFigure}
            d="M 6.6 34.5 C 8.6 27.4 13.6 24 20 24 C 26.4 24 31.4 27.4 33.4 34.5"
          />
        </svg>
      </span>
      <span className={styles.securityTenancy__roleName}>{entity.role.name}</span>
      <span className={styles.securityTenancy__roleAccess}>{entity.role.access}</span>
    </div>
  );
}
