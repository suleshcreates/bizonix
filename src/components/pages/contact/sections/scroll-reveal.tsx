"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "@/components/pages/contact/contact.module.css";
import { useReveal } from "./motion";

export function ScrollReveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={styles.contact__scrollReveal}
      data-reveal
      data-revealed={revealed ? "true" : undefined}
      style={{ "--i": delay } as CSSProperties}
    >
      {children}
    </div>
  );
}
