import { TriangleAlert } from "lucide-react";
import { heroAlerts } from "@/lib/content/product/product-hero-demo-data";
import styles from "@/components/pages/product/product.module.css";

export function ProductDashboardAlerts() {
  const critical = heroAlerts.filter((item) => item.tone === "critical").length;

  return (
    <section className={`${styles.productHeroDashboard__card} ${styles.productHeroDashboard__alertsCard}`}>
      <header className={styles.productHeroDashboard__cardHead}>
        <span className={styles.productHeroDashboard__cardIcon} aria-hidden="true">
          <TriangleAlert size={12} strokeWidth={2.3} />
        </span>
        <h3>Alerts &amp; action center</h3>
        <span className={styles.productHeroDashboard__alertsCount}>{critical} critical</span>
      </header>

      <div className={styles.productHeroDashboard__alertsList}>
        {heroAlerts.map((alert) => (
          <div key={alert.label} className={styles.productHeroDashboard__alertRow} data-tone={alert.tone}>
            <i className={styles.productHeroDashboard__alertBullet} aria-hidden="true" />
            <span>{alert.label}</span>
            <small>{alert.detail}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
