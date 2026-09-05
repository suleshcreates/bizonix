import { Layers, ShieldCheck, Signal, Workflow } from "lucide-react";
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
          <h1 id="industries-title" className={styles.industriesHero__title}>
            Built for the way your <span>business actually operates.</span>
          </h1>
          <p className={styles.industriesHero__summary}>
            <span>Different industries. Different realities.</span>{" "}
            <span>One platform that adapts to the way you work.</span>
          </p>
        </div>
        <ul className={styles.industriesHero__benefits}>
          {benefits.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon size={15} strokeWidth={2.1} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
