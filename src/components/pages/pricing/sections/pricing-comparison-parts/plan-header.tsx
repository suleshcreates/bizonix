import type { PricingTier } from "@/lib/content/pricing/pricing";
import styles from "@/components/pages/pricing/pricing.module.css";

/**
 * One column header in the comparison grid.
 *
 * A plan is an identity, not a label, so the cell carries the tier name, the
 * short form of its approved audience line, and — for the one featured tier —
 * the same "Most popular" badge the tier card uses. The badge sits inside the
 * cell rather than floating above the table: the header row is sticky, and
 * anything absolutely positioned outside it detaches the moment the header
 * pins.
 *
 * `data-plan` is what the column hover styling selects on; it is written
 * identically here and on every body cell so one attribute on the table can
 * light a whole column.
 */
export function PricingPlanHeader({ tier }: { tier: PricingTier }) {
  const featured = Boolean(tier.featured);

  return (
    <th scope="col" data-plan={tier.id} data-featured={featured}>
      <span className={styles.pricing__cmpPlanInner}>
        {featured && tier.badge ? (
          <span className={styles.pricing__cmpPlanBadge}>{tier.badge}</span>
        ) : null}
        <span className={styles.pricing__cmpPlanName}>{tier.name}</span>
        <span className={styles.pricing__cmpPlanAudience}>
          {tier.shortAudience}
        </span>
      </span>
    </th>
  );
}
