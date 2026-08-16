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

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredFaqs = faqsWithMetadata.filter((faq) => {
    const matchesSearch =
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tag.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="section bg-slate-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-50/30 via-transparent to-transparent pointer-events-none" />

      <div className="shell relative z-10 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-start">
        {/* Left Side: Sticky Headers & Controls */}
        <div className="lg:sticky lg:top-28 space-y-8">
          <div>
            <span className="eyebrow">Straight answers</span>
            <h2 className="h2 mt-5 text-bz-navy">
              Before you see it on your workflow.
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
            <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start lg:w-72">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenIndex(0); // auto-open first item on category switch
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all text-left w-full lg:w-auto lg:min-w-64 border ${
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

          {/* Still Have Questions? Banner */}
          <div className="bg-bz-navy text-white p-6 rounded-[28px] border border-slate-800 shadow-[0_12px_40px_rgba(11,31,58,0.12)] relative overflow-hidden max-w-md group">
            <div className="absolute right-0 bottom-0 size-24 bg-bz-blue/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            <div className="flex gap-4 items-start relative z-10">
              <span className="flex size-9 rounded-xl bg-bz-blue/20 text-bz-blue items-center justify-center flex-shrink-0">
                <HelpCircle size={18} />
              </span>
              <div>
                <h4 className="font-bold text-sm">Have a specific workflow?</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Every brand has distinct warehouse flows, master rules, and
                  partner dynamics. Let&apos;s map Bizonix to yours.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-bz-blue text-xs font-bold mt-4 hover:text-white transition-colors"
                >
                  Book a custom workflow demo <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Search & Accordions */}
        <div className="space-y-6">
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
              className="w-full text-xs font-medium text-bz-navy placeholder-slate-400 bg-transparent outline-none"
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
                      className="w-full flex items-start justify-between gap-4 p-6 text-left"
                    >
                      <div className="flex items-start gap-4">
                        {/* Static numbers */}
                        <span className="font-mono text-xs font-bold text-bz-blue/40 mt-0.5">
                          0{idx + 1}
                        </span>
                        <div>
                          <span className="inline-block text-[8px] font-extrabold uppercase tracking-widest text-bz-blue bg-bz-blue-soft/50 px-1.5 py-0.5 rounded-md mb-2">
                            {faq.tag}
                          </span>
                          <h3 className="font-extrabold text-sm text-bz-navy leading-snug group-hover:text-bz-blue transition-colors">
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
                        <div className="px-6 pb-6 pl-14 pt-0">
                          <p className="text-xs text-bz-muted leading-relaxed max-w-2xl border-t border-slate-50 pt-3">
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
                <h4 className="font-bold text-sm text-slate-700">
                  No questions found
                </h4>
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
      </div>
    </section>
  );
}
