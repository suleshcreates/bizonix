"use client";

import { useState } from "react";
import { BarChart3, Boxes, FileText, ShoppingBag, Users } from "lucide-react";
import { IntegrationCore } from "./integration-core";
import { IntegrationOutput } from "./integration-output";
import { IntegrationSource } from "./integration-source";
import styles from "@/components/pages/product/product.module.css";

/* ==========================================================================
   SYSTEM MAP GEOMETRY — shared with integration-surface.module.css

   viewBox is 720 x 320 and .flowCanvas is locked to that aspect ratio, so one
   viewBox unit is always (canvasWidth / 720) px. That lets the HTML nodes be
   anchored at the SAME coordinates as the connectors, at any canvas width.

     input node   right edge   x = 200            -> right: 72.2222%
     output node  left edge    x = 520            -> left:  72.2222%
     core centre               (360, 160)         -> 50% / 50%
     input rows                y = 78, 242        -> 24.375% / 75.625%
     output rows               y = 54, 160, 266   -> 16.875% / 50% / 83.125%

   Connector ends sit on a radius-48 circle around the core, clearing the
   outer ring (radius 37.5) by a constant 10.5 units at every size.
   Change nothing here without changing the matching block in the stylesheet.
   ========================================================================== */

type NodeId =
  "storefront" | "operations" | "invoices" | "customers" | "insights";

const INPUTS: NodeId[] = ["storefront", "operations"];

type Connector = {
  id: NodeId;
  d: string;
  tone: "blue" | "teal";
  /** Seconds — deliberately non-harmonic so the particles never sync up. */
  dur: number;
  delay: number;
};

const connectors: Connector[] = [
  {
    id: "storefront",
    d: "M 200 78 C 262 78, 258 140, 316 140",
    tone: "blue",
    dur: 4.4,
    delay: 0,
  },
  {
    id: "operations",
    d: "M 200 242 C 262 242, 258 180, 316 180",
    tone: "blue",
    dur: 4.8,
    delay: 1.4,
  },
  {
    id: "invoices",
    d: "M 404 140 C 462 140, 458 54, 514 54",
    tone: "teal",
    dur: 4,
    delay: 0.6,
  },
  {
    id: "customers",
    d: "M 408 160 L 514 160",
    tone: "teal",
    dur: 3.8,
    delay: 1.8,
  },
  {
    id: "insights",
    d: "M 404 180 C 462 180, 458 266, 514 266",
    tone: "teal",
    dur: 4.4,
    delay: 2.6,
  },
];

const TONE = {
  blue: {
    stroke: "url(#flowGradBlue)",
    marker: "flowArrowBlue",
    dot: "#2f6bff",
  },
  teal: {
    stroke: "url(#flowGradTeal)",
    marker: "flowArrowTeal",
    dot: "#2ec4b6",
  },
} as const;

export function IntegrationFlow() {
  const [hovered, setHovered] = useState<NodeId | null>(null);

  /* An input lights its whole downstream; an output lights only its own
     branch. The core is always part of whatever is lit. */
  const isHighlighted = (id: string) => {
    if (!hovered) return false;
    if (id === "core" || hovered === id) return true;
    if (INPUTS.includes(hovered)) return !INPUTS.includes(id as NodeId);
    return false;
  };

  const isDimmed = (id: string) => {
    if (!hovered || id === "core" || id === hovered) return false;
    return !isHighlighted(id);
  };

  const isPathActive = (id: NodeId) => {
    if (!hovered) return false;
    if (INPUTS.includes(hovered)) return hovered === id || !INPUTS.includes(id);
    return hovered === id;
  };

  const onHover = (id: string) => setHovered(id as NodeId);
  const onLeave = () => setHovered(null);

  return (
    <div className={styles.integrationSurface__flowContainer}>
      <div className={styles.integrationSurface__flowCanvas}>
        <svg
          className={styles.integrationSurface__flowSvg}
          viewBox="0 0 720 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* userSpaceOnUse, not the default objectBoundingBox: the
                customers connector is a straight horizontal line (height 0),
                which causes an objectBoundingBox gradient to collapse into
                zero height and fail to paint. */}
            <linearGradient
              id="flowGradBlue"
              gradientUnits="userSpaceOnUse"
              x1="200"
              y1="160"
              x2="316"
              y2="160"
            >
              <stop offset="0%" stopColor="#2f6bff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2f6bff" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient
              id="flowGradTeal"
              gradientUnits="userSpaceOnUse"
              x1="404"
              y1="160"
              x2="514"
              y2="160"
            >
              <stop offset="0%" stopColor="#2ec4b6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2ec4b6" stopOpacity="0.35" />
            </linearGradient>

            <pattern
              id="flowGridDots"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="12" cy="12" r="0.75" fill="rgba(47,107,255,0.13)" />
            </pattern>

            {/* userSpaceOnUse keeps the head a fixed size when the stroke
                thickens on hover — the default rescales it and it pops. */}
            <marker
              id="flowArrowBlue"
              viewBox="0 0 6 6"
              refX="4.5"
              refY="3"
              markerWidth="9"
              markerHeight="9"
              markerUnits="userSpaceOnUse"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 5 3 L 0 5 z" fill="#2f6bff" />
            </marker>

            <marker
              id="flowArrowTeal"
              viewBox="0 0 6 6"
              refX="4.5"
              refY="3"
              markerWidth="9"
              markerHeight="9"
              markerUnits="userSpaceOnUse"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 5 3 L 0 5 z" fill="#2ec4b6" />
            </marker>
          </defs>

          {/* Technical field, inset to the exact span between the columns. */}
          <rect
            x="200"
            y="24"
            width="320"
            height="272"
            fill="url(#flowGridDots)"
            opacity="0.6"
          />

          {/* Ports — sit precisely on each input node's right edge. */}
          <circle cx="200" cy="78" r="2.5" fill="#2f6bff" opacity="0.65" />
          <circle cx="200" cy="242" r="2.5" fill="#2f6bff" opacity="0.65" />

          {connectors.map(({ id, d, tone }) => {
            const active = isPathActive(id);
            const faded = Boolean(hovered) && !active;
            return (
              <path
                key={id}
                d={d}
                stroke={TONE[tone].stroke}
                strokeWidth={active ? 2.6 : 2}
                strokeLinecap="round"
                opacity={faded ? 0.14 : active ? 1 : 0.72}
                markerEnd={`url(#${TONE[tone].marker})`}
                style={{
                  transition:
                    "opacity .25s ease, stroke-width .25s ease, filter .25s ease",
                  filter: active
                    ? `drop-shadow(0 0 5px ${TONE[tone].dot}55)`
                    : "none",
                }}
              />
            );
          })}

          {/* Payload particles. Opacity is keyed to the same duration so they
              ease in and out instead of popping at the path ends. */}
          {connectors.map(({ id, d, tone, dur, delay }) => (
            <circle key={`p-${id}`} r="2.6" fill={TONE[tone].dot} opacity="0">
              <animateMotion
                dur={`${dur}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
                path={d}
              />
              <animate
                attributeName="opacity"
                dur={`${dur}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
                values="0;0.95;0.95;0"
                keyTimes="0;0.14;0.82;1"
              />
            </circle>
          ))}
        </svg>

        <div className={styles.integrationSurface__flowNodes}>
          <div className={styles.integrationSurface__inputsColumn}>
            <IntegrationSource
              id="storefront"
              icon={<ShoppingBag size={17} />}
              label="Your storefront"
              descriptor={"Products, pricing,\ninventory & content"}
              isHighlighted={isHighlighted("storefront")}
              isDimmed={isDimmed("storefront")}
              onHover={onHover}
              onLeave={onLeave}
            />
            <IntegrationSource
              id="operations"
              icon={<Boxes size={17} />}
              label="Your operations"
              descriptor={"Orders, fulfilments\nand updates"}
              isHighlighted={isHighlighted("operations")}
              isDimmed={isDimmed("operations")}
              onHover={onHover}
              onLeave={onLeave}
            />
          </div>

          <div className={styles.integrationSurface__coreColumn}>
            <IntegrationCore isHighlighted={isHighlighted("core")} />
          </div>

          <div className={styles.integrationSurface__outputsColumn}>
            <IntegrationOutput
              id="invoices"
              icon={<FileText size={17} />}
              label="Invoices"
              descriptor={"Share, track\nand get paid faster"}
              isHighlighted={isHighlighted("invoices")}
              isDimmed={isDimmed("invoices")}
              onHover={onHover}
              onLeave={onLeave}
            />
            <IntegrationOutput
              id="customers"
              icon={<Users size={17} />}
              label="Customers"
              descriptor={"Profiles, conversations\nand preferences"}
              isHighlighted={isHighlighted("customers")}
              isDimmed={isDimmed("customers")}
              onHover={onHover}
              onLeave={onLeave}
            />
            <IntegrationOutput
              id="insights"
              icon={<BarChart3 size={17} />}
              label="Insights"
              descriptor={"Analytics that reflect\nhow you operate"}
              isHighlighted={isHighlighted("insights")}
              isDimmed={isDimmed("insights")}
              onHover={onHover}
              onLeave={onLeave}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
