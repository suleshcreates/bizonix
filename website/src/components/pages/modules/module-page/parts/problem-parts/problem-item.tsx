import type { ModuleProblem } from "@/lib/content/modules/module-pages/types";
import { ProblemVisual } from "./problem-visual";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * One visual story: number, title, diagram and one concise support line.
 *
 * The column renders in its finished state on the server, so a page without
 * JavaScript — or one asking for reduced motion — is complete rather than
 * empty. `ModuleProblems` takes the element through `onMount` afterwards and
 * writes `data-state` on it; every reveal in this column is a CSS transition
 * keyed off that one attribute, which is what lets the sequence run backwards
 * on scroll-up with no teardown and no second animation path.
 */
export function ModuleProblemItem({
  problem,
  onMount,
}: {
  problem: ModuleProblem;
  onMount: (node: HTMLElement | null) => void;
}) {
  return (
    <article
      ref={onMount}
      className={styles.problems__item}
      data-state="settled"
      data-problem={problem.id}
    >
      <p className={styles.problems__number}>{problem.number}</p>
      <h3 className={styles.problems__itemTitle}>{problem.title}</h3>
      <p className={styles.problems__description}>{problem.description}</p>
      <ProblemVisual visual={problem.visual} />
    </article>
  );
}
