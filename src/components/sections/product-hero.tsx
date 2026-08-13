import { ArrowRight, Play } from "lucide-react";
import { CompactOperatingEngine } from "@/components/sections/compact-operating-engine";
import { ButtonLink } from "@/components/ui/button";

export function ProductHero() {
  return (
    <section className="oe-hero overflow-hidden">
      <div className="oe-hero-halo oe-hero-halo-left" />
      <div className="oe-hero-halo oe-hero-halo-right" />
      <div className="shell oe-hero-shell">
        <div className="oe-copy">
          <div className="oe-kicker">
            <span className="oe-kicker-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            Built around the whole operating chain
          </div>
          <h1 className="oe-title">
            Wholesale. Retail. Franchise.
            <span>Finally in sync.</span>
          </h1>
          <p className="oe-lede">
            One ERP that connects every piece, counter, transfer, partner, and
            ledger—without flattening the way each entity actually works.
          </p>
          <div className="oe-actions">
            <ButtonLink href="/contact">
              See Bizonix on your workflow <ArrowRight size={17} />
            </ButtonLink>
            <a className="oe-demo-link" href="#operating-model">
              <span>
                <Play size={13} fill="currentColor" />
              </span>
              How the platform works
            </a>
          </div>
        </div>
        <CompactOperatingEngine />
      </div>
    </section>
  );
}
