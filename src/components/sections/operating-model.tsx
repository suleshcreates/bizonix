"use client";

import {
  ArrowLeftRight,
  BookOpen,
  Boxes,
  Database,
  Fingerprint,
  Layers3,
  PackagePlus,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";

const principles = [
  {
    icon: Database,
    title: "Shared foundation",
    body: "Products, series and operational context start from the same source.",
  },
  {
    icon: Fingerprint,
    title: "Scoped responsibility",
    body: "People act within the warehouse, brand or franchise scope they own.",
  },
  {
    icon: Layers3,
    title: "Consolidated oversight",
    body: "Central teams read across entities without forcing every team into the same lane.",
  },
] as const;

const flow = [
  {
    icon: PackagePlus,
    label: "Master",
    title: "Established at brand level",
    detail: "One governed product identity begins the chain.",
  },
  {
    icon: Boxes,
    label: "Stock",
    title: "Received by the responsible entity",
    detail: "Ownership and location are preserved at receipt.",
  },
  {
    icon: ArrowLeftRight,
    label: "Movement",
    title: "Carries source and destination",
    detail: "Every transfer keeps its full operating context.",
  },
  {
    icon: ShoppingBag,
    label: "Sale",
    title: "Posts to the operating channel",
    detail: "The counter, entity and customer path remain clear.",
  },
  {
    icon: BookOpen,
    label: "Books",
    title: "Retain the same business context",
    detail: "Finance receives the story, not just the final number.",
  },
] as const;

export function OperatingModel() {
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % flow.length);
    }, 2200);

    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      id="operating-model"
      className="operating-model-section scroll-mt-24"
    >
      <div className="shell">
        <div className="operating-model-heading">
          <div>
            <span className="eyebrow">
              Shared where useful. Separate where essential.
            </span>
            <h2 className="h2 mt-5">
              A connected network without blurred boundaries.
            </h2>
          </div>
          <p className="lede">
            Common masters create consistency. Entity-level roles, movements and
            ledgers preserve responsibility from the first product record to the
            final posting.
          </p>
        </div>

        <div className="operating-model-layout">
          <div className="operating-principles">
            {principles.map((principle, index) => (
              <article className="operating-principle" key={principle.title}>
                <span className="operating-principle-number">0{index + 1}</span>
                <span className="operating-principle-icon">
                  <principle.icon size={21} />
                </span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div
            className="data-flow-panel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="data-flow-head">
              <div>
                <span>The data path</span>
                <h3>Watch context move through the business.</h3>
              </div>
              <span className="data-flow-counter">0{activeStep + 1} / 05</span>
            </div>

            <div
              className="data-flow-track"
              style={
                {
                  "--flow-progress": `${(activeStep / (flow.length - 1)) * 100}%`,
                } as React.CSSProperties
              }
            >
              <span className="data-flow-line" aria-hidden="true">
                <i />
              </span>
              {flow.map((step, index) => {
                const isActive = activeStep === index;
                const isPassed = activeStep > index;
                return (
                  <button
                    type="button"
                    className={`data-flow-step ${isActive ? "is-active" : ""} ${isPassed ? "is-passed" : ""}`}
                    aria-pressed={isActive}
                    onClick={() => setActiveStep(index)}
                    key={step.label}
                  >
                    <span className="data-flow-node">
                      <step.icon size={18} />
                    </span>
                    <span className="data-flow-copy">
                      <small>{step.label}</small>
                      <strong>{step.title}</strong>
                      <em>{step.detail}</em>
                    </span>
                    <span className="data-flow-index">0{index + 1}</span>
                  </button>
                );
              })}
            </div>

            <div className="data-flow-foot">
              <span className="data-flow-context-dot" />
              <p>Operating context stays attached from master to books.</p>
              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
              >
                {paused ? "Resume flow" : "Pause flow"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
