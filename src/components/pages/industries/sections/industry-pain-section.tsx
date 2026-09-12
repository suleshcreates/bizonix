"use client";

import { useEffect, useState } from "react";
import { industryPainData } from "@/lib/content/industries/industry-pain-data";
import type { IndustryId } from "@/lib/content/industries/industries";
import styles from "@/components/pages/industries/industries.module.css";
import { IndustryPainHeader } from "./industry-pain-parts/industry-pain-header";
import { IndustryPainRow } from "./industry-pain-parts/industry-pain-row";

export function IndustryPainSection() {
  const [activeIndustryId, setActiveIndustryId] = useState<IndustryId | null>(
    null,
  );

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndustryId(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <section
      className={styles.industryPainSection__section}
      aria-labelledby="industry-pain-title"
    >
      <div
        className={styles.industryPainSection__atmosphere}
        aria-hidden="true"
      />
      <div className={styles.industryPainSection__shell}>
        <IndustryPainHeader />
        <div className={styles.industryPainSection__rows}>
          {industryPainData.map((item, index) => (
            <IndustryPainRow
              key={item.id}
              item={item}
              index={index}
              isOpen={activeIndustryId === item.id}
              onToggle={() =>
                setActiveIndustryId((current) =>
                  current === item.id ? null : item.id,
                )
              }
            />
          ))}
        </div>
        <p className={styles.industryPainSection__closing}>
          One operating model. <span>Three different realities.</span>
        </p>
      </div>
    </section>
  );
}
