import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ModuleData } from "@/lib/content/modules/module-pages/types";
import styles from "@/components/pages/modules/modules.module.css";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { ProductSimulation } from "./hero-screens/product-simulation";
import { ModuleNavigator } from "./module-navigator";

/**
 * The one H1 on the page. It states the module's outcome — never a feature
 * list — and sits beside the real product canvas rather than above a
 * decorative illustration.
 */
export function ModuleHero({
  data,
  trail,
}: {
  data: ModuleData;
  trail: readonly Crumb[];
}) {
  const { hero } = data;

  return (
    <section className={styles.modulePage__hero} aria-labelledby="module-title">
      <span className={styles.modulePage__heroGrain} aria-hidden="true" />

      <div
        className={`${styles.modulePage__shell} ${styles.modulePage__heroShell}`}
      >
        <Breadcrumbs trail={trail} />

        <div className={styles.modulePage__heroGrid}>
          <div className={styles.modulePage__heroCopy}>
            <p className={styles.modulePage__eyebrow} data-reveal>
              <span
                className={styles.modulePage__eyebrowDot}
                aria-hidden="true"
              />
              {hero.eyebrow}
            </p>

            {/* One deliberate phrase carries the accent: the headline is
                split on its own suffix rather than marked up per module. */}
            <h1 id="module-title" data-reveal>
              {hero.headline.slice(
                0,
                hero.headline.length - hero.headlineAccent.length,
              )}
              <span className={styles.modulePage__heroAccent}>
                {hero.headlineAccent}
              </span>
            </h1>

            <p className={styles.modulePage__heroBody} data-reveal>
              {hero.body}
            </p>

            <div className={styles.modulePage__heroActions} data-reveal>
              <Link
                className={styles.modulePage__primary}
                href={hero.primaryCta.href}
              >
                {hero.primaryCta.label}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              {hero.secondaryCta ? (
                <Link
                  className={styles.modulePage__secondary}
                  href={hero.secondaryCta.href}
                >
                  {hero.secondaryCta.label}
                  <ChevronRight size={16} aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          </div>

          <div className={styles.modulePage__heroStage} data-reveal>
            <ProductSimulation slug={data.slug} />
          </div>
        </div>

        <ModuleNavigator slug={data.slug} />
      </div>
    </section>
  );
}
