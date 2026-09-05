import { BeamField } from "./home-hero-parts/beam-field";
import { HeroCopy } from "./home-hero-parts/hero-copy";
import { ProductStage } from "./home-hero-parts/product-stage";
import styles from "@/components/pages/home/home.module.css";

/**
 * Home hero — centered editorial copy above a large front-facing product
 * stage. The atmospheric background layers (beam field canvas, grain,
 * readability scrim, floor glow, horizon) are approved and frozen: they are
 * rendered exactly as before and must not be restyled from this file.
 */
export function HomeHero() {
  return (
    <section className={styles.homeHero__heroSection} aria-labelledby="home-hero-heading">
      <BeamField className={styles.homeHero__beams} />
      <div className={styles.homeHero__grain} aria-hidden="true" />
      <div className={styles.homeHero__scrim} aria-hidden="true" />
      <div className={styles.homeHero__floorGlow} aria-hidden="true" />
      <div className={styles.homeHero__horizon} aria-hidden="true" />
      <div className={styles.homeHero__shell}>
        <HeroCopy />
        <ProductStage />
      </div>
    </section>
  );
}
