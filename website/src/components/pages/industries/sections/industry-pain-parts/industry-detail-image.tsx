import Image from "next/image";
import type { IndustryPainStory } from "@/lib/content/industries/industry-pain-data";
import styles from "@/components/pages/industries/industries.module.css";

export function IndustryDetailImage({ item }: { item: IndustryPainStory }) {
  return (
    <div className={styles.industryPainSection__detailImage}>
      <Image
        src={item.detailImage}
        alt={`${item.name} staff handling detailed inventory operations`}
        fill
        loading="lazy"
        sizes="(max-width: 620px) 100vw, 38vw"
        className={styles.industryPainSection__detailImageAsset}
      />
      <span className={styles.industryPainSection__detailImageGrade} aria-hidden="true" />
    </div>
  );
}
