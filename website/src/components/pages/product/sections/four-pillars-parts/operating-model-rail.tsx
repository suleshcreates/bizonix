import { Boxes, Network, Receipt, ShoppingCart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { pillars, type PillarId } from "@/lib/content/product/four-pillars-demo-data";
import styles from "@/components/pages/product/product.module.css";

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
    <li className={styles.fourPillarsRecord__modelItem} data-accent={pillar.accent}>
      <span className={styles.fourPillarsRecord__modelIndex}>{pillar.index}</span>
      {/* h3, not h4: these four pillars are the first subheadings under the
          section's h2, so an h4 skipped a level in the page outline. Styling
          is by class, so the level change is invisible. */}
      <h3 className={styles.fourPillarsRecord__modelItemTitle}>
        <Icon size={16} strokeWidth={2.1} aria-hidden="true" />
        {pillar.name}
      </h3>
      <p className={styles.fourPillarsRecord__modelItemDesc}>{pillar.modelDescription}</p>
    </li>
  );
}

export function OperatingModelRail() {
  return (
    <aside className={styles.fourPillarsRecord__bodyLeft} aria-label="Operating model">
      <span className={styles.fourPillarsRecord__modelLabel}>The operating model</span>
      <ol className={styles.fourPillarsRecord__modelList}>
        {pillars.map((pillar) => (
          <OperatingModelItem key={pillar.id} pillar={pillar} />
        ))}
      </ol>
    </aside>
  );
}
