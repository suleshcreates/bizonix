"use client";

import { LockKeyhole } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { featureSummaries } from "@/lib/content/features/features";
import {
  disciplineRules,
  priceCeiling,
  purchaseSeries,
} from "@/lib/content/features/series-pricing";
import { useStage } from "../use-stage";
import { FeatureMark, RelatedModules } from "./feature-atoms";
import styles from "@/components/pages/features/features.module.css";

const feature = featureSummaries[3];
const inr = new Intl.NumberFormat("en-IN");

/**
 * Feature 04 — series pricing, showcased as a ladder.
 *
 * Full-width and chart-shaped, so it reads differently again from the split
 * viewports either side of it. Every rate on the ladder belongs to one
 * purchase series; switching series re-lays the whole ladder, which is the
 * point — rates are a property of the goods that arrived, not of the person
 * standing at the counter.
 *
 * Bar growth is the product of two numbers: `--w` (the rate, as a fraction of
 * the scale) and `--g` (how far the section has scrolled in). Switching series
 * only changes `--w`, so the CSS transition handles the re-lay for free.
 */
export function SeriesPricing() {
  const { ref } = useStage<HTMLElement>();
  const [activeId, setActiveId] = useState(purchaseSeries[0].id);
  const series =
    purchaseSeries.find((item) => item.id === activeId) ?? purchaseSeries[0];

  return (
    <section
      ref={ref}
      id={feature.id}
      className={styles.seriesPricing__section}
      style={{ "--accent": feature.accent } as CSSProperties}
      aria-labelledby="feature-series-title"
    >
      <span className={styles.seriesPricing__wash} aria-hidden="true" />

      <div className={styles.seriesPricing__shell}>
        <header className={styles.seriesPricing__head}>
          <div>
            <FeatureMark
              index={feature.index}
              discipline={feature.discipline}
              tone={feature.tone}
            />
            <h2 id="feature-series-title">
              One purchase series. One approved set of rates.
            </h2>
          </div>
          <p className={styles.seriesPricing__why}>
            Goods arrive in series, and each series carries its own landed cost.
            Every rate downstream — wholesale, franchise, retail — hangs off
            that one arrival, so a margin is something you can point at rather
            than something you work out afterwards.
          </p>
        </header>

        <div
          className={styles.seriesPricing__picker}
          role="tablist"
          aria-label="Purchase series"
        >
          {purchaseSeries.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === series.id}
              aria-controls="series-ladder"
              className={styles.seriesPricing__chip}
              onClick={() => setActiveId(item.id)}
            >
              <span className={styles.seriesPricing__chipCode}>{item.code}</span>
              <span className={styles.seriesPricing__chipTitle}>{item.title}</span>
            </button>
          ))}
        </div>

        <div className={styles.seriesPricing__ladder} id="series-ladder">
          <div className={styles.seriesPricing__ladderHead}>
            <p className={styles.seriesPricing__ladderTitle}>
              {series.code}
              <span>{series.title}</span>
            </p>
            <p className={styles.seriesPricing__ladderArrival}>{series.arrival}</p>
          </div>

          {series.rungs.map((rung, index) => (
            <div
              key={rung.key}
              className={styles.seriesPricing__rung}
              style={
                {
                  "--w": rung.value / priceCeiling,
                  "--i": index,
                } as CSSProperties
              }
              data-terminal={index === series.rungs.length - 1}
            >
              <div className={styles.seriesPricing__rungLabel}>
                <p>{rung.label}</p>
                <p className={styles.seriesPricing__rungNote}>{rung.note}</p>
              </div>
              <div className={styles.seriesPricing__rungTrack}>
                <span className={styles.seriesPricing__rungFill} aria-hidden="true" />
                <span className={styles.seriesPricing__rungValue}>
                  ₹{inr.format(rung.value)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.seriesPricing__foot}>
          <ul className={styles.seriesPricing__rules}>
            {disciplineRules.map((rule, index) => (
              <li key={rule} style={{ "--i": index } as CSSProperties}>
                {rule}
              </li>
            ))}
          </ul>

          <div className={styles.seriesPricing__block}>
            <p className={styles.seriesPricing__blockHead}>
              <LockKeyhole size={14} aria-hidden="true" />
              Below floor
            </p>
            <p className={styles.seriesPricing__blockBody}>
              A counter trying to bill under the approved rate is stopped where
              it happens, and the override is recorded against the person who
              had the authority to give it.
            </p>
          </div>
        </div>

        <RelatedModules id={feature.id} tone={feature.tone} />
      </div>
    </section>
  );
}
