"use client";

import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { trackModuleEvent } from "@/lib/analytics";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * The single closing conversion. One CTA section per page — the hero already
 * carries the same primary action, and repeating a third full band would just
 * dilute both.
 */
export function ModuleCta({
  moduleTitle,
  moduleSlug,
  outcome,
}: {
  moduleTitle: string;
  moduleSlug: string;
  outcome: string;
}) {
  return (
    <section
      className={`${styles.modulePage__cta} ${styles.modulePage__onDark}`}
      aria-labelledby="module-cta"
    >
      <div className={styles.modulePage__shell}>
        <div className={styles.modulePage__ctaInner}>
          <p className={styles.modulePage__eyebrow} data-reveal>
            <span className={styles.modulePage__eyebrowDot} aria-hidden="true" />
            {moduleTitle}
          </p>
          <h2 id="module-cta" data-reveal>
            Bring your workflow. We&rsquo;ll run it through {moduleTitle}.
          </h2>
          <p data-reveal>
            {outcome} A demo is worked against your own operation — your
            locations, your documents, your month-end — rather than a scripted
            tour.
          </p>
          <div className={styles.modulePage__ctaActions} data-reveal>
            <Link
              className={styles.modulePage__primary}
              href="/contact"
              onClick={() =>
                trackModuleEvent("module_cta_clicked", {
                  module: moduleSlug,
                  placement: "closing",
                })
              }
            >
              Book a demo
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className={styles.modulePage__secondary} href="/modules">
              All nine modules
              <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
