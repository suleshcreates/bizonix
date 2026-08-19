import { Gem } from "lucide-react";
import {
  heroTopProducts,
  heroWorstProducts,
} from "@/lib/content/product-hero-demo-data";
import styles from "./product-hero-dashboard.module.css";

export function ProductDashboardProducts() {
  return (
    <section className={`${styles.card} ${styles.productsCard}`}>
      <header className={styles.cardHead}>
        <span className={styles.cardIcon} aria-hidden="true">
          <Gem size={12} strokeWidth={2.3} />
        </span>
        <h3>Product performance</h3>
        <small>by units sold</small>
      </header>

      <div className={styles.productsSplit}>
        <div className={styles.productsCol}>
          <small>Top selling</small>
          {heroTopProducts.map((product, index) => (
            <div
              key={product.name}
              className={`${styles.productRow} ${styles.productRowTop}`}
            >
              <span className={styles.productRank}>{index + 1}</span>
              <span>{product.name}</span>
              <strong>{product.units}</strong>
            </div>
          ))}
        </div>

        <i className={styles.productsDivider} aria-hidden="true" />

        <div className={styles.productsCol}>
          <small>Worst performing</small>
          {heroWorstProducts.map((product, index) => (
            <div
              key={product.name}
              className={`${styles.productRow} ${styles.productRowWorst}`}
            >
              <span className={styles.productRank}>{index + 1}</span>
              <span>{product.name}</span>
              <strong>{product.units}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
