import { ArrowRight } from "lucide-react";
import Link from "next/link";
import styles from "../product-hero.module.css";

export function ProductHeroCopy() {
  return (
    <div className={styles.copy}>
      <p className={styles.eyebrow}>
        <i className={styles.eyebrowDot} aria-hidden="true" />
        One platform • Every operating entity
      </p>

      <h1 className={styles.title}>
        <span className={styles.titleLine}>Build and Run Multi-Entity</span>{" "}
        <span className={styles.titleLine}>
          Operations <span className={styles.titleHighlight}>10x Faster</span>
        </span>
      </h1>

      <p className={styles.summary}>
        The complete cloud ERP designed for modern retail, wholesale, and
        franchise brands. Connect inventory, billing, transfers, and financials
        into one unified source of truth.
      </p>

      <div className={styles.actions}>
        <Link href="/contact" className={styles.btnPrimary}>
          Book a Demo
          <ArrowRight size={16} strokeWidth={2.3} />
        </Link>
        <Link href="#operating-model" className={styles.btnSecondary}>
          Explore Platform
        </Link>
      </div>
    </div>
  );
}
