import { ArrowRight, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { HeroScrollCue } from "./modules-hero-parts/hero-scroll-cue";
import { ProductMarquee } from "./modules-hero-parts/product-marquee";
import styles from "@/components/pages/modules/modules.module.css";

const proofPoints = [
  "9 modules",
  "One shared record",
  "Entity-isolated books",
] as const;

function SolutionsHeroCopy() {
  return (
    <div className={styles.modulesHero__copy}>
      <p className={styles.modulesHero__eyebrow}>
        <span className={styles.modulesHero__eyebrowDot} aria-hidden="true" />
        Bizonix platform
      </p>

      <h1 id="modules-title">
        <span className={styles.modulesHero__headlineLead}>
          <span className={styles.modulesHero__leadDesktop}>Solutions built </span>
          <span className={styles.modulesHero__leadMobile}>Built </span>
          for how brands
        </span>{" "}
        <span className={styles.modulesHero__accent}>actually operate</span>
      </h1>

      <p className={styles.modulesHero__lede}>
        <span className={styles.modulesHero__ledeDesktop}>
          Run inventory, purchasing, sales, wholesale, franchise and finance from
          one connected platform. Start with the workflow that needs attention
          most, then expand when you&apos;re ready.
        </span>
        <span className={styles.modulesHero__ledeMobile}>
          Run inventory, sales, wholesale and finance from one connected platform —
          start where you need it most, then expand as you grow.
        </span>
      </p>

      <ul className={styles.modulesHero__proof}>
        <li className={styles.modulesHero__proofLive}>
          <span className={styles.modulesHero__pulse} aria-hidden="true" />
          <span className={styles.modulesHero__proofDesktop}>Real screens from Bizonix</span>
          <span className={styles.modulesHero__proofMobile}>Real screens</span>
        </li>
        {proofPoints.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <div className={styles.modulesHero__actions}>
        <a className={styles.modulesHero__ctaPrimary} href="#modules">
          Explore all modules
          <ArrowRight size={17} aria-hidden="true" />
        </a>
        <Link
          className={styles.modulesHero__ctaSecondary}
          href="/contact?utm_source=modules-hero"
        >
          <CalendarCheck size={16} aria-hidden="true" />
          Book a walkthrough
        </Link>
      </div>
    </div>
  );
}

export function ModulesHero() {
  return (
    <section
      className={styles.modulesHero__hero}
      aria-labelledby="modules-title"
    >
      <ProductMarquee />
      <span className={styles.modulesHero__scrim} aria-hidden="true" />
      <div className={styles.modulesHero__shell}>
        <SolutionsHeroCopy />
      </div>
      <HeroScrollCue />
    </section>
  );
}
