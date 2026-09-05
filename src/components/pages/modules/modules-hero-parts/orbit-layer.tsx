import {
  constellationGeometry as geo,
  constellationNodes,
  ringScales,
} from "@/lib/content/modules/modules-index";
import styles from "@/components/pages/modules/modules.module.css";

const { center, radius } = geo;

/** Curve each connector away from the radial line so paths read as orbits. */
export function connectorPath(angle: number, ring: number) {
  const radians = (angle * Math.PI) / 180;
  const scale = ringScales[ring];
  const x = center.x + Math.cos(radians) * radius.x * scale;
  const y = center.y + Math.sin(radians) * radius.y * scale;

  // Start on the core's edge, not its centre, so nothing draws under the mark.
  const startX = center.x + Math.cos(radians) * (geo.coreRadius + 6);
  const startY = center.y + Math.sin(radians) * (geo.coreRadius + 6);

  const midX = (startX + x) / 2;
  const midY = (startY + y) / 2;
  const bend = 0.22;
  // Perpendicular offset produces a consistent, gentle sweep.
  const controlX = midX - (y - startY) * bend;
  const controlY = midY + (x - startX) * bend;

  return `M ${startX.toFixed(1)} ${startY.toFixed(1)} Q ${controlX.toFixed(1)} ${controlY.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
}

/**
 * Three rings and nine curved connectors. Ring 2 is the structural ring; the
 * inner and outer bands only give the empty space an intentional shape.
 */
export function OrbitLayer() {
  return (
    <svg
      className={styles.modulesHero__orbits}
      viewBox={`0 0 ${geo.viewBox.width} ${geo.viewBox.height}`}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse
        className={styles.modulesHero__ringInner}
        cx={center.x}
        cy={center.y}
        rx={radius.x * ringScales[0]}
        ry={radius.y * ringScales[0]}
      />
      <ellipse
        className={styles.modulesHero__ringMain}
        cx={center.x}
        cy={center.y}
        rx={radius.x * ringScales[1]}
        ry={radius.y * ringScales[1]}
      />
      <ellipse
        className={styles.modulesHero__ringOuter}
        cx={center.x}
        cy={center.y}
        rx={radius.x * ringScales[2]}
        ry={radius.y * ringScales[2]}
      />

      {constellationNodes.map((node, index) => (
        <path
          key={node.slug}
          id={`orbit-${node.slug}`}
          className={styles.modulesHero__connector}
          data-tier={node.tier}
          d={connectorPath(node.angle, node.ring)}
          style={{ "--i": index } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}
