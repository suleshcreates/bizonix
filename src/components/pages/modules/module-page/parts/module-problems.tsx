"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef } from "react";
import type { ProblemSectionData } from "@/lib/content/modules/module-pages/types";
import { ConsequenceBand } from "./problem-parts/consequence-band";
import { ModuleProblemGrid } from "./problem-parts/problem-grid";
import { ModuleProblemHeader } from "./problem-parts/problem-header";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * The universal problem section. One component, nine operational stories.
 *
 * It sits immediately after the hero and answers the question the hero does
 * not: the hero says what the module does, this says why the operation breaks
 * without it. It carries no product screen, no customer, no metric — a
 * screenshot belongs to the gallery section further down the page, and proof
 * belongs to the proof section, which stays absent until a customer has
 * approved one.
 *
 * Nothing here knows which module it is rendering. Layout, geometry, motion
 * and typography are fixed; `data` supplies the story and the accent supplies
 * the colour, so a tenth module would be a data file and nothing else.
 *
 * ── Motion ────────────────────────────────────────────────────────────────
 * One ScrollTrigger for the whole section, and no animation from JavaScript.
 * The trigger converts scroll progress into four attribute writes — a header
 * state, a state per column, a consequence state — and every reveal below is
 * a CSS transition keyed off those attributes. Three consequences follow:
 * scrubbing backwards runs the sequence in reverse for free, React never
 * re-renders while the section is on screen, and `prefers-reduced-motion`
 * needs no separate code path — the attributes simply stay in their finished
 * server-rendered state.
 *
 * The reader discovers the section in the order it was written: framing, then
 * each failure in turn, then what the three of them cost together.
 */

/** Where each beat takes over, as a fraction of the section's scroll. */
const HEADER_AT = 0.04;
const PROBLEM_AT = [0.15, 0.35, 0.55] as const;
const CONSEQUENCE_AT = 0.75;

type ItemState = "idle" | "quiet" | "active" | "settled";

export function ModuleProblems({ data }: { data: ProblemSectionData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);

  const registerItem = useCallback((index: number, node: HTMLElement | null) => {
    itemsRef.current[index] = node;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* Attribute writes go straight to the DOM. React owns the markup; the
       timeline owns four attributes on it, and the two never contend. */
    const setStates = (progress: number) => {
      const reached = PROBLEM_AT.filter((at) => progress >= at).length;
      const settled = progress >= CONSEQUENCE_AT;

      section.dataset.head = progress >= HEADER_AT ? "revealed" : "idle";
      section.dataset.consequence = settled ? "revealed" : "idle";

      itemsRef.current.forEach((node, index) => {
        if (!node) return;
        let state: ItemState = "idle";
        if (settled) state = "settled";
        else if (index < reached - 1) state = "quiet";
        else if (index === reached - 1) state = "active";
        if (node.dataset.state !== state) node.dataset.state = state;
      });
    };

    const context = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      const media = gsap.matchMedia();

      /* Desktop and tablet: one timeline across the whole section, so the
         three columns are read as a sequence rather than three independent
         reveals. */
      media.add(
        "(min-width: 720px) and (prefers-reduced-motion: no-preference)",
        () => {
          section.dataset.motion = "on";
          const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top 78%",
            end: "bottom 88%",
            onUpdate: (self) => setStates(self.progress),
            onRefresh: (self) => setStates(self.progress),
          });
          setStates(trigger.progress);

          return () => {
            section.dataset.motion = "off";
            setStates(1);
          };
        },
      );

      /* Phones: the three columns are stacked and never share a screen, so a
         sequence across the section would be invisible. Each column reveals
         on its own entry instead (§45), and un-reveals on the way back up so
         the behaviour still reverses. */
      media.add(
        "(max-width: 719px) and (prefers-reduced-motion: no-preference)",
        () => {
          section.dataset.motion = "on";
          section.dataset.head = "idle";
          section.dataset.consequence = "idle";

          const triggers = [
            ScrollTrigger.create({
              trigger: section,
              start: "top 82%",
              onToggle: (self) => {
                section.dataset.head = self.isActive ? "revealed" : "idle";
              },
            }),
            ...itemsRef.current.map((node) =>
              node
                ? ScrollTrigger.create({
                    trigger: node,
                    start: "top 84%",
                    onToggle: (self) => {
                      node.dataset.state = self.isActive ? "settled" : "idle";
                    },
                  })
                : null,
            ),
            ScrollTrigger.create({
              trigger: section,
              start: "bottom 96%",
              onToggle: (self) => {
                section.dataset.consequence = self.isActive
                  ? "revealed"
                  : "idle";
              },
            }),
          ];

          return () => {
            triggers.forEach((trigger) => trigger?.kill());
            section.dataset.motion = "off";
            setStates(1);
          };
        },
      );

      return () => media.revert();
    }, section);

    return () => {
      context.revert();
      /* Whatever the teardown reason — a media change, a route change, a
         reduced-motion switch — the section is left in its finished state. */
      setStates(1);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.problems__section}
      id="module-problems"
      aria-labelledby="module-problems-title"
      data-head="revealed"
      data-consequence="revealed"
      data-motion="off"
    >
      <div className={styles.problems__shell}>
        <ModuleProblemHeader data={data} headingId="module-problems-title" />
        <ModuleProblemGrid problems={data.problems} registerItem={registerItem} />
        <ConsequenceBand consequence={data.consequence} />
      </div>
    </section>
  );
}
