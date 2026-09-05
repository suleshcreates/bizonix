import Image from "next/image";
import styles from "@/components/pages/industries/industries.module.css";

export function SystemCore() {
  return (
    <div className={styles.howBizonixFits__core}>
      <span className={styles.howBizonixFits__coreRing} aria-hidden="true" />
      <span className={styles.howBizonixFits__coreRingInner} aria-hidden="true" />
      <Image
        className={styles.howBizonixFits__coreMark}
        src="/images/shared/brand/icon.svg"
        width={54}
        height={54}
        alt=""
      />
      <span className={styles.howBizonixFits__coreLabel}>Bizonix core</span>
    </div>
  );
}
