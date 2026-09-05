import Image from "next/image";
import {
  ArrowRight,
  Clock,
  Eye,
  FileCheck,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { proofStories } from "@/lib/content/industries/proof-stories";
import type {
  EvidenceItem,
  ProofStory,
} from "@/lib/content/industries/proof-stories";
import styles from "@/components/pages/industries/industries.module.css";

/* ==========================================================================
   SECTION 05 — PROOF

   Read as a case dossier in three bands: who said it, what changed, what is
   observably different now. The testimonial leads because it is the only
   human voice on the page — the previous layout carried it in the data and
   never rendered it, showing a decorative quote glyph instead.
   ========================================================================== */

const EVIDENCE_ICONS: Record<EvidenceItem["iconName"], LucideIcon> = {
  eye: Eye,
  clock: Clock,
  "file-check": FileCheck,
  "shield-check": ShieldCheck,
};

function ProofHeader() {
  return (
    <header className={styles.proofSection__header}>
      <div className={styles.proofSection__headerLeft}>
        <p className={styles.proofSection__eyebrow}>
          <span
            className={styles.proofSection__eyebrowLine}
            aria-hidden="true"
          />
          <span className={styles.proofSection__eyebrowText}>05 — Proof</span>
        </p>

        <h2 id="proof-title" className={styles.proofSection__headline}>
          What changes when every entity shares{" "}
          <span className={styles.proofSection__headlineAccent}>
            one record.
          </span>
        </h2>

        <p className={styles.proofSection__supportingCopy}>
          One deployment, told through the operation it replaced — the tooling
          before, the record after, and what the team can now see.
        </p>
      </div>

      {/* Saying plainly that the story is anonymized is worth more than a
          logo we are not allowed to show. */}
      <p className={styles.proofSection__disclosure}>
        <ShieldCheck size={15} aria-hidden="true" />
        <span>
          <strong>Representative story.</strong>
          Illustrative workflow data, not customer telemetry.
        </span>
      </p>
    </header>
  );
}

function CaseIntro({ story }: { story: ProofStory }) {
  return (
    <div className={styles.proofSection__intro}>
      <figure className={styles.proofSection__media}>
        <Image
          src={story.image}
          alt={story.imageAlt}
          fill
          className={styles.proofSection__mediaImage}
          style={{ objectPosition: story.objectPosition }}
          sizes="(max-width: 900px) 100vw, 34vw"
        />
        <span className={styles.proofSection__mediaWash} aria-hidden="true" />
        <figcaption className={styles.proofSection__plaque}>
          <span className={styles.proofSection__plaqueRole}>
            {story.identity.role}
          </span>
          <span className={styles.proofSection__plaqueAttr}>
            {story.identity.attribution}
          </span>
        </figcaption>
      </figure>

      <div className={styles.proofSection__introBody}>
        <span className={styles.proofSection__industryLabel}>
          {story.industry}
        </span>
        <h3 className={styles.proofSection__storyHeadline}>{story.headline}</h3>

        {story.quote ? (
          <figure className={styles.proofSection__quote}>
            <span className={styles.proofSection__quoteMark} aria-hidden="true">
              &ldquo;
            </span>
            <blockquote>
              <p>{story.quote.text}</p>
            </blockquote>
            <figcaption>{story.quote.attribution}</figcaption>
          </figure>
        ) : null}
      </div>
    </div>
  );
}

/*
 * before/after and the two story paragraphs were saying the same two things
 * twice. Pairing them makes each paragraph the detail behind its own state.
 */
function CaseShift({ story }: { story: ProofStory }) {
  return (
    <div className={styles.proofSection__shift}>
      <div className={styles.proofSection__shiftPair}>
        <article className={styles.proofSection__state} data-state="before">
          <span className={styles.proofSection__stateLabel}>Before</span>
          <p className={styles.proofSection__stateLede}>{story.before}</p>
          <p className={styles.proofSection__stateDetail}>
            {story.storyParagraph1}
          </p>
        </article>

        <span className={styles.proofSection__shiftArrow} aria-hidden="true">
          <ArrowRight size={16} />
        </span>

        <article className={styles.proofSection__state} data-state="after">
          <span className={styles.proofSection__stateLabel}>After</span>
          <p className={styles.proofSection__stateLede}>{story.after}</p>
          <p className={styles.proofSection__stateDetail}>
            {story.storyParagraph2}
          </p>
        </article>
      </div>

      <p className={styles.proofSection__turning}>
        <span className={styles.proofSection__turningIcon} aria-hidden="true">
          <Sparkles size={13} />
        </span>
        <span>
          <strong>The turning point</strong>
          {story.turningPoint}
        </span>
      </p>
    </div>
  );
}

function CaseEvidence({ story }: { story: ProofStory }) {
  const isQualitative = story.evidence.every(
    (item) => item.type === "qualitative",
  );

  return (
    <div className={styles.proofSection__evidence}>
      <div className={styles.proofSection__evidenceHead}>
        <h4>{isQualitative ? "Observed change" : "Measurable impact"}</h4>
        <p>
          {isQualitative
            ? "Operational outcomes reported by the team, not benchmark figures."
            : "Figures reported by the team after deployment."}
        </p>
      </div>

      <ul className={styles.proofSection__evidenceList}>
        {story.evidence.map((item, index) => {
          const Icon = EVIDENCE_ICONS[item.iconName];
          return (
            <li
              key={item.label}
              className={styles.proofSection__evidenceItem}
              data-tone={index % 2 === 1 ? "teal" : "blue"}
            >
              <span
                className={styles.proofSection__evidenceIcon}
                aria-hidden="true"
              >
                <Icon size={16} strokeWidth={1.9} />
              </span>
              <strong className={styles.proofSection__evidenceValue}>
                {item.value}
              </strong>
              <span className={styles.proofSection__evidenceLabel}>
                {item.label}
              </span>
              {item.detail ? (
                <p className={styles.proofSection__evidenceDetail}>
                  {item.detail}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ProofSection() {
  const story = proofStories[0];
  if (!story) return null;

  return (
    <section
      id="proof-section"
      className={styles.proofSection__section}
      aria-labelledby="proof-title"
    >
      <span className={styles.proofSection__atmosphere} aria-hidden="true" />

      <div className={styles.proofSection__shell}>
        <ProofHeader />

        <article className={styles.proofSection__dossier}>
          <CaseIntro story={story} />
          <CaseShift story={story} />
          <CaseEvidence story={story} />
        </article>
      </div>
    </section>
  );
}
