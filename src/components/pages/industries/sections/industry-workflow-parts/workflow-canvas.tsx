import { Clock3 } from "lucide-react";
import type { IndustryWorkflowStage } from "@/lib/content/industries/industry-workflow-data";
import styles from "@/components/pages/industries/industries.module.css";
import { WorkflowSpine } from "./workflow-spine";

export function WorkflowCanvas({
  stages,
  activeIndex,
  onSelect,
}: {
  stages: readonly IndustryWorkflowStage[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className={styles.industryWorkflowSection__canvas}>
      <svg
        className={styles.industryWorkflowSection__flowTexture}
        viewBox="0 0 1200 430"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M-20 330C190 170 390 400 610 215S1000 120 1230 260" />
        <path d="M-30 370C210 230 420 430 650 250S1010 180 1230 310" />
      </svg>
      <div className={styles.industryWorkflowSection__canvasCue}>
        <Clock3 size={15} aria-hidden="true" />
        <span>Connected throughout the day</span>
      </div>
      <WorkflowSpine
        stages={stages}
        activeIndex={activeIndex}
        onSelect={onSelect}
      />
    </div>
  );
}
