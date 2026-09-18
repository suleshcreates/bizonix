import styles from "@/components/pages/product/product.module.css";

export function PillarsHeader() {
  return (
    <header className={styles.capabilityPillarsGrid__header}>
      <span className={styles.capabilityPillarsGrid__eyebrow}>Four pillars, one record</span>
      <h2 id="pillars-title" className={styles.capabilityPillarsGrid__title}>
        Everything runs on the{" "}
        <span className={styles.capabilityPillarsGrid__highlight}>same operating record.</span>
      </h2>
      <p className={styles.capabilityPillarsGrid__description}>
        Stock, sales, network, and books — each pillar reads and writes to the
        same unified source of truth.
      </p>
    </header>
  );
}
