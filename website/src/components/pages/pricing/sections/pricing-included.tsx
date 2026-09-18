import { IncludedPlanFoundation } from "./pricing-included-parts/foundation-panel";
import styles from "@/components/pages/pricing/pricing.module.css";

/**
 * The second half of the comparison story.
 *
 * Deliberately close to the grid above rather than a section-sized gap away:
 * the two are read together, and the spacing is what says so.
 */
export function PricingIncluded() {
  return (
    <section
      className={styles.pricing__included}
      aria-labelledby="pricing-included"
    >
      <div className={styles.pricing__shell}>
        <IncludedPlanFoundation />
      </div>
    </section>
  );
}
