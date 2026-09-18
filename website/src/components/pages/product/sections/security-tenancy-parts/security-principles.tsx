import { History, KeyRound, SquareStack } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { securityPrinciples } from "@/lib/content/product/security-access-model";
import styles from "@/components/pages/product/product.module.css";

const principleIcon: Record<string, LucideIcon> = {
  "01": KeyRound,
  "02": SquareStack,
  "03": History,
};

export function SecurityPrinciples() {
  return (
    <ol className={styles.securityTenancy__principles}>
      {securityPrinciples.map((principle) => {
        const Icon = principleIcon[principle.index] ?? KeyRound;
        return (
          <li key={principle.index} className={styles.securityTenancy__principle}>
            <div className={styles.securityTenancy__principleTop}>
              <Icon
                size={15}
                strokeWidth={2}
                className={styles.securityTenancy__principleIcon}
                aria-hidden="true"
              />
              <span className={styles.securityTenancy__principleIndex}>{principle.index}</span>
            </div>
            <h3 className={styles.securityTenancy__principleTitle}>{principle.title}</h3>
            <p className={styles.securityTenancy__principleBody}>{principle.body}</p>
          </li>
        );
      })}
    </ol>
  );
}
