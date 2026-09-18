"use client";

import type { SecurityEntityId } from "@/lib/content/product/security-access-model";
import { getEntity, securityEntities } from "@/lib/content/product/security-access-model";
import { ActionEvent } from "./action-event";
import { ActivePath } from "./active-path";
import { LAYER, px, py } from "./architecture-geometry";
import { PermissionPath } from "./permission-path";
import { RoleMarker } from "./role-marker";
import { SecurityEntityScene } from "./security-entity-scene";
import { TenantBoundary } from "./tenant-boundary";
import styles from "@/components/pages/product/product.module.css";

/**
 * One open spatial environment. Everything inside shares a single coordinate
 * system, so the boundary, the scopes, the people, the permission scale and the
 * action all describe the same operating context instead of sitting in boxes.
 */
export function AccessArchitecture({
  activeId,
  onActivate,
}: {
  activeId: SecurityEntityId;
  onActivate: (id: SecurityEntityId) => void;
}) {
  const active = getEntity(activeId);

  return (
    <div className={styles.securityTenancy__stage}>
      <TenantBoundary activeId={activeId} />

      <p className={styles.securityTenancy__tenantLabel}>
        Brand / tenant
        <span>One controlled operating context</span>
      </p>

      {securityEntities.map((entity) => (
        <span
          key={`${entity.id}-scope`}
          className={styles.securityTenancy__scopeLabel}
          style={{ left: px(entity.frame.x - 5), top: py(entity.frame.y - 11) }}
          data-state={entity.id === activeId ? "active" : "muted"}
          data-accent={entity.accent}
          aria-hidden="true"
        >
          {entity.scopeLabel}
        </span>
      ))}

      {securityEntities.map((entity) => (
        <SecurityEntityScene
          key={entity.id}
          entity={entity}
          state={entity.id === activeId ? "active" : "muted"}
          onActivate={onActivate}
        />
      ))}

      {securityEntities.map((entity) => (
        <RoleMarker
          key={`${entity.id}-role`}
          entity={entity}
          state={entity.id === activeId ? "active" : "muted"}
        />
      ))}

      <PermissionPath entity={active} />
      <ActivePath entity={active} />
      <ActionEvent entity={active} />

      <span
        className={styles.securityTenancy__actionCaption}
        style={{ left: px(LAYER.actionX), top: py(LAYER.actionY - 38) }}
        aria-hidden="true"
      >
        Operational action
      </span>
    </div>
  );
}
