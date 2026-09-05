"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { aboutClose } from "@/lib/content/about/about-page";
import { useReveal } from "../about-motion";
import styles from "@/components/pages/about/about.module.css";

/**
 * Closing coda.
 *
 * The hero opened on a lattice assembling itself; this closes on one settled
 * cube and repeats the hero headline, so the narrative lands where it started.
 * The editorial split keeps the final statement prominent while giving the
 * supporting rationale and conversion action their own clear surface.
 */
function SettledMark() {
  return (
    <span className={styles.about__aboutClose__mark} aria-hidden="true">
      <span className={styles.about__aboutClose__markRing} />
      <Image
        className={styles.about__aboutClose__markIcon}
        src="/images/shared/brand/icon.svg"
        alt=""
        width={76}
        height={76}
      />
    </span>
  );
}

export function AboutClose() {
  const { ref, revealed } = useReveal<HTMLElement>(0.2);

  return (
    <section
      ref={ref}
      className={`${styles.about__aboutClose__section} ${revealed ? styles.about__aboutClose__isVisible : ""}`}
      aria-labelledby="about-close-title"
    >
      <span className={styles.about__aboutClose__grid} aria-hidden="true" />

      <div className={styles.about__aboutClose__shell}>
        <div className={styles.about__aboutClose__intro}>
          <p className={styles.about__aboutClose__eyebrow}>
            <span aria-hidden="true" />
            {aboutClose.eyebrow}
          </p>
          <SettledMark />
        </div>

        <div className={styles.about__aboutClose__statement}>
          <h2 id="about-close-title" className={styles.about__aboutClose__headline}>
            {aboutClose.headline.map((line, index) => (
              <span
                key={line}
                style={{ "--d": `${index * 90}ms` } as React.CSSProperties}
              >
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div className={styles.about__aboutClose__detail}>
          <p className={styles.about__aboutClose__detailLabel}>Our operating principle</p>
          <p className={styles.about__aboutClose__body}>{aboutClose.body}</p>

          <Link className={styles.about__aboutClose__link} href={aboutClose.link.href}>
            {aboutClose.link.label}
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </Link>

          <div className={styles.about__aboutClose__sign}>
            <i aria-hidden="true" />
            <p className={styles.about__aboutClose__tagline}>{aboutClose.tagline}</p>
            <p className={styles.about__aboutClose__company}>{aboutClose.company}</p>
          </div>
        </div>
      </div>
    </section>
  );
}


