import { Boxes, Network, Receipt, ShoppingCart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  pillars,
  streamGeometry,
  streamGeometryVertical,
  type PillarId,
} from "@/lib/content/four-pillars-data";
import { RecordObject } from "./record-object";
import styles from "../capability-pillars-grid.module.css";

const sourceIcon: Record<PillarId, LucideIcon> = {
  inventory: Boxes,
  commerce: ShoppingCart,
  network: Network,
  finance: Receipt,
};

/** Four curved streams that stay separate, then converge on the record. */
function DataStream() {
  return (
    <svg
      className={styles.streamSvg}
      viewBox="0 0 764 300"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {streamGeometry.map((stream) => (
          <linearGradient
            key={stream.id}
            id={`bz-stream-${stream.id}`}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0%" stopColor={stream.color} stopOpacity="0.32" />
            <stop offset="55%" stopColor={stream.color} stopOpacity="0.72" />
            <stop offset="100%" stopColor={stream.color} stopOpacity="0.95" />
          </linearGradient>
        ))}
        <filter id="bz-stream-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {streamGeometry.map((stream) => (
        <path
          key={stream.id}
          id={`bz-path-${stream.id}`}
          className={styles.streamPath}
          d={stream.d}
          stroke={`url(#bz-stream-${stream.id})`}
        />
      ))}

      <g className={styles.streamParticles}>
        {streamGeometry.map((stream) => (
          <circle
            key={stream.id}
            r="3.4"
            fill={stream.color}
            filter="url(#bz-stream-glow)"
          >
            <animateMotion dur="8s" repeatCount="indefinite" begin={stream.begin}>
              <mpath href={`#bz-path-${stream.id}`} />
            </animateMotion>
          </circle>
        ))}
      </g>
    </svg>
  );
}

/** The same convergence, turned downward for stacked layouts. */
function DataStreamVertical() {
  return (
    <svg
      className={styles.streamSvgVertical}
      viewBox="0 0 800 128"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {streamGeometryVertical.map((stream) => (
        <path
          key={stream.id}
          id={`bz-vpath-${stream.id}`}
          className={styles.streamPath}
          d={stream.d}
          stroke={stream.color}
          strokeOpacity="0.72"
        />
      ))}

      <g className={styles.streamParticles}>
        {streamGeometryVertical.map((stream) => (
          <circle key={stream.id} r="3.4" fill={stream.color}>
            <animateMotion dur="8s" repeatCount="indefinite" begin={stream.begin}>
              <mpath href={`#bz-vpath-${stream.id}`} />
            </animateMotion>
          </circle>
        ))}
      </g>
    </svg>
  );
}

export function RecordConvergence() {
  return (
    <div className={styles.canvas}>
      <div className={styles.canvasGrid} aria-hidden="true" />

      <header className={styles.canvasHead}>
        <h3 className={styles.canvasTitle}>Four streams. One record.</h3>
        <span className={styles.canvasNote}>
          Independent pillars, one shared operating truth
        </span>
      </header>

      <div className={styles.canvasBody}>
        <ul className={styles.sourceList}>
          {pillars.map((pillar) => {
            const Icon = sourceIcon[pillar.id];
            return (
              <li key={pillar.id} className={styles.sourceNode} data-accent={pillar.accent}>
                <span className={styles.sourceIcon}>
                  <Icon size={15} strokeWidth={2.1} aria-hidden="true" />
                </span>
                <span className={styles.sourceText}>
                  <strong>{pillar.name}</strong>
                  <small>{pillar.lines[0]}</small>
                </span>
              </li>
            );
          })}
        </ul>

        <div className={styles.streamField}>
          <DataStream />
          <DataStreamVertical />
        </div>

        <RecordObject />
      </div>
    </div>
  );
}
