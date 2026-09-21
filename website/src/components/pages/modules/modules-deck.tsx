"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  moduleFilters,
  moduleIndexItems,
  type ModuleFilter,
  type ModuleIndexItem,
  type SerializableModuleIndexItem,
} from "@/lib/content/modules/modules-index";
import { FilterRail } from "./modules-deck-parts/filter-rail";
import { ModuleCard } from "./modules-deck-parts/module-card";
import styles from "@/components/pages/modules/modules.module.css";

/* Filter state lives in the URL so the footer and hero can deep-link into a
 * function, and so a filtered view survives a refresh or a share. */

const FILTER_EVENT = "bizonix:module-filter";
const validFilters = new Set<string>(moduleFilters.map((filter) => filter.id));

function readFilter(): ModuleFilter {
  const value = new URLSearchParams(window.location.search).get("filter") ?? "";
  return validFilters.has(value) ? (value as ModuleFilter) : "all";
}

function subscribeFilter(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(FILTER_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(FILTER_EVENT, onChange);
  };
}

const readServerFilter = (): ModuleFilter => "all";

function commitFilter(filter: ModuleFilter) {
  const url = new URL(window.location.href);
  if (filter === "all") url.searchParams.delete("filter");
  else url.searchParams.set("filter", filter);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new Event(FILTER_EVENT));
}

const matches = (
  module: { filters: readonly string[] },
  filter: ModuleFilter,
) =>
  filter === "all" || (module.filters as readonly string[]).includes(filter);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * The module deck.
 *
 * Filtering is a three-beat piece of choreography rather than a re-render:
 * departing bays fold away first, then the survivors glide from their old
 * coordinates to their new ones (a FLIP measured either side of the commit),
 * and finally the arrivals rise into the gaps. Everything runs through the Web
 * Animations API so React never has to own a frame of it.
 */
export function ModulesDeck({
  items,
}: {
  items?: readonly (SerializableModuleIndexItem | ModuleIndexItem)[];
}) {
  const allModules = items && items.length > 0 ? items : moduleIndexItems;

  const active = useSyncExternalStore(
    subscribeFilter,
    readFilter,
    readServerFilter,
  );

  const cardsRef = useRef(new Map<string, HTMLElement>());
  const flipRef = useRef<Map<string, DOMRect> | null>(null);
  const timerRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  const visible = useMemo(
    () => allModules.filter((module) => matches(module, active)),
    [active, allModules],
  );

  const counts = useMemo(() => {
    const tally = {} as Record<ModuleFilter, number>;
    for (const filter of moduleFilters) {
      tally[filter.id] = allModules.filter((module) =>
        matches(module, filter.id),
      ).length;
    }
    return tally;
  }, [allModules]);

  const register = useCallback((slug: string, element: HTMLElement | null) => {
    if (element) cardsRef.current.set(slug, element);
    else cardsRef.current.delete(slug);
  }, []);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  /* Beat one and two: fold the leavers away, then hand the new filter to React
   * with the pre-commit geometry captured for the FLIP. */
  const handleSelect = useCallback(
    (next: ModuleFilter) => {
      if (next === active) return;
      if (prefersReducedMotion()) {
        commitFilter(next);
        return;
      }

      const rects = new Map<string, DOMRect>();
      cardsRef.current.forEach((element, slug) => {
        rects.set(slug, element.getBoundingClientRect());
      });
      flipRef.current = rects;

      const leaving = visible.filter((module) => !matches(module, next));
      leaving.forEach((module, index) => {
        cardsRef.current.get(module.slug)?.animate(
          [
            { opacity: 1, transform: "none", filter: "blur(0px)" },
            {
              opacity: 0,
              transform: "perspective(1100px) translateY(-12px) scale(0.9) rotateX(12deg)",
              filter: "blur(7px)",
            },
          ],
          {
            duration: 280,
            delay: index * 24,
            easing: "cubic-bezier(0.55, 0, 0.75, 0)",
            fill: "forwards",
          },
        );
      });

      const settle = leaving.length
        ? 230 + Math.min(leaving.length, 6) * 24
        : 0;
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => commitFilter(next), settle);
    },
    [active, visible],
  );

  /* Beat three: glide the survivors, raise the arrivals. */
  useLayoutEffect(() => {
    const before = flipRef.current;
    flipRef.current = null;
    if (!before) return;

    let arrival = 0;
    for (const item of visible) {
      const element = cardsRef.current.get(item.slug);
      if (!element) continue;
      const previous = before.get(item.slug);
      const now = element.getBoundingClientRect();

      if (previous) {
        const dx = previous.left - now.left;
        const dy = previous.top - now.top;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          element.animate(
            [
              { transform: `translate(${dx}px, ${dy}px)` },
              { transform: "translate(0px, 0px)" },
            ],
            { duration: 660, easing: EASE_OUT },
          );
        }
        continue;
      }

      element.dataset.live = "true";
      element.animate(
        [
          {
            opacity: 0,
            transform: "translateY(32px) scale(0.94)",
            filter: "blur(8px)",
          },
          { opacity: 1, transform: "none", filter: "blur(0px)" },
        ],
        {
          duration: 640,
          delay: 140 + arrival * 58,
          easing: EASE_OUT,
          fill: "backwards",
        },
      );
      arrival += 1;
    }
  }, [visible]);

  /* First sighting of a bay raises it into place and starts its simulation. */
  useEffect(() => {
    if (prefersReducedMotion()) {
      cardsRef.current.forEach((element) => {
        element.dataset.live = "true";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let batch = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          element.dataset.live = "true";
          element.animate(
            [
              { opacity: 0, transform: "translateY(34px) scale(0.96)" },
              { opacity: 1, transform: "none" },
            ],
            {
              duration: 720,
              delay: batch * 70,
              easing: EASE_OUT,
              fill: "backwards",
            },
          );
          batch += 1;
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );

    cardsRef.current.forEach((element) => {
      if (element.dataset.live !== "true") observer.observe(element);
    });
    return () => observer.disconnect();
  }, [visible]);

  /* The rail firms up the moment it detaches from the flow. */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: "-88px 0px 0px 0px", threshold: 1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.modulesDeck__deck} aria-labelledby="module-deck-title">
      <span id="modules" className={styles.modulesDeck__anchor} aria-hidden="true" />
      <span className={styles.modulesDeck__seam} aria-hidden="true" />

      <div className={styles.modulesDeck__shell}>
        <header className={styles.modulesDeck__intro}>
          <p className={styles.modulesDeck__eyebrow}>
            <span className={styles.modulesDeck__eyebrowRule} aria-hidden="true" />
            The catalogue
          </p>
          <h2 id="module-deck-title">
            Start where the operation hurts.
            <span className={styles.modulesDeck__introMuted}>
              {" "}
              Add the rest when you&apos;re ready.
            </span>
          </h2>
          <p className={styles.modulesDeck__lede}>
            Nine modules, one record. Filter by the function you own — every bay
            below runs a live picture of what that module actually does inside
            Bizonix.
          </p>
        </header>

        <div ref={sentinelRef} className={styles.modulesDeck__sentinel} aria-hidden="true" />
        <div className={styles.modulesDeck__railHolder} data-stuck={stuck}>
          <FilterRail
            active={active}
            counts={counts}
            total={moduleIndexItems.length}
            onSelect={handleSelect}
          />
        </div>

        <div className={styles.modulesDeck__grid}>
          {visible.map((module) => (
            <ModuleCard
              key={module.slug}
              module={module}
              number={
                moduleIndexItems.findIndex(
                  (item) => item.slug === module.slug,
                ) + 1
              }
              register={register}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
