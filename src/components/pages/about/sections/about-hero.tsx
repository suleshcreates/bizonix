"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { aboutHero } from "@/lib/content/about/about-page";
import { usePageScrollDepth, usePointerParallax } from "../about-motion";
import styles from "@/components/pages/about/about.module.css";

/* ---------------------------------------------------------------------------
 * The plate
 *
 * The hero centrepiece is the photograph itself, held at full contrast in a
 * framed card rather than washed into the background. Everything around it is
 * there to seat the image — a brand-gradient bloom behind it, a rule that
 * draws across the top edge, and a scrim that only covers the bottom strip
 * where the credit sits, so the faces stay untouched.
 * ------------------------------------------------------------------------ */

function HeroPlate() {
  const parallaxRef = usePointerParallax<HTMLDivElement>();

  return (
    <div className={styles.about__aboutHero__figure} ref={parallaxRef}>
      <span className={styles.about__aboutHero__bloom} aria-hidden="true" />
      <span className={styles.about__aboutHero__bracket} aria-hidden="true" />

      <figure className={styles.about__aboutHero__plate}>
        <span
          className={styles.about__aboutHero__plateRule}
          aria-hidden="true"
        />

        <Image
          src={aboutHero.image.src}
          alt={aboutHero.image.alt}
          fill
          preload
          unoptimized
          sizes="(max-width: 940px) 100vw, 46vw"
          className={styles.about__aboutHero__plateImage}
          style={{ objectPosition: aboutHero.image.objectPosition }}
        />

        <span
          className={styles.about__aboutHero__plateScrim}
          aria-hidden="true"
        />

        <figcaption className={styles.about__aboutHero__credit}>
          <span
            className={styles.about__aboutHero__creditMark}
            aria-hidden="true"
          />
          <b>{aboutHero.image.credit}</b>
          <em>{aboutHero.image.creditNote}</em>
        </figcaption>
      </figure>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function Headline() {
  return (
    <h1 id="about-title" className={styles.about__aboutHero__title}>
      {aboutHero.headline.map((line, index) => (
        <span className={styles.about__aboutHero__line} key={line.text}>
          <span
            className={
              line.accent ? styles.about__aboutHero__accent : undefined
            }
            style={{ "--d": `${180 + index * 110}ms` } as React.CSSProperties}
          >
            {line.accent ? <em>{line.text}</em> : line.text}
          </span>
        </span>
      ))}
    </h1>
  );
}

export function AboutHero() {
  const heroRef = usePageScrollDepth<HTMLElement>();

  return (
    <section
      className={styles.about__aboutHero__hero}
      ref={heroRef}
      aria-labelledby="about-title"
    >
      <div className={styles.about__aboutHero__atmosphere} aria-hidden="true">
        <span className={styles.about__aboutHero__auroraOne} />
        <span className={styles.about__aboutHero__auroraTwo} />
        <span className={styles.about__aboutHero__isoGrid} />
      </div>

      <div className={styles.about__aboutHero__shell}>
        <div className={styles.about__aboutHero__copy}>
          <p className={styles.about__aboutHero__eyebrow}>
            <span aria-hidden="true" />
            {aboutHero.eyebrow}
          </p>

          <Headline />

          <p className={styles.about__aboutHero__summary}>
            {aboutHero.summary}
          </p>

          <div className={styles.about__aboutHero__actions}>
            <Link
              className={styles.about__aboutHero__primary}
              href={aboutHero.primaryCta.href}
            >
              {aboutHero.primaryCta.label}
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <Link
              className={styles.about__aboutHero__secondary}
              href={aboutHero.secondaryCta.href}
            >
              {aboutHero.secondaryCta.label}
              <ArrowUpRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <HeroPlate />
      </div>

      <div className={styles.about__aboutHero__rail}>
        <ul>
          {aboutHero.rail.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <span className={styles.about__aboutHero__cue} aria-hidden="true">
          {aboutHero.scrollCue}
          <i />
        </span>
      </div>
    </section>
  );
}
