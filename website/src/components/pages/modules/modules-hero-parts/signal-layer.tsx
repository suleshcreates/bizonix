"use client";

import { useSyncExternalStore } from "react";
import {
  constellationGeometry as geo,
  constellationNodes,
} from "@/lib/content/modules/modules-index";
import { connectorPath } from "./orbit-layer";
import styles from "@/components/pages/modules/modules.module.css";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/** Six of the nine paths carry a signal, so the motion never reads as uniform. */
const CARRIERS = ["inventory", "sales-pos", "accounting", "franchise", "analytics", "procurement"];

/**
 * Slow luminous points travelling core → module. Rendered only when the visitor
 * has not asked for reduced motion; the constellation is complete without them.
 */
export function SignalLayer() {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (reduced) return null;

  const carriers = constellationNodes.filter((node) => CARRIERS.includes(node.slug));

  return (
    <svg
      className={styles.modulesHero__signals}
      viewBox={`0 0 ${geo.viewBox.width} ${geo.viewBox.height}`}
      aria-hidden="true"
      focusable="false"
    >
      {carriers.map((node, index) => {
        const duration = 19 + index * 1.6;
        return (
          <circle key={node.slug} r="4.5" className={styles.modulesHero__signal}>
            <animateMotion
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${index * -3.2}s`}
              path={connectorPath(node.angle, node.ring)}
              rotate="auto"
            />
            {/* Brightens only as it nears the module, then settles. */}
            <animate
              attributeName="opacity"
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${index * -3.2}s`}
              values="0;0.5;0.55;1;0"
              keyTimes="0;0.15;0.7;0.92;1"
            />
          </circle>
        );
      })}
    </svg>
  );
}
