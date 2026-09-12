"use client";

import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import type { BillingPeriod } from "@/lib/content/pricing/pricing";
import { HeroSphereLeft } from "./pricing-hero-parts/hero-sphere-left";
import { HeroSphereRight } from "./pricing-hero-parts/hero-sphere-right";
import styles from "@/components/pages/pricing/pricing.module.css";

const OPTIONS: readonly { id: BillingPeriod; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual" },
];

export function PricingHero({
  billing,
  onBillingChange,
}: {
  billing: BillingPeriod;
  onBillingChange: (next: BillingPeriod) => void;
}) {
  const reduced = useReducedMotion();

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    onBillingChange(billing === "monthly" ? "annual" : "monthly");
  };

  return (
    <section className={styles.pricing__hero} aria-labelledby="pricing-title">
      <span className={styles.pricing__heroField} aria-hidden="true" />
      <span className={styles.pricing__heroGlow} aria-hidden="true" />

      {/* Background: two spheres, and nothing else. CSS places and scales
          each one — a square box in vw, so the body stays a true circle at
          every viewport — and the SVG inside each renders the volume: a radial
          gradient lit off-centre, a masked silhouette that never lands on a
          hard edge, and surface geometry clipped to the body and dimmed by the
          same light that shapes it. The rim and the signal belong to the right
          sphere alone; there are no free-floating arcs in this hero. */}
      <div className={styles.pricing__spheres} aria-hidden="true">
        <HeroSphereLeft />
        <HeroSphereRight />
      </div>

      <div className={`${styles.pricing__shell} ${styles.pricing__heroShell}`}>
        <div className={styles.pricing__heroCopy}>
          <p className={styles.pricing__heroEyebrow} data-reveal="hero">
            <span className={styles.pricing__eyebrowDot} aria-hidden="true" />
            Pricing
          </p>

          <h1
            id="pricing-title"
            className={styles.pricing__heroTitle}
            data-reveal="hero"
          >
            Pay for the operation you run,
            <span className={styles.pricing__heroAccent}>
              not the software.
            </span>
          </h1>

          <p className={styles.pricing__heroLede} data-reveal="hero">
            Priced on operating entities and users {"\u2014"} never on
            transaction volume,
            <br className={styles.pricing__heroLineBreak} /> so a good season
            never costs you more to record.
          </p>

          <div data-reveal="hero">
            <LayoutGroup id="pricing-billing">
              <div
                className={styles.pricing__toggle}
                role="radiogroup"
                aria-label="Billing period"
                onKeyDown={onKeyDown}
              >
                {OPTIONS.map((option) => {
                  const active = billing === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      tabIndex={active ? 0 : -1}
                      data-active={active}
                      className={styles.pricing__toggleOption}
                      onClick={() => onBillingChange(option.id)}
                    >
                      {active ? (
                        <motion.span
                          layoutId="pricing-billing-pill"
                          className={styles.pricing__togglePill}
                          aria-hidden="true"
                          transition={
                            reduced
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 420, damping: 34 }
                          }
                        />
                      ) : null}
                      <span className={styles.pricing__toggleLabel}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
          </div>
        </div>
      </div>

      {/* The navy → white seam. One cubic curve across the full width: the
          light page starts a little higher at both edges and reaches its
          lowest point behind the middle tier card, so the boundary reads as a
          shallow architectural cut rather than a wave. preserveAspectRatio
          "none" lets the single path stretch to any width while the element's
          height — and therefore the depth of the dip — is set in CSS. */}
      <svg
        className={styles.pricing__seam}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className={styles.pricing__seamShape}
          d="M0 4 C 470 92, 970 92, 1440 4 L1440 120 L0 120 Z"
        />
      </svg>
    </section>
  );
}
