import styles from "@/components/pages/product/product.module.css";

export function RecordExplanation() {
  return (
    <div className={styles.fourPillarsRecord__explanation}>
      <h4 className={styles.fourPillarsRecord__explanationTitle}>Unified operating record</h4>
      <p className={styles.fourPillarsRecord__explanationBody}>
        Every pillar updates the same record.
        <br />
        Every change is real-time.
        <br />
        Every team stays aligned.
      </p>
    </div>
  );
}
