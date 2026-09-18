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

const footerGroups: { title: string; links: readonly FooterLink[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "How it works", href: "/product" },
      { label: "All solutions", href: "/modules" },
      { label: "Customers", href: "/customers" },
    ],
  },
  {
    /* Was a list of `/modules?filter=…` links. Those are query-string views of
       /modules that serve identical HTML, so they added five duplicate URLs
       and no new destination. The five feature pages are real, separately
       indexable pages that previously hung off the header mega-menu alone —
       a crawler that never opens a menu had no path to them. The filtered
       views are still reachable from the deck's own filter rail. */
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
  return LIVE_ROUTES.has(href.split("?")[0]);
}

function FooterCta() {
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
          One platform, every entity
        </p>
        <h2 id="footer-cta-title">
          Ready to run your brand on
          <span>one operating truth?</span>
        </h2>
        <p className="footer-cta-lede">
          Thirty minutes, your numbers, no obligation. We will walk your
          warehouse, stores and partners through a single record.
        </p>
        <div className="footer-cta-actions">
          <Link
            className="footer-cta-primary"
            href="/contact?utm_source=footer-cta"
          >
            Book a free consultation
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <Link className="footer-cta-ghost" href="/product">
            See the platform
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <FooterCta />

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
              {footerGroups.map((group) => (
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
              © {year} {siteConfig.company} All rights reserved.
            </p>

            <div className="footer-bottom-links">
              <Link href="/privacy" className="footer-bottom-link">
                Privacy
              </Link>
              <Link href="/terms" className="footer-bottom-link">
                Terms
              </Link>
              <span className="footer-built-in">
                Built in India for multi-entity retail operators.
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
