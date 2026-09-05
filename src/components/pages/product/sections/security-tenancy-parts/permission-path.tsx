import type { SecurityEntity } from "@/lib/content/product/security-access-model";
import { permissionScale } from "@/lib/content/product/security-access-model";
import { LAYER, STAGE, px, py } from "./architecture-geometry";
import styles from "@/components/pages/product/product.module.css";

/**
 * One shared permission scale for the whole tenant. The active role does not get
 * its own list — it simply emphasises the stops it is granted, which is what
 * makes the difference between roles readable at a glance.
 */
export function PermissionPath({ entity }: { entity: SecurityEntity }) {
  const stateOf = (id: (typeof permissionScale)[number]["id"]) => {
    if (entity.action.permission === id) return "acting";
    return entity.permissions.includes(id) ? "granted" : "withheld";
  };

  return (
    <div className={styles.securityTenancy__permissionLayer} data-accent={entity.accent}>
      <svg
        className={styles.securityTenancy__wires}
        viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
        aria-hidden="true"
        focusable="false"
      >
        <line
          className={styles.securityTenancy__permissionRule}
          x1={LAYER.permissionStartX}
          y1={LAYER.permissionY}
          x2={LAYER.permissionEndX}
          y2={LAYER.permissionY}
          pathLength={1}
        />
        {permissionScale.map((stop) => (
          <g key={stop.id} data-state={stateOf(stop.id)} className={styles.securityTenancy__permissionNode}>
            <circle
              className={styles.securityTenancy__permissionHalo}
              cx={stop.x}
              cy={LAYER.permissionY}
              r={9}
            />
            <circle
              className={styles.securityTenancy__permissionDot}
              cx={stop.x}
              cy={LAYER.permissionY}
              r={4}
            />
          </g>
        ))}
      </svg>

      <p className={styles.securityTenancy__permissionCaption}>
        Permissions granted — <b>{entity.role.name}</b>
      </p>

      <ul className={styles.securityTenancy__permissionLabels}>
        {permissionScale.map((stop) => (
          <li
            key={stop.id}
            className={styles.securityTenancy__permissionLabel}
            style={{ left: px(stop.x), top: py(LAYER.permissionY - 13) }}
            data-state={stateOf(stop.id)}
          >
            {stop.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
