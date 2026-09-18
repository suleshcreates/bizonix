"use client";

import Image from "next/image";
import type { SecurityEntity, SecurityEntityId } from "@/lib/content/product/security-access-model";
import { frameStyle } from "./architecture-geometry";
import styles from "@/components/pages/product/product.module.css";

/**
 * An environment surface embedded in the architecture — a floating architectural
 * photograph, not a card. Until the final asset exists it renders a designed
 * line-drawn environment so the composition is already complete; dropping a
 * photograph in changes nothing but the pixels inside the same frame.
 */
export function SecurityEntityScene({
  entity,
  state,
  onActivate,
  layout = "stage",
}: {
  entity: SecurityEntity;
  state: "active" | "muted";
  onActivate: (id: SecurityEntityId) => void;
  /** "stage" places the surface on the desktop plan; "flow" lets it sit in the mobile story. */
  layout?: "stage" | "flow";
}) {
  return (
    <button
      type="button"
      className={layout === "stage" ? styles.securityTenancy__scene : styles.securityTenancy__flowScene}
      style={layout === "stage" ? frameStyle(entity.frame) : undefined}
      data-state={state}
      data-accent={entity.accent}
      aria-pressed={state === "active"}
      onMouseEnter={() => onActivate(entity.id)}
      onFocus={() => onActivate(entity.id)}
      onClick={() => onActivate(entity.id)}
    >
      <span className={styles.securityTenancy__sceneSurface}>
        {entity.image ? (
          <Image
            src={entity.image}
            alt={entity.imageAlt}
            fill
            className={styles.securityTenancy__sceneImage}
            sizes="(max-width: 1080px) 90vw, 34vw"
          />
        ) : (
          <SceneUnderdrawing id={entity.id} />
        )}
      </span>
      <span className={styles.securityTenancy__sceneName}>{entity.name}</span>
    </button>
  );
}

/**
 * Variant line work. Each environment is described with the same architectural
 * vocabulary — ground line, structure, volumes — so the three read as one plan.
 */
function SceneUnderdrawing({ id }: { id: SecurityEntityId }) {
  return (
    <svg
      className={styles.securityTenancy__sceneDrawing}
      viewBox="0 0 200 140"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`bzSceneWash-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef3fa" />
          <stop offset="62%" stopColor="#e2e9f4" />
          <stop offset="100%" stopColor="#d6deec" />
        </linearGradient>
        <radialGradient id={`bzSceneVignette-${id}`} cx="50%" cy="44%" r="72%">
          <stop offset="55%" stopColor="#0b1f3a" stopOpacity="0" />
          <stop offset="100%" stopColor="#0b1f3a" stopOpacity="0.13" />
        </radialGradient>
      </defs>
      <rect width="200" height="140" fill={`url(#bzSceneWash-${id})`} />
      <g className={styles.securityTenancy__drawingGrid}>
        {[20, 40, 60, 80, 100, 120].map((y) => (
          <line key={y} x1="0" y1={y} x2="200" y2={y} />
        ))}
        {[20, 40, 60, 80, 100, 120, 140, 160, 180].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="140" />
        ))}
      </g>
      {id === "warehouse" && <WarehouseDrawing />}
      {id === "retail" && <RetailDrawing />}
      {id === "franchise" && <FranchiseDrawing />}
      <line className={styles.securityTenancy__drawingGround} x1="0" y1="118" x2="200" y2="118" />
      <rect width="200" height="140" fill={`url(#bzSceneVignette-${id})`} />
    </svg>
  );
}

function WarehouseDrawing() {
  const bays = [14, 62, 110, 158];
  return (
    <g>
      <g className={styles.securityTenancy__drawingFill}>
        {bays.map((x) => (
          <g key={x}>
            <rect x={x + 4} y="52" width="12" height="14" />
            <rect x={x + 20} y="52" width="12" height="14" />
            <rect x={x + 4} y="82" width="12" height="14" />
            <rect x={x + 20} y="86" width="12" height="10" />
          </g>
        ))}
      </g>
      <g className={styles.securityTenancy__drawingLine}>
        {bays.map((x) => (
          <g key={x}>
            <line x1={x} y1="28" x2={x} y2="118" />
            <line x1={x + 36} y1="28" x2={x + 36} y2="118" />
            <line x1={x} y1="48" x2={x + 36} y2="48" />
            <line x1={x} y1="78" x2={x + 36} y2="78" />
            <line x1={x} y1="102" x2={x + 36} y2="102" />
          </g>
        ))}
        <line x1="0" y1="28" x2="200" y2="28" />
      </g>
    </g>
  );
}

function RetailDrawing() {
  return (
    <g>
      <g className={styles.securityTenancy__drawingFill}>
        <rect x="18" y="40" width="60" height="9" />
        <rect x="18" y="58" width="44" height="9" />
        <rect x="18" y="76" width="56" height="9" />
        <rect x="126" y="86" width="58" height="32" />
      </g>
      <g className={styles.securityTenancy__drawingLine}>
        <line x1="14" y1="30" x2="14" y2="118" />
        <line x1="86" y1="30" x2="86" y2="118" />
        <line x1="14" y1="52" x2="86" y2="52" />
        <line x1="14" y1="70" x2="86" y2="70" />
        <line x1="14" y1="88" x2="86" y2="88" />
        <line x1="14" y1="30" x2="86" y2="30" />
        <rect x="126" y="86" width="58" height="32" />
        <line x1="126" y1="96" x2="184" y2="96" />
        <line x1="112" y1="18" x2="196" y2="18" />
        <line x1="140" y1="18" x2="140" y2="34" />
        <line x1="170" y1="18" x2="170" y2="34" />
      </g>
    </g>
  );
}

function FranchiseDrawing() {
  return (
    <g>
      <g className={styles.securityTenancy__drawingFill}>
        <rect x="30" y="60" width="46" height="58" />
        <rect x="124" y="60" width="46" height="58" />
        <rect x="86" y="74" width="28" height="44" />
      </g>
      <g className={styles.securityTenancy__drawingLine}>
        <path d="M 20 44 L 100 18 L 180 44" />
        <line x1="20" y1="44" x2="180" y2="44" />
        <line x1="20" y1="44" x2="20" y2="118" />
        <line x1="180" y1="44" x2="180" y2="118" />
        <rect x="30" y="60" width="46" height="58" />
        <rect x="124" y="60" width="46" height="58" />
        <rect x="86" y="74" width="28" height="44" />
        <line x1="30" y1="88" x2="76" y2="88" />
        <line x1="124" y1="88" x2="170" y2="88" />
        <line x1="100" y1="74" x2="100" y2="118" />
      </g>
    </g>
  );
}
