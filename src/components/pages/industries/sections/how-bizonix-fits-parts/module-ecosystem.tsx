import type { IndustryId } from "@/lib/content/industries/industries";
import { mappedSlugsFor } from "@/lib/content/industries/industry-module-map";
import styles from "@/components/pages/industries/industries.module.css";
import { OrbitLayer } from "./orbit-layer";
import { SystemCore } from "./system-core";

export function ModuleEcosystem({ activeId }: { activeId: IndustryId }) {
  const mapped = mappedSlugsFor(activeId);
  return (
    <div className={styles.howBizonixFits__ecosystem}>
      <div className={styles.howBizonixFits__stage}>
        <OrbitLayer mappedSlugs={mapped} />
        <SystemCore />
      </div>
    </div>
  );
}
