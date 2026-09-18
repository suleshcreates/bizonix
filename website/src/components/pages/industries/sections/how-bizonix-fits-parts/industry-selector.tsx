"use client";

import { Gem, Network, Shirt } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef } from "react";
import { industries } from "@/lib/content/industries/industries";
import type { IndustryId } from "@/lib/content/industries/industries";
import styles from "@/components/pages/industries/industries.module.css";
import { IndustrySelectorItem } from "./industry-selector-item";

const icons: Record<IndustryId, LucideIcon> = {
  apparel: Shirt,
  jewellery: Gem,
  franchise: Network,
};

const descriptors: Record<IndustryId, string> = {
  apparel: "Size · Colour · Season",
  jewellery: "Piece · Barcode · GRN",
  franchise: "Control · Allocation · Entities",
};

export function IndustrySelector({
  activeId,
  onSelect,
}: {
  activeId: IndustryId;
  onSelect: (id: IndustryId) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: React.KeyboardEvent) {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (step === 0) return;
    event.preventDefault();
    const index = industries.findIndex((item) => item.id === activeId);
    const next = industries[(index + step + industries.length) % industries.length];
    onSelect(next.id);
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>("button")
      [industries.indexOf(next)]?.focus();
  }

  return (
    <div
      ref={listRef}
      className={styles.howBizonixFits__selector}
      role="group"
      aria-label="Choose an industry to see the modules that matter"
      onKeyDown={handleKeyDown}
    >
      {industries.map((industry) => (
        <IndustrySelectorItem
          key={industry.id}
          industry={industry}
          icon={icons[industry.id]}
          descriptor={descriptors[industry.id]}
          active={industry.id === activeId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
