"use client";

import type { SecurityEntityId } from "@/lib/content/product/security-access-model";
import {
  getEntity,
  permissionScale,
  permissionState,
  securityEntities,
} from "@/lib/content/product/security-access-model";
import { ActionEvent } from "./action-event";
import { AuditTrail } from "./audit-trail";
import { RoleMarker } from "./role-marker";
import { SecurityEntityScene } from "./security-entity-scene";
import styles from "@/components/pages/product/product.module.css";

/**
 * The same architecture told vertically for narrow screens:
 * brand → entity → role → permission → action → audit, threaded on one rail.
 * The three environments stay a scrollable gallery so the section never
 * collapses into a stack of cards.
 */
export function AccessFlow({
  activeId,
  onActivate,
}: {
  activeId: SecurityEntityId;
  onActivate: (id: SecurityEntityId) => void;
}) {
  const active = getEntity(activeId);

  return (
    <div className={styles.securityTenancy__flow}>
      <p className={styles.securityTenancy__flowTenant}>
        Brand / tenant
        <span>One controlled operating context</span>
      </p>

      <div className={styles.securityTenancy__flowGallery}>
        {securityEntities.map((entity) => (
          <div key={entity.id} className={styles.securityTenancy__flowGalleryItem}>
            <span
              className={styles.securityTenancy__flowScopeLabel}
              data-state={entity.id === activeId ? "active" : "muted"}
              data-accent={entity.accent}
            >
              {entity.scopeLabel}
            </span>
            <SecurityEntityScene
              entity={entity}
              state={entity.id === activeId ? "active" : "muted"}
              onActivate={onActivate}
              layout="flow"
            />
          </div>
        ))}
      </div>

      <ol className={styles.securityTenancy__flowRail}>
        <li className={styles.securityTenancy__flowStep}>
          <span className={styles.securityTenancy__flowStepLabel}>People &amp; roles</span>
          <RoleMarker entity={active} state="active" layout="flow" />
        </li>

        <li className={styles.securityTenancy__flowStep}>
          <span className={styles.securityTenancy__flowStepLabel}>Permissions granted</span>
          <ul className={styles.securityTenancy__flowPermissions}>
            {permissionScale.map((stop) => (
              <li key={stop.id} data-state={permissionState(active, stop.id)}>
                {stop.label}
              </li>
            ))}
          </ul>
        </li>

        <li className={styles.securityTenancy__flowStep}>
          <span className={styles.securityTenancy__flowStepLabel}>Operational action</span>
          <ActionEvent entity={active} layout="flow" />
        </li>

        <li className={styles.securityTenancy__flowStep}>
          <AuditTrail entity={active} />
        </li>
      </ol>
    </div>
  );
}
