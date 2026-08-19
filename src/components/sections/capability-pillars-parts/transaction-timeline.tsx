import {
  ArrowLeftRight,
  BookCheck,
  ClipboardCheck,
  PackageCheck,
  Receipt,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { timelineEvents } from "@/lib/content/four-pillars-data";
import styles from "../capability-pillars-grid.module.css";

const eventIcon: Record<string, LucideIcon> = {
  grn: ClipboardCheck,
  allocated: PackageCheck,
  transferred: ArrowLeftRight,
  sale: Receipt,
  ledger: BookCheck,
};

function TimelineEvent({ event }: { event: (typeof timelineEvents)[number] }) {
  const Icon = eventIcon[event.id];

  return (
    <li className={styles.event} data-accent={event.accent}>
      <span className={styles.eventIcon} aria-hidden="true">
        <Icon size={16} strokeWidth={2} />
      </span>
      <span className={styles.eventNode} aria-hidden="true" />
      <h4 className={styles.eventTitle}>{event.title}</h4>
      <p className={styles.eventContext}>{event.context}</p>
      <span className={styles.eventTime}>{event.time}</span>
    </li>
  );
}

/** One continuous track — not five cards. A single particle walks the stages. */
export function TransactionTimeline() {
  return (
    <div className={styles.timeline}>
      <header className={styles.timelineHead}>
        <h3 className={styles.timelineTitle}>One record in action</h3>
        <p className={styles.timelineNote}>
          Every transaction touches the same record.
        </p>
      </header>

      <div className={styles.track}>
        <svg
          className={styles.trackSvg}
          viewBox="0 0 1000 6"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {/* userSpaceOnUse: a horizontal line has a zero-height bounding
                box, which makes an objectBoundingBox gradient degenerate. */}
            <linearGradient
              id="bz-track"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="3"
              x2="1000"
              y2="3"
            >
              <stop offset="0%" stopColor="#2f6bff" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#2ec4b6" stopOpacity="1" />
              <stop offset="100%" stopColor="#2f6bff" stopOpacity="0.75" />
            </linearGradient>
            <filter id="bz-track-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="1.6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            id="bz-track-path"
            d="M0 3 H1000"
            stroke="url(#bz-track)"
            strokeWidth="2"
            fill="none"
          />

          <g className={styles.trackParticle}>
            <circle r="3.2" fill="#2ec4b6" filter="url(#bz-track-glow)">
              <animateMotion dur="10s" repeatCount="indefinite">
                <mpath href="#bz-track-path" />
              </animateMotion>
            </circle>
          </g>
        </svg>

        {/* Stacked layouts thread the same track vertically through the icons. */}
        <svg
          className={styles.trackSvgVertical}
          viewBox="0 0 6 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="bz-vtrack"
              gradientUnits="userSpaceOnUse"
              x1="3"
              y1="0"
              x2="3"
              y2="1000"
            >
              <stop offset="0%" stopColor="#2f6bff" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#2ec4b6" stopOpacity="1" />
              <stop offset="100%" stopColor="#2f6bff" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          <path
            id="bz-vtrack-path"
            d="M3 0 V1000"
            stroke="url(#bz-vtrack)"
            strokeWidth="2"
            fill="none"
          />

          <g className={styles.trackParticle}>
            <circle r="3.2" fill="#2ec4b6">
              <animateMotion dur="10s" repeatCount="indefinite">
                <mpath href="#bz-vtrack-path" />
              </animateMotion>
            </circle>
          </g>
        </svg>

        <ol className={styles.events}>
          {timelineEvents.map((event) => (
            <TimelineEvent key={event.id} event={event} />
          ))}
        </ol>
      </div>
    </div>
  );
}
