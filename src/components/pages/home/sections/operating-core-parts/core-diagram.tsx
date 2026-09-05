import Image from "next/image";
import type { CSSProperties } from "react";
import { operatingLanes } from "@/lib/content/home/operating-core-data";
import styles from "@/components/pages/home/home.module.css";

/**
 * The desktop convergence diagram: three paths fanning down from the three lane
 * columns into the core node.
 *
 * Geometry lives in a 1200 × 180 viewBox and the band is given the matching
 * aspect ratio, so `preserveAspectRatio="none"` scales it uniformly and nothing
 * inside is distorted. Lane centres sit at x = 200 / 600 / 1000 — the centres
 * of a three-column grid — and all three terminate just above the core ring at
 * y = 166, spread across x = 568 / 600 / 632 so the arrowheads stay separable.
 *
 * `pathLength="1"` normalises every path, so one `stroke-dashoffset: calc(1 - d)`
 * draws all three regardless of their real lengths.
 *
 * Below 900px this is `display: none` and a single CSS spine takes over. That
 * is one empty `<span>`, not a second copy of the content — every word and
 * every number in this section exists exactly once in the DOM.
 */

/** Cubic paths, lane → core. Duplicated in CSS only as `offset-path` values. */
const PATHS = [
  "M200 4 C200 84 348 100 520 122 C556 128 562 142 568 166",
  "M600 4 C600 70 600 112 600 166",
  "M1000 4 C1000 84 852 100 680 122 C644 128 638 142 632 166",
] as const;

const LANE_COLOURS = ["#2f6bff", "#2ec4b6", "#8b4cf6"] as const;

/** Points sampled off the curves above, with the draw progress that reaches them. */
const WAYPOINTS = [
  [
    { x: 295.5, y: 84.8, at: 0.4 },
    { x: 469.2, y: 115.5, at: 0.74 },
  ],
  [
    { x: 600, y: 62, at: 0.36 },
    { x: 600, y: 120, at: 0.72 },
  ],
  [
    { x: 904.5, y: 84.8, at: 0.4 },
    { x: 730.8, y: 115.5, at: 0.74 },
  ],
] as const;

/** Terminal arrowheads — the static cue that stock flows *into* the core. */
const HEADS = [
  "M563 157 L573 157 L568 169 Z",
  "M595 157 L605 157 L600 169 Z",
  "M627 157 L637 157 L632 169 Z",
] as const;

const diamond = (x: number, y: number, r: number) =>
  `M${x} ${y - r} L${x + r} ${y} L${x} ${y + r} L${x - r} ${y} Z`;

export function CoreDiagram() {
  return (
    <svg
      className={styles.operatingCore__diagram}
      viewBox="0 0 1200 180"
      preserveAspectRatio="none"
      role="img"
      aria-labelledby="operating-core-diagram-title operating-core-diagram-description"
      focusable="false"
    >
      <title id="operating-core-diagram-title">
        Three operating entities converge into one record
      </title>
      <desc id="operating-core-diagram-description">
        Goods receipt GRN #4821 from wholesale, invoice INV-2231 from company
        retail and transfer TRF-118 from a franchise outlet flow into the
        Bizonix operating core, keeping stock, ledgers and GST in agreement.
      </desc>
      <defs>
        {operatingLanes.map((lane, index) => (
          <linearGradient
            key={lane.id}
            id={`bz-core-taper-${lane.id}`}
            gradientUnits="userSpaceOnUse"
            x1={index === 0 ? 200 : index === 1 ? 600 : 1000}
            y1="4"
            x2="600"
            y2="170"
          >
            {/* Wide and opaque at the lane, thinning into the core: the taper
                is what makes the direction readable with zero motion. */}
            <stop
              offset="0"
              stopColor={LANE_COLOURS[index]}
              stopOpacity="0.55"
            />
            <stop
              offset="1"
              stopColor={LANE_COLOURS[index]}
              stopOpacity="0.06"
            />
          </linearGradient>
        ))}
      </defs>

      {operatingLanes.map((lane, index) => (
        <g
          key={lane.id}
          className={styles.operatingCore__connector}
          data-lane={lane.id}
          style={{ "--lead": index * 0.07 } as CSSProperties}
        >
          <path
            className={styles.operatingCore__connectorHalo}
            d={PATHS[index]}
            pathLength={1}
            stroke={`url(#bz-core-taper-${lane.id})`}
          />
          <path
            className={styles.operatingCore__connectorLine}
            d={PATHS[index]}
            pathLength={1}
          />

          {WAYPOINTS[index].map((point) => (
            <g
              key={`${point.x}-${point.y}`}
              className={styles.operatingCore__waypoint}
              style={{ "--at": point.at } as CSSProperties}
            >
              <path
                className={styles.operatingCore__waypointBase}
                d={diamond(point.x, point.y, 4.5)}
              />
              <path
                className={styles.operatingCore__waypointLit}
                d={diamond(point.x, point.y, 4.5)}
              />
            </g>
          ))}

          <path className={styles.operatingCore__connectorHead} d={HEADS[index]} />

          {/* Enhancement only, and gated on `offset-path` in CSS: the document
              each lane sends into the core. The id on the pill is the same id
              printed on that lane's illustrative card. */}
          <g className={styles.operatingCore__token}>
            <rect x="-46" y="-12.5" width="92" height="25" rx="12.5" />
            <text x="0" y="4.5" textAnchor="middle">
              {lane.token}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}

/**
 * The core node. Flat and brand-native: three concentric rings that draw
 * outward, the logo mark, and a single pulse that fires once when the three
 * documents land. No pedestal, no gloss, no perpetual orbit.
 */
export function CoreNode() {
  return (
    <div className={styles.operatingCore__core}>
      <div className={styles.operatingCore__coreNode}>
        <span className={styles.operatingCore__corePulse} aria-hidden="true" />
        <span
          className={styles.operatingCore__coreRing}
          style={{ "--r": 0 } as CSSProperties}
          aria-hidden="true"
        />
        <span
          className={styles.operatingCore__coreRing}
          style={{ "--r": 1 } as CSSProperties}
          aria-hidden="true"
        />
        <span
          className={styles.operatingCore__coreRing}
          style={{ "--r": 2 } as CSSProperties}
          aria-hidden="true"
        />
        <Image
          className={styles.operatingCore__coreMark}
          src="/images/shared/brand/icon.svg"
          alt=""
          aria-hidden="true"
          width={44}
          height={44}
          priority={false}
        />
      </div>
      <span className={styles.operatingCore__coreLabel}>Bizonix operating core</span>
    </div>
  );
}
