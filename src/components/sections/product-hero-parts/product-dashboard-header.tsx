import { Building2, ChevronDown } from "lucide-react";
import { heroNav, heroWorkspace } from "@/lib/content/product-hero-demo-data";
import styles from "./product-hero-dashboard.module.css";

export function ProductDashboardHeader() {
  return (
    <div className={styles.chrome}>
      <div className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true">
          B
        </span>
        <span className={styles.brandText}>
          <strong>Bizonix</strong>
          <span>{heroWorkspace.title}</span>
        </span>
      </div>

      <div className={styles.chromeNav}>
        {heroNav.map((item, index) => (
          <span
            key={item}
            className={index === 0 ? styles.chromeNavActive : undefined}
          >
            {item}
          </span>
        ))}
      </div>

      <div className={styles.chromeRight}>
        <span className={styles.entityChip}>
          <Building2 size={12} strokeWidth={2.1} />
          {heroWorkspace.scope}
          <ChevronDown size={11} strokeWidth={2.4} />
        </span>

        <span className={styles.segmented}>
          {heroWorkspace.periods.map((period) => (
            <span
              key={period}
              className={
                period === heroWorkspace.activePeriod
                  ? styles.segmentedActive
                  : undefined
              }
            >
              {period}
            </span>
          ))}
        </span>

        <span className={styles.livePill}>
          <i className={styles.liveDot} />
          {heroWorkspace.status}
        </span>
      </div>
    </div>
  );
}
