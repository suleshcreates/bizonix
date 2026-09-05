import type { CSSProperties } from "react";
import type { OrbitSolution } from "../orbit-geometry";
import { connectorEndpoints } from "../orbit-geometry";
import { showcaseModules } from "@/lib/content/modules/modules";
import { ModuleConnector } from "./module-connector";
import { ModuleNode } from "./module-node";
import styles from "@/components/pages/home/home.module.css";

/** Travel distance for a module's arrival, from its own direction (30–70px). */
export const MODULE_TRAVEL_PX = 52;

/**
 * The radial module system. Slots are placed by the geometry solve at
 * render time and then carried along the ellipse by the parametric orbit
 * (transform-only), so positions orbit while every card stays level. Before
 * (or without) JavaScript the same DOM is the sequential stack.
 */
export function ModuleOrbit({
  solution,
  coreHalfWidth = 107,
  coreHalfHeight = 112,
}: {
  solution: OrbitSolution | null;
  coreHalfWidth?: number;
  coreHalfHeight?: number;
}) {
  const radial = solution !== null;

  const geometryPayload = radial
    ? JSON.stringify({
        centerX: solution!.centerX,
        centerY: solution!.centerY,
        radiusX: solution!.radiusX,
        radiusY: solution!.radiusY,
        nodeWidth: solution!.nodeWidth,
        nodeHeight: solution!.nodeHeight,
        startAngle: solution!.startAngle,
        coreHalfWidth,
        coreHalfHeight,
        slice: 360 / showcaseModules.length,
      })
    : undefined;

  return (
    <div
      className={styles.moduleShowcase__orbit}
      data-ms-ring
      data-geometry={geometryPayload}
    >
      {radial ? (
        <svg
          className={styles.moduleShowcase__connectors}
          data-ms-connectors
          viewBox={`0 0 ${Math.round(solution!.centerX * 2)} ${Math.round(
            solution!.centerY * 2,
          )}`}
          aria-hidden
        >
          <ellipse
            data-ms-guide
            className={styles.moduleShowcase__guide}
            cx={solution!.centerX}
            cy={solution!.centerY}
            rx={solution!.radiusX}
            ry={solution!.radiusY}
          />
          {solution!.positions.map((position, index) => {
            const endpoints = connectorEndpoints(
              position,
              solution!.centerX,
              solution!.centerY,
              coreHalfWidth,
              coreHalfHeight,
            );
            return (
              <ModuleConnector
                key={showcaseModules[index].id}
                index={index}
                endpoints={endpoints}
              />
            );
          })}
        </svg>
      ) : null}

      {showcaseModules.map((module, index) => {
        const position = solution?.positions[index];
        const slotStyle = position
          ? ({
              transform: `translate(${position.x - solution!.nodeWidth / 2}px, ${
                position.y - solution!.nodeHeight / 2
              }px)`,
              "--travel-x": position.dirX * MODULE_TRAVEL_PX,
              "--travel-y": position.dirY * MODULE_TRAVEL_PX,
            } as CSSProperties)
          : undefined;
        return (
          <div
            key={module.id}
            className={styles.moduleShowcase__slot}
            data-ms-slot
            data-index={index}
            style={slotStyle}
          >
            <div className={styles.moduleShowcase__counter} data-ms-counter>
              <ModuleNode module={module} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
