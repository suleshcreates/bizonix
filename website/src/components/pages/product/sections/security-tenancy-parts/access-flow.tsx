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
import { SecurityEntityScene } from "./security-entity-scene";
import styles from "@/components/pages/product/product.module.css";

/**
 * The same access architecture, recomposed for a phone.
 *
 * The desktop stage is one surveyed plan; a phone cannot read a plan, so the
 * relationship is told as a descent instead — tenant, then the three scopes it
 * contains, then the role in each, then what that role may do, then the one
 * thing it did, then the evidence. Every part reads from the same
 * `securityEntities` the plan does, so this is a second presentation and never
 * a second set of content.
 *
 * Two things carry the argument and are worth protecting in any edit:
 *  - the tenant connects *down* to all three scopes, which is what makes them
 *    read as one controlled context rather than three unrelated places;
 *  - the acting permission connects *down* to the operational action, which is
 *    what makes the action a consequence rather than a neighbouring card. The
 *    connector is positioned from the acting permission's index, so it stays
 *    under the right node when the selected role changes.
 */
export function AccessFlow({
  activeId,
  onActivate,
}: {
  activeId: SecurityEntityId;
  onActivate: (id: SecurityEntityId) => void;
}) {
  const active = getEntity(activeId);
  const actingIndex = permissionScale.findIndex(
    (stop) => stop.id === active.action.permission,
  );

  return (
    <div className={styles.securityTenancy__flow}>
      {/* --------------------------------------------- brand / tenant scope */}
      <div className={styles.securityTenancy__flowTenant}>
        <p className={styles.securityTenancy__flowTenantLabel}>
          Brand / tenant
          <span>One controlled operating context</span>
        </p>
        <span
          className={styles.securityTenancy__flowBranch}
          aria-hidden="true"
        />
      </div>

      <ul className={styles.securityTenancy__flowScopes}>
        {securityEntities.map((entity) => (
          <li
            key={entity.id}
            className={styles.securityTenancy__flowScope}
            data-state={entity.id === activeId ? "active" : "muted"}
          >
            <span className={styles.securityTenancy__flowScopeLabel}>
              {entity.scopeLabel}
            </span>
            <SecurityEntityScene
              entity={entity}
              state={entity.id === activeId ? "active" : "muted"}
              onActivate={onActivate}
              layout="flow"
            />
          </li>
        ))}
      </ul>

      {/* ------------------------------------------------------ role states */}
      <p className={styles.securityTenancy__flowStepLabel}>People &amp; roles</p>
      <ul className={styles.securityTenancy__flowRoles}>
        {securityEntities.map((entity) => (
          <li key={entity.id}>
            <button
              type="button"
              className={styles.securityTenancy__flowRole}
              data-state={entity.id === activeId ? "active" : "muted"}
              aria-pressed={entity.id === activeId}
              onClick={() => onActivate(entity.id)}
            >
              <span className={styles.securityTenancy__flowRoleName}>
                {entity.role.name}
              </span>
              <span className={styles.securityTenancy__flowRoleAccess}>
                {entity.role.access}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* -------------------------------------------------- permission path */}
      <p className={styles.securityTenancy__flowStepLabel}>
        Permissions granted
      </p>
      <ol
        className={styles.securityTenancy__flowPermissions}
        style={
          {
            "--stops": permissionScale.length,
            "--acting": actingIndex,
          } as React.CSSProperties
        }
      >
        {permissionScale.map((stop) => (
          <li key={stop.id} data-state={permissionState(active, stop.id)}>
            <span
              className={styles.securityTenancy__flowPermNode}
              aria-hidden="true"
            />
            {stop.label}
          </li>
        ))}
        {/* The consequence line: from the acting permission down to what it
            produced. Placed on the node's column so it follows the role. */}
        <span
          className={styles.securityTenancy__flowConsequence}
          aria-hidden="true"
        />
      </ol>

      {/* The action it produced. Its label lives inside the card so the
          consequence line has clear space to reach the card's top edge. */}
      <div className={styles.securityTenancy__flowActionWrap}>
        <p className={styles.securityTenancy__flowActionLabel}>
          Operational action
        </p>
        <ActionEvent entity={active} layout="flow" />
      </div>

      {/* ------------------------------------------------------ the evidence */}
      <AuditTrail entity={active} />
    </div>
  );
}
