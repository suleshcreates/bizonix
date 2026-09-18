import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import type { CSSProperties } from "react";
import styles from "@/components/pages/home/home.module.css";

export function HeroCopy({ config }: { config?: any }) {
  let order = 0;

  // Fallback defaults if DB is unavailable
  const eyebrow = config?.eyebrow || "Built for";
  const rawHeadline = config?.headline || "Run warehouse, stores & franchise on one ERP.";
  const accentText = config?.accentText || "one ERP.";
  const description = config?.description || "Bizonix keeps inventory, billing, transfers and books inside one system—so HQ, company stores and franchise partners all read the same operating truth.";
  const primaryCta = config?.primaryCta || { label: "Book a demo", href: "/contact" };
  const secondaryCta = config?.secondaryCta || { label: "Explore solutions", href: "/modules" };

  // Generate word-by-word animation structure dynamically based on the headline text
  // We'll just put all words in one line array, the flex layout handles wrapping
  const words = rawHeadline.split(" ");
  const headlineStructure: { text: string; accent?: boolean }[][] = [
    words.map((w: string) => ({
      text: w,
      accent: w.toLowerCase().includes(accentText.toLowerCase()),
    }))
  ];

  return (
    <div className={styles.homeHero__heroContent} data-hero="content">
      <div className={styles.homeHero__head}>
        <p className={styles.homeHero__eyebrow}>
          <i className={styles.homeHero__eyebrowDot} aria-hidden="true" />
          {eyebrow}
        </p>

        <h1 id="home-hero-heading" className={styles.homeHero__title}>
          {headlineStructure.map((line, lineIndex) => (
            <span className={styles.homeHero__titleLine} key={lineIndex}>
              {line.map((word) => {
                const delay = order++;
                return (
                  <Fragment key={word.text + delay}>
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
        <p className={styles.homeHero__lede}>{description}</p>

        <div className={styles.homeHero__actions}>
          <Link href={primaryCta.href} className={styles.homeHero__btnPrimary}>
            {primaryCta.label}
            <ArrowRight size={16} strokeWidth={2.3} />
          </Link>
          <Link href={secondaryCta.href} className={styles.homeHero__btnSecondary}>
            {secondaryCta.label}
            <ArrowRight size={15} strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
