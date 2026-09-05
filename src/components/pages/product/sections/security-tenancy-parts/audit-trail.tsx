import { Activity, Clock3, FileText, MapPin, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SecurityEntity } from "@/lib/content/product/security-access-model";
import styles from "@/components/pages/product/product.module.css";

const trail: { key: keyof SecurityEntity["audit"]; label: string; icon: LucideIcon }[] = [
  { key: "who", label: "Who", icon: UserRound },
  { key: "what", label: "What", icon: Activity },
  { key: "where", label: "Where", icon: MapPin },
  { key: "record", label: "Record", icon: FileText },
  { key: "when", label: "When", icon: Clock3 },
];

/**
 * The evidence the architecture produces. A floating annotation rail, never a
 * sidebar panel — the line is the container.
 */
export function AuditTrail({ entity }: { entity: SecurityEntity }) {
  return (
    <aside className={styles.securityTenancy__audit} aria-live="polite">
      <p className={styles.securityTenancy__auditHead}>Audit record</p>
      <dl className={styles.securityTenancy__auditList}>
        {trail.map(({ key, label, icon: Icon }) => (
          <div key={key} className={styles.securityTenancy__auditStep}>
            <span className={styles.securityTenancy__auditNode} aria-hidden="true">
              <Icon size={11} strokeWidth={2.2} />
            </span>
            <dt className={styles.securityTenancy__auditLabel}>{label}</dt>
            <dd className={styles.securityTenancy__auditValue}>{entity.audit[key]}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.securityTenancy__auditFoot}>Traceable to the operating record</p>
    </aside>
  );
}
