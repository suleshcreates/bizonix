"use client";

import { useState } from "react";
import { systemMapNodes } from "@/lib/content/product/system-map-data";
import { FlowLegend } from "./flow-legend";
import { SystemCore } from "./system-core";
import { SystemNode } from "./system-node";
import styles from "@/components/pages/product/product.module.css";

function SystemMapBackground() {
  return (
    <svg className={styles.finalSystemMap__mapSvg} viewBox="0 0 860 600" fill="none" aria-hidden="true">
      <defs>
        <pattern id="systemDots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#2f6bff" opacity=".2" /></pattern>
        <pattern id="systemGrid" width="42" height="42" patternUnits="userSpaceOnUse" patternTransform="skewY(-28)"><path d="M42 0H0V42" stroke="#2f6bff" strokeWidth=".65" opacity=".16" /></pattern>
        <radialGradient id="convergenceGlow"><stop offset="0" stopColor="#2ec4b6" stopOpacity=".16" /><stop offset=".42" stopColor="#2f6bff" stopOpacity=".12" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="448" cy="306" rx="270" ry="238" fill="url(#convergenceGlow)" />
      <path d="M35 482 390 124 827 397M58 187 430 532 816 118" stroke="#2f6bff" strokeWidth=".7" opacity=".08" />
      <path d="M48 415 329 94 791 314M92 535 469 72 821 488" stroke="#2ec4b6" strokeWidth=".7" opacity=".08" />
      <rect x="68" y="32" width="724" height="514" fill="url(#systemGrid)" opacity=".38" />
      <rect x="128" y="92" width="620" height="406" fill="url(#systemDots)" opacity=".42" />
      <ellipse cx="448" cy="306" rx="244" ry="206" stroke="#2f6bff" strokeWidth="1" strokeDasharray="3 8" opacity=".13" />
      <ellipse cx="448" cy="306" rx="188" ry="155" stroke="#2ec4b6" strokeWidth="1" strokeDasharray="2 8" opacity=".16" />
      <ellipse cx="448" cy="306" rx="128" ry="109" stroke="#2f6bff" strokeWidth="1" opacity=".12" />
      <g fill="#2f6bff" opacity=".15"><circle cx="248" cy="168" r="2"/><circle cx="319" cy="393" r="1.8"/><circle cx="562" cy="124" r="1.5"/><circle cx="601" cy="361" r="2"/><circle cx="713" cy="314" r="1.5"/></g>
      <g stroke="#2f6bff" opacity=".08"><path d="m722 88 18 10v20l-18 10-18-10V98l18-10Z"/><path d="m136 404 14 8v16l-14 8-14-8v-16l14-8Z"/></g>
    </svg>
  );
}

function SystemMapConnections({ activeId }: { activeId: string | null }) {
  return (
    <svg className={styles.finalSystemMap__connectionSvg} viewBox="0 0 860 600" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="operationalPath" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2f6bff"/><stop offset="1" stopColor="#1f54d6"/></linearGradient>
        <linearGradient id="dataPath" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2ec4b6"/><stop offset="1" stopColor="#1b9e7a"/></linearGradient>
        <linearGradient id="visibilityPath" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2f6bff"/><stop offset="1" stopColor="#2ec4b6"/></linearGradient>
        <filter id="pathGlow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g className={styles.finalSystemMap__faintTraces}><path d="M 74 512 C 240 425, 256 116, 442 306 S 687 468, 832 354" /><path d="M 32 211 C 219 92, 310 340, 448 306 S 635 78, 812 159" /><path d="M 118 88 C 270 242, 255 452, 448 306 S 692 189, 812 505" /></g>
      {systemMapNodes.map((node) => {
        const active = activeId === node.id;
        const dimmed = activeId !== null && !active;
        return <g key={node.id} className={styles.finalSystemMap__connection} data-tone={node.connectionType} data-active={active} data-dimmed={dimmed}>
          <path d={node.pathDefinition} className={styles.finalSystemMap__connectionGlow} />
          <path d={node.pathDefinition} pathLength="1" className={styles.finalSystemMap__connectionLine} filter={active ? "url(#pathGlow)" : undefined} />
          <circle cx={node.x * 8.6} cy={node.y * 6} r="3.5" className={styles.finalSystemMap__connectionPoint} />
        </g>;
      })}
      <circle r="3" className={styles.finalSystemMap__pathParticle} data-tone="operational">
        <animateMotion dur="5.8s" repeatCount="indefinite" path={systemMapNodes[0].pathDefinition} />
      </circle>
      <circle r="3" className={styles.finalSystemMap__pathParticle} data-tone="data">
        <animateMotion dur="6.4s" begin="1.7s" repeatCount="indefinite" path={systemMapNodes[3].pathDefinition} />
      </circle>
    </svg>
  );
}

export function SystemMapCanvas() {
  const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <div className={styles.finalSystemMap__mapContainer}>
      <SystemMapBackground />
      <SystemMapConnections activeId={activeId} />
      <SystemCore isHighlighted={activeId !== null} />
      {systemMapNodes.map((node) => <SystemNode key={node.id} node={node} active={activeId === node.id} dimmed={activeId !== null && activeId !== node.id} onEnter={setActiveId} onLeave={() => setActiveId(null)} />)}
      <FlowLegend />
    </div>
  );
}
