import {
  ArrowLeftRight,
  Package,
  Receipt,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
import { heroActivity } from "@/lib/content/product-hero-demo-data";
import styles from "./product-hero-dashboard.module.css";

const toneIcon = {
  sale: ShoppingBag,
  move: ArrowLeftRight,
  money: Receipt,
  inward: Package,
  return: RotateCcw,
} as const;

export function ProductDashboardActivity() {
  return (
    <section className={`${styles.card} ${styles.activityCard}`}>
      <header className={styles.cardHead}>
        <h3>Real-time activity</h3>
        <small>live feed</small>
      </header>

      <div className={styles.activityList}>
        {heroActivity.map((item) => {
          const Icon = toneIcon[item.tone];
          return (
            <div key={item.ref} className={styles.activityItem}>
              <span
                className={styles.activityDot}
                data-tone={item.tone}
                aria-hidden="true"
              >
                <Icon size={12} strokeWidth={2.1} />
              </span>
              <span className={styles.activityBody}>
                <strong>{item.title}</strong>
                <span>
                  {item.ref} · {item.time} ago
                </span>
              </span>
            </div>
          );
        })}

        <div className={styles.activityFoot}>
          View full audit trail
          <span>18 events today</span>
        </div>
      </div>
    </section>
  );
}
