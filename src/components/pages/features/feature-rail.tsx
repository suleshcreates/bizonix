"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { featureSummaries } from "@/lib/content/features/features";
import styles from "@/components/pages/features/features.module.css";

/**
 * A fixed marker rail for the five feature viewports.
 *
 * Because every feature owns a full screen, there is no page-level context
 * once you are inside one — this puts it back: where you are in the five, and
 * a one-click jump to any of the others. It only shows while a feature
 * viewport is on screen, so the hero and the closing band stay uninterrupted.
 */
export function FeatureRail() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const sections = featureSummaries
      .map((feature) => document.getElementById(feature.id))
      .filter((node): node is HTMLElement => node !== null);
    if (sections.length === 0) return;

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId: string | null = null;
        let best = 0.35;
        for (const [id, ratio] of ratios) {
          if (ratio > best) {
            best = ratio;
            bestId = id;
          }
        }
        setActiveId(bestId);
      },
      { threshold: [0, 0.35, 0.55, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={styles.features__featureRail__rail}
      aria-label="Feature progress"
      data-visible={activeId ? "true" : "false"}
      aria-hidden={activeId ? undefined : "true"}
    >
      <ol>
        {featureSummaries.map((feature) => (
          <li
            key={feature.id}
            style={{ "--accent": feature.accent } as CSSProperties}
          >
            <a
              href={`#${feature.id}`}
              data-on={activeId === feature.id ? "true" : "false"}
              tabIndex={activeId ? undefined : -1}
            >
              <span className={styles.features__featureRail__tip}>
                <b>{feature.index}</b>
                {feature.discipline}
              </span>
              <span className={styles.features__featureRail__dot} aria-hidden="true" />
              <span className={styles.features__featureRail__srOnly}>{feature.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
