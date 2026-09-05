import type { IndustryPressure } from "@/lib/content/industries/industries";
import styles from "@/components/pages/industries/industries.module.css";

export function IndustryBottleneck({ item }: { item: IndustryPressure }) {
  return (
    <div className={styles.industryPressureSection__bottleneck}>
      <span className={styles.industryPressureSection__microLabel}>The pressure</span>
      <strong>{item.bottleneck}</strong>
      <p>{item.bottleneckDetail}</p>
    </div>
  );
}
