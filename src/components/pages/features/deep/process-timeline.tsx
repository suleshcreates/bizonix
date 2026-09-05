import type { CSSProperties } from "react";
import type { ProcessStep } from "@/lib/content/features/feature-deep-pages";
import styles from "@/components/pages/features/features.module.css";

/**
 * The four-step operational sequence on the right of section 02.
 *
 * Four steps, always: a numbered node on a drawn rail, the step's argument,
 * and one product fragment showing the state that step leaves behind. The
 * fragment's anatomy — micro label, a mono field, a state pill and a line of
 * meta — is the same for every step of every feature, so the sequence measures
 * the same on all five pages.
 */
export function ProcessTimeline({ steps }: { steps: readonly ProcessStep[] }) {
  return (
    <ol className={styles.features__featureDeep__timeline}>
      {steps.map((step, index) => {
        const Icon = step.ui.icon;
        return (
          <li
            key={step.title}
            className={styles.features__featureDeep__step}
            style={{ "--i": index } as CSSProperties}
          >
            <span className={styles.features__featureDeep__stepMark}>
              <span className={styles.features__featureDeep__stepNumber}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </span>

            <div className={styles.features__featureDeep__stepCard}>
              <div className={styles.features__featureDeep__stepBody}>
                <h3 className={styles.features__featureDeep__stepTitle}>{step.title}</h3>
                <p className={styles.features__featureDeep__stepText}>{step.body}</p>
              </div>

              <div className={styles.features__featureDeep__stepUi}>
                <span className={styles.features__featureDeep__stepUiHead}>
                  <span className={styles.features__featureDeep__stepUiIcon}>
                    <Icon size={14} strokeWidth={2.1} aria-hidden="true" />
                  </span>
                  <span className={styles.features__featureDeep__stepUiLabel}>{step.ui.label}</span>
                  <span className={styles.features__featureDeep__stepPill} data-tone={step.ui.tone}>
                    {step.ui.pill}
                  </span>
                </span>
                <span className={styles.features__featureDeep__stepField}>{step.ui.field}</span>
                <span className={styles.features__featureDeep__stepMeta}>{step.ui.meta}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
