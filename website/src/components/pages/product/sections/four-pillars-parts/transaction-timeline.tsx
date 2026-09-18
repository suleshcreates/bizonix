"use client";

import {
  ArrowLeftRight,
  BookCheck,
  ClipboardCheck,
  FileDigit,
  PackageCheck,
  Receipt,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  recordIdentifier,
  timelineEvents,
} from "@/lib/content/product/four-pillars-demo-data";
import styles from "@/components/pages/product/product.module.css";

/**
 * One record, five states — not five events.
 *
 * The section is built so the *continuity* is the visual argument. A single
 * record chip opens the journey and a matching end cap closes it with the same
 * identifier, and between them the rail is assembled from per-step segments so
 * the line terminates exactly on the last node and a hovered step can light
 * its own segment. Wide viewports read it left to right, narrow ones top to
 * bottom; both are this DOM, so the two are the same story rather than two
 * pieces of content.
 *
 * Motion is CSS. This component contributes one thing: `data-in`, flipped by
 * an IntersectionObserver so the entrance plays when the section is reached
 * rather than while it is still far below the fold. Everything renders in its
 * finished state if the observer never runs, and reduced motion opts out of
 * both the entrance and the travelling signal in the stylesheet.
 */

const eventIcon: Record<string, LucideIcon> = {
  grn: ClipboardCheck,
  allocated: PackageCheck,
  transferred: ArrowLeftRight,
  sale: Receipt,
  ledger: BookCheck,
};

export function TransactionTimeline() {
  const ref = useRef<HTMLDivElement>(null);

  /* The flag is written straight to the node rather than held in state: it
     changes once, nothing else depends on it, and a re-render would only
     replace markup the browser is already animating. */
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.dataset.in = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.dataset.in = "true";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={styles.fourPillarsRecord__journey}
      data-in="false"
    >
      <header className={styles.fourPillarsRecord__journeyHead}>
        <p className={styles.fourPillarsRecord__journeyEyebrow}>
          Record journey
        </p>
        <h3 className={styles.fourPillarsRecord__journeyTitle}>
          One record{" "}
          <span className={styles.fourPillarsRecord__journeyAccent}>
            in action
          </span>
        </h3>
        <p className={styles.fourPillarsRecord__journeyNote}>
          Every transaction touches the same record.
        </p>
      </header>

      {/* The identity row. The same identifier opens and closes the journey,
          which is the whole claim of the section stated twice in one line. */}
      <div className={styles.fourPillarsRecord__identity}>
        <span className={styles.fourPillarsRecord__recordChip}>
          <FileDigit size={15} strokeWidth={2.1} aria-hidden="true" />
          <b>One record</b>
          <em>{recordIdentifier}</em>
        </span>
        <span className={styles.fourPillarsRecord__identityRule} aria-hidden="true" />
        <span className={styles.fourPillarsRecord__identityEnd}>
          Same record ·{" "}
          <em>{`${timelineEvents.length} states`}</em>
        </span>
      </div>

      <ol
        className={styles.fourPillarsRecord__steps}
        style={
          { "--step-count": timelineEvents.length } as React.CSSProperties
        }
      >
        {timelineEvents.map((event, index) => {
          const Icon = eventIcon[event.id];
          const last = index === timelineEvents.length - 1;

          return (
            <li
              key={event.id}
              className={styles.fourPillarsRecord__step}
              style={{ "--i": index } as React.CSSProperties}
            >
              <span className={styles.fourPillarsRecord__stepRail}>
                <span
                  className={styles.fourPillarsRecord__stepNode}
                  aria-hidden="true"
                >
                  <Icon size={15} strokeWidth={2.1} />
                </span>
                {last ? null : (
                  <span
                    className={styles.fourPillarsRecord__connector}
                    aria-hidden="true"
                  >
                    <i className={styles.fourPillarsRecord__connectorFill} />
                    <i className={styles.fourPillarsRecord__connectorSignal} />
                  </span>
                )}
              </span>

              <span className={styles.fourPillarsRecord__stepNumber}>
                {event.number}
              </span>
              <h4 className={styles.fourPillarsRecord__stepTitle}>
                {event.title}
              </h4>
              <p className={styles.fourPillarsRecord__stepContext}>
                {event.context}
              </p>
              <span className={styles.fourPillarsRecord__stepState}>
                {event.state}
              </span>
              <span className={styles.fourPillarsRecord__stepTime}>
                {event.time}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
