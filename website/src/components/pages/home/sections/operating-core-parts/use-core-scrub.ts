"use client";

import { useEffect, useRef } from "react";

/** Height of the sticky site header (`header.h-20`). The pinned stage sits
 *  directly under it, so the scrub has to start at that line. */
const HEADER_OFFSET = 80;

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

/**
 * The single number the whole section runs on.
 *
 * `--p` goes 0 → 1 across the stage's pin travel and is written straight onto
 * the section element, so scrubbing never re-renders React. Every beat is a
 * window on that one value, expressed in CSS:
 *
 *   0.00 – 0.25  lanes establish
 *   0.25 – 0.50  connectors draw
 *   0.50 – 0.80  core assembles, lanes recede, tokens fly, one pulse
 *   0.80 – 0.92  "One operating truth." reveals
 *
 * `--p` *defaults to 1 in CSS*. That is deliberate: with JavaScript off, before
 * hydration, or under `prefers-reduced-motion`, nothing here ever runs and the
 * section renders in its finished, fully legible state. Motion is only ever
 * subtraction from a complete page.
 *
 * One IntersectionObserver arms the sequence. Rather than unobserving once it
 * has played, it stays alive to *detach* the scroll listener when the section
 * leaves the viewport and re-attach when it returns — the point of the brief
 * was that no scroll work happens off screen, and arm/disarm does that in both
 * directions where unobserve-after-play only does it once.
 */
export function useCoreScrub<
  S extends HTMLElement,
  W extends HTMLElement,
  O extends HTMLElement,
>() {
  const sectionRef = useRef<S>(null);
  const wrapRef = useRef<W>(null);
  const outcomeRef = useRef<O>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrap = wrapRef.current;
    const outcome = outcomeRef.current;
    if (!section || !wrap) return;

    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return; // --p stays at its CSS default of 1: the finished state.
    }

    section.dataset.motion = "armed";

    let frame = 0;
    let listening = false;

    const measure = () => {
      frame = 0;
      const rect = wrap.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // The pinned frame is `100svh - HEADER_OFFSET` tall, so everything above
      // that in the wrapper's height is scrub range.
      const travel = rect.height - viewport + HEADER_OFFSET;

      // Below the pinning breakpoint (and on short viewports) the stage is a
      // normal-flow block with no scrub range. Scrub against its own trip
      // through the viewport instead.
      const raw =
        travel > 80
          ? (HEADER_OFFSET - rect.top) / travel
          : (viewport * 0.82 - rect.top) / (rect.height * 0.72);

      section.style.setProperty("--p", clamp01(raw).toFixed(4));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const attach = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    };

    const detach = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };

    // Seed the value before anything can paint the default, then arm.
    measure();

    if (typeof IntersectionObserver === "undefined") {
      attach();
      return () => {
        if (frame) cancelAnimationFrame(frame);
        detach();
        delete section.dataset.motion;
      };
    }

    if (
      outcome &&
      outcome.getBoundingClientRect().top >= window.innerHeight * 0.88
    ) {
      outcome.setAttribute("data-reveal", "out");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === section) {
            if (entry.isIntersecting) {
              attach();
              measure();
            } else {
              detach();
            }
          }

          if (outcome && entry.target === outcome && entry.isIntersecting) {
            outcome.setAttribute("data-reveal", "in");
            observer.unobserve(outcome);
          }
        }
      },
      { threshold: [0, 0.14], rootMargin: "15% 0px 15% 0px" },
    );
    observer.observe(section);
    if (outcome?.hasAttribute("data-reveal")) observer.observe(outcome);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      detach();
      delete section.dataset.motion;
    };
  }, []);

  return { sectionRef, wrapRef, outcomeRef };
}
