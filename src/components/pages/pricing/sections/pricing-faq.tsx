"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { pricingFaq } from "@/lib/content/pricing/pricing";
import styles from "@/components/pages/pricing/pricing.module.css";

/**
 * Pricing FAQ.
 *
 * The same disclosure pattern the module pages use, so a visitor who has met
 * one accordion on this site has met all of them: a real `<button>` carrying
 * `aria-expanded` and `aria-controls`, and a region labelled by that button.
 * One panel open at a time — a single `open` id rather than a set.
 *
 * Framer Motion animates only the panel's height and opacity. GSAP reveals the
 * items on scroll entry (`data-reveal="faq"`) and never touches these two
 * properties, so an item that is mid-reveal cannot fight an item being opened.
 */
export function PricingFaq() {
  const [open, setOpen] = useState<string | null>(pricingFaq[0]?.id ?? null);
  const reduced = useReducedMotion();
  const baseId = useId();

  return (
    <section className={styles.pricing__faq} aria-labelledby="pricing-faq">
      <div className={styles.pricing__shell}>
        <div className={styles.pricing__faqLayout}>
          <header className={styles.pricing__sectionHead}>
            <p className={styles.pricing__eyebrow} data-reveal="head">
              <span className={styles.pricing__eyebrowDot} aria-hidden="true" />
              Questions
            </p>
            <h2 id="pricing-faq" data-reveal="head">
              Before you ask for a number
            </h2>
            <p data-reveal="head">
              What the plans are counted on, what moves between them, and what
              happens at the edges. If yours is not here, it is a good first
              question to bring to a demo.
            </p>
          </header>

          <div className={styles.pricing__faqList}>
            {pricingFaq.map((item) => {
              const expanded = open === item.id;
              const triggerId = `${baseId}-${item.id}-trigger`;
              const panelId = `${baseId}-${item.id}-panel`;

              return (
                <div
                  key={item.id}
                  className={styles.pricing__faqItem}
                  data-reveal="faq"
                >
                  <h3>
                    <button
                      type="button"
                      id={triggerId}
                      className={styles.pricing__faqTrigger}
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setOpen(expanded ? null : item.id)}
                    >
                      <span>{item.question}</span>
                      <span
                        className={styles.pricing__faqIcon}
                        aria-hidden="true"
                      >
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
                        className={styles.pricing__faqPanel}
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={
                          reduced
                            ? { duration: 0 }
                            : {
                                height: {
                                  type: "spring",
                                  stiffness: 320,
                                  damping: 34,
                                  restDelta: 0.5,
                                },
                                opacity: { duration: 0.2 },
                              }
                        }
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
