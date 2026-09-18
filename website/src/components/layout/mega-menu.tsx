"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
} from "react";
import type { MegaMenuDefinition } from "./mega-menu-data";
import styles from "./mega-menu.module.css";

type DesktopMegaMenuProps = {
  definition: MegaMenuDefinition;
  active: boolean;
  exact: boolean;
  isOpen: boolean;
  triggerClassName: string;
  onOpen: () => void;
  onClose: () => void;
};

export function DesktopMegaMenu({
  definition,
  active,
  exact,
  isOpen,
  triggerClassName,
  onOpen,
  onClose,
}: DesktopMegaMenuProps) {
  const reducedMotion = useReducedMotion();
  const reactId = useId().replaceAll(":", "");
  const menuId = `mega-menu-${definition.id}-${reactId}`;
  const triggerId = `${menuId}-trigger`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusTarget = useRef<"first" | "last" | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const closeMenu = useCallback(
    (restoreFocus = false) => {
      clearCloseTimer();
      onClose();
      if (restoreFocus) {
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
    },
    [clearCloseTimer, onClose],
  );

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => closeMenu(), 150);
  }, [clearCloseTimer, closeMenu]);

  useEffect(() => {
    if (!isOpen || !focusTarget.current) return;
    const target = focusTarget.current;
    focusTarget.current = null;
    requestAnimationFrame(() => {
      const links = rootRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"][data-menu-row="true"]',
      );
      if (!links?.length) return;
      links[target === "first" ? 0 : links.length - 1]?.focus();
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsidePointer = (event: globalThis.PointerEvent) => {
      if (!event.composedPath().includes(rootRef.current as EventTarget)) {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointer, true);
    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointer, true);
  }, [closeMenu, isOpen]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      focusTarget.current = event.key === "ArrowUp" ? "last" : "first";
      onOpen();
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

    const links = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"][data-menu-row="true"]',
      ) ?? [],
    );
    if (!links.length) return;

    event.preventDefault();
    const current = links.indexOf(document.activeElement as HTMLElement);
    let next = current;

    if (event.key === "Home") next = 0;
    if (event.key === "End") next = links.length - 1;
    if (event.key === "ArrowDown") next = (current + 1) % links.length;
    if (event.key === "ArrowUp")
      next = (current <= 0 ? links.length : current) - 1;

    links[next]?.focus();
  };

  return (
    <div
      ref={rootRef}
      className={styles.desktopRoot}
      onPointerEnter={() => {
        clearCloseTimer();
        onOpen();
      }}
      onPointerLeave={scheduleClose}
      onFocusCapture={clearCloseTimer}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          scheduleClose();
        }
      }}
    >
      <Link
        ref={triggerRef}
        id={triggerId}
        href={definition.href}
        className={`${triggerClassName} ${styles.trigger}`}
        data-active={active || isOpen}
        aria-current={exact ? "page" : undefined}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={(e) => {
          // If we want it to navigate, next/link does it automatically.
          // We can also close the menu.
          closeMenu();
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        {definition.label}
        <ChevronDown
          className={styles.chevron}
          data-open={isOpen}
          size={14}
          aria-hidden="true"
        />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.desktopAnchor}
            initial={reducedMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            /* Closing carries its own, shorter transition. A dropdown that
               takes as long to leave as it took to arrive reads as lag. */
            exit={
              reducedMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : {
                    opacity: 0,
                    y: -4,
                    transition: { duration: 0.14, ease: [0.4, 0, 1, 1] },
                  }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
            }
            onPointerEnter={clearCloseTimer}
            onPointerLeave={scheduleClose}
          >
            <div
              id={menuId}
              className={styles.desktopMenu}
              role="menu"
              aria-labelledby={triggerId}
              onKeyDown={handleMenuKeyDown}
            >
              <div className={styles.menuBody}>
                {/* Left 40%: brand and context. States why the platform is one
                    system, once, and offers the single link out of it. */}
                <div className={styles.intro}>
                  <span className={styles.eyebrow}>
                    {definition.summary.eyebrow}
                  </span>
                  <p className={styles.introTitle}>
                    {definition.summary.title}
                  </p>
                  <p className={styles.introBody}>
                    {definition.summary.description}
                  </p>
                  <Link
                    href={definition.summary.ctaHref}
                    role="menuitem"
                    className={styles.introLink}
                    onClick={() => closeMenu()}
                  >
                    {definition.summary.ctaLabel}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                  <span className={styles.introRule} aria-hidden="true" />
                </div>

                {/* Right 60%: navigation, and the directory link that closes
                    it. The column count follows the data so a two-group menu
                    gets two wide columns rather than three with a gap. */}
                <div className={styles.nav}>
                  <div
                    className={styles.groups}
                    style={
                      {
                        "--menu-cols": definition.groups.length,
                      } as React.CSSProperties
                    }
                  >
                    {definition.groups.map((group) => (
                      <div className={styles.group} key={group.label}>
                        <span className={styles.groupLabel}>{group.label}</span>
                        <div className={styles.groupLinks}>
                          {group.items.map((item) => (
                            <Link
                              key={item.id}
                              href={item.href}
                              role="menuitem"
                              data-menu-row="true"
                              className={styles.menuItem}
                              onClick={() => closeMenu()}
                            >
                              <span className={styles.menuItemText}>
                                <strong>{item.title}</strong>
                                <small>{item.description}</small>
                              </span>
                              <ChevronRight
                                className={styles.menuItemChevron}
                                size={14}
                                aria-hidden="true"
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={definition.href}
                    role="menuitem"
                    className={styles.menuFooter}
                    onClick={() => closeMenu()}
                  >
                    <span>{definition.footerLabel}</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type MobileMegaMenuProps = {
  definition: MegaMenuDefinition;
  active: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
};

export function MobileMegaMenu({
  definition,
  active,
  isOpen,
  onToggle,
  onNavigate,
}: MobileMegaMenuProps) {
  const reducedMotion = useReducedMotion();
  const reactId = useId().replaceAll(":", "");
  const panelId = `mobile-menu-${definition.id}-${reactId}`;

  return (
    <div className={styles.mobileGroup}>
      <button
        type="button"
        className={styles.mobileTrigger}
        data-active={active}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        {definition.label}
        <ChevronDown
          data-open={isOpen}
          className={styles.mobileChevron}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            className={styles.mobilePanel}
            role="region"
            aria-label={`${definition.label} links`}
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={
              reducedMotion ? { display: "none" } : { height: 0, opacity: 0 }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <div className={styles.mobileItems}>
              {definition.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={styles.mobileItem}
                  onClick={onNavigate}
                >
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </Link>
              ))}
              <Link
                href={definition.href}
                className={styles.mobileFooter}
                onClick={onNavigate}
              >
                {definition.footerLabel}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
