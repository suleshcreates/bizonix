import { FileText } from "lucide-react";
import { recordFields } from "@/lib/content/product/four-pillars-demo-data";
import styles from "@/components/pages/product/product.module.css";

function RecordMetadata() {
  return (
    <dl className={styles.fourPillarsRecord__recordFields}>
      {recordFields.map((field, index) => (
        <div
          key={field.label}
          className={styles.fourPillarsRecord__recordField}
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
    <div className={styles.fourPillarsRecord__recordWrap}>
      <div className={styles.fourPillarsRecord__recordGlow} aria-hidden="true" />

      <article className={styles.fourPillarsRecord__recordCard}>
        <header className={styles.fourPillarsRecord__recordHead}>
          <div className={styles.fourPillarsRecord__recordTitleGroup}>
            <span className={styles.fourPillarsRecord__recordIcon} aria-hidden="true">
              <FileText size={13} strokeWidth={2.1} />
            </span>
            <span className={styles.fourPillarsRecord__recordLabel}>One record</span>
          </div>
          <span className={styles.fourPillarsRecord__recordStatus}>
            <i aria-hidden="true" />
            Context preserved
          </span>
        </header>

        <RecordMetadata />
      </article>
    </div>
  );
}
