import Image from "next/image";
import {
  Building2,
  Check,
  Eye,
  PackageCheck,
  ScanLine,
  ShieldCheck,
  Store,
  Warehouse,
  Zap,
} from "lucide-react";
import {
  ecosystemProofs,
  operatingEnvironments,
} from "@/lib/content/operating-ecosystem-data";
import styles from "./capability-pillars.module.css";

const environmentIcons = [Warehouse, ScanLine, Store] as const;

export function OperatingEcosystem() {
  return (
    <section
      id="who-its-for"
      className={styles.section}
      aria-labelledby="ecosystem-title"
    >
      <div className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>
            <i /> One platform <b>•</b> Every operating entity <i />
          </span>
          <h2 id="ecosystem-title" className={styles.title}>
            Build and Run Multi-Entity
            <br />
            Operations <em>10x Faster</em>
          </h2>
          <p>
            The complete cloud ERP designed for modern retail, wholesale, and
            franchise brands. Connect inventory, billing, transfers, and
            financials into one unified source of truth.
          </p>
        </header>

        <div className={styles.ecosystem}>
          <WorkflowConnector />
          <MobileWorkflowConnector />
          {operatingEnvironments.map((zone, index) => (
            <Environment
              key={zone.label}
              zone={zone}
              Icon={environmentIcons[index]}
            />
          ))}
          <AllocationFragment />
          <CounterFragment />
          <ReplenishmentFragment />
          <OperatingCore />
        </div>

        <ProofStrip />
      </div>
    </section>
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
    <article className={`${styles.environment} ${styles[zone.tone]}`}>
      <div className={styles.environmentImage}>
        <Image
          src={zone.image}
          alt=""
          fill
          sizes="(max-width: 760px) 100vw, 300px"
        />
      </div>
      <div className={styles.environmentNode} aria-hidden="true">
        <Icon size={31} strokeWidth={1.7} />
      </div>
      <div className={styles.environmentCopy}>
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
      className={styles.connectors}
      viewBox="0 0 1440 760"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="wholesale-flow" x1="0" x2="1">
          <stop stopColor="#2f6bff" />
          <stop offset="1" stopColor="#2ec4b6" />
        </linearGradient>
        <linearGradient id="retail-flow" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#2ec4b6" />
          <stop offset="1" stopColor="#2f6bff" />
        </linearGradient>
        <linearGradient id="franchise-flow" x1="1" x2="0">
          <stop stopColor="#8b4cf6" />
          <stop offset="1" stopColor="#2f6bff" />
        </linearGradient>
        <filter id="blue-particle-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id="blue-node" viewBox="0 0 12 12" refX="6" refY="6" markerWidth="6" markerHeight="6">
          <rect x="3" y="3" width="6" height="6" rx="1" fill="white" stroke="#2f6bff" strokeWidth="2" transform="rotate(45 6 6)" />
        </marker>
        <marker id="teal-node" viewBox="0 0 12 12" refX="6" refY="6" markerWidth="6" markerHeight="6">
          <rect x="3" y="3" width="6" height="6" rx="1" fill="white" stroke="#2ec4b6" strokeWidth="2" transform="rotate(45 6 6)" />
        </marker>
        <marker id="purple-node" viewBox="0 0 12 12" refX="6" refY="6" markerWidth="6" markerHeight="6">
          <rect x="3" y="3" width="6" height="6" rx="1" fill="white" stroke="#8b4cf6" strokeWidth="2" transform="rotate(45 6 6)" />
        </marker>
      </defs>
      <g className={styles.connectorGlow}>
        <use href="#wholesale-node-ui" /><use href="#wholesale-ui-core" />
        <use href="#retail-node-ui" /><use href="#retail-ui-core" />
        <use href="#franchise-node-ui" /><use href="#franchise-ui-core" />
      </g>
      <path id="wholesale-node-ui" className={styles.wholesaleFlow} d="M151 135 C151 190 180 220 240 225 C285 228 320 222 342 237" markerMid="url(#blue-node)" />
      <path id="wholesale-ui-core" className={styles.wholesaleFlow} d="M365 405 C405 455 448 525 493 548 C548 576 622 598 685 610" markerMid="url(#blue-node)" />
      <path id="retail-node-ui" className={styles.retailFlow} d="M655 177 C655 202 655 215 655 224 C655 230 655 234 655 237" markerMid="url(#teal-node)" />
      <path id="retail-ui-core" className={styles.retailFlow} d="M720 450 C720 482 720 520 720 552 C720 575 720 598 720 620" markerMid="url(#teal-node)" />
      <path id="franchise-node-ui" className={styles.franchiseFlow} d="M1155 135 C1155 190 1140 215 1110 225 C1092 231 1080 239 1075 249" markerMid="url(#purple-node)" />
      <path id="franchise-ui-core" className={styles.franchiseFlow} d="M1075 405 C1038 455 995 525 951 548 C896 576 818 598 755 610" markerMid="url(#purple-node)" />
      <g className={styles.movingParticles} filter="url(#blue-particle-glow)">
        <circle className={styles.blueParticle} r="3"><animateMotion dur="4.6s" begin="0s" repeatCount="indefinite"><mpath href="#wholesale-node-ui" /></animateMotion></circle>
        <circle className={styles.blueParticle} r="3"><animateMotion dur="5.2s" begin="-2.2s" repeatCount="indefinite"><mpath href="#wholesale-ui-core" /></animateMotion></circle>
        <circle className={styles.tealParticle} r="3"><animateMotion dur="4.2s" begin="-.8s" repeatCount="indefinite"><mpath href="#retail-node-ui" /></animateMotion></circle>
        <circle className={styles.tealParticle} r="3"><animateMotion dur="3.8s" begin="-2.1s" repeatCount="indefinite"><mpath href="#retail-ui-core" /></animateMotion></circle>
        <circle className={styles.purpleParticle} r="3"><animateMotion dur="4.8s" begin="-1.4s" repeatCount="indefinite"><mpath href="#franchise-node-ui" /></animateMotion></circle>
        <circle className={styles.purpleParticle} r="3"><animateMotion dur="5.3s" begin="-3.2s" repeatCount="indefinite"><mpath href="#franchise-ui-core" /></animateMotion></circle>
      </g>
    </svg>
  );
}

function MobileWorkflowConnector() {
  return (
    <svg
      className={styles.mobileConnectors}
      viewBox="0 0 100 1000"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="mobile-flow" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#2f6bff" />
          <stop offset=".5" stopColor="#2ec4b6" />
          <stop offset="1" stopColor="#8b4cf6" />
        </linearGradient>
        <marker id="mobile-node" viewBox="0 0 12 12" refX="6" refY="6" markerWidth="10" markerHeight="10">
          <circle cx="6" cy="6" r="3.5" fill="white" stroke="#2ec4b6" strokeWidth="2" />
        </marker>
      </defs>
      <path className={styles.mobileConnectorGlow} d="M50 80 C50 210 50 255 50 345 C50 455 50 515 50 620 C50 745 50 810 50 930" />
      <path id="mobile-flow-path" className={styles.mobileConnectorPath} d="M50 80 C50 210 50 255 50 345 C50 455 50 515 50 620 C50 745 50 810 50 930" markerMid="url(#mobile-node)" />
      <g className={styles.movingParticles}>
        <circle className={styles.blueParticle} r="4"><animateMotion dur="6s" begin="0s" repeatCount="indefinite"><mpath href="#mobile-flow-path" /></animateMotion></circle>
        <circle className={styles.purpleParticle} r="3"><animateMotion dur="6s" begin="-3s" repeatCount="indefinite"><mpath href="#mobile-flow-path" /></animateMotion></circle>
      </g>
    </svg>
  );
}

function OperatingCore() {
  return (
    <div className={styles.core}>
      <div className={styles.coreGlow} />
      <div className={styles.coreOrbit} />
      <div className={styles.coreOrbitTwo} />
      <div className={styles.coreOrbitThree} />
      <div className={styles.corePlatform}>
        <span />
        <span />
        <span />
      </div>
      <Image
        className={styles.coreLogo}
        src="/brand/icon.svg"
        alt="Bizonix"
        width={76}
        height={76}
      />
      <div className={styles.coreCopy}>
        <strong>Bizonix Operating Core</strong>
        <span>Unified. Connected. Intelligent.</span>
        <small>One operating truth.</small>
      </div>
    </div>
  );
}

function AllocationFragment() {
  return (
    <aside className={`${styles.fragment} ${styles.allocationFragment}`}>
      <header>
        <span>
          <Warehouse size={18} /> Network Allocation
        </span>
        <Zap size={17} />
      </header>
      <div className={styles.kpis}>
        <span>
          <small>Available</small>
          <b>18,420</b>
        </span>
        <span>
          <small>Committed</small>
          <b>6,280</b>
        </span>
      </div>
      <Metric label="Retail network" value="72%" width="72%" />
      <Metric label="Franchise pool" value="48%" width="48%" />
      <footer>
        <Check size={15} /> Purchase plan matched to demand
      </footer>
    </aside>
  );
}

function Metric({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div className={styles.metric}>
      <span>
        {label}
        <b>{value}</b>
      </span>
      <i>
        <em style={{ width }} />
      </i>
    </div>
  );
}

function CounterFragment() {
  return (
    <aside className={`${styles.fragment} ${styles.counterFragment}`}>
      <header>
        <span>
          <ScanLine size={18} /> Counter 04 · Sale
        </span>
        <b>•••</b>
      </header>
      <div className={styles.posBody}>
        <span className={styles.posSignal}>
          <ScanLine size={20} />
        </span>
        <div className={styles.lineItems}>
          <span>
            Classic Oxford Shirt <b>₹2,490</b>
          </span>
          <span>
            Travel Pouch <b>₹1,790</b>
          </span>
        </div>
      </div>
      <div className={styles.totalLine}>
        <span>2 items · GST included</span>
        <b>₹4,280</b>
      </div>
      <footer>
        <Check size={15} /> Paid · stock and books updated
      </footer>
    </aside>
  );
}

function ReplenishmentFragment() {
  return (
    <aside className={`${styles.fragment} ${styles.replenishmentFragment}`}>
      <header>
        <span>Replenishment</span>
        <PackageCheck size={18} />
      </header>
      <div className={styles.orderTitle}>
        <span>
          <small>Suggested order</small>
          <b>24 pieces</b>
        </span>
        <em>Ready</em>
      </div>
      <div className={styles.orderSteps}>
        <span>
          <i>
            <Check size={12} />
          </i>
          Requested
        </span>
        <b />
        <span>
          <i>
            <Check size={12} />
          </i>
          Allocated
        </span>
        <b />
        <span>
          <i /> Dispatch
        </span>
      </div>
      <footer>
        <Check size={15} /> Within outlet permissions
      </footer>
    </aside>
  );
}

function ProofStrip() {
  const icons = [ShieldCheck, Eye, Building2, Zap];
  return (
    <div className={styles.proofStrip}>
      {ecosystemProofs.map(([title, copy], index) => {
        const Icon = icons[index];
        return (
          <div key={title}>
            <i className={styles.proofIcon}>
              <Icon size={25} strokeWidth={1.8} />
            </i>
            <span>
              <strong>{title}</strong>
              <small>{copy}</small>
            </span>
          </div>
        );
      })}
    </div>
  );
}
