import { ArrowUpRight } from "lucide-react";
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
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;

export function Footer() {
  return (
    <>
      <section className="bg-bz-blue text-white">
        <div className="shell flex flex-col items-start justify-between gap-8 py-12 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[.14em] text-white/65">
              A clearer operating day starts here
            </p>
            <h2 className="text-3xl font-bold tracking-[-.04em] md:text-4xl">
              Ready to run ops smarter?
            </h2>
          </div>
          <ButtonLink href="/contact" variant="light">
            Book a demo <ArrowUpRight size={18} />
          </ButtonLink>
        </div>
      </section>
      <footer className="bg-bz-navy-deep pb-28 pt-16 text-white md:pb-8">
        <div className="shell">
          <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.45fr_3fr]">
            <div>
              <Logo light />
              <p className="mt-5 max-w-xs text-sm leading-7 text-white/58">
                {siteConfig.tagline}
              </p>
              <p className="mt-8 max-w-xs text-sm text-white/45">
                One operating truth across warehouse, stores, franchise and
                books.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-9 sm:grid-cols-3 lg:grid-cols-5">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[.15em] text-white/45">
                    {group.title}
                  </h3>
                  <ul className="space-y-3">
                    {group.links.map((item) => (
                      <li key={item.href}>
                        <Link
                          className="text-sm text-white/72 transition hover:text-white"
                          href={item.href}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 py-6 text-xs text-white/42 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} {siteConfig.company}
            </p>
            <p>Built in India for multi-entity retail operators.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
