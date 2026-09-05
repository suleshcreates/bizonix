import { Gem } from "lucide-react";
import {
  heroTopProducts,
  heroWorstProducts,
} from "@/lib/content/product/product-hero-demo-data";
import styles from "@/components/pages/product/product.module.css";

export function ProductDashboardProducts() {
  return (
    <section className={`${styles.productHeroDashboard__card} ${styles.productHeroDashboard__productsCard}`}>
      <header className={styles.productHeroDashboard__cardHead}>
        <span className={styles.productHeroDashboard__cardIcon} aria-hidden="true">
          <Gem size={12} strokeWidth={2.3} />
        </span>
        <h3>Product performance</h3>
        <small>by units sold</small>
      </header>

      <div className={styles.productHeroDashboard__productsSplit}>
        <div className={styles.productHeroDashboard__productsCol}>
          <small>Top selling</small>
          {heroTopProducts.map((product, index) => (
            <div
              key={product.name}
              className={`${styles.productHeroDashboard__productRow} ${styles.productHeroDashboard__productRowTop}`}
            >
              <span className={styles.productHeroDashboard__productRank}>{index + 1}</span>
              <span>{product.name}</span>
              <strong>{product.units}</strong>
            </div>
          ))}
        </div>

        <i className={styles.productHeroDashboard__productsDivider} aria-hidden="true" />

        <div className={styles.productHeroDashboard__productsCol}>
          <small>Worst performing</small>
          {heroWorstProducts.map((product, index) => (
            <div
              key={product.name}
              className={`${styles.productHeroDashboard__productRow} ${styles.productHeroDashboard__productRowWorst}`}
            >
              <span className={styles.productHeroDashboard__productRank}>{index + 1}</span>
              <span>{product.name}</span>
              <strong>{product.units}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
