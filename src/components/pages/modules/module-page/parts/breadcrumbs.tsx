import { ChevronRight } from "lucide-react";
import Link from "next/link";
import styles from "@/components/pages/modules/modules.module.css";

export type Crumb = { label: string; href?: string };

/**
 * Semantic breadcrumb. The last entry is the current page and is not a link,
 * which is what lets `aria-current` carry meaning for assistive technology.
 * The matching BreadcrumbList schema is emitted by the route, from the same
 * array, so the markup and the structured data cannot drift apart.
 */
export function Breadcrumbs({ trail }: { trail: readonly Crumb[] }) {
  return (
    <nav className={styles.modulePage__crumbs} aria-label="Breadcrumb">
      <ol>
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={crumb.label}>
              {crumb.href && !last ? (
                <Link href={crumb.href}>{crumb.label}</Link>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
              {last ? null : <ChevronRight size={13} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
