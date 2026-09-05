import type { ReactNode } from "react";
import styles from "@/components/pages/product/product.module.css";

interface IntegrationOutputProps {
  id: string;
  icon: ReactNode;
  label: string;
  descriptor: string;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
}

export function IntegrationOutput({
  id,
  icon,
  label,
  descriptor,
  isHighlighted = false,
  isDimmed = false,
  onHover,
  onLeave,
}: IntegrationOutputProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`${styles.integrationSurface__flowNode} ${styles.integrationSurface__nodeOutput}`}
      style={{
        opacity: isDimmed ? 0.35 : 1,
        transition: "opacity 0.25s ease, transform 0.2s ease",
      }}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(id)}
      onBlur={onLeave}
      aria-label={`${label} operational output: ${descriptor.replace(/\n/g, " ")}`}
    >
      <div
        className={styles.integrationSurface__nodeIconWrap}
        style={{
          borderColor: isHighlighted ? "var(--bz-teal)" : undefined,
          color: isHighlighted ? "var(--bz-teal)" : undefined,
          boxShadow: isHighlighted
            ? "0 4px 16px rgba(46, 196, 182, 0.25)"
            : undefined,
        }}
      >
        {icon}
      </div>
      <div className={styles.integrationSurface__nodeText}>
        <span
          className={styles.integrationSurface__nodeLabel}
          style={{
            color: isHighlighted ? "var(--bz-teal)" : undefined,
          }}
        >
          {label}
        </span>
        <span className={styles.integrationSurface__nodeDesc}>{descriptor}</span>
      </div>
    </div>
  );
}
