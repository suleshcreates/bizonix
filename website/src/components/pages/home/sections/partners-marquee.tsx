"use client";

import React, { useEffect, useState } from "react";

export interface PartnerItem {
  id: string;
  name: string;
  slug?: string;
  category?: string;
  websiteUrl?: string;
  description?: string;
  logoUrl?: string;
  sortOrder?: number;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export interface PartnersConfig {
  speedSeconds?: number;
  showOnHomepage?: boolean;
}

const DEFAULT_CONFIG: PartnersConfig = {
  speedSeconds: 32,
  showOnHomepage: true,
};

const CANONICAL_PARTNERS: PartnerItem[] = [
  {
    id: "p-razorpay",
    name: "Razorpay",
    slug: "razorpay",
    logoUrl: "/images/partners/razorpay.svg",
    websiteUrl: "https://razorpay.com",
    category: "Payments",
  },
  {
    id: "p-aws",
    name: "Amazon Web Services",
    slug: "aws",
    logoUrl: "/images/partners/aws.svg",
    websiteUrl: "https://aws.amazon.com",
    category: "Cloud",
  },
  {
    id: "p-stripe",
    name: "Stripe",
    slug: "stripe",
    logoUrl: "/images/partners/stripe.svg",
    websiteUrl: "https://stripe.com",
    category: "Checkout",
  },
  {
    id: "p-pinelabs",
    name: "Pine Labs",
    slug: "pine-labs",
    logoUrl: "/images/partners/pinelabs.svg",
    websiteUrl: "https://pinelabs.com",
    category: "POS Hardware",
  },
  {
    id: "p-delhivery",
    name: "Delhivery",
    slug: "delhivery",
    logoUrl: "/images/partners/delhivery.svg",
    websiteUrl: "https://delhivery.com",
    category: "3PL Logistics",
  },
  {
    id: "p-sap",
    name: "SAP ERP",
    slug: "sap",
    logoUrl: "/images/partners/sap.svg",
    websiteUrl: "https://sap.com",
    category: "Enterprise Systems",
  },
  {
    id: "p-salesforce",
    name: "Salesforce",
    slug: "salesforce",
    logoUrl: "/images/partners/salesforce.svg",
    websiteUrl: "https://salesforce.com",
    category: "CRM & Cloud",
  },
  {
    id: "p-shiprocket",
    name: "Shiprocket",
    slug: "shiprocket",
    logoUrl: "/images/partners/shiprocket.svg",
    websiteUrl: "https://shiprocket.in",
    category: "Fulfillment",
  },
  {
    id: "p-zoho",
    name: "Zoho",
    slug: "zoho",
    logoUrl: "/images/partners/zoho.svg",
    websiteUrl: "https://zoho.com",
    category: "Accounting",
  },
  {
    id: "p-hdfc",
    name: "HDFC Bank",
    slug: "hdfc",
    logoUrl: "/images/partners/hdfc.svg",
    websiteUrl: "https://hdfcbank.com",
    category: "Banking",
  },
];

export function PartnersMarquee() {
  const [config, setConfig] = useState<PartnersConfig>(DEFAULT_CONFIG);
  const [partners, setPartners] = useState<PartnerItem[]>(CANONICAL_PARTNERS);

  useEffect(() => {
    let isMounted = true;
    const fetchPartners = async () => {
      try {
        const apiBase = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
        ).replace(/\/$/, "");
        const res = await fetch(`${apiBase}/public/partners`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.config) {
              setConfig((prev) => ({ ...prev, ...data.config }));
            }
            if (Array.isArray(data.partners) && data.partners.length > 0) {
              // Merge logoUrl from canonical if empty
              const merged = data.partners.map((p: PartnerItem) => {
                if (!p.logoUrl) {
                  const match = CANONICAL_PARTNERS.find(
                    (cp) =>
                      cp.slug === p.slug ||
                      cp.name.toLowerCase() === p.name.toLowerCase()
                  );
                  if (match) return { ...p, logoUrl: match.logoUrl };
                }
                return p;
              });
              setPartners(merged);
            }
          }
        }
      } catch (err) {
        // Silently fallback to canonical partners
      }
    };

    fetchPartners();
    return () => {
      isMounted = false;
    };
  }, []);

  if (config.showOnHomepage === false) {
    return null;
  }

  const speed =
    config.speedSeconds && config.speedSeconds > 5 ? config.speedSeconds : 32;

  return (
    <section
      aria-label="Partner Brand Logos"
      className="relative w-full overflow-hidden bg-white py-7 sm:py-9 border-y border-slate-100 select-none"
    >
      {/* Background Soft Ambient Light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(47,107,255,0.035),transparent_75%)] pointer-events-none" />

      {/* Marquee Track with Deep Feathered Edge Masks */}
      <div className="group relative w-full overflow-hidden">
        {/* Left Deep Gradient Mask */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-52 bg-gradient-to-r from-white via-white/90 to-transparent z-20" />

        {/* Right Deep Gradient Mask */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-52 bg-gradient-to-l from-white via-white/90 to-transparent z-20" />

        {/* Scrolling Ribbon Track */}
        <div
          className="flex w-max items-center gap-6 sm:gap-8 px-6 marquee-track"
          style={{
            animationDuration: `${speed}s`,
          }}
        >
          {/* Double array ensures seamless continuous loop with 0 stutter */}
          {[...partners, ...partners].map((partner, idx) => {
            const isExternal = Boolean(partner.websiteUrl);
            const Tag = isExternal ? "a" : "div";
            const tagProps = isExternal
              ? {
                  href: partner.websiteUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  title: `Visit ${partner.name}`,
                }
              : {};

            const logoSrc =
              partner.logoUrl ||
              CANONICAL_PARTNERS.find(
                (cp) =>
                  cp.slug === partner.slug ||
                  cp.name.toLowerCase() === partner.name.toLowerCase()
              )?.logoUrl ||
              "/images/partners/razorpay.svg";

            return (
              <Tag
                key={`${partner.id}-${idx}`}
                {...tagProps}
                className="group/item flex items-center justify-center h-14 sm:h-16 px-7 sm:px-8 rounded-2xl bg-white/80 hover:bg-white backdrop-blur-xs border border-slate-200/70 hover:border-bz-blue/40 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:shadow-[0_8px_20px_rgba(47,107,255,0.09)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shrink-0"
              >
                <img
                  src={logoSrc}
                  alt={`${partner.name} logo`}
                  loading="lazy"
                  className="h-6 sm:h-7 w-auto max-w-[130px] sm:max-w-[150px] object-contain opacity-75 group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-300"
                />
              </Tag>
            );
          })}
        </div>
      </div>

      {/* Marquee Keyframes & Hover Pause */}
      <style jsx>{`
        @keyframes bzMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          animation-name: bzMarquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .group:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
