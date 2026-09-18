import Image from "next/image";
import type { Industry } from "@/lib/content/industries/industries";
import styles from "@/components/pages/industries/industries.module.css";

export function IndustryScene({
  industry,
  priority = false,
  active = false,
}: {
  industry: Industry;
  priority?: boolean;
  /** Only the single-card layout reads this; the panorama shows all three. */
  active?: boolean;
}) {
  return (
    <div
      className={`${styles.industriesHero__scene} ${styles["industriesHero__" + industry.id]}`}
      data-on={active}
    >
      <div className={styles.industriesHero__sceneImage}>
        <Image
          src={industry.image}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 760px) 100vw, 60vw"
          className={styles.industriesHero__image}
        />
        <div className={styles.industriesHero__sceneGrade} />
      </div>
    </div>
  );
}
