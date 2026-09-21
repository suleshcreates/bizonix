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
  ShieldCheck,
  Building2,
  ScanBarcode,
  Truck,
  Store,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { ImageUploadSelector } from "@/components/ui/image-upload-selector";

interface EditIndustryPageProps {
  params: Promise<{ id: string }>;
}

const HERO_ICON_OPTIONS = [
  "scanBarcode",
  "store",
  "layers",
  "boxes",
  "receipt",
  "packageCheck",
  "badgeCheck",
  "building",
  "truck",
  "wallet",
  "shirt",
  "gem",
  "ruler",
  "network",
  "arrowUpRight",
];

export default function EditIndustryPage({ params }: EditIndustryPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Industry state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Retail Models");
  const [accent, setAccent] = useState<"BLUE" | "TEAL" | "VIOLET">("BLUE");
  const [badge, setBadge] = useState("");
  const [summary, setSummary] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">("DRAFT");
  const [everPublished, setEverPublished] = useState(false);
  const [version, setVersion] = useState(1);

  // Surface flags
  const [showInOverview, setShowInOverview] = useState(true);
  const [showInMegaMenu, setShowInMegaMenu] = useState(false);
  const [showInHomepage, setShowInHomepage] = useState(false);
  const [showInFooter, setShowInFooter] = useState(false);

  // Deep Content JSON
  const [content, setContent] = useState<any>({});

  useEffect(() => {
    async function fetchIndustry() {
      try {
        setLoading(true);
        const data = await apiClient.get<any>(`/admin/industries/${id}`);
        setName(data.name || "");
        setSlug(data.slug || "");
        setCategory(data.category || "Retail Models");
        setAccent(data.accent || "BLUE");
        setBadge(data.badge || "");
        setSummary(data.summary || "");
        setSortOrder(data.sortOrder || 1);
        setStatus(data.status || "DRAFT");
        setEverPublished(Boolean(data.everPublished));
        setVersion(data.version || 1);

        setShowInOverview(data.showInOverview ?? true);
        setShowInMegaMenu(data.showInMegaMenu ?? false);
        setShowInHomepage(data.showInHomepage ?? false);
        setShowInFooter(data.showInFooter ?? false);

        setContent(data.content || {});
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to load industry details.");
      } finally {
        setLoading(false);
      }
    }
    fetchIndustry();
  }, [id]);

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const payload = {
        name,
        category,
        summary,
        accent,
        badge: badge || null,
        showInOverview,
        showInMegaMenu,
        showInHomepage,
        showInFooter,
        content,
        expectedVersion: version,
      };

      const updated = await apiClient.patch<any>(`/admin/industries/${id}`, payload);
      setVersion(updated.version);
      setSuccessMessage("Changes saved successfully.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (
      !confirm(
        "Are you sure you want to publish this industry? All changes will immediately go live on the storefront.",
      )
    )
      return;

    try {
      setPublishing(true);
      setErrorMessage("");
      setSuccessMessage("");

      // First save current form changes
      await apiClient.patch<any>(`/admin/industries/${id}`, {
        name,
        category,
        summary,
        accent,
        badge: badge || null,
        showInOverview,
        showInMegaMenu,
        showInHomepage,
        showInFooter,
        content,
        expectedVersion: version,
      });

      // Then publish
      const published = await apiClient.post<any>(`/admin/industries/${id}/publish`);
      setStatus(published.status);
      setEverPublished(true);
      setVersion(published.version);
      setSuccessMessage("Industry published successfully! It is now live on the website.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to publish industry.");
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (
      !confirm(
        "Are you sure you want to unpublish this industry? Its deep page will immediately return 404.",
      )
    )
      return;

    try {
      setPublishing(true);
      const unpublished = await apiClient.post<any>(`/admin/industries/${id}/unpublish`);
      setStatus(unpublished.status);
      setVersion(unpublished.version);
      setSuccessMessage("Industry unpublished and returned to draft.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to unpublish.");
    } finally {
      setPublishing(false);
    }
  };

  const updateContentSection = (sectionKey: string, sectionData: any) => {
    setContent((prev: any) => ({
      ...prev,
      [sectionKey]: sectionData,
    }));
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="py-24 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading industry configuration...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-200 -mx-6 -mt-6 px-6 py-4 mb-6 sticky top-0 z-20 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/industries"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900">{name || "Untitled Industry"}</h1>
                <StatusBadge
                  status={
                    status === "PUBLISHED" ? "PUBLISHED" : status === "DRAFT" ? "DRAFT" : "ARCHIVED"
                  }
                />
                <span className="text-[11px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                  v{version}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">/industries/{slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status === "PUBLISHED" && (
              <a
                href={`http://localhost:3000/industries/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}

            <button
              onClick={handleSaveDraft}
              disabled={saving || publishing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save Draft"}</span>
            </button>

            {status === "PUBLISHED" ? (
              <button
                onClick={handleUnpublish}
                disabled={saving || publishing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
              >
                <span>Unpublish</span>
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={saving || publishing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{publishing ? "Publishing..." : "Publish Industry"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mt-3 p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mt-3 p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mt-4 overflow-x-auto border-t border-slate-100 pt-2 text-xs">
          {[
            { id: "overview", label: "Overview & Surfaces" },
            { id: "hero", label: "Hero Stage" },
            { id: "stats", label: "Floating Stats & Cards" },
            { id: "pains", label: "Operational Pains" },
            { id: "fit", label: "Module Ecosystem" },
            { id: "workflow", label: "Operating Day Stepper" },
            { id: "proof", label: "Customer Proof Story" },
            { id: "seo", label: "SEO & Social" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview & Surface Visibility */}
      {activeTab === "overview" && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Identity & Taxonomy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Industry Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Slug {everPublished && <span className="text-amber-600 font-normal">(Locked)</span>}
                </label>
                <input
                  type="text"
                  value={slug}
                  disabled={everPublished}
                  onChange={(e) => setSlug(e.target.value)}
                  className={`w-full px-3 py-2 text-xs font-mono border rounded-lg focus:outline-none ${
                    everPublished
                      ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-[#FAFBFD] border-slate-200 focus:border-blue-600"
                  }`}
                />
                {everPublished && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Slug cannot be changed once published to preserve external SEO backlinks.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Accent Theme</label>
                <select
                  value={accent}
                  onChange={(e) => setAccent(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value="BLUE">Blue (Apparel / Classic)</option>
                  <option value="TEAL">Teal (Jewellery / Precision)</option>
                  <option value="VIOLET">Violet (Franchise / Networks)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Badge / Tagline</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Size & Colour Matrix"
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Summary / Overview Deck Description
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Industry Overview / Directory Card Image */}
            <div className="pt-3 border-t border-slate-100">
              <ImageUploadSelector
                value={content.overviewImage || ""}
                onChange={(url) => updateContentSection("overviewImage", url)}
                label="Industry Overview Card Image (Optional)"
                hint="Visual asset displayed on the /industries directory deck for this retail model."
                aspect="wide"
              />
            </div>
          </div>

          {/* Surface Visibility Switches */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Surface Visibility Controls
            </h3>
            <p className="text-xs text-slate-500">
              Control where this industry appears across storefront navigational surfaces without code deployments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInOverview}
                  onChange={(e) => setShowInOverview(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Show in Overview Deck (/industries)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Includes this industry in the directory and SEO ItemList schema.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInMegaMenu}
                  onChange={(e) => setShowInMegaMenu(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Show in Main Header Mega-Menu
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Renders in the top navigation Industries dropdown.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInHomepage}
                  onChange={(e) => setShowInHomepage(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Show in Homepage Industry Band
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Featured in the homepage merchandise operations showcase.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInFooter}
                  onChange={(e) => setShowInFooter(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Show in Global Footer
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Appears under the Industries column in the site footer.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hero Stage */}
      {activeTab === "hero" && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Hero Headlines & Copy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Eyebrow Label</label>
                <input
                  type="text"
                  value={content.hero?.eyebrowLabel || ""}
                  onChange={(e) =>
                    updateContentSection("hero", {
                      ...content.hero,
                      eyebrowLabel: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Background Watermark Label
                </label>
                <input
                  type="text"
                  value={content.hero?.bgLabel || ""}
                  onChange={(e) =>
                    updateContentSection("hero", {
                      ...content.hero,
                      bgLabel: e.target.value,
                    })
                  }
                  placeholder="e.g. From supply to shop floor"
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subhead Lede Copy
              </label>
              <textarea
                rows={3}
                value={content.hero?.subheadText || ""}
                onChange={(e) =>
                  updateContentSection("hero", {
                    ...content.hero,
                    subheadText: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Headline Parts Builder */}
            <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">
                  Headline Segments (Word-by-word Accents & Linebreaks)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const parts = content.hero?.headlineParts || [];
                    updateContentSection("hero", {
                      ...content.hero,
                      headlineParts: [...parts, { text: "new segment", breakAfter: false }],
                    });
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Segment</span>
                </button>
              </div>

              <div className="space-y-2">
                {(content.hero?.headlineParts || []).map((part: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <input
                      type="text"
                      value={part.text}
                      onChange={(e) => {
                        const parts = [...(content.hero?.headlineParts || [])];
                        parts[idx] = { ...parts[idx], text: e.target.value };
                        updateContentSection("hero", { ...content.hero, headlineParts: parts });
                      }}
                      className="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded focus:outline-none"
                    />
                    <select
                      value={part.accent || "none"}
                      onChange={(e) => {
                        const parts = [...(content.hero?.headlineParts || [])];
                        parts[idx] = {
                          ...parts[idx],
                          accent: e.target.value === "none" ? undefined : e.target.value,
                        };
                        updateContentSection("hero", { ...content.hero, headlineParts: parts });
                      }}
                      className="px-2 py-1 text-xs border border-slate-200 rounded text-slate-700"
                    >
                      <option value="none">Standard</option>
                      <option value="blue">Blue Accent</option>
                      <option value="teal">Teal Accent</option>
                    </select>
                    <label className="flex items-center gap-1 text-[11px] text-slate-600 whitespace-nowrap cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(part.breakAfter)}
                        onChange={(e) => {
                          const parts = [...(content.hero?.headlineParts || [])];
                          parts[idx] = { ...parts[idx], breakAfter: e.target.checked };
                          updateContentSection("hero", { ...content.hero, headlineParts: parts });
                        }}
                        className="rounded text-blue-600"
                      />
                      <span>Break Line</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const parts = (content.hero?.headlineParts || []).filter((_: any, i: number) => i !== idx);
                        updateContentSection("hero", { ...content.hero, headlineParts: parts });
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary CTA Label</label>
                <input
                  type="text"
                  value={content.hero?.primaryCta?.label || ""}
                  onChange={(e) =>
                    updateContentSection("hero", {
                      ...content.hero,
                      primaryCta: { ...content.hero?.primaryCta, label: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary CTA URL</label>
                <input
                  type="text"
                  value={content.hero?.primaryCta?.href || ""}
                  onChange={(e) =>
                    updateContentSection("hero", {
                      ...content.hero,
                      primaryCta: { ...content.hero?.primaryCta, href: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs font-mono bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Hero Image */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <ImageUploadSelector
                value={content.hero?.heroImage?.src || ""}
                onChange={(newUrl) =>
                  updateContentSection("hero", {
                    ...content.hero,
                    heroImage: { ...content.hero?.heroImage, src: newUrl },
                  })
                }
                label="Hero Showcase Visual / Screen Capture"
                hint="Upload PNG, WebP, or SVG visual for this industry's hero stage."
                aspect="wide"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Image Alt Text</label>
                <input
                  type="text"
                  placeholder="e.g. Bizonix Retail POS interface on counter"
                  value={content.hero?.heroImage?.alt || ""}
                  onChange={(e) =>
                    updateContentSection("hero", {
                      ...content.hero,
                      heroImage: { ...content.hero?.heroImage, alt: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Floating Stats & Cards */}
      {activeTab === "stats" && (
        <div className="space-y-6 max-w-4xl">
          {/* Trust Stats (3 items) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Trust Stats (3 Horizontal Badges)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(content.hero?.trustStats || []).map((stat: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Stat 0{idx + 1}</span>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Icon</label>
                    <select
                      value={stat.icon}
                      onChange={(e) => {
                        const stats = [...(content.hero?.trustStats || [])];
                        stats[idx] = { ...stats[idx], icon: e.target.value };
                        updateContentSection("hero", { ...content.hero, trustStats: stats });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                    >
                      {HERO_ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const stats = [...(content.hero?.trustStats || [])];
                        stats[idx] = { ...stats[idx], label: e.target.value };
                        updateContentSection("hero", { ...content.hero, trustStats: stats });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Value</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const stats = [...(content.hero?.trustStats || [])];
                        stats[idx] = { ...stats[idx], value: e.target.value };
                        updateContentSection("hero", { ...content.hero, trustStats: stats });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Top-Right 3 Stats */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Floating Numerical Stats Card (Top-Right)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(content.hero?.floatingStatsCardTopRight || []).map((row: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Metric 0{idx + 1}</span>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Label</label>
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) => {
                        const rows = [...(content.hero?.floatingStatsCardTopRight || [])];
                        rows[idx] = { ...rows[idx], label: e.target.value };
                        updateContentSection("hero", { ...content.hero, floatingStatsCardTopRight: rows });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600">Value (Number)</label>
                    <input
                      type="number"
                      value={row.value}
                      onChange={(e) => {
                        const rows = [...(content.hero?.floatingStatsCardTopRight || [])];
                        rows[idx] = { ...rows[idx], value: parseInt(e.target.value, 10) || 0 };
                        updateContentSection("hero", { ...content.hero, floatingStatsCardTopRight: rows });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600">Suffix</label>
                      <input
                        type="text"
                        value={row.suffix || ""}
                        onChange={(e) => {
                          const rows = [...(content.hero?.floatingStatsCardTopRight || [])];
                          rows[idx] = { ...rows[idx], suffix: e.target.value };
                          updateContentSection("hero", { ...content.hero, floatingStatsCardTopRight: rows });
                        }}
                        placeholder="%"
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600">Trend</label>
                      <input
                        type="text"
                        value={row.trend?.label || ""}
                        onChange={(e) => {
                          const rows = [...(content.hero?.floatingStatsCardTopRight || [])];
                          rows[idx] = { ...rows[idx], trend: { direction: "up", label: e.target.value } };
                          updateContentSection("hero", { ...content.hero, floatingStatsCardTopRight: rows });
                        }}
                        placeholder="8%"
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Operational Pressures */}
      {activeTab === "pains" && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Section Heading & Lede
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={content.painsIntro?.eyebrow || "Where clarity breaks"}
                  onChange={(e) =>
                    updateContentSection("painsIntro", {
                      ...content.painsIntro,
                      eyebrow: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={content.painsIntro?.title || `${name} carries more context than a stock number can hold.`}
                  onChange={(e) =>
                    updateContentSection("painsIntro", {
                      ...content.painsIntro,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Introductory Lede</label>
              <textarea
                rows={2}
                value={content.painsIntro?.lede || ""}
                onChange={(e) =>
                  updateContentSection("painsIntro", {
                    ...content.painsIntro,
                    lede: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Operational Pain Points
              </h3>
              <button
                type="button"
                onClick={() => {
                  const pains = content.pains || [];
                  updateContentSection("pains", [
                    ...pains,
                    { title: "New operational pressure", body: "Description of where friction occurs." },
                  ]);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Pressure</span>
              </button>
            </div>

            <div className="space-y-3">
              {(content.pains || []).map((pain: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pressure 0{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const pains = (content.pains || []).filter((_: any, i: number) => i !== idx);
                        updateContentSection("pains", pains);
                      }}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={pain.title}
                      onChange={(e) => {
                        const pains = [...(content.pains || [])];
                        pains[idx] = { ...pains[idx], title: e.target.value };
                        updateContentSection("pains", pains);
                      }}
                      className="w-full px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white"
                      placeholder="Title"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      value={pain.body}
                      onChange={(e) => {
                        const pains = [...(content.pains || [])];
                        pains[idx] = { ...pains[idx], body: e.target.value };
                        updateContentSection("pains", pains);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      placeholder="Detailed explanation"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Module Fit */}
      {activeTab === "fit" && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              How Bizonix Fits
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={content.fit?.title || ""}
                  onChange={(e) =>
                    updateContentSection("fit", { ...content.fit, title: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lede Copy</label>
                <input
                  type="text"
                  value={content.fit?.body || ""}
                  onChange={(e) =>
                    updateContentSection("fit", { ...content.fit, body: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-800">Connected System Modules</span>
                <button
                  type="button"
                  onClick={() => {
                    const mods = content.fit?.modules || [];
                    updateContentSection("fit", {
                      ...content.fit,
                      modules: [...mods, { name: "Inventory", body: "Description of module utility." }],
                    });
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Module</span>
                </button>
              </div>

              <div className="space-y-3">
                {(content.fit?.modules || []).map((mod: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Module 0{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const mods = (content.fit?.modules || []).filter((_: any, i: number) => i !== idx);
                          updateContentSection("fit", { ...content.fit, modules: mods });
                        }}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          value={mod.name}
                          onChange={(e) => {
                            const mods = [...(content.fit?.modules || [])];
                            mods[idx] = { ...mods[idx], name: e.target.value };
                            updateContentSection("fit", { ...content.fit, modules: mods });
                          }}
                          className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
                          placeholder="Module Name (e.g. Inventory)"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={mod.body}
                          onChange={(e) => {
                            const mods = [...(content.fit?.modules || [])];
                            mods[idx] = { ...mods[idx], body: e.target.value };
                            updateContentSection("fit", { ...content.fit, modules: mods });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                          placeholder="How it supports this vertical"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Operating Day Stepper */}
      {activeTab === "workflow" && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Operating Day Stepper Steps
                </h3>
                <p className="text-xs text-slate-500">
                  Sequential stages in daily enterprise operations, showing connected ERP subsystems.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const steps = content.workflow || [];
                  const orderNum = String(steps.length + 1).padStart(2, "0");
                  updateContentSection("workflow", [
                    ...steps,
                    {
                      order: orderNum,
                      title: "New Operational Step",
                      body: "Step description.",
                      systems: ["Inventory"],
                      image: "/images/industries/overview/apparel-operations.webp",
                      alt: "Step workflow preview",
                    },
                  ]);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-3">
              {(content.workflow || []).map((step: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">Step {step.order || `0${idx + 1}`}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const steps = (content.workflow || []).filter((_: any, i: number) => i !== idx);
                        updateContentSection("workflow", steps);
                      }}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Order #</label>
                      <input
                        type="text"
                        value={step.order}
                        onChange={(e) => {
                          const steps = [...(content.workflow || [])];
                          steps[idx] = { ...steps[idx], order: e.target.value };
                          updateContentSection("workflow", steps);
                        }}
                        className="w-full px-2 py-1.5 text-xs font-mono border border-slate-200 rounded bg-white"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => {
                          const steps = [...(content.workflow || [])];
                          steps[idx] = { ...steps[idx], title: e.target.value };
                          updateContentSection("workflow", steps);
                        }}
                        className="w-full px-2 py-1.5 text-xs font-medium border border-slate-200 rounded bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Body</label>
                    <textarea
                      rows={2}
                      value={step.body}
                      onChange={(e) => {
                        const steps = [...(content.workflow || [])];
                        steps[idx] = { ...steps[idx], body: e.target.value };
                        updateContentSection("workflow", steps);
                      }}
                      className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Connected Systems (comma separated)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(step.systems) ? step.systems.join(", ") : ""}
                        onChange={(e) => {
                          const steps = [...(content.workflow || [])];
                          steps[idx] = {
                            ...steps[idx],
                            systems: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          };
                          updateContentSection("workflow", steps);
                        }}
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded bg-white"
                        placeholder="Inventory, Sales & POS"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 space-y-2">
                    <ImageUploadSelector
                      value={step.image || ""}
                      onChange={(url) => {
                        const steps = [...(content.workflow || [])];
                        steps[idx] = { ...steps[idx], image: url };
                        updateContentSection("workflow", steps);
                      }}
                      label={`Step ${step.order || idx + 1} Operational Screen / Diagram`}
                      hint="Upload an interface capture or visual workflow diagram demonstrating this step."
                      aspect="wide"
                    />
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Image Alt Text
                      </label>
                      <input
                        type="text"
                        value={step.alt || ""}
                        placeholder="e.g. Inbound receipt and barcode tagging interface"
                        onChange={(e) => {
                          const steps = [...(content.workflow || [])];
                          steps[idx] = { ...steps[idx], alt: e.target.value };
                          updateContentSection("workflow", steps);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Customer Proof */}
      {activeTab === "proof" && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Operational Proof / Before & After Case
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Story Label</label>
                <input
                  type="text"
                  value={content.proof?.label || "Operational proof"}
                  onChange={(e) =>
                    updateContentSection("proof", { ...content.proof, label: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={content.proof?.title || ""}
                  onChange={(e) =>
                    updateContentSection("proof", { ...content.proof, title: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Without One Record (Before)
                </label>
                <textarea
                  rows={3}
                  value={content.proof?.before || ""}
                  onChange={(e) =>
                    updateContentSection("proof", { ...content.proof, before: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  With Bizonix (After)
                </label>
                <textarea
                  rows={3}
                  value={content.proof?.after || ""}
                  onChange={(e) =>
                    updateContentSection("proof", { ...content.proof, after: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                The Turning Point
              </label>
              <input
                type="text"
                value={content.proof?.turningPoint || ""}
                onChange={(e) =>
                  updateContentSection("proof", { ...content.proof, turningPoint: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <ImageUploadSelector
                value={content.proof?.image || ""}
                onChange={(url) =>
                  updateContentSection("proof", { ...content.proof, image: url })
                }
                label="Customer Proof / Case Study Image"
                hint="Upload an authentic customer floor capture, executive proof visual, or operational result."
                aspect="wide"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proof Image Alt Text</label>
                <input
                  type="text"
                  value={content.proof?.alt || ""}
                  placeholder="e.g. Franchise retail manager reviewing inventory in a contemporary store"
                  onChange={(e) =>
                    updateContentSection("proof", { ...content.proof, alt: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: SEO & Meta */}
      {activeTab === "seo" && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Search Engine Optimization (SEO) & Social Sharing
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Meta Page Title</label>
              <input
                type="text"
                value={content.seo?.metaTitle || ""}
                onChange={(e) =>
                  updateContentSection("seo", { ...content.seo, metaTitle: e.target.value })
                }
                placeholder="e.g. Specialty Food & Beverage ERP Software | Bizonix"
                className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Meta Description (140 - 165 characters recommended)
              </label>
              <textarea
                rows={3}
                value={content.seo?.metaDescription || ""}
                onChange={(e) =>
                  updateContentSection("seo", { ...content.seo, metaDescription: e.target.value })
                }
                className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">OpenGraph Title</label>
                <input
                  type="text"
                  value={content.seo?.ogTitle || ""}
                  onChange={(e) =>
                    updateContentSection("seo", { ...content.seo, ogTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">OpenGraph Description</label>
                <input
                  type="text"
                  value={content.seo?.ogDescription || ""}
                  onChange={(e) =>
                    updateContentSection("seo", { ...content.seo, ogDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Social Share Image */}
            <div className="pt-3 border-t border-slate-100">
              <ImageUploadSelector
                value={content.seo?.ogImage || ""}
                onChange={(url) =>
                  updateContentSection("seo", { ...content.seo, ogImage: url })
                }
                label="Social Share Image (OpenGraph / Twitter Preview)"
                hint="Recommended dimensions: 1200x630 PNG or WebP. Displayed when link is previewed on social media."
                aspect="wide"
              />
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
