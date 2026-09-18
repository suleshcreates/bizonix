"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Building2, Check, Store, Warehouse } from "lucide-react";
import Link from "next/link";
import {
  CONTACT_PRICE,
  pricingTiers,
  type BillingPeriod,
  type PricingTier,
} from "@/lib/content/pricing/pricing";
import styles from "@/components/pages/pricing/pricing.module.css";

const TIER_ICONS = {
  starter: Store,
  growth: Building2,
  enterprise: Warehouse,
} as const;

function TierCard({
  tier,
  billing,
}: {
  tier: PricingTier;
  billing: BillingPeriod;
}) {
  const reduced = useReducedMotion();
  const featured = Boolean(tier.featured);
  const TierIcon = TIER_ICONS[tier.id];

  return (
    <div data-reveal="tier" className={styles.pricing__tierSlot}>
      <motion.div
        className={styles.pricing__tierCard}
        data-featured={featured}
        whileHover={reduced ? undefined : { y: -6 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {featured ? (
          <span className={styles.pricing__tierGlow} aria-hidden="true" />
        ) : null}

        {tier.badge ? (
          <span className={styles.pricing__tierBadge}>{tier.badge}</span>
        ) : null}

        <div className={styles.pricing__tierIntro}>
          <span
            className={styles.pricing__tierIcon}
            data-tier={tier.id}
            aria-hidden="true"
          >
            <TierIcon size={27} strokeWidth={2.2} />
          </span>
          <div>
            <h3 className={styles.pricing__tierName}>{tier.name}</h3>
            <p className={styles.pricing__tierAudience}>{tier.audience}</p>
          </div>
        </div>

        {/* One price state across all three cards. `contact` is real text
            rather than a mask, so it is read as written by assistive
            technology and there is nothing decorative to hide from it. */}
        <div className={styles.pricing__tierPriceRow}>
          {tier.price.kind === "contact" ? (
            <span className={styles.pricing__tierPrice} data-contact="true">
              {CONTACT_PRICE}
            </span>
          ) : (
            <span className={styles.pricing__tierPrice}>
              {tier.price.label}
            </span>
          )}
          <span className={styles.pricing__tierUnit}>
            {tier.unit ? tier.unit[billing] : ""}
          </span>
        </div>

        <p className={styles.pricing__tierNote}>{tier.note}</p>

        <Link
          href={tier.cta.href}
          className={styles.pricing__tierCta}
          data-variant={featured ? "primary" : "secondary"}
        >
          {tier.cta.label}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>

        <ul className={styles.pricing__tierIncludes}>
          {tier.inclusions.map((item) => (
            <li key={item}>
              <span className={styles.pricing__tierCheck} aria-hidden="true">
                <Check size={11} strokeWidth={3.2} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <span className={styles.pricing__tierSpacer} aria-hidden="true" />
      </motion.div>
    </div>
  );
}

export function PricingTiers({ billing }: { billing: BillingPeriod }) {
  return (
    <section className={styles.pricing__tiers} aria-labelledby="pricing-plans">
      <div className={styles.pricing__shell}>
        <h2 id="pricing-plans" className={styles.pricing__srOnly}>
          Plans
        </h2>
        <div className={styles.pricing__tierGrid}>
          {pricingTiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} billing={billing} />
          ))}
        </div>
      </div>
    </section>
  );
}
