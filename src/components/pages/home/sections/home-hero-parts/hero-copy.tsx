import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import type { CSSProperties } from "react";
import styles from "@/components/pages/home/home.module.css";

/** Audiences cycled in the eyebrow — the entity types plus commerce. */
const audiences = [
  "wholesale HQ",
  "retail counters",
  "franchise partners",
  "online orders",
];

/**
 * The headline animates word by word, so it ships as words rather than one
 * string. `accent` marks the phrase carrying the blue→teal gradient sweep.
 */
const headline: { text: string; accent?: boolean }[][] = [
  [{ text: "Run" }, { text: "warehouse," }, { text: "stores" }, { text: "&" }],
  [{ text: "franchise" }, { text: "on" }, { text: "one ERP.", accent: true }],
];

/**
 * Centered editorial column above the product stage: eyebrow, headline,
 * supporting copy and the two CTAs. The frozen background stays untouched;
 * only this foreground layer is composed.
 */
export function HeroCopy() {
  let order = 0;

  return (
    <div className={styles.homeHero__heroContent} data-hero="content">
      <div className={styles.homeHero__head}>
        <p className={styles.homeHero__eyebrow}>
          <i className={styles.homeHero__eyebrowDot} aria-hidden="true" />
          Built for
          <span className={styles.homeHero__rotator}>
            <span className={styles.homeHero__rotatorTrack}>
              {audiences.map((audience, index) => (
                <span
                  key={audience}
                  className={styles.homeHero__rotatorItem}
                  /* The first entry is the accessible label; the rest restate
                     the same promise, so assistive tech hears it once. */
                  aria-hidden={index > 0 ? "true" : undefined}
                >
                  {audience}
                </span>
              ))}
              {/* Duplicate of the first word, so the loop closes seamlessly. */}
              <span className={styles.homeHero__rotatorItem} aria-hidden="true">
                {audiences[0]}
              </span>
            </span>
          </span>
        </p>

        <h1 id="home-hero-heading" className={styles.homeHero__title}>
          {headline.map((line, lineIndex) => (
            <span className={styles.homeHero__titleLine} key={lineIndex}>
              {line.map((word) => {
                const delay = order++;
                return (
                  <Fragment key={word.text}>
                    <span
                      className={
                        word.accent
                          ? `${styles.homeHero__word} ${styles.homeHero__accent}`
                          : styles.homeHero__word
                      }
                      style={{ "--d": delay } as CSSProperties}
                    >
                      {word.text}
                    </span>{" "}
                  </Fragment>
                );
              })}
            </span>
          ))}
        </h1>

        <div className={styles.homeHero__accentDash} aria-hidden="true" />
      </div>

      <div className={styles.homeHero__intro}>
        <p className={styles.homeHero__lede}>
          Bizonix keeps inventory, billing, transfers and books inside one
          system—so HQ, company stores and franchise partners all read the same
          operating truth.
        </p>

        <div className={styles.homeHero__actions}>
          <Link href="/contact" className={styles.homeHero__btnPrimary}>
            Book a demo
            <ArrowRight size={16} strokeWidth={2.3} />
          </Link>
          <Link href="/modules" className={styles.homeHero__btnSecondary}>
            Explore solutions
            <ArrowRight size={15} strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
