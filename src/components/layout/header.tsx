"use client";

import {
  ArrowRight,
  Boxes,
  Calculator,
  ChevronDown,
  ExternalLink,
  Gem,
  LayoutGrid,
  Menu,
  Network,
  PackageOpen,
  Shirt,
  Store,
  Warehouse,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import {
  industryLinks,
  primaryNav,
  siteConfig,
  solutionLinks,
} from "@/lib/site-config";
import { Logo } from "./logo";

const solutionMenuCopy = {
  Inventory: {
    description: "Piece-level stock, movement and availability.",
    icon: Boxes,
  },
  Wholesale: {
    description: "Orders, allocation, dispatch and partner context.",
    icon: Warehouse,
  },
  Franchise: {
    description: "Network control without blurred ownership.",
    icon: Network,
  },
  Accounting: {
    description: "Books that retain operating context.",
    icon: Calculator,
  },
} as const;

const industryMenuCopy = {
  "Apparel & Footwear": {
    description: "Size, colour, season and piece-aware operations.",
    icon: Shirt,
  },
  "Imitation Jewellery": {
    description: "High-SKU assortments with reliable traceability.",
    icon: Gem,
  },
  "Franchise Networks": {
    description: "Central standards with local responsibility.",
    icon: Store,
  },
} as const;

const megaMenuCopy: Record<
  "solutions" | "industries",
  Record<string, { description: string; icon: LucideIcon }>
> = {
  solutions: solutionMenuCopy,
  industries: industryMenuCopy,
};

function DesktopMegaMenu({
  label,
  href,
  links,
  type,
}: {
  label: string;
  href: string;
  links: readonly { label: string; href: string }[];
  type: "solutions" | "industries";
}) {
  const copy = megaMenuCopy[type];

  return (
    <div className="group relative">
      <Link
        className="inline-flex items-center gap-1 py-7 text-sm font-semibold transition-colors hover:text-bz-blue group-focus-within:text-bz-blue"
        href={href}
      >
        {label}
        <ChevronDown
          className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
          size={14}
        />
      </Link>
      <div className="mega-menu invisible pointer-events-none fixed left-1/2 top-20 w-[820px] -translate-x-1/2 translate-y-2 opacity-0 transition duration-200 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="overflow-hidden rounded-[24px] border border-bz-border bg-white shadow-[0_28px_80px_rgba(11,31,58,.16)]">
          <div className="flex items-center justify-between border-b border-bz-border px-6 py-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-bz-blue">
                {type === "solutions"
                  ? "Operate end to end"
                  : "Built for your model"}
              </p>
              <p className="mt-1 text-sm font-bold text-bz-navy">
                {type === "solutions"
                  ? "One ERP across every operating layer"
                  : "Purpose-fit control for complex retail networks"}
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-2 text-xs font-bold text-bz-blue hover:text-bz-blue-hover"
              href={href}
            >
              {links[0].label} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-[1fr_1fr_240px] gap-2 p-3">
            <div className="col-span-2 grid grid-cols-2 gap-1">
              {links.slice(1).map((item) => {
                const itemCopy = copy[item.label];
                const Icon = itemCopy.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group/item flex gap-3 rounded-2xl p-4 transition-colors hover:bg-bz-blue-soft focus-visible:bg-bz-blue-soft"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-bz-border bg-white text-bz-blue shadow-sm transition-transform group-hover/item:-translate-y-0.5">
                      <Icon size={18} strokeWidth={1.9} />
                    </span>
                    <span>
                      <strong className="block text-sm text-bz-navy">
                        {item.label}
                      </strong>
                      <small className="mt-1 block text-[11px] leading-4 text-bz-muted">
                        {itemCopy.description}
                      </small>
                    </span>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/product"
              className="group/feature relative overflow-hidden rounded-2xl bg-bz-navy p-5 text-white"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-bz-teal">
                {type === "solutions" ? (
                  <LayoutGrid size={19} />
                ) : (
                  <PackageOpen size={19} />
                )}
              </span>
              <p className="mt-8 text-[10px] font-bold uppercase tracking-[.14em] text-bz-teal">
                The Bizonix model
              </p>
              <p className="mt-2 text-sm font-bold leading-5">
                Shared context with clear entity boundaries.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white/75 transition-colors group-hover/feature:text-white">
                Explore the platform <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <header
      className={`sticky top-0 z-50 h-20 border-b transition ${scrolled ? "border-bz-border/80 bg-white/90 shadow-nav backdrop-blur-xl" : "border-transparent bg-white"}`}
    >
      <div className="shell flex h-full items-center justify-between">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex">
          {primaryNav.map((item) =>
            "menu" in item && item.menu === "solutions" ? (
              <DesktopMegaMenu
                key={item.href}
                label={item.label}
                href={item.href}
                links={solutionLinks}
                type="solutions"
              />
            ) : "menu" in item && item.menu === "industries" ? (
              <DesktopMegaMenu
                key={item.href}
                label={item.label}
                href={item.href}
                links={industryLinks}
                type="industries"
              />
            ) : (
              <Link
                key={item.href}
                className="py-7 text-sm font-semibold hover:text-bz-blue"
                href={item.href}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="hidden items-center gap-1 lg:flex">
          <Link
            className="rounded-full px-3 py-2 text-sm font-semibold hover:bg-bz-surface-alt"
            href={siteConfig.loginUrl}
          >
            Login
          </Link>
          <Link
            className="rounded-full px-3 py-2 text-sm font-semibold hover:bg-bz-surface-alt"
            href={siteConfig.brochureUrl}
          >
            Brochure
          </Link>
          <ButtonLink href="/contact" className="ml-2 min-h-11 px-5">
            Book a demo
          </ButtonLink>
        </div>
        <button
          type="button"
          className="rounded-xl p-2 lg:hidden"
          aria-label="Open navigation"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-white lg:hidden">
          <div className="shell flex h-20 items-center justify-between">
            <Logo />
            <button
              className="rounded-xl p-2"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
          </div>
          <nav className="shell pb-28 pt-6" aria-label="Mobile primary">
            <Link
              onClick={() => setOpen(false)}
              className="block border-b border-bz-border py-4 text-lg font-bold"
              href="/product"
            >
              Product
            </Link>
            <MobileGroup
              title="Solutions"
              href="/modules"
              links={solutionLinks}
              close={() => setOpen(false)}
            />
            <MobileGroup
              title="Industries"
              href="/industries"
              links={industryLinks}
              close={() => setOpen(false)}
            />
            {primaryNav
              .filter((x) => !("menu" in x) && x.href !== "/product")
              .map((item) => (
                <Link
                  onClick={() => setOpen(false)}
                  key={item.href}
                  className="block border-b border-bz-border py-4 text-lg font-bold"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            <div className="mt-8 grid gap-3">
              <ButtonLink href="/contact">Book a demo</ButtonLink>
              <ButtonLink href={siteConfig.loginUrl} variant="secondary">
                Login <ExternalLink size={16} />
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MobileGroup({
  title,
  href,
  links,
  close,
}: {
  title: string;
  href: string;
  links: readonly { label: string; href: string }[];
  close: () => void;
}) {
  return (
    <details className="border-b border-bz-border">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-lg font-bold">
        {title}
        <ChevronDown />
      </summary>
      <div className="pb-4 pl-4">
        <Link
          href={href}
          onClick={close}
          className="block py-2 font-semibold text-bz-blue"
        >
          View all
        </Link>
        {links.slice(1).map((item) => (
          <Link
            href={item.href}
            onClick={close}
            key={item.href}
            className="block py-2 text-bz-muted"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
