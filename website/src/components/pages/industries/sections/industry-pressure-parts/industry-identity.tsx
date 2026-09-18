import { Gem, Network, Shirt } from "lucide-react";
import type { IndustryPressure } from "@/lib/content/industries/industries";
import styles from "@/components/pages/industries/industries.module.css";

const icons = { apparel: Shirt, jewellery: Gem, franchise: Network } as const;

export function IndustryIdentity({ item }: { item: IndustryPressure }) {
  const Icon = icons[item.id];
  return (
    <div className={styles.industryPressureSection__identity}>
      <span className={styles.industryPressureSection__number}>{item.number}</span>
      <Icon aria-hidden="true" size={19} strokeWidth={1.7} />
      <h3>{item.name}</h3>
    </div>
  );
}
