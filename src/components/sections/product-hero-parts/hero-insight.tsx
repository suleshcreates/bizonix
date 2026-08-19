import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { heroInsights } from "@/lib/content/product-hero-demo-data";
import styles from "../product-hero.module.css";

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
      className={`${styles.insight} ${isRevenue ? styles.insightLeft : styles.insightRight}`}
      aria-hidden="true"
    >
      <span className={styles.insightLabel}>
        <i
          className={`${styles.insightPulse} ${isRevenue ? styles.insightPulseBlue : ""}`}
        />
        {data.label}
      </span>

      <strong className={styles.insightValue}>{data.value}</strong>

      <span className={styles.insightFoot}>
        <span className={styles.insightDelta}>
          {isRevenue ? (
            <ArrowUpRight size={10} strokeWidth={2.8} />
          ) : (
            <ShieldCheck size={10} strokeWidth={2.6} />
          )}
          {data.delta}
        </span>
        <span className={styles.insightCaption}>{data.caption}</span>
      </span>
    </aside>
  );
}
