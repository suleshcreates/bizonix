import Image from "next/image";
import type { IndustryPressure } from "@/lib/content/industries/industries";
import styles from "@/components/pages/industries/industries.module.css";

export function IndustryOperationalImage({
  item,
  priority = false,
}: {
  item: IndustryPressure;
  priority?: boolean;
}) {
  return (
    <div className={styles.industryPressureSection__imageRegion}>
      <Image
        src={item.image}
        alt={`${item.name} operational inventory workflow`}
        fill
        priority={priority}
        sizes="(max-width: 760px) 100vw, 24vw"
        className={styles.industryPressureSection__image}
      />
      <span className={styles.industryPressureSection__imageGrade} aria-hidden="true" />
    </div>
  );
}
