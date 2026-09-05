"use client";

import { Bell, ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { moduleScreens } from "@/lib/content/modules/module-hero-screens";
import type { ModuleSlug } from "@/lib/content/modules/module-pages/types";
import { ModuleScreenBody } from "./screens";
import styles from "@/components/pages/modules/modules.module.css";

/** How long the live tick rests on one row before moving to the next. */
const TICK_MS = 3200;

/**
 * The universal hero product surface.
 *
 * One frame — application chrome, page head, three operating figures, the
 * module's own surface, a status line — rendered identically on all nine
 * module pages. `moduleScreens[slug]` decides what goes inside it.
 *
 * The frame owns a single slow heartbeat and hands it to the screen body, so
 * whichever shape is rendered has one row resting under attention at a time.
 * Reduced motion stops the heartbeat on the first row.
 *
 * Every figure is synthetic marketing data; nothing is captured from a tenant.
 */
export function ProductSimulation({ slug }: { slug: ModuleSlug }) {
  const data = moduleScreens[slug];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setActive((n) => n + 1), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.screens__frame} data-shape={data.shape} aria-hidden="true">
      <div className={styles.screens__chrome}>
        <span className={styles.screens__brand}>
          <span className={styles.screens__mark}>B</span>
          Bizonix
        </span>
        <span className={styles.screens__workspace}>
          {data.app}
          <ChevronDown size={12} strokeWidth={2.4} />
        </span>
        <span className={styles.screens__chromeRight}>
          <span className={styles.screens__search}>
            <Search size={12} strokeWidth={2.4} />
            Search
          </span>
          <span className={styles.screens__icon}>
            <Bell size={13} strokeWidth={2} />
            <i />
          </span>
          <span className={styles.screens__avatar}>MS</span>
        </span>
      </div>

      <div className={styles.screens__head}>
        <span className={styles.screens__headText}>
          <strong>{data.title}</strong>
          <em>{data.context}</em>
        </span>
        <span className={styles.screens__control}>
          <SlidersHorizontal size={11} strokeWidth={2.3} />
          {data.control}
          <ChevronDown size={11} strokeWidth={2.4} />
        </span>
      </div>

      <div className={styles.screens__metrics}>
        {data.metrics.map((metric, index) => (
          <div key={metric.label} style={{ "--i": index } as CSSProperties}>
            <span className={styles.screens__metricLabel}>{metric.label}</span>
            <span className={styles.screens__metricValue}>{metric.value}</span>
            <span className={styles.screens__metricNote} data-tone={metric.tone}>
              {metric.note}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.screens__body}>
        <ModuleScreenBody data={data} active={active} />
      </div>

      <div className={styles.screens__foot}>
        <span className={styles.screens__footDot} />
        {data.foot}
      </div>
    </div>
  );
}
