import styles from "@/components/pages/industries/industries.module.css";

/** One shared grade + a bottom light-fall that carries the industry labels. */
export function IndustryOverlay() {
  return (
    <div className={styles.industriesHero__overlay} aria-hidden="true">
      <div className={styles.industriesHero__unify} />
      <div className={styles.industriesHero__skyfall} />
      <div className={styles.industriesHero__lightfall} />
    </div>
  );
}
