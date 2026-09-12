import { includedInEveryPlan } from "@/lib/content/pricing/pricing";
import { FoundationItem } from "./foundation-item";
import styles from "@/components/pages/pricing/pricing.module.css";

/**
 * The panel that answers the grid above it.
 *
 * The comparison table spends nine rows on what changes between plans, which
 * is exactly the reading that leaves someone wondering what a lower tier costs
 * them. This says the rest of it does not move — so it is built as one surface
 * rather than four cards. Four cards would invite the same weighing-up the
 * tier cards already handle; these are conditions of the product, not options.
 *
 * The composition is asymmetric on purpose: a narrow editorial column states
 * the claim once, and the wide column carries the four capabilities as parts
 * of a single system. A hairline rail runs behind them at icon height with a
 * node under each one, and one slow signal travels it. That rail is the whole
 * argument in a single line — four things, one foundation, continuously on.
 *
 * No client boundary. The signal is a CSS animation and the hover treatment is
 * a CSS rule, so this stays a server component and ships no JavaScript.
 */
export function IncludedPlanFoundation() {
  return (
    <div className={styles.pricing__foundation} data-reveal="head">
      <div className={styles.pricing__foundationIntro}>
        <p className={styles.pricing__eyebrow}>
          <span className={styles.pricing__eyebrowDot} aria-hidden="true" />
          Included in every plan
        </p>

        {/* Broken after "foundation", not after "stays". A 44px heading needs
            about 410px to hold "The foundation stays" on one line, and the
            editorial column is 340px — the wider column that break assumes
            would have to come out of the four capabilities. Same words, same
            two lines, and the accent still lands on the phrase that carries
            the claim. */}
        <h2
          id="pricing-included"
          className={styles.pricing__foundationTitleMain}
        >
          The foundation
          <br />
          stays <em className={styles.pricing__foundationAccent}>the same.</em>
        </h2>

        <p className={styles.pricing__foundationLede}>
          Core operational, security and data controls are included across every
          Bizonix plan.
        </p>
      </div>

      <div className={styles.pricing__foundationGrid}>
        {/* The rail and its signal are one decorative unit, drawn behind the
            capabilities and clipped to their own track so the moving part can
            never widen the panel. */}
        <span className={styles.pricing__foundationRail} aria-hidden="true" />
        <span className={styles.pricing__foundationPulse} aria-hidden="true">
          <span className={styles.pricing__foundationPulseSweep} />
        </span>

        {includedInEveryPlan.map((item) => (
          <FoundationItem key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}
