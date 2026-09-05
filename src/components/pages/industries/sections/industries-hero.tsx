import { industries } from "@/lib/content/industries/industries";
import styles from "@/components/pages/industries/industries.module.css";
import { IndustriesEditorial } from "./industries-hero-parts/industries-editorial";
import { IndustryLandscape } from "./industries-hero-parts/industry-landscape";

export function IndustriesHero() {
  return (
    <section className={styles.industriesHero__hero} aria-labelledby="industries-title">
      <IndustriesEditorial />
      <IndustryLandscape items={industries} />
    </section>
  );
}
