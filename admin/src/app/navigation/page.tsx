"use client";

import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/shell/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SaveBar } from "@/components/ui/save-bar";
import { apiClient } from "@/lib/api/client";
import {
  Megaphone,
  Menu as MenuIcon,
  Layers,
  LayoutGrid,
  FileText,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Check,
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
  Link as LinkIcon,
  ChevronRight,
  FolderPlus,
} from "lucide-react";

interface AnnouncementBar {
  isActive: boolean;
  badge?: string;
  text: string;
  linkText?: string;
  linkHref?: string;
  theme: string;
  isDismissible?: boolean;
}

interface HeaderNavItem {
  id: string;
  label: string;
  href: string;
  type: "link" | "mega-menu";
  menu?: string;
  badge?: string;
  isExternal?: boolean;
  isActive: boolean;
  sortOrder: number;
}

interface HeaderAction {
  isEnabled: boolean;
  label: string;
  href: string;
}

interface MegaMenuItem {
  id: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
  isActive?: boolean;
}

interface MegaMenuGroup {
  id: string;
  label: string;
  items: MegaMenuItem[];
}

interface MegaMenuSummary {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

interface MegaMenuDefinition {
  id: string;
  label: string;
  href: string;
  summary: MegaMenuSummary;
  footerLabel: string;
  groups: MegaMenuGroup[];
}

interface FooterLink {
  id: string;
  label: string;
  href: string;
  badge?: string;
  isActive: boolean;
  isExternal?: boolean;
}

interface FooterColumn {
  id: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
  links: FooterLink[];
}

interface FooterCta {
  isEnabled: boolean;
  eyebrow: string;
  title: string;
  lede: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

interface BottomBar {
  copyrightNotice: string;
  tagline: string;
  links: FooterLink[];
}

interface NavigationConfig {
  announcement: AnnouncementBar;
  header: {
    items: HeaderNavItem[];
    action: HeaderAction;
  };
  megaMenus: MegaMenuDefinition[];
  footerColumns: FooterColumn[];
  footerCta: FooterCta;
  bottomBar: BottomBar;
}

interface AdminModuleOption {
  id: string;
  slug: string;
  title: string;
  category: string;
  showInMegaMenu: boolean;
  showInFooter: boolean;
}

interface AdminIndustryOption {
  id: string;
  slug: string;
  name: string;
  category: string;
  showInMegaMenu: boolean;
  showInFooter: boolean;
}

const THEME_OPTIONS = [
  { id: "blue", label: "Blue (Primary)", bg: "bg-[#2563EB]", text: "text-white" },
  { id: "navy", label: "Navy (Dark)", bg: "bg-[#0B1B3D]", text: "text-white" },
  { id: "dark", label: "Midnight Black", bg: "bg-[#111827]", text: "text-white" },
  { id: "amber", label: "Amber (Notice)", bg: "bg-[#D97706]", text: "text-white" },
  { id: "emerald", label: "Emerald (Success)", bg: "bg-[#059669]", text: "text-white" },
];

export default function NavigationPage() {
  const [activeTab, setActiveTab] = useState<"header" | "mega" | "footer" | "legal">("header");
  const [activeMegaKind, setActiveMegaKind] = useState<string>("solutions");
  const [config, setConfig] = useState<NavigationConfig | null>(null);
  const [initialConfig, setInitialConfig] = useState<NavigationConfig | null>(null);
  const [modules, setModules] = useState<AdminModuleOption[]>([]);
  const [industries, setIndustries] = useState<AdminIndustryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Edit / Add Nav Item Modal
  const [editingHeaderItem, setEditingHeaderItem] = useState<HeaderNavItem | null>(null);
  const [isAddingHeaderItem, setIsAddingHeaderItem] = useState(false);

  // Load data
  useEffect(() => {
    loadNavigation();
  }, []);

  const loadNavigation = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get<any>("/admin/navigation");
      if (res && res.config) {
        setConfig(res.config);
        setInitialConfig(JSON.parse(JSON.stringify(res.config)));
        setModules(res.availableModules || []);
        setIndustries(res.availableIndustries || []);
        setIsDirty(false);
      }
    } catch (err: any) {
      console.error("Failed to load navigation config:", err);
      showToast(err?.message || "Failed to load navigation configuration", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (text: string, type: "success" | "error") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = async () => {
    if (!config) return;
    try {
      setIsSaving(true);
      await apiClient.put("/admin/navigation", config);
      setInitialConfig(JSON.parse(JSON.stringify(config)));
      setIsDirty(false);
      showToast("Navigation configuration saved and published successfully!", "success");
    } catch (err: any) {
      console.error("Save error:", err);
      showToast(err?.message || "Failed to save navigation changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (initialConfig) {
      setConfig(JSON.parse(JSON.stringify(initialConfig)));
      setIsDirty(false);
      showToast("Unsaved changes discarded", "success");
    }
  };

  const handleResetToDefaults = async () => {
    if (!confirm("Are you sure you want to reset all navigation settings to canonical Bizonix defaults? Custom links and changes will be replaced.")) {
      return;
    }
    try {
      setIsSaving(true);
      await apiClient.post("/admin/navigation/reset", {});
      await loadNavigation();
      showToast("Navigation reset to canonical Bizonix defaults.", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to reset navigation", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Mutator helpers
  const updateConfig = (updater: (prev: NavigationConfig) => NavigationConfig) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const next = updater({ ...prev });
      setIsDirty(true);
      return next;
    });
  };

  if (isLoading || !config) {
    return (
      <AdminShell>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-slate-500">Loading Navigation CMS...</p>
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-3">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-xs font-medium text-white ${
              toastMessage.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {toastMessage.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Navigation CMS"
        subtitle="Manage public header hierarchy, interactive mega-menus, top announcement banner, and footer links."
        breadcrumbs={[{ label: "Website" }, { label: "Navigation" }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#E5EAF2] hover:bg-slate-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Save & Publish</span>
            </button>
          </div>
        }
      />

      {/* Surface Tabs */}
      <div className="flex border-b border-[#E5EAF2] mb-6 gap-2">
        <button
          onClick={() => setActiveTab("header")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "header"
              ? "border-[#2563EB] text-[#2563EB]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <MenuIcon className="w-4 h-4" />
          <span>Header & Announcement</span>
        </button>

        <button
          onClick={() => setActiveTab("mega")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "mega"
              ? "border-[#2563EB] text-[#2563EB]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Mega-Menu Architect</span>
        </button>

        <button
          onClick={() => setActiveTab("footer")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "footer"
              ? "border-[#2563EB] text-[#2563EB]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Footer & Pre-Footer CTA</span>
        </button>

        <button
          onClick={() => setActiveTab("legal")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "legal"
              ? "border-[#2563EB] text-[#2563EB]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Bottom Bar & Legal</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: HEADER & ANNOUNCEMENT */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "header" && (
        <div className="space-y-6">
          {/* Announcement Bar Settings Card */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5EAF2]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Top Announcement Banner</h3>
                  <p className="text-xs text-slate-500">
                    Display an interactive alert banner at the very top of the website.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.announcement.isActive}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      announcement: { ...prev.announcement, isActive: e.target.checked },
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-2.5 text-xs font-medium text-slate-700">
                  {config.announcement.isActive ? "Active on site" : "Hidden"}
                </span>
              </label>
            </div>

            {/* Live Banner Preview */}
            <div className="mb-5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Live Banner Preview
              </span>
              <div
                className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
                  THEME_OPTIONS.find((t) => t.id === config.announcement.theme)?.bg || "bg-blue-600"
                } text-white`}
              >
                <div className="flex items-center gap-2 mx-auto text-center flex-wrap justify-center">
                  {config.announcement.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 border border-white/30 uppercase tracking-wider">
                      {config.announcement.badge}
                    </span>
                  )}
                  <span className="font-medium">{config.announcement.text || "Announcement text goes here..."}</span>
                  {config.announcement.linkText && (
                    <span className="inline-flex items-center gap-1 font-semibold underline decoration-white/50 cursor-pointer">
                      {config.announcement.linkText} <ArrowRight className="w-3 h-3 inline" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Badge Text (Optional)</label>
                <input
                  type="text"
                  value={config.announcement.badge || ""}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      announcement: { ...prev.announcement, badge: e.target.value },
                    }))
                  }
                  placeholder="e.g. NEW, UPDATE, EVENT"
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Color Accent Theme</label>
                <select
                  value={config.announcement.theme}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      announcement: { ...prev.announcement, theme: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  {THEME_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Announcement Copy</label>
                <input
                  type="text"
                  value={config.announcement.text}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      announcement: { ...prev.announcement, text: e.target.value },
                    }))
                  }
                  placeholder="e.g. Bizonix 3.0 launched with multi-entity franchise sync!"
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Action Link Label</label>
                <input
                  type="text"
                  value={config.announcement.linkText || ""}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      announcement: { ...prev.announcement, linkText: e.target.value },
                    }))
                  }
                  placeholder="e.g. Explore Platform"
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Action Link URL</label>
                <input
                  type="text"
                  value={config.announcement.linkHref || ""}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      announcement: { ...prev.announcement, linkHref: e.target.value },
                    }))
                  }
                  placeholder="e.g. /modules/inventory or /contact"
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Primary Header Navigation Items */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5EAF2]">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Header Navigation Items</h3>
                <p className="text-xs text-slate-500">
                  Reorder and configure the top-level links and mega-menu triggers.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingHeaderItem({
                    id: `nav-${Date.now()}`,
                    label: "",
                    href: "/",
                    type: "link",
                    isActive: true,
                    sortOrder: config.header.items.length + 1,
                  });
                  setIsAddingHeaderItem(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-[#E5EAF2] rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5EAF2] bg-[#FAFBFD] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-4 w-16 text-center">Order</th>
                    <th className="py-2.5 px-4">Label</th>
                    <th className="py-2.5 px-4">Target Route / Href</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EAF2] text-xs">
                  {config.header.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-[#FAFBFD] transition-colors">
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => {
                              const next = [...config.header.items];
                              const temp = next[idx];
                              next[idx] = next[idx - 1];
                              next[idx - 1] = temp;
                              next.forEach((it, i) => (it.sortOrder = i + 1));
                              updateConfig((prev) => ({
                                ...prev,
                                header: { ...prev.header, items: next },
                              }));
                            }}
                            className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3 text-slate-600" />
                          </button>
                          <button
                            disabled={idx === config.header.items.length - 1}
                            onClick={() => {
                              const next = [...config.header.items];
                              const temp = next[idx];
                              next[idx] = next[idx + 1];
                              next[idx + 1] = temp;
                              next.forEach((it, i) => (it.sortOrder = i + 1));
                              updateConfig((prev) => ({
                                ...prev,
                                header: { ...prev.header, items: next },
                              }));
                            }}
                            className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3 text-slate-600" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700 font-semibold">
                              {item.badge}
                            </span>
                          )}
                          {item.isExternal && <ExternalLink className="w-3 h-3 text-slate-400" />}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{item.href}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                            item.type === "mega-menu"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.type === "mega-menu" ? `Mega Menu (${item.menu})` : "Direct Link"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            const next = config.header.items.map((it) =>
                              it.id === item.id ? { ...it, isActive: !it.isActive } : it
                            );
                            updateConfig((prev) => ({
                              ...prev,
                              header: { ...prev.header, items: next },
                            }));
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                            item.isActive !== false ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {item.isActive !== false ? "Visible" : "Hidden"}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingHeaderItem({ ...item });
                              setIsAddingHeaderItem(false);
                            }}
                            className="text-xs text-blue-600 hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              const next = config.header.items.filter((it) => it.id !== item.id);
                              updateConfig((prev) => ({
                                ...prev,
                                header: { ...prev.header, items: next },
                              }));
                            }}
                            className="text-slate-400 hover:text-red-600 cursor-pointer p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Header Action CTA Button Card */}
            <div className="mt-5 p-4 rounded-lg bg-[#FAFBFD] border border-[#E5EAF2] flex items-center justify-between flex-wrap gap-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-900">Header Action Button (CTA)</h4>
                <p className="text-[11px] text-slate-500">
                  Primary button located on the top right of the navigation bar.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={config.header.action.isEnabled}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        header: {
                          ...prev.header,
                          action: { ...prev.header.action, isEnabled: e.target.checked },
                        },
                      }))
                    }
                    className="rounded text-blue-600"
                  />
                  <span>Show CTA</span>
                </label>

                <input
                  type="text"
                  value={config.header.action.label}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      header: {
                        ...prev.header,
                        action: { ...prev.header.action, label: e.target.value },
                      },
                    }))
                  }
                  placeholder="Label"
                  className="px-2.5 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md text-slate-900 w-32"
                />

                <input
                  type="text"
                  value={config.header.action.href}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      header: {
                        ...prev.header,
                        action: { ...prev.header.action, href: e.target.value },
                      },
                    }))
                  }
                  placeholder="Route"
                  className="px-2.5 py-1 text-xs bg-white border border-[#E5EAF2] rounded-md text-slate-900 w-32"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: MEGA-MENU ARCHITECT */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "mega" && (
        <div className="space-y-6">
          {/* Mega Menu Selector Pills */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-[#E5EAF2]">
            {config.megaMenus.map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActiveMegaKind(menu.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeMegaKind === menu.id
                    ? "bg-[#2563EB] text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {menu.label} Menu
              </button>
            ))}
          </div>

          {/* Current Mega Menu Configuration */}
          {(() => {
            const currentMenu =
              config.megaMenus.find((m) => m.id === activeMegaKind) || config.megaMenus[0];
            if (!currentMenu) return null;

            return (
              <div className="space-y-6">
                {/* Summary Box & Header */}
                <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    {currentMenu.label} — Hero Callout Panel
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    The highlighted editorial banner on the left of the mega-menu dropdown.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Eyebrow</label>
                      <input
                        type="text"
                        value={currentMenu.summary.eyebrow}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => ({
                            ...prev,
                            megaMenus: prev.megaMenus.map((m) =>
                              m.id === currentMenu.id
                                ? { ...m, summary: { ...m.summary, eyebrow: val } }
                                : m
                            ),
                          }));
                        }}
                        className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Callout Title</label>
                      <input
                        type="text"
                        value={currentMenu.summary.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => ({
                            ...prev,
                            megaMenus: prev.megaMenus.map((m) =>
                              m.id === currentMenu.id
                                ? { ...m, summary: { ...m.summary, title: val } }
                                : m
                            ),
                          }));
                        }}
                        className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-slate-700 font-medium mb-1">Description</label>
                      <input
                        type="text"
                        value={currentMenu.summary.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => ({
                            ...prev,
                            megaMenus: prev.megaMenus.map((m) =>
                              m.id === currentMenu.id
                                ? { ...m, summary: { ...m.summary, description: val } }
                                : m
                            ),
                          }));
                        }}
                        className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Action Button Label</label>
                      <input
                        type="text"
                        value={currentMenu.summary.ctaLabel}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => ({
                            ...prev,
                            megaMenus: prev.megaMenus.map((m) =>
                              m.id === currentMenu.id
                                ? { ...m, summary: { ...m.summary, ctaLabel: val } }
                                : m
                            ),
                          }));
                        }}
                        className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Action Button Href</label>
                      <input
                        type="text"
                        value={currentMenu.summary.ctaHref}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => ({
                            ...prev,
                            megaMenus: prev.megaMenus.map((m) =>
                              m.id === currentMenu.id
                                ? { ...m, summary: { ...m.summary, ctaHref: val } }
                                : m
                            ),
                          }));
                        }}
                        className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Columns & Groups */}
                <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5EAF2]">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Columns & Navigation Groups</h3>
                      <p className="text-xs text-slate-500">
                        Organize modules or links into structured columns (e.g. Operate, Grow, Scale).
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Dynamic sync buttons */}
                      {currentMenu.id === "solutions" && (
                        <div className="relative group">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Add Published Module</span>
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-full mt-1 z-30 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 max-h-60 overflow-y-auto">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                              Published Modules ({modules.length})
                            </span>
                            {modules.map((mod) => (
                              <button
                                key={mod.id}
                                onClick={() => {
                                  // Add to first group
                                  const targetGroupId = currentMenu.groups[0]?.id;
                                  if (!targetGroupId) return;
                                  updateConfig((prev) => ({
                                    ...prev,
                                    megaMenus: prev.megaMenus.map((m) => {
                                      if (m.id !== currentMenu.id) return m;
                                      return {
                                        ...m,
                                        groups: m.groups.map((g) => {
                                          if (g.id !== targetGroupId) return g;
                                          return {
                                            ...g,
                                            items: [
                                              ...g.items,
                                              {
                                                id: mod.slug,
                                                title: mod.title,
                                                description: `${mod.category} operations module.`,
                                                href: `/modules/${mod.slug}`,
                                                isActive: true,
                                              },
                                            ],
                                          };
                                        }),
                                      };
                                    }),
                                  }));
                                  showToast(`Added ${mod.title} to first column`, "success");
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded text-xs hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between"
                              >
                                <span>{mod.title}</span>
                                <Plus className="w-3 h-3 text-slate-400" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentMenu.id === "industries" && (
                        <div className="relative group">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Add Published Industry</span>
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-full mt-1 z-30 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 max-h-60 overflow-y-auto">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                              Published Industries ({industries.length})
                            </span>
                            {industries.map((ind) => (
                              <button
                                key={ind.id}
                                onClick={() => {
                                  const targetGroupId = currentMenu.groups[0]?.id;
                                  if (!targetGroupId) return;
                                  updateConfig((prev) => ({
                                    ...prev,
                                    megaMenus: prev.megaMenus.map((m) => {
                                      if (m.id !== currentMenu.id) return m;
                                      return {
                                        ...m,
                                        groups: m.groups.map((g) => {
                                          if (g.id !== targetGroupId) return g;
                                          return {
                                            ...g,
                                            items: [
                                              ...g.items,
                                              {
                                                id: ind.slug,
                                                title: ind.name,
                                                description: `Specialized retail flow for ${ind.name}.`,
                                                href: `/industries/${ind.slug}`,
                                                isActive: true,
                                              },
                                            ],
                                          };
                                        }),
                                      };
                                    }),
                                  }));
                                  showToast(`Added ${ind.name} to column`, "success");
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded text-xs hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between"
                              >
                                <span>{ind.name}</span>
                                <Plus className="w-3 h-3 text-slate-400" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          const newColName = prompt("Enter Column Label (e.g., Enterprise):");
                          if (!newColName) return;
                          updateConfig((prev) => ({
                            ...prev,
                            megaMenus: prev.megaMenus.map((m) => {
                              if (m.id !== currentMenu.id) return m;
                              return {
                                ...m,
                                groups: [
                                  ...m.groups,
                                  {
                                    id: `group-${Date.now()}`,
                                    label: newColName,
                                    items: [],
                                  },
                                ],
                              };
                            }),
                          }));
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                      >
                        <FolderPlus className="w-3.5 h-3.5" />
                        <span>Add Column</span>
                      </button>
                    </div>
                  </div>

                  {/* Columns Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {currentMenu.groups.map((grp, gIdx) => (
                      <div
                        key={grp.id}
                        className="border border-[#E5EAF2] rounded-xl p-3.5 bg-[#FAFBFD] space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-[#E5EAF2] pb-2">
                          <input
                            type="text"
                            value={grp.label}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateConfig((prev) => ({
                                ...prev,
                                megaMenus: prev.megaMenus.map((m) => {
                                  if (m.id !== currentMenu.id) return m;
                                  return {
                                    ...m,
                                    groups: m.groups.map((g) =>
                                      g.id === grp.id ? { ...g, label: val } : g
                                    ),
                                  };
                                }),
                              }));
                            }}
                            className="font-semibold text-xs text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              if (!confirm(`Delete column "${grp.label}"?`)) return;
                              updateConfig((prev) => ({
                                ...prev,
                                megaMenus: prev.megaMenus.map((m) => {
                                  if (m.id !== currentMenu.id) return m;
                                  return {
                                    ...m,
                                    groups: m.groups.filter((g) => g.id !== grp.id),
                                  };
                                }),
                              }));
                            }}
                            className="text-slate-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Items in Column */}
                        <div className="space-y-2">
                          {grp.items.map((item, iIdx) => (
                            <div
                              key={item.id}
                              className="bg-white p-2.5 rounded-lg border border-[#E5EAF2] text-xs shadow-2xs space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-900">{item.title}</span>
                                <button
                                  onClick={() => {
                                    updateConfig((prev) => ({
                                      ...prev,
                                      megaMenus: prev.megaMenus.map((m) => {
                                        if (m.id !== currentMenu.id) return m;
                                        return {
                                          ...m,
                                          groups: m.groups.map((g) => {
                                            if (g.id !== grp.id) return g;
                                            return {
                                              ...g,
                                              items: g.items.filter((it) => it.id !== item.id),
                                            };
                                          }),
                                        };
                                      }),
                                    }));
                                  }}
                                  className="text-slate-400 hover:text-red-600 p-0.5"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-tight">{item.description}</p>
                              <p className="font-mono text-[10px] text-blue-600 truncate">{item.href}</p>
                            </div>
                          ))}

                          <button
                            onClick={() => {
                              const title = prompt("Item Title:");
                              if (!title) return;
                              const desc = prompt("Short 2-line Description:") || "";
                              const href = prompt("Route / Href:", `/modules/${title.toLowerCase().replace(/\s+/g, "-")}`) || "/";
                              updateConfig((prev) => ({
                                ...prev,
                                megaMenus: prev.megaMenus.map((m) => {
                                  if (m.id !== currentMenu.id) return m;
                                  return {
                                    ...m,
                                    groups: m.groups.map((g) => {
                                      if (g.id !== grp.id) return g;
                                      return {
                                        ...g,
                                        items: [
                                          ...g.items,
                                          {
                                            id: `item-${Date.now()}`,
                                            title,
                                            description: desc,
                                            href,
                                            isActive: true,
                                          },
                                        ],
                                      };
                                    }),
                                  };
                                }),
                              }));
                            }}
                            className="w-full py-2 border border-dashed border-[#E5EAF2] hover:border-blue-400 rounded-lg text-slate-500 hover:text-blue-600 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Item</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 3: FOOTER & PRE-FOOTER CTA */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "footer" && (
        <div className="space-y-6">
          {/* Pre-Footer Conversion CTA Banner */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5EAF2]">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Pre-Footer Conversion Banner</h3>
                <p className="text-xs text-slate-500">
                  The dark hero call-to-action block positioned immediately above the footer on all public pages.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.footerCta.isEnabled}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      footerCta: { ...prev.footerCta, isEnabled: e.target.checked },
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-2.5 text-xs font-medium text-slate-700">
                  {config.footerCta.isEnabled ? "Visible" : "Disabled"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={config.footerCta.eyebrow}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      footerCta: { ...prev.footerCta, eyebrow: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={config.footerCta.title}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      footerCta: { ...prev.footerCta, title: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Lede / Body Copy</label>
                <input
                  type="text"
                  value={config.footerCta.lede}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      footerCta: { ...prev.footerCta, lede: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Primary Button Label</label>
                <input
                  type="text"
                  value={config.footerCta.primaryLabel}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      footerCta: { ...prev.footerCta, primaryLabel: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Primary Button Href</label>
                <input
                  type="text"
                  value={config.footerCta.primaryHref}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      footerCta: { ...prev.footerCta, primaryHref: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Secondary Button Label</label>
                <input
                  type="text"
                  value={config.footerCta.secondaryLabel}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      footerCta: { ...prev.footerCta, secondaryLabel: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Secondary Button Href</label>
                <input
                  type="text"
                  value={config.footerCta.secondaryHref}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      footerCta: { ...prev.footerCta, secondaryHref: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Footer Directory Columns Manager */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5EAF2]">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Footer Link Columns</h3>
                <p className="text-xs text-slate-500">
                  Manage the columns and link lists displayed in the site footer directory.
                </p>
              </div>
              <button
                onClick={() => {
                  const colTitle = prompt("New Column Title (e.g., Resources, Community):");
                  if (!colTitle) return;
                  updateConfig((prev) => ({
                    ...prev,
                    footerColumns: [
                      ...prev.footerColumns,
                      {
                        id: `col-${Date.now()}`,
                        title: colTitle,
                        sortOrder: prev.footerColumns.length + 1,
                        isActive: true,
                        links: [],
                      },
                    ],
                  }));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Column</span>
              </button>
            </div>

            {/* Columns Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {config.footerColumns.map((col, cIdx) => (
                <div
                  key={col.id}
                  className="border border-[#E5EAF2] rounded-xl p-4 bg-[#FAFBFD] flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#E5EAF2] mb-3">
                      <input
                        type="text"
                        value={col.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig((prev) => ({
                            ...prev,
                            footerColumns: prev.footerColumns.map((c) =>
                              c.id === col.id ? { ...c, title: val } : c
                            ),
                          }));
                        }}
                        className="font-bold text-xs text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none"
                      />

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (!confirm(`Delete column "${col.title}"?`)) return;
                            updateConfig((prev) => ({
                              ...prev,
                              footerColumns: prev.footerColumns.filter((c) => c.id !== col.id),
                            }));
                          }}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Links List */}
                    <div className="space-y-1.5">
                      {col.links.map((lnk) => (
                        <div
                          key={lnk.id}
                          className="flex items-center justify-between p-2 bg-white rounded border border-[#E5EAF2] text-xs"
                        >
                          <div className="truncate mr-2">
                            <span className="font-medium text-slate-800 block truncate">{lnk.label}</span>
                            <span className="font-mono text-[10px] text-slate-400 block truncate">
                              {lnk.href}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              updateConfig((prev) => ({
                                ...prev,
                                footerColumns: prev.footerColumns.map((c) => {
                                  if (c.id !== col.id) return c;
                                  return {
                                    ...c,
                                    links: c.links.filter((l) => l.id !== lnk.id),
                                  };
                                }),
                              }));
                            }}
                            className="text-slate-400 hover:text-red-600 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add link button */}
                  <button
                    onClick={() => {
                      const label = prompt("Link Label:");
                      if (!label) return;
                      const href = prompt("Target URL / Route:", "/");
                      if (!href) return;
                      updateConfig((prev) => ({
                        ...prev,
                        footerColumns: prev.footerColumns.map((c) => {
                          if (c.id !== col.id) return c;
                          return {
                            ...c,
                            links: [
                              ...c.links,
                              {
                                id: `flnk-${Date.now()}`,
                                label,
                                href,
                                isActive: true,
                              },
                            ],
                          };
                        }),
                      }));
                    }}
                    className="w-full py-1.5 border border-dashed border-[#E5EAF2] hover:border-blue-400 rounded-lg text-slate-500 hover:text-blue-600 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Link</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 4: BOTTOM BAR & LEGAL */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "legal" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Footer Copyright & Legal Bar</h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure the bottom copyright statement, regional tagline, and legal links.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Copyright Statement</label>
                <input
                  type="text"
                  value={config.bottomBar.copyrightNotice}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      bottomBar: { ...prev.bottomBar, copyrightNotice: e.target.value },
                    }))
                  }
                  placeholder="Fibonce Tech Solutions Pvt. Ltd. All rights reserved."
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  The current year (e.g. © 2026) is automatically prepended.
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Built-in India Tagline</label>
                <input
                  type="text"
                  value={config.bottomBar.tagline}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      bottomBar: { ...prev.bottomBar, tagline: e.target.value },
                    }))
                  }
                  placeholder="Built in India for multi-entity retail operators."
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>

              {/* Legal Links */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-slate-700 font-medium">Legal Links</label>
                  <button
                    onClick={() => {
                      const label = prompt("Link Label (e.g. Privacy, Terms, Security):");
                      if (!label) return;
                      const href = prompt("Route (e.g. /privacy):", "/");
                      if (!href) return;
                      updateConfig((prev) => ({
                        ...prev,
                        bottomBar: {
                          ...prev.bottomBar,
                          links: [
                            ...prev.bottomBar.links,
                            { id: `legal-${Date.now()}`, label, href, isActive: true },
                          ],
                        },
                      }));
                    }}
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {config.bottomBar.links.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-2.5 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-800">{link.label}</span>
                        <span className="font-mono text-slate-500 text-[11px]">{link.href}</span>
                      </div>
                      <button
                        onClick={() => {
                          updateConfig((prev) => ({
                            ...prev,
                            bottomBar: {
                              ...prev.bottomBar,
                              links: prev.bottomBar.links.filter((l) => l.id !== link.id),
                            },
                          }));
                        }}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL: ADD / EDIT HEADER ITEM */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {editingHeaderItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-[#E5EAF2] shadow-2xl max-w-md w-full p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-semibold text-slate-900">
              {isAddingHeaderItem ? "Add Header Item" : "Edit Header Item"}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Label</label>
                <input
                  type="text"
                  value={editingHeaderItem.label}
                  onChange={(e) =>
                    setEditingHeaderItem({ ...editingHeaderItem, label: e.target.value })
                  }
                  placeholder="e.g. Solutions"
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Route / URL</label>
                <input
                  type="text"
                  value={editingHeaderItem.href}
                  onChange={(e) =>
                    setEditingHeaderItem({ ...editingHeaderItem, href: e.target.value })
                  }
                  placeholder="e.g. /modules or /contact"
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={editingHeaderItem.type}
                  onChange={(e) =>
                    setEditingHeaderItem({
                      ...editingHeaderItem,
                      type: e.target.value as "link" | "mega-menu",
                      menu: e.target.value === "mega-menu" ? "solutions" : undefined,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                >
                  <option value="link">Direct Route Link</option>
                  <option value="mega-menu">Interactive Mega Menu</option>
                </select>
              </div>

              {editingHeaderItem.type === "mega-menu" && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Associated Mega-Menu</label>
                  <select
                    value={editingHeaderItem.menu || "solutions"}
                    onChange={(e) =>
                      setEditingHeaderItem({ ...editingHeaderItem, menu: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                  >
                    {config.megaMenus.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} ({m.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 mb-1">Badge (Optional)</label>
                <input
                  type="text"
                  value={editingHeaderItem.badge || ""}
                  onChange={(e) =>
                    setEditingHeaderItem({ ...editingHeaderItem, badge: e.target.value })
                  }
                  placeholder="e.g. New, Beta"
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingHeaderItem.isExternal || false}
                    onChange={(e) =>
                      setEditingHeaderItem({ ...editingHeaderItem, isExternal: e.target.checked })
                    }
                    className="rounded text-blue-600"
                  />
                  <span>Open in new tab</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingHeaderItem.isActive !== false}
                    onChange={(e) =>
                      setEditingHeaderItem({ ...editingHeaderItem, isActive: e.target.checked })
                    }
                    className="rounded text-blue-600"
                  />
                  <span>Active & Visible</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                onClick={() => setEditingHeaderItem(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!editingHeaderItem.label || !editingHeaderItem.href) {
                    alert("Label and URL are required.");
                    return;
                  }
                  updateConfig((prev) => {
                    const exists = prev.header.items.some((i) => i.id === editingHeaderItem.id);
                    const items = exists
                      ? prev.header.items.map((i) =>
                          i.id === editingHeaderItem.id ? editingHeaderItem : i
                        )
                      : [...prev.header.items, editingHeaderItem];
                    return {
                      ...prev,
                      header: { ...prev.header, items },
                    };
                  });
                  setEditingHeaderItem(null);
                }}
                className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                {isAddingHeaderItem ? "Add Item" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating SaveBar for unsaved state */}
      <SaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
        publishLabel="Publish Navigation"
      />
    </AdminShell>
  );
}
