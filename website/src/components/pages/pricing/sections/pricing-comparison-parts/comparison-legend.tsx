import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import styles from "@/components/pages/pricing/pricing.module.css";

/**
 * What the two marks mean, and the one way out of the grid.
 *
 * Deliberately a line of text rather than a card: a reader who has just worked
 * through nine rows does not need another panel, and the section already ends
 * on a hairline. The link reuses the page's existing contact route and utm
 * convention.
 */
export function PricingComparisonLegend() {
  return (
    <div className={styles.pricing__cmpLegend} data-reveal="head">
      <p className={styles.pricing__cmpLegendKeys}>
        <span className={styles.pricing__cmpLegendKey}>
          <span className={styles.pricing__yes} aria-hidden="true">
            <Check size={12} strokeWidth={3} />
          </span>
          Included
        </span>
        <span className={styles.pricing__cmpLegendKey}>
          <span className={styles.pricing__no} aria-hidden="true" />
          Not included
        </span>
      </p>

      <p className={styles.pricing__cmpLegendAsk}>
        Need something custom?{" "}
        <Link
          href="/contact?utm_source=pricing-compare"
          className={styles.pricing__cmpLegendLink}
        >
          Talk to our team
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </p>
    </div>
  );
}
