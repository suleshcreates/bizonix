import { Check, ChevronRight } from "lucide-react";
import type { ModuleRow, PricingTier } from "@/lib/content/pricing/pricing";
import { PricingModuleDetail } from "./module-detail";
import styles from "@/components/pages/pricing/pricing.module.css";

/**
 * One module: its identity row, and the detail it opens into.
 *
 * The pair is wrapped in its own `<tbody>`. A table may hold any number of
 * them, it changes nothing about how the grid reads at desktop width, and it
 * gives the phone layout — where the table is recomposed into a stack — a
 * single element per module to draw a separator between. Without it, a module
 * and its own detail would be two unrelated blocks.
 *
 * Only the `<tr>` carries a click handler. The `<button>` inside the row header
 * is the real control: it holds `aria-expanded` and `aria-controls`, and it is
 * what a keyboard reaches. Pressing it with Enter or Space dispatches a click
 * that bubbles to this same handler, so pointer and keyboard converge on one
 * path instead of two that can disagree.
 */
export function PricingComparisonRow({
  module,
  tiers,
  open,
  onToggle,
  ids,
}: {
  module: ModuleRow;
  tiers: readonly PricingTier[];
  open: boolean;
  onToggle: (slug: string) => void;
  ids: { trigger: string; panel: string; label: string };
}) {
  const Icon = module.icon;

  return (
    <tbody className={styles.pricing__cmpGroup}>
      <tr
        className={styles.pricing__cmpRow}
        data-open={open}
        data-reveal="row"
        onClick={() => onToggle(module.slug)}
      >
        <th scope="row" className={styles.pricing__cmpModuleCell}>
          <button
            type="button"
            id={ids.trigger}
            className={styles.pricing__cmpTrigger}
            aria-expanded={open}
            aria-controls={ids.panel}
          >
            <span className={styles.pricing__cmpModuleIcon} aria-hidden="true">
              <Icon size={16} strokeWidth={1.9} />
            </span>
            <span className={styles.pricing__cmpModuleText}>
              <span className={styles.pricing__cmpModuleName} id={ids.label}>
                {module.name}
              </span>
              <span className={styles.pricing__cmpModuleDesc}>
                {module.outcome}
              </span>
            </span>
            <span className={styles.pricing__cmpChevron} aria-hidden="true">
              <ChevronRight size={16} strokeWidth={2.4} />
            </span>
          </button>
        </th>

        {tiers.map((tier) => {
          const included = module.availability[tier.id];
          return (
            <td
              key={tier.id}
              className={styles.pricing__cmpCell}
              data-plan={tier.id}
              data-featured={Boolean(tier.featured)}
            >
              {/* Display:none at desktop, where `scope="col"` already carries
                  the plan name — so it is out of the accessibility tree there
                  and cannot double-announce. The phone layout drops the header
                  row, and with it the column association, so this becomes the
                  visible and announced carrier of which plan the mark is for.
                  The tree tracks the visual state at both widths. */}
              <span className={styles.pricing__cmpCellPlan}>{tier.name}</span>

              {included ? (
                <span className={styles.pricing__yes} aria-hidden="true">
                  <Check size={13} strokeWidth={3} />
                </span>
              ) : (
                <span className={styles.pricing__no} aria-hidden="true" />
              )}

              <span className={styles.pricing__srOnly}>
                {included ? "Included" : "Not included"}
              </span>
            </td>
          );
        })}
      </tr>

      <tr className={styles.pricing__cmpDetailRow} data-open={open}>
        <td colSpan={tiers.length + 1}>
          <div className={styles.pricing__cmpDetailGrid}>
            <div className={styles.pricing__cmpDetailClip}>
              <PricingModuleDetail
                module={module}
                panelId={ids.panel}
                labelId={ids.label}
              />
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  );
}
