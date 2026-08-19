import { BarChart3, TrendingUp } from "lucide-react";
import {
  heroBranchSales,
  heroSalesTrend,
  heroSalesTrendAxis,
} from "@/lib/content/product-hero-demo-data";
import styles from "./product-hero-dashboard.module.css";

/* Chart geometry is fixed in viewBox units and stretched horizontally, so the
   bar rhythm stays even at every panel width. */
const VIEW_W = 320;
const VIEW_H = 104;
const BASELINE = 92;
const TOP = 6;
const PITCH = VIEW_W / heroSalesTrend.length;
const BAR_W = PITCH * 0.56;
const SCALE = 100;

const barX = (index: number) => index * PITCH + (PITCH - BAR_W) / 2;
const barY = (value: number) => BASELINE - (value / SCALE) * (BASELINE - TOP);

/** Quadratic smoothing through the top of every bar. */
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    d += `Q${current.x} ${current.y} ${(current.x + next.x) / 2} ${(current.y + next.y) / 2}`;
  }
  const last = points[points.length - 1];
  d += `L${last.x} ${last.y}`;
  return d;
}

export function ProductDashboardSalesTrend() {
  const peak = Math.max(...heroSalesTrend);
  const linePoints = heroSalesTrend.map((value, index) => ({
    x: barX(index) + BAR_W / 2,
    y: barY(value),
  }));

  return (
    <section className={`${styles.card} ${styles.trendCard}`}>
      <header className={styles.cardHead}>
        <span className={styles.cardIcon} aria-hidden="true">
          <TrendingUp size={12} strokeWidth={2.3} />
        </span>
        <h3>Sales trend</h3>
        <small>Daily · last 16 days</small>
      </header>

      <div className={styles.trendTop}>
        <span className={styles.trendTotal}>{heroSalesTrendAxis.total}</span>
        <span className={styles.trendMeta}>
          <span className={`${styles.kpiDelta} ${styles.deltaUp}`}>
            ↑ {heroSalesTrendAxis.delta}
          </span>
          <span>peak {heroSalesTrendAxis.peak}</span>
        </span>
      </div>

      <div className={styles.trendChart}>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="Illustrative sales trend for the demo period"
        >
          <defs>
            <linearGradient id="bzTrendBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2f6bff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#2f6bff" stopOpacity="0.28" />
            </linearGradient>
          </defs>

          {[TOP, 34, 63, BASELINE].map((y) => (
            <line
              key={y}
              className={styles.gridLine}
              x1="0"
              y1={y}
              x2={VIEW_W}
              y2={y}
            />
          ))}

          {heroSalesTrend.map((value, index) => (
            <rect
              key={index}
              className={
                value === peak ? styles.trendBarPeak : styles.trendBar
              }
              x={barX(index)}
              y={barY(value)}
              width={BAR_W}
              height={BASELINE - barY(value)}
              rx="2"
            />
          ))}

          <path className={styles.trendLine} d={smoothPath(linePoints)} />
        </svg>
      </div>

      <footer className={styles.trendAxis}>
        <span>{heroSalesTrendAxis.from}</span>
        <span>{heroSalesTrendAxis.to}</span>
      </footer>
    </section>
  );
}

export function ProductDashboardBranchSales() {
  return (
    <section className={`${styles.card} ${styles.branchCard}`}>
      <header className={styles.cardHead}>
        <span className={styles.cardIcon} aria-hidden="true">
          <BarChart3 size={12} strokeWidth={2.3} />
        </span>
        <h3>Branch-wise sales</h3>
        <small>comparison</small>
      </header>

      <div className={styles.branchList}>
        {heroBranchSales.map((branch, index) => (
          <div key={branch.name} className={styles.branchRow}>
            <div className={styles.branchTop}>
              <span>{branch.name}</span>
              <strong>{branch.value}</strong>
            </div>
            <div className={styles.branchTrack}>
              <i
                className={styles.branchFill}
                data-rank={index}
                style={{ width: `${branch.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
