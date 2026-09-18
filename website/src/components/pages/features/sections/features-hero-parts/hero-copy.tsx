import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { HeroFeature } from "@/lib/content/features/features-hero-data";
import styles from "@/components/pages/features/features.module.css";

/**
 * The editorial column above the console: eyebrow, two-line headline, one
 * sentence of support and the two calls to action. Centered, narrow, and
 * deliberately quiet — the console below it is what does the explaining.
 *
 * Styling lives in this part's own module, not the hero shell's, so the
 * composition beneath can be re-cut without disturbing the intro block.
 */
export function HeroCopy({ feature }: { feature?: HeroFeature }) {
  const headline = feature?.headline ?? [
    "Five powerful capabilities.",
    "One connected system.",
  ];

  return (
    <div className={styles.heroCopy__copy}>
      {/* Deep pages only. /features is itself the top of this branch, so it
          shows no trail. The BreadcrumbList the route emits is built from the
          same hierarchy, so the two cannot disagree. */}
      {feature ? (
        <nav className={styles.heroCopy__crumbs} aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
              <ChevronRight size={13} aria-hidden="true" />
            </li>
            <li>
              <Link href="/features">Features</Link>
              <ChevronRight size={13} aria-hidden="true" />
            </li>
            <li>
              <span aria-current="page">{feature.name}</span>
            </li>
          </ol>
        </nav>
      ) : null}

      <p className={styles.heroCopy__eyebrow}>
        <i className={styles.heroCopy__eyebrowDot} aria-hidden="true" />
        {feature?.eyebrow ?? "Features"}
      </p>

      <h1 id="features-title" className={styles.heroCopy__title}>
        <span className={styles.heroCopy__titleLine}>{headline[0]}</span>
        <span
          className={`${styles.heroCopy__titleLine} ${styles.heroCopy__accent}`}
        >
          {headline[1]}
        </span>
      </h1>

      <p className={styles.heroCopy__lede}>
        {feature?.description ??
          "From identification to invoicing, tax compliance to pricing and stock movement — everything works together inside Bizonix."}
      </p>

      <div className={styles.heroCopy__actions}>
        <Link
          className={styles.heroCopy__ctaPrimary}
          href="/contact?utm_source=features-hero"
        >
          Book a demo
          <ArrowRight size={16} strokeWidth={2.3} aria-hidden="true" />
        </Link>
        <Link
          className={styles.heroCopy__ctaSecondary}
          href={feature ? "/features" : "#barcode"}
        >
          Explore all features
          <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
