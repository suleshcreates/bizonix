"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

/**
 * The page's scroll choreography, and the only place GSAP touches /pricing.
 *
 * Four groups, marked in the markup with `data-reveal="…"`:
 *
 *   hero   plays on load — it is above the fold, so waiting for a scroll that
 *          may never come would leave the page looking broken
 *   tier   the three cards, staggered 120ms apart as the grid enters
 *   row    comparison rows, staggered tightly so the grid assembles downward
 *   faq    add-on rows and FAQ questions
 *   head   section eyebrows, headings and intros
 *
 * Division of labour with Framer Motion is strict: GSAP owns `opacity` and
 * `y` on the reveal targets and nothing else. Framer owns `backgroundColor` on
 * table rows, `transform` on the card hover wrapper, and the toggle and
 * accordion. No property is written by both libraries on the same node.
 *
 * The hidden state is set from JS, so a visitor without JavaScript — or one who
 * asked for reduced motion — gets finished content rather than a page of
 * invisible elements.
 */

type Group = {
  selector: string;
  /** Seconds between siblings in the same batch. */
  stagger: number;
  y: number;
  duration: number;
  /** How many elements may animate as one batch before a new one starts. */
  batchMax: number;
};

const GROUPS: readonly Group[] = [
  { selector: '[data-reveal="tier"]', stagger: 0.12, y: 30, duration: 0.72, batchMax: 3 },
  { selector: '[data-reveal="row"]', stagger: 0.045, y: 14, duration: 0.5, batchMax: 12 },
  { selector: '[data-reveal="faq"]', stagger: 0.07, y: 22, duration: 0.62, batchMax: 8 },
  { selector: '[data-reveal="head"]', stagger: 0.08, y: 24, duration: 0.66, batchMax: 4 },
];

export function PricingMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const root = document.querySelector<HTMLElement>("[data-pricing-page]");
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      /* Hero: no trigger. It is on screen at load. */
      const hero = gsap.utils.toArray<HTMLElement>('[data-reveal="hero"]');
      if (hero.length) {
        gsap.set(hero, { opacity: 0, y: 22 });
        gsap.to(hero, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.09,
          delay: 0.05,
        });
      }

      const settle = new Map<HTMLElement, Group>();

      for (const group of GROUPS) {
        const targets = gsap.utils.toArray<HTMLElement>(group.selector);
        if (!targets.length) continue;

        for (const target of targets) settle.set(target, group);
        gsap.set(targets, { opacity: 0, y: group.y });

        ScrollTrigger.batch(targets, {
          start: "top 88%",
          batchMax: group.batchMax,
          /* Enter only. There is deliberately no `onLeaveBack` here: resetting
             per element made a small scroll-up mid-section wipe the rows the
             reader had just seen, which is precisely the direction-change
             flicker this page is supposed to avoid. Replay is handled a whole
             section at a time, below. */
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: group.duration,
              ease: "power3.out",
              stagger: group.stagger,
              overwrite: true,
            }),
        });
      }

      /* Replay, scoped to a section rather than to an element.
       *
       * A section only re-arms once it is completely off screen — past the
       * bottom of the viewport or above its top. Scrolling around inside a
       * section, or nudging back up to re-read a row, never resets anything;
       * coming back to a section you had genuinely left plays it again. */
      const sections = new Set<HTMLElement>();
      for (const target of settle.keys()) {
        const section = target.closest("section");
        if (section) sections.add(section);
      }

      for (const section of sections) {
        const targets = [...settle.keys()].filter((el) => el.closest("section") === section);
        /* No `ScrollTrigger.refresh()` here. Refreshing re-measures every
           trigger and re-fires the batch that was just reset, which put the
           elements straight back on screen. The batch triggers re-arm on their
           own once the scroll position passes back before their start. */
        const rearm = () => {
          for (const target of targets) {
            const group = settle.get(target);
            if (!group) continue;
            gsap.set(target, { opacity: 0, y: group.y, overwrite: true });
          }
        };

        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onLeave: rearm,
          onLeaveBack: rearm,
        });
      }

      /* Anything already in view plays immediately rather than waiting for a
         scroll that may never happen on a tall viewport. */
      ScrollTrigger.refresh();
    }, root);

    return () => context.revert();
  }, []);

  return null;
}
