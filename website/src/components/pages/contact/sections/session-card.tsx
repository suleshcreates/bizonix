"use client";

import { Building2, ShoppingBag, Store, Warehouse } from "lucide-react";
import { demoAgenda, workflowNodes } from "@/lib/content/contact/contact-content";
import styles from "@/components/pages/contact/contact.module.css";

const nodeIcons = {
  warehouse: Warehouse,
  hq: Building2,
  store: Store,
  franchise: ShoppingBag,
} as const;

/**
 * The hero's visual anchor.
 *
 * A vector illustration rather than a dashboard screenshot: it carries no
 * invented KPI figures, adds zero image bytes to LCP, and stays sharp at any
 * density. The connecting line draws itself once on load.
 */
export function SessionCard() {
  return (
    <div className={styles.contact__sessionCard}>
      <div className={styles.contact__sessionVisual}>
        <p className={styles.contact__sessionKicker}>The chain we walk through</p>
        <div className={styles.contact__flow}>
          <svg
            className={styles.contact__flowLine}
            viewBox="0 0 300 2"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <line x1="0" y1="1" x2="300" y2="1" className={styles.contact__flowTrack} />
            <line x1="0" y1="1" x2="300" y2="1" className={styles.contact__flowDraw} />
          </svg>
          {workflowNodes.map((node, index) => {
            const Icon = nodeIcons[node.icon];
            return (
              <span
                className={styles.contact__flowNode}
                key={node.id}
                style={{ "--i": index } as React.CSSProperties}
              >
                <span className={styles.contact__flowGlyph} aria-hidden="true">
                  <Icon size={17} strokeWidth={1.7} />
                </span>
                <span className={styles.contact__flowLabel}>{node.label}</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className={styles.contact__sessionAgenda}>
        <div className={styles.contact__sessionHead}>
          <h2 id="agenda-title">{demoAgenda.title}</h2>
          <span className={styles.contact__sessionBadge}>30 min</span>
        </div>
        <ol>
          {demoAgenda.items.map((item, index) => (
            <li key={item.title} style={{ "--i": index } as React.CSSProperties}>
              <span className={styles.contact__agendaTime}>{item.duration}</span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.body}</small>
              </span>
            </li>
          ))}
        </ol>
        <p className={styles.contact__agendaNote}>{demoAgenda.note}</p>
      </div>
    </div>
  );
}
