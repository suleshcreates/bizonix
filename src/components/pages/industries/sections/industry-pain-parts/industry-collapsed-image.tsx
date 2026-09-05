import Image from "next/image";
import type { IndustryPainStory } from "@/lib/content/industries/industry-pain-data";
import styles from "@/components/pages/industries/industries.module.css";

export function IndustryCollapsedImage({
  item,
  priority = false,
  expandedLayer = false,
}: {
  item: IndustryPainStory;
  priority?: boolean;
  expandedLayer?: boolean;
}) {
  return (
    <div className={expandedLayer ? styles.industryPainSection__expandedImageBase : styles.industryPainSection__imageRegion}>
      <Image
        src={item.collapsedImage}
        alt={`${item.name} operational inventory workflow`}
        fill
        priority={priority}
        sizes={expandedLayer ? "(max-width: 620px) 100vw, 38vw" : "(max-width: 620px) 100vw, 24vw"}
        className={styles.industryPainSection__image}
      />
      <span className={styles.industryPainSection__imageGrade} aria-hidden="true" />
    </div>
  );
}
