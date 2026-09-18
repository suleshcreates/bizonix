import {
  constellationNodes,
  constellationZones,
} from "@/lib/content/modules/modules-index";
import { ModuleNode } from "./module-node";
import { OrbitLayer } from "./orbit-layer";
import { PlatformCore } from "./platform-core";
import { SignalLayer } from "./signal-layer";
import styles from "@/components/pages/modules/modules.module.css";

/** One core, three rings, nine modules. Nothing else lives in this figure. */
export function ModulesConstellation() {
  return (
    <figure
      className={styles.modulesHero__constellation}
      aria-labelledby="constellation-caption"
    >
      <span className={styles.modulesHero__constellationGrid} aria-hidden="true" />
      <div className={styles.modulesHero__rotatingSystem}>
        <OrbitLayer />
        <SignalLayer />

        {constellationZones.map((zone) => (
          <span
            key={zone.id}
            className={styles.modulesHero__zone}
            aria-hidden="true"
            style={
              {
                "--left": `${zone.left}%`,
                "--top": `${zone.top}%`,
              } as React.CSSProperties
            }
          >
            {zone.label}
          </span>
        ))}

        {constellationNodes.map((node, index) => (
          <ModuleNode key={node.slug} node={node} index={index} />
        ))}
      </div>
      <PlatformCore />

      <figcaption id="constellation-caption" className={styles.modulesHero__srOnly}>
        Nine Bizonix operating modules — inventory, procurement, sales and POS,
        wholesale, franchise, accounting, ecommerce, analytics and security —
        connected to one central platform record.
      </figcaption>
    </figure>
  );
}
