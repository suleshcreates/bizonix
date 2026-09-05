import { BarChart3, Boxes, LayoutGrid, Receipt, ShoppingBag, Users } from "lucide-react";
import type { SystemNodeData } from "@/lib/content/product/system-map-data";
import styles from "@/components/pages/product/product.module.css";

const icons = { orders: ShoppingBag, inventory: Boxes, catalog: LayoutGrid, customers: Users, finance: Receipt, insights: BarChart3 };

interface SystemNodeProps {
  node: SystemNodeData;
  active: boolean;
  dimmed: boolean;
  onEnter: (id: string) => void;
  onLeave: () => void;
}

export function SystemNode({ node, active, dimmed, onEnter, onLeave }: SystemNodeProps) {
  const Icon = icons[node.icon];
  return (
    <button type="button" className={styles.finalSystemMap__nodeWrap} style={{ left: `${node.x}%`, top: `${node.y}%` }} data-node={node.id} data-tone={node.connectionType} data-active={active ? "true" : "false"} data-dimmed={dimmed ? "true" : "false"} onMouseEnter={() => onEnter(node.id)} onMouseLeave={onLeave} onFocus={() => onEnter(node.id)} onBlur={onLeave} aria-label={`${node.title}: ${node.description.replace("\n", " ")}`}>
      <span className={styles.finalSystemMap__nodeIconWrap} aria-hidden="true"><Icon size={20} strokeWidth={1.9} /></span>
      <span className={styles.finalSystemMap__nodeCopy}>
        <strong className={styles.finalSystemMap__nodeTitle}>{node.title}</strong>
        <span className={styles.finalSystemMap__nodeDescription}>{node.description}</span>
      </span>
    </button>
  );
}
