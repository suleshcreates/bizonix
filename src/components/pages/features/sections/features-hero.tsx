"use client";

import { useCallback, type CSSProperties } from "react";
import type { FeatureId } from "@/lib/content/features/features";
import {
  featureById,
  heroFeatures,
} from "@/lib/content/features/features-hero-data";
import { FeatureCallout } from "./features-hero-parts/feature-callout";
import { HeroBackground } from "./features-hero-parts/hero-background";
import { HeroCopy } from "./features-hero-parts/hero-copy";
import { HeroWires } from "./features-hero-parts/hero-wires";
import { ProductSimulation } from "./features-hero-parts/product-simulation";
import { useLayerCycle } from "./features-hero-parts/use-layer-cycle";
import styles from "@/components/pages/features/features.module.css";

/**
 * /features hero — one Bizonix operating screen with five capabilities wired
 * into it.
 *
 * Three layers: the dark technical environment, the central screen, and five
 * callouts arranged around it — two above its shoulders, two below, one
 * centred underneath — each joined to the screen by a hairline connector. The
 * screen is the source; the cards are what runs off it. One capability is
 * emphasised at a time so the wiring reads as live, and pointing at a card
 * takes it.
 *
 * The composition is one bounded grid. The screen and all five cards are
 * tracks in `.stage`, and the connector layer draws itself from their
 * measured boxes, so nothing here is positioned against the viewport and
 * nothing can leave the container.
 *
 * This file is the shell only: background, copy, screen, callouts, connectors
 * and the emphasis controller each live in their own module beside it.
 */
export function FeaturesHero({
  initialFeature,
}: {
  initialFeature?: FeatureId;
}) {
  const initialIndex = Math.max(
    0,
    heroFeatures.findIndex((item) => item.id === initialFeature),
  );
  const { active, preview, release } = useLayerCycle(
    heroFeatures.length,
    initialIndex,
    !initialFeature,
  );
  const routeFeature = initialFeature ? featureById[initialFeature] : undefined;
  const feature = routeFeature ?? heroFeatures[active];

  const indexOf = (id: string) =>
    heroFeatures.findIndex((item) => item.id === id);
  const onEnter = useCallback(
    (id: string) => {
      if (!routeFeature) preview(indexOf(id));
    },
    [preview, routeFeature],
  );
  const onLeave = useCallback(() => {
    if (!routeFeature) release();
  }, [release, routeFeature]);

  return (
    <section
      className={styles.featuresHero__hero}
      aria-labelledby="features-title"
      style={
        {
          "--feature-accent": feature.accent,
          "--feature-ambient": feature.ambient,
        } as CSSProperties
      }
    >
      <HeroBackground />

      <div className={styles.featuresHero__shell}>
        <HeroCopy feature={routeFeature} />

        <div className={styles.featuresHero__stage}>
          <div className={styles.featuresHero__screenWrap} data-screen="">
            <ProductSimulation feature={feature} />
          </div>

          <HeroWires activeId={feature.id} accent={feature.accent} />

          {heroFeatures.map((item, index) => (
            <FeatureCallout
              key={item.id}
              feature={item}
              active={item.id === feature.id}
              order={index}
              onEnter={onEnter}
              onLeave={onLeave}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
