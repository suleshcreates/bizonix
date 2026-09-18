import { Layers, ShieldCheck, Signal, Workflow } from "lucide-react";
import type { CSSProperties } from "react";
import styles from "@/components/pages/industries/industries.module.css";

const benefits = [
  { icon: Layers, label: "Unified data" },
  { icon: Workflow, label: "Connected workflows" },
  { icon: Signal, label: "Real-time visibility" },
  { icon: ShieldCheck, label: "Secure & compliant" },
] as const;

export function IndustriesEditorial() {
  return (
    <div className={styles.industriesHero__editorial}>
      <div className={styles.industriesHero__atmosphere} aria-hidden="true" />
      <div className={styles.industriesHero__editorialInner}>
        <div>
          <p className={styles.industriesHero__eyebrow}>Industries</p>
          {/* Two words are swapped out below the mobile breakpoint so the
              headline lands on two lines at phone widths without turning into
              a second, competing sentence. Only one variant is ever in the box
              tree — and so only one is ever in the accessibility tree.

              They are <i>, not <span>: the accent rule is `.title span`, and a
              span here would pick up the gradient. */}
          <h1 id="industries-title" className={styles.industriesHero__title}>
            Built for <i className={styles.industriesHero__wide}>the way</i>
            <i className={styles.industriesHero__narrow}>how</i> your{" "}
            <span>
              business <i className={styles.industriesHero__wide}>actually </i>
              operates.
            </span>
          </h1>
          <p className={styles.industriesHero__summary}>
            <span>Different industries. Different realities.</span>{" "}
            <span>One platform that adapts to the way you work.</span>
          </p>
        </div>
        <ul className={styles.industriesHero__benefits}>
          {benefits.map(({ icon: Icon, label }, index) => (
            <li key={label} style={{ "--i": index } as CSSProperties}>
              <Icon size={15} strokeWidth={2.1} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
