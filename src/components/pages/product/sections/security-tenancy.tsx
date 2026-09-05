"use client";

import { useEffect, useRef, useState } from "react";
import type { SecurityEntityId } from "@/lib/content/product/security-access-model";
import { defaultEntityId, getEntity } from "@/lib/content/product/security-access-model";
import { AccessArchitecture } from "./security-tenancy-parts/access-architecture";
import { AccessFlow } from "./security-tenancy-parts/access-flow";
import { AuditTrail } from "./security-tenancy-parts/audit-trail";
import { SecurityHeader } from "./security-tenancy-parts/security-header";
import { SecurityPrinciples } from "./security-tenancy-parts/security-principles";
import styles from "@/components/pages/product/product.module.css";

export function SecurityTenancy() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [activeId, setActiveId] = useState<SecurityEntityId>(defaultEntityId);
  const active = getEntity(activeId);

  // The architecture surveys itself once, when it first comes into view.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="security-tenancy"
      className={styles.securityTenancy__section}
      data-entered={entered ? "true" : "false"}
      aria-labelledby="security-tenancy-title"
    >
      <div className={styles.securityTenancy__atmosphere} aria-hidden="true" />

      <div className={styles.securityTenancy__shell}>
        <SecurityHeader titleId="security-tenancy-title" />

        <div className={styles.securityTenancy__layout}>
          <div className={styles.securityTenancy__rail}>
            <SecurityPrinciples />
          </div>

          <div className={styles.securityTenancy__architecture}>
            <AccessArchitecture activeId={activeId} onActivate={setActiveId} />
          </div>

          <div className={styles.securityTenancy__evidence}>
            <AuditTrail entity={active} />
          </div>
        </div>

        <AccessFlow activeId={activeId} onActivate={setActiveId} />
      </div>
    </section>
  );
}
