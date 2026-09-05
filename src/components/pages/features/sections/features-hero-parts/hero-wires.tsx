"use client";

import type { CSSProperties } from "react";
import { CONNECTORS, H, W, pctX } from "./hero-geometry";
import styles from "@/components/pages/features/features.module.css";

/**
 * The connector layer — one system for all five wires.
 *
 * The paths are drawn in the composition's normalised space, so each one
 * starts on a card edge and ends on a screen edge by construction; nothing is
 * measured after layout and nothing can terminate mid-air. Four are gentle
 * elbows into the screen's sides, the fifth a straight vertical drop to the
 * card beneath it.
 *
 * The SVG stretches horizontally with the stage, which would skew a circular
 * marker, so the end dots are HTML rather than SVG: same coordinates, but
 * always perfectly round. `vector-effect` keeps every stroke the same weight
 * at every stage width.
 */
export function HeroWires({
  activeId,
  accent,
}: {
  activeId: string;
  accent: string;
}) {
  return (
    <div
      className={styles.wires__layer}
      style={{ "--accent": accent } as CSSProperties}
      aria-hidden="true"
    >
      <svg
        className={styles.wires__svg}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        {CONNECTORS.map((wire, index) => (
          <path
            key={wire.slot}
            className={styles.wires__path}
            d={wire.d}
            data-on={wire.slot === slotOf(activeId)}
            style={{ "--i": index } as CSSProperties}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {CONNECTORS.map((wire, index) =>
        [wire.from, wire.to].map((point, end) => (
          <span
            key={`${wire.slot}-${end}`}
            className={styles.wires__node}
            data-on={wire.slot === slotOf(activeId)}
            style={
              {
                left: pctX(point.x),
                top: `${point.y}px`,
                "--i": index,
              } as CSSProperties
            }
          />
        )),
      )}
    </div>
  );
}

/** The five capabilities keep a fixed slot, so this mapping is stable. */
function slotOf(id: string) {
  switch (id) {
    case "barcode":
      return "top-left";
    case "billing-counters":
      return "top-right";
    case "gst-compliance":
      return "bottom-left";
    case "series-pricing":
      return "bottom-right";
    default:
      return "bottom-center";
  }
}
