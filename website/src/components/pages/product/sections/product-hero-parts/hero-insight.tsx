import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { heroInsights } from "@/lib/content/product/product-hero-demo-data";
import styles from "@/components/pages/product/product.module.css";

type HeroInsightProps = {
  side: "left" | "right";
};

/**
 * Two secondary signals that appear to lift off the dashboard edges. Values are
 * fictional demo figures from productHeroDemoData.
 */
export function HeroInsight({ side }: HeroInsightProps) {
  const isRevenue = side === "left";
  const data = isRevenue ? heroInsights.revenue : heroInsights.inventory;

  return (
    <aside
      className={`${styles.productHero__insight} ${isRevenue ? styles.productHero__insightLeft : styles.productHero__insightRight}`}
      aria-hidden="true"
    >
      <span className={styles.productHero__insightLabel}>
        <i
          className={`${styles.productHero__insightPulse} ${isRevenue ? styles.productHero__insightPulseBlue : ""}`}
        />
        {data.label}
      </span>

      <strong className={styles.productHero__insightValue}>{data.value}</strong>

      <span className={styles.productHero__insightFoot}>
        <span className={styles.productHero__insightDelta}>
          {isRevenue ? (
            <ArrowUpRight size={10} strokeWidth={2.8} />
          ) : (
            <ShieldCheck size={10} strokeWidth={2.6} />
          )}
          {data.delta}
        </span>
        <span className={styles.productHero__insightCaption}>{data.caption}</span>
      </span>
    </aside>
  );
}
