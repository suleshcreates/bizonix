import type { Industry } from "@/lib/content/industries/industries";
import styles from "@/components/pages/industries/industries.module.css";
import { IndustryLabel } from "./industry-label";
import { IndustryOverlay } from "./industry-overlay";
import { IndustryScene } from "./industry-scene";

export function IndustryLandscape({ items }: { items: readonly Industry[] }) {
  return (
    <div className={styles.industriesHero__landscape}>
      <div className={styles.industriesHero__scenes} aria-hidden="true">
        {items.map((industry, index) => (
          <IndustryScene
            key={industry.id}
            industry={industry}
            priority={index < 2}
          />
        ))}
      </div>
      <IndustryOverlay />
      <ul className={styles.industriesHero__labels}>
        {items.map((industry) => (
          <IndustryLabel key={industry.id} industry={industry} />
        ))}
      </ul>
    </div>
  );
}
