"use client";

import type { LucideIcon } from "lucide-react";
import type { Industry, IndustryId } from "@/lib/content/industries/industries";
import styles from "@/components/pages/industries/industries.module.css";

export function IndustrySelectorItem({
  industry,
  icon: Icon,
  descriptor,
  active,
  onSelect,
}: {
  industry: Industry;
  icon: LucideIcon;
  descriptor: string;
  active: boolean;
  onSelect: (id: IndustryId) => void;
}) {
  return (
    <button
      type="button"
      className={styles.howBizonixFits__selectorItem}
      data-active={active ? "true" : "false"}
      aria-pressed={active}
      onClick={() => onSelect(industry.id)}
    >
      <span className={styles.howBizonixFits__selectorIcon} aria-hidden="true">
        <Icon size={22} strokeWidth={1.9} />
      </span>
      <span className={styles.howBizonixFits__selectorBody}>
        <span className={styles.howBizonixFits__selectorName}>{industry.name}</span>
        <span className={styles.howBizonixFits__selectorDescriptor}>{descriptor}</span>
      </span>
      <span className={styles.howBizonixFits__selectorRule} aria-hidden="true" />
    </button>
  );
}
