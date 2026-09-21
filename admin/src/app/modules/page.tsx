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

interface ModuleListItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  outcome: string;
  themeKey: string;
  iconKey: string;
  badge: string | null;
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  everPublished: boolean;
  version: number;
  showInCatalog: boolean;
  showInMegaMenu: boolean;
  showInHomepage: boolean;
  showInFooter: boolean;
  faqCount: number;
  publishedAt: string | null;
  updatedAt: string;
}

interface ModuleStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  categoriesCount: number;
}

const THEME_SWATCHES: Record<string, { bg: string; text: string; dot: string }> = {
  CYAN: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500" },
  ORANGE: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  CORAL: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
  EMERALD: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  BLUE: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-600" },
  PURPLE: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-600" },
  PINK: { bg: "bg-pink-50", text: "text-pink-700", dot: "bg-pink-500" },
  INDIGO: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-600" },
  SLATE: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-500" },
};

export default function ModulesPage() {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleListItem[]>([]);
  const [stats, setStats] = useState<ModuleStats>({
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

  // New module modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newCategory, setNewCategory] = useState("Core Operations");
  const [newSummary, setNewSummary] = useState("");
  const [newOutcome, setNewOutcome] = useState("");
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState("");

  const loadModules = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (categoryFilter !== "ALL") params.set("category", categoryFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await apiClient.get<{ items: ModuleListItem[]; stats: ModuleStats }>(
        `/admin/modules?${params.toString()}`
      );
      setModules(res.items || []);
      if (res.stats) setStats(res.stats);
    } catch (err: any) {
      console.error("Failed to load modules", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, search]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  const handleTitleChange = (val: string) => {
    setNewTitle(val);
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

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim()) {
      setModalError("Title and Slug are required.");
      return;
    }
    try {
      setCreating(true);
      setModalError("");
      const created = await apiClient.post<ModuleListItem>("/admin/modules", {
        title: newTitle.trim(),
        slug: newSlug.trim(),
        category: newCategory,
        summary: newSummary.trim() || `${newTitle} operations for modern retail brands.`,
        outcome: newOutcome.trim() || "Unified operating control across every entity.",
        showInCatalog: true,
        showInMegaMenu: false,
        showInHomepage: false,
        showInFooter: false,
      });

      setIsModalOpen(false);
      router.push(`/modules/${created.id}/edit`);
    } catch (err: any) {
      setModalError(err.message || "Failed to create module.");
    } finally {
      setCreating(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      setActionLoadingId(id);
      await apiClient.post(`/admin/modules/${id}/publish`);
      await loadModules();
    } catch (err: any) {
      alert(`Publish failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUnpublish = async (id: string) => {
    if (!confirm("Are you sure you want to unpublish this module? It will be removed from the public website deck and its deep page will return 404.")) return;
    try {
      setActionLoadingId(id);
      await apiClient.post(`/admin/modules/${id}/unpublish`);
      await loadModules();
    } catch (err: any) {
      alert(`Unpublish failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this module? It will be unpublished and hidden from public views.")) return;
    try {
      setActionLoadingId(id);
      await apiClient.post(`/admin/modules/${id}/archive`);
      await loadModules();
    } catch (err: any) {
      alert(`Archive failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setActionLoadingId(id);
      await apiClient.post(`/admin/modules/${id}/restore`);
      await loadModules();
    } catch (err: any) {
      alert(`Restore failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (module: ModuleListItem) => {
    if (module.everPublished) {
      alert("This module was previously published and cannot be hard-deleted to preserve SEO integrity. Use Archive instead.");
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete draft "${module.title}"? This cannot be undone.`)) return;
    try {
      setActionLoadingId(module.id);
      await apiClient.delete(`/admin/modules/${module.id}`);
      await loadModules();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <AdminShell>
      <PageHeader
        title="Solutions & Modules"
        subtitle="Manage core system modules, feature capabilities, storefront presentation, and deep-page content."
        breadcrumbs={[{ label: "Website" }, { label: "Modules" }]}
        badge={stats.total}
        actions={
          <button
            onClick={() => {
              setNewTitle("");
              setNewSlug("");
              setNewSummary("");
              setNewOutcome("");
              setModalError("");
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Module</span>
          </button>
        }
      />

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-5">
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Modules</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
            <span className="text-xs text-slate-500">{stats.categoriesCount} categories</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Live on Storefront</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">{stats.published}</span>
            <span className="text-xs text-emerald-600 font-medium">Publicly Accessible</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Drafts</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">{stats.drafts}</span>
            <span className="text-xs text-amber-600 font-medium">In Progress</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Archived</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-500">{stats.archived}</span>
            <span className="text-xs text-slate-400">Recoverable</span>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl p-3.5 mb-5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === tab
                  ? "bg-[#2563EB] text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab === "ALL" ? "All Modules" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-700 focus:outline-none focus:border-[#2563EB]"
          >
            <option value="ALL">All Categories</option>
            <option value="Core Operations">Core Operations</option>
            <option value="Supply & Purchasing">Supply & Purchasing</option>
            <option value="Commerce">Commerce</option>
            <option value="Finance">Finance</option>
            <option value="Intelligence & Security">Intelligence & Security</option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, slug, summary..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <button
            onClick={() => loadModules()}
            title="Refresh"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-[#E5EAF2] rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Modules Table */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF2] bg-[#FAFBFD] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Module</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Theme</th>
                <th className="py-3 px-4">Surfaces</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF2] text-xs">
              {loading && modules.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-300" />
                    Loading modules...
                  </td>
                </tr>
              ) : modules.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No modules match the selected filter.
                  </td>
                </tr>
              ) : (
                modules.map((m) => {
                  const swatch = THEME_SWATCHES[m.themeKey] || THEME_SWATCHES.BLUE;
                  const isActionLoading = actionLoadingId === m.id;

                  return (
                    <tr key={m.id} className="hover:bg-[#FAFBFD] transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-slate-900">{m.title}</span>
                          <a
                            href={`http://localhost:3000/modules/${m.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-mono text-slate-400 hover:text-[#2563EB] flex items-center gap-0.5"
                          >
                            /modules/{m.slug}
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </a>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-sm">
                          {m.summary}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md">
                          {m.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${swatch.bg} ${swatch.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${swatch.dot}`} />
                          {m.themeKey}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {m.showInCatalog && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded" title="Included in /modules Catalog">
                              Catalog
                            </span>
                          )}
                          {m.showInMegaMenu && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-blue-50 text-blue-700 rounded" title="Shown in Header Mega-Menu">
                              Menu
                            </span>
                          )}
                          {m.showInHomepage && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-purple-50 text-purple-700 rounded" title="Shown in Homepage Orbit">
                              Home
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={m.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-500">
                        {m.sortOrder}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {new Date(m.updatedAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/modules/${m.id}/edit`}
                            className="px-2.5 py-1 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-md transition-colors"
                          >
                            Edit
                          </Link>

                          {m.status === "DRAFT" && (
                            <button
                              disabled={isActionLoading}
                              onClick={() => handlePublish(m.id)}
                              className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer"
                              title="Publish Module"
                            >
                              Publish
                            </button>
                          )}

                          {m.status === "PUBLISHED" && (
                            <button
                              disabled={isActionLoading}
                              onClick={() => handleUnpublish(m.id)}
                              className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-[#E5EAF2] rounded-md transition-colors cursor-pointer"
                              title="Unpublish Module"
                            >
                              Unpublish
                            </button>
                          )}

                          {m.status !== "ARCHIVED" ? (
                            <button
                              disabled={isActionLoading}
                              onClick={() => handleArchive(m.id)}
                              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="Archive Module"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              disabled={isActionLoading}
                              onClick={() => handleRestore(m.id)}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                              title="Restore to Draft"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {m.status === "DRAFT" && !m.everPublished && (
                            <button
                              disabled={isActionLoading}
                              onClick={() => handleDelete(m)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
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

      {/* Quick Create Module Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#E5EAF2] w-full max-w-lg p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Create New Module</h3>
                <p className="text-xs text-slate-500 mt-0.5">Initialize a new module draft with standard templates.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {modalError && (
              <div className="mt-3.5 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateModule} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Module Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Warehouse Automation"
                  value={newTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">URL Slug *</label>
                <div className="flex items-center">
                  <span className="px-2.5 py-1.5 text-xs bg-slate-100 border border-r-0 border-[#E5EAF2] rounded-l-lg text-slate-500 font-mono">
                    /modules/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="warehouse-automation"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""))}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-r-lg text-slate-900 font-mono focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
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
                <label className="block text-xs font-medium text-slate-700 mb-1">Catalog Summary (Card Description)</label>
                <textarea
                  rows={2}
                  placeholder="One sentence describing what this module runs across locations."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">One-Line Outcome (Card Caption)</label>
                <input
                  type="text"
                  placeholder="e.g. Automated routing across warehouses without spreadsheets."
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="pt-3 border-t border-[#E5EAF2] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 border border-[#E5EAF2] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {creating ? "Creating Draft..." : "Create & Edit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
