import { ArrowRight, Circle, Code2, Server } from "lucide-react";
import styles from "@/components/pages/product/product.module.css";

const roadmapConcepts = [
  "RESTful APIs",
  "Webhooks",
  "Events",
  "Data access",
  "Automation",
  "Developer friendly",
];

export function ApiLane() {
  return (
    <article
      className={`${styles.integrationSurface__lane} ${styles.integrationSurface__apiLane}`}
      aria-labelledby="api-lane-title"
    >
      <div className={styles.integrationSurface__laneTop}>
        <div className={styles.integrationSurface__laneStatus} style={{ color: "#64748b" }}>
          <span
            className={`${styles.integrationSurface__statusDot} ${styles.integrationSurface__statusDotComingSoon}`}
            aria-hidden="true"
          />
          <span>Coming soon</span>
        </div>

        <h3
          id="api-lane-title"
          className={`${styles.integrationSurface__laneTitle} ${styles.integrationSurface__apiLaneTitle}`}
        >
          APIs
        </h3>

        <p className={`${styles.integrationSurface__laneDescription} ${styles.integrationSurface__apiDescription}`}>
          A future integration surface to extend, automate and connect the tools
          you rely on.
        </p>

        {/* Roadmap Concepts — rendered as outlined future items */}
        <div className={styles.integrationSurface__capabilitiesGrid}>
          {roadmapConcepts.map((item) => (
            <div
              key={item}
              className={`${styles.integrationSurface__capabilityItem} ${styles.integrationSurface__apiCapabilityItem}`}
            >
              <Circle
                className={`${styles.integrationSurface__checkIcon} ${styles.integrationSurface__checkApi}`}
                size={11}
                aria-hidden="true"
              />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Flow & Honest Scope Statement */}
      <div className={styles.integrationSurface__laneBottom}>
        <div
          className={`${styles.integrationSurface__miniFlow} ${styles.integrationSurface__apiMiniFlow}`}
          aria-label="Planned Flow: Your System to API to Bizonix"
        >
          <div
            className={`${styles.integrationSurface__miniFlowNode} ${styles.integrationSurface__apiMiniFlowNode}`}
          >
            <Server size={14} className="text-slate-500" aria-hidden="true" />
            <span>Your system</span>
          </div>

          <div className={styles.integrationSurface__miniFlowConnector} aria-hidden="true">
            <div
              className={`${styles.integrationSurface__miniFlowLine} ${styles.integrationSurface__miniFlowLineDashed}`}
            />
            <ArrowRight size={12} className="text-slate-400 ml-1 flex-shrink-0" />
          </div>

          <div
            className={`${styles.integrationSurface__miniFlowNode} ${styles.integrationSurface__apiMiniFlowNode}`}
          >
            <Code2 size={13} className="text-slate-500" aria-hidden="true" />
            <span>API</span>
          </div>

          <div className={styles.integrationSurface__miniFlowConnector} aria-hidden="true">
            <div
              className={`${styles.integrationSurface__miniFlowLine} ${styles.integrationSurface__miniFlowLineDashed}`}
            />
            <ArrowRight size={12} className="text-slate-400 ml-1 flex-shrink-0" />
          </div>

          <div
            className={`${styles.integrationSurface__miniFlowNode} ${styles.integrationSurface__apiMiniFlowNode}`}
          >
            <span className="font-extrabold text-slate-700">Bizonix</span>
          </div>
        </div>

        <div className={styles.integrationSurface__laneStatusCopy}>
          <span
            className={`${styles.integrationSurface__statusLinePrimary} ${styles.integrationSurface__apiStatusLinePrimary}`}
          >
            APIs coming soon.
          </span>
          <span
            className={`${styles.integrationSurface__statusLineSecondary} ${styles.integrationSurface__apiStatusLineSecondary}`}
          >
            Built with an honest roadmap and real scope.
          </span>
        </div>
      </div>
    </article>
  );
}
