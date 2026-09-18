"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Camera, CircleSlash2, MoveHorizontal } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";
import { trackModuleEvent } from "@/lib/analytics";
import { galleryFrameAspect } from "@/lib/content/modules/module-pages/frame-geometry";
import type {
  ModuleGallery as Gallery,
  ModuleScreenshot,
} from "@/lib/content/modules/module-pages/types";
import { getProductScreen } from "@/lib/content/modules/module-pages/product-screens";
import { ModuleHeading } from "./module-heading";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * The screenshot gallery.
 *
 * Three things this component refuses to do: invent an image for a screen that
 * has not been captured, place an annotation on anything but a real capture,
 * and put a caption on a frame that the caption is not describing. A `pending`
 * shot renders a labelled placeholder — visible enough to be honest, quiet
 * enough not to compete with the real screens beside it.
 *
 * Annotation pins are decorative markers; the same numbers are repeated in a
 * legend below, so the information never depends on seeing a coloured dot in
 * the right place.
 */

function ShotFrame({
  shot,
  moduleSlug,
}: {
  shot: ModuleScreenshot;
  moduleSlug: string;
}) {
  if (shot.state === "pending") {
    return (
      <div
        className={`${styles.modulePage__shotViewport} ${styles.modulePage__pending}`}
      >
        <span className={styles.modulePage__pendingBadge}>
          <CircleSlash2 size={12} aria-hidden="true" />
          Content pending
        </span>
        <p className={styles.modulePage__pendingTitle}>{shot.title}</p>
        <p className={styles.modulePage__pendingBody}>
          {shot.description} This screen has not been captured for the website
          yet, so nothing is shown in its place.
        </p>
      </div>
    );
  }

  const screen = getProductScreen(shot.screen);
  const aspect = galleryFrameAspect(shot.screen);

  /* The evidence frame carries the capture's own aspect ratio rather than a
     house one, so no column the page has annotated is cropped out of view and
     a pin's authored per-cent is the per-cent it renders at.

     Below the layout breakpoint the surface holds a minimum readable width and
     the frame scrolls it, rather than shrinking a dense ERP table to an
     illegible strip. The frame is focusable because a scrollable region has to
     be reachable without a pointer. */
  return (
    <div
      className={styles.modulePage__shotViewport}
      style={{ "--frame-aspect": aspect } as React.CSSProperties}
      tabIndex={0}
      role="group"
      aria-label={`${shot.title} — scrollable product screen`}
    >
      <div className={styles.modulePage__shotSurface}>
        <Image
          src={screen.src}
          alt={shot.alt}
          fill
          loading="lazy"
          sizes="(max-width: 900px) 860px, (max-width: 1240px) 92vw, 1180px"
          onLoad={() =>
            trackModuleEvent("module_screenshot_viewed", {
              module: moduleSlug,
              screenshot: shot.id,
            })
          }
        />
        {shot.annotations?.map((pin, index) => (
          <span
            key={pin.id}
            className={styles.modulePage__pin}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            aria-hidden="true"
          >
            {index + 1}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Shown only where the frame is actually scrollable — below 900px. */
function ScrollHint() {
  return (
    <p className={styles.modulePage__scrollHint}>
      <MoveHorizontal size={13} aria-hidden="true" />
      Scroll the frame to read the whole screen
    </p>
  );
}

function ShotCaption({ shot }: { shot: ModuleScreenshot }) {
  const annotations = shot.state === "captured" ? (shot.annotations ?? []) : [];

  return (
    <div className={styles.modulePage__shotCaption}>
      <p className={styles.modulePage__shotContext}>{shot.context}</p>
      <h3>{shot.title}</h3>
      <p>{shot.description}</p>
      {annotations.length > 0 ? (
        <ol className={styles.modulePage__legend}>
          {annotations.map((pin, index) => (
            <li key={pin.id}>
              <span className={styles.modulePage__legendMark}>{index + 1}</span>
              <span>
                <strong>{pin.label}</strong>
                <span>{pin.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

export function ModuleGallery({
  gallery,
  moduleSlug,
}: {
  gallery: Gallery;
  moduleSlug: string;
}) {
  const shots = [...gallery.shots].sort((a, b) => a.order - b.order);
  const featuredIndex = Math.max(
    0,
    shots.findIndex((shot) => shot.featured),
  );
  const [activeIndex, setActiveIndex] = useState(featuredIndex);
  const reduced = useReducedMotion();
  const tabsId = useId();

  const active = shots[activeIndex] ?? shots[0];

  /* The stacked variant is a sequence rather than a selector — used where most
     screens are still pending, so a tab strip of placeholders would be noise. */
  if (gallery.variant === "stacked") {
    return (
      <section
        className={styles.modulePage__gallery}
        aria-labelledby="module-gallery"
      >
        <div className={styles.modulePage__shell}>
          <GalleryHeader gallery={gallery} />
          <div className={styles.modulePage__stack}>
            {shots.map((shot) => (
              <article
                key={shot.id}
                className={styles.modulePage__stackRow}
                data-reveal
              >
                <figure className={styles.modulePage__shotStage}>
                  <ShotFrame shot={shot} moduleSlug={moduleSlug} />
                  {shot.state === "captured" ? <ScrollHint /> : null}
                </figure>
                <div className={styles.modulePage__stackCopy}>
                  <p className={styles.modulePage__shotContext}>
                    {shot.context}
                  </p>
                  <h3>{shot.title}</h3>
                  <p>{shot.description}</p>
                  <p
                    className={
                      shot.state === "captured"
                        ? styles.modulePage__stateCaptured
                        : styles.modulePage__statePending
                    }
                  >
                    {shot.state === "captured" ? (
                      <>
                        <Camera size={13} aria-hidden="true" /> Real product
                        screen
                      </>
                    ) : (
                      <>
                        <CircleSlash2 size={13} aria-hidden="true" /> Capture
                        pending
                      </>
                    )}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={styles.modulePage__gallery}
      aria-labelledby="module-gallery"
    >
      <div className={styles.modulePage__shell}>
        <GalleryHeader gallery={gallery} />

        <div className={styles.modulePage__galleryLayout}>
          <div
            data-reveal
            id={`${tabsId}-panel`}
            role="tabpanel"
            aria-labelledby={`${tabsId}-${active.id}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={active.id}
                className={styles.modulePage__shotStage}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{
                  duration: reduced ? 0 : 0.32,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ShotFrame shot={active} moduleSlug={moduleSlug} />
                {active.state === "captured" ? <ScrollHint /> : null}
                <figcaption>
                  <ShotCaption shot={active} />
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {shots.length > 1 ? (
            <div
              className={styles.modulePage__shotTabs}
              role="tablist"
              aria-label={`${gallery.title} — choose a screen`}
              data-reveal
            >
              {shots.map((shot, index) => (
                <button
                  key={shot.id}
                  type="button"
                  role="tab"
                  id={`${tabsId}-${shot.id}`}
                  aria-selected={index === activeIndex}
                  aria-controls={`${tabsId}-panel`}
                  tabIndex={index === activeIndex ? 0 : -1}
                  className={styles.modulePage__shotTab}
                  onClick={() => {
                    setActiveIndex(index);
                    trackModuleEvent("module_screenshot_selected", {
                      module: moduleSlug,
                      screenshot: shot.id,
                    });
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key !== "ArrowRight" &&
                      event.key !== "ArrowLeft"
                    ) {
                      return;
                    }
                    event.preventDefault();
                    const next =
                      event.key === "ArrowRight"
                        ? (index + 1) % shots.length
                        : (index - 1 + shots.length) % shots.length;
                    setActiveIndex(next);
                    document
                      .getElementById(`${tabsId}-${shots[next].id}`)
                      ?.focus();
                  }}
                >
                  <span className={styles.modulePage__shotTabTop}>
                    <span>{shot.context}</span>
                    <span
                      className={
                        shot.state === "captured"
                          ? styles.modulePage__stateCaptured
                          : styles.modulePage__statePending
                      }
                    >
                      {shot.state === "captured" ? (
                        <Camera size={12} aria-hidden="true" />
                      ) : (
                        <CircleSlash2 size={12} aria-hidden="true" />
                      )}
                      {shot.state === "captured" ? "Captured" : "Pending"}
                    </span>
                  </span>
                  <strong>{shot.title}</strong>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function GalleryHeader({ gallery }: { gallery: Gallery }) {
  return (
    <header className={styles.modulePage__sectionHead}>
      <p className={styles.modulePage__eyebrow} data-reveal>
        <span className={styles.modulePage__eyebrowDot} aria-hidden="true" />
        Product evidence
      </p>
      <ModuleHeading
        id="module-gallery"
        text={gallery.title}
        accent="runs on"
      />
      <p data-reveal>{gallery.intro}</p>
    </header>
  );
}
