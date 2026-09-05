import { ArrowRight } from "lucide-react";
import Link from "next/link";
import styles from "@/components/pages/product/product.module.css";

export function ProductHeroCopy() {
  return (
    <div className={styles.productHero__copy}>
      <p className={styles.productHero__eyebrow}>
        <i className={styles.productHero__eyebrowDot} aria-hidden="true" />
        One platform • Every operating entity
      </p>

      <h1 className={styles.productHero__title}>
        <span className={styles.productHero__titleLine}>
          Build and Run Multi-Entity
        </span>{" "}
        <span className={styles.productHero__titleLine}>
          Operations{" "}
          <span className={styles.productHero__titleHighlight}>10x Faster</span>
        </span>
      </h1>

      <p className={styles.productHero__summary}>
        The complete cloud ERP designed for modern retail, wholesale, and
        franchise brands. Connect inventory, billing, transfers, and financials
        into one unified source of truth.
      </p>

      <div className={styles.productHero__actions}>
        <Link href="/contact" className={styles.productHero__btnPrimary}>
          Book a Demo
          <ArrowRight size={16} strokeWidth={2.3} />
        </Link>
        <Link
          href="#operating-model"
          className={styles.productHero__btnSecondary}
        >
          Explore Platform
        </Link>
      </div>
    </div>
  );
}
