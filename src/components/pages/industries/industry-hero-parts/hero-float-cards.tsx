"use client";

import { ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { useCallback } from "react";
import type {
  FloatingBanner,
  FloatingDetailCard,
  FloatingStatRow,
  HeadlinePart,
} from "@/lib/content/industries/industry-hero-content";
import { heroIcons } from "./hero-icons";
import { useCountUp } from "./use-count-up";
import styles from "@/components/pages/industries/industries.module.css";

/* ------------------------------------------------------------- headline */

/**
 * Groups the flat `headlineParts` array into lines on `breakAfter`.
 *
 * The array is flat because a caller thinks in words and accents, not in
 * lines-of-arrays; the component thinks in lines because that is what it has
 * to stagger. This is the one place the two shapes meet.
 */
export function groupHeadlineLines(
  parts: readonly HeadlinePart[],
): HeadlinePart[][] {
  const lines: HeadlinePart[][] = [[]];
  for (const part of parts) {
    lines[lines.length - 1].push(part);
    if (part.breakAfter) lines.push([]);
  }
  return lines.filter((line) => line.length > 0);
}

export function HeadlineLine({ parts }: { parts: readonly HeadlinePart[] }) {
  return (
    <>
      {parts.map((part, index) =>
        part.accent ? (
          <em
            key={index}
            className={styles.industryHero__accent}
            data-accent={part.accent}
          >
            {part.text}
          </em>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}

/* ---------------------------------------------------------- detail card */

export function HeroDetailCard({ card }: { card: FloatingDetailCard }) {
  const Icon = heroIcons[card.icon];

  return (
    <div className={styles.industryHero__detailCard}>
      <span className={styles.industryHero__cardIcon} aria-hidden="true">
        <Icon size={16} strokeWidth={2} />
      </span>
      <div className={styles.industryHero__detailBody}>
        <strong>{card.title}</strong>
        <small>{card.meta}</small>
      </div>
      <span
        className={styles.industryHero__statusPill}
        data-tone={card.status.tone}
      >
        {card.status.text}
      </span>
    </div>
  );
}

/* ----------------------------------------------------------- stats card */

function StatValue({ row, active }: { row: FloatingStatRow; active: boolean }) {
  /* Stable across renders so the effect inside the hook is not re-run — and
     the same formatter produces the server output and every frame, so the
     figure never changes shape as it counts. */
  const format = useCallback(
    (n: number) =>
      `${row.prefix ?? ""}${n.toLocaleString("en-IN")}${row.suffix ?? ""}`,
    [row.prefix, row.suffix],
  );
  const ref = useCountUp(row.value, active, format);

  return <strong ref={ref}>{format(row.value)}</strong>;
}

export function HeroStatsCard({
  rows,
  active,
}: {
  rows: readonly FloatingStatRow[];
  active: boolean;
}) {
  return (
    <div className={styles.industryHero__statsCard}>
      {rows.map((row) => {
        const Icon = heroIcons[row.icon];
        const Trend = row.trend?.direction === "down" ? ArrowDown : ArrowUp;
        return (
          <div className={styles.industryHero__statRow} key={row.label}>
            <span className={styles.industryHero__cardIcon} aria-hidden="true">
              <Icon size={15} strokeWidth={2} />
            </span>
            <div className={styles.industryHero__statText}>
              <small>{row.label}</small>
              <StatValue row={row} active={active} />
            </div>
            {row.trend ? (
              <span
                className={styles.industryHero__trend}
                data-direction={row.trend.direction}
              >
                <Trend size={11} strokeWidth={2.6} aria-hidden="true" />
                {row.trend.label}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------- dark banner */

export function HeroBannerCard({ banner }: { banner: FloatingBanner }) {
  const Icon = heroIcons[banner.icon];

  return (
    <div className={styles.industryHero__banner}>
      <span className={styles.industryHero__bannerIcon} aria-hidden="true">
        <Icon size={15} strokeWidth={2.2} />
      </span>
      <div className={styles.industryHero__bannerText}>
        <strong>{banner.title}</strong>
        <small>{banner.subtitle}</small>
      </div>
      <ArrowRight
        className={styles.industryHero__bannerArrow}
        size={15}
        aria-hidden="true"
      />
    </div>
  );
}
