"use client";

import { Boxes, ShoppingBag, Users } from "lucide-react";
import { useState } from "react";
import styles from "@/components/pages/product/product.module.css";

/* ==========================================================================
   NARROW-VIEWPORT ORBITAL SYSTEM — geometry shared with product.module.css

   The wide layout reads left to right: two inputs, a core, three outputs. A
   phone has no width for that, so the same idea becomes an orbit: one core,
   three environments riding a single dashed path around it, and three
   coloured arcs carrying the flow clockwise from one to the next.

   viewBox is 320 x 496 and .mapCanvas is locked to that ratio, so one viewBox
   unit is always (canvasWidth / 320) px and the HTML nodes and their label
   cards can be anchored at the same coordinates the orbit is drawn in.

     core centre            (160, 258)   -> 50%    / 52%
     core disc              32% of the canvas width
     orbit ellipse          rx = 128, ry = 142, centred on the core

   The icons sit ON the ellipse; each label card sits just outside it, on the
   far side of its icon, so no card ever crosses the path:

     storefront icon        (160, 116)   -> 50%    / 23.4%   card above
     operations icon        ( 81, 370)   -> 25.4%  / 74.6%   card below
     customers icon         (239, 370)   -> 74.6%  / 74.6%   card below

   Change nothing here without changing the matching block in the stylesheet.
   ========================================================================== */

type MapNodeId = "storefront" | "operations" | "customers";

/** The dashed path the three environments ride. */
const ORBIT =
  "M 160 116 C 230.7 116, 288 179.6, 288 258 " +
  "C 288 336.4, 230.7 400, 160 400 " +
  "C 89.3 400, 32 336.4, 32 258 " +
  "C 32 179.6, 89.3 116, 160 116 Z";

/**
 * The flow, as three arcs of the same ellipse.
 *
 * Each arc leaves one node and arrives at the next one clockwise, and takes
 * the colour of the node it leaves — so the eye follows storefront to
 * customers to operations and back, which is the direction the arrowheads
 * confirm. Node angles are 270, 52 and 128 degrees.
 *
 * Each arc stops twenty-two degrees short at both ends. A node disc covers
 * about eleven degrees of the ellipse on its own, so a smaller gap is hidden
 * behind the disc and the dashed track underneath never shows; twenty-two
 * leaves roughly ten degrees of visible track on each side of every node.
 */
const arcs: {
  id: MapNodeId;
  d: string;
  color: string;
  /** Midpoint of the span, for the dot marker. */
  dot: [number, number];
  /** 70% along the span, with the tangent angle there. */
  arrow: { x: number; y: number; rotate: number };
}[] = [
  {
    id: "storefront",
    d: "M 207.9 126.4 A 128 142 0 0 1 270.8 329",
    color: "#2f6bff",
    dot: [281, 211.8],
    arrow: { x: 288, y: 259.5, rotate: 90.5 },
  },
  {
    id: "customers",
    d: "M 195.3 394.5 A 128 142 0 0 1 124.7 394.5",
    color: "#12a35c",
    dot: [160, 400],
    arrow: { x: 145.7, y: 399.1, rotate: 187.1 },
  },
  {
    id: "operations",
    d: "M 49.2 329 A 128 142 0 0 1 112.1 126.4",
    color: "#6a63f0",
    dot: [39, 211.8],
    arrow: { x: 59.8, y: 169.6, rotate: -54.4 },
  },
];

/**
 * One signal rides the orbit slowly.
 *
 * The offset is negative on purpose: a positive `begin` leaves the circle
 * parked at its own cx/cy — the canvas origin — until the delay elapses, and
 * a stray dot sits in the corner for the first pass.
 */
const orbitSignals = [
  { id: "a", dur: 18, begin: "0s", fill: "#2f6bff" },
  { id: "b", dur: 18, begin: "-9s", fill: "#17b6ad" },
];

const nodes: {
  id: MapNodeId;
  icon: React.ReactNode;
  title: string;
  detail: string;
}[] = [
  {
    id: "storefront",
    icon: <ShoppingBag size={22} strokeWidth={1.9} aria-hidden="true" />,
    title: "Your storefront",
    detail: "Products, catalog and content",
  },
  {
    id: "operations",
    icon: <Boxes size={22} strokeWidth={1.9} aria-hidden="true" />,
    title: "Your operations",
    detail: "Orders, fulfilments and updates",
  },
  {
    id: "customers",
    icon: <Users size={22} strokeWidth={1.9} aria-hidden="true" />,
    title: "Your customers",
    detail: "Conversations and preferences",
  },
];

export function IntegrationMap() {
  const [active, setActive] = useState<MapNodeId | null>(null);

  return (
    <div className={styles.integrationSurface__map}>
      <div className={styles.integrationSurface__mapCanvas}>
        <svg
          className={styles.integrationSurface__mapSvg}
          viewBox="0 0 320 496"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {arcs.map(({ id, color }) => (
              /* userSpaceOnUse, not the default object bounding box: an arc
                 that happens to be flat has a zero-height box, and an
                 objectBoundingBox gradient on it degenerates and never
                 paints. */
              <linearGradient
                key={id}
                id={`mapArc-${id}`}
                gradientUnits="userSpaceOnUse"
                x1="32"
                y1="116"
                x2="288"
                y2="400"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                <stop offset="55%" stopColor={color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={color} stopOpacity="0.4" />
              </linearGradient>
            ))}
          </defs>

          {/* The orbit itself: dashed, so it reads as a track rather than a
              drawn boundary. The coloured arcs ride on top of it. */}
          <path
            className={styles.integrationSurface__mapOrbit}
            d={ORBIT}
          />

          {arcs.map(({ id, d, color, dot, arrow }) => (
            <g key={id} data-on={active === id}>
              {/* pathLength normalises every arc to 1 so one dash rule can
                  draw all three, whatever their real lengths are. */}
              <path
                className={styles.integrationSurface__mapArc}
                d={d}
                pathLength={1}
                stroke={`url(#mapArc-${id})`}
              />
              <circle
                className={styles.integrationSurface__mapArcDot}
                cx={dot[0]}
                cy={dot[1]}
                r="3.4"
                fill={color}
              />
              <path
                className={styles.integrationSurface__mapArcArrow}
                d="M -3.4 -3.6 L 3.6 0 L -3.4 3.6 Z"
                fill={color}
                transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.rotate})`}
              />
            </g>
          ))}

          {/* Signals riding the orbit itself, so they follow the curve rather
              than cutting across it. Slow, and half a lap apart. */}
          {orbitSignals.map(({ id, dur, begin, fill }) => (
            <circle
              key={id}
              className={styles.integrationSurface__mapSignal}
              r="3"
              fill={fill}
            >
              <animateMotion
                dur={`${dur}s`}
                begin={begin}
                repeatCount="indefinite"
                path={ORBIT}
              />
            </circle>
          ))}
        </svg>

        <div className={styles.integrationSurface__mapCore} aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M32 9 53 21 32 33 11 21 32 9Z" fill="#2F6BFF" />
            <path d="M11 21 32 33v22L11 43V21Z" fill="#0B1F3A" />
            <path d="M53 21 32 33v22l21-12V21Z" fill="#2EC4B6" />
            <path
              d="M23 26.5 32 21l9 5.5-9 5.5-9-5.5Z"
              fill="white"
              fillOpacity=".9"
            />
          </svg>
        </div>

        {nodes.map(({ id, icon, title, detail }) => (
          <button
            key={id}
            type="button"
            className={styles.integrationSurface__mapNode}
            data-node={id}
            data-state={active === id ? "on" : active ? "off" : "rest"}
            /* The card beside the icon is the visible label and is hidden
               from assistive technology, so the name lives here instead of
               being announced twice. */
            aria-label={`${title} — ${detail}`}
            aria-pressed={active === id}
            /* Click sets rather than toggles. A mouse fires enter before
               click, so a toggle would light the node on entry and put it
               straight back out again on the click; setting is idempotent for
               a mouse and still the only signal a touch device sends. */
            onPointerEnter={() => setActive(id)}
            onPointerLeave={(event) =>
              event.pointerType === "mouse" ? setActive(null) : undefined
            }
            onFocus={() => setActive(id)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(id)}
          >
            {icon}
          </button>
        ))}

        {nodes.map(({ id, title, detail }) => (
          <p
            key={`${id}-label`}
            className={styles.integrationSurface__mapLabel}
            data-node={id}
            data-state={active === id ? "on" : active ? "off" : "rest"}
            aria-hidden="true"
          >
            <b>{title}</b>
            <span>{detail}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
