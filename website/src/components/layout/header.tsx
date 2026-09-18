"use client";

import { ArrowRight, MessageCircle, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ButtonLink } from "@/components/ui/button";
import { hasWhatsApp, primaryNav, siteConfig } from "@/lib/site-config";
import { Logo } from "./logo";
import { DesktopMegaMenu, MobileMegaMenu } from "./mega-menu";
import {
  megaMenuDefinitions,
  type MegaMenuDefinition,
  type MegaMenuKind,
} from "./mega-menu-data";

/**
 * Which nav item the current URL belongs to.
 *
 * A section parent stays lit on its children, so the nav always answers
 * "where am I". aria-current remains limited to an exact route match.
 */
function useNavState(href: string) {
  const pathname = usePathname();
  const exact = pathname === href;
  const withinSection = href !== "/" && pathname.startsWith(`${href}/`);
  return { active: exact || withinSection, exact };
}

/* The same underline continues to power links and menu triggers, preserving
   the current-route treatment on routes such as /pricing. */
const NAV_LINK =
  "relative py-7 text-sm font-semibold transition-colors hover:text-bz-blue " +
  "data-[active=true]:text-bz-blue " +
  "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-4 " +
  "after:h-[2px] after:rounded-full after:bg-bz-blue after:opacity-0 " +
  "after:transition-opacity after:duration-200 data-[active=true]:after:opacity-100";

function DesktopMenuNav({
  definition,
  isOpen,
  onOpen,
  onClose,
}: {
  definition: MegaMenuDefinition;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const { active, exact } = useNavState(definition.href);

  return (
    <DesktopMegaMenu
      definition={definition}
      active={active}
      exact={exact}
      isOpen={isOpen}
      triggerClassName={NAV_LINK}
      onOpen={onOpen}
      onClose={onClose}
    />
  );
}

function DesktopNavLink({ href, label }: { href: string; label: string }) {
  const { active, exact } = useNavState(href);
  return (
    <Link
      className={NAV_LINK}
      href={href}
      data-active={active}
      aria-current={exact ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

const MOBILE_LINK =
  "block border-b border-bz-border py-4 text-lg font-bold transition-colors " +
  "data-[active=true]:text-bz-blue";

function MobileNavLink({
  href,
  label,
  close,
}: {
  href: string;
  label: string;
  close: () => void;
}) {
  const { active, exact } = useNavState(href);
  return (
    <Link
      onClick={close}
      className={MOBILE_LINK}
      href={href}
      data-active={active}
      aria-current={exact ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

function MobileMenuNav({
  definition,
  isOpen,
  onToggle,
  close,
}: {
  definition: MegaMenuDefinition;
  isOpen: boolean;
  onToggle: () => void;
  close: () => void;
}) {
  const { active } = useNavState(definition.href);
  return (
    <MobileMegaMenu
      definition={definition}
      active={active}
      isOpen={isOpen}
      onToggle={onToggle}
      onNavigate={close}
    />
  );
}

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState<MegaMenuKind | null>(null);
  const [mobileMenu, setMobileMenu] = useState<MegaMenuKind | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileMenu(null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <header
      className={`sticky top-0 z-50 h-16 border-b transition lg:h-20 ${
        scrolled
          ? "border-bz-border/80 bg-white/90 shadow-nav backdrop-blur-xl"
          : "border-transparent bg-white"
      }`}
    >
      <div className="shell flex h-full items-center justify-between">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex">
          {primaryNav.map((item) => {
            if ("menu" in item) {
              const menu = item.menu as MegaMenuKind;
              return (
                <DesktopMenuNav
                  key={item.href}
                  definition={megaMenuDefinitions[menu]}
                  isOpen={desktopMenu === menu}
                  onOpen={() => setDesktopMenu(menu)}
                  onClose={() =>
                    setDesktopMenu((current) =>
                      current === menu ? null : current,
                    )
                  }
                />
              );
            }

            return (
              <DesktopNavLink
                key={item.href}
                href={item.href}
                label={item.label}
              />
            );
          })}
        </nav>

        <div className="hidden items-center lg:flex">
          <ButtonLink href="/contact" className="min-h-11 px-5">
            Book a demo
          </ButtonLink>
        </div>

        <button
          type="button"
          className="relative z-[60] ml-auto -mr-2 inline-flex size-11 items-center justify-center rounded-xl text-bz-navy transition active:bg-bz-surface-alt lg:hidden"
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <Menu />
        </button>
      </div>
    </header>

    {mounted &&
      mobileOpen &&
      createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-white lg:hidden">
          <div className="shell flex h-16 items-center justify-between border-b border-bz-border/60">
            <Logo />
            <button
              type="button"
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-xl text-bz-navy transition active:bg-bz-surface-alt"
              aria-label="Close navigation"
              onClick={closeMobile}
            >
              <X />
            </button>
          </div>

          <nav
            className="shell pb-[calc(40px+env(safe-area-inset-bottom))] pt-4"
            aria-label="Mobile primary"
          >
            <MobileNavLink
              href="/product"
              label="Product"
              close={closeMobile}
            />

            {(["solutions", "features", "industries"] as const).map((menu) => (
              <MobileMenuNav
                key={menu}
                definition={megaMenuDefinitions[menu]}
                isOpen={mobileMenu === menu}
                onToggle={() =>
                  setMobileMenu((current) => (current === menu ? null : menu))
                }
                close={closeMobile}
              />
            ))}

            {primaryNav
              .filter((item) => !("menu" in item) && item.href !== "/product")
              .map((item) => (
                <MobileNavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  close={closeMobile}
                />
              ))}

            <div className="mt-7 grid gap-3">
              <ButtonLink href="/contact" className="min-h-13 w-full">
                Book a demo <ArrowRight size={16} />
              </ButtonLink>
              {hasWhatsApp && (
                <a
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-bz-border bg-white text-sm font-bold text-bz-navy transition active:bg-bz-surface-alt"
                  href={siteConfig.whatsappUrl}
                >
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>
              )}
            </div>
          </nav>
        </div>,
        document.body,
      )}
    </>
  );
}
