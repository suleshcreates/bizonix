import { ArrowUpRight, Box, Gem, Network, Shirt } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  moduleContextData,
  type ModuleContextKey,
} from "@/lib/content/modules/module-pages/module-context-data";
import type {
  ModuleSlug,
  VerticalRelevance,
} from "@/lib/content/modules/module-pages/types";
import { ModuleHeading } from "./module-heading";
import styles from "@/components/pages/modules/modules.module.css";

type ContextPresentation = {
  label: string;
  image: string;
  imageAlt: string;
  href: string;
  icon: LucideIcon;
};

const contextPresentation: Record<ModuleContextKey, ContextPresentation> = {
  apparel: {
    label: "Apparel & footwear",
    image: "/images/industries/pains/apparel-detail.webp",
    imageAlt: "Apparel rail representing a size and colour based operation.",
    href: "/industries/apparel-footwear",
    icon: Shirt,
  },
  jewellery: {
    label: "Imitation jewellery",
    image: "/images/industries/pains/jewellery-detail.webp",
    imageAlt:
      "Imitation jewellery assortment representing a design-rich operation.",
    href: "/industries/imitation-jewellery",
    icon: Gem,
  },
  franchise: {
    label: "Franchise networks",
    image: "/images/industries/pains/franchise-detail.webp",
    imageAlt: "Retail outlet representing a distributed franchise operation.",
    href: "/industries/franchise-networks",
    icon: Network,
  },
};

export function ModuleContextSection({
  moduleSlug,
  moduleTitle,
  relevance,
}: {
  moduleSlug: ModuleSlug | string;
  moduleTitle: string;
  relevance: VerticalRelevance;
}) {
  const data = moduleContextData[moduleSlug as ModuleSlug] || moduleContextData.inventory;

  return (
    <section
      className={styles.moduleContexts}
      aria-labelledby="module-contexts-title"
    >
      <div className={styles.modulePage__shell}>
        <div className={styles.moduleContexts__intro}>
          <div className={styles.moduleContexts__copy}>
            <p className={styles.modulePage__eyebrow} data-reveal>
              <span
                className={styles.modulePage__eyebrowDot}
                aria-hidden="true"
              />
              Where it matters
            </p>
            <ModuleHeading
              id="module-contexts-title"
              text={data.heading}
              accent={data.headingAccent}
            />
            <p className={styles.moduleContexts__lede} data-reveal>
              {data.intro}
            </p>
          </div>

          <div
            className={styles.moduleContexts__rail}
            aria-label={moduleTitle + " operating contexts"}
            data-reveal
          >
            <div
              className={styles.moduleContexts__railLine}
              aria-hidden="true"
            />
            {data.contexts.map((context, index) => {
              const presentation = contextPresentation[context.key];
              const Icon = presentation.icon;

              return (
                <div
                  className={styles.moduleContexts__node}
                  key={context.key}
                  data-reveal
                >
                  <span className={styles.moduleContexts__nodeIcon}>
                    <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <strong>
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, "0")} ·{" "}
                    </span>
                    {context.title}
                  </strong>
                  <small>{context.microLabel}</small>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.moduleContexts__cards}>
          {data.contexts.map((context, index) => {
            const presentation = contextPresentation[context.key];
            const description = relevance[context.key];
            const Icon = presentation.icon;

            if (!description) return null;

            return (
              <Link
                className={styles.moduleContexts__card}
                href={presentation.href}
                key={context.key}
                data-reveal
              >
                <div className={styles.moduleContexts__imageWrap}>
                  <Image
                    src={presentation.image}
                    alt={presentation.imageAlt}
                    fill
                    sizes="(max-width: 899px) calc(100vw - 40px), (max-width: 1280px) 31vw, 390px"
                    className={styles.moduleContexts__image}
                  />
                  <span className={styles.moduleContexts__number}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.moduleContexts__indicator}>
                    <small>{context.indicatorLabel}</small>
                    <strong>{context.indicatorValue}</strong>
                  </span>
                </div>

                <div className={styles.moduleContexts__cardBody}>
                  <div className={styles.moduleContexts__titleRow}>
                    <span className={styles.moduleContexts__cardIcon}>
                      <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <h3>{presentation.label}</h3>
                  </div>
                  <p>{description}</p>
                  <span className={styles.moduleContexts__cta}>
                    See how it works
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className={styles.moduleContexts__footer} data-reveal>
          <span aria-hidden="true" />
          <p>
            <Box size={16} aria-hidden="true" />
            {data.statement}
          </p>
          <span aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
