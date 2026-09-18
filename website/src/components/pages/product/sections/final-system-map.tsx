"use client";

import { useEffect, useRef, useState } from "react";
import { SupportRail } from "./final-system-map-parts/support-rail";
import { SystemMapCanvas } from "./final-system-map-parts/system-map-canvas";
import { SystemMapHeader } from "./final-system-map-parts/system-map-header";
import styles from "@/components/pages/product/product.module.css";

export function FinalSystemMapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

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
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="final-system-map"
      className={styles.finalSystemMap__section}
      data-entered={entered ? "true" : "false"}
      aria-label="See the operating model on your business"
    >
      {/* Background Atmosphere */}
      <div className={styles.finalSystemMap__atmosphere} aria-hidden="true" />

      <div className={styles.finalSystemMap__shell}>
        {/* Top / Main Grid: Editorial CTA (Left) + System Map (Right) */}
        <div className={styles.finalSystemMap__mainGrid}>
          <SystemMapHeader />
          <SystemMapCanvas />
        </div>

        {/* Bottom Continuous Support Rail */}
        <SupportRail />
      </div>
    </section>
  );
}
