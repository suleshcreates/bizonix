"use client";

import { useEffect, useRef, useState } from "react";

/** Splits "89%" into 89 and "%" so only the number animates. */
function parseStat(value: string) {
  const match = value.match(/^([^\d-]*)(-?[\d.,]+)([\s\S]*)$/);
  if (!match) return null;
  const numeric = Number(match[2].replace(/,/g, ""));
  if (!Number.isFinite(numeric)) return null;
  return { prefix: match[1], value: numeric, suffix: match[3] };
}

/**
 * Reveal-on-scroll.
 *
 * The hidden state lives in CSS on `[data-reveal]`, so the animation is
 * GPU-only (opacity + transform) and never affects layout. Two safety nets keep
 * content from getting stuck invisible: a zero-delay reveal when
 * IntersectionObserver is unavailable, and a 2s failsafe timer.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      const immediate = window.setTimeout(() => setRevealed(true), 0);
      return () => window.clearTimeout(immediate);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    const failsafe = window.setTimeout(() => setRevealed(true), 2000);
    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return { ref, revealed };
}

/**
 * Counts a numeric stat up when it scrolls into view. Non-numeric values (the
 * approved qualitative evidence, for example) render as-is, so the same
 * component serves both without a second code path.
 */
export function StatValue({ value, active }: { value: string; active: boolean }) {
  const parsed = parseStat(value);
  const [display, setDisplay] = useState(() =>
    parsed ? `${parsed.prefix}0${parsed.suffix}` : value,
  );
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const target = parseStat(value);
    if (!target || !active) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : 1400;
    const decimals = (String(target.value).split(".")[1] ?? "").length;
    const start = performance.now();

    const step = (now: number) => {
      const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      // easeOutCubic — fast start, gentle settle.
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Number((target.value * eased).toFixed(decimals));
      setDisplay(`${target.prefix}${current.toLocaleString("en-IN")}${target.suffix}`);
      if (t < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, active]);

  if (!parsed) return <>{value}</>;
  return <span aria-label={value}>{display}</span>;
}
