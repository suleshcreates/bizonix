"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CircleDot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ModuleWorkflowData } from "@/lib/content/modules/module-pages/types";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * The operating story, as one component with five presentations.
 *
 * `variant` only chooses a layout modifier — the step model, the spine and the
 * scroll choreography are shared, so a new presentation is a class rather than
 * a second component. One ScrollTrigger drives the whole section: it scrubs a
 * `--progress` custom property on the spine and marks steps active as the
 * front of the line reaches them. Nothing else on the page animates these
 * nodes, so GSAP and Framer Motion never contend for the same properties.
 *
 * `entity-lanes` keeps the steps in operating sequence and labels the lane on
 * each one — a network flow crosses back and forth between head office and the
 * outlet, and reordering the steps into columns would misrepresent it.
 */

const variantClass: Record<ModuleWorkflowData["variant"], string> = {
  timeline: styles.modulePage__stepsTimeline,
  "operational-flow": styles.modulePage__stepsFlow,
  "step-cards": styles.modulePage__stepsCards,
  "entity-lanes": styles.modulePage__stepsLanes,
  "data-to-report": styles.modulePage__stepsReport,
};

export function ModuleWorkflow({ workflow }: { workflow: ModuleWorkflowData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const spineRef = useRef<HTMLSpanElement>(null);
  const [reached, setReached] = useState(0);

  const reducedMotion = useReducedMotion();
  const steps = workflow.steps;
  const stepCount = steps.length;

  useEffect(() => {
    const section = sectionRef.current;
    const spine = spineRef.current;
    if (!section || !spine) return;

    /* Reduced motion: no scrub and no partial states. Everything renders in
       its finished form, which is the accessible resting state anyway. */
    if (reducedMotion) {
      spine.style.setProperty("--progress", "100%");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      end: "bottom 80%",
      scrub: 0.6,
      onUpdate: (self) => {
        spine.style.setProperty(
          "--progress",
          `${(self.progress * 100).toFixed(2)}%`,
        );
        setReached(Math.min(stepCount, Math.ceil(self.progress * stepCount)));
      },
    });

    return () => trigger.kill();
  }, [stepCount, reducedMotion]);

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
            <span className={styles.modulePage__eyebrowDot} aria-hidden="true" />
            Workflow
          </p>
          <h2 id="module-workflow" data-reveal>
            {workflow.title}
          </h2>
          <p data-reveal>{workflow.intro}</p>
        </header>

        <ol
          className={`${styles.modulePage__steps} ${variantClass[workflow.variant]}`}
          style={{ "--step-count": stepCount } as React.CSSProperties}
        >
          <span ref={spineRef} className={styles.modulePage__spine} aria-hidden="true" />

          {steps.map((step, index) => (
            <li
              key={step.id}
              className={styles.modulePage__step}
              data-active={reducedMotion || index < reached}
              data-reveal
            >
              <span className={styles.modulePage__stepNode} aria-hidden="true">
                {step.index}
              </span>
              <div className={styles.modulePage__stepBody}>
                {step.lane ? (
                  <p className={styles.modulePage__stepLane}>
                    <i aria-hidden="true" />
                    {step.lane}
                  </p>
                ) : null}
                <h3>
                  <span className={styles.modulePage__srOnly}>{`Step ${step.index}: `}</span>
                  {step.title}
                </h3>
                <p>{step.body}</p>
                <p className={styles.modulePage__stepRecord}>
                  <CircleDot size={13} aria-hidden="true" />
                  {step.record}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
