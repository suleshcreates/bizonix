"use client";

import Image from "next/image";
import { ArrowRight, Store, Network, Warehouse } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import {
  coreCards,
  operatingLanes,
  type OperatingLane,
} from "@/lib/content/home/operating-core-data";
import { CoreDiagram, CoreNode } from "./operating-core-parts/core-diagram";
import {
  AllocationCard,
  CounterCard,
  ReplenishmentCard,
} from "./operating-core-parts/lane-cards";
import { useCoreScrub } from "./operating-core-parts/use-core-scrub";
import styles from "@/components/pages/home/home.module.css";

const laneIcons = [Warehouse, Store, Network] as const;
const laneCards = [AllocationCard, CounterCard, ReplenishmentCard] as const;

/**
 * "Three entities. One set of books." — the section directly below the hero.
 *
 * The argument is the layout: three independent operations converge into a
 * single record, and the scroll timeline is the only place that argument
 * actually resolves on screen. Everything is one responsive component — the
 * desktop fan and the mobile spine are two CSS treatments of the same DOM, not
 * two DOM trees.
 *
 * Composition holds one alignment system throughout: full-width single-column
 * elements (eyebrow, headline, lede, core node, truth line, CTA) sit on the
 * centre axis — which is also the axis the three lanes converge into — and
 * text inside any multi-column grid is left-aligned within its own column.
 */
export function OperatingCore() {
  const { sectionRef, wrapRef, outcomeRef } = useCoreScrub<
    HTMLElement,
    HTMLDivElement,
    HTMLDivElement
  >();

  return (
    <section
      id="who-its-for"
      ref={sectionRef}
      className={styles.operatingCore__section}
      aria-labelledby="operating-core-title"
    >
      <div className={`${styles.operatingCore__shell} ${styles.operatingCore__head}`}>
        <p className={styles.operatingCore__eyebrow}>
          One platform <span aria-hidden="true">·</span> every operating entity
        </p>
        <h2 id="operating-core-title" className={styles.operatingCore__title}>
          Three entities.
          <br />
          One set of books.
        </h2>
        <p className={styles.operatingCore__lede}>
          Wholesale HQ, your own counters and franchise outlets run as separate
          businesses. Bizonix keeps them on one record — so a transfer, a sale
          and a return all mean the same thing everywhere.
        </p>
      </div>

      {/* The wrapper is taller than the viewport and the stage sticks inside
          it, which is what makes the lanes and the core co-visible. Its height
          is declared in CSS rather than injected on hydration, so the layout is
          identical with and without JavaScript and the section contributes no
          layout shift. */}
      <div ref={wrapRef} className={styles.operatingCore__stageWrap}>
        <div className={styles.operatingCore__stage}>
          <div className={`${styles.operatingCore__shell} ${styles.operatingCore__stageInner}`}>
            <div className={styles.operatingCore__flow}>
              <span className={styles.operatingCore__spine} aria-hidden="true" />

              <div className={styles.operatingCore__lanes}>
                {operatingLanes.map((lane, index) => (
                  <Lane
                    key={lane.id}
                    lane={lane}
                    index={index}
                    icon={laneIcons[index]}
                    card={laneCards[index]({ doc: lane.token })}
                  />
                ))}
              </div>

              <div className={styles.operatingCore__band}>
                <CoreDiagram />
              </div>

              <CoreNode />
            </div>

            <p className={styles.operatingCore__truth}>
              <span>One operating truth.</span>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.operatingCore__shell}>
        <ConsequenceCards outcomeRef={outcomeRef} />
      </div>
    </section>
  );
}

function Lane({
  lane,
  index,
  icon: Icon,
  card,
}: {
  lane: OperatingLane;
  index: number;
  icon: (typeof laneIcons)[number];
  card: ReactNode;
}) {
  return (
    // Focusable so the connector highlight is reachable by keyboard, not only
    // by pointer: the diagram is the argument, and a keyboard user should be
    // able to isolate each path the same way a mouse user can.
    <article
      className={styles.operatingCore__lane}
      data-lane={lane.id}
      tabIndex={0}
      aria-label={`${lane.label}: ${lane.title}`}
      style={{ "--i": index } as CSSProperties}
    >
      {/* Brand-toned texture, not documentary photography: near-mono, tinted
          per lane, held at low opacity behind the copy and masked out before
          it reaches an edge. Decorative, so it is hidden from assistive tech. */}
      <span className={styles.operatingCore__field} aria-hidden="true">
        <Image
          src={lane.image}
          alt=""
          fill
          sizes="(max-width: 620px) 92vw, (max-width: 1250px) 46vw, 430px"
        />
        <span className={styles.operatingCore__fieldTint} />
        <span className={styles.operatingCore__fieldGrain} />
      </span>

      <span className={styles.operatingCore__laneNode} aria-hidden="true">
        <Icon size={17} strokeWidth={1.9} />
      </span>

      <span className={styles.operatingCore__laneLabel}>{lane.label}</span>
      <h3 className={styles.operatingCore__laneTitle}>
        <span>{lane.title}</span>
      </h3>
      <p className={styles.operatingCore__laneCopy}>{lane.body}</p>

      <div className={styles.operatingCore__laneCardWrap}>{card}</div>
    </article>
  );
}

/**
 * Beat 4. These sit after the pinned stage in normal flow — four cards at a
 * readable size will not fit inside a single pinned viewport alongside the
 * lanes — so they are revealed by their own observer rather than by `--p`, and
 * they scale outward from the centre so they still read as emitted from the
 * core's pulse.
 */
function ConsequenceCards({
  outcomeRef,
}: {
  outcomeRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={outcomeRef} className={styles.operatingCore__outcome}>
      <ul className={styles.operatingCore__cards}>
        {coreCards.map((card, index) => (
          <li
            key={card.title}
            className={styles.operatingCore__card}
            style={{ "--i": index } as CSSProperties}
          >
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </li>
        ))}
      </ul>

      <div className={styles.operatingCore__ctaRow}>
        <ButtonLink href="/contact" className="px-7 py-3.5">
          Book a workflow demo <ArrowRight size={16} aria-hidden="true" />
        </ButtonLink>
        <ButtonLink href="/product" variant="secondary" className="px-7 py-3.5">
          See how the model works
        </ButtonLink>
      </div>
    </div>
  );
}
