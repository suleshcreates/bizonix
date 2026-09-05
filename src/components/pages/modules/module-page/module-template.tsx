import type { ModuleData } from "@/lib/content/modules/module-pages/types";
import { ModuleMotion } from "./module-motion";
import styles from "@/components/pages/modules/modules.module.css";
import type { Crumb } from "./parts/breadcrumbs";
import { ModuleCapabilities } from "./parts/module-capabilities";
import { ModuleCta } from "./parts/module-cta";
import { ModuleFaq } from "./parts/module-faq";
import { ModuleGallery } from "./parts/module-gallery";
import { ModuleHero } from "./parts/module-hero";
import { ModuleOutcomes } from "./parts/module-outcomes";
import { ModuleProblems } from "./parts/module-problems";
import { ModuleProof } from "./parts/module-proof";
import { ModuleRelevance } from "./parts/module-relevance";
import { ModuleVideo } from "./parts/module-video";
import { ModuleWorkflow } from "./parts/module-workflow";
import { RelatedModules } from "./parts/related-modules";

/**
 * The universal module renderer.
 *
 * Every module page in the site is this component with different data. There
 * is deliberately no `if (slug === …)` anywhere below: visual differences come
 * from `theme`, `hero.visualVariant`, `workflow.variant` and `gallery.variant`,
 * all of which are data.
 *
 * Section order is the SRS sequence and is fixed:
 *   1 hero · 2 problem · 3 outcomes · 4 capabilities · 5 workflow ·
 *   6 screenshot gallery · 7 vertical relevance · 8 proof · 9 video ·
 *   10 FAQ · 11 related modules · 12 final CTA.
 *
 * The four supporting beats —
 * vertical relevance, proof, video and (through its own guard) the limitations
 * block — render only when approved content exists for them, which is how the
 * page stays honest without the architecture changing shape per module.
 *
 * Only three sections ship as client components: the workflow (scroll scrub),
 * the gallery (screen selection) and the FAQ (disclosure). Everything else
 * renders on the server.
 */
export function ModuleTemplate({ data }: { data: ModuleData }) {
  const trail: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Solutions", href: "/modules" },
    { label: data.title },
  ];

  return (
    <div
      className={styles.modulePage__page}
      data-module-page={data.slug}
      style={
        {
          "--accent": data.theme.accent,
          "--accent-dark": data.theme.accentDark,
          "--accent-soft": data.theme.accentSoft,
        } as React.CSSProperties
      }
    >
      <ModuleMotion />

      <ModuleHero data={data} trail={trail} />
      <ModuleProblems data={data.problemSection} />
      <ModuleOutcomes data={data.outcomesSection} />
      <ModuleCapabilities
        capabilities={data.capabilities}
        moduleTitle={data.title}
      />
      <ModuleWorkflow workflow={data.workflow} />
      <ModuleGallery gallery={data.gallery} moduleSlug={data.slug} />
      {data.verticalRelevance ? (
        <ModuleRelevance
          relevance={data.verticalRelevance}
          moduleTitle={data.title}
        />
      ) : null}
      {data.proof ? <ModuleProof proof={data.proof} /> : null}
      {data.video ? (
        <ModuleVideo video={data.video} moduleSlug={data.slug} />
      ) : null}
      <ModuleFaq faq={data.faq} moduleTitle={data.title} moduleSlug={data.slug} />
      <RelatedModules
        related={data.relatedModules}
        moduleTitle={data.title}
        moduleSlug={data.slug}
      />
      <ModuleCta
        moduleTitle={data.title}
        moduleSlug={data.slug}
        outcome={data.outcome}
      />
    </div>
  );
}
