import { Gem, Network, Shirt } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { VerticalRelevance } from "@/lib/content/modules/module-pages/types";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * How the module lands in the three verticals the site actually claims. Each
 * card renders only when that vertical has real content — an empty vertical is
 * left out rather than filled with a generic industry sentence.
 */
const verticals: readonly {
  key: keyof VerticalRelevance;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "apparel", label: "Apparel & footwear", icon: Shirt },
  { key: "jewellery", label: "Imitation jewellery", icon: Gem },
  { key: "franchise", label: "Franchise networks", icon: Network },
];

export function ModuleRelevance({
  relevance,
  moduleTitle,
}: {
  relevance: VerticalRelevance;
  moduleTitle: string;
}) {
  const present = verticals.filter((vertical) => relevance[vertical.key]);
  if (present.length === 0) return null;

  return (
    <section className={styles.modulePage__relevance} aria-labelledby="module-relevance">
      <div className={styles.modulePage__shell}>
        <header className={styles.modulePage__sectionHead}>
          <p className={styles.modulePage__eyebrow} data-reveal>
            <span className={styles.modulePage__eyebrowDot} aria-hidden="true" />
            Where it matters
          </p>
          <h2 id="module-relevance" data-reveal>
            {moduleTitle} in three operating contexts
          </h2>
        </header>

        <div className={styles.modulePage__relevanceGrid}>
          {present.map(({ key, label, icon: Icon }) => (
            <article key={key} className={styles.modulePage__relevanceCard} data-reveal>
              <span className={styles.modulePage__relevanceIcon} aria-hidden="true">
                <Icon size={19} />
              </span>
              <h3>{label}</h3>
              <p>{relevance[key]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
