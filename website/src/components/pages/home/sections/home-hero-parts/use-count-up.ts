"use client";

import { useEffect, useState } from "react";

/**
 * Counts a KPI up to its target once, after `delay`. Returns the target
 * immediately when the visitor prefers reduced motion, so the console always
 * settles on the same figures either way.
 */
export function useCountUp(target: number, decimals: number, delay = 0) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let start = 0;
    const duration = 1100;

    // Progress is measured against the wall clock, not against the first
    // frame served. A throttled or backgrounded tab that hands over its
    // first frame seconds late therefore lands on the finished figure
    // instead of restarting the count from zero.
    const step = () => {
      const progress = Math.min(1, (performance.now() - start) / duration);
      // Ease-out cubic: fast off the mark, then a soft landing on the figure.
      setValue(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const timer = window.setTimeout(() => {
      start = performance.now();
      step();
    }, delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [target, delay]);

  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
