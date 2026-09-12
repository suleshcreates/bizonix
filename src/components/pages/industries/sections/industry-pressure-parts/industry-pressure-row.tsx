import Link from "next/link";
import type { IndustryPressure } from "@/lib/content/industries/industries";
import styles from "@/components/pages/industries/industries.module.css";
import { IndustryBottleneck } from "./industry-bottleneck";
import { IndustryIdentity } from "./industry-identity";
import { IndustryOperationalImage } from "./industry-operational-image";
import { IndustryResponse } from "./industry-response";
import { IndustryTransition } from "./industry-transition";

export function IndustryPressureRow({
  item,
  index,
}: {
  item: IndustryPressure;
  index: number;
}) {
  return (
    <Link
      href={item.href}
      className={`${styles.industryPressureSection__row} ${styles["industryPressureSection__" + item.accent]}`}
      aria-label={`${item.name}: ${item.response}`}
      style={{ "--row-index": index } as React.CSSProperties}
    >
      <IndustryIdentity item={item} />
      <IndustryOperationalImage item={item} priority={index === 0} />
      <div className={styles.industryPressureSection__pressureCell}>
        <IndustryBottleneck item={item} />
        <IndustryTransition />
      </div>
      <IndustryResponse item={item} />
    </Link>
  );
}
