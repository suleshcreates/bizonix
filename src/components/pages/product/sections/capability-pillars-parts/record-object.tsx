import { FileText } from "lucide-react";
import { recordFields } from "@/lib/content/product/four-pillars-data";
import styles from "@/components/pages/product/product.module.css";

function RecordMetadata() {
  return (
    <dl className={styles.capabilityPillarsGrid__recordFields}>
      {recordFields.map((field, index) => (
        <div
          key={field.label}
          className={styles.capabilityPillarsGrid__recordField}
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
    <div className={styles.capabilityPillarsGrid__recordWrap}>
      <div className={styles.capabilityPillarsGrid__recordGlow} aria-hidden="true" />

      <article className={styles.capabilityPillarsGrid__recordCard}>
        <header className={styles.capabilityPillarsGrid__recordHead}>
          <span className={styles.capabilityPillarsGrid__recordIcon} aria-hidden="true">
            <FileText size={15} strokeWidth={2.1} />
          </span>
          <span className={styles.capabilityPillarsGrid__recordLabel}>One record</span>
          <span className={styles.capabilityPillarsGrid__recordStatus}>
            <i aria-hidden="true" />
            Context preserved
          </span>
        </header>

        <RecordMetadata />
      </article>

      <p className={styles.capabilityPillarsGrid__recordCaption}>
        Every pillar writes to the same operating record.
      </p>
    </div>
  );
}
