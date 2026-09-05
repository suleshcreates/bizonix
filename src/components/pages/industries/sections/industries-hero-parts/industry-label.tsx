import Link from "next/link";
import type { Industry } from "@/lib/content/industries/industries";
import styles from "@/components/pages/industries/industries.module.css";

export function IndustryLabel({ industry }: { industry: Industry }) {
  return (
    <li className={`${styles.industriesHero__label} ${styles["industriesHero__" + (`region-${industry.id}`)]}`}>
      <Link className={styles.industriesHero__labelLink} href={industry.href}>
        <span className={styles.industriesHero__labelNumber}>{industry.number}</span>
        <span className={styles.industriesHero__labelName}>{industry.name}</span>
        <span className={styles.industriesHero__labelText}>{industry.description}</span>
      </Link>
    </li>
  );
}
