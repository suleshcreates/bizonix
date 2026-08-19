import styles from "../four-pillars-record.module.css";

export function RecordExplanation() {
  return (
    <div className={styles.explanation}>
      <h4 className={styles.explanationTitle}>Unified operating record</h4>
      <p className={styles.explanationBody}>
        Every pillar updates the same record.
        <br />
        Every change is real-time.
        <br />
        Every team stays aligned.
      </p>
    </div>
  );
}
