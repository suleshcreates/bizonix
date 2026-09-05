import {
  BarChart4,
  Boxes,
  LayoutGrid,
  Receipt,
  Settings2,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { ProductDashboardActivity } from "./product-dashboard-activity";
import { ProductDashboardAlerts } from "./product-dashboard-alerts";
import {
  ProductDashboardBranchSales,
  ProductDashboardSalesTrend,
} from "./product-dashboard-charts";
import { ProductDashboardHeader } from "./product-dashboard-header";
import { ProductDashboardInventory } from "./product-dashboard-inventory";
import { ProductDashboardKpis } from "./product-dashboard-kpis";
import { ProductDashboardProducts } from "./product-dashboard-products";
import styles from "@/components/pages/product/product.module.css";

const railIcons = [LayoutGrid, ShoppingCart, Boxes, Receipt, Wallet, BarChart4];

/**
 * A marketing recreation of the Bizonix operations dashboard. It renders from
 * local, fictional data only — no API, database, or tenant access.
 */
export function ProductHeroDashboard() {
  return (
    <div className={styles.productHeroDashboard__panel}>
      <ProductDashboardHeader />

      <div className={styles.productHeroDashboard__body}>
        <div className={styles.productHeroDashboard__rail} aria-hidden="true">
          {railIcons.map((Icon, index) => (
            <span
              key={index}
              className={`${styles.productHeroDashboard__railItem} ${index === 0 ? styles.productHeroDashboard__railItemActive : ""}`}
            >
              <Icon size={16} strokeWidth={1.9} />
            </span>
          ))}
          <span className={styles.productHeroDashboard__railSpacer} />
          <span className={styles.productHeroDashboard__railItem}>
            <Settings2 size={16} strokeWidth={1.9} />
          </span>
        </div>

        <div className={styles.productHeroDashboard__canvas}>
          <ProductDashboardKpis />
          <ProductDashboardSalesTrend />
          <ProductDashboardBranchSales />
          <ProductDashboardActivity />
          <ProductDashboardProducts />
          <ProductDashboardAlerts />
          <ProductDashboardInventory />
        </div>
      </div>
    </div>
  );
}
