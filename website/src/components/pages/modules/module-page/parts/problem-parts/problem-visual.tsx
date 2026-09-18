import type { ProblemVisualId } from "@/lib/content/modules/module-pages/types";
import styles from "@/components/pages/modules/modules.module.css";
import { problemVisualRegistry } from "./visual-registry";

/**
 * Resolves a problem's `visual` identifier to its diagram.
 *
 * The surface is decorative by contract: the column's heading, description and
 * quote already carry the meaning, so the drawing is hidden from assistive
 * technology rather than described twice.
 *
 * A missing entry is a development error, not a runtime fallback. The registry
 * is typed against the identifier union so this cannot happen through data
 * alone, but the guard catches a registry edited in the wrong direction and
 * says which identifier failed instead of rendering an empty column.
 */
export function ProblemVisual({ visual }: { visual: ProblemVisualId }) {
  const Visual = problemVisualRegistry[visual];

  if (!Visual) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(
        `No problem visual registered for "${visual}". Add it to problemVisualRegistry.`,
      );
    }
    return null;
  }

  return (
    <div className={styles.problems__visual} aria-hidden="true">
      <Visual />
    </div>
  );
}
