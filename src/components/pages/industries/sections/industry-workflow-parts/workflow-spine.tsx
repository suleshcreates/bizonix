import type { IndustryWorkflowStage } from "@/lib/content/industries/industry-workflow-data";
import styles from "@/components/pages/industries/industries.module.css";
import { WorkflowStage } from "./workflow-stage";

export function WorkflowSpine({ stages, activeIndex, onSelect }: { stages: readonly IndustryWorkflowStage[]; activeIndex: number; onSelect: (index: number) => void }) {
  const progress = stages.length > 1 ? (activeIndex / (stages.length - 1)) * 100 : 0;
  return (
    <div className={styles.industryWorkflowSection__spineWrap}>
      <div className={styles.industryWorkflowSection__spine} aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <div className={styles.industryWorkflowSection__stages}>
        {stages.map((stage, index) => <WorkflowStage key={stage.id} stage={stage} active={index === activeIndex} onSelect={() => onSelect(index)} />)}
      </div>
    </div>
  );
}
