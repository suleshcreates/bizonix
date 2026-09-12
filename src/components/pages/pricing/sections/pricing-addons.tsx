import Link from "next/link";
import { addOns, CONTACT_PRICE } from "@/lib/content/pricing/pricing";
import styles from "@/components/pages/pricing/pricing.module.css";

/**
 * Optional extras, as rows.
 *
 * Deliberately the lightest construction on the page: hairline dividers, no
 * border, no shadow, no card. Add-ons are a second decision taken after the
 * plan is chosen, and giving them card weight would put them in competition
 * with the tier cards they are supposed to follow.
 *
 * Renders on the server — nothing here reacts to the billing toggle, because
 * add-ons are quoted at their own cadence rather than folded into the plan.
 */
export function PricingAddOns() {
  return (
    <section className={styles.pricing__addons} aria-labelledby="pricing-addons">
      <div className={styles.pricing__shell}>
        <header className={styles.pricing__sectionHead}>
          <p className={styles.pricing__eyebrow} data-reveal="head">
            <span className={styles.pricing__eyebrowDot} aria-hidden="true" />
            Add-ons
          </p>
          <h2 id="pricing-addons" data-reveal="head">
            Extend a plan without changing it
          </h2>
          <p data-reveal="head">
            Take a single module or another entity onto the plan you already
            have. Priced per item so a growing operation does not have to jump a
            whole tier to add one store.
          </p>
        </header>

        <div className={styles.pricing__addonList}>
          {addOns.map((addOn) => (
            <div key={addOn.id} className={styles.pricing__addonRow} data-reveal="faq">
              <div>
                <h3 className={styles.pricing__addonName}>{addOn.name}</h3>
                <p className={styles.pricing__addonBody}>{addOn.body}</p>
              </div>
              {/* Withheld on the same terms as the tier cards: the add-on
                  rate slots are unsettled commercial inputs and stay
                  server-side. The card price line and this one therefore read
                  identically — "Contact sales" — rather than a mask here and a
                  sentence there. The cadence below it is a cycle, not an
                  amount, so it stays. */}
              <p className={styles.pricing__addonPrice}>
                <span className={styles.pricing__srOnly}>
                  Additional charge.{" "}
                </span>
                <span data-contact="true">{CONTACT_PRICE}</span>
                <span className={styles.pricing__addonCadence}>
                  {addOn.cadence}
                </span>
              </p>
            </div>
          ))}
        </div>

        <p className={styles.pricing__addonFoot} data-reveal="faq">
          Add-ons are billed on the same cycle as your plan.{" "}
          <Link href="/contact?utm_source=pricing-addons">
            Ask about a combination
          </Link>{" "}
          if you need something that is not listed.
        </p>
      </div>
    </section>
  );
}
