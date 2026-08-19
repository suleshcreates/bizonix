import styles from "../four-pillars-record.module.css";

export function FourPillarsHeader() {
  return (
    <header className={styles.headerLeft}>
      <span className={styles.eyebrow}>Four pillars, one record</span>
      <h2 id="pillars-title" className={styles.title}>
        Everything runs on the{" "}
        <span className={styles.highlight}>same operating record.</span>
      </h2>
      <p className={styles.description}>
        Stock, sales, network, and books — each pillar reads and writes to the
        same unified source of truth.
      </p>
    </header>
  );
}
