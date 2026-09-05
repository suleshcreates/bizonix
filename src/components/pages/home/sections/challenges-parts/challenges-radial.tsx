import { challengeItems } from "./challenge-data";
import styles from "@/components/pages/home/home.module.css";

/**
 * Desktop blueprint: six evidence points orbiting the shared-context hub.
 * Approved and frozen — this renders only at >= 960px and is unchanged from
 * the original section; the handset story lives in `challenges-flow.tsx`.
 */

/** Slot for each point on the 1200x800 canvas, in list order. */
const pointPositions = [
  styles.challengesSection__point1,
  styles.challengesSection__point2,
  styles.challengesSection__point3,
  styles.challengesSection__point4,
  styles.challengesSection__point5,
  styles.challengesSection__point6,
];

export function ChallengesRadial() {
  return (
    <div className={styles.challengesSection__blueprint}>
      <div className={styles.challengesSection__topbar}>
        <span className={styles.challengesSection__topbarStatus}>
          <i className={styles.challengesSection__statusDot} /> Floor reality
        </span>
        <strong className={styles.challengesSection__topbarTitle}>
          Disconnected Operating Loop
        </strong>
        <span className={styles.challengesSection__topbarStatus}>
          <i className={styles.challengesSection__statusDotWarning} /> Spreadsheet
          delay
        </span>
      </div>

      <div className={styles.challengesSection__canvasArea}>
        {/* SVG Connector Orbits with Arrowheads */}
        <svg
          className={styles.challengesSection__orbitsSvg}
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <marker
              id="hub-arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 1 2 L 7 5 L 1 8 z" fill="rgba(47, 107, 255, 0.65)" />
            </marker>
          </defs>

          {/* 01: Top-Left */}
          <path
            className={styles.challengesSection__orbitPath}
            d="M 520 320 C 460 250 420 180 365 145"
            markerEnd="url(#hub-arrow)"
          />
          {/* 02: Top-Right */}
          <path
            className={styles.challengesSection__orbitPath}
            d="M 680 320 C 740 250 780 180 835 145"
            markerEnd="url(#hub-arrow)"
          />
          {/* 03: Mid-Left */}
          <path
            className={styles.challengesSection__orbitPath}
            d="M 480 400 C 430 400 395 400 355 400"
            markerEnd="url(#hub-arrow)"
          />
          {/* 04: Mid-Right */}
          <path
            className={styles.challengesSection__orbitPath}
            d="M 720 400 C 770 400 805 400 845 400"
            markerEnd="url(#hub-arrow)"
          />
          {/* 05: Bottom-Left */}
          <path
            className={styles.challengesSection__orbitPath}
            d="M 520 480 C 460 550 420 620 365 655"
            markerEnd="url(#hub-arrow)"
          />
          {/* 06: Bottom-Right */}
          <path
            className={styles.challengesSection__orbitPath}
            d="M 680 480 C 740 550 780 620 835 655"
            markerEnd="url(#hub-arrow)"
          />
        </svg>

        {/* Central Hub */}
        <div className={styles.challengesSection__centerHub} aria-hidden="true">
          <span className={styles.challengesSection__hubEyebrow}>
            Shared context
          </span>
          <strong className={styles.challengesSection__hubTitle}>
            Lost between systems
          </strong>
        </div>

        {/* 6 Symmetrical Evidence Points */}
        {challengeItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <article
              key={item.number}
              className={`${styles.challengesSection__radialPoint} ${pointPositions[index]}`}
            >
              <div className={styles.challengesSection__pointHeader}>
                <span className={styles.challengesSection__badgeNumber}>
                  {item.number}
                </span>
                <strong className={styles.challengesSection__microTag}>
                  {item.tag}
                </strong>
              </div>

              <div className={styles.challengesSection__pointVisualRow}>
                <div className={styles.challengesSection__iconBadge}>
                  <Icon size={24} />
                </div>
                {item.stat && (
                  <span
                    className={`${styles.challengesSection__statPill} ${
                      item.statAlert ? styles.challengesSection__statPillAlert : ""
                    }`}
                  >
                    {item.stat}
                  </span>
                )}
              </div>

              <h3 className={styles.challengesSection__pointTitle}>
                {item.title}
              </h3>
              <p className={styles.challengesSection__pointDescription}>
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
