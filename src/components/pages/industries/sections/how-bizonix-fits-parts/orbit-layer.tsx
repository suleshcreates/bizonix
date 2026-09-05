import { connectionPoints, ecosystemModules } from "@/lib/content/industries/module-data";
import styles from "@/components/pages/industries/industries.module.css";
import { ModuleNode } from "./module-node";

/**
 * The only element that rotates. Everything inside it that carries text
 * counter-rotates by the same amount, so labels stay upright.
 */
export function OrbitLayer({ mappedSlugs }: { mappedSlugs: readonly string[] }) {
  return (
    <div className={styles.howBizonixFits__orbit}>
      <span className={styles.howBizonixFits__orbitRing} aria-hidden="true" />
      <span className={styles.howBizonixFits__orbitRingOuter} aria-hidden="true" />
      <span className={styles.howBizonixFits__orbitRingFar} aria-hidden="true" />
      {connectionPoints.map((angle) => (
        <span
          key={angle}
          className={styles.howBizonixFits__point}
          style={{ "--a": `${angle}deg` } as React.CSSProperties}
          aria-hidden="true"
        />
      ))}
      {ecosystemModules.map((item) => (
        <ModuleNode
          key={item.slug}
          item={item}
          active={mappedSlugs.includes(item.slug)}
        />
      ))}
    </div>
  );
}
