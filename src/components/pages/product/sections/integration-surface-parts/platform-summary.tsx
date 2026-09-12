import { RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "@/components/pages/product/product.module.css";

/**
 * What the connected surface amounts to, and the one way out of the section.
 *
 * Three outcomes on one shared surface rather than three cards — the vertical
 * hairlines are the only separation, so the group reads as one statement. The
 * action is the section's only call to action; the header owns every other
 * route on the page.
 */

const benefits: {
  id: string;
  icon: LucideIcon;
  title: string;
  body: string;
  tone: "blue" | "violet" | "teal";
}[] = [
  {
    id: "sync",
    icon: RefreshCw,
    title: "Sync",
    body: "Keep everything\nin real time",
    tone: "blue",
  },
  {
    id: "automate",
    icon: Sparkles,
    title: "Automate",
    body: "Reduce manual\nwork",
    tone: "violet",
  },
  {
    id: "grow",
    icon: TrendingUp,
    title: "Grow",
    body: "Uncover new\nopportunities",
    tone: "teal",
  },
];

export function PlatformSummary() {
  return (
    <div className={styles.integrationSurface__summary}>
      <p className={styles.integrationSurface__summaryDivider}>
        <span>All in one platform</span>
      </p>

      <ul className={styles.integrationSurface__benefits}>
        {benefits.map(({ id, icon: Icon, title, body, tone }) => (
          <li key={id} data-tone={tone}>
            <span
              className={styles.integrationSurface__benefitBadge}
              aria-hidden="true"
            >
              <Icon
                size={20}
                strokeWidth={1.9}
                className={styles.integrationSurface__benefitIcon}
              />
            </span>
            <span className={styles.integrationSurface__benefitTitle}>
              {title}
            </span>
            <span className={styles.integrationSurface__benefitBody}>
              {body}
            </span>
          </li>
        ))}
      </ul>

      <Link href="/contact" className={styles.integrationSurface__summaryAction}>
        See how it works
        <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
      </Link>
    </div>
  );
}
