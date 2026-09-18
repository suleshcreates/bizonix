import { ArrowUpRight } from "lucide-react";
import type { IndustryPressure } from "@/lib/content/industries/industries";
import styles from "@/components/pages/industries/industries.module.css";

export function IndustryResponse({ item }: { item: IndustryPressure }) {
  return (
    <div className={styles.industryPressureSection__response}>
      <span className={styles.industryPressureSection__microLabel}>The response</span>
      <strong>{item.response}</strong>
      <p>{item.responseDetail}</p>
      <ArrowUpRight className={styles.industryPressureSection__rowArrow} aria-hidden="true" size={20} />
    </div>
  );
}
