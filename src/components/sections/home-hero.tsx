import { ArrowRight, Building2, Check, Network, Store } from "lucide-react";
import { DashboardShowcase } from "@/components/sections/dashboard-showcase";
import { ButtonLink } from "@/components/ui/button";

const scopes = [
  { icon: Building2, label: "HQ", meta: "Shared masters" },
  { icon: Store, label: "Retail", meta: "Branch control" },
  { icon: Network, label: "Franchise", meta: "Partner scope" },
];

const trustPoints = [
  "Live with Pratyush",
  "GST-ready books",
  "Barcode piece stock",
  "Multi-entity RBAC",
];

export function HomeHero() {
  return (
    <section className="bz-home-hero" aria-labelledby="home-hero-heading">
      <div className="bz-hero-floor" aria-hidden="true" />
      <div className="bz-hero-light" aria-hidden="true" />

      <div className="shell bz-hero-shell">
        <div className="bz-hero-layout">
          <div className="bz-hero-copy reveal">
            <div className="bz-hero-pill">
              <span>ERP</span>
              Multi-entity operations platform
            </div>

            <h1 id="home-hero-heading" className="bz-hero-title">
              Wholesale, retail &amp; franchise.{" "}
              <span>One operating truth.</span>
            </h1>

            <p className="bz-hero-lede">
              Bizonix consolidates inventory, orders and finance across every
              entity so HQ, branches and franchise partners work from the same
              commercial context.
            </p>

            <div className="bz-hero-actions">
              <ButtonLink href="/contact">
                Book a workflow demo <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/modules" variant="secondary">
                Explore solutions
              </ButtonLink>
            </div>

            <div className="bz-scope-rail">
              <span className="bz-scope-label">Entity scope</span>
              {scopes.map((scope) => (
                <span className="bz-scope-item" key={scope.label}>
                  <scope.icon size={15} />
                  <strong>{scope.label}</strong>
                  <small>{scope.meta}</small>
                </span>
              ))}
            </div>
          </div>

          <DashboardShowcase layered />
        </div>

        <div className="bz-trust-strip">
          <ul>
            {trustPoints.map((label) => (
              <li key={label}>
                <Check size={13} />
                <strong>{label}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
