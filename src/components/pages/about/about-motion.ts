"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Height of the sticky site header. Pinned frames sit directly beneath it, so
 * the scrub has to start when the stage reaches that line rather than the top
 * of the viewport.
 */
export const HEADER_OFFSET = 80;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Reveal-on-scroll, once.
 *
 * The hidden state lives in CSS so the animation stays on opacity/transform.
 * Two safety nets keep content from getting stuck invisible: an immediate
 * reveal when IntersectionObserver is missing, and a 2s failsafe.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.18) {
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
      { threshold, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(node);

    const failsafe = window.setTimeout(() => setRevealed(true), 2000);
    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [threshold]);

  return { ref, revealed };
}

/**
 * Scroll-scrubbed progress for a pinned stage.
 *
 * The outer element is taller than the viewport and holds a `position: sticky`
 * frame; progress is how far through that extra height the page has scrolled.
 * The value is written straight to the `--p` custom property on the node
 * instead of React state, so scrubbing never re-renders the tree. When `steps`
 * is set, the coarse step index *is* reported as state — it changes a handful
 * of times, which is cheap and lets components swap discrete content.
 *
 * Reduced motion pins progress at 1 so every scrubbed visual shows its
 * finished, fully legible state.
 */
export function useStageProgress<T extends HTMLElement>(steps = 0) {
  const ref = useRef<T>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      node.style.setProperty("--p", "1");
      if (steps === 0) return;
      const settle = window.setTimeout(() => setStep(steps - 1), 0);
      return () => window.clearTimeout(settle);
    }

    let frame = 0;
    let lastStep = -1;

    const measure = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      const stageFrame = node.firstElementChild as HTMLElement | null;
      const isPinned = stageFrame
        ? window.getComputedStyle(stageFrame).position === "sticky"
        : false;

      // A mobile stage can be taller than the viewport even though its frame
      // is normal flow. Determine the mode from the frame itself, not from
      // the stage height, otherwise tall handset sections complete in a tiny
      // scroll range and their animation appears to be skipped.
      const raw = isPinned
        ? (HEADER_OFFSET - rect.top) / (rect.height - viewport + HEADER_OFFSET)
        : (viewport - rect.top) / (viewport + rect.height);
      const progress = Math.min(1, Math.max(0, raw));

      node.style.setProperty("--p", progress.toFixed(4));

      if (steps > 0) {
        const next = Math.min(steps - 1, Math.floor(progress * steps));
        if (next !== lastStep) {
          lastStep = next;
          setStep(next);
        }
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [steps]);

  return { ref, step };
}

/**
 * Progress of an element travelling through the viewport, 0 as its top edge
 * enters from below to 1 once it has left the top. Used for parallax on
 * sections that are *not* pinned. Writes `--t` on the node.
 */
export function useViewportProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion()) {
      node.style.setProperty("--t", "0.5");
      return;
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const span = window.innerHeight + rect.height;
      const travelled = window.innerHeight - rect.top;
      node.style.setProperty(
        "--t",
        Math.min(1, Math.max(0, travelled / span)).toFixed(4),
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return ref;
}

/**
 * How far the page has scrolled through its first viewport, 0..1, written as
 * `--s`. The hero uses it to drift and fade as the narrative takes over.
 */
export function usePageScrollDepth<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion()) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const depth = Math.min(
        1,
        Math.max(0, window.scrollY / window.innerHeight),
      );
      node.style.setProperty("--s", depth.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return ref;
}

/**
 * Pointer parallax, normalised to -1..1 on both axes and written as `--mx` /
 * `--my`. Skipped on coarse pointers and under reduced motion, where the
 * variables simply stay at their CSS-declared 0.
 */
export function usePointerParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      node.style.setProperty("--mx", x.toFixed(3));
      node.style.setProperty("--my", y.toFixed(3));
    };

    const onMove = (event: PointerEvent) => {
      x = (event.clientX / window.innerWidth) * 2 - 1;
      y = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return ref;
}
