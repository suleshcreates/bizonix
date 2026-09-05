import { industries } from "@/lib/content/industries/industries";
import type { IndustryId } from "@/lib/content/industries/industries";
import { industryModuleMap } from "@/lib/content/industries/industry-module-map";
import { ecosystemModules } from "@/lib/content/industries/module-data";
import styles from "@/components/pages/industries/industries.module.css";

export function ModuleMappingPanel({ activeId }: { activeId: IndustryId }) {
  const industry = industries.find((item) => item.id === activeId);
  const mapping = industryModuleMap.find(
    (entry) => entry.industryId === activeId
  );
  const mapped = (mapping?.modules ?? []).flatMap((entry) => {
    const found = ecosystemModules.find((item) => item.slug === entry.slug);
    return found ? [found] : [];
  });

  return (
    <div className={styles.howBizonixFits__panel}>
      <p className={styles.howBizonixFits__panelTitle}>
        Modules that matter
        <span>for each industry</span>
      </p>
      <p className={styles.howBizonixFits__panelSubline} aria-live="polite">
        {industry?.name}
      </p>
      <ul className={styles.howBizonixFits__panelList}>
        {mapped.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.slug}>
              <Icon size={14} strokeWidth={2.1} aria-hidden="true" />
              <span>{item.title}</span>
            </li>
          );
        })}
      </ul>
      <p className={styles.howBizonixFits__panelFoot}>
        {mapped.length} of {ecosystemModules.length} modules
      </p>
    </div>
  );
}
