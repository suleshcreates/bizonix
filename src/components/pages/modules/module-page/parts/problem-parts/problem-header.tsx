import type { ProblemSectionData } from "@/lib/content/modules/module-pages/types";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * The editorial header: eyebrow, the module's own problem headline, one line
 * of framing. Entirely data-driven — nothing here knows which module it is
 * introducing.
 */
export function ModuleProblemHeader({
  data,
  headingId,
}: {
  data: Pick<ProblemSectionData, "eyebrow" | "title" | "intro">;
  headingId: string;
}) {
  return (
    <header className={styles.problems__head}>
      <p
        className={`${styles.problems__eyebrow} ${styles.problems__headItem}`}
        style={{ "--s": 0 } as React.CSSProperties}
      >
        <span className={styles.problems__eyebrowDot} aria-hidden="true" />
        {data.eyebrow}
      </p>
      <h2
        id={headingId}
        className={`${styles.problems__title} ${styles.problems__headItem}`}
        style={{ "--s": 1 } as React.CSSProperties}
      >
        {data.title}
      </h2>
      <p
        className={`${styles.problems__intro} ${styles.problems__headItem}`}
        style={{ "--s": 2 } as React.CSSProperties}
      >
        {data.intro}
      </p>
    </header>
  );
}
