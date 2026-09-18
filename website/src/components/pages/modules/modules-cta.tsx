"use client";

import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { moduleIndexItems } from "@/lib/content/modules/modules-index";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * The page's last word, drawn rather than stated: nine separate threads leaving
 * nine modules and arriving at one point. The figure only draws once the
 * section is on screen, so the convergence is something you watch happen.
 */
export function ModulesCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setDrawn(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const span = 900;
  const spread = 760;

  return (
    <section
      ref={sectionRef}
      className={styles.modulesCta__cta}
      aria-labelledby="modules-cta-title"
      data-drawn={drawn}
    >
      <span className={styles.modulesCta__wash} aria-hidden="true" />

      <div className={styles.modulesCta__shell}>
        <svg
          className={styles.modulesCta__converge}
          viewBox={`0 0 ${span} 132`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {moduleIndexItems.map((module, index) => {
            const x =
              (span - spread) / 2 +
              (spread / (moduleIndexItems.length - 1)) * index;
            return (
              <path
                key={module.slug}
                className={styles.modulesCta__thread}
                d={`M${x} 0C${x} 74 450 52 450 124`}
                style={
                  {
                    "--accent": module.accent,
                    "--t": index,
                  } as CSSProperties
                }
              />
            );
          })}
          <circle className={styles.modulesCta__knot} cx={450} cy={124} r={5} />
        </svg>

        <p className={styles.modulesCta__eyebrow}>One platform, entered anywhere</p>
        <h2 id="modules-cta-title">
          See it running on your own operation.
        </h2>
        <p className={styles.modulesCta__lede}>
          Bring your real workflow — a counter, a warehouse, a franchise
          network — and we&apos;ll show you the same operation running inside
          Bizonix in 30 minutes.
        </p>

        <div className={styles.modulesCta__actions}>
          <Link className={styles.modulesCta__primary} href="/contact?utm_source=modules">
            Schedule a demo
            <ArrowRight size={17} strokeWidth={2.3} aria-hidden="true" />
          </Link>
          <Link className={styles.modulesCta__secondary} href="/industries">
            See it by industry
            <ChevronRight size={16} strokeWidth={2.3} aria-hidden="true" />
          </Link>
        </div>

        <p className={styles.modulesCta__note}>
          No obligation. Nothing installed. A working screen, not a slide deck.
        </p>
      </div>
    </section>
  );
}
