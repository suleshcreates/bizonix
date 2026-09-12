"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { IndustryHeroContent } from "@/lib/content/industries/industry-hero-content";
import {
  groupHeadlineLines,
  HeadlineLine,
  HeroBannerCard,
  HeroDetailCard,
  HeroStatsCard,
} from "./industry-hero-parts/hero-float-cards";
import { heroIcons } from "./industry-hero-parts/hero-icons";
import styles from "@/components/pages/industries/industries.module.css";

/**
 * The industry deep-page hero. One component, every industry.
 *
 * Nothing below reads a slug, branches on an industry, or holds a string that
 * belongs to one page. Everything arrives in `content`, so a new industry page
 * is an entry in `industryHeroContent` and a route — no layout code is touched.
 *
 * Division of motion labour, matching the rest of the site: Framer Motion owns
 * the entrance (opacity, y, scale on mount) and GSAP owns anything tied to
 * scroll position (the parallax on the decorative wash, the trust bar's
 * fade-in). No property is written by both libraries on the same node.
 *
 * Reduced motion is handled once, at the top: `useReducedMotion` collapses
 * every Framer variant to its final state and the GSAP context returns before
 * registering a trigger. The count-up in the stats card checks the preference
 * itself, because it runs on its own clock.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Variants are built per render from the reader's motion preference rather
 * than declared once at module scope.
 *
 * Choosing the initial state is not enough on its own: with the durations
 * hard-coded, a reader who asked for reduced motion still watched the whole
 * entrance play, just starting from the finished position on the first frame.
 * At `duration: 0` the elements are simply there. The stylesheet carries the
 * same guarantee for the very first paint, before this hook has resolved.
 */
function buildVariants(reduced: boolean) {
  const t = (duration: number, delay: number) =>
    reduced ? { duration: 0 } : { duration, ease: EASE, delay };

  return {
    /* Copy column: each headline line, then the subhead, then the CTA row,
       then the stats — in that order, 90ms apart. */
    copy: {
      hidden: { opacity: 0, y: reduced ? 0 : 18 },
      shown: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: t(0.55, 0.06 + index * 0.09),
      }),
    } satisfies Variants,

    /* The photo settles first; the cards arrive on top of it 150ms apart. */
    media: {
      hidden: { opacity: 0, y: reduced ? 0 : 22 },
      shown: { opacity: 1, y: 0, transition: t(0.6, 0) },
    } satisfies Variants,

    card: {
      hidden: { opacity: 0, scale: reduced ? 1 : 0.95 },
      shown: (index: number) => ({
        opacity: 1,
        scale: 1,
        transition: t(0.42, 0.45 + index * 0.15),
      }),
    } satisfies Variants,
  };
}

export function IndustryHero({ content }: { content: IndustryHeroContent }) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const washRef = useRef<HTMLSpanElement>(null);
  /* Gates the count-up so the figures start with the card they live on rather
     than on mount, while the card is still transparent. */
  const [cardsIn, setCardsIn] = useState(false);

  const {
    copy: copyVariants,
    media: mediaVariants,
    card: cardVariants,
  } = buildVariants(Boolean(reduced));

  const lines = groupHeadlineLines(content.headlineParts);
  /* Copy order: headline lines, subhead, CTA row, stats row. */
  const subheadIndex = lines.length;
  const ctaIndex = subheadIndex + 1;
  const statsIndex = ctaIndex + 1;

  const hasTrustBar = Boolean(content.trustLogos?.length);

  /* One path, and the state is always set from the callback: setting it in the
     effect body triggers a cascading render, and the reduced-motion case does
     not need the gate anyway — the counter returns its final value regardless
     of `active` when the preference is set. */
  useEffect(() => {
    const timer = setTimeout(() => setCardsIn(true), reduced ? 0 : 450);
    return () => clearTimeout(timer);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      /* Parallax. The wash drifts against the photo by 14px over the whole
         scroll of the hero — enough to read as depth on a slow scroll, small
         enough that it never separates from the corner it sits behind. */
      if (washRef.current) {
        gsap.to(washRef.current, {
          y: 14,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      /* The trust bar is secondary: one fade for the row, no stagger. */
      const bar = rootRef.current?.querySelector<HTMLElement>(
        "[data-hero-trustbar]",
      );
      if (bar) {
        gsap.fromTo(
          bar,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: bar, start: "top 92%" },
          },
        );
      }
    }, rootRef);

    return () => context.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className={styles.industryHero}
      aria-labelledby="industry-title"
    >
      <div className={styles.industryDetailPage__shell}>
        <nav className={styles.industryHero__crumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <Link href="/industries">Industries</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span aria-current="page">{content.breadcrumbLabel}</span>
        </nav>

        <div className={styles.industryHero__grid}>
          {/* ------------------------------------------------ copy column */}
          <div className={styles.industryHero__copy}>
            <motion.p
              className={styles.industryHero__eyebrow}
              variants={copyVariants}
              initial={reduced ? false : "hidden"}
              animate="shown"
              custom={0}
            >
              <span
                className={styles.industryHero__eyebrowDot}
                aria-hidden="true"
              />
              {content.eyebrowLabel}
            </motion.p>

            <h1 id="industry-title" className={styles.industryHero__headline}>
              {lines.map((line, index) => (
                <motion.span
                  key={index}
                  className={styles.industryHero__headlineLine}
                  variants={copyVariants}
                  initial={reduced ? false : "hidden"}
                  animate="shown"
                  custom={index}
                >
                  <HeadlineLine parts={line} />
                </motion.span>
              ))}
            </h1>

            <motion.p
              className={styles.industryHero__subhead}
              variants={copyVariants}
              initial={reduced ? false : "hidden"}
              animate="shown"
              custom={subheadIndex}
            >
              {content.subheadText}
            </motion.p>

            <motion.div
              className={styles.industryHero__actions}
              variants={copyVariants}
              initial={reduced ? false : "hidden"}
              animate="shown"
              custom={ctaIndex}
            >
              <Link
                className={styles.industryDetailPage__primary}
                href={content.primaryCta.href}
              >
                {content.primaryCta.label}
                <ChevronRight size={17} aria-hidden="true" />
              </Link>
              <Link
                className={styles.industryDetailPage__secondary}
                href={content.secondaryCta.href}
              >
                <Play size={13} strokeWidth={2.4} aria-hidden="true" />
                {content.secondaryCta.label}
              </Link>
            </motion.div>

            <motion.dl
              className={styles.industryHero__stats}
              variants={copyVariants}
              initial={reduced ? false : "hidden"}
              animate="shown"
              custom={statsIndex}
            >
              {content.trustStats.map((stat) => {
                const Icon = heroIcons[stat.icon];
                return (
                  <div key={stat.label}>
                    <span
                      className={styles.industryHero__statIcon}
                      aria-hidden="true"
                    >
                      <Icon size={15} strokeWidth={2} />
                    </span>
                    <div>
                      <dt>{stat.label}</dt>
                      <dd>{stat.value}</dd>
                    </div>
                  </div>
                );
              })}
            </motion.dl>
          </div>

          {/* ----------------------------------------------- media column */}
          <div className={styles.industryHero__media}>
            <span
              ref={washRef}
              className={styles.industryHero__wash}
              aria-hidden="true"
            />
            <span className={styles.industryHero__bgLabel} aria-hidden="true">
              {content.bgLabel}
            </span>

            <motion.figure
              className={styles.industryHero__figure}
              variants={mediaVariants}
              initial={reduced ? false : "hidden"}
              animate="shown"
            >
              <Image
                className={styles.industryHero__image}
                src={content.heroImage.src}
                alt={content.heroImage.alt}
                fill
                priority
                sizes="(max-width: 1080px) 100vw, 56vw"
              />
            </motion.figure>

            <motion.div
              className={styles.industryHero__slotTopLeft}
              variants={cardVariants}
              initial={reduced ? false : "hidden"}
              animate="shown"
              custom={0}
            >
              <HeroDetailCard card={content.floatingCardTopLeft} />
            </motion.div>

            <motion.div
              className={styles.industryHero__slotTopRight}
              variants={cardVariants}
              initial={reduced ? false : "hidden"}
              animate="shown"
              custom={1}
            >
              <HeroStatsCard
                rows={content.floatingStatsCardTopRight}
                active={cardsIn}
              />
            </motion.div>

            <motion.div
              className={styles.industryHero__slotBottomRight}
              variants={cardVariants}
              initial={reduced ? false : "hidden"}
              animate="shown"
              custom={2}
            >
              <HeroBannerCard banner={content.floatingBannerBottomRight} />
            </motion.div>
          </div>
        </div>

        {/* Conditional in full: with no logos there is no label, no row and no
            spacing left behind — not an empty bar with placeholders in it. */}
        {hasTrustBar ? (
          <div className={styles.industryHero__trustBar} data-hero-trustbar>
            {content.trustBarLabel ? (
              <span className={styles.industryHero__trustLabel}>
                {content.trustBarLabel}
              </span>
            ) : null}
            <ul className={styles.industryHero__trustLogos}>
              {content.trustLogos?.map((logo) => (
                <li key={logo.name}>
                  <strong>{logo.name}</strong>
                  {logo.tagline ? <small>{logo.tagline}</small> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
