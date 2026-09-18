import type { ModuleProblem } from "@/lib/content/modules/module-pages/types";
import { ModuleProblemItem } from "./problem-item";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * Three equal columns at desktop width, two on tablet, one on phones. The
 * geometry comes from `repeat(3, minmax(0, 1fr))` rather than per-column
 * widths, so no module can end up with a column wider than its neighbours,
 * and `minmax(0, …)` keeps a long word from pushing a column open.
 */
export function ModuleProblemGrid({
  problems,
  registerItem,
}: {
  problems: readonly ModuleProblem[];
  registerItem: (index: number, node: HTMLElement | null) => void;
}) {
  return (
    <div className={styles.problems__grid}>
      {problems.map((problem, index) => (
        <ModuleProblemItem
          key={problem.id}
          problem={problem}
          onMount={(node) => registerItem(index, node)}
        />
      ))}
    </div>
  );
}
