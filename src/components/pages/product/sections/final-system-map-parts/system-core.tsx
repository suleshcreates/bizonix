import styles from "@/components/pages/product/product.module.css";

interface SystemCoreProps {
  isHighlighted?: boolean;
}

export function SystemCore({ isHighlighted = false }: SystemCoreProps) {
  return (
    <div
      className={styles.finalSystemMap__coreWrap}
      aria-label="Bizonix Operating core anchor"
    >
      <div className={styles.finalSystemMap__coreVisual}>
        {/* Soft radial atmospheric aura */}
        <div className={styles.finalSystemMap__coreAura} aria-hidden="true" />

        {/* Concentric technical rings */}
        <div className={styles.finalSystemMap__coreRingOuter} aria-hidden="true" />
        <div className={styles.finalSystemMap__coreRingMid} aria-hidden="true" />
        <div className={styles.finalSystemMap__coreRingMesh} aria-hidden="true" />
        <div
          className={styles.finalSystemMap__coreRingInner}
          style={{
            borderColor: isHighlighted
              ? "var(--bz-blue)"
              : "rgba(227, 232, 241, 0.95)",
            boxShadow: isHighlighted
              ? "0 10px 36px rgba(47, 107, 255, 0.25)"
              : undefined,
          }}
          aria-hidden="true"
        />

        {/* Authentic Bizonix 3D Facet Icon (58x58px prominent center) */}
        <svg
          className={styles.finalSystemMap__coreIcon}
          width="56"
          height="56"
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
            fillOpacity=".92"
          />
        </svg>
      </div>

    </div>
  );
}
