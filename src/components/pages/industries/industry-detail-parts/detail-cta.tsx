import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { IndustryDetail } from "@/lib/content/industries/industry-detail";
import styles from "@/components/pages/industries/industries.module.css";

export function DetailCta({ cta }: { cta: IndustryDetail["cta"] }) {
  return (
    <section className={styles.industryDetailPage__cta} aria-labelledby="cta-title">
      <div className={`${styles.industryDetailPage__shell} ${styles.industryDetailPage__ctaInner}`}>
        <div>
          <p className={styles.industryDetailPage__eyebrow}>
            <span className={styles.industryDetailPage__eyebrowDot} aria-hidden="true" />
            Built for the way apparel moves
          </p>
          <h2 id="cta-title">{cta.title}</h2>
          <p className={styles.industryDetailPage__ctaBody}>{cta.body}</p>
        </div>

        <div className={styles.industryDetailPage__actions}>
          <Link
            className={styles.industryDetailPage__primary}
            href="/contact?utm_source=apparel-footwear"
          >
            Book a demo
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className={styles.industryDetailPage__secondary} href="/modules">
            Explore all modules
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
