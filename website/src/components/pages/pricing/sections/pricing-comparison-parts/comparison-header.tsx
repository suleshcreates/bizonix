import styles from "@/components/pages/pricing/pricing.module.css";

/**
 * Eyebrow, heading and intro for the comparison section.
 *
 * The heading is the one place on this light surface that spends colour, and it
 * spends it on a single word. `runs` is wrapped in an `<em>` carrying the
 * site's established light-surface accent — the same blue → teal ramp the
 * about page uses on its section titles — with `font-style: normal` so the
 * emphasis reads as colour rather than as italics.
 *
 * Copy is unchanged from the approved section text.
 */
export function PricingComparisonHeader() {
  return (
    <header className={styles.pricing__cmpHead}>
      <p className={styles.pricing__eyebrow} data-reveal="head">
        <span className={styles.pricing__eyebrowDot} aria-hidden="true" />
        Compare
      </p>

      <h2
        id="pricing-compare"
        className={styles.pricing__cmpTitle}
        data-reveal="head"
      >
        What each plan <em className={styles.pricing__cmpAccent}>runs</em>
      </h2>

      <p className={styles.pricing__cmpLede} data-reveal="head">
        All nine modules, against the three plans. Stock, purchasing, billing,
        books and access control are in every tier {"—"} the modules that
        separate them are the ones that describe a bigger operation.
      </p>
    </header>
  );
}
