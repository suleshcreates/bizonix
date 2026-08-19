import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Database,
  Eye,
  LockKeyhole,
  Network,
  ShieldCheck,
  Zap,
} from "lucide-react";
import styles from "./solutions-grid.module.css";

const modules = [
  { number: "01", title: "Inventory", slug: "inventory", copy: "Piece-level stock, always current.", image: "/product/modules/editorial/inventory-v2.webp", metricLabel: "Stock Accuracy", metric: "99.8%", accent: "blue", chart: "trend" },
  { number: "02", title: "Sales & POS", slug: "sales-pos", copy: "Fast at the counter, accurate in the books.", image: "/product/modules/editorial/sales-pos-v2.webp", metricLabel: "Today’s Sales", metric: "₹8,45,231", delta: "+14.2%", accent: "teal", chart: "delta" },
  { number: "03", title: "Accounting", slug: "accounting", copy: "GST-ready books that follow every movement.", image: "/product/modules/editorial/accounting-v2.webp", metricLabel: "Net Profit", metric: "₹2,45,788", delta: "+8.7%", accent: "orange", chart: "delta" },
  { number: "04", title: "Wholesale", slug: "wholesale", copy: "Bulk orders, credit, and fulfillment in one flow.", image: "/product/modules/editorial/wholesale-v2.webp", metricLabel: "Orders this month", metric: "342", accent: "teal", chart: "bars" },
  { number: "05", title: "Franchise", slug: "franchise", copy: "Partner outlets, HQ-governed allocation.", image: "/product/modules/editorial/franchise-v2.webp", metricLabel: "Active Outlets", metric: "128", accent: "purple", chart: "people" },
  { number: "06", title: "Analytics", slug: "analytics", copy: "One view on sales, stock, and margin across entities.", image: "/product/modules/editorial/analytics-v2.webp", metricLabel: "Gross Margin", metric: "23.6%", accent: "purple", chart: "trend" },
] as const;

const proofs = [
  { title: "Same Piece Identity", copy: "Track the same item across every step.", icon: ShieldCheck },
  { title: "Entity-Aware Movement", copy: "Every movement is linked to the right entity.", icon: Eye },
  { title: "Nothing is Re-entered", copy: "Data flows automatically without duplicate entry.", icon: LockKeyhole },
  { title: "Real-time Visibility", copy: "Complete transparency at every step.", icon: Zap },
] as const;

function ModulesHeader() {
  return (
    <header className={styles.header}>
      <span className={styles.eyebrow}><i /> Our modules <i /></span>
      <h2 id="solutions-grid-title" className={styles.title}>Everything you need,<br />in one <em>powerful system</em></h2>
      <p>Integrated modules. Connected workflow.<br />Complete control across your entire business.</p>
    </header>
  );
}

function OperatingCore() {
  const orbitNodes = [
    { label: "Connected Workflow", icon: Network, className: styles.workflowNode },
    { label: "Real-time Insights", icon: BarChart3, className: styles.insightsNode },
    { label: "Unified Data", icon: Database, className: styles.dataNode },
    { label: "Secure & Compliant", icon: ShieldCheck, className: styles.securityNode },
  ];
  return (
    <div className={styles.coreStage}>
      <div className={styles.coreGlow} />
      <span className={`${styles.orbit} ${styles.orbitOne}`} />
      <span className={`${styles.orbit} ${styles.orbitTwo}`} />
      <span className={`${styles.orbit} ${styles.orbitThree}`} />
      <span className={`${styles.orbit} ${styles.orbitFour}`} />
      <span className={styles.orbitAxis} />
      {orbitNodes.map(({ label, icon: Icon, className }) => (
        <span className={`${styles.orbitNode} ${className}`} key={label}>
          <i><Icon size={20} strokeWidth={2.1} /></i><small>{label}</small>
        </span>
      ))}
      <div className={styles.corePlatform}>
        <span /><span /><span />
        <div className={styles.coreLogo}><Image src="/brand/icon.svg" alt="Bizonix" width={92} height={92} /></div>
      </div>
      <div className={styles.coreCaption}>
        <strong>Bizonix Operating Core</strong><span>Unified. Connected. Intelligent.</span><small>One operating truth.</small>
      </div>
    </div>
  );
}

function ModuleConnector({ slug }: { slug: string }) {
  const pathId = `module-flow-${slug}`;
  return (
    <svg className={styles.moduleConnector} viewBox="0 0 126 44" aria-hidden="true">
      <path id={pathId} d="M124 22 H88 C76 22 76 13 64 13 H2" />
      <circle className={styles.anchor} cx="124" cy="22" r="5" />
      <circle className={styles.flowNode} cx="64" cy="13" r="3.5" />
      <circle className={styles.particle} r="2.6"><animateMotion dur="3.8s" repeatCount="indefinite"><mpath href={`#${pathId}`} /></animateMotion></circle>
    </svg>
  );
}

function ModuleMetric({ module }: { module: (typeof modules)[number] }) {
  return (
    <div className={styles.metric}>
      <span><small>{module.metricLabel}</small><strong>{module.metric}</strong></span>
      {"delta" in module ? <b>{module.delta} ↗</b> : null}
      {module.chart === "trend" ? <svg viewBox="0 0 60 28" aria-hidden="true"><path d="M2 24 13 16 23 20 34 9 43 13 57 2" /></svg> : null}
      {module.chart === "bars" ? <BarChart3 size={29} aria-hidden="true" /> : null}
      {module.chart === "people" ? <span className={styles.people} aria-hidden="true"><i /><i /><i /></span> : null}
    </div>
  );
}

function ModuleShowcase({ module, index }: { module: (typeof modules)[number]; index: number }) {
  return (
    <article className={styles.moduleShowcase} data-accent={module.accent} data-offset={index % 3}>
      <div className={styles.modulePhoto}>
        <Image src={module.image} alt={`${module.title} business environment`} fill sizes="(max-width: 760px) 42vw, (max-width: 1180px) 22vw, 190px" />
      </div>
      <div className={styles.modulePanel}>
        <div className={styles.moduleHeading}><span>{module.number}</span><h3>{module.title}</h3></div>
        <p>{module.copy}</p>
        <ModuleMetric module={module} />
      </div>
      <Link className={styles.moduleLink} href={`/modules/${module.slug}`} aria-label={`Explore ${module.title}`} />
      <ModuleConnector slug={module.slug} />
    </article>
  );
}

function ProofStrip() {
  return (
    <div className={styles.proofStrip}>
      {proofs.map(({ title, copy, icon: Icon }) => (
        <div className={styles.proof} key={title}><i><Icon size={25} /></i><span><strong>{title}</strong><small>{copy}</small></span></div>
      ))}
      <div className={styles.proofCta}>
        <strong>One platform.<br />Infinite possibilities.</strong>
        <Link href="/modules">Explore All Modules <ArrowRight size={15} /></Link>
      </div>
    </div>
  );
}

export function SolutionsGrid() {
  return (
    <section className={styles.section} aria-labelledby="solutions-grid-title">
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.shell}>
        <div className={styles.composition}>
          <div className={styles.storyColumn}><ModulesHeader /><OperatingCore /></div>
          <div className={`${styles.moduleStack} ${styles.centerStack}`}>{modules.slice(0, 3).map((module, index) => <ModuleShowcase key={module.slug} module={module} index={index} />)}</div>
          <div className={`${styles.moduleStack} ${styles.rightStack}`}>{modules.slice(3).map((module, index) => <ModuleShowcase key={module.slug} module={module} index={index + 3} />)}</div>
        </div>
        <ProofStrip />
      </div>
    </section>
  );
}
