import type { ProblemSectionData } from "@/lib/content/modules/module-pages/types";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * What the three problems cost when they stand together.
 *
 * Deliberately not a proof band: no logo, no customer, no figure. Every item
 * is a qualitative operational consequence, because the honest answer to
 * "what does this cost" here is time and confidence, not a percentage the
 * business has never measured.
 */
export function ConsequenceBand({
  consequence,
}: {
  consequence: ProblemSectionData["consequence"];
}) {
  return (
    <div className={styles.problems__consequence}>
      <p className={styles.problems__consequenceTitle}>{consequence.title}</p>
      <ul className={styles.problems__consequenceItems}>
        {consequence.items.map((item, index) => (
          <li
            key={item.id}
            className={styles.problems__consequenceItem}
            style={{ "--s": index } as React.CSSProperties}
          >
            <p className={styles.problems__consequenceLabel}>
              <span className={styles.problems__consequenceDot} aria-hidden="true" />
              {item.label}
            </p>
            <p className={styles.problems__consequenceBody}>{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
