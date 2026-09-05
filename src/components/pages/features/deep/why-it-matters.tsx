"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, MouseEvent } from "react";
import { featureDeepPages } from "@/lib/content/features/feature-deep-pages";
import type { FeatureId } from "@/lib/content/features/features";
import { FeatureSimulation } from "./feature-simulation";
import { useReveal } from "./use-reveal";
import styles from "@/components/pages/features/features.module.css";

/**
 * Section 01 — "Why it matters".
 *
 * Argument on the left, a working Bizonix surface on the right. The geometry
 * is locked in deep-sections.module.css and is identical on all five feature
 * deep pages; this component only decides what goes in each slot.
 */
export function WhyItMattersSection({ slug }: { slug: FeatureId }) {
  const data = featureDeepPages[slug];
  const { ref, shown } = useReveal<HTMLElement>();

  /* The secondary CTA takes the reader to the sequence rather than nowhere. */
  const toSequence = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById("how-it-works");
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={ref}
      className={`${styles.features__featureDeep__section} ${styles.features__featureDeep__why}`}
      data-in={shown ? "true" : "false"}
      aria-labelledby="why-it-matters"
    >
      <div className={styles.features__featureDeep__shell}>
        <div className={styles.features__featureDeep__copy}>
          <p className={styles.features__featureDeep__eyebrow} style={{ "--d": 0 } as CSSProperties}>
            <span className={styles.features__featureDeep__eyebrowIndex}>01</span>
            <i aria-hidden="true" />
            Why it matters
          </p>

          <h2
            id="why-it-matters"
            className={styles.features__featureDeep__heading}
            style={{ "--d": 1 } as CSSProperties}
          >
            {data.whyHeadline[0]}{" "}
            <span className={styles.features__featureDeep__accent}>{data.whyHeadline[1]}</span>
          </h2>

          <p className={styles.features__featureDeep__body} style={{ "--d": 2 } as CSSProperties}>
            {data.whyBody}
          </p>

          <ul className={styles.features__featureDeep__benefits} style={{ "--d": 3 } as CSSProperties}>
            {data.benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <li key={benefit.label} style={{ "--i": index } as CSSProperties}>
                  <span className={styles.features__featureDeep__benefitIcon}>
                    <Icon size={16} strokeWidth={2.1} aria-hidden="true" />
                  </span>
                  {benefit.label}
                </li>
              );
            })}
          </ul>

          <div className={styles.features__featureDeep__actions} style={{ "--d": 4 } as CSSProperties}>
            <Link
              className={styles.features__featureDeep__ctaPrimary}
              href={`/contact?utm_source=feature-${slug}`}
            >
              Book a demo
              <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
            </Link>
            <a
              className={styles.features__featureDeep__ctaGhost}
              href="#how-it-works"
              onClick={toSequence}
            >
              See how it works
              <ArrowDown size={14} strokeWidth={2.3} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className={styles.features__featureDeep__visual} style={{ "--d": 2 } as CSSProperties}>
          <FeatureSimulation data={data.simulation} />
        </div>
      </div>
    </section>
  );
}
