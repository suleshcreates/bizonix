import { Boxes, ShieldCheck, Store, Users } from "lucide-react";
import styles from "@/components/pages/modules/modules.module.css";

const proofItems = [
  { icon: Store, value: "50K+", label: "Businesses trust Bizonix" },
  { icon: Boxes, value: "9", label: "Powerful modules" },
  { icon: Users, value: "1M+", label: "Users across India" },
  { icon: ShieldCheck, value: "99.9%", label: "Uptime & reliability" },
] as const;

export function ProofStrip() {
  return (
    <div className={styles.modulesHero__proof}>
      {proofItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className={styles.modulesHero__proofItem}>
            <span className={styles.modulesHero__proofIcon}>
              <Icon size={18} strokeWidth={1.9} />
            </span>
            <span>
              <strong>{item.value}</strong>
              <small>{item.label}</small>
            </span>
          </div>
        );
      })}
    </div>
  );
}
