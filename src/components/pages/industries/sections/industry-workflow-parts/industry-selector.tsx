import { Gem, Network, Shirt } from "lucide-react";
import type { IndustryId } from "@/lib/content/industries/industries";
import { industryWorkflowData } from "@/lib/content/industries/industry-workflow-data";
import styles from "@/components/pages/industries/industries.module.css";

const icons = { apparel: Shirt, jewellery: Gem, franchise: Network } as const;
const ids: readonly IndustryId[] = ["apparel", "jewellery", "franchise"];

export function IndustrySelector({ activeId, onSelect }: { activeId: IndustryId; onSelect: (id: IndustryId) => void }) {
  return (
    <div className={styles.industryWorkflowSection__selector} role="group" aria-label="Choose an industry workflow">
      {ids.map((id) => {
        const item = industryWorkflowData[id];
        const Icon = icons[id];
        const active = id === activeId;
        return (
          <button key={id} type="button" className={styles.industryWorkflowSection__selectorButton} data-active={active} aria-pressed={active} onClick={() => onSelect(id)}>
            <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
            <span><strong>{item.label}</strong><small>{item.descriptor}</small></span>
          </button>
        );
      })}
    </div>
  );
}
