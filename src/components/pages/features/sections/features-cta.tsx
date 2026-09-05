"use client";

import { ArrowRight, Layers } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { featureSummaries } from "@/lib/content/features/features";
import { useStage } from "../use-stage";
import styles from "@/components/pages/features/features.module.css";

/**
 * The close: five features, one record.
 *
 * Five strands are drawn from the top of the band down into a single token as
 * the section scrolls in — the same argument the modules page makes about nine
 * modules, made here about the details underneath them. Each strand keeps its
 * feature's accent so the eye can trace it back up the page.
 */
export function FeaturesCta() {
  const { ref } = useStage<HTMLElement>();
  const count = featureSummaries.length;

  return (
    <section
      ref={ref}
      className={styles.featuresCta__section}
      aria-labelledby="features-cta-title"
    >
      <span className={styles.featuresCta__glow} aria-hidden="true" />

      <div className={styles.featuresCta__shell}>
        <div className={styles.featuresCta__converge} aria-hidden="true">
          <svg viewBox="0 0 800 220" preserveAspectRatio="none">
            {featureSummaries.map((feature, index) => {
              const x = 60 + (index * 680) / (count - 1);
              return (
                <path
                  key={feature.id}
                  d={`M${x} 0 C ${x} 110, 400 110, 400 220`}
                  pathLength={1}
                  style={
                    {
                      "--accent": feature.accent,
                      "--i": index,
                    } as CSSProperties
                  }
                />
              );
            })}
          </svg>
          <ul className={styles.featuresCta__strandLabels}>
            {featureSummaries.map((feature) => (
              <li
                key={feature.id}
                style={{ "--accent": feature.accent } as CSSProperties}
              >
                {feature.discipline}
              </li>
            ))}
          </ul>
          <span className={styles.featuresCta__token}>
            <Layers size={15} aria-hidden="true" />
            One record
          </span>
        </div>

        <h2 id="features-cta-title">
          Five details. One record. Nothing to reconcile.
        </h2>
        <p className={styles.featuresCta__lede}>
          Bring your own workflow to the demo — a purchase series you argue
          about, a counter that never balances, a transfer that went missing. We
          will run it on Bizonix rather than talk around it.
        </p>

        <div className={styles.featuresCta__actions}>
          <Link
            className={styles.featuresCta__primary}
            href="/contact?utm_source=features-cta"
          >
            Book a demo
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className={styles.featuresCta__secondary} href="/modules">
            See the modules these run in
          </Link>
        </div>
      </div>
    </section>
  );
}
