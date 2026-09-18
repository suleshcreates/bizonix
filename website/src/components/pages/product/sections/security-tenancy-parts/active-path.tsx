import type { SecurityEntity } from "@/lib/content/product/security-access-model";
import { EXIT_ARROW, STAGE, activePath } from "./architecture-geometry";
import styles from "@/components/pages/product/product.module.css";

/**
 * The one story that is live: entity → role → permission → action → audit.
 * Every other relationship stays visible underneath, just quieter. The arrowhead
 * lands on the first entry of the evidence trail, so the hand-off needs no label.
 */
export function ActivePath({ entity }: { entity: SecurityEntity }) {
  const d = activePath(entity);
  return (
    <svg
      className={styles.securityTenancy__wires}
      viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
      aria-hidden="true"
      focusable="false"
      data-accent={entity.accent}
    >
      <path className={styles.securityTenancy__activeLine} d={d} pathLength={100} />
      <path className={styles.securityTenancy__activeParticle} d={d} pathLength={100} />
      <path className={styles.securityTenancy__activeArrow} d={EXIT_ARROW} />
    </svg>
  );
}
