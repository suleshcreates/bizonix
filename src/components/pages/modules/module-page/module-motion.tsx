"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

/**
 * The page's only scroll choreography.
 *
 * One `ScrollTrigger.batch` for the whole document rather than a timeline per
 * card: elements marked `data-reveal` rise into place in the group they scroll
 * in with. The initial hidden state is set from JS, so a page without
 * JavaScript — or with reduced motion requested — simply renders finished
 * content instead of an empty one.
 *
 * The workflow spine owns its own scrub (see `module-workflow.tsx`); GSAP
 * never touches a property Framer Motion is animating.
 */
export function ModuleMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const root = document.querySelector<HTMLElement>("[data-module-page]");
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (targets.length === 0) return;

      gsap.set(targets, { opacity: 0, y: 26 });

      ScrollTrigger.batch(targets, {
        start: "top 88%",
        once: true,
        batchMax: 6,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.72,
            ease: "power3.out",
            stagger: 0.07,
            overwrite: true,
          }),
      });

      /* Anything already above the fold plays immediately rather than waiting
         for a scroll that may never happen on a short viewport. */
      ScrollTrigger.refresh();
    }, root);

    return () => context.revert();
  }, []);

  return null;
}
