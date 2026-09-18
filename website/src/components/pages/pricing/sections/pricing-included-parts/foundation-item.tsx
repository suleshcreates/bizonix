import type { IncludedItem } from "@/lib/content/pricing/pricing";
import styles from "@/components/pages/pricing/pricing.module.css";

/**
 * One capability on the foundation.
 *
 * Not a control. It has no href, no handler and no tabindex, so it is never
 * announced as something to activate and never lands in the tab order — the
 * hover treatment is emphasis, and everything it reveals is already on screen
 * for a reader who never points at it.
 *
 * The node that sits on the foundation rail is drawn by CSS from this element,
 * because it has to line up with this item's icon rather than with an even
 * division of the row.
 */
export function FoundationItem({ item }: { item: IncludedItem }) {
  const Icon = item.icon;

  return (
    <div className={styles.pricing__foundationItem}>
      <span className={styles.pricing__foundationIcon} aria-hidden="true">
        <Icon size={17} strokeWidth={1.9} />
      </span>
      <h3 className={styles.pricing__foundationTitle}>{item.title}</h3>
      <p className={styles.pricing__foundationBody}>{item.body}</p>
    </div>
  );
}
