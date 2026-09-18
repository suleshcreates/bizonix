import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { heroKpis } from "@/lib/content/product/product-hero-demo-data";
import styles from "@/components/pages/product/product.module.css";

const deltaStyle = {
  up: styles.productHeroDashboard__deltaUp,
  down: styles.productHeroDashboard__deltaDown,
  flat: styles.productHeroDashboard__deltaFlat,
} as const;

const DeltaIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
} as const;

export function ProductDashboardKpis() {
  return (
    <div className={styles.productHeroDashboard__kpiRow}>
      {heroKpis.map((kpi) => {
        const Icon = DeltaIcon[kpi.trend];
        return (
          <div key={kpi.label} className={styles.productHeroDashboard__kpi}>
            <span className={styles.productHeroDashboard__kpiLabel}>{kpi.label}</span>
            <span className={styles.productHeroDashboard__kpiValue}>{kpi.value}</span>
            <span className={styles.productHeroDashboard__kpiFoot}>
              <span className={`${styles.productHeroDashboard__kpiDelta} ${deltaStyle[kpi.trend]}`}>
                <Icon size={10} strokeWidth={2.6} />
                {kpi.delta}
              </span>
              <span className={styles.productHeroDashboard__kpiNote}>{kpi.note}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
