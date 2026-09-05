import type { EcosystemModule } from "@/lib/content/industries/module-data";
import styles from "@/components/pages/industries/industries.module.css";

/**
 * Three nested elements on purpose:
 *   .node        static placement on the orbit
 *   .nodeSpin    counter-rotation, so the label stays upright
 *   .nodeSurface hover scale
 * Splitting them keeps the counter-rotation animation and the hover
 * transform off the same element, where they would otherwise fight.
 */
export function ModuleNode({
  item,
  active,
}: {
  item: EcosystemModule;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <div
      className={styles.howBizonixFits__node}
      style={
        { "--x": `${item.x}%`, "--y": `${item.y}%` } as React.CSSProperties
      }
    >
      <div className={styles.howBizonixFits__nodeSpin}>
        <div
          className={styles.howBizonixFits__nodeSurface}
          data-active={active ? "true" : "false"}
        >
          <Icon size={14} strokeWidth={2.1} aria-hidden="true" />
          <span>{item.title}</span>
        </div>
      </div>
    </div>
  );
}
