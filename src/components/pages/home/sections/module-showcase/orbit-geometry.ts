/**
 * Geometry engine for the module orbit.
 *
 * One function decides where every module node sits. There are no hand-placed
 * coordinates anywhere in the section: `calculateOrbitPositions` derives the
 * ellipse from the measured stage box, the core box and the node box, growing
 * the radius until module↔module and module↔core clearances hold. When the
 * radii cannot grow any further inside the stage, the node width is reduced in
 * small accessibility-safe steps and the solve is retried.
 */

export type OrbitNodePosition = {
  /** Node centre, in stage-local pixels. */
  x: number;
  y: number;
  /** Ellipse parameter angle in degrees (start + i × 360 / count). */
  angle: number;
  /** Unit vector pointing outward from the centre through this node. */
  dirX: number;
  dirY: number;
};

export type OrbitConfig = {
  containerWidth: number;
  containerHeight: number;
  coreWidth: number;
  coreHeight: number;
  nodeWidth: number;
  nodeHeight: number;
  moduleCount: number;
  /** Measured centre of the complete core content, in stage-local pixels. */
  centerX?: number;
  centerY?: number;
  /** Degrees; -90 places the first module at the top. */
  startAngle?: number;
  /** ry = radiusYFactor × rx. Clamped so the ellipse fits the stage. */
  radiusYFactor?: number;
  /** Minimum clearance between module rects (px). */
  moduleGap?: number;
  /** Minimum clearance between a module rect and the core rect (px). */
  coreGap?: number;
  /** Minimum clearance between a module rect and the stage edge (px). */
  edgeMargin?: number;
};

export type OrbitSolution = {
  positions: OrbitNodePosition[];
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  /** Node width the solve settled on (may be narrower than the input). */
  nodeWidth: number;
  /** Node height the solve used. */
  nodeHeight: number;
  /** Start angle in degrees (first module sits at the top when -90). */
  startAngle: number;
};

const DEG = Math.PI / 180;

/** Smallest width "Sales & POS" stays comfortably readable at. */
export const MIN_NODE_WIDTH = 76;
const NODE_WIDTH_STEP = 4;
const RADIUS_STEP = 2;

/** Position of a module for a given orbit angle — the parametric orbit. */
export function orbitPosition(
  geo: {
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
    startAngle: number;
    slice: number;
  },
  index: number,
  orbitAngle: number,
): { x: number; y: number } {
  const radians = (geo.startAngle + index * geo.slice + orbitAngle) * DEG;
  return {
    x: geo.centerX + Math.cos(radians) * geo.radiusX,
    y: geo.centerY + Math.sin(radians) * geo.radiusY,
  };
}

/**
 * Connector endpoints from the core edge toward a module position, using the
 * true radial direction (position − centre). Shared by the static render and
 * the orbit loop so handoff between them is seamless.
 */
export function connectorEndpoints(
  position: { x: number; y: number },
  centerX: number,
  centerY: number,
  coreHalfWidth: number,
  coreHalfHeight: number,
  corePad = 14,
  nodeJoin = 46,
): { x1: number; y1: number; x2: number; y2: number } {
  const dx = position.x - centerX;
  const dy = position.y - centerY;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const exitX = ux !== 0 ? (coreHalfWidth + corePad) / Math.abs(ux) : Infinity;
  const exitY = uy !== 0 ? (coreHalfHeight + corePad) / Math.abs(uy) : Infinity;
  const coreExit = Math.min(exitX, exitY);
  return {
    x1: centerX + ux * coreExit,
    y1: centerY + uy * coreExit,
    x2: position.x - ux * nodeJoin,
    y2: position.y - uy * nodeJoin,
  };
}

export function calculateOrbitPositions(config: OrbitConfig): OrbitSolution {
  const {
    containerWidth,
    containerHeight,
    coreWidth,
    coreHeight,
    nodeHeight,
    moduleCount,
    startAngle = -90,
    radiusYFactor = 0.88,
    moduleGap = 8,
    coreGap = 12,
    edgeMargin = 4,
  } = config;

  const centerX = config.centerX ?? containerWidth / 2;
  const centerY = config.centerY ?? containerHeight / 2;
  const slice = 360 / moduleCount;

  // The ambient orbit slides the whole constellation along the ellipse, so
  // clearance must hold not just at phase 0 but through the full 0…slice
  // drift. Phases {0, ±slice/2} bound that band (the pattern repeats with
  // 9-fold symmetry and mirrors).
  const PHASE_SAMPLES = 24; // every ~1.67° — dense enough to bound drift
  const phases = Array.from(
    { length: PHASE_SAMPLES },
    (_, index) => (index * slice) / PHASE_SAMPLES,
  );

  let nodeWidth = config.nodeWidth;

  const radiiBounds = (width: number) => ({
    maxRadiusX: Math.max(
      0,
      Math.min(
        centerX - width / 2 - edgeMargin,
        containerWidth - centerX - width / 2 - edgeMargin,
      ),
    ),
    maxRadiusY: Math.max(
      0,
      Math.min(
        centerY - nodeHeight / 2 - edgeMargin,
        containerHeight - centerY - nodeHeight / 2 - edgeMargin,
      ),
    ),
  });

  const fitsAt = (rx: number, ry: number, width: number) =>
    phases.every((phase) => {
      const placed = ellipsePositions(
        centerX,
        centerY,
        rx,
        ry,
        moduleCount,
        startAngle + phase,
        slice,
      );
      return (
        clearsCore(placed, centerX, centerY, coreWidth, coreHeight, width, nodeHeight, coreGap) &&
        clearsSiblings(placed, width, nodeHeight, moduleGap)
      );
    });

  for (;;) {
    const { maxRadiusX, maxRadiusY } = radiiBounds(nodeWidth);
    const coreClearX = coreWidth / 2 + nodeWidth / 2 + coreGap;
    const coreClearY = coreHeight / 2 + nodeHeight / 2 + coreGap;

    let radiusX = Math.max(coreClearX, coreClearY * 0.7);
    let solved = false;

    while (radiusX <= maxRadiusX) {
      const radiusY = Math.min(radiusYFactor * radiusX, maxRadiusY);
      if (fitsAt(radiusX, radiusY, nodeWidth)) {
        solved = true;
        break;
      }
      radiusX += RADIUS_STEP;
    }

    if (solved) {
      return {
        positions: ellipsePositions(
          centerX,
          centerY,
          radiusX,
          Math.min(radiusYFactor * radiusX, maxRadiusY),
          moduleCount,
          startAngle,
          slice,
        ),
        centerX,
        centerY,
        radiusX,
        radiusY: Math.min(radiusYFactor * radiusX, maxRadiusY),
        nodeWidth,
        nodeHeight,
        startAngle,
      };
    }

    // The stage cannot host this node width — narrow the cards and retry.
    nodeWidth -= NODE_WIDTH_STEP;
    if (nodeWidth < MIN_NODE_WIDTH) {
      // Last resort: emit the widest legal layout at minimum width so the
      // section still renders; development validation surfaces the miss.
      const bounds = radiiBounds(MIN_NODE_WIDTH);
      let best = Math.max(coreClearX, MIN_NODE_WIDTH);
      for (let rx = best; rx <= bounds.maxRadiusX; rx += RADIUS_STEP) {
        if (fitsAt(rx, Math.min(radiusYFactor * rx, bounds.maxRadiusY), MIN_NODE_WIDTH)) {
          best = rx;
          break;
        }
      }
      const radiusYFinal = Math.min(radiusYFactor * best, bounds.maxRadiusY);
      return {
        positions: ellipsePositions(
          centerX,
          centerY,
          best,
          radiusYFinal,
          moduleCount,
          startAngle,
          slice,
        ),
        centerX,
        centerY,
        radiusX: best,
        radiusY: radiusYFinal,
        nodeWidth: MIN_NODE_WIDTH,
        nodeHeight,
        startAngle,
      };
    }
  }
}

function ellipsePositions(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  moduleCount: number,
  startAngle: number,
  slice: number,
): OrbitNodePosition[] {
  return Array.from({ length: moduleCount }, (_, index) => {
    const angle = startAngle + index * slice;
    const radians = angle * DEG;
    const outwardX = Math.cos(radians);
    const outwardY = Math.sin(radians);
    const length = Math.hypot(outwardX, outwardY) || 1;
    return {
      x: centerX + outwardX * radiusX,
      y: centerY + outwardY * radiusY,
      angle,
      dirX: outwardX / length,
      dirY: outwardY / length,
    };
  });
}

/** True when no node rect intrudes into the (expanded) core rect. */
function clearsCore(
  positions: OrbitNodePosition[],
  centerX: number,
  centerY: number,
  coreWidth: number,
  coreHeight: number,
  nodeWidth: number,
  nodeHeight: number,
  coreGap: number,
): boolean {
  const halfWidth = coreWidth / 2 + nodeWidth / 2 + coreGap;
  const halfHeight = coreHeight / 2 + nodeHeight / 2 + coreGap;
  return positions.every(
    ({ x, y }) =>
      Math.abs(x - centerX) >= halfWidth ||
      Math.abs(y - centerY) >= halfHeight,
  );
}

/** True when every pair of node rects keeps at least `gap` clearance. */
function clearsSiblings(
  positions: OrbitNodePosition[],
  nodeWidth: number,
  nodeHeight: number,
  gap: number,
): boolean {
  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const dx = Math.abs(positions[i].x - positions[j].x);
      const dy = Math.abs(positions[i].y - positions[j].y);
      if (dx < nodeWidth + gap && dy < nodeHeight + gap) {
        return false;
      }
    }
  }
  return true;
}
