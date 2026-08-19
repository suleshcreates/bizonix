import styles from "../product-hero.module.css";

type HeroInsightConnectorProps = {
  side: "left" | "right";
};

/**
 * A single soft path linking one floating signal back to the product surface.
 * It sits beneath the dashboard, so the run is only visible in the open space
 * beside the panel and terminates cleanly at the panel edge.
 */
export function HeroInsightConnector({ side }: HeroInsightConnectorProps) {
  return (
    <svg
      className={`${styles.connectors} ${side === "left" ? styles.connectorLeft : styles.connectorRight}`}
      width="132"
      height="96"
      viewBox="0 0 132 96"
      fill="none"
      aria-hidden="true"
    >
      <path
        className={styles.connectorPath}
        d="M9 9C9 40 21 58 52 68C81 77 104 82 128 86"
      />
      <circle className={styles.connectorHalo} cx="9" cy="9" r="6.5" />
      <circle className={styles.connectorNode} cx="9" cy="9" r="2.6" />
    </svg>
  );
}
