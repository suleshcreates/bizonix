import { Boxes, Network, Receipt, ShoppingCart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { pillars, type PillarId } from "@/lib/content/four-pillars-demo-data";
import styles from "../four-pillars-record.module.css";

const modelIcon: Record<PillarId, LucideIcon> = {
  inventory: Boxes,
  commerce: ShoppingCart,
  network: Network,
  finance: Receipt,
};

function OperatingModelItem({
  pillar,
}: {
  pillar: (typeof pillars)[number];
}) {
  const Icon = modelIcon[pillar.id];

  return (
    <li className={styles.modelItem} data-accent={pillar.accent}>
      <span className={styles.modelIndex}>{pillar.index}</span>
      <h4 className={styles.modelItemTitle}>
        <Icon size={16} strokeWidth={2.1} aria-hidden="true" />
        {pillar.name}
      </h4>
      <p className={styles.modelItemDesc}>{pillar.modelDescription}</p>
    </li>
  );
}

export function OperatingModelRail() {
  return (
    <aside className={styles.bodyLeft} aria-label="Operating model">
      <span className={styles.modelLabel}>The operating model</span>
      <ol className={styles.modelList}>
        {pillars.map((pillar) => (
          <OperatingModelItem key={pillar.id} pillar={pillar} />
        ))}
      </ol>
    </aside>
  );
}
