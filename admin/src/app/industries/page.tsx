"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/shell/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Search,
  Plus,
  ArrowUpRight,
  RefreshCw,
  MoreVertical,
  CheckCircle,
  EyeOff,
  Archive,
  RotateCcw,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";

interface IndustryListItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  accent: "BLUE" | "TEAL" | "VIOLET";
  badge: string | null;
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  everPublished: boolean;
  version: number;
  showInOverview: boolean;
  showInMegaMenu: boolean;
  showInHomepage: boolean;
  showInFooter: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

interface IndustryStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  categoriesCount: number;
}

const ACCENT_SWATCHES: Record<string, { bg: string; text: string; dot: string }> = {
  BLUE: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-600" },
  TEAL: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-600" },
  VIOLET: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-600" },
};

export default function IndustriesPage() {
  const router = useRouter();
  const [industries, setIndustries] = useState<IndustryListItem[]>([]);
  const [stats, setStats] = useState<IndustryStats>({
    total: 0,
    published: 0,
    drafts: 0,
    archived: 0,
    categoriesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // New industry modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newCategory, setNewCategory] = useState("Retail Models");
  const [newAccent, setNewAccent] = useState<"BLUE" | "TEAL" | "VIOLET">("BLUE");
  const [newSummary, setNewSummary] = useState("");
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState("");

  const loadIndustries = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (categoryFilter !== "ALL") params.set("category", categoryFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await apiClient.get<{ items: IndustryListItem[]; stats: IndustryStats }>(
        `/admin/industries?${params.toString()}`
      );
      setIndustries(res.items || []);
      if (res.stats) setStats(res.stats);
    } catch (err: any) {
      console.error("Failed to load industries", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, search]);

  useEffect(() => {
    loadIndustries();
  }, [loadIndustries]);

  const handleNameChange = (val: string) => {
    setNewName(val);
    if (!newSlug || newSlug === val.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, -1)) {
      setNewSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const handleCreateIndustry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) {
      setModalError("Industry Name and Slug are required.");
      return;
    }
    try {
      setCreating(true);
      setModalError("");
      const created = await apiClient.post<IndustryListItem>("/admin/industries", {
        name: newName.trim(),
        slug: newSlug.trim(),
        category: newCategory,
        accent: newAccent,
        summary: newSummary.trim() || `Enterprise operational software tailored for ${newName}.`,
        showInOverview: true,
        showInMegaMenu: false,
        showInHomepage: false,
        showInFooter: false,
      });

      setIsModalOpen(false);
      router.push(`/industries/${created.id}/edit`);
    } catch (err: any) {
      setModalError(err.message || "Failed to create industry.");
    } finally {
      setCreating(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      setActionLoadingId(id);
      await apiClient.post(`/admin/industries/${id}/publish`);
      await loadIndustries();
    } catch (err: any) {
      alert(`Publish failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUnpublish = async (id: string) => {
    if (!confirm("Are you sure you want to unpublish this industry? Its deep page will return 404.")) return;
    try {
      setActionLoadingId(id);
      await apiClient.post(`/admin/industries/${id}/unpublish`);
      await loadIndustries();
    } catch (err: any) {
      alert(`Unpublish failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this industry? It will be unpublished and hidden from public views.")) return;
    try {
      setActionLoadingId(id);
      await apiClient.post(`/admin/industries/${id}/archive`);
      await loadIndustries();
    } catch (err: any) {
      alert(`Archive failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setActionLoadingId(id);
      await apiClient.post(`/admin/industries/${id}/restore`);
      await loadIndustries();
    } catch (err: any) {
      alert(`Restore failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (industry: IndustryListItem) => {
    if (industry.everPublished) {
      alert("This industry was previously published and cannot be hard-deleted to preserve SEO integrity. Use Archive instead.");
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete draft "${industry.name}"? This cannot be undone.`)) return;
    try {
      setActionLoadingId(industry.id);
      await apiClient.delete(`/admin/industries/${industry.id}`);
      await loadIndustries();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <AdminShell>
      <PageHeader
        title="Vertical Industries"
        subtitle="Configure vertical landing pages, operational proof stories, and industry-specific workflows."
        breadcrumbs={[{ label: "Website" }, { label: "Industries" }]}
        badge={stats.total}
        actions={
          <button
            onClick={() => {
              setNewName("");
              setNewSlug("");
              setNewSummary("");
              setNewAccent("BLUE");
              setModalError("");
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Industry</span>
          </button>
        }
      />

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-5">
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Industries</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
            <span className="text-xs text-slate-500">{stats.categoriesCount} categories</span>
          </div>
        </div>
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">Published</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">{stats.published}</span>
            <span className="text-xs text-slate-400">Live on website</span>
          </div>
        </div>
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-amber-600 uppercase tracking-wider">Drafts</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">{stats.drafts}</span>
            <span className="text-xs text-slate-400">In preparation</span>
          </div>
        </div>
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Archived</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-500">{stats.archived}</span>
            <span className="text-xs text-slate-400">Preserved for SEO</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl p-3.5 mb-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-lg text-xs">
            {["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  statusFilter === tab
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:border-[#2563EB]"
          >
            <option value="ALL">All Categories</option>
            <option value="Retail Models">Retail Models</option>
            <option value="Networks">Networks</option>
            <option value="Consumer Goods">Consumer Goods</option>
            <option value="FMCG">FMCG</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vertical industries..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF2] bg-[#FAFBFD] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Industry / Vertical</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Deep Route</th>
                <th className="py-3 px-4">Surfaces</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF2] text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-300" />
                    Loading industries...
                  </td>
                </tr>
              ) : industries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No industries match the current filter.
                  </td>
                </tr>
              ) : (
                industries.map((ind) => {
                  const swatch = ACCENT_SWATCHES[ind.accent] || ACCENT_SWATCHES.BLUE;
                  return (
                    <tr key={ind.id} className="hover:bg-[#FAFBFD] transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${swatch.bg} ${swatch.text}`}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "currentColor" }} />
                          </div>
                          <div>
                            <Link
                              href={`/industries/${ind.id}/edit`}
                              className="font-medium text-slate-900 hover:text-[#2563EB] transition-colors flex items-center gap-1.5"
                            >
                              <span>{ind.name}</span>
                              {ind.badge && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-normal">
                                  {ind.badge}
                                </span>
                              )}
                            </Link>
                            <p className="text-[11px] text-slate-500 line-clamp-1 max-w-sm">{ind.summary}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">{ind.category}</td>

                      <td className="py-3.5 px-4">
                        <a
                          href={`http://localhost:3000/industries/${ind.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span>/industries/{ind.slug}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1">
                          {ind.showInOverview && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                              title="Visible in Overview (/industries)"
                            >
                              Overview
                            </span>
                          )}
                          {ind.showInMegaMenu && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                              title="Visible in Main Header Mega-Menu"
                            >
                              Menu
                            </span>
                          )}
                          {ind.showInHomepage && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200"
                              title="Visible in Homepage Industry Band"
                            >
                              Home
                            </span>
                          )}
                          {ind.showInFooter && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                              title="Visible in Website Footer"
                            >
                              Footer
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge
                          status={
                            ind.status === "PUBLISHED"
                              ? "PUBLISHED"
                              : ind.status === "DRAFT"
                              ? "DRAFT"
                              : "ARCHIVED"
                          }
                        />
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(ind.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/industries/${ind.id}/edit`}
                            className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-md transition-colors"
                          >
                            Edit
                          </Link>

                          {ind.status === "DRAFT" && (
                            <button
                              onClick={() => handlePublish(ind.id)}
                              disabled={actionLoadingId === ind.id}
                              className="p-1 text-slate-500 hover:text-emerald-600 transition-colors rounded hover:bg-emerald-50"
                              title="Publish Live"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {ind.status === "PUBLISHED" && (
                            <button
                              onClick={() => handleUnpublish(ind.id)}
                              disabled={actionLoadingId === ind.id}
                              className="p-1 text-slate-500 hover:text-amber-600 transition-colors rounded hover:bg-amber-50"
                              title="Unpublish to Draft"
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {ind.status !== "ARCHIVED" ? (
                            <button
                              onClick={() => handleArchive(ind.id)}
                              disabled={actionLoadingId === ind.id}
                              className="p-1 text-slate-400 hover:text-slate-700 transition-colors rounded hover:bg-slate-100"
                              title="Archive Industry"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestore(ind.id)}
                              disabled={actionLoadingId === ind.id}
                              className="p-1 text-slate-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
                              title="Restore to Draft"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {!ind.everPublished && (
                            <button
                              onClick={() => handleDelete(ind)}
                              disabled={actionLoadingId === ind.id}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors rounded hover:bg-rose-50"
                              title="Permanently Delete Draft"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Industry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Create Vertical Industry</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Initialize a new industry vertical with structured sections and safe surface visibility.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateIndustry} className="p-5 space-y-4">
              {modalError && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Industry Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Specialty Food & Beverage"
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Slug (Immutable once published) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    placeholder="food-beverage"
                    className="w-full px-3 py-2 text-xs font-mono bg-[#FAFBFD] border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="Retail Models">Retail Models</option>
                    <option value="Networks">Networks</option>
                    <option value="Consumer Goods">Consumer Goods</option>
                    <option value="FMCG">FMCG</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Accent Theme</label>
                <div className="flex gap-2">
                  {(["BLUE", "TEAL", "VIOLET"] as const).map((acc) => (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => setNewAccent(acc)}
                      className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                        newAccent === acc
                          ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-2xs font-bold"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${ACCENT_SWATCHES[acc].dot}`} />
                      <span>{acc.charAt(0) + acc.slice(1).toLowerCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Summary / Deck Headline</label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Unified stock visibility, batch tracking, and sub-second retail checkout."
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block">
                  Safe Surface Visibility Defaults
                </span>
                <p className="text-[11px] text-slate-500">
                  By default, new industries appear on the <strong>/industries overview deck</strong> upon publishing. Mega-menu, homepage, and footer visibility are kept inactive to prevent menu bloat until manually configured.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors disabled:opacity-50"
                >
                  {creating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{creating ? "Creating..." : "Create & Edit Industry"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
