import Link from "next/link";
import type { ConstellationNode } from "@/lib/content/modules/modules-index";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * One module in the constellation. It is a link, matching how the module list
 * below already routes to /modules/[slug] — no new route, no modal.
 */
export function ModuleNode({
  node,
  index,
}: {
  node: ConstellationNode;
  index: number;
}) {
  const Icon = node.icon;
  return (
    <span
      className={styles.modulesHero__nodeOrbitSlot}
      style={
        {
          "--left": `${node.left}%`,
          "--top": `${node.top}%`,
          "--i": index,
        } as React.CSSProperties
      }
    >
      <Link
        href={`/modules/${node.slug}`}
        className={styles.modulesHero__node}
        data-tier={node.tier}
        data-slug={node.slug}
        style={
          {
            "--accent": node.accent,
            "--accent-dark": node.accentDark,
          } as React.CSSProperties
        }
      >
        <span className={styles.modulesHero__nodeIcon} aria-hidden="true">
          <Icon size={17} strokeWidth={1.9} />
        </span>
        <span className={styles.modulesHero__nodeTitle}>{node.title}</span>
      </Link>
    </span>
  );
}
