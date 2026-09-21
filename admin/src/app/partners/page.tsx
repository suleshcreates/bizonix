"use client";

import React, { useState, useEffect, useTransition } from "react";
import { AdminShell } from "@/components/shell/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ImageUploadSelector } from "@/components/ui/image-upload-selector";
import { apiClient } from "@/lib/api/client";
import {
  Search,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  ExternalLink,
  Settings2,
  Check,
  X,
  Sparkles,
  Sliders,
  Layers,
  Play,
  Pause,
  Eye,
  RefreshCw,
  Globe,
  Building2,
  CreditCard,
  Truck,
  Cloud,
  Database,
  Users,
  Receipt,
  PackageCheck,
} from "lucide-react";

interface Partner {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  websiteUrl?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  sortOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PartnersConfig {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  speedSeconds?: number;
  showOnHomepage?: boolean;
}

const DEFAULT_CONFIG: PartnersConfig = {
  eyebrow: "TRUSTED ECOSYSTEM",
  title: "Integrated with Leading Platforms & Networks",
  subtitle:
    "Seamless bidirectional connectivity with premier payment gateways, logistics aggregators, hardware terminals, and enterprise cloud systems.",
  speedSeconds: 35,
  showOnHomepage: true,
};

const PRESET_LOGOS = [
  { name: "Razorpay", url: "/images/partners/razorpay.svg" },
  { name: "AWS", url: "/images/partners/aws.svg" },
  { name: "Stripe", url: "/images/partners/stripe.svg" },
  { name: "Pine Labs", url: "/images/partners/pinelabs.svg" },
  { name: "Delhivery", url: "/images/partners/delhivery.svg" },
  { name: "SAP ERP", url: "/images/partners/sap.svg" },
  { name: "Salesforce", url: "/images/partners/salesforce.svg" },
  { name: "Shiprocket", url: "/images/partners/shiprocket.svg" },
  { name: "Zoho", url: "/images/partners/zoho.svg" },
  { name: "HDFC Bank", url: "/images/partners/hdfc.svg" },
];

function getPartnerLogoUrl(partner: { name: string; slug?: string; logoUrl?: string | null }) {
  if (partner.logoUrl && partner.logoUrl.trim() !== "") return partner.logoUrl;
  const n = (partner.name || "").toLowerCase();
  const match = PRESET_LOGOS.find((l) => n.includes(l.name.toLowerCase()));
  if (match) return match.url;
  return "/images/partners/razorpay.svg";
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [config, setConfig] = useState<PartnersConfig>(DEFAULT_CONFIG);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSuccess, setConfigSuccess] = useState(false);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    websiteUrl: "",
    description: "",
    logoUrl: "",
    sortOrder: 0,
    isFeatured: false,
    isPublished: true,
  });
  const [savingPartner, setSavingPartner] = useState(false);
  const [partnerError, setPartnerError] = useState("");

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient.get("/admin/partners").catch(() => null);
      if (res) {
        if (Array.isArray(res)) {
          setPartners(res);
        } else if (Array.isArray(res.items)) {
          setPartners(res.items);
        }
        if (res.config && typeof res.config === "object") {
          setConfig((prev) => ({ ...prev, ...res.config }));
        }
      }
    } catch (err) {
      console.error("Failed to load partners data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered partners
  const filtered = partners.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  // Handle section config save
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingConfig(true);
      setConfigSuccess(false);
      const res = await apiClient.put<PartnersConfig>("/admin/partners/config", config);
      if (res) {
        setConfig((prev) => ({ ...prev, ...res }));
      }
      setConfigSuccess(true);
      setTimeout(() => setConfigSuccess(false), 3000);
    } catch (err: any) {
      alert(err?.message || "Failed to save marquee settings.");
    } finally {
      setSavingConfig(false);
    }
  };

  // Open Create/Edit modal
  const openCreateModal = () => {
    setEditingPartner(null);
    setFormData({
      name: "",
      category: "",
      websiteUrl: "",
      description: "",
      logoUrl: "",
      sortOrder: partners.length,
      isFeatured: false,
      isPublished: true,
    });
    setPartnerError("");
    setModalOpen(true);
  };

  const openEditModal = (p: Partner) => {
    setEditingPartner(p);
    setFormData({
      name: p.name,
      category: p.category || "",
      websiteUrl: p.websiteUrl || "",
      description: p.description || "",
      logoUrl: p.logoUrl || "",
      sortOrder: p.sortOrder,
      isFeatured: p.isFeatured,
      isPublished: p.isPublished,
    });
    setPartnerError("");
    setModalOpen(true);
  };

  // Save Partner (Create or Update)
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setPartnerError("Partner name is required.");
      return;
    }

    try {
      setSavingPartner(true);
      setPartnerError("");

      if (editingPartner) {
        // Update
        const updated = await apiClient.patch<Partner>(
          `/admin/partners/${editingPartner.id}`,
          formData
        );
        setPartners((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
      } else {
        // Create
        const created = await apiClient.post<Partner>("/admin/partners", formData);
        setPartners((prev) => [...prev, created]);
      }

      setModalOpen(false);
    } catch (err: any) {
      setPartnerError(err?.message || "Failed to save partner.");
    } finally {
      setSavingPartner(false);
    }
  };

  // Toggle Publish status
  const handleTogglePublish = async (partner: Partner) => {
    const nextStatus = !partner.isPublished;
    // Optimistic update
    setPartners((prev) =>
      prev.map((p) => (p.id === partner.id ? { ...p, isPublished: nextStatus } : p))
    );

    try {
      await apiClient.patch(`/admin/partners/${partner.id}`, {
        isPublished: nextStatus,
      });
    } catch (err) {
      // Revert on error
      setPartners((prev) =>
        prev.map((p) => (p.id === partner.id ? { ...p, isPublished: partner.isPublished } : p))
      );
      alert("Failed to update status.");
    }
  };

  // Delete partner
  const handleDeletePartner = async (id: string) => {
    try {
      await apiClient.delete(`/admin/partners/${id}`);
      setPartners((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert(err?.message || "Failed to delete partner.");
    }
  };

  // Move Partner Up/Down
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= partners.length) return;

    const newPartners = [...partners];
    const temp = newPartners[index];
    newPartners[index] = newPartners[targetIndex];
    newPartners[targetIndex] = temp;

    // Update sortOrder values
    const reordered = newPartners.map((p, idx) => ({ ...p, sortOrder: idx }));
    setPartners(reordered);

    try {
      await apiClient.post("/admin/partners/reorder", {
        ids: reordered.map((p) => p.id),
      });
    } catch (err) {
      console.error("Failed to persist order:", err);
    }
  };

  const activeCount = partners.filter((p) => p.isPublished).length;
  const featuredCount = partners.filter((p) => p.isFeatured).length;

  return (
    <AdminShell>
      <PageHeader
        title="Partners Ecosystem"
        subtitle="Manage brand logos, system integrators, and infinite marquee configuration on the homepage."
        breadcrumbs={[{ label: "Website" }, { label: "Partners" }]}
        badge={partners.length}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                showConfigDrawer
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Marquee Settings</span>
            </button>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Partner</span>
            </button>
          </div>
        }
      />

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Partners
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {partners.length}
          </span>
        </div>
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Live on Storefront
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {activeCount}
          </span>
        </div>
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Featured Marks
          </span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">
            {featuredCount}
          </span>
        </div>
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Homepage Status
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                config.showOnHomepage ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
              }`}
            />
            <span className="text-xs font-bold text-slate-800">
              {config.showOnHomepage ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>

      {/* Section Settings Panel (Collapsible) */}
      {showConfigDrawer && (
        <div className="bg-white border border-[#2563EB]/20 rounded-xl p-5 mb-6 shadow-sm ring-1 ring-[#2563EB]/10">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Homepage Logo Ribbon Controls
                </h3>
                <p className="text-[11px] text-slate-500">
                  Configure the continuous scrolling velocity and storefront visibility of the brand logos marquee.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowConfigDrawer(false)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Marquee Scroll Velocity ({config.speedSeconds || 32}s per continuous loop)
              </label>
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-xs text-slate-500 font-medium">Faster (10s)</span>
                <input
                  type="range"
                  min={10}
                  max={80}
                  step={2}
                  value={config.speedSeconds || 32}
                  onChange={(e) =>
                    setConfig({ ...config, speedSeconds: Number(e.target.value) })
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-xs text-slate-500 font-medium">Slower (80s)</span>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md min-w-[50px] text-center">
                  {config.speedSeconds || 32}s
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showOnHomepage !== false}
                  onChange={(e) =>
                    setConfig({ ...config, showOnHomepage: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-slate-700">
                  Display Logo Marquee on Homepage (directly below Hero)
                </span>
              </label>

              <div className="flex items-center gap-3">
                {configSuccess && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Settings saved!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {savingConfig ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Live In-Console Marquee Preview */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 mb-6 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Live Marquee Preview (Homepage Simulation)
            </span>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>

        {showPreview && (
          <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/50 py-5">
            {/* Gradient Masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent z-10" />

            <div
              className="flex w-max items-center gap-4 px-4 marquee-preview-track"
              style={{
                animationDuration: `${config.speedSeconds || 35}s`,
              }}
            >
              {[...partners.filter((p) => p.isPublished), ...partners.filter((p) => p.isPublished)].map(
                (p, i) => (
                  <div
                    key={`preview-${p.id}-${i}`}
                    className="flex items-center justify-center h-12 px-6 rounded-xl bg-white border border-slate-200/80 shadow-2xs shrink-0"
                  >
                    <img
                      src={getPartnerLogoUrl(p)}
                      alt={p.name}
                      className="h-6 w-auto max-w-[120px] object-contain"
                    />
                  </div>
                )
              )}
            </div>
            <style jsx>{`
              @keyframes previewScroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .marquee-preview-track {
                animation-name: previewScroll;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Directory Table Toolbar */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl p-3.5 mb-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search partners by name, category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={loadData}
            title="Refresh list"
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <span className="text-xs text-slate-400">
            Showing {filtered.length} of {partners.length}
          </span>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF2] bg-[#FAFBFD] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3 w-12 text-center">Order</th>
                <th className="py-3 px-4">Partner Brand</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Target Website</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF2] text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading partners directory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No partners found matching "{search}".
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-[#FAFBFD] transition-colors">
                    {/* Reorder Buttons */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleMove(idx, "up")}
                          disabled={idx === 0}
                          title="Move up"
                          className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(idx, "down")}
                          disabled={idx === partners.length - 1}
                          title="Move down"
                          className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Logo & Brand Details */}
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-center shrink-0 shadow-2xs">
                          <img
                            src={getPartnerLogoUrl(p)}
                            alt={p.name}
                            className="h-5 w-auto max-w-[80px] object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          {p.description && (
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                              {p.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                        {p.category || "General"}
                      </span>
                    </td>

                    {/* Target Route */}
                    <td className="py-3.5 px-4">
                      {p.websiteUrl ? (
                        <a
                          href={p.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 hover:underline max-w-[180px] truncate"
                        >
                          <span>{p.websiteUrl.replace(/^https?:\/\//, "")}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">—</span>
                      )}
                    </td>

                    {/* Featured */}
                    <td className="py-3.5 px-4 text-center">
                      {p.isFeatured ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                          <Sparkles className="w-2.5 h-2.5" /> Featured
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                          p.isPublished
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/70"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.isPublished ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        <span>{p.isPublished ? "Published" : "Draft"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                          title="Edit Partner"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Partner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingPartner ? "Edit Partner Entry" : "Add Ecosystem Partner"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure company name, category, website, and brand mark logo.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePartner} className="p-5 space-y-4">
              {partnerError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                  {partnerError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Partner Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Razorpay, Pine Labs, Delhivery"
                    className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g. Payments, Logistics, Cloud, ERP"
                    className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website / Integration URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, websiteUrl: e.target.value })
                  }
                  placeholder="https://partner-website.com"
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Subtext (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief note about this partner or bidirectional integration..."
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Logo Upload / Selector */}
              <div>
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Quick-Select Preset Brand Logo
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_LOGOS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, logoUrl: preset.url })}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium cursor-pointer transition-colors ${
                          formData.logoUrl === preset.url
                            ? "border-blue-600 bg-blue-50 text-blue-700 font-bold ring-1 ring-blue-500/30"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="h-3.5 w-auto object-contain" />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <ImageUploadSelector
                  label="Or Upload / Custom Logo Image"
                  hint="Upload transparent SVG or PNG mark, or use file selector."
                  value={formData.logoUrl}
                  onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                  aspect="wide"
                  placeholderText="Click to select or drag & drop partner logo image"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublished: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Published on Storefront
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Highlight as Featured
                  </span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPartner}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {savingPartner
                    ? "Saving..."
                    : editingPartner
                    ? "Update Partner"
                    : "Create Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Remove Partner?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              This partner will be removed from the homepage marquee and directory.
            </p>
            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePartner(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
