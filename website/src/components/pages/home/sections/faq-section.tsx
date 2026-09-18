"use client";

import { useState } from "react";
import { Plus, Search, X, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
  { id: "all", label: "All Questions" },
  { id: "operations", label: "Core Operations" },
  { id: "setup", label: "Rollout & Tech" },
  { id: "governance", label: "Access & Governance" },
];

const faqsWithMetadata = [
  {
    q: "How is Bizonix deployed?",
    a: "Bizonix is designed as a central operating platform for warehouse, retail, franchise and ecommerce teams. The exact rollout, migration and hosting approach is scoped during the workflow demo.",
    tag: "Deployment",
    category: "setup",
  },
  {
    q: "Can franchise outlets see only their own operations?",
    a: "Yes. Entity-scoped roles are designed to keep each franchise focused on its own stock and workflows while the central team retains consolidated oversight.",
    tag: "Access Control",
    category: "governance",
  },
  {
    q: "Does it support individual-piece barcodes?",
    a: "Yes. Bizonix supports piece and series barcode workflows for receiving, label printing, transfers, billing and returns.",
    tag: "Barcoding",
    category: "operations",
  },
  {
    q: "Are accounting and GST workflows included?",
    a: "The platform covers tax invoices, chart of accounts, journals, ledgers, receivables, payables and GST-oriented reporting. Your exact compliance workflow should be confirmed during implementation.",
    tag: "Compliance & Tax",
    category: "operations",
  },
  {
    q: "Can it connect ecommerce and store inventory?",
    a: "Bizonix includes ecommerce catalog, order and storefront capabilities so commerce can operate against the same product and stock foundation.",
    tag: "Omnichannel",
    category: "operations",
  },
  {
    q: "What support is available during rollout?",
    a: "Fibonce works with your team to understand operating entities, masters, permissions and migration needs before defining the rollout and training plan.",
    tag: "Rollout",
    category: "setup",
  },
];

import { useEffect } from "react";

export interface FAQSectionProps {
  initialData?: {
    categories?: Array<{ id: string; slug: string; name: string }>;
    faqs?: Array<{
      id: string;
      question: string;
      answer: string;
      tag?: string | null;
      category?: string | null;
      categoryName?: string | null;
    }>;
  };
}

export function FAQSection({ initialData }: FAQSectionProps) {
  const [categoriesList, setCategoriesList] = useState(() => {
    if (initialData?.categories && initialData.categories.length > 0) {
      return [
        { id: "all", label: "All Questions" },
        ...initialData.categories.map((c) => ({ id: c.slug, label: c.name })),
      ];
    }
    return categories;
  });

  const [faqsList, setFaqsList] = useState(() => {
    if (initialData?.faqs && initialData.faqs.length > 0) {
      return initialData.faqs.map((f) => ({
        q: f.question,
        a: f.answer,
        tag: f.tag || "General",
        category: f.category || "all",
      }));
    }
    return faqsWithMetadata;
  });

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Client-side refresh for live CMS updates
  useEffect(() => {
    const fetchLiveFaqs = async () => {
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1").replace(/\/$/, "");
        const res = await fetch(`${apiBase}/public/faqs/home`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.categories && data.categories.length > 0) {
            setCategoriesList([
              { id: "all", label: "All Questions" },
              ...data.categories.map((c: any) => ({ id: c.slug, label: c.name })),
            ]);
          }
          if (data.faqs && data.faqs.length > 0) {
            setFaqsList(
              data.faqs.map((f: any) => ({
                q: f.question,
                a: f.answer,
                tag: f.tag || "General",
                category: f.category || "all",
              }))
            );
          }
        }
      } catch (e) {
        // Fallback silently to static data
      }
    };
    fetchLiveFaqs();
  }, []);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredFaqs = faqsList.filter((faq) => {
    const matchesSearch =
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tag.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="section bg-slate-50/50 relative overflow-hidden" id="faq">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-50/30 via-transparent to-transparent pointer-events-none" />

      <div className="shell relative z-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-12">
        {/* Left Side: Sticky Headers & Controls */}
        <div className="min-w-0 space-y-7 lg:sticky lg:top-28 lg:space-y-8">
          <div>
            <span className="eyebrow">Straight answers</span>
            <h2 className="mt-6 text-[clamp(2rem,3.2vw,2.75rem)] font-black leading-[1.08] tracking-[-0.03em] text-bz-navy [text-wrap:balance]">
              Before you see it{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-bz-blue to-bz-teal">
                on your workflow
              </span>
              .
            </h2>
            <p className="mt-4 text-bz-muted text-sm leading-relaxed max-w-md">
              A practical starting point. The demo is where we map Bizonix to
              your operating entities, merchandise, and security controls.
            </p>
          </div>

          {/* Category Filter Cards */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Filter by Category
            </span>
            {/* Four full-width stacked buttons ate half a phone screen for a
                filter almost nobody changes; on mobile they ride one snapping
                row and only become a rail once there is a column to hold it. */}
            <div className="-mx-[18px] flex snap-x snap-mandatory gap-2 overflow-x-auto px-[18px] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:w-72 lg:flex-col lg:items-start lg:overflow-visible lg:px-0">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenIndex(0); // auto-open first item on category switch
                  }}
                  className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-bold transition-all lg:w-auto lg:min-w-64 lg:rounded-2xl lg:text-left ${
                    activeCategory === cat.id
                      ? "bg-bz-navy text-white border-bz-navy shadow-sm"
                      : "bg-white text-bz-navy border-bz-border hover:bg-slate-50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <WorkflowBanner className="hidden lg:block" />
        </div>

        {/* Right Side: Search & Accordions */}
        <div className="min-w-0 space-y-5 lg:space-y-6">
          {/* Search Box */}
          <div className="flex items-center gap-2 bg-white rounded-2xl border border-bz-border p-3 shadow-[0_2px_12px_rgba(0,0,0,0.01)] focus-within:border-bz-blue focus-within:ring-2 focus-within:ring-bz-blue/15 transition-all">
            <Search className="text-slate-400 flex-shrink-0" size={16} />
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setOpenIndex(null); // collapse all when searching
              }}
              className="w-full bg-transparent text-sm font-medium text-bz-navy outline-none placeholder:text-slate-400 sm:text-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-slate-400 hover:text-bz-navy transition p-0.5 rounded-full hover:bg-slate-100"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;

                return (
                  <div
                    key={faq.q}
                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "border-bz-blue/30 shadow-[0_8px_30px_rgba(47,107,255,0.04)]"
                        : "border-bz-border/70 hover:border-bz-blue/20 hover:shadow-[0_4px_16px_rgba(0,0,0,0.01)]"
                    }`}
                  >
                    {/* Header bar / trigger */}
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="flex w-full items-start justify-between gap-3 p-5 text-left sm:gap-4 sm:p-6"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Static numbers */}
                        <span className="font-mono text-xs font-bold text-bz-blue/40 mt-0.5">
                          0{idx + 1}
                        </span>
                        <div>
                          <span className="inline-block text-[8px] font-extrabold uppercase tracking-widest text-bz-blue bg-bz-blue-soft/50 px-1.5 py-0.5 rounded-md mb-2">
                            {faq.tag}
                          </span>
                          <h3 className="text-[0.9rem] font-extrabold leading-snug text-bz-navy transition-colors group-hover:text-bz-blue sm:text-sm">
                            {faq.q}
                          </h3>
                        </div>
                      </div>
                      <span
                        className={`size-6 rounded-lg bg-bz-surface-alt flex items-center justify-center text-bz-blue flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-45 bg-bz-blue text-white" : ""
                        }`}
                      >
                        <Plus size={14} className="stroke-[3]" />
                      </span>
                    </button>

                    {/* Smooth expansion container */}
                    <div
                      className={`grid transition-all duration-300 ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 pb-5 pl-[46px] pt-0 sm:px-6 sm:pb-6 sm:pl-14">
                          <p className="max-w-2xl border-t border-slate-100 pt-3 text-[0.8rem] leading-relaxed text-bz-muted sm:text-xs">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                <HelpCircle className="mx-auto text-slate-300 mb-3" size={32} />
                <p className="font-bold text-sm text-slate-700">
                  No questions found
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Try searching for other keywords or reset filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("all");
                  }}
                  className="mt-4 bg-bz-navy text-white text-xs font-bold py-2 px-4 rounded-xl hover:bg-slate-800 transition"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        <WorkflowBanner className="lg:hidden" />
      </div>
    </section>
  );
}

/**
 * The "map this to my workflow" prompt. It belongs beside the filters in the
 * desktop rail, but on a phone it only makes sense once the reader has been
 * through the questions — so it renders in both places and each copy hides
 * itself where it does not belong.
 */
function WorkflowBanner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`group relative max-w-md overflow-hidden rounded-[28px] border border-slate-800 bg-bz-navy p-6 text-white shadow-[0_12px_40px_rgba(11,31,58,0.12)] ${className}`}
    >
      <div className="pointer-events-none absolute bottom-0 right-0 size-24 rounded-full bg-bz-blue/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
      <div className="relative z-10 flex items-start gap-4">
        <span className="flex size-9 flex-shrink-0 items-center justify-center rounded-xl bg-bz-blue/20 text-bz-blue">
          <HelpCircle size={18} />
        </span>
        <div>
          <h3 className="text-sm font-bold">Have a specific workflow?</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Every brand has distinct warehouse flows, master rules, and partner
            dynamics. Let&apos;s map Bizonix to yours.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-bz-blue transition-colors hover:text-white"
          >
            Book a custom workflow demo <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
