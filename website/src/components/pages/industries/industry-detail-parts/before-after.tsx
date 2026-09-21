import { Check } from "lucide-react";
import Image from "next/image";
import type { IndustryDetail } from "@/lib/content/industries/industry-detail";
import styles from "@/components/pages/industries/industries.module.css";

/**
 * The page's one dark beat. It stops the light sections running together and
 * gives the before/after contrast somewhere to land.
 */
export function BeforeAfter({ proof }: { proof: IndustryDetail["proof"] }) {
  return (
    <section className={styles.industryDetailPage__proof} aria-labelledby="proof-title">
      <div className={styles.industryDetailPage__shell}>
        <div className={styles.industryDetailPage__proofPanel}>
          <div className={styles.industryDetailPage__proofMedia}>
            {proof.image ? (
              <Image
                src={proof.image}
                alt={proof.alt || proof.title}
                fill
                sizes="(max-width: 1080px) 100vw, 42vw"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-slate-900 text-slate-500 text-xs">
                No proof image
              </div>
            )}
            <span className={styles.industryDetailPage__proofMediaWash} aria-hidden="true" />
          </div>

          <div className={styles.industryDetailPage__proofCopy}>
            <p className={`${styles.industryDetailPage__eyebrow} ${styles.industryDetailPage__eyebrowOnDark}`}>
              <span className={styles.industryDetailPage__eyebrowDot} aria-hidden="true" />
              {proof.label}
            </p>
            <h2 id="proof-title">{proof.title}</h2>

            <div className={styles.industryDetailPage__proofCompare}>
              <div className={styles.industryDetailPage__proofBefore}>
                <span className={styles.industryDetailPage__proofTag}>Without one record</span>
                <p>{proof.before}</p>
              </div>
              <div className={styles.industryDetailPage__proofAfter}>
                <span className={styles.industryDetailPage__proofTag}>With Bizonix</span>
                <p>{proof.after}</p>
              </div>
            </div>

            <p className={styles.industryDetailPage__turningPoint}>
              <span className={styles.industryDetailPage__turningIcon} aria-hidden="true">
                <Check size={13} strokeWidth={3} />
              </span>
              {proof.turningPoint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
