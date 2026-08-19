"use client";

import { LightfallBackground } from "@/components/sections/lightfall-background";
import { HeroInsight } from "./product-hero-parts/hero-insight";
import { HeroInsightConnector } from "./product-hero-parts/hero-insight-connector";
import { ProductHeroCopy } from "./product-hero-parts/product-hero-copy";
import { ProductHeroDashboard } from "./product-hero-parts/product-hero-dashboard";
import styles from "./product-hero.module.css";

export function ProductHero() {
  return (
    <section className={`product-hero ${styles.heroSection}`}>
      {/* Approved data-stream background — do not alter. */}
      <LightfallBackground className="product-hero-lightfall" />

      <div className={styles.shell}>
        <ProductHeroCopy />

        <div className={styles.stage}>
          <div className={styles.stageGlow} aria-hidden="true" />

          <HeroInsightConnector side="left" />
          <HeroInsightConnector side="right" />

          {/* role="img" keeps assistive tech from reading out every demo
              figure in the panel; the label carries the meaning instead. */}
          <div
            className={styles.dashboard}
            role="img"
            aria-label="The Bizonix operations dashboard, showing revenue, order and stock KPIs, sales trend and branch comparison charts, an alerts centre, a live activity feed and inventory intelligence. All figures shown are illustrative."
          >
            <ProductHeroDashboard />
          </div>

          <HeroInsight side="left" />
          <HeroInsight side="right" />
        </div>

        <p className={styles.footLabel}>
          <i className={styles.footRule} aria-hidden="true" />
          Engineered for high-throughput enterprise commerce
          <i
            className={`${styles.footRule} ${styles.footRuleEnd}`}
            aria-hidden="true"
          />
        </p>
      </div>
    </section>
  );
}
