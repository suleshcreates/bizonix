import { ChallengesFlow } from "./challenges-parts/challenges-flow";
import { ChallengesRadial } from "./challenges-parts/challenges-radial";
import styles from "@/components/pages/home/home.module.css";

/**
 * "Why brands outgrow spreadsheets" — six operating problems that resolve to
 * one shared-context problem.
 *
 * The story is told twice because the geometry has to differ: a radial
 * constellation from 960px up, a vertical flow below it. Both renderers read
 * the same `challengeItems`, and only one is ever displayed.
 */
export function ChallengesSection() {
  return (
    <section
      id="challenges"
      className={styles.challengesSection__section}
      aria-labelledby="challenges-title"
    >
      <div className={styles.challengesSection__shell}>
        <div className={styles.challengesSection__heading}>
          <div>
            <span className={styles.challengesSection__eyebrow}>
              When disconnected tools stop scaling
            </span>
            <h2
              id="challenges-title"
              className={styles.challengesSection__title}
            >
              Why brands <em>outgrow spreadsheets.</em>
            </h2>
          </div>
          <p className={styles.challengesSection__subtitle}>
            The problem is rarely one missing report. It is the delay between
            what happened on the floor and what the business believes happened.
          </p>
        </div>

        <ChallengesRadial />
        <ChallengesFlow />
      </div>
    </section>
  );
}
