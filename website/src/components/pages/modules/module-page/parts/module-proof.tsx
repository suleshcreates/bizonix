import type { ModuleProof as Proof } from "@/lib/content/modules/module-pages/types";
import Image from "next/image";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * Module-specific customer evidence.
 *
 * The template calls this only when `proof` exists in module data, and no
 * module currently carries one: the site audit is explicit that no customer
 * name, quote or metric has written approval yet. This renders approved
 * evidence when it arrives; it never renders a stand-in for it.
 */
export function ModuleProof({ proof }: { proof: Proof }) {
  return (
    <section className={styles.modulePage__proof} aria-labelledby="module-proof">
      <div className={styles.modulePage__shell}>
        <header className={styles.modulePage__sectionHead}>
          <p className={styles.modulePage__eyebrow} data-reveal>
            <span className={styles.modulePage__eyebrowDot} aria-hidden="true" />
            Proof
          </p>
          <h2 id="module-proof" className={styles.modulePage__srOnly}>
            Customer evidence
          </h2>
        </header>

        <figure className={styles.modulePage__proofPanel} data-reveal>
          <blockquote>{proof.statement}</blockquote>
          <figcaption style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1rem" }}>
            {proof.image && (
              <div style={{ position: "relative", width: "2.5rem", height: "2.5rem", borderRadius: "9999px", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.15)" }}>
                <Image
                  src={proof.image}
                  alt={proof.attribution}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            <cite>{proof.attribution}</cite>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
