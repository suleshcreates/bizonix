"use client";

import type { CSSProperties } from "react";
import { useReveal } from "@/components/pages/features/deep/use-reveal";
import { challengeItems, HUB_SPLIT, type ChallengeItem } from "./challenge-data";
import styles from "@/components/pages/home/home.module.css";

/**
 * Handset composition of the same six-problem story the desktop canvas tells
 * radially. The topology is rewritten rather than shrunk: one continuous
 * 1px path runs down the column, each problem hangs off it as an editorial
 * row (no card), and the path branches out to the shared-context node
 * between problems 03 and 04 before rejoining.
 *
 * Reveal order is carried entirely by `--step`, so the stylesheet sequences
 * path → problems → branch → hub → branch → problems off one attribute.
 */

/**
 * Reveal beats. 0–2 are the first three problems, 3 is the branch-and-hub
 * group (which spends ~1.2 beats of its own), and 5–7 are the last three.
 */
const STEP_AFTER_HUB = 5;

function FlowProblem({
  item,
  step,
  last,
}: {
  item: ChallengeItem;
  step: number;
  last: boolean;
}) {
  const Icon = item.icon;

  return (
    <article
      className={styles.challengesSection__flowItem}
      style={{ "--step": step } as CSSProperties}
      data-last={last ? "true" : undefined}
    >
      <span className={styles.challengesSection__flowRail} aria-hidden="true">
        <span className={styles.challengesSection__flowNode}>
          <Icon size={17} strokeWidth={1.9} />
        </span>
      </span>

      <div className={styles.challengesSection__flowBody}>
        <p className={styles.challengesSection__flowMeta}>
          <b className={styles.challengesSection__flowNumber}>{item.number}</b>
          <span className={styles.challengesSection__flowTag}>{item.tag}</span>
          <span
            className={`${styles.challengesSection__flowChip} ${
              item.statAlert ? styles.challengesSection__flowChipAlert : ""
            }`}
          >
            {item.stat}
          </span>
        </p>
        <h3 className={styles.challengesSection__flowTitle}>{item.title}</h3>
        <p className={styles.challengesSection__flowText}>{item.description}</p>
      </div>
    </article>
  );
}

/**
 * The midpoint of the story. Not a solution card — it names the shared-context
 * problem that all six symptoms resolve to, which is what the desktop hub
 * says at the centre of the constellation.
 */
function SharedContextNode() {
  return (
    <div
      className={styles.challengesSection__flowHub}
      style={{ "--step": HUB_SPLIT } as CSSProperties}
    >
      {/* Branch out of the spine: down, then across to the node. */}
      <span className={styles.challengesSection__flowBranchDown} aria-hidden="true" />
      <span className={styles.challengesSection__flowBranchIn} aria-hidden="true" />

      <div className={styles.challengesSection__flowHubRow}>
        <span className={styles.challengesSection__flowHubSide}>
          Multiple tools
          <i />
        </span>

        <div className={styles.challengesSection__flowHubNode}>
          <span className={styles.challengesSection__flowHubEyebrow}>
            Shared context
          </span>
          <strong className={styles.challengesSection__flowHubTitle}>
            Lost between systems
          </strong>
        </div>

        <span
          className={`${styles.challengesSection__flowHubSide} ${styles.challengesSection__flowHubSideEnd}`}
        >
          <i />
          No single truth
        </span>
      </div>

      {/* And back: across to the spine, then down into problem 04. */}
      <span className={styles.challengesSection__flowBranchOut} aria-hidden="true" />
      <span className={styles.challengesSection__flowBranchUp} aria-hidden="true" />
    </div>
  );
}

export function ChallengesFlow() {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={styles.challengesSection__flow}
      data-shown={shown ? "true" : "false"}
    >
      {challengeItems.slice(0, HUB_SPLIT).map((item, index) => (
        <FlowProblem key={item.number} item={item} step={index} last={false} />
      ))}

      <SharedContextNode />

      {challengeItems.slice(HUB_SPLIT).map((item, index, list) => (
        <FlowProblem
          key={item.number}
          item={item}
          step={STEP_AFTER_HUB + index}
          last={index === list.length - 1}
        />
      ))}
    </div>
  );
}
