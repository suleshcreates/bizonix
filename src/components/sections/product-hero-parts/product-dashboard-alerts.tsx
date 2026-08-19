import { TriangleAlert } from "lucide-react";
import { heroAlerts } from "@/lib/content/product-hero-demo-data";
import styles from "./product-hero-dashboard.module.css";

export function ProductDashboardAlerts() {
  const critical = heroAlerts.filter((item) => item.tone === "critical").length;

  return (
    <section className={`${styles.card} ${styles.alertsCard}`}>
      <header className={styles.cardHead}>
        <span className={styles.cardIcon} aria-hidden="true">
          <TriangleAlert size={12} strokeWidth={2.3} />
        </span>
        <h3>Alerts &amp; action center</h3>
        <span className={styles.alertsCount}>{critical} critical</span>
      </header>

      <div className={styles.alertsList}>
        {heroAlerts.map((alert) => (
          <div key={alert.label} className={styles.alertRow} data-tone={alert.tone}>
            <i className={styles.alertBullet} aria-hidden="true" />
            <span>{alert.label}</span>
            <small>{alert.detail}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
