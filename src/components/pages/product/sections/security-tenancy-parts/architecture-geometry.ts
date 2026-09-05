// Shared coordinate system for the access architecture.
//
// Every SVG overlay and every absolutely positioned HTML element in the stage
// reads from this module, so the wires and the content can never drift apart.
// The stage keeps a fixed aspect ratio, so stage units scale uniformly with the
// column width and percentage positions stay exact at any desktop size.
//
// The vertical rhythm is deliberately banded — boundary, people, permission
// scale, action — with clear channels between the bands for routed connectors,
// so no line ever crosses a label.

import type { SceneFrame, SecurityEntity } from "@/lib/content/product/security-access-model";
import { getPermissionStop } from "@/lib/content/product/security-access-model";

export const STAGE = { w: 720, h: 612 };

export const LAYER = {
  /** Top edge of the organic tenant perimeter. */
  tenantTop: 28,
  /** Bottom edge of the perimeter — it encloses the people who work inside. */
  tenantBottom: 390,
  /** Where a role connector terminates and the role marker begins. */
  roleNodeY: 286,
  /** Bottom of a role marker block, where the active path resumes. */
  roleFootY: 378,
  /** Clear horizontal channel between the tenant band and the permission scale. */
  channelY: 410,
  /** The shared permission scale. */
  permissionY: 460,
  permissionStartX: 34,
  permissionEndX: 686,
  /** Clear horizontal channel between the permission scale and the action. */
  dropY: 506,
  /** Vertical centre of the action event row. */
  actionY: 564,
  actionX: 36,
  actionEndX: 430,
  /** Right-margin riser that carries the record out to the evidence trail. */
  riserX: 702,
  /** Where the riser leaves the stage, level with the first audit entry. */
  exitY: 66,
};

/** Percentage helpers for positioning HTML inside the stage. */
export const px = (x: number) => `${(x / STAGE.w) * 100}%`;
export const py = (y: number) => `${(y / STAGE.h) * 100}%`;

export const frameStyle = (f: SceneFrame) => ({
  left: px(f.x),
  top: py(f.y),
  width: px(f.w),
  height: py(f.h),
});

export const centerX = (f: SceneFrame) => f.x + f.w / 2;
export const bottomY = (f: SceneFrame) => f.y + f.h;

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Orthogonal routing with softened corners — the visual language of an
 * architectural plan rather than a flowchart arrow.
 */
export function routed(points: [number, number][], radius = 12): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    const [cx, cy] = points[i + 1];
    const inLen = Math.hypot(bx - ax, by - ay);
    const outLen = Math.hypot(cx - bx, cy - by);
    if (inLen === 0 || outLen === 0) continue;
    const r = Math.min(radius, inLen / 2, outLen / 2);
    const sx = bx + ((ax - bx) / inLen) * r;
    const sy = by + ((ay - by) / inLen) * r;
    const ex = bx + ((cx - bx) / outLen) * r;
    const ey = by + ((cy - by) / outLen) * r;
    d += ` L ${round(sx)} ${round(sy)} Q ${bx} ${by} ${round(ex)} ${round(ey)}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last[0]} ${last[1]}`;
  return d;
}

/**
 * One controlled operating context drawn as a surveyed perimeter, not a box.
 * Hand-authored so it hugs the three entity scopes and the role layer beneath
 * them without ever becoming a rounded rectangle.
 */
export const TENANT_PERIMETER = [
  "M 78 36",
  "C 150 26 236 31 300 26",
  "C 372 20 452 31 528 25",
  "C 598 20 658 27 684 56",
  "C 701 78 690 130 688 186",
  "C 686 244 695 316 668 356",
  "C 647 389 520 383 396 390",
  "C 276 397 148 392 76 378",
  "C 30 368 5 322 10 250",
  "C 15 178 1 83 34 52",
  "C 46 40 60 38 78 36",
  "Z",
].join(" ");

/** A vertical hairline tying a role to the environment it operates in. */
export function roleConnector(frame: SceneFrame): string {
  const x = centerX(frame);
  return `M ${x} ${bottomY(frame)} L ${x} ${LAYER.roleNodeY}`;
}

/**
 * The path drops onto the permission scale in the gap between two stops, runs
 * along the scale to the stop it actually consumes, then descends to the action.
 * Approaching between stops is what keeps every connector clear of every label.
 */
function descentX(stopX: number): number {
  const half = 75;
  return stopX + half > LAYER.permissionEndX ? stopX - half : stopX + half;
}

/**
 * The one live story as a continuous route:
 * entity → role → permission → action → out to the evidence trail.
 * Sub-path breaks let the line pass behind the role marker and the action row.
 */
export function activePath(entity: SecurityEntity): string {
  const x = centerX(entity.frame);
  const stop = getPermissionStop(entity.action.permission);
  const drop = descentX(stop.x);

  const spine = routed([
    [x, LAYER.roleFootY],
    [x, LAYER.channelY],
    [drop, LAYER.channelY],
    [drop, LAYER.permissionY],
    [stop.x, LAYER.permissionY],
    [stop.x, LAYER.dropY],
    [18, LAYER.dropY],
    [18, LAYER.actionY],
    [LAYER.actionX - 4, LAYER.actionY],
  ]);

  const riser = routed([
    [LAYER.actionEndX, LAYER.actionY],
    [LAYER.riserX, LAYER.actionY],
    [LAYER.riserX, LAYER.exitY],
    [STAGE.w - 2, LAYER.exitY],
  ]);

  return [
    `M ${x} ${bottomY(entity.frame)} L ${x} ${LAYER.roleNodeY}`,
    spine,
    riser,
  ].join(" ");
}

/** Arrowhead where the riser hands the record to the evidence trail. */
export const EXIT_ARROW = [
  `M ${STAGE.w - 9} ${LAYER.exitY - 4.5}`,
  `L ${STAGE.w - 2} ${LAYER.exitY}`,
  `L ${STAGE.w - 9} ${LAYER.exitY + 4.5}`,
].join(" ");
