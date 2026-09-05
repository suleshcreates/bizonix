"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { FeatureId } from "@/lib/content/features/features";
import { featureDeepPages } from "@/lib/content/features/feature-deep-pages";
import { ProcessTimeline } from "./process-timeline";
import { useReveal } from "./use-reveal";
import styles from "@/components/pages/features/features.module.css";

/**
 * Section 02 — "How it works".
 *
 * The continuation of section 01 on a slightly cooler ground: a short argument
 * and the two site CTAs on the left, the four-step timeline on the right. Same
 * locked geometry on every feature deep page.
 */
export function HowItWorksSection({ slug }: { slug: FeatureId }) {
  const data = featureDeepPages[slug];
  const { ref, shown } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`${styles.features__featureDeep__section} ${styles.features__featureDeep__how}`}
      data-in={shown ? "true" : "false"}
      aria-labelledby="how-it-works"
    >
      <div className={`${styles.features__featureDeep__shell} ${styles.features__featureDeep__shellHow}`}>
        <div className={styles.features__featureDeep__copy}>
          <p className={styles.features__featureDeep__eyebrow} style={{ "--d": 0 } as CSSProperties}>
            <span className={styles.features__featureDeep__eyebrowIndex}>02</span>
            <i aria-hidden="true" />
            How it works
          </p>

          <h2
            id="how-it-works"
            className={styles.features__featureDeep__heading}
            style={{ "--d": 1 } as CSSProperties}
          >
            {data.howHeadline[0]}{" "}
            <span className={styles.features__featureDeep__accent}>{data.howHeadline[1]}</span>
          </h2>

          <p className={styles.features__featureDeep__body} style={{ "--d": 2 } as CSSProperties}>
            {data.howBody}
          </p>

          <div className={styles.features__featureDeep__actions} style={{ "--d": 3 } as CSSProperties}>
            <Link
              className={styles.features__featureDeep__ctaPrimary}
              href={`/contact?utm_source=feature-${slug}`}
            >
              Book a demo
              <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
            </Link>
            <Link className={styles.features__featureDeep__ctaGhost} href="/features">
              Explore all features
              <ArrowRight size={14} strokeWidth={2.3} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className={styles.features__featureDeep__visual} style={{ "--d": 2 } as CSSProperties}>
          <ProcessTimeline steps={data.steps} />
        </div>
      </div>
    </section>
  );
}
