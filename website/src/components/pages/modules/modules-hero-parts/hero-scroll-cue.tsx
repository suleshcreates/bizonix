import { ChevronDown } from "lucide-react";
import styles from "@/components/pages/modules/modules.module.css";

/** Quiet hand-off from the hero into the module catalogue. */
export function HeroScrollCue() {
  return (
    <a href="#modules" className={styles.modulesHero__scrollCue}>
      <span className={styles.modulesHero__scrollCueLabel}>Browse the catalogue</span>
      <span className={styles.modulesHero__scrollCueIcon} aria-hidden="true">
        <ChevronDown size={14} />
      </span>
    </a>
  );
}
