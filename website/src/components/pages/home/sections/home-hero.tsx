import { BeamField } from "./home-hero-parts/beam-field";
import { HeroCopy } from "./home-hero-parts/hero-copy";
import { ProductStage } from "./home-hero-parts/product-stage";
import { ScaleHero } from "./scale-hero";
import { ConnectedHero } from "./connected-hero";
import { CommerceHero } from "./commerce-hero";
import styles from "@/components/pages/home/home.module.css";

/**
 * Shared Hero Engine:
 * Dynamically resolves the published/previewed hero key to the registered component.
 * - 'scale'     -> ScaleHero (High-Growth Enterprise Retail)
 * - 'connected' -> ConnectedHero (Omnichannel Retail & Mobile Network)
 * - 'commerce'  -> CommerceHero (Omnichannel Storefront & Unified Orders)
 * - 'operating' -> Operating Hero (Default Core ERP with GSAP 4-stage Console)
 */
export function HomeHero({ config }: { config?: any }) {
  const key = (config?.key || "").toLowerCase();
  const visualVariant = (config?.visualVariant || "").toLowerCase();

  const isScale = key === "scale" || visualVariant === "scale";
  const isConnected = key === "connected" || visualVariant === "connected";
  const isCommerce = key === "commerce" || visualVariant === "storefront";

  if (isScale) {
    return <ScaleHero config={config} />;
  }

  if (isConnected) {
    return <ConnectedHero config={config} />;
  }

  if (isCommerce) {
    return <CommerceHero config={config} />;
  }

  return (
    <section className={styles.homeHero__heroSection} aria-labelledby="home-hero-heading">
      <BeamField className={styles.homeHero__beams} />
      <div className={styles.homeHero__grain} aria-hidden="true" />
      <div className={styles.homeHero__scrim} aria-hidden="true" />
      <div className={styles.homeHero__floorGlow} aria-hidden="true" />
      <div className={styles.homeHero__horizon} aria-hidden="true" />
      <div className={styles.homeHero__shell}>
        <HeroCopy config={config} />
        <ProductStage visualVariant="dashboard" />
      </div>
    </section>
  );
}
