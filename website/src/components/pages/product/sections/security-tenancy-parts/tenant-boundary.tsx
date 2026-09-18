import type { SecurityEntity, SecurityEntityId } from "@/lib/content/product/security-access-model";
import { securityEntities } from "@/lib/content/product/security-access-model";
import {
  LAYER,
  STAGE,
  TENANT_PERIMETER,
  bottomY,
  centerX,
  roleConnector,
  routed,
} from "./architecture-geometry";
import styles from "@/components/pages/product/product.module.css";

const SCOPE_OFFSET = 11;

/** Scope annotation: open at the foot, where the role connector descends. */
function scopeOutline(entity: SecurityEntity): string {
  const { x, y, w, h } = entity.frame;
  return routed(
    [
      [x - SCOPE_OFFSET, y + h + SCOPE_OFFSET],
      [x - SCOPE_OFFSET, y - SCOPE_OFFSET],
      [x + w + SCOPE_OFFSET, y - SCOPE_OFFSET],
      [x + w + SCOPE_OFFSET, y + h + SCOPE_OFFSET],
    ],
    9
  );
}

/**
 * The controlled operating context: one surveyed perimeter holding three entity
 * scopes and the people who work inside them.
 */
export function TenantBoundary({ activeId }: { activeId: SecurityEntityId }) {
  return (
    <svg
      className={styles.securityTenancy__wires}
      viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={styles.securityTenancy__tenantSurvey}
        d={TENANT_PERIMETER}
        pathLength={1}
      />
      <path className={styles.securityTenancy__tenantOutline} d={TENANT_PERIMETER} />

      {securityEntities.map((entity) => {
        const isActive = entity.id === activeId;
        return (
          <g
            key={entity.id}
            data-state={isActive ? "active" : "muted"}
            data-accent={entity.accent}
            className={styles.securityTenancy__scopeGroup}
          >
            <path
              className={styles.securityTenancy__scopeOutline}
              d={scopeOutline(entity)}
              pathLength={1}
            />
            <path
              className={styles.securityTenancy__roleConnector}
              d={roleConnector(entity.frame)}
              pathLength={1}
            />
            <circle
              className={styles.securityTenancy__roleNode}
              cx={centerX(entity.frame)}
              cy={LAYER.roleNodeY}
              r={3.5}
            />
            <circle
              className={styles.securityTenancy__scopeAnchor}
              cx={centerX(entity.frame)}
              cy={bottomY(entity.frame)}
              r={2.5}
            />
          </g>
        );
      })}
    </svg>
  );
}
