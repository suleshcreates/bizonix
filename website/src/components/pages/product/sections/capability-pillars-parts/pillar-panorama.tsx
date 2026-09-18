import Image from "next/image";
import { Boxes, Network, Receipt, ShoppingCart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { pillars, type PillarId } from "@/lib/content/product/four-pillars-data";
import styles from "@/components/pages/product/product.module.css";

const pillarIcon: Record<PillarId, LucideIcon> = {
  inventory: Boxes,
  commerce: ShoppingCart,
  network: Network,
  finance: Receipt,
};

function PillarRegion({
  pillar,
  position,
}: {
  pillar: (typeof pillars)[number];
  position: "first" | "middle" | "last";
}) {
  const Icon = pillarIcon[pillar.id];

  return (
    <div className={styles.capabilityPillarsGrid__pillarRegion} data-position={position}>
      <Image
        src={pillar.image}
        alt={pillar.alt}
        fill
        className={styles.capabilityPillarsGrid__pillarBg}
        sizes="(max-width: 900px) 100vw, 30vw"
      />
      <div className={styles.capabilityPillarsGrid__pillarTint} aria-hidden="true" />

      <div className={styles.capabilityPillarsGrid__pillarContent}>
        <span className={styles.capabilityPillarsGrid__pillarIndex}>{pillar.index}</span>
        <span className={styles.capabilityPillarsGrid__pillarName}>
          <Icon size={15} strokeWidth={2.2} aria-hidden="true" />
          {pillar.name}
        </span>
        <p className={styles.capabilityPillarsGrid__pillarDesc}>
          {pillar.lines[0]}
          <br />
          {pillar.lines[1]}
        </p>
      </div>
    </div>
  );
}

/**
 * One continuous panoramic strip: four photographic environments interlocked
 * along angled seams and graded together so they read as a single scene.
 */
export function PillarPanorama() {
  return (
    <div className={styles.capabilityPillarsGrid__panorama}>
      <div className={styles.capabilityPillarsGrid__panoramaRegions}>
        {pillars.map((pillar, index) => (
          <PillarRegion
            key={pillar.id}
            pillar={pillar}
            position={
              index === 0
                ? "first"
                : index === pillars.length - 1
                  ? "last"
                  : "middle"
            }
          />
        ))}
      </div>

      {/* Shared grade + seams sit above every region so the strip reads as one. */}
      <div className={styles.capabilityPillarsGrid__panoramaGrade} aria-hidden="true" />
      <div className={styles.capabilityPillarsGrid__panoramaSeams} aria-hidden="true">
        <i style={{ left: "25%" }} />
        <i style={{ left: "50%" }} />
        <i style={{ left: "75%" }} />
      </div>
    </div>
  );
}
