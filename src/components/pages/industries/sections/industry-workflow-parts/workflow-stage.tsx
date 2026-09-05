import { Boxes, BookCheck, PackageCheck, ShoppingCart, Truck } from "lucide-react";
import type { IndustryWorkflowStage, WorkflowIconName } from "@/lib/content/industries/industry-workflow-data";
import styles from "@/components/pages/industries/industries.module.css";

const icons: Record<WorkflowIconName, typeof Boxes> = { receive: Boxes, prepare: PackageCheck, sell: ShoppingCart, move: Truck, close: BookCheck };

export function WorkflowStage({ stage, active, onSelect }: { stage: IndustryWorkflowStage; active: boolean; onSelect: () => void }) {
  const Icon = icons[stage.icon];
  return (
    <button type="button" className={styles.industryWorkflowSection__stage} data-active={active} aria-pressed={active} onClick={onSelect}>
      <span className={styles.industryWorkflowSection__stageOrder}>{stage.order}</span>
      <span className={styles.industryWorkflowSection__stageTime}>{stage.time}</span>
      <span className={styles.industryWorkflowSection__node} aria-hidden="true"><span><Icon size={21} strokeWidth={1.8} /></span></span>
      <span className={styles.industryWorkflowSection__stageCopy}>
        <strong>{stage.title}</strong>
        <em>{stage.description}</em>
        <span className={styles.industryWorkflowSection__actions}>
          {stage.actions.map((action) => <span key={action}>{action}</span>)}
        </span>
      </span>
    </button>
  );
}
