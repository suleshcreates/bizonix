import Image from "next/image";
import styles from "@/components/pages/home/home.module.css";

/**
 * The Bizonix operating core — the quiet centre of the composition.
 * A plain digital card: near-white surface, hairline border, soft shadow and
 * one restrained blue glow. No platform, pedestal or rings.
 */
export function OperatingCore() {
  return (
    <div className={styles.moduleShowcase__core} data-ms-core>
      <span className={styles.moduleShowcase__coreGlow} aria-hidden />
      <figure className={styles.moduleShowcase__coreLogo}>
        <Image
          src="/images/shared/brand/icon.svg"
          alt=""
          width={46}
          height={46}
          priority={false}
        />
      </figure>
      <p className={styles.moduleShowcase__coreName}>Bizonix Operating Core</p>
      <p className={styles.moduleShowcase__coreTraits}>Unified. Connected. Intelligent.</p>
      <p className={styles.moduleShowcase__coreTruth}>
        <i aria-hidden /> One operating truth.
      </p>
    </div>
  );
}
