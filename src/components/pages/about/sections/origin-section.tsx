"use client";

import Image from "next/image";
import {
  BarChart3,
  Clock3,
  Database,
  FileSpreadsheet,
  MessageSquareMore,
  Network,
  Unplug,
  Workflow,
} from "lucide-react";
import {
  aboutOrigin,
  type OriginIcon,
} from "@/lib/content/about/about-page";
import { useStageProgress } from "../about-motion";
import styles from "@/components/pages/about/about.module.css";

const icons = {
  sheet: FileSpreadsheet,
  message: MessageSquareMore,
  unlink: Unplug,
  clock: Clock3,
  network: Network,
  workflow: Workflow,
  database: Database,
  insights: BarChart3,
} as const;

function OriginIconGlyph({ icon }: { icon: OriginIcon }) {
  const Icon = icons[icon];
  return <Icon size={18} strokeWidth={1.8} aria-hidden="true" />;
}

/**
 * One operating reality, shown once.
 * The chip starts scattered and slightly rotated in the disconnected state,
 * and as the user scrolls, gracefully converges into a precision aligned stack
 * with solid teal-sheen borders, vibrant icons, and green validation ticks.
 */
function OriginChip({
  row,
  index,
}: {
  row: (typeof aboutOrigin.rows)[number];
  index: number;
}) {
  return (
    <li
      className={styles.about__origin__chip}
      style={
        {
          "--i": index,
          "--x0": `${row.scatter.x}px`,
          "--y0": `${row.scatter.y}px`,
          "--r0": `${row.scatter.r}deg`,
        } as React.CSSProperties
      }
    >
      <span className={styles.about__origin__chipEdge} aria-hidden="true" />

      <span className={styles.about__origin__chipIcon}>
        <i className={styles.about__origin__stateBefore}>
          <OriginIconGlyph icon={row.before.icon} />
        </i>
        <i className={styles.about__origin__stateAfter}>
          <OriginIconGlyph icon={row.after.icon} />
        </i>
      </span>

      <span className={styles.about__origin__chipLabel}>
        <b className={styles.about__origin__stateBefore}>{row.before.label}</b>
        <b className={styles.about__origin__stateAfter}>{row.after.label}</b>
      </span>

      <span className={styles.about__origin__chipTick} aria-hidden="true" />
    </li>
  );
}

export function OriginSection() {
  const { ref } = useStageProgress<HTMLDivElement>();

  return (
    <section id="origin" className={styles.about__origin__section} aria-labelledby="origin-title">
      <div className={styles.about__origin__stage} ref={ref}>
        <div className={styles.about__origin__frame}>
          <div className={styles.about__origin__copy}>
            <div className={styles.about__origin__eyebrowBadge}>
              <span className={styles.about__origin__eyebrowDot} aria-hidden="true">
                <span className={styles.about__origin__eyebrowDotPulse} />
              </span>
              <span className={styles.about__origin__eyebrowText}>{aboutOrigin.eyebrow}</span>
              <span className={styles.about__origin__eyebrowDivider} aria-hidden="true" />
              <span className={styles.about__origin__eyebrowChapter}>{aboutOrigin.chapter}</span>
            </div>

            <h2 id="origin-title" className={styles.about__origin__title}>
              The problem was never the number of tools,
              <br />
              it was the <em>distance between them.</em>
            </h2>

            <div className={styles.about__origin__paragraphs}>
              {aboutOrigin.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={index === 0 ? styles.about__origin__leadParagraph : styles.about__origin__subParagraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className={styles.about__origin__quoteCard}>
              <span className={styles.about__origin__quoteAccent} aria-hidden="true" />
              <p className={styles.about__origin__quoteText}>{aboutOrigin.quote}</p>
            </div>
          </div>

          <div className={styles.about__origin__field}>
            <figure className={styles.about__origin__plate}>
              <span className={styles.about__origin__plateRule} aria-hidden="true" />
              <Image
                src={aboutOrigin.image.src}
                alt={aboutOrigin.image.alt}
                fill
                unoptimized
                sizes="(max-width: 940px) 100vw, 50vw"
                className={styles.about__origin__plateImage}
                style={{ objectPosition: aboutOrigin.image.objectPosition }}
              />
              <span className={styles.about__origin__plateEdge} aria-hidden="true" />
              <figcaption className={styles.about__origin__plateCaption}>
                <i aria-hidden="true" />
                {aboutOrigin.image.caption}
              </figcaption>
            </figure>

            <div className={styles.about__origin__dock}>
              <div className={styles.about__origin__statusPill}>
                <span className={styles.about__origin__statusPulse} aria-hidden="true">
                  <span className={styles.about__origin__pulseCore} />
                  <span className={styles.about__origin__pulseWave} />
                </span>
                <span className={styles.about__origin__statusLabelWrap}>
                  <span className={styles.about__origin__stateBefore}>{aboutOrigin.beforeLabel}</span>
                  <span className={styles.about__origin__stateAfter}>{aboutOrigin.afterLabel}</span>
                </span>
              </div>

              <div className={styles.about__origin__column}>
                <span className={styles.about__origin__spine} aria-hidden="true" />
                <ul className={styles.about__origin__chips}>
                  {aboutOrigin.rows.map((row, index) => (
                    <OriginChip key={row.before.label} row={row} index={index} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


