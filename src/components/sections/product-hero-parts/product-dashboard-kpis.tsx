import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { heroKpis } from "@/lib/content/product-hero-demo-data";
import styles from "./product-hero-dashboard.module.css";

const deltaStyle = {
  up: styles.deltaUp,
  down: styles.deltaDown,
  flat: styles.deltaFlat,
} as const;

const DeltaIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
} as const;

export function ProductDashboardKpis() {
  return (
    <div className={styles.kpiRow}>
      {heroKpis.map((kpi) => {
        const Icon = DeltaIcon[kpi.trend];
        return (
          <div key={kpi.label} className={styles.kpi}>
            <span className={styles.kpiLabel}>{kpi.label}</span>
            <span className={styles.kpiValue}>{kpi.value}</span>
            <span className={styles.kpiFoot}>
              <span className={`${styles.kpiDelta} ${deltaStyle[kpi.trend]}`}>
                <Icon size={10} strokeWidth={2.6} />
                {kpi.delta}
              </span>
              <span className={styles.kpiNote}>{kpi.note}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
