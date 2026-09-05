"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeftRight, Barcode, BookCheck, Boxes, Building2, ChartNoAxesCombined,
  CircleCheck, CreditCard, FileCheck2, LayoutDashboard, ListTree, MapPin,
  MonitorCheck, Network, PackageCheck, RefreshCw, Route, Search, ShieldCheck,
  ShoppingBag, Store, Undo2, UserRound, Workflow,
} from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import { outcomeVisualRegistry } from "@/lib/content/modules/module-pages/outcome-visuals";
import type { ModuleOutcome, OutcomesSectionData } from "@/lib/content/modules/module-pages/types";
import styles from "@/components/pages/modules/modules.module.css";

const iconRegistry = {
  audit: BookCheck, barcode: Barcode, boxes: Boxes, building: Building2,
  chart: ChartNoAxesCombined, credit: CreditCard, dashboard: LayoutDashboard,
  file: FileCheck2, list: ListTree, monitor: MonitorCheck, network: Network,
  package: PackageCheck, pin: MapPin, receipt: PackageCheck, refresh: RefreshCw,
  route: Route, search: Search, shield: ShieldCheck, shopping: ShoppingBag,
  store: Store, transfer: ArrowLeftRight, undo: Undo2, user: UserRound,
  workflow: Workflow,
} as const;

export function OutcomeVisual({ outcome }: { outcome: ModuleOutcome }) {
  const visual = outcomeVisualRegistry[outcome.visualVariant];
  const Icon = iconRegistry[visual.icon];
  return (
    <div className={styles.outcomes__visual} aria-hidden="true" data-outcome-visual>
      <div className={styles.outcomes__visualWash} />
      {visual.steps.map((label, index) => (
        <div className={styles.outcomes__visualStep} key={label}>
          <span className={styles.outcomes__visualIcon}>
            {index === visual.steps.length - 1 ? <CircleCheck /> : index === 0 ? <Icon /> : <span className={styles.outcomes__miniGlyph}>{String(index + 1).padStart(2, "0")}</span>}
          </span>
          <span>{label}</span>
          {index < visual.steps.length - 1 ? <i className={styles.outcomes__connector}><b /></i> : null}
        </div>
      ))}
    </div>
  );
}

export function OutcomeHeader({ data }: { data: OutcomesSectionData }) {
  return (
    <header className={styles.outcomes__header} data-outcome-header>
      <p className={styles.outcomes__eyebrow}><span aria-hidden="true" />{data.eyebrow}</p>
      <h2 id="module-outcomes">{data.title}<br /><em>{data.highlight}</em></h2>
      {data.intro ? <p className={styles.outcomes__intro}>{data.intro}</p> : null}
    </header>
  );
}

export function OutcomeRow({ outcome }: { outcome: ModuleOutcome }) {
  const visual = outcomeVisualRegistry[outcome.visualVariant];
  const Icon = iconRegistry[visual.icon];
  return (
    <article className={styles.outcomes__row} data-outcome-row>
      <p className={styles.outcomes__mark}><i aria-hidden="true" />{outcome.number}</p>
      <span className={styles.outcomes__iconDisc} aria-hidden="true"><Icon /></span>
      <div className={styles.outcomes__copy}><h3>{outcome.title}</h3><p>{outcome.description}</p></div>
      <OutcomeVisual outcome={outcome} />
    </article>
  );
}

export function OutcomeList({ outcomes }: { outcomes: readonly ModuleOutcome[] }) {
  return <div className={styles.outcomes__list}>{outcomes.map((outcome) => <OutcomeRow key={outcome.id} outcome={outcome} />)}</div>;
}

export function ModuleOutcomes({ data }: { data: OutcomesSectionData }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = root.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const header = section.querySelector("[data-outcome-header]");
      const rows = gsap.utils.toArray<HTMLElement>("[data-outcome-row]", section);
      const visuals = gsap.utils.toArray<HTMLElement>("[data-outcome-visual]", section);
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: section, start: "top 88%", end: "bottom 74%", scrub: 0.45 },
      });
      timeline.fromTo(header, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .55 }, 0);
      rows.forEach((row, index) => {
        const at = .5 + index * .42;
        timeline.fromTo(row, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .52 }, at);
        timeline.fromTo(visuals[index], { opacity: .55, x: 14 }, { opacity: 1, x: 0, duration: .4 }, at + .1);
      });
    }, section);
    return () => context.revert();
  }, []);
  return (
    <section ref={root} className={styles.outcomes__section} aria-labelledby="module-outcomes" style={{ "--outcome-accent": data.outcomes[0]?.accent } as CSSProperties}>
      <div className={styles.outcomes__shell}><OutcomeHeader data={data} /><OutcomeList outcomes={data.outcomes} /></div>
    </section>
  );
}

