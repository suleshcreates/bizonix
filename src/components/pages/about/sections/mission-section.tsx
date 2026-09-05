"use client";

import { aboutMission } from "@/lib/content/about/about-page";
import { useStageProgress } from "../about-motion";
import styles from "@/components/pages/about/about.module.css";

const words = aboutMission.statement.split(" ");

/**
 * The mission is not laid out as a paragraph to be skimmed — it is scrubbed.
 * The statement stays pinned and lights up word by word as the reader scrolls,
 * and the "distance" meter beside it closes as the sentence completes, which is
 * the point the sentence is making.
 */
export function MissionSection() {
  const { ref } = useStageProgress<HTMLDivElement>();

  return (
    <section id="mission" className={styles.about__mission__section} aria-labelledby="mission-title">
      <div className={styles.about__mission__stage} ref={ref}>
        <div className={styles.about__mission__frame}>
          <div className={styles.about__mission__head}>
            <p className={styles.about__mission__eyebrow}>
              <span aria-hidden="true" />
              {aboutMission.eyebrow}
            </p>

            <div className={styles.about__mission__meter} aria-hidden="true">
              <span className={styles.about__mission__meterLabel}>Distance</span>
              <span className={styles.about__mission__meterTrack}>
                <i className={styles.about__mission__meterLeft} />
                <i className={styles.about__mission__meterRight} />
              </span>
            </div>
          </div>

          <h2 id="mission-title" className={styles.about__mission__title}>
            {aboutMission.headlinePrimary}
            <em>{aboutMission.headlineAccent}</em>
          </h2>

          <p
            className={styles.about__mission__statement}
            style={{ "--n": words.length } as React.CSSProperties}
          >
            {words.map((word, index) => (
              <span
                key={`${word}-${index}`}
                style={{ "--i": index } as React.CSSProperties}
              >
                {word}{" "}
              </span>
            ))}
          </p>

          <figure className={styles.about__mission__signature}>
            <blockquote>{aboutMission.signature}</blockquote>
            <figcaption>{aboutMission.attribution}</figcaption>
          </figure>

          <span className={styles.about__mission__progressRail} aria-hidden="true">
            <i />
          </span>
        </div>
      </div>
    </section>
  );
}


