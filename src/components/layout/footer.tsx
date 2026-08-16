"use client";

import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { industryLinks, siteConfig, solutionLinks } from "@/lib/site-config";
import { Logo } from "./logo";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Platform", href: "/product" },
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Customers", href: "/customers" },
    ],
  },
  { title: "Solutions", links: solutionLinks.slice(1) },
  { title: "Industries", links: industryLinks.slice(1) },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Resources", href: "/resources" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;

export function Footer() {
  return (
    <>
      {/* CTA Banner with Team Photo */}
      <section className="footer-cta-banner">
        <div className="footer-cta-overlay" />
        <Image
          src="/brand/footer-team.jpg"
          alt="The Bizonix team"
          fill
          className="footer-cta-bg-img"
          sizes="100vw"
        />
        <div className="shell footer-cta-content">
          <h2>
            Ready to run your brand on
            <br />
            <span>one operating truth?</span>
          </h2>
          <ButtonLink
            href="/contact"
            variant="primary"
            className="footer-cta-btn"
          >
            Book a free consultation <ArrowUpRight size={18} />
          </ButtonLink>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="site-footer">
        <div className="shell">
          {/* Top Grid: Brand + Link Groups + Newsletter */}
          <div className="footer-top-grid">
            {/* Brand Column */}
            <div className="footer-brand-col">
              <Logo light />
              <p className="footer-brand-tagline">{siteConfig.tagline}</p>
              <div className="footer-contact-info">
                <a
                  href={`mailto:${siteConfig.salesEmail}`}
                  className="footer-contact-link"
                >
                  <Mail size={14} />
                  <span>{siteConfig.salesEmail}</span>
                </a>
                <a
                  href={`tel:${siteConfig.salesPhone}`}
                  className="footer-contact-link"
                >
                  <Phone size={14} />
                  <span>{siteConfig.salesPhone}</span>
                </a>
                <span className="footer-contact-link">
                  <MapPin size={14} />
                  <span>India</span>
                </span>
              </div>
            </div>

            {/* Sitemap Columns */}
            <div className="footer-links-grid">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="footer-group-title">{group.title}</h3>
                  <ul className="footer-link-list">
                    {group.links.map((item) => (
                      <li key={item.href}>
                        <Link className="footer-link" href={item.href}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter Column */}
            <div className="footer-newsletter-col">
              <h3 className="footer-group-title">Stay in the loop</h3>
              <p className="footer-newsletter-desc">
                Get product updates, best practices, and operator insights. No
                spam.
              </p>
              <form
                className="footer-newsletter-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Your email"
                  className="footer-newsletter-input"
                  aria-label="Email address for newsletter"
                />
                <button type="submit" className="footer-newsletter-btn">
                  Sign Up
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom-bar">
            <p>
              © {new Date().getFullYear()} {siteConfig.company}. All rights
              reserved.
            </p>
            <div className="footer-bottom-links">
              <Link href="/privacy" className="footer-bottom-link">
                Privacy
              </Link>
              <Link href="/terms" className="footer-bottom-link">
                Terms
              </Link>
            </div>
            <p className="footer-built-in">
              Built in India for multi-entity retail operators.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
