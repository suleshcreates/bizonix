"use client";

import Image from "next/image";
import {
  ArrowLeftRight,
  BarChart3,
  BookOpen,
  Boxes,
  Check,
  Database,
  Eye,
  Fingerprint,
  Layers3,
  PackagePlus,
  Pause,
  Play,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useState } from "react";
import styles from "./operating-model.module.css";

const principles = [
  { number: "01", icon: Database, title: "Shared foundation", body: "Products, series and operational context start from the same source.", image: "/product/network-shared-foundation.webp", accent: "blue" },
  { number: "02", icon: Users, title: "Scoped responsibility", body: "People act within the warehouse, brand or franchise scope they own.", image: "/product/network-scoped-responsibility.webp", accent: "teal" },
  { number: "03", icon: Eye, title: "Consolidated oversight", body: "Central teams read across entities without forcing every team into the same lane.", image: "/product/network-consolidated-oversight.webp", accent: "blue" },
] as const;

const journey = [
  { label: "Master", title: "Established at brand level", context: "Context: Product", image: "/product/journey-master.webp", icon: Database },
  { label: "Stock", title: "Received by the responsible entity", context: "Context: Location", image: "/product/journey-stock.webp", icon: PackagePlus },
  { label: "Movement", title: "Carries source and destination", detail: "Every transfer keeps its full operating context.", context: "Context: Source + Destination", image: "/product/journey-movement.webp", icon: ArrowLeftRight, active: true },
  { label: "Sale", title: "Posts to the operating channel", context: "Context: Channel", image: "/product/journey-sale.webp", icon: ShoppingBag },
  { label: "Books", title: "Retains the same business context", context: "Context: Ledger", image: "/product/journey-books.webp", icon: BookOpen },
] as const;

const proofs = [
  { title: "One trusted source", body: "Common masters eliminate duplicates and mismatches.", icon: ShieldCheck },
  { title: "Entity-level control", body: "Every team operates within their defined boundaries.", icon: Fingerprint },
  { title: "Context never drops", body: "Transfers, sales and ledgers carry full operating context.", icon: ArrowLeftRight },
  { title: "Clear, consolidated view", body: "Head office gets real-time visibility across the network.", icon: BarChart3 },
] as const;

function SectionHeader() {
  return (
    <header className={styles.header}>
      <div>
        <span className={styles.eyebrow}><i /> Shared where useful. Separate where essential.</span>
        <h2>A connected network<br />without <em>blurred boundaries.</em></h2>
      </div>
      <p>Common masters create consistency. Entity-level roles, movements and ledgers preserve responsibility from the first product record to the final posting.</p>
    </header>
  );
}

function PrincipleItem({ principle, index }: { principle: (typeof principles)[number]; index: number }) {
  const Icon = principle.icon;
  return (
    <article className={styles.principle} data-accent={principle.accent} style={{ "--reveal-delay": `${index * 110}ms` } as React.CSSProperties}>
      <div className={styles.principleMarker}>
        <strong>{principle.number}</strong><span /><i />
      </div>
      <div className={styles.principleIcon}><Icon size={25} /></div>
      <div className={styles.principleCopy}><h3>{principle.title}</h3><p>{principle.body}</p></div>
      <div className={styles.principleImage}><Image src={principle.image} alt={`${principle.title} environment`} fill sizes="150px" /></div>
    </article>
  );
}

function PrincipleRail() {
  return <div className={styles.principleRail}>{principles.map((principle, index) => <PrincipleItem principle={principle} index={index} key={principle.title} />)}</div>;
}

function JourneyPath({ paused }: { paused: boolean }) {
  return (
    <svg className={styles.journeyPath} viewBox="0 0 1000 150" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="context-flow" x1="0" x2="1"><stop stopColor="#2f6bff" /><stop offset=".45" stopColor="#2ec4b6" /><stop offset=".62" stopColor="#2ec4b6" /><stop offset="1" stopColor="#2f6bff" /></linearGradient>
        <filter id="context-glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path className={styles.pathGlow} d="M95 72 C185 69 215 75 295 72 S405 69 500 72 S610 75 705 72 S820 69 905 72" />
      <path id="operating-context-path" className={styles.pathLine} d="M95 72 C185 69 215 75 295 72 S405 69 500 72 S610 75 705 72 S820 69 905 72" />
      <g className={styles.pathArrows}>
        <path d="M190 64 199 72 190 80" /><path d="M390 64 399 72 390 80" /><path d="M590 64 599 72 590 80" /><path d="M790 64 799 72 790 80" />
      </g>
      {!paused ? <circle className={styles.travelParticle} r="5" filter="url(#context-glow)"><animateMotion dur="8s" repeatCount="indefinite"><mpath href="#operating-context-path" /></animateMotion><animate attributeName="r" values="5;5;7;5;5" keyTimes="0;.38;.5;.62;1" dur="8s" repeatCount="indefinite" /></circle> : null}
    </svg>
  );
}

function JourneyNode({ stage, index }: { stage: (typeof journey)[number]; index: number }) {
  const Icon = stage.icon;
  return (
    <button type="button" className={`${styles.journeyStage} ${"active" in stage ? styles.movementStage : ""}`} style={{ "--stage-delay": `${500 + index * 130}ms` } as React.CSSProperties}>
      <span className={styles.stageVisual}>
        <Image src={stage.image} alt={`${stage.label} operating context`} fill sizes={"active" in stage ? "96px" : "80px"} />
        <i><Icon size={20} /></i>
      </span>
      <span className={styles.stageCopy}>
        <small>{stage.label}</small><strong>{stage.title}</strong>
        {"detail" in stage ? <em>{stage.detail}</em> : null}
        <b>{stage.context}</b>
      </span>
    </button>
  );
}

function ContextPayload() {
  return (
    <div className={styles.payload}>
      <span className={styles.payloadConnector}><i /></span>
      <strong>Context payload</strong>
      <div>
        <span><PackagePlus size={15} /><small>Source</small><b>North Warehouse</b></span>
        <span><Boxes size={15} /><small>Destination</small><b>Retail Store 04</b></span>
        <span><PackagePlus size={15} /><small>Item</small><b>42 units</b></span>
        <span><Layers3 size={15} /><small>Entity</small><b>Retail Division</b></span>
      </div>
    </div>
  );
}

function JourneyStatusBar({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return (
    <footer className={styles.statusBar}>
      <span><i><Check size={13} /></i>Operating context stays attached from master to books.</span>
      <button type="button" onClick={onToggle}>{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? "Resume flow" : "Pause flow"}</button>
    </footer>
  );
}

function OperatingContextJourney() {
  const [paused, setPaused] = useState(false);
  return (
    <div className={`${styles.journeyPanel} ${paused ? styles.paused : ""}`}>
      <div className={styles.panelTexture} aria-hidden="true" />
      <div className={styles.journeyHead}><div><span>The operating context journey</span><h3>Watch context move through the business.</h3></div><b>03 / 05</b></div>
      <div className={styles.journeyTrack}>
        <JourneyPath paused={paused} />
        {journey.map((stage, index) => <JourneyNode stage={stage} index={index} key={stage.label} />)}
      </div>
      <ContextPayload />
      <JourneyStatusBar paused={paused} onToggle={() => setPaused((value) => !value)} />
    </div>
  );
}

function ProofStrip() {
  return (
    <div className={styles.proofStrip}>
      {proofs.map(({ title, body, icon: Icon }) => <div className={styles.proof} key={title}><i><Icon size={26} /></i><span><strong>{title}</strong><small>{body}</small></span></div>)}
    </div>
  );
}

export function OperatingModel() {
  return (
    <section id="operating-model" className={`${styles.section} scroll-mt-24`}>
      <div className={styles.shell}>
        <SectionHeader />
        <div className={styles.layout}><PrincipleRail /><OperatingContextJourney /></div>
        <ProofStrip />
      </div>
    </section>
  );
}
