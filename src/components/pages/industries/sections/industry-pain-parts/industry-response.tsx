import type { IndustryPainStory } from "@/lib/content/industries/industry-pain-data";
import styles from "@/components/pages/industries/industries.module.css";
import { PainTransformation } from "./pain-transformation";

export function IndustryResponse({
  item,
  expanded = false,
}: {
  item: IndustryPainStory;
  expanded?: boolean;
}) {
  return (
    <div className={expanded ? styles.industryPainSection__expandedResponse : styles.industryPainSection__response}>
      <span className={styles.industryPainSection__microLabel}>The response</span>
      <strong>{item.response}</strong>
      <p>{item.responseDetail}</p>
      {expanded ? <PainTransformation /> : null}
    </div>
  );
}
