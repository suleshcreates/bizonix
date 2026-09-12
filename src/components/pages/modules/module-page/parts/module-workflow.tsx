"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { ModuleWorkflowData } from "@/lib/content/modules/module-pages/types";
import { ModuleHeading } from "./module-heading";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * The operating story, as one section on every module page.
 *
 * There is a single presentation, not a variant per module: wide viewports get
 * one horizontal timeline that spans the content column, narrow ones get one
 * vertical timeline. Both are the same DOM — a flat list of steps where each
 * step owns the segment of line that leaves it — so the orientation is a
 * media query rather than a second markup tree. Nothing here branches on a
 * module; the nine differ only in `workflow` data.
 *
 * Layout notes that the CSS depends on:
 *  - the rail is built from per-step segments, so the line always terminates
 *    exactly on the last node whatever the step count is;
 *  - on desktop the step is a row-subgrid of the track, which is what keeps
 *    titles, descriptions and record pills on shared baselines across columns
 *    even when one description runs a line longer.
 *
 * Motion is authored here rather than left to the page's global reveal batch,
 * because the order matters: the line has to arrive at a node before that node
 * lights up. After the entrance the section is static apart from one signal
 * travelling the path, which pauses whenever the section is off screen.
 */

export function ModuleWorkflow({ workflow }: { workflow: ModuleWorkflowData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  const reducedMotion = useReducedMotion();
  const steps = workflow.steps;
  const stepCount = steps.length;

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    /* Reduced motion: the CSS resting state is already the finished state, so
       there is nothing to set up and nothing to loop. */
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-wf-step]");
      const nodes = gsap.utils.toArray<HTMLElement>("[data-wf-node]");
      const fills = gsap.utils.toArray<HTMLElement>("[data-wf-fill]");
      const signals = gsap.utils.toArray<HTMLElement>("[data-wf-signal]");
      const copy = items.map((item) =>
        gsap.utils.toArray<HTMLElement>("[data-wf-copy]", item),
      );

      gsap.set(nodes, { opacity: 0, scale: 0.86 });
      gsap.set(copy.flat(), { opacity: 0, y: 12 });
      gsap.set(fills, { "--fill": "0%" });

      /* Entrance: node, its copy, then the segment that carries the eye to the
         next node. Steps overlap so five of them read as one gesture. */
      const enter = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" },
      });

      items.forEach((_, index) => {
        const at = index * 0.24;
        enter.to(nodes[index], { opacity: 1, scale: 1, duration: 0.34 }, at);
        enter.to(
          copy[index],
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 },
          at + 0.06,
        );
        if (fills[index]) {
          enter.to(
            fills[index],
            { "--fill": "100%", duration: 0.32, ease: "none" },
            at + 0.12,
          );
        }
      });

      /* The one recurring motion: a single signal walking the whole path, then
         a long pause. It is created paused and only ever runs while the
         section is on screen. */
      const loop = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2.6 });
      signals.forEach((signal, index) => {
        const at = index * 0.56;
        loop.set(signal, { opacity: 1 }, at);
        loop.fromTo(
          signal,
          { "--t": 0 },
          { "--t": 1, duration: 0.56, ease: "none" },
          at,
        );
        loop.set(signal, { opacity: 0 }, at + 0.56);
      });

      let onScreen = false;
      let entered = false;

      enter.eventCallback("onComplete", () => {
        entered = true;
        if (onScreen) loop.play();
      });

      ScrollTrigger.create({
        trigger: track,
        start: "top 84%",
        once: true,
        onEnter: () => enter.play(),
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          onScreen = self.isActive;
          if (!onScreen) loop.pause();
          else if (entered) loop.play();
        },
      });
    }, section);

    return () => context.revert();
  }, [reducedMotion, stepCount]);

  return (
    <section
      ref={sectionRef}
      className={`${styles.modulePage__workflow} ${styles.modulePage__onDark}`}
      aria-labelledby="module-workflow"
    >
      <span className={styles.modulePage__workflowGrid} aria-hidden="true" />

      <div className={styles.modulePage__shell}>
        <header className={styles.modulePage__sectionHead}>
          <p className={styles.modulePage__eyebrow} data-reveal>
            <span
              className={styles.modulePage__eyebrowDot}
              aria-hidden="true"
            />
            Workflow
          </p>
          <ModuleHeading id="module-workflow" text={workflow.title} />
          <p data-reveal>{workflow.intro}</p>
        </header>

        <ol
          ref={trackRef}
          className={styles.modulePage__steps}
          data-steps={stepCount}
          style={{ "--step-count": stepCount } as React.CSSProperties}
        >
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={styles.modulePage__step}
              style={{ "--i": index } as React.CSSProperties}
              data-wf-step
            >
              <span className={styles.modulePage__stepRail} aria-hidden="true">
                <span className={styles.modulePage__stepNode} data-wf-node>
                  {step.index}
                </span>
                {index < stepCount - 1 ? (
                  <span className={styles.modulePage__connector}>
                    <span
                      className={styles.modulePage__connectorFill}
                      data-wf-fill
                    />
                    <span
                      className={styles.modulePage__connectorSignal}
                      data-wf-signal
                    />
                  </span>
                ) : null}
              </span>

              {step.lane ? (
                <p className={styles.modulePage__stepLane} data-wf-copy>
                  <i aria-hidden="true" />
                  {step.lane}
                </p>
              ) : null}

              <h3 className={styles.modulePage__stepTitle} data-wf-copy>
                <span
                  className={styles.modulePage__srOnly}
                >{`Step ${step.index}: `}</span>
                {step.title}
              </h3>

              <p className={styles.modulePage__stepText} data-wf-copy>
                {step.body}
              </p>

              <p className={styles.modulePage__stepRecord} data-wf-copy>
                <i aria-hidden="true" />
                {step.record}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
