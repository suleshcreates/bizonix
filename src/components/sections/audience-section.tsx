"use client";

import {
  ArrowUpRight,
  Building2,
  Check,
  PackageCheck,
  ScanBarcode,
  ShoppingBag,
  Store,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const roles = [
  {
    label: "Wholesale HQ",
    step: "See",
    cue: "Network command",
    headline: "Know where stock is headed before the network asks.",
    body: "Purchase, allocate and protect working capital with every entity visible in the same operating context.",
    icon: Building2,
    scene: "hq",
  },
  {
    label: "Company retail / POS",
    step: "Sell",
    cue: "Counter velocity",
    headline: "Keep the queue moving—and the numbers already reconciled.",
    body: "Scan, sell, return and close the counter without separating store speed from central control.",
    icon: Store,
    scene: "retail",
  },
  {
    label: "Franchise outlets",
    step: "Scale",
    cue: "Partner autonomy",
    headline: "Give partners freedom without giving up the operating truth.",
    body: "Let every outlet replenish and sell in its own lane while the brand retains allocation and visibility.",
    icon: ShoppingBag,
    scene: "franchise",
  },
] as const;

export function AudienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userInteractedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);

  const activateRole = (index: number) => {
    userInteractedRef.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setActive(index);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      const frame = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(frame);
    }

    let advances = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setEntered(true);
        if (userInteractedRef.current) {
          observer.disconnect();
          return;
        }
        timerRef.current = setInterval(() => {
          advances += 1;
          setActive((current) => (current + 1) % roles.length);
          if (advances >= 5 && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }, 2800);
        observer.disconnect();
      },
      { threshold: 0.22 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="who-its-for"
      className={`section audience-section ${entered ? "is-entered" : ""}`}
    >
      <div className="shell">
        <div className="audience-heading-row">
          <div className="audience-heading">
            <span className="eyebrow">
              One system, three operating realities
            </span>
            <h2 className="h2 mt-5">
              Made for the whole network—not just head office.
            </h2>
            <p className="audience-intro">
              One system for the wholesale HQ, every retail counter, and every
              franchise outlet—not three disconnected tools bolted together.
            </p>
          </div>

          <div className="audience-story-nav" aria-label="Operating story">
            <span>Follow the operating flow</span>
            <div>
              {roles.map((role, index) => (
                <button
                  type="button"
                  key={role.step}
                  className={active === index ? "is-active" : ""}
                  aria-pressed={active === index}
                  onClick={() => activateRole(index)}
                >
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  {role.step}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="audience-grid">
          {roles.map((role, index) => (
            <Link
              href="/industries"
              key={role.label}
              className={`audience-card ${active === index ? "is-active" : ""}`}
              aria-label={`${role.label}: see how Bizonix fits`}
              onMouseEnter={() => activateRole(index)}
              onFocus={() => activateRole(index)}
            >
              <div className={`audience-scene audience-scene-${role.scene}`}>
                <div className="audience-scene-topline">
                  <span>
                    <role.icon size={14} /> {role.cue}
                  </span>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                </div>
                {role.scene === "hq" && <HqScene />}
                {role.scene === "retail" && <RetailScene />}
                {role.scene === "franchise" && <FranchiseScene />}
              </div>

              <div className="audience-card-content">
                <span className="audience-role-label">{role.label}</span>
                <h3>{role.headline}</h3>
                <p>{role.body}</p>
                <span className="audience-card-cta" aria-hidden="true">
                  See your workflow <ArrowUpRight size={16} strokeWidth={2.2} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HqScene() {
  return (
    <div className="audience-mini-window">
      <div className="audience-mini-header">
        <span>Network allocation</span>
        <TrendingUp size={14} />
      </div>
      <div className="audience-hq-kpis">
        <span>
          <small>Available</small>
          <strong>18,420</strong>
        </span>
        <span>
          <small>Committed</small>
          <strong>6,280</strong>
        </span>
      </div>
      <div className="audience-allocation">
        <span>
          <i /> Retail network <strong>72%</strong>
        </span>
        <b>
          <i />
        </b>
        <span>
          <i /> Franchise pool <strong>48%</strong>
        </span>
        <b>
          <i />
        </b>
      </div>
      <div className="audience-scene-confirm">
        <Check size={12} /> Purchase plan matched to demand
      </div>
    </div>
  );
}

function RetailScene() {
  return (
    <div className="audience-mini-window audience-pos-window">
      <div className="audience-mini-header">
        <span>Counter 04 · Sale</span>
        <ScanBarcode size={15} />
      </div>
      <div className="audience-scan-stage">
        <div className="audience-product-thumb">
          <ShoppingBag size={20} />
        </div>
        <div>
          <strong>Classic Oxford Shirt</strong>
          <small>BX-4021 · Navy / M</small>
        </div>
        <b>₹2,490</b>
        <i className="audience-scan-line" />
      </div>
      <div className="audience-pos-total">
        <span>2 items · GST included</span>
        <strong>₹4,280</strong>
      </div>
      <div className="audience-payment-state">
        <Check size={12} /> Paid · stock and books updated
      </div>
    </div>
  );
}

function FranchiseScene() {
  return (
    <div className="audience-mini-window">
      <div className="audience-mini-header">
        <span>Replenishment</span>
        <PackageCheck size={15} />
      </div>
      <div className="audience-franchise-order">
        <span>
          <small>Suggested order</small>
          <strong>24 pieces</strong>
        </span>
        <b>Ready</b>
      </div>
      <div className="audience-order-path">
        <span className="is-done">
          <i>
            <Check size={10} />
          </i>{" "}
          Requested
        </span>
        <b />
        <span className="is-done">
          <i>
            <Check size={10} />
          </i>{" "}
          Allocated
        </span>
        <b />
        <span>
          <i /> Dispatch
        </span>
      </div>
      <div className="audience-scene-confirm">
        <Check size={12} /> Within outlet permissions
      </div>
    </div>
  );
}
