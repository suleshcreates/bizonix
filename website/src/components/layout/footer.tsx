import {
  ArrowUp,
  ArrowUpRight,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  featureLinks,
  hasSalesEmail,
  hasSalesPhone,
  industryLinks,
  siteConfig,
} from "@/lib/site-config";
import { FooterSubscribe } from "./footer-parts/footer-subscribe";
import { Logo } from "./logo";
import type {
  FooterColumnData,
  FooterCtaData,
  BottomBarData,
} from "@/lib/content/navigation/navigation-resolver";

/*
 * Routes that exist today. Anything not listed renders as a "Soon" label
 * instead of a link — the footer previously shipped eight links to 404s.
 * When a page ships, add its path here and it becomes a link again.
 */
const LIVE_ROUTES = new Set([
  "/product",
  "/modules",
  "/features",
  "/industries",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  ...industryLinks.map((link) => link.href),
  ...featureLinks.map((link) => link.href),
]);

type FooterLink = { label: string; href: string };

const defaultFooterGroups: { title: string; links: readonly FooterLink[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "How it works", href: "/product" },
      { label: "All solutions", href: "/modules" },
      { label: "Customers", href: "/customers" },
    ],
  },
  {
    title: "Features",
    links: featureLinks.map((link) => ({ ...link })),
  },
  {
    title: "Industries",
    links: industryLinks.map((link) => ({ ...link })),
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Resources", href: "/resources" },
    ],
  },
];

function isLive(href: string) {
  return LIVE_ROUTES.has(href.split("?")[0]) || href.startsWith("/modules/") || href.startsWith("/industries/");
}

function FooterCta({ config }: { config?: FooterCtaData }) {
  if (config && config.isEnabled === false) {
    return null;
  }

  const eyebrow = config?.eyebrow || "One platform, every entity";
  const title = config?.title || "Ready to run your brand on one operating truth?";
  const lede = config?.lede || "Thirty minutes, your numbers, no obligation. We will walk your warehouse, stores and partners through a single record.";
  const primaryLabel = config?.primaryLabel || "Book a free consultation";
  const primaryHref = config?.primaryHref || "/contact?utm_source=footer-cta";
  const secondaryLabel = config?.secondaryLabel || "See the platform";
  const secondaryHref = config?.secondaryHref || "/product";

  return (
    <section className="footer-cta-banner" aria-labelledby="footer-cta-title">
      <Image
        src="/images/shared/brand/footer-team.jpg"
        alt=""
        fill
        className="footer-cta-bg-img"
        sizes="100vw"
      />
      <span className="footer-cta-overlay" aria-hidden="true" />
      <span className="footer-cta-glow" aria-hidden="true" />
      <span className="footer-cta-grid" aria-hidden="true" />

      <div className="shell footer-cta-content">
        <p className="footer-cta-eyebrow">
          <span aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 id="footer-cta-title">
          {title}
        </h2>
        <p className="footer-cta-lede">
          {lede}
        </p>
        <div className="footer-cta-actions">
          <Link
            className="footer-cta-primary"
            href={primaryHref}
          >
            {primaryLabel}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <Link className="footer-cta-ghost" href={secondaryHref}>
            {secondaryLabel}
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export interface FooterProps {
  footerColumns?: FooterColumnData[];
  footerCta?: FooterCtaData;
  bottomBar?: BottomBarData;
}

export function Footer({ footerColumns, footerCta, bottomBar }: FooterProps) {
  const year = new Date().getFullYear();

  const groups = footerColumns && footerColumns.length > 0
    ? footerColumns.filter((c) => c.isActive !== false)
    : defaultFooterGroups;

  const copyright = bottomBar?.copyrightNotice
    ? `© ${year} ${bottomBar.copyrightNotice}`
    : `© ${year} ${siteConfig.company} All rights reserved.`;

  const tagline = bottomBar?.tagline || "Built in India for multi-entity retail operators.";

  const legalLinks = bottomBar?.links && bottomBar.links.length > 0
    ? bottomBar.links.filter((l) => l.isActive !== false)
    : [
        { id: "b-privacy", label: "Privacy", href: "/privacy", isActive: true },
        { id: "b-terms", label: "Terms", href: "/terms", isActive: true },
      ];

  return (
    <>
      <FooterCta config={footerCta} />

      <footer className="site-footer">
        <span className="footer-topline" aria-hidden="true" />

        <div className="shell">
          <div className="footer-top-grid">
            <div className="footer-brand-col">
              <Logo light />
              <p className="footer-brand-tagline">{siteConfig.tagline}</p>

              <ul className="footer-contact-info">
                {hasSalesEmail && (
                  <li>
                    <a
                      href={`mailto:${siteConfig.salesEmail}`}
                      className="footer-contact-link"
                    >
                      <Mail size={14} aria-hidden="true" />
                      <span>{siteConfig.salesEmail}</span>
                    </a>
                  </li>
                )}
                {hasSalesPhone && (
                  <li>
                    <a
                      href={`tel:${siteConfig.salesPhone}`}
                      className="footer-contact-link"
                    >
                      <Phone size={14} aria-hidden="true" />
                      <span>{siteConfig.salesPhone}</span>
                    </a>
                  </li>
                )}
                <li>
                  <span className="footer-contact-link" data-static="true">
                    <MapPin size={14} aria-hidden="true" />
                    <span>India</span>
                  </span>
                </li>
              </ul>
            </div>

            <nav className="footer-links-grid" aria-label="Footer">
              {groups.map((group) => (
                <div key={group.title}>
                  <h3 className="footer-group-title">{group.title}</h3>
                  <ul className="footer-link-list">
                    {group.links
                      .filter((item) => isLive(item.href))
                      .map((item) => (
                        <li key={item.href}>
                          <Link className="footer-link" href={item.href}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="footer-action-col">
              <h3 className="footer-group-title">Talk to an operator</h3>
              <p className="footer-action-desc">
                Tell us where to send the invite and we will tailor the session
                to how your business actually runs.
              </p>
              <FooterSubscribe />
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p className="footer-copy">
              {copyright}
            </p>

            <div className="footer-bottom-links">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="footer-bottom-link">
                  {link.label}
                </Link>
              ))}
              <span className="footer-built-in">
                {tagline}
              </span>
            </div>

            <a href="#main" className="footer-to-top">
              <span>Back to top</span>
              <ArrowUp size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        <span className="footer-watermark" aria-hidden="true">
          Bizonix
        </span>
      </footer>
    </>
  );
}
