import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import styles from "@/components/pages/product/product.module.css";

export function SystemMapHeader() {
  return (
    <div className={styles.finalSystemMap__editorial}>
      <div className={styles.finalSystemMap__eyebrowWrap}>
        <span className={styles.finalSystemMap__eyebrowLine} aria-hidden="true" />
        <span className={styles.finalSystemMap__eyebrowText}>
          See the operating model on your business
        </span>
      </div>

      <h2 className={styles.finalSystemMap__headline}>
        <span className={styles.finalSystemMap__headlineLead}>Bring the workflow.</span>{" "}
        Leave with a{" "}
        <span className={styles.finalSystemMap__headlineHighlight}>clearer system map.</span>
      </h2>

      <p className={styles.finalSystemMap__supportingCopy}>
        Bizonix connects every part of your business so you can see the whole
        picture, act with confidence and grow without adding complexity.
      </p>

      <div className={styles.finalSystemMap__ctaRow}>
        <Link href="/contact" className={styles.finalSystemMap__primaryButton}>
          <span>Book a demo</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>

        <Link href="/contact" className={styles.finalSystemMap__secondaryButton}>
          <span>Explore modules</span>
        </Link>
      </div>

      <div className={styles.finalSystemMap__supportingLine}>
        <ShieldCheck
          size={16}
          className={styles.finalSystemMap__supportingLineIcon}
          aria-hidden="true"
        />
        <span>No lock-in. No long contracts. Just clarity.</span>
      </div>
    </div>
  );
}
