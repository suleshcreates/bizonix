"use client";

import {
  Clock,
  Copy,
  MapPin,
  MessageSquareOff,
  ScanBarcode,
  Search,
} from "lucide-react";
import styles from "./challenges-section.module.css";

const challengeItems = [
  {
    number: "01",
    tag: "24 hours blind",
    title: "Visibility arrives late",
    description:
      "By the time spreadsheets reconcile, yesterday's stock decisions have already aged.",
    icon: Clock,
    stat: "T+24H delay",
    statAlert: true,
    positionClass: styles.point1,
  },
  {
    number: "02",
    tag: "1,248 here · 0 there",
    title: "Stock exists—but not where needed",
    description:
      "Warehouse totals hide store-level gaps, variants and sell-through.",
    icon: MapPin,
    stat: "1,248 vs 0",
    statAlert: false,
    positionClass: styles.point2,
  },
  {
    number: "03",
    tag: "Order never entered",
    title: "Franchise orders drift off-system",
    description:
      "Calls and chat threads turn allocation into guesswork.",
    icon: MessageSquareOff,
    stat: "Untracked chat",
    statAlert: true,
    positionClass: styles.point3,
  },
  {
    number: "04",
    tag: "₹30K unexplained",
    title: "Month-end becomes detective work",
    description:
      "Sales, returns, receipts and transfers do not meet in one ledger.",
    icon: Search,
    stat: "₹30K mismatch",
    statAlert: true,
    positionClass: styles.point4,
  },
  {
    number: "05",
    tag: "Same data. Typed twice.",
    title: "GST context gets re-entered",
    description:
      "Operational documents and accounting records fall out of sync.",
    icon: Copy,
    stat: "Duplicate risk",
    statAlert: true,
    positionClass: styles.point5,
  },
  {
    number: "06",
    tag: "The return has no memory",
    title: "Piece identity disappears",
    description:
      "Without barcode truth, returns and transfers lose traceability.",
    icon: ScanBarcode,
    stat: "Unknown piece",
    statAlert: true,
    positionClass: styles.point6,
  },
] as const;

export function ChallengesSection() {
  return (
    <section id="challenges" className={styles.section} aria-labelledby="challenges-title">
      <div className={styles.shell}>
        {/* Section Heading */}
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>
              When disconnected tools stop scaling
            </span>
            <h2 id="challenges-title" className={styles.title}>
              Why brands outgrow spreadsheets.
            </h2>
          </div>
          <p className={styles.subtitle}>
            The problem is rarely one missing report. It is the delay between
            what happened on the floor and what the business believes happened.
          </p>
        </div>

        {/* Desktop Blueprint Radial Constellation */}
        <div className={styles.blueprint}>
          <div className={styles.topbar}>
            <span className={styles.topbarStatus}>
              <i className={styles.statusDot} /> Floor reality
            </span>
            <strong className={styles.topbarTitle}>
              Disconnected Operating Loop
            </strong>
            <span className={styles.topbarStatus}>
              <i className={styles.statusDotWarning} /> Spreadsheet delay
            </span>
          </div>

          <div className={styles.canvasArea}>
            {/* SVG Connector Orbits with Arrowheads */}
            <svg
              className={styles.orbitsSvg}
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
                  <path
                    d="M 1 2 L 7 5 L 1 8 z"
                    fill="rgba(47, 107, 255, 0.65)"
                  />
                </marker>
              </defs>

              {/* 01: Top-Left */}
              <path
                className={styles.orbitPath}
                d="M 520 320 C 460 250 420 180 365 145"
                markerEnd="url(#hub-arrow)"
              />
              {/* 02: Top-Right */}
              <path
                className={styles.orbitPath}
                d="M 680 320 C 740 250 780 180 835 145"
                markerEnd="url(#hub-arrow)"
              />
              {/* 03: Mid-Left */}
              <path
                className={styles.orbitPath}
                d="M 480 400 C 430 400 395 400 355 400"
                markerEnd="url(#hub-arrow)"
              />
              {/* 04: Mid-Right */}
              <path
                className={styles.orbitPath}
                d="M 720 400 C 770 400 805 400 845 400"
                markerEnd="url(#hub-arrow)"
              />
              {/* 05: Bottom-Left */}
              <path
                className={styles.orbitPath}
                d="M 520 480 C 460 550 420 620 365 655"
                markerEnd="url(#hub-arrow)"
              />
              {/* 06: Bottom-Right */}
              <path
                className={styles.orbitPath}
                d="M 680 480 C 740 550 780 620 835 655"
                markerEnd="url(#hub-arrow)"
              />
            </svg>

            {/* Central Hub */}
            <div className={styles.centerHub} aria-hidden="true">
              <span className={styles.hubEyebrow}>Shared context</span>
              <strong className={styles.hubTitle}>Lost between systems</strong>
            </div>

            {/* 6 Symmetrical Evidence Points */}
            {challengeItems.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.number}
                  className={`${styles.radialPoint} ${item.positionClass}`}
                >
                  <div className={styles.pointHeader}>
                    <span className={styles.badgeNumber}>{item.number}</span>
                    <strong className={styles.microTag}>{item.tag}</strong>
                  </div>

                  <div className={styles.pointVisualRow}>
                    <div className={styles.iconBadge}>
                      <Icon size={24} />
                    </div>
                    {item.stat && (
                      <span
                        className={`${styles.statPill} ${
                          item.statAlert ? styles.statPillAlert : ""
                        }`}
                      >
                        {item.stat}
                      </span>
                    )}
                  </div>

                  <h3 className={styles.pointTitle}>{item.title}</h3>
                  <p className={styles.pointDescription}>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Mobile Fallback (< 960px): Clean Vertical Card Stack */}
        <div className={styles.mobileStack}>
          {challengeItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={`mob-${item.number}`} className={styles.mobileCard}>
                <div className={styles.mobileCardHeader}>
                  <div className={styles.mobileHeaderLeft}>
                    <span className={styles.badgeNumber}>{item.number}</span>
                    <strong className={styles.microTag}>{item.tag}</strong>
                  </div>
                  <div className={styles.iconBadge} style={{ width: 44, height: 44 }}>
                    <Icon size={20} />
                  </div>
                </div>

                <div className={styles.mobileBody}>
                  <h3 className={styles.pointTitle}>{item.title}</h3>
                  <p className={styles.pointDescription}>{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
