import styles from "@/components/pages/product/product.module.css";

export function FourPillarsHeader() {
  return (
    <header className={styles.fourPillarsRecord__headerLeft}>
      <span className={styles.fourPillarsRecord__eyebrow}>Four pillars, one record</span>
      <h2 id="pillars-title" className={styles.fourPillarsRecord__title}>
        Everything runs on the{" "}
        <span className={styles.fourPillarsRecord__highlight}>same operating record.</span>
      </h2>
      <p className={styles.fourPillarsRecord__description}>
        Stock, sales, network, and books — each pillar reads and writes to the
        same unified source of truth.
      </p>
    </header>
  );
}
