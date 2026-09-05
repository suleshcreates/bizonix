import Image from "next/image";
import { ScanLine, Store, Warehouse } from "lucide-react";
import { operatingEnvironments } from "@/lib/content/home/operating-ecosystem-data";
import {
  AllocationProof,
  CounterProof,
  ReplenishmentProof,
} from "./ecosystem-proofs";
import styles from "@/components/pages/home/home.module.css";

/**
 * Desktop composition (>= 761px): the approved spatial network — three
 * environments placed on a canvas, the flow diagram wiring them together and
 * the operating core seated below the centre.
 *
 * Frozen. The handset story lives in `ecosystem-flow.tsx`.
 */
const environmentIcons = [Warehouse, ScanLine, Store] as const;

export function EcosystemNetwork() {
  return (
    <div className={styles.operatingEcosystem__ecosystem}>
      <WorkflowConnector />
      {operatingEnvironments.map((zone, index) => (
        <Environment
          key={zone.label}
          zone={zone}
          Icon={environmentIcons[index]}
        />
      ))}
      <AllocationProof className={styles.operatingEcosystem__allocationFragment} />
      <CounterProof className={styles.operatingEcosystem__counterFragment} />
      <ReplenishmentProof
        className={styles.operatingEcosystem__replenishmentFragment}
      />
      <OperatingCore />
    </div>
  );
}

function Environment({
  zone,
  Icon,
}: {
  zone: (typeof operatingEnvironments)[number];
  Icon: typeof Warehouse;
}) {
  return (
    <article className={`${styles.operatingEcosystem__environment} ${styles["operatingEcosystem__" + (zone.tone)]}`}>
      <div className={styles.operatingEcosystem__environmentImage}>
        <Image
          src={zone.image}
          alt=""
          fill
          sizes="(max-width: 760px) 100vw, 300px"
        />
      </div>
      <div className={styles.operatingEcosystem__environmentNode} aria-hidden="true">
        <Icon size={31} strokeWidth={1.7} />
      </div>
      <div className={styles.operatingEcosystem__environmentCopy}>
        <span>
          <i>{zone.number}</i>
          {zone.label}
        </span>
        <h3>{zone.title}</h3>
        <p>{zone.body}</p>
      </div>
    </article>
  );
}

function WorkflowConnector() {
  return (
    <svg
      className={styles.operatingEcosystem__connectors}
      viewBox="0 0 1440 760"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="wholesale-flow" x1="0" x2="1">
          <stop stopColor="#2f6bff" />
          <stop offset="1" stopColor="#2ec4b6" />
        </linearGradient>
        <linearGradient
          id="retail-flow"
          gradientUnits="userSpaceOnUse"
          x1="720"
          x2="720"
          y1="160"
          y2="575"
        >
          <stop stopColor="#2ec4b6" />
          <stop offset="1" stopColor="#2f6bff" />
        </linearGradient>
        <linearGradient id="franchise-flow" x1="1" x2="0">
          <stop stopColor="#8b4cf6" />
          <stop offset="1" stopColor="#2f6bff" />
        </linearGradient>
        <filter
          id="blue-particle-glow"
          x="-300%"
          y="-300%"
          width="700%"
          height="700%"
        >
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker
          id="blue-node"
          viewBox="0 0 12 12"
          refX="6"
          refY="6"
          markerWidth="6"
          markerHeight="6"
        >
          <rect
            x="3"
            y="3"
            width="6"
            height="6"
            rx="1"
            fill="white"
            stroke="#2f6bff"
            strokeWidth="2"
            transform="rotate(45 6 6)"
          />
        </marker>
        <marker
          id="teal-node"
          viewBox="0 0 12 12"
          refX="6"
          refY="6"
          markerWidth="6"
          markerHeight="6"
        >
          <rect
            x="3"
            y="3"
            width="6"
            height="6"
            rx="1"
            fill="white"
            stroke="#2ec4b6"
            strokeWidth="2"
            transform="rotate(45 6 6)"
          />
        </marker>
        <marker
          id="purple-node"
          viewBox="0 0 12 12"
          refX="6"
          refY="6"
          markerWidth="6"
          markerHeight="6"
        >
          <rect
            x="3"
            y="3"
            width="6"
            height="6"
            rx="1"
            fill="white"
            stroke="#8b4cf6"
            strokeWidth="2"
            transform="rotate(45 6 6)"
          />
        </marker>
      </defs>
      <g className={styles.operatingEcosystem__connectorGlow}>
        <use href="#wholesale-node-ui" />
        <use href="#wholesale-ui-core" />
        <use href="#retail-node-ui" />
        <use href="#retail-ui-core" />
        <use href="#franchise-node-ui" />
        <use href="#franchise-ui-core" />
        <use href="#core-trunk" />
      </g>
      <path
        id="wholesale-node-ui"
        className={styles.operatingEcosystem__wholesaleFlow}
        d="M151 135 C151 190 180 220 240 225 C285 228 320 222 342 237"
        markerMid="url(#blue-node)"
      />
      <path
        id="wholesale-ui-core"
        className={styles.operatingEcosystem__wholesaleFlow}
        d="M365 405 C420 458 490 493 575 502 C630 508 680 511 720 512"
        markerMid="url(#blue-node)"
      />
      <path
        id="retail-node-ui"
        className={styles.operatingEcosystem__retailFlow}
        d="M655 177 C655 212 668 238 690 250 C704 258 714 263 720 270"
        markerMid="url(#teal-node)"
      />
      <path
        id="retail-ui-core"
        className={styles.operatingEcosystem__retailFlow}
        d="M720 472 C720 488 720 502 720 512"
        markerMid="url(#teal-node)"
      />
      <path
        id="franchise-node-ui"
        className={styles.operatingEcosystem__franchiseFlow}
        d="M1155 135 C1155 190 1140 215 1110 225 C1092 231 1080 239 1075 249"
        markerMid="url(#purple-node)"
      />
      <path
        id="franchise-ui-core"
        className={styles.operatingEcosystem__franchiseFlow}
        d="M1075 405 C1020 458 950 493 865 502 C810 508 760 511 720 512"
        markerMid="url(#purple-node)"
      />
      <circle className={styles.operatingEcosystem__convergenceNode} cx="720" cy="512" r="5" />
      <path
        id="core-trunk"
        className={styles.operatingEcosystem__retailFlow}
        d="M720 512 L720 577"
      />
      <g className={styles.operatingEcosystem__movingParticles} filter="url(#blue-particle-glow)">
        <circle className={styles.operatingEcosystem__blueParticle} r="3">
          <animateMotion dur="4.6s" begin="0s" repeatCount="indefinite">
            <mpath href="#wholesale-node-ui" />
          </animateMotion>
        </circle>
        <circle className={styles.operatingEcosystem__blueParticle} r="3">
          <animateMotion dur="5.2s" begin="-2.2s" repeatCount="indefinite">
            <mpath href="#wholesale-ui-core" />
          </animateMotion>
        </circle>
        <circle className={styles.operatingEcosystem__tealParticle} r="3">
          <animateMotion dur="4.2s" begin="-.8s" repeatCount="indefinite">
            <mpath href="#retail-node-ui" />
          </animateMotion>
        </circle>
        <circle className={styles.operatingEcosystem__tealParticle} r="3">
          <animateMotion dur="3.8s" begin="-2.1s" repeatCount="indefinite">
            <mpath href="#retail-ui-core" />
          </animateMotion>
        </circle>
        <circle className={styles.operatingEcosystem__purpleParticle} r="3">
          <animateMotion dur="4.8s" begin="-1.4s" repeatCount="indefinite">
            <mpath href="#franchise-node-ui" />
          </animateMotion>
        </circle>
        <circle className={styles.operatingEcosystem__purpleParticle} r="3">
          <animateMotion dur="5.3s" begin="-3.2s" repeatCount="indefinite">
            <mpath href="#franchise-ui-core" />
          </animateMotion>
        </circle>
        <circle className={styles.operatingEcosystem__tealParticle} r="3">
          <animateMotion dur="1.8s" begin="-.4s" repeatCount="indefinite">
            <mpath href="#core-trunk" />
          </animateMotion>
        </circle>
      </g>
    </svg>
  );
}

function OperatingCore() {
  return (
    <div className={styles.operatingEcosystem__core}>
      <div className={styles.operatingEcosystem__coreGlow} />
      <div className={styles.operatingEcosystem__coreOrbit} />
      <div className={styles.operatingEcosystem__coreOrbitTwo} />
      <div className={styles.operatingEcosystem__coreOrbitThree} />
      <div className={styles.operatingEcosystem__coreLogoWrap}>
        <Image
          className={styles.operatingEcosystem__coreLogo}
          src="/images/shared/brand/icon.svg"
          alt="Bizonix"
          width={64}
          height={64}
        />
      </div>
      <div className={styles.operatingEcosystem__coreCopy}>
        <strong>Bizonix Operating Core</strong>
        <span>Unified. Connected. Intelligent.</span>
        <small>One operating truth.</small>
      </div>
    </div>
  );
}
