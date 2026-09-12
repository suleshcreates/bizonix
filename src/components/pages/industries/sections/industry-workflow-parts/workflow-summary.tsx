import styles from "@/components/pages/industries/industries.module.css";

export function WorkflowSummary({ labels }: { labels: readonly string[] }) {
  return (
    <div className={styles.industryWorkflowSection__summary}>
      <p>
        One continuous flow. <span>Every action stays connected.</span>
      </p>
      <div aria-hidden="true">
        {labels.map((label, index) => (
          <span key={`${label}-${index}`}>
            {label}
            {index < labels.length - 1 ? <i>→</i> : null}
          </span>
        ))}
      </div>
    </div>
  );
}
