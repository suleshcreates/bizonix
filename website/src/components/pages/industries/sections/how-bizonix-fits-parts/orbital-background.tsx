import styles from "@/components/pages/industries/industries.module.css";

export function OrbitalBackground() {
  return (
    <div className={styles.howBizonixFits__backdrop} aria-hidden="true">
      <span className={styles.howBizonixFits__backdropDots} />
      <span className={styles.howBizonixFits__backdropGlow} />
    </div>
  );
}
