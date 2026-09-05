import Image from "next/image";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * The platform identity. The cube mark appears here and nowhere else in the
 * hero, so the core reads as the single centre of the system.
 */
export function PlatformCore() {
  return (
    <div className={styles.modulesHero__core}>
      <span className={styles.modulesHero__coreHalo} aria-hidden="true" />
      <span className={styles.modulesHero__coreRing} aria-hidden="true" />
      <span className={styles.modulesHero__coreSurface}>
        <span className={styles.modulesHero__coreMark} aria-hidden="true">
          <Image src="/images/shared/brand/icon.svg" alt="" width={40} height={40} priority />
        </span>
        <strong>Bizonix Platform</strong>
        <small>One operating record</small>
      </span>
    </div>
  );
}
