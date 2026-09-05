"use client";

import { useEffect, useRef, useState } from "react";

const clamp = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

/**
 * Scroll-driven stage controller for the feature viewports.
 *
 * Every feature section on /features animates a mechanism — a scan beam, a
 * session dial, an invoice assembling itself — and all of them are driven by
 * one number: how far the section has travelled into view.
 *
 *   p = 0  section top is at 90% of the viewport (just appearing)
 *   p = 1  section top has reached the top of the viewport (fully on screen)
 *
 * The value is written straight onto the element as `--p`, so the mechanisms
 * are pure CSS off a custom property and scrolling never re-renders React.
 * `stage` is the same progress quantised into steps, and it is the only piece
 * that causes a render — it changes a handful of times per section.
 *
 * Reduced motion pins `--p` to 1 and the stage to its last step: the finished
 * state is the informative one, so nothing is lost by skipping the travel.
 */
export function useStage<T extends HTMLElement>(steps = 0) {
  const ref = useRef<T>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      node.style.setProperty("--p", "1");
      // Deferred rather than set inline: the effect body only talks to the DOM.
      const settle = requestAnimationFrame(() => {
        if (steps > 0) setStage(steps - 1);
      });
      return () => cancelAnimationFrame(settle);
    }

    let frame = 0;
    let lastStage = -1;

    const measure = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const travel = viewport * 0.85;
      const progress = clamp((viewport * 0.9 - rect.top) / travel);
      node.style.setProperty("--p", progress.toFixed(4));
      if (steps > 0) {
        const next = Math.min(steps - 1, Math.floor(progress * steps));
        if (next !== lastStage) {
          lastStage = next;
          setStage(next);
        }
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [steps]);

  return { ref, stage };
}
