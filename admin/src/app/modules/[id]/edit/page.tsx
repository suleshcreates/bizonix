"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/shell/admin-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Eye,
  ExternalLink,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  Layers,
  HelpCircle,
  Globe,
  Camera,
  Activity,
  ArrowUpRight,
  MoveUp,
  MoveDown,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { ImageUploadSelector } from "@/components/ui/image-upload-selector";

interface EditModulePageProps {
  params: Promise<{ id: string }>;
}

export default function EditModulePage({ params }: EditModulePageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Module state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Core Operations");
  const [themeKey, setThemeKey] = useState("BLUE");
  const [iconKey, setIconKey] = useState("BOXES");
  const [badge, setBadge] = useState("");
  const [summary, setSummary] = useState("");
  const [outcome, setOutcome] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">("DRAFT");
  const [everPublished, setEverPublished] = useState(false);
  const [version, setVersion] = useState(1);

  // Surface flags
  const [showInCatalog, setShowInCatalog] = useState(true);
  const [showInMegaMenu, setShowInMegaMenu] = useState(false);
  const [showInHomepage, setShowInHomepage] = useState(false);
  const [showInFooter, setShowInFooter] = useState(false);

  // Deep Content JSON
  const [content, setContent] = useState<any>({});
  // FAQs
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchModule() {
      try {
        setLoading(true);
        const data = await apiClient.get<any>(`/admin/modules/${id}`);
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setCategory(data.category || "Core Operations");
        setThemeKey(data.themeKey || "BLUE");
        setIconKey(data.iconKey || "BOXES");
        setBadge(data.badge || "");
        setSummary(data.summary || "");
        setOutcome(data.outcome || "");
        setSortOrder(data.sortOrder || 1);
        setStatus(data.status || "DRAFT");
        setEverPublished(Boolean(data.everPublished));
        setVersion(data.version || 1);

        setShowInCatalog(data.showInCatalog ?? true);
        setShowInMegaMenu(data.showInMegaMenu ?? false);
        setShowInHomepage(data.showInHomepage ?? false);
        setShowInFooter(data.showInFooter ?? false);

        setContent(data.content || {});
        setFaqs(data.faqs || []);
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to load module details.");
      } finally {
        setLoading(false);
      }
    }
    fetchModule();
  }, [id]);

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const updated = await apiClient.patch<any>(`/admin/modules/${id}`, {
        title,
        category,
        summary,
        outcome,
        themeKey,
        iconKey,
        badge: badge || null,
        showInCatalog,
        showInMegaMenu,
        showInHomepage,
        showInFooter,
        content,
        faqs,
        expectedVersion: version,
      });

      setVersion(updated.version);
      setSuccessMessage("Draft saved successfully.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm("Are you sure you want to publish this module? All changes will immediately go live on the storefront.")) return;
    try {
      setPublishing(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Save draft first
      await apiClient.patch<any>(`/admin/modules/${id}`, {
        title,
        category,
        summary,
        outcome,
        themeKey,
        iconKey,
        badge: badge || null,
        showInCatalog,
        showInMegaMenu,
        showInHomepage,
        showInFooter,
        content,
        faqs,
        expectedVersion: version,
      });

      // Call publish endpoint
      const published = await apiClient.post<any>(`/admin/modules/${id}/publish`);
      setStatus("PUBLISHED");
      setEverPublished(true);
      setVersion(published.version);
      setSuccessMessage("Module published successfully! Deep page is now live.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to publish module.");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="py-20 text-center text-slate-400">Loading module editor...</div>
      </AdminShell>
    );
  }

  const hero = content.hero || {};
  const problemSection = content.problemSection || { problems: [], consequence: { items: [] } };
  const outcomesSection = content.outcomesSection || { outcomes: [] };
  const capabilities = content.capabilities || { groups: [] };
  const workflow = content.workflow || { steps: [] };
  const gallery = content.gallery || { variant: "featured-plus-grid", title: "", intro: "", shots: [] };
  const proof = content.proof || { kind: "quote", statement: "", attribution: "", image: "" };
  const seo = content.seo || {};

  return (
    <AdminShell>
      {/* Sticky Top Action Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-[#E5EAF2] -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 px-4 sm:px-6 py-3 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/modules"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Back to Modules"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-slate-900">{title || "Untitled Module"}</h1>
              <StatusBadge status={status} size="sm" />
              <span className="text-[11px] font-mono text-slate-400">v{version}</span>
            </div>
            <a
              href={`http://localhost:3000/modules/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-slate-500 hover:text-[#2563EB] flex items-center gap-1 mt-0.5"
            >
              /modules/{slug}
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {successMessage && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mr-2">
              <CheckCircle className="w-3.5 h-3.5" />
              {successMessage}
            </span>
          )}

          <a
            href={`http://localhost:3000/modules/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-[#E5EAF2] rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Storefront View</span>
          </a>

          <button
            onClick={handleSaveDraft}
            disabled={saving || publishing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Draft"}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={saving || publishing}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{publishing ? "Publishing..." : "Publish Module"}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center border-b border-[#E5EAF2] mb-6 overflow-x-auto gap-1">
        {[
          { id: "overview", label: "Overview & Surfaces" },
          { id: "hero", label: "Hero Stage" },
          { id: "problems", label: "Problems & Friction" },
          { id: "outcomes", label: "Outcomes & Capabilities" },
          { id: "workflow", label: "Workflow Timeline" },
          { id: "gallery", label: "Gallery & Proof" },
          { id: "faqs", label: `FAQs (${faqs.length})` },
          { id: "seo", label: "SEO & Relations" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === t.id
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & SURFACES */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5 bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-[#E5EAF2] pb-2.5">
              Module Identity & Catalog Copy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Module Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  URL Slug {everPublished && <span className="text-slate-400 font-normal">(Immutable once published)</span>}
                </label>
                <input
                  type="text"
                  disabled={everPublished}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""))}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 font-mono focus:outline-none focus:border-[#2563EB] disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="Core Operations">Core Operations</option>
                  <option value="Supply & Purchasing">Supply & Purchasing</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Finance">Finance</option>
                  <option value="Intelligence & Security">Intelligence & Security</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Theme Key</label>
                <select
                  value={themeKey}
                  onChange={(e) => setThemeKey(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="BLUE">BLUE (Franchise)</option>
                  <option value="CYAN">CYAN (Inventory)</option>
                  <option value="ORANGE">ORANGE (Procurement)</option>
                  <option value="CORAL">CORAL (Sales & POS)</option>
                  <option value="EMERALD">EMERALD (Wholesale)</option>
                  <option value="PURPLE">PURPLE (Accounting)</option>
                  <option value="PINK">PINK (Ecommerce)</option>
                  <option value="INDIGO">INDIGO (Analytics)</option>
                  <option value="SLATE">SLATE (Security)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Icon Key</label>
                <select
                  value={iconKey}
                  onChange={(e) => setIconKey(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="BOXES">Boxes</option>
                  <option value="TRUCK">Truck</option>
                  <option value="SCAN_BARCODE">Scan Barcode</option>
                  <option value="BUILDING">Building</option>
                  <option value="STORE">Store</option>
                  <option value="CALCULATOR">Calculator</option>
                  <option value="SHOPPING_BAG">Shopping Bag</option>
                  <option value="BAR_CHART">Bar Chart</option>
                  <option value="SHIELD_CHECK">Shield Check</option>
                  <option value="LAYERS">Layers</option>
                  <option value="WORKFLOW">Workflow</option>
                  <option value="DATABASE">Database</option>
                  <option value="ZAP">Zap</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Catalog Summary <span className="text-slate-400 font-normal">(Used in /modules catalog card)</span>
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                One-Line Outcome <span className="text-slate-400 font-normal">(Caption under catalog card visual)</span>
              </label>
              <input
                type="text"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="space-y-5 bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs h-fit">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-[#E5EAF2] pb-2.5">
              Controlled Surface Visibility
            </h3>
            <p className="text-xs text-slate-500">
              Control where this published module appears without breaking navigation layouts.
            </p>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInCatalog}
                  onChange={(e) => setShowInCatalog(e.target.checked)}
                  className="mt-0.5 rounded border-[#E5EAF2] text-[#2563EB] focus:ring-0"
                />
                <div>
                  <span className="text-xs font-medium text-slate-900 block">Show in /modules Catalog</span>
                  <span className="text-[11px] text-slate-500">Includes module card in the solutions filter deck.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInMegaMenu}
                  onChange={(e) => setShowInMegaMenu(e.target.checked)}
                  className="mt-0.5 rounded border-[#E5EAF2] text-[#2563EB] focus:ring-0"
                />
                <div>
                  <span className="text-xs font-medium text-slate-900 block">Show in Header Mega-Menu</span>
                  <span className="text-[11px] text-slate-500">Shows under Solutions dropdown in the topbar.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInHomepage}
                  onChange={(e) => setShowInHomepage(e.target.checked)}
                  className="mt-0.5 rounded border-[#E5EAF2] text-[#2563EB] focus:ring-0"
                />
                <div>
                  <span className="text-xs font-medium text-slate-900 block">Show in Homepage Showcase</span>
                  <span className="text-[11px] text-slate-500">Includes in the curated operating core radial orbit.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInFooter}
                  onChange={(e) => setShowInFooter(e.target.checked)}
                  className="mt-0.5 rounded border-[#E5EAF2] text-[#2563EB] focus:ring-0"
                />
                <div>
                  <span className="text-xs font-medium text-slate-900 block">Show in Footer Links</span>
                  <span className="text-[11px] text-slate-500">Lists under the platform column in the footer.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HERO STAGE */}
      {activeTab === "hero" && (
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs space-y-5">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-[#E5EAF2] pb-2.5">
            Hero Headline & Operating Chain
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Eyebrow Label</label>
              <input
                type="text"
                value={hero.eyebrow || ""}
                onChange={(e) => setContent({ ...content, hero: { ...hero, eyebrow: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Template / Visual Variant</label>
              <select
                value={hero.templateKey || "standard"}
                onChange={(e) => setContent({ ...content, hero: { ...hero, templateKey: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
              >
                <option value="standard">Standard (Generic Enterprise Canvas)</option>
                <option value="inventory">Inventory Canvas</option>
                <option value="procurement">Procurement Canvas</option>
                <option value="pos">Sales & POS Canvas</option>
                <option value="wholesale">Wholesale Canvas</option>
                <option value="network">Franchise Canvas</option>
                <option value="finance">Accounting Canvas</option>
                <option value="commerce">Ecommerce Canvas</option>
                <option value="analytics">Analytics Canvas</option>
                <option value="security">Security Canvas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">H1 Headline</label>
              <input
                type="text"
                value={hero.headline || ""}
                onChange={(e) => setContent({ ...content, hero: { ...hero, headline: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Headline Accent <span className="text-slate-400 font-normal">(Exact suffix of headline that takes theme color)</span>
              </label>
              <input
                type="text"
                value={hero.headlineAccent || ""}
                onChange={(e) => setContent({ ...content, hero: { ...hero, headlineAccent: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Lede / Body Paragraph</label>
            <textarea
              rows={3}
              value={hero.body || ""}
              onChange={(e) => setContent({ ...content, hero: { ...hero, body: e.target.value } })}
              className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Hero Screen / Capture */}
          <div className="pt-4 border-t border-[#E5EAF2] space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Hero Stage Product Visual (Optional Custom Capture)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <ImageUploadSelector
                  value={hero.screen?.src || ""}
                  onChange={(url) =>
                    setContent({
                      ...content,
                      hero: {
                        ...hero,
                        screen: { ...hero.screen, src: url, alt: hero.screen?.alt || title },
                      },
                    })
                  }
                  label="Hero Product Screen Capture"
                  hint="Upload a real product interface capture or leave empty to use the standard canvas simulation."
                  aspect="wide"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Image Alt Text</label>
                <input
                  type="text"
                  placeholder="e.g. Bizonix Inventory ledger screen showing stock balances"
                  value={hero.screen?.alt || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: {
                        ...hero,
                        screen: { ...hero.screen, alt: e.target.value },
                      },
                    })
                  }
                  className="w-full px-2.5 py-1 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-md text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Crop Focal Point</label>
                <input
                  type="text"
                  placeholder="e.g. center, top left"
                  value={hero.screen?.focus || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: {
                        ...hero,
                        screen: { ...hero.screen, focus: e.target.value },
                      },
                    })
                  }
                  className="w-full px-2.5 py-1 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-md text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROBLEMS & FRICTION */}
      {activeTab === "problems" && (
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs space-y-5">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-[#E5EAF2] pb-2.5">
            Operational Friction Points (Before State)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Section Eyebrow</label>
              <input
                type="text"
                value={problemSection.eyebrow || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    problemSection: { ...problemSection, eyebrow: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Section H2 Title</label>
              <input
                type="text"
                value={problemSection.title || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    problemSection: { ...problemSection, title: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Framing Intro Statement</label>
            <input
              type="text"
              value={problemSection.intro || ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  problemSection: { ...problemSection, intro: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
            />
          </div>

          <div className="space-y-4 pt-3 border-t border-[#E5EAF2]">
            <h4 className="text-xs font-semibold text-slate-900">3 Friction Stories</h4>
            {(problemSection.problems || []).map((prob: any, idx: number) => (
              <div key={idx} className="p-3.5 bg-slate-50 border border-[#E5EAF2] rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Problem {prob.number || `0${idx + 1}`}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Short Pain Title</label>
                    <input
                      type="text"
                      value={prob.title || ""}
                      onChange={(e) => {
                        const next = [...problemSection.problems];
                        next[idx].title = e.target.value;
                        setContent({ ...content, problemSection: { ...problemSection, problems: next } });
                      }}
                      className="w-full px-2.5 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Operator Quote</label>
                    <input
                      type="text"
                      value={prob.quote || ""}
                      onChange={(e) => {
                        const next = [...problemSection.problems];
                        next[idx].quote = e.target.value;
                        setContent({ ...content, problemSection: { ...problemSection, problems: next } });
                      }}
                      className="w-full px-2.5 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Description (Why operation breaks)</label>
                  <textarea
                    rows={2}
                    value={prob.description || ""}
                    onChange={(e) => {
                      const next = [...problemSection.problems];
                      next[idx].description = e.target.value;
                      setContent({ ...content, problemSection: { ...problemSection, problems: next } });
                    }}
                    className="w-full px-2.5 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: OUTCOMES & CAPABILITIES */}
      {activeTab === "outcomes" && (
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 border-b border-[#E5EAF2] pb-2.5 mb-4">
              Capability Groups
            </h3>
            <div className="space-y-4">
              {(capabilities.groups || []).map((grp: any, gIdx: number) => (
                <div key={gIdx} className="p-3.5 bg-slate-50 border border-[#E5EAF2] rounded-lg space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Group Title</label>
                      <input
                        type="text"
                        value={grp.title || ""}
                        onChange={(e) => {
                          const next = [...capabilities.groups];
                          next[gIdx].title = e.target.value;
                          setContent({ ...content, capabilities: { ...capabilities, groups: next } });
                        }}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Context Line</label>
                      <input
                        type="text"
                        value={grp.context || ""}
                        onChange={(e) => {
                          const next = [...capabilities.groups];
                          next[gIdx].context = e.target.value;
                          setContent({ ...content, capabilities: { ...capabilities, groups: next } });
                        }}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Feature Functions (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(grp.items || []).join(", ")}
                      onChange={(e) => {
                        const next = [...capabilities.groups];
                        next[gIdx].items = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        setContent({ ...content, capabilities: { ...capabilities, groups: next } });
                      }}
                      className="w-full px-2.5 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WORKFLOW TIMELINE */}
      {activeTab === "workflow" && (
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs space-y-5">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-[#E5EAF2] pb-2.5">
            Operational Workflow Timeline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Workflow Section Title</label>
              <input
                type="text"
                value={workflow.title || ""}
                onChange={(e) => setContent({ ...content, workflow: { ...workflow, title: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Workflow Intro Statement</label>
              <input
                type="text"
                value={workflow.intro || ""}
                onChange={(e) => setContent({ ...content, workflow: { ...workflow, intro: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-[#E5EAF2]">
            <h4 className="text-xs font-semibold text-slate-900">Step-by-Step Operating Sequence</h4>
            {(workflow.steps || []).map((st: any, sIdx: number) => (
              <div key={sIdx} className="p-3 bg-slate-50 border border-[#E5EAF2] rounded-lg grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Step Title</label>
                  <input
                    type="text"
                    value={st.title || ""}
                    onChange={(e) => {
                      const next = [...workflow.steps];
                      next[sIdx].title = e.target.value;
                      setContent({ ...content, workflow: { ...workflow, steps: next } });
                    }}
                    className="w-full px-2 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Body Description</label>
                  <input
                    type="text"
                    value={st.body || ""}
                    onChange={(e) => {
                      const next = [...workflow.steps];
                      next[sIdx].body = e.target.value;
                      setContent({ ...content, workflow: { ...workflow, steps: next } });
                    }}
                    className="w-full px-2 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Resulting Record</label>
                  <input
                    type="text"
                    value={st.record || ""}
                    onChange={(e) => {
                      const next = [...workflow.steps];
                      next[sIdx].record = e.target.value;
                      setContent({ ...content, workflow: { ...workflow, steps: next } });
                    }}
                    className="w-full px-2 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md"
                  />
                </div>
                <div className="sm:col-span-4 pt-1">
                  <ImageUploadSelector
                    value={st.image || ""}
                    onChange={(url) => {
                      const next = [...workflow.steps];
                      next[sIdx].image = url;
                      setContent({ ...content, workflow: { ...workflow, steps: next } });
                    }}
                    label={`Step 0${sIdx + 1} Visual Illustration (Optional)`}
                    hint="Diagram or screenshot demonstrating this operational phase."
                    aspect="wide"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: GALLERY & PROOF */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          {/* Section 1: Screenshot Gallery */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5EAF2] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#2563EB]" />
                  <span>Module Screenshot Gallery</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-fidelity product interface captures displaying actual system workflows.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentShots = gallery.shots || [];
                  const newShot = {
                    id: `shot-${Date.now()}`,
                    title: `Product Screen ${currentShots.length + 1}`,
                    description: "High-density operational screen for daily workflow execution.",
                    context: "Operations Overview",
                    order: currentShots.length + 1,
                    featured: currentShots.length === 0,
                    state: "captured",
                    src: "",
                    alt: "",
                  };
                  setContent({
                    ...content,
                    gallery: {
                      ...gallery,
                      shots: [...currentShots, newShot],
                    },
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Screenshot</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Gallery Section Title</label>
                <input
                  type="text"
                  placeholder="e.g. Unified Command Center & Operational Ledger"
                  value={gallery.title || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      gallery: { ...gallery, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Display Layout</label>
                <select
                  value={gallery.variant || "featured-plus-grid"}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      gallery: { ...gallery, variant: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                >
                  <option value="featured-plus-grid">Featured + Screen Selector Tabs</option>
                  <option value="stacked">Vertical Stacked Feed</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">Gallery Intro Statement</label>
                <input
                  type="text"
                  placeholder="e.g. Engineered for high-throughput enterprise execution with sub-second response times."
                  value={gallery.intro || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      gallery: { ...gallery, intro: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>
            </div>

            {/* Shots List */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Captures & Screens ({gallery.shots?.length || 0})
              </h4>

              {(!gallery.shots || gallery.shots.length === 0) ? (
                <div className="p-8 text-center border-2 border-dashed border-[#E5EAF2] rounded-xl bg-slate-50/60">
                  <Camera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-600">No screenshots added yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click &quot;Add Screenshot&quot; above to upload your product screen captures.
                  </p>
                </div>
              ) : (
                gallery.shots.map((shot: any, idx: number) => (
                  <div
                    key={shot.id || idx}
                    className="p-4 bg-slate-50 border border-[#E5EAF2] rounded-xl space-y-3.5"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#E5EAF2]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">
                          Screen #{idx + 1}
                        </span>
                        {shot.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            Featured Screen
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="Move up"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const next = [...gallery.shots];
                            const temp = next[idx - 1];
                            next[idx - 1] = next[idx];
                            next[idx] = temp;
                            setContent({
                              ...content,
                              gallery: { ...gallery, shots: next },
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Move down"
                          disabled={idx === gallery.shots.length - 1}
                          onClick={() => {
                            if (idx === gallery.shots.length - 1) return;
                            const next = [...gallery.shots];
                            const temp = next[idx + 1];
                            next[idx + 1] = next[idx];
                            next[idx] = temp;
                            setContent({
                              ...content,
                              gallery: { ...gallery, shots: next },
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Delete screenshot"
                          onClick={() => {
                            const next = gallery.shots.filter((_: any, i: number) => i !== idx);
                            setContent({
                              ...content,
                              gallery: { ...gallery, shots: next },
                            });
                          }}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Screenshot file upload selector */}
                    <div>
                      <ImageUploadSelector
                        value={shot.src || ""}
                        onChange={(url) => {
                          const next = [...gallery.shots];
                          next[idx] = {
                            ...next[idx],
                            src: url,
                            state: url ? "captured" : next[idx].state || "pending",
                          };
                          setContent({
                            ...content,
                            gallery: { ...gallery, shots: next },
                          });
                        }}
                        label="Product Screen Image"
                        hint="Upload PNG, WebP, or SVG screenshot of the actual software."
                        aspect="wide"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                          Screen Title *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Real-Time Stock Ledger"
                          value={shot.title || ""}
                          onChange={(e) => {
                            const next = [...gallery.shots];
                            next[idx] = { ...next[idx], title: e.target.value };
                            setContent({
                              ...content,
                              gallery: { ...gallery, shots: next },
                            });
                          }}
                          className="w-full px-2.5 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                          Context Badge / Discipline
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Operations Overview"
                          value={shot.context || ""}
                          onChange={(e) => {
                            const next = [...gallery.shots];
                            next[idx] = { ...next[idx], context: e.target.value };
                            setContent({
                              ...content,
                              gallery: { ...gallery, shots: next },
                            });
                          }}
                          className="w-full px-2.5 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                          Capture State
                        </label>
                        <select
                          value={shot.state || "captured"}
                          onChange={(e) => {
                            const next = [...gallery.shots];
                            next[idx] = { ...next[idx], state: e.target.value };
                            setContent({
                              ...content,
                              gallery: { ...gallery, shots: next },
                            });
                          }}
                          className="w-full px-2.5 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md"
                        >
                          <option value="captured">Captured (Visible Screen)</option>
                          <option value="pending">Pending (Honest Placeholder)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                          Description (What is shown on this screen)
                        </label>
                        <textarea
                          rows={2}
                          value={shot.description || ""}
                          onChange={(e) => {
                            const next = [...gallery.shots];
                            next[idx] = { ...next[idx], description: e.target.value };
                            setContent({
                              ...content,
                              gallery: { ...gallery, shots: next },
                            });
                          }}
                          className="w-full px-2.5 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                          Image Alt Text
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Factual description for screen readers and SEO"
                          value={shot.alt || ""}
                          onChange={(e) => {
                            const next = [...gallery.shots];
                            next[idx] = { ...next[idx], alt: e.target.value };
                            setContent({
                              ...content,
                              gallery: { ...gallery, shots: next },
                            });
                          }}
                          className="w-full px-2.5 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={Boolean(shot.featured)}
                          onChange={(e) => {
                            const next = gallery.shots.map((s: any, i: number) => ({
                              ...s,
                              featured: i === idx ? e.target.checked : false,
                            }));
                            setContent({
                              ...content,
                              gallery: { ...gallery, shots: next },
                            });
                          }}
                          className="w-4 h-4 rounded text-[#2563EB] focus:ring-blue-500 border-slate-300"
                        />
                        <span>Set as Featured / Default Screenshot</span>
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 2: Customer Proof */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-[#E5EAF2] pb-2.5">
              Verified Customer Evidence (Proof Section)
            </h3>
            <p className="text-xs text-slate-500">
              Approved testimonial, executive statement, or verified operational metric. Rendered only when authored.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <ImageUploadSelector
                  value={proof.image || ""}
                  onChange={(url) =>
                    setContent({
                      ...content,
                      proof: { ...proof, image: url },
                    })
                  }
                  label="Customer Photo / Company Logo"
                  hint="Upload an executive portrait, company badge, or verified evidence badge."
                  aspect="square"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Evidence Type</label>
                <select
                  value={proof.kind || "quote"}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      proof: { ...proof, kind: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                >
                  <option value="quote">Customer Quote / Testimonial</option>
                  <option value="metric">Verified Metric Outcome</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Attribution (Name, Role, Company)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operations Director, 45-store Retail Chain"
                  value={proof.attribution || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      proof: { ...proof, attribution: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Evidence Statement / Quote
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Bizonix removed 4 hours of daily manual stock adjustments and synchronized our warehouse directly to our point-of-sale registers."
                  value={proof.statement || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      proof: { ...proof, statement: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: FAQS */}
      {activeTab === "faqs" && (
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#E5EAF2] pb-2.5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Module-Specific FAQs</h3>
              <p className="text-xs text-slate-500">Connected directly to the global FAQ database (`location: MODULE`).</p>
            </div>
            <button
              onClick={() => {
                setFaqs([
                  ...faqs,
                  { question: "", answer: "", sortOrder: faqs.length + 1, isPublished: true },
                ]);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {faqs.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No FAQs authored for this module yet.
              </div>
            ) : (
              faqs.map((f, fIdx) => (
                <div key={fIdx} className="p-3.5 bg-slate-50 border border-[#E5EAF2] rounded-lg space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Question #{fIdx + 1}</span>
                    <button
                      onClick={() => setFaqs(faqs.filter((_, i) => i !== fIdx))}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                      title="Remove FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="e.g. Can stock be transferred across entities in real time?"
                      value={f.question || ""}
                      onChange={(e) => {
                        const next = [...faqs];
                        next[fIdx].question = e.target.value;
                        setFaqs(next);
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5EAF2] rounded-md font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      placeholder="Detailed operational answer..."
                      value={f.answer || ""}
                      onChange={(e) => {
                        const next = [...faqs];
                        next[fIdx].answer = e.target.value;
                        setFaqs(next);
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5EAF2] rounded-md text-slate-800"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 7: SEO & RELATIONS */}
      {activeTab === "seo" && (
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs space-y-5">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-[#E5EAF2] pb-2.5">
            Search Engine Optimization & Related Modules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Meta Title</label>
              <input
                type="text"
                value={seo.title || ""}
                onChange={(e) => setContent({ ...content, seo: { ...seo, title: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">OpenGraph Title</label>
              <input
                type="text"
                value={seo.ogTitle || ""}
                onChange={(e) => setContent({ ...content, seo: { ...seo, ogTitle: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Meta Description</label>
              <textarea
                rows={2}
                value={seo.description || ""}
                onChange={(e) => setContent({ ...content, seo: { ...seo, description: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">OpenGraph Description</label>
              <textarea
                rows={2}
                value={seo.ogDescription || ""}
                onChange={(e) => setContent({ ...content, seo: { ...seo, ogDescription: e.target.value } })}
                className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5EAF2]">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Related Modules <span className="text-slate-400 font-normal">(Slugs separated by comma, e.g. inventory, procurement, franchise)</span>
            </label>
            <input
              type="text"
              value={(content.relatedModules || []).join(", ")}
              onChange={(e) =>
                setContent({
                  ...content,
                  relatedModules: e.target.value.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean),
                })
              }
              className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Note: When publishing, all referenced modules must be in `PUBLISHED` status in the system.
            </p>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
