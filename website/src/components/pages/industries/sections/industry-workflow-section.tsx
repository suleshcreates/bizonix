"use client";

import { useEffect, useState } from "react";
import type { IndustryId } from "@/lib/content/industries/industries";
import { industryWorkflowData } from "@/lib/content/industries/industry-workflow-data";
import styles from "@/components/pages/industries/industries.module.css";
import { IndustrySelector } from "./industry-workflow-parts/industry-selector";
import { WorkflowCanvas } from "./industry-workflow-parts/workflow-canvas";
import { WorkflowSummary } from "./industry-workflow-parts/workflow-summary";

const AUTO_DELAY = 3000;
const MANUAL_DELAY = 5000;

export function IndustryWorkflowSection() {
  const [activeIndustryId, setActiveIndustryId] =
    useState<IndustryId>("apparel");
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [nextDelay, setNextDelay] = useState(AUTO_DELAY);
  const [timerVersion, setTimerVersion] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const workflow = industryWorkflowData[activeIndustryId];

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setTimeout(() => {
      setActiveStageIndex((current) => (current + 1) % workflow.stages.length);
      setNextDelay(AUTO_DELAY);
    }, nextDelay);
    return () => window.clearTimeout(timer);
  }, [
    activeStageIndex,
    activeIndustryId,
    nextDelay,
    reduceMotion,
    timerVersion,
    workflow.stages.length,
  ]);

  function selectIndustry(id: IndustryId) {
    setActiveIndustryId(id);
    setActiveStageIndex(0);
    setNextDelay(AUTO_DELAY);
    setTimerVersion((version) => version + 1);
  }

  function selectStage(index: number) {
    setActiveStageIndex(index);
    setNextDelay(MANUAL_DELAY);
    setTimerVersion((version) => version + 1);
  }

  return (
    <section
      className={styles.industryWorkflowSection__section}
      aria-labelledby="industry-workflow-title"
    >
      <div className={styles.industryWorkflowSection__shell}>
        <header className={styles.industryWorkflowSection__header}>
          <p className={styles.industryWorkflowSection__eyebrow}>
            04 — Workflow
          </p>
          <h2 id="industry-workflow-title">
            Industry <span>day-in-life.</span>
          </h2>
          <p>
            See how work flows across the day — from the first action to the
            final business update.
          </p>
        </header>
        <IndustrySelector
          activeId={activeIndustryId}
          onSelect={selectIndustry}
        />
        <WorkflowCanvas
          stages={workflow.stages}
          activeIndex={activeStageIndex}
          onSelect={selectStage}
        />
        <WorkflowSummary labels={workflow.stages.map((stage) => stage.title)} />
      </div>
    </section>
  );
}
