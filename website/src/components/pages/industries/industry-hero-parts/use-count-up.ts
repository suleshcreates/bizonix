"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Counts an element's text from zero up to `value` once its card has entered.
 *
 * It writes the node directly rather than holding a frame counter in state.
 * Sixty setState calls a second to change one string is the thing React's
 * effect rules are warning about, and driving the DOM from an effect is
 * precisely the case they carve out — so this is both the faster path and the
 * idiomatic one.
 *

 * The run is restartable on purpose. Guarding it with a "already-played" flag looks
 * tidier and is a trap: React re-invokes effects in development, the cleanup
 * cancels the in-flight frame, and the guarded re-run then refuses to start —
 * which leaves the number frozen a few short of its final value. Restarting is
 * idempotent and always ends on the right figure.
 *
 * What is rendered server-side, before hydration, with JavaScript disabled, and
 * whenever the reader has asked for reduced motion, is the same thing: the
 * final figure. The animation only ever replaces a correct number with the same
 * correct number, which is why none of those cases needs a special branch and
 * why there is no hydration mismatch to manage.
 */
export function useCountUp(
  value: number,
  active: boolean,
  format: (n: number) => string,
  duration = 900,
) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /* Reduced motion gets the number, immediately — not a shorter animation.
       Someone who asked for no motion asked for no motion. */
    if (!active || reduced) {
      node.textContent = format(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    /* Ease-out cubic, so the count decelerates into its final value rather
       than stopping dead on it. */
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = format(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, duration, format, reduced, value]);

  return ref;
}
