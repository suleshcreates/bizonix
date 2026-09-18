"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { moduleIndexItems } from "@/lib/content/modules/modules-index";
import type { IndustryDetail } from "@/lib/content/industries/industry-detail";
import styles from "../industries.module.css";

export function ModuleFit({ fit }: { fit: IndustryDetail["fit"] }) {
  const root = useRef<HTMLElement>(null);
  const [scrollActive, setScrollActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const active = selected ?? scrollActive;

  useEffect(() => {
    if (reduced || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 65%",
        end: "bottom 40%",
        onUpdate: ({ progress }) => {
          setSelected(null);
          setScrollActive(
            Math.min(
              fit.modules.length - 1,
              Math.floor(progress * fit.modules.length),
            ),
          );
        },
      });
    }, root);
    return () => context.revert();
  }, [fit.modules.length, reduced]);

  return (
    <section
      ref={root}
      className={styles.industryDetailPage__fit}
      id="fits"
      aria-labelledby="fit-title"
    >
      <div className={styles.industryDetailPage__shell}>
        <div className={styles.industryDetailPage__fitHead}>
          <p className={styles.industryDetailPage__eyebrow}>
            <span
              className={styles.industryDetailPage__eyebrowDot}
              aria-hidden="true"
            />
            How Bizonix fits
          </p>
          <h2 id="fit-title">{fit.title}</h2>
          <p className={styles.industryDetailPage__fitLede}>{fit.body}</p>
        </div>

        <div className={styles.fitJourney}>
          <div className={styles.fitJourneyHeader}>
            <span>One operating record</span>
            <span>
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(fit.modules.length).padStart(2, "0")}
            </span>
          </div>
          <div className={styles.fitProgress} aria-hidden="true">
            <motion.span
              animate={{ scaleX: (active + 1) / fit.modules.length }}
              transition={{ duration: reduced ? 0 : 0.4, ease: "easeOut" }}
            />
          </div>
          <ul
            className={styles.fitCards}
            onMouseLeave={() => setSelected(null)}
          >
            {fit.modules.map((item, index) => {
              const moduleInfo = moduleIndexItems.find(
                (entry) => entry.title === item.name,
              );
              const Icon = moduleInfo?.icon;
              return (
                <motion.li
                  key={item.name}
                  className={styles.fitCard}
                  style={
                    {
                      "--fit-accent": moduleInfo?.accent ?? "var(--bz-blue)",
                    } as CSSProperties
                  }
                  data-active={active === index}
                  initial={false}
                  whileInView={
                    reduced ? {} : { opacity: [0.55, 1], y: [12, 0] }
                  }
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: reduced ? 0 : 0.45,
                    delay: index * 0.04,
                  }}
                  onMouseEnter={() => setSelected(index)}
                >
                  <button
                    type="button"
                    className={styles.fitSelect}
                    aria-pressed={active === index}
                    aria-label={`Highlight ${item.name}`}
                    onFocus={() => setSelected(index)}
                    onBlur={() => setSelected(null)}
                    onClick={() => setSelected(index)}
                    onKeyDown={(event) => {
                      if (
                        ![
                          "ArrowRight",
                          "ArrowLeft",
                          "ArrowDown",
                          "ArrowUp",
                        ].includes(event.key)
                      )
                        return;
                      event.preventDefault();
                      const direction = ["ArrowRight", "ArrowDown"].includes(
                        event.key,
                      )
                        ? 1
                        : -1;
                      const buttons =
                        root.current?.querySelectorAll<HTMLButtonElement>(
                          "button",
                        );
                      buttons?.[
                        (index + direction + fit.modules.length) %
                          fit.modules.length
                      ]?.focus();
                    }}
                  >
                    <span className={styles.fitCardTop}>
                      {Icon && (
                        <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                      )}
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </span>
                    <strong>{item.name}</strong>
                    <span className={styles.fitCardBody}>{item.body}</span>
                  </button>
                  {moduleInfo && (
                    <Link
                      className={styles.fitModuleLink}
                      href={`/modules/${moduleInfo.slug}`}
                    >
                      Explore {item.name}{" "}
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  )}
                </motion.li>
              );
            })}
          </ul>
          <p className={styles.fitHint}>
            Connected modules. Shared context. Clear entity boundaries.
          </p>
        </div>
      </div>
    </section>
  );
}
