import { productScreens, type ProductScreenId } from "./product-screens";

/**
 * Where an annotation actually lands once a capture is placed in a frame.
 *
 * Annotations are authored in per-cent of the **source capture** — that is the
 * only coordinate space anyone can verify, because it is the space you measure
 * by opening the PNG. But a frame rarely has the capture's aspect ratio: the
 * hero canvas deliberately crops a wide screen to a tighter shape, and a cover
 * fit then throws away part of the image.
 *
 * Placing a pin at the authored per-cent directly against a cropped frame puts
 * it on the wrong column — a pin authored at 64% of a 2.36:1 capture shown in a
 * 1.57:1 frame renders over the field at 43% of the capture. This module does
 * the mapping instead, and reports honestly when an authored point falls in the
 * part of the capture the crop discarded, so validation can reject it rather
 * than the page shipping a pin that points at nothing.
 *
 * Every frame in the module system anchors its crop at `left top`, which is
 * what keeps this arithmetic to one branch.
 */

/** A point in per-cent of the source capture. */
export type CapturePoint = { x: number; y: number };

/** The same point in per-cent of the rendered frame. */
export type FramePoint = { x: number; y: number };

/** Aspect ratio of a capture, width ÷ height. */
export function screenAspect(id: ProductScreenId): number {
  const screen = productScreens[id];
  return screen.width / screen.height;
}

/**
 * The fraction of the capture a `cover` fit keeps, per axis, for a frame of the
 * given aspect ratio. One of the two is always 1 — cover crops on one axis only.
 */
export function visibleFraction(
  id: ProductScreenId,
  frameAspect: number,
): { x: number; y: number } {
  const aspect = screenAspect(id);
  return aspect > frameAspect
    ? { x: frameAspect / aspect, y: 1 }
    : { x: 1, y: aspect / frameAspect };
}

/**
 * Maps an authored capture point onto the frame, or returns `null` when the
 * crop has removed that part of the capture. A caller that gets `null` must
 * drop the pin — never clamp it to an edge, which would point at a field the
 * annotation is not describing.
 */
export function projectOntoFrame(
  id: ProductScreenId,
  frameAspect: number,
  point: CapturePoint,
): FramePoint | null {
  const visible = visibleFraction(id, frameAspect);
  const x = point.x / 100 / visible.x;
  const y = point.y / 100 / visible.y;

  if (x < 0 || x > 1 || y < 0 || y > 1) return null;

  return { x: x * 100, y: y * 100 };
}

/* --------------------------------------------------------------- constants */

/**
 * Frame aspect ratios, shared between the components that render them and the
 * validator that checks annotations against them. These are the single source
 * of truth: `module-page.module.css` reads them through the `--frame-aspect`
 * custom property so a change here cannot desynchronise the two.
 */
export const HERO_FRAME_ASPECT = 16 / 10.2;

/**
 * The gallery shows each capture at its own aspect ratio rather than a shared
 * frame, so nothing on a screen the page is presenting as evidence is cropped
 * away. Annotation coordinates therefore map one-to-one there.
 */
export function galleryFrameAspect(id: ProductScreenId): number {
  return screenAspect(id);
}
