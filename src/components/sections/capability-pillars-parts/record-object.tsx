import { FileText } from "lucide-react";
import { recordFields } from "@/lib/content/four-pillars-data";
import styles from "../capability-pillars-grid.module.css";

function RecordMetadata() {
  return (
    <dl className={styles.recordFields}>
      {recordFields.map((field, index) => (
        <div
          key={field.label}
          className={styles.recordField}
          style={{ "--i": index } as React.CSSProperties}
        >
          <dt>{field.label}</dt>
          <dd>{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The convergence target. Deliberately a structured business record — not a
 * logo, cube, or database cylinder. All field values are synthetic.
 */
export function RecordObject() {
  return (
    <div className={styles.recordWrap}>
      <div className={styles.recordGlow} aria-hidden="true" />

      <article className={styles.recordCard}>
        <header className={styles.recordHead}>
          <span className={styles.recordIcon} aria-hidden="true">
            <FileText size={15} strokeWidth={2.1} />
          </span>
          <span className={styles.recordLabel}>One record</span>
          <span className={styles.recordStatus}>
            <i aria-hidden="true" />
            Context preserved
          </span>
        </header>

        <RecordMetadata />
      </article>

      <p className={styles.recordCaption}>
        Every pillar writes to the same operating record.
      </p>
    </div>
  );
}
