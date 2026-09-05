import styles from "@/components/pages/product/product.module.css";

interface IntegrationCoreProps {
  isHighlighted?: boolean;
}

/*
 * The circle — not the whole block — is the anchor the connectors aim at, so
 * the labels hang off it absolutely rather than sitting in flow beneath it.
 * In flow they added their own height to the block and pushed the circle
 * above the canvas centre, which is what pulled the connectors off target.
 */
export function IntegrationCore({
  isHighlighted = false,
}: IntegrationCoreProps) {
  return (
    <div className={styles.integrationSurface__coreNode} aria-label="Bizonix Operating Core">
      <div className={styles.integrationSurface__coreVisual}>
        <div className={styles.integrationSurface__coreAura} aria-hidden="true" />
        <div className={styles.integrationSurface__coreRingOuter} aria-hidden="true" />
        <div
          className={styles.integrationSurface__coreRingInner}
          style={{
            borderColor: isHighlighted
              ? "var(--bz-blue)"
              : "rgba(46, 196, 182, 0.4)",
            boxShadow: isHighlighted
              ? "0 6px 24px rgba(47, 107, 255, 0.25)"
              : undefined,
          }}
          aria-hidden="true"
        />
        <span className={styles.integrationSurface__corePulse} aria-hidden="true" />

        <svg
          className={styles.integrationSurface__coreIcon}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M32 9 53 21 32 33 11 21 32 9Z" fill="#2F6BFF" />
          <path d="M11 21 32 33v22L11 43V21Z" fill="#0B1F3A" />
          <path d="M53 21 32 33v22l21-12V21Z" fill="#2EC4B6" />
          <path
            d="M23 26.5 32 21l9 5.5-9 5.5-9-5.5Z"
            fill="white"
            fillOpacity=".9"
          />
        </svg>
      </div>

      <span className={styles.integrationSurface__coreLabels}>
        <span className={styles.integrationSurface__coreTitle}>Bizonix</span>
        <span className={styles.integrationSurface__coreSubtitle}>Operating core</span>
      </span>
    </div>
  );
}
