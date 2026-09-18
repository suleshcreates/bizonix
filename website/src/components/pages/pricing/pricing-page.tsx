"use client";

import { useState } from "react";
import type { BillingPeriod } from "@/lib/content/pricing/pricing";
import { PricingMotion } from "./pricing-motion";
import { PricingAddOns } from "./sections/pricing-addons";
import { PricingComparison } from "./sections/pricing-comparison";
import { PricingFaq } from "./sections/pricing-faq";
import { PricingHero } from "./sections/pricing-hero";
import { PricingIncluded } from "./sections/pricing-included";
import { PricingTiers } from "./sections/pricing-tiers";
import styles from "@/components/pages/pricing/pricing.module.css";

/**
 * /pricing.
 *
 * Six sections, in one order: hero and billing switch, the three tier cards,
 * the module grid, the trust strip, the add-on rows, the FAQ. The first two
 * carry the page; everything after them is reference material and is built to
 * read that way.
 *
 * This component exists to own one piece of state — the billing period — which
 * the switch writes and the tier cards read. It is the only state on the page
 * that crosses a section boundary, so it is the only reason for a client
 * component this high up. Everything is rendered from static data at module
 * scope, so the whole page still arrives as complete HTML.
 */
export function PricingPage() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  return (
    <div className={styles.pricing__page} data-pricing-page>
      <PricingMotion />

      <PricingHero billing={billing} onBillingChange={setBilling} />
      <PricingTiers billing={billing} />
      <PricingComparison />
      <PricingIncluded />
      <PricingAddOns />
      <PricingFaq />
    </div>
  );
}
