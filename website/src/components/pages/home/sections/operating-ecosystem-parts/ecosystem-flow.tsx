"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";
import { operatingEnvironments } from "@/lib/content/home/operating-ecosystem-data";
import { useReveal } from "@/components/pages/features/deep/use-reveal";
import {
  AllocationProof,
  CounterProof,
  ReplenishmentProof,
} from "./ecosystem-proofs";
import styles from "@/components/pages/home/home.module.css";

/**
 * Handset composition (< 761px).
 *
 * The desktop canvas places three environments around a shared core and wires
 * them together in two dimensions. A phone column has one, so the same idea is
 * retold as a vertical network: one rail runs the length of the section, each
 * operating entity hangs off it as an editorial block — image, statement,
 * copy and a single proof artifact — and the rail terminates in the operating
 * core rather than passing it.
 *
 * Every entity is the same component. The only thing that varies is its tone,
 * which is the approved per-entity accent carried down to the label and node
 * only; nothing else on the handset is coloured.
 *
 * Each block reveals on its own observer rather than off one section-wide
 * sequence. The section runs past 1500px on a phone, so a single timeline
 * would play the last two entities while they were still below the fold.
 */

/** Approved entity accents, in data order: wholesale, retail, franchise. */
const tones = [
  { ink: "#2f6bff", soft: "#e8efff" },
  { ink: "#0a9a8c", soft: "#e2f7f4" },
  { ink: "#7c48d8", soft: "#f0eaff" },
];

const proofs = [AllocationProof, CounterProof, ReplenishmentProof];

function Entity({
  index,
  active,
  onActivate,
}: {
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  const zone = operatingEnvironments[index];
  const tone = tones[index];
  const Proof = proofs[index];
  const { ref, shown } = useReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={styles.operatingEcosystem__flowEntity}
      style={{ "--tone": tone.ink, "--tone-soft": tone.soft } as CSSProperties}
      data-shown={shown ? "true" : "false"}
      data-active={active ? "true" : undefined}
      onPointerEnter={onActivate}
    >
      <span className={styles.operatingEcosystem__flowRail} aria-hidden="true">
        <span className={styles.operatingEcosystem__flowNode} />
      </span>

      <div className={styles.operatingEcosystem__flowBody}>
        <p className={styles.operatingEcosystem__flowLabel}>
          <b>{zone.number}</b>
          {zone.label}
        </p>

        <div className={styles.operatingEcosystem__flowLede}>
          <span className={styles.operatingEcosystem__flowImage}>
            <Image
              src={zone.image}
              alt=""
              fill
              sizes="(max-width: 760px) 96px, 300px"
            />
          </span>
          <h3 className={styles.operatingEcosystem__flowTitle}>{zone.title}</h3>
        </div>

        <p className={styles.operatingEcosystem__flowText}>{zone.body}</p>

        <Proof className={styles.operatingEcosystem__flowProof} />
      </div>
    </li>
  );
}

/**
 * Where the rail ends. Not a fourth entity and not another card: the tinted
 * band reads as the layer the three entities sit on rather than the next item
 * in the list.
 */
function CoreEndpoint() {
  const { ref, shown } = useReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={styles.operatingEcosystem__flowCore}
      data-shown={shown ? "true" : "false"}
    >
      <span
        className={styles.operatingEcosystem__flowCoreRail}
        aria-hidden="true"
      >
        <span className={styles.operatingEcosystem__flowCoreNode}>
          <Image
            src="/images/shared/brand/icon.svg"
            alt=""
            width={18}
            height={18}
          />
        </span>
      </span>

      <div className={styles.operatingEcosystem__flowCorePanel}>
        <strong className={styles.operatingEcosystem__flowCoreTitle}>
          Bizonix Operating Core
        </strong>
        <span className={styles.operatingEcosystem__flowCoreLine}>
          Unified. Connected. Intelligent.
        </span>
        <small className={styles.operatingEcosystem__flowCoreNote}>
          One flow. Complete control.
        </small>
      </div>
    </li>
  );
}

export function EcosystemFlow() {
  const { ref, shown } = useReveal<HTMLOListElement>();
  const [active, setActive] = useState<number | null>(null);

  return (
    <ol
      ref={ref}
      className={styles.operatingEcosystem__flow}
      data-shown={shown ? "true" : "false"}
    >
      {/* The one ambient loop: a signal moving entity to entity. */}
      <span
        className={styles.operatingEcosystem__flowSignal}
        aria-hidden="true"
      />

      {operatingEnvironments.map((zone, index) => (
        <Entity
          key={zone.label}
          index={index}
          active={active === index}
          onActivate={() => setActive(index)}
        />
      ))}

      <CoreEndpoint />
    </ol>
  );
}
