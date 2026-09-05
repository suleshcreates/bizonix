"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  exploreAllModulesRoute,
  showcaseModules,
  type ShowcaseModule,
} from "@/lib/content/modules/modules";
import { ButtonLink } from "@/components/ui/button";
import { calculateOrbitPositions, orbitPosition } from "./orbit-geometry";
import styles from "@/components/pages/home/home.module.css";

gsap.registerPlugin(ScrollTrigger);

const DEBUG_MODULE_ORBIT =
  process.env.NEXT_PUBLIC_DEBUG_MODULE_ORBIT === "true";

/** Above this the core stage is an ellipse; below it, a grid (see the CSS). */
const RADIAL_ORBIT_QUERY = "(min-width: 701px)";

const visualOrder = [
  "inventory",
  "wholesale",
  "sales-pos",
  "franchise",
  "accounting",
  "analytics",
  "procurement",
  "ecommerce",
  "security",
] as const;
const modulesBySlug = new Map(
  showcaseModules.map((module) => [module.slug, module]),
);
const displayModules = visualOrder
  .slice(0, 6)
  .map((slug) => modulesBySlug.get(slug)!);

function ModuleShowcaseCTA() {
  return (
    <div className={styles.moduleShowcase__ctaGroup} data-orbit-cta>
      <ButtonLink
        href={exploreAllModulesRoute}
        className={styles.moduleShowcase__primaryCta}
      >
        Explore All Modules <ArrowRight size={16} aria-hidden="true" />
      </ButtonLink>
    </div>
  );
}

function ModuleShowcaseIntro() {
  return (
    <header className={styles.moduleShowcase__header} data-orbit-header>
      <span className={styles.moduleShowcase__eyebrow}>
        <i /> Our modules <i />
      </span>
      <h2 id="module-showcase-title" className={styles.moduleShowcase__title}>
        Everything you need, <br />
        in one <em>powerful system</em>
      </h2>
      <p>
        Integrated modules. Connected workflow. <br />
        Complete control across your entire business.
      </p>
    </header>
  );
}

function ModuleOperatingVisual() {
  return (
    <div
      className={styles.moduleShowcase__coreStage}
      data-orbit-stage
      aria-label="Bizonix Operating Core connects every module"
    >
      <span
        className={`${styles.moduleShowcase__orbit} ${styles.moduleShowcase__orbitOuter}`}
        aria-hidden="true"
      />
      <span
        className={`${styles.moduleShowcase__orbit} ${styles.moduleShowcase__orbitMiddle}`}
        aria-hidden="true"
      />
      <span
        className={`${styles.moduleShowcase__orbit} ${styles.moduleShowcase__orbitInner}`}
        aria-hidden="true"
      />
      <span className={styles.moduleShowcase__orbitAxis} aria-hidden="true" />
      {showcaseModules.map(({ title, icon: Icon }, index) => (
        <span
          className={styles.moduleShowcase__orbitNode}
          data-orbit-node
          data-position={index + 1}
          key={title}
        >
          <i>
            <Icon size={18} strokeWidth={2} aria-hidden="true" />
          </i>
          <small>{title}</small>
        </span>
      ))}
      <div className={styles.moduleShowcase__coreContent} data-orbit-core>
        <div className={styles.moduleShowcase__coreLogo}>
          <Image
            src="/images/shared/brand/icon.svg"
            alt="Bizonix"
            width={78}
            height={78}
          />
        </div>
        <div className={styles.moduleShowcase__coreCaption}>
          <strong>Bizonix Operating Core</strong>
          <span>Unified. Connected. Intelligent.</span>
          <small>One operating truth.</small>
        </div>
      </div>
    </div>
  );
}

function ModuleMetric({ module }: { module: ShowcaseModule }) {
  if (!module.metric) {
    return (
      <span className={styles.moduleShowcase__exploreLabel}>
        Explore module <ArrowRight size={14} aria-hidden="true" />
      </span>
    );
  }
  return (
    <div className={styles.moduleShowcase__metric}>
      <span>
        <small>{module.metric.label}</small>
        <strong>{module.metric.value}</strong>
      </span>
      {module.metric.delta ? <b>{module.metric.delta} ↗</b> : null}
      {module.metric.chart === "trend" ? (
        <svg viewBox="0 0 60 28" aria-hidden="true">
          <path d="M2 24 13 16 23 20 34 9 43 13 57 2" />
        </svg>
      ) : null}
      {module.metric.chart === "bars" ? (
        <BarChart3 size={28} aria-hidden="true" />
      ) : null}
      {module.metric.chart === "people" ? (
        <span className={styles.moduleShowcase__people} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      ) : null}
    </div>
  );
}

function ModuleCard({ module }: { module: ShowcaseModule }) {
  return (
    <article
      className={styles.moduleShowcase__card}
      style={{ "--accent": module.accent } as React.CSSProperties}
      data-module-card
    >
      <div className={styles.moduleShowcase__photo}>
        <Image
          src={module.image}
          alt={module.imageAlt}
          fill
          sizes="(max-width: 700px) 42vw, (max-width: 1120px) 34vw, 180px"
        />
      </div>
      <div className={styles.moduleShowcase__panel}>
        <div className={styles.moduleShowcase__cardHeading}>
          <span>{module.number}</span>
          <h3>{module.title}</h3>
        </div>
        <p>{module.description}</p>
        <ModuleMetric module={module} />
      </div>
      <Link
        className={styles.moduleShowcase__cardLink}
        href={module.route}
        aria-label={`Explore ${module.title}`}
      >
        <span className={styles.moduleShowcase__srOnly}>
          Explore {module.title}
        </span>
      </Link>
    </article>
  );
}

function ModuleGrid() {
  return (
    <div className={styles.moduleShowcase__moduleGrid} data-module-grid>
      {displayModules.map((module) => (
        <ModuleCard key={module.slug} module={module} />
      ))}
    </div>
  );
}

function MobileModuleNavigation() {
  return (
    <nav
      className={styles.moduleShowcase__mobileNav}
      aria-label="Explore Bizonix modules"
      data-mobile-reveal
    >
      {showcaseModules.map((module) => {
        const Icon = module.icon;
        return (
          <Link
            key={module.slug}
            href={module.route}
            className={styles.moduleShowcase__mobileNavItem}
          >
            <span className={styles.moduleShowcase__mobileNavIcon}>
              <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
            </span>
            <span>{module.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function MobileModuleCard({
  module,
  storyNumber,
}: {
  module: ShowcaseModule;
  storyNumber: string;
}) {
  return (
    <article
      className={styles.moduleShowcase__mobileCard}
      style={{ "--accent": module.accent } as React.CSSProperties}
      data-mobile-reveal
    >
      <div className={styles.moduleShowcase__mobilePhoto}>
        <Image
          src={module.image}
          alt={module.imageAlt}
          fill
          sizes="(max-width: 700px) 43vw, 1px"
        />
      </div>
      <div className={styles.moduleShowcase__mobilePanel}>
        <div className={styles.moduleShowcase__mobileHeading}>
          <span>{storyNumber}</span>
          <h3>{module.title}</h3>
          <ChevronRight size={18} strokeWidth={2.3} aria-hidden="true" />
        </div>
        <p>{module.description}</p>
        <ModuleMetric module={module} />
      </div>
      <Link
        className={styles.moduleShowcase__cardLink}
        href={module.route}
        aria-label={`Explore ${module.title}`}
      >
        <span className={styles.moduleShowcase__srOnly}>
          Explore {module.title}
        </span>
      </Link>
    </article>
  );
}

function MobileModuleHub() {
  return (
    <div className={styles.moduleShowcase__mobileHub}>
      <header className={styles.moduleShowcase__mobileHeader}>
        <span className={styles.moduleShowcase__eyebrow} data-mobile-reveal>
          <i /> Our modules <i />
        </span>
        <h2 className={styles.moduleShowcase__mobileTitle} data-mobile-reveal>
          Everything you need,
          <br />
          in one <em>powerful system.</em>
        </h2>
        <p data-mobile-reveal>
          Integrated modules. Connected workflow. Complete control across your
          entire business.
        </p>
      </header>

      <MobileModuleNavigation />

      <div className={styles.moduleShowcase__mobileStories}>
        {displayModules.map((module, index) => (
          <MobileModuleCard
            key={module.slug}
            module={module}
            storyNumber={String(index + 1).padStart(2, "0")}
          />
        ))}
      </div>

      <div className={styles.moduleShowcase__mobileCta} data-mobile-reveal>
        <ModuleShowcaseCTA />
      </div>
    </div>
  );
}
export function ModuleShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-module-card]",
        section,
      );
      const mobileReveals = gsap.utils.toArray<HTMLElement>(
        "[data-mobile-reveal]",
        section,
      );
      const orbitNodes = gsap.utils.toArray<HTMLElement>(
        "[data-orbit-node]",
        section,
      );
      const coreStage = section.querySelector<HTMLElement>(
        `.${styles.moduleShowcase__coreStage}`,
      );
      const coreContent =
        section.querySelector<HTMLElement>("[data-orbit-core]");

      const positionOrbit = () => {
        if (!coreStage || !coreContent || orbitNodes.length !== 9) return;
        // Below the radial breakpoint the stage is a grid, not an ellipse:
        // the solve has no stage to solve against, and any inline placement
        // it left behind has to be cleared.
        if (!window.matchMedia(RADIAL_ORBIT_QUERY).matches) {
          orbitNodes.forEach((node) => node.removeAttribute("style"));
          return;
        }
        const nodeWidth = Math.max(
          ...orbitNodes.map((node) => node.offsetWidth),
        );
        const nodeHeight = Math.max(
          ...orbitNodes.map((node) => node.offsetHeight),
        );
        const geometry = calculateOrbitPositions({
          containerWidth: coreStage.clientWidth,
          containerHeight: coreStage.clientHeight,
          centerX: coreContent.offsetLeft + coreContent.offsetWidth / 2,
          centerY: coreContent.offsetTop + coreContent.offsetHeight / 2,
          coreWidth: coreContent.offsetWidth,
          coreHeight: coreContent.offsetHeight,
          nodeWidth,
          nodeHeight,
          moduleCount: orbitNodes.length,
          startAngle: -90,
          radiusYFactor: 0.88,
          moduleGap: 12,
          coreGap: 40,
          edgeMargin: 8,
        });

        coreStage.style.setProperty(
          "--orbit-center-x",
          `${geometry.centerX}px`,
        );
        coreStage.style.setProperty(
          "--orbit-center-y",
          `${geometry.centerY}px`,
        );
        coreStage.style.setProperty(
          "--orbit-radius-x",
          `${geometry.radiusX}px`,
        );
        coreStage.style.setProperty(
          "--orbit-radius-y",
          `${geometry.radiusY}px`,
        );
        orbitNodes.forEach((node, index) => {
          const point = orbitPosition(
            { ...geometry, slice: 360 / orbitNodes.length },
            index,
            0,
          );
          node.style.left = "0";
          node.style.top = "0";
          node.style.transform = `translate3d(${point.x - node.offsetWidth / 2}px, ${point.y - node.offsetHeight / 2}px, 0)`;
        });

        if (process.env.NODE_ENV !== "production") {
          coreStage.dataset.orbitDebug = DEBUG_MODULE_ORBIT ? "true" : "false";
          coreStage.dataset.orbitGeometry = JSON.stringify({
            centerX: geometry.centerX,
            centerY: geometry.centerY,
            radiusX: geometry.radiusX,
            radiusY: geometry.radiusY,
            coreWidth: coreContent.offsetWidth,
            coreHeight: coreContent.offsetHeight,
            nodeCount: orbitNodes.length,
          });
        }
      };

      positionOrbit();
      window.addEventListener("resize", positionOrbit);

      const media = gsap.matchMedia();
      media.add(
        "(min-width: 701px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(cards, { autoAlpha: 0, y: 32 });
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              end: "center 42%",
              scrub: 0.65,
            },
          });
          timeline.to(cards, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.115,
            duration: 0.22,
            ease: "power2.out",
          });
          return () => {
            timeline.scrollTrigger?.kill();
          };
        },
      );
      media.add(
        "(max-width: 700px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(mobileReveals, { autoAlpha: 0, y: 8 });
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 84%",
              toggleActions: "play none none none",
            },
          });
          timeline.to(mobileReveals, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.07,
            duration: 0.38,
            ease: "power2.out",
          });
          return () => timeline.scrollTrigger?.kill();
        },
      );

      return () => {
        window.removeEventListener("resize", positionOrbit);
        orbitNodes.forEach((node) => node.removeAttribute("style"));
      };
    }, section);
    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.moduleShowcase__section}
      aria-label="Bizonix modules"
    >
      <div className={styles.moduleShowcase__backdrop} aria-hidden="true" />
      <div className={styles.moduleShowcase__shell}>
        <div className={styles.moduleShowcase__desktop}>
          <div className={styles.moduleShowcase__composition}>
            <div className={styles.moduleShowcase__storyColumn}>
              <ModuleShowcaseIntro />
              <ModuleOperatingVisual />
            </div>
            <ModuleGrid />
          </div>
          <ModuleShowcaseCTA />
        </div>
        <MobileModuleHub />
      </div>
    </section>
  );
}
