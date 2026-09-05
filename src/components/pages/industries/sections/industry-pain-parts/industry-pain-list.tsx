import styles from "@/components/pages/industries/industries.module.css";
import { IndustryPainItem } from "./industry-pain-item";

export function IndustryPainList({ pains }: { pains: readonly string[] }) {
  return (
    <ol className={styles.industryPainSection__painList} aria-label="Operational pains">
      {pains.map((pain, index) => (
        <IndustryPainItem key={pain} text={pain} index={index} />
      ))}
    </ol>
  );
}
