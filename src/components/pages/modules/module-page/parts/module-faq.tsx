"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { trackModuleEvent } from "@/lib/analytics";
import type { ModuleFaqItem } from "@/lib/content/modules/module-pages/types";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * Module-specific FAQ.
 *
 * A real disclosure pattern: a button carrying `aria-expanded` and
 * `aria-controls`, and a region labelled by that button. Framer Motion only
 * animates the panel height — GSAP never touches these nodes.
 */
export function ModuleFaq({
  faq,
  moduleTitle,
  moduleSlug,
}: {
  faq: readonly ModuleFaqItem[];
  moduleTitle: string;
  moduleSlug: string;
}) {
  const [open, setOpen] = useState<string | null>(faq[0]?.id ?? null);
  const reduced = useReducedMotion();
  const baseId = useId();

  return (
    <section className={styles.modulePage__faq} aria-labelledby="module-faq">
      <div className={styles.modulePage__shell}>
        <div className={styles.modulePage__faqLayout}>
          <header className={styles.modulePage__sectionHead}>
            <p className={styles.modulePage__eyebrow} data-reveal>
              <span className={styles.modulePage__eyebrowDot} aria-hidden="true" />
              Questions
            </p>
            <h2 id="module-faq" data-reveal>
              About {moduleTitle}
            </h2>
            <p data-reveal>
              The things operators ask before a demo. If yours is not here, it
              is a good first question to bring to one.
            </p>
          </header>

          <div className={styles.modulePage__faqList} data-reveal>
            {faq.map((item) => {
              const expanded = open === item.id;
              const triggerId = `${baseId}-${item.id}-trigger`;
              const panelId = `${baseId}-${item.id}-panel`;

              return (
                <div key={item.id} className={styles.modulePage__faqItem}>
                  <h3>
                    <button
                      type="button"
                      id={triggerId}
                      className={styles.modulePage__faqTrigger}
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => {
                        const next = expanded ? null : item.id;
                        setOpen(next);
                        if (next) {
                          trackModuleEvent("module_faq_opened", {
                            module: moduleSlug,
                            question: item.id,
                          });
                        }
                      }}
                    >
                      <span>{item.question}</span>
                      <span className={styles.modulePage__faqIcon} aria-hidden="true">
                        <Plus size={15} />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.div
                        key="panel"
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        className={styles.modulePage__faqPanel}
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{
                          duration: reduced ? 0 : 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <p>{item.answer}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
