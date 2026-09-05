import styles from "@/components/pages/features/features.module.css";

/**
 * The hero's environment: a deep navy field with a navy depth wash, a fine
 * technical grid that fades out at the edges, two very slow atmospheric
 * pools, the ambient halo the product screen is lit by, a cool floor light,
 * and architectural hairlines at the edges with small nodes where they turn.
 *
 * This layer owns its own stylesheet (`hero-background.module.css`) so the
 * composition above it can change without touching the environment, and vice
 * versa. Everything here is restrained on purpose — it is the furthest-back
 * layer in the hierarchy and must never read louder than the screen or the
 * type.
 *
 * The arc geometry is authored in a 1440x900 space and drawn with `slice`, so
 * the line-work always reaches past the viewport edges instead of stopping
 * short of them. Node positions are the arc vertices in that same space.
 */
export function HeroBackground() {
  return (
    <div className={styles.heroBackground__backdrop} aria-hidden="true">
      <span className={styles.heroBackground__wash} />
      <span className={styles.heroBackground__grid} />
      <span className={styles.heroBackground__pools} />
      <span className={styles.heroBackground__halo} />
      <span className={styles.heroBackground__floor} />

      <svg
        className={styles.heroBackground__arcs}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g className={styles.heroBackground__arcGroup}>
          <path d="M -120 232 H 214 A 96 96 0 0 1 310 328 V 900" />
          <path d="M 1560 232 H 1226 A 96 96 0 0 0 1130 328 V 900" />
          <path d="M -120 690 H 150" />
          <path d="M 1560 690 H 1290" />
        </g>

        <g className={styles.heroBackground__arcNodes}>
          <circle cx="310" cy="328" r="2.4" />
          <circle cx="1130" cy="328" r="2.4" />
          <circle cx="150" cy="690" r="2.4" />
          <circle cx="1290" cy="690" r="2.4" />
        </g>
      </svg>
    </div>
  );
}
