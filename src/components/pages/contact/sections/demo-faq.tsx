"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { demoFaq } from "@/lib/content/contact/contact-content";
import { track } from "@/lib/analytics";
import { useReveal } from "./motion";
import styles from "@/components/pages/contact/contact.module.css";

/** One panel open at a time; all panels closed by default so mobile is not a wall of text. */
export function DemoFaq() {
  const [openId, setOpenId] = useState<string | null>(null);
  const base = useId();
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={styles.contact__faq}
      aria-labelledby="faq-title"
      data-reveal
      data-revealed={revealed ? "true" : undefined}
    >
      <h2 id="faq-title" className={styles.contact__faqTitle}>
        Before you go: questions we always get
      </h2>
      <p className={styles.contact__faqLede}>
        These cover most of what people ask before a first session.
      </p>
      <ul className={styles.contact__faqList}>
        {demoFaq.map((item, index) => {
          const open = openId === item.id;
          const buttonId = `${base}-${item.id}-button`;
          const panelId = `${base}-${item.id}-panel`;
          return (
            <li
              key={item.id}
              className={styles.contact__faqItem}
              data-open={open ? "true" : undefined}
              style={{ "--i": index } as React.CSSProperties}
            >
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => {
                    const next = open ? null : item.id;
                    setOpenId(next);
                    if (next) track("contact_faq_opened", { question: item.id });
                  }}
                >
                  <span>{item.question}</span>
                  <Plus className={styles.contact__faqIcon} size={19} aria-hidden="true" />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={styles.contact__faqPanel}
                hidden={!open}
              >
                <p>{item.answer}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
