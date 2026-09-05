import type { CSSProperties, ReactNode } from "react";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * The drawing kit every problem diagram is built from.
 *
 * Twenty-seven conceptual visuals across nine modules share one vocabulary:
 * a record is a `Card`, a disputed figure is a `Reading`, a relationship is a
 * `Flow`, a judgement is a `Mark`, a scope is a `Boundary`. Composing a new
 * module story means arranging these parts — it never means inventing a new
 * visual language, which is what keeps nine different stories looking like one
 * system.
 *
 * Two rules hold everywhere:
 *
 *  1. These draw the *problem*, never the answer to it and never the product.
 *     A diagram may show a count disagreeing with itself; it may not show a
 *     Bizonix screen resolving the disagreement. Real captures live in the
 *     gallery section.
 *
 *  2. Nothing animates from JavaScript. Every part declares where it sits in
 *     the reveal order with `step`, which becomes a CSS custom property and a
 *     transition delay. The column's `data-state` attribute drives the whole
 *     diagram, so the sequence reverses on scroll-back at no cost and stops
 *     dead under `prefers-reduced-motion`.
 */

/** Shared canvas. Every diagram is authored in this coordinate space. */
export const STAGE_WIDTH = 320;
export const STAGE_HEIGHT = 190;

export type Tone = "base" | "accent" | "warn" | "ghost";

type Step = { step?: number };

const surfaceTone: Record<Tone, string> = {
  base: styles.problems__tBase,
  accent: styles.problems__tAccent,
  warn: styles.problems__tWarn,
  ghost: styles.problems__tGhost,
};

const strokeTone: Record<Tone, string> = {
  base: styles.problems__strokeBase,
  accent: styles.problems__strokeAccent,
  warn: styles.problems__strokeWarn,
  ghost: styles.problems__strokeGhost,
};

const textTone: Record<Tone, string> = {
  base: styles.problems__toneInk,
  accent: styles.problems__toneAccent,
  warn: styles.problems__toneWarn,
  ghost: styles.problems__toneDim,
};

function stepStyle(step = 0, extra?: CSSProperties): CSSProperties {
  return { "--s": step, ...extra } as CSSProperties;
}

/* --------------------------------------------------------------- wrappers */

/** Canvas. Decorative by contract — the column's text carries the meaning. */
export function Stage({ children }: { children: ReactNode }) {
  return (
    <svg
      className={styles.problems__stage}
      viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Fades and lifts its contents into place. */
export function Enter({ step, children }: Step & { children: ReactNode }) {
  return (
    <g className={styles.problems__vEnter} style={stepStyle(step)}>
      {children}
    </g>
  );
}

/**
 * Separates its contents from where they belong — the shared gesture for
 * every module's core failure: cost leaving the goods, a receipt leaving its
 * order, a permission leaving its boundary.
 */
export function Drift({
  dx = 0,
  dy = 0,
  step,
  children,
}: Step & { dx?: number; dy?: number; children: ReactNode }) {
  return (
    <g
      className={styles.problems__vDrift}
      style={stepStyle(step, {
        "--dx": `${dx}px`,
        "--dy": `${dy}px`,
      } as CSSProperties)}
    >
      {children}
    </g>
  );
}

/* ------------------------------------------------------------------ parts */

/** A record the operation holds: an order, a bill, a ledger, an outlet. */
export function Card({
  x,
  y,
  w = 118,
  h,
  title,
  note,
  tone = "base",
  step,
}: Step & {
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  note?: string;
  tone?: Tone;
}) {
  const height = h ?? (note ? 50 : 32);
  return (
    <Enter step={step}>
      <rect
        x={x}
        y={y}
        width={w}
        height={height}
        rx={9}
        className={surfaceTone[tone]}
      />
      <text
        x={x + 12}
        y={note ? y + 21 : y + height / 2 + 4}
        className={`${styles.problems__cardTitle} ${tone === "ghost" ? styles.problems__toneDim : ""}`}
      >
        {title}
      </text>
      {note ? (
        <text x={x + 12} y={y + 37} className={styles.problems__cardNote}>
          {note}
        </text>
      ) : null}
    </Enter>
  );
}

/** A figure somebody is asserting. Two of these, disagreeing, is the story. */
export function Reading({
  x,
  y,
  w = 96,
  label,
  value,
  tone = "base",
  step,
}: Step & {
  x: number;
  y: number;
  w?: number;
  label: string;
  value: string;
  tone?: Tone;
}) {
  return (
    <Enter step={step}>
      <rect x={x} y={y} width={w} height={64} rx={10} className={surfaceTone[tone]} />
      <text x={x + w / 2} y={y + 20} textAnchor="middle" className={styles.problems__readLabel}>
        {label.toUpperCase()}
      </text>
      <text
        x={x + w / 2}
        y={y + 48}
        textAnchor="middle"
        className={`${styles.problems__readValue} ${tone === "warn" ? styles.problems__toneWarn : ""}`}
      >
        {value}
      </text>
    </Enter>
  );
}

/**
 * A relationship between two records. Solid means the system holds it; dashed
 * means somebody holds it — a phone call, a printout, a spreadsheet.
 */
export function Flow({
  d,
  tone = "base",
  dashed,
  width = 1.4,
  step,
}: Step & { d: string; tone?: Tone; dashed?: boolean; width?: number }) {
  if (dashed) {
    return (
      <path
        d={d}
        pathLength={1}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray="0.028 0.028"
        className={`${strokeTone[tone]} ${styles.problems__vEnter}`}
        style={stepStyle(step)}
      />
    );
  }
  return (
    <path
      d={d}
      pathLength={1}
      strokeWidth={width}
      strokeLinecap="round"
      className={`${strokeTone[tone]} ${styles.problems__vDraw}`}
      style={stepStyle(step)}
    />
  );
}

/** A judgement stamped onto the drawing: ≠, ✕, ?, a short verdict. */
export function Mark({
  x,
  y,
  glyph,
  tone = "warn",
  r = 15,
  step,
}: Step & { x: number; y: number; glyph: string; tone?: Tone; r?: number }) {
  return (
    <g className={styles.problems__vPop} style={stepStyle(step)}>
      <circle cx={x} cy={y} r={r} className={surfaceTone[tone]} />
      <text
        x={x}
        y={y + 4.6}
        textAnchor="middle"
        className={`${styles.problems__markGlyph} ${textTone[tone]}`}
      >
        {glyph}
      </text>
    </g>
  );
}

/** A short label attached to something — a state, a cadence, an owner. */
export function Tag({
  x,
  y,
  text,
  tone = "ghost",
  step,
  anchor = "start",
}: Step & {
  x: number;
  y: number;
  text: string;
  tone?: Tone;
  anchor?: "start" | "middle";
}) {
  const w = Math.round(text.length * 5.15 + 18);
  const left = anchor === "middle" ? x - w / 2 : x;
  return (
    <Enter step={step}>
      <rect x={left} y={y} width={w} height={18} rx={9} className={surfaceTone[tone]} />
      <text
        x={left + w / 2}
        y={y + 12.4}
        textAnchor="middle"
        className={`${styles.problems__tagText} ${textTone[tone]}`}
      >
        {text}
      </text>
    </Enter>
  );
}

/** A physical unit: a piece, a carton, a bill, a row of data. */
export function Token({
  x,
  y,
  size = 15,
  tone = "base",
  step,
}: Step & { x: number; y: number; size?: number; tone?: Tone }) {
  return (
    <g className={styles.problems__vPop} style={stepStyle(step)}>
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        rx={4}
        className={surfaceTone[tone]}
      />
    </g>
  );
}

/** A row of units. `tones` lets one member of the row read differently. */
export function TokenRow({
  x,
  y,
  count,
  gap = 6,
  size = 15,
  tone = "base",
  tones,
  step = 0,
}: Step & {
  x: number;
  y: number;
  count: number;
  gap?: number;
  size?: number;
  tone?: Tone;
  tones?: readonly Tone[];
}) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <Token
          key={index}
          x={x + index * (size + gap)}
          y={y}
          size={size}
          tone={tones?.[index] ?? tone}
          step={step + index * 0.25}
        />
      ))}
    </>
  );
}

/**
 * A scope: an entity, a location, a system edge. Dashed by default, because
 * in every one of these stories the boundary is the thing that is missing.
 */
export function Boundary({
  x,
  y,
  w,
  h,
  label,
  tone = "ghost",
  step,
}: Step & {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  tone?: Tone;
}) {
  return (
    <Enter step={step}>
      <rect x={x} y={y} width={w} height={h} rx={12} className={surfaceTone[tone]} />
      {label ? (
        <text x={x + 11} y={y - 7} className={styles.problems__readLabel}>
          {label.toUpperCase()}
        </text>
      ) : null}
    </Enter>
  );
}

/** Plain editorial caption inside the drawing. Used sparingly. */
export function Note({
  x,
  y,
  text,
  anchor = "start",
  step,
}: Step & {
  x: number;
  y: number;
  text: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <Enter step={step}>
      <text x={x} y={y} textAnchor={anchor} className={styles.problems__noteText}>
        {text}
      </text>
    </Enter>
  );
}

/** A quantity as a bar. `fill` is a fraction of the track, never a metric. */
export function Bar({
  x,
  y,
  w,
  fill,
  h = 9,
  tone = "accent",
  step,
}: Step & {
  x: number;
  y: number;
  w: number;
  fill: number;
  h?: number;
  tone?: Tone;
}) {
  return (
    <Enter step={step}>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} className={styles.problems__tGhost} />
      <rect
        x={x}
        y={y}
        width={Math.max(h, w * fill)}
        height={h}
        rx={h / 2}
        className={surfaceTone[tone]}
      />
    </Enter>
  );
}

/** A sequence of moments — a day at a counter, a period, a sync schedule. */
export function Ticks({
  x,
  y,
  count,
  gap = 17,
  height = 11,
  tone = "base",
  step = 0,
}: Step & {
  x: number;
  y: number;
  count: number;
  gap?: number;
  height?: number;
  tone?: Tone;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <Flow
          key={index}
          d={`M ${x + index * gap} ${y} L ${x + index * gap} ${y + height}`}
          tone={tone}
          width={1.6}
          step={step + index * 0.22}
        />
      ))}
    </>
  );
}

/** Every diagram is this function: it receives nothing and draws one idea. */
export type ProblemVisualComponent = () => ReactNode;
