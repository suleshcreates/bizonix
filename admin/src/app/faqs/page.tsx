"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AdminShell } from "@/components/shell/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { apiClient } from "@/lib/api/client";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  CheckCircle2,
  XCircle,
  FolderPlus,
  Layers,
  HelpCircle,
  Tag,
  Hash,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Check,
} from "lucide-react";

interface FaqCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  location: "HOME" | "BOOK_DEMO";
  sortOrder: number;
  _count?: { faqs: number };
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tag: string | null;
  location: "HOME" | "BOOK_DEMO";
  categoryId: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    slug: string;
    name: string;
  } | null;
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs: HOME | BOOK_DEMO | CATEGORIES
  const [activeTab, setActiveTab] = useState<"HOME" | "BOOK_DEMO" | "CATEGORIES">("HOME");

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  // Expanded answer state in cards
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  // FAQ Modal state
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isSavingFaq, setIsSavingFaq] = useState(false);
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    tag: "",
    location: "HOME" as "HOME" | "BOOK_DEMO",
    categoryId: "",
    sortOrder: 0,
    isPublished: true,
  });

  // Category Modal state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<FaqCategory | null>(null);
  const [isSavingCat, setIsSavingCat] = useState(false);
  const [catForm, setCatForm] = useState({
    slug: "",
    name: "",
    description: "",
    sortOrder: 0,
  });

  // Toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch all FAQs and categories
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ faqs: FaqItem[]; categories: FaqCategory[] }>("/admin/faqs");
      setFaqs(res.faqs || []);
      setCategories(res.categories || []);
    } catch (err: any) {
      setError(err.message || "Failed to load FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered FAQs based on current tab and filters
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      if (faq.location !== activeTab) return false;

      // Category filter (only applicable for HOME)
      if (activeTab === "HOME" && selectedCategory !== "ALL") {
        if (faq.categoryId !== selectedCategory) return false;
      }

      // Status filter
      if (statusFilter === "PUBLISHED" && !faq.isPublished) return false;
      if (statusFilter === "DRAFT" && faq.isPublished) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesQ = faq.question.toLowerCase().includes(q);
        const matchesA = faq.answer.toLowerCase().includes(q);
        const matchesTag = faq.tag ? faq.tag.toLowerCase().includes(q) : false;
        const matchesCat = faq.category ? faq.category.name.toLowerCase().includes(q) : false;
        if (!matchesQ && !matchesA && !matchesTag && !matchesCat) return false;
      }

      return true;
    });
  }, [faqs, activeTab, selectedCategory, statusFilter, search]);

  // Counts
  const homeFaqsCount = faqs.filter((f) => f.location === "HOME").length;
  const demoFaqsCount = faqs.filter((f) => f.location === "BOOK_DEMO").length;
  const publishedCount = faqs.filter((f) => f.isPublished).length;

  // Toggle FAQ expansion
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle Published
  const handleTogglePublish = async (id: string) => {
    try {
      await apiClient.patch(`/admin/faqs/${id}/toggle-publish`, {});
      setFaqs((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isPublished: !f.isPublished } : f))
      );
      showToast("FAQ publication status updated");
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  // Open Add FAQ Modal
  const openAddFaqModal = () => {
    setEditingFaq(null);
    setFaqForm({
      question: "",
      answer: "",
      tag: "",
      location: activeTab === "CATEGORIES" ? "HOME" : activeTab,
      categoryId: categories.find((c) => c.location === "HOME")?.id || "",
      sortOrder: (faqs.filter((f) => f.location === (activeTab === "CATEGORIES" ? "HOME" : activeTab)).length || 0) + 1,
      isPublished: true,
    });
    setIsFaqModalOpen(true);
  };

  // Open Edit FAQ Modal
  const openEditFaqModal = (faq: FaqItem) => {
    setEditingFaq(faq);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      tag: faq.tag || "",
      location: faq.location,
      categoryId: faq.categoryId || "",
      sortOrder: faq.sortOrder,
      isPublished: faq.isPublished,
    });
    setIsFaqModalOpen(true);
  };

  // Save FAQ
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      alert("Please provide both question and answer.");
      return;
    }

    setIsSavingFaq(true);
    try {
      const payload: any = {
        question: faqForm.question.trim(),
        answer: faqForm.answer.trim(),
        tag: faqForm.tag.trim() || undefined,
        location: faqForm.location,
        sortOrder: Number(faqForm.sortOrder) || 0,
        isPublished: faqForm.isPublished,
      };

      if (faqForm.location === "HOME" && faqForm.categoryId) {
        payload.categoryId = faqForm.categoryId;
      } else {
        payload.categoryId = null;
      }

      if (editingFaq) {
        await apiClient.put(`/admin/faqs/${editingFaq.id}`, payload);
        showToast("FAQ updated successfully");
      } else {
        await apiClient.post("/admin/faqs", payload);
        showToast("New FAQ created successfully");
      }
      setIsFaqModalOpen(false);
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to save FAQ");
    } finally {
      setIsSavingFaq(false);
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (id: string, question: string) => {
    if (!confirm(`Are you sure you want to delete this FAQ?\n"${question}"`)) {
      return;
    }

    try {
      await apiClient.delete(`/admin/faqs/${id}`);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      showToast("FAQ deleted");
    } catch (err: any) {
      alert(err.message || "Failed to delete FAQ");
    }
  };

  // Open Add Category Modal
  const openAddCategoryModal = () => {
    setEditingCat(null);
    setCatForm({
      slug: "",
      name: "",
      description: "",
      sortOrder: categories.length + 1,
    });
    setIsCatModalOpen(true);
  };

  // Open Edit Category Modal
  const openEditCategoryModal = (cat: FaqCategory) => {
    setEditingCat(cat);
    setCatForm({
      slug: cat.slug,
      name: cat.name,
      description: cat.description || "",
      sortOrder: cat.sortOrder,
    });
    setIsCatModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim() || (!editingCat && !catForm.slug.trim())) {
      alert("Please fill required fields.");
      return;
    }

    setIsSavingCat(true);
    try {
      if (editingCat) {
        await apiClient.put(`/admin/faqs/categories/${editingCat.id}`, {
          name: catForm.name.trim(),
          description: catForm.description.trim() || undefined,
          sortOrder: Number(catForm.sortOrder) || 0,
        });
        showToast("Category updated successfully");
      } else {
        await apiClient.post("/admin/faqs/categories", {
          slug: catForm.slug.trim().toLowerCase().replace(/\s+/g, "-"),
          name: catForm.name.trim(),
          description: catForm.description.trim() || undefined,
          sortOrder: Number(catForm.sortOrder) || 0,
          location: "HOME",
        });
        showToast("New category created successfully");
      }
      setIsCatModalOpen(false);
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to save category");
    } finally {
      setIsSavingCat(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Any FAQs in this category will become unassigned.`)) {
      return;
    }

    try {
      await apiClient.delete(`/admin/faqs/categories/${id}`);
      await fetchData();
      showToast("Category deleted");
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    }
  };

  return (
    <AdminShell>
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Full-proof CMS for managing categorized homepage FAQs and the Book Demo objection answers."
        breadcrumbs={[{ label: "Website" }, { label: "FAQs" }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-[#E5EAF2] rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#2563EB]" : "text-slate-400"}`} />
              <span>Sync</span>
            </button>

            {activeTab === "CATEGORIES" ? (
              <button
                onClick={openAddCategoryModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            ) : (
              <button
                onClick={openAddFaqModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ</span>
              </button>
            )}
          </div>
        }
      />

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
        <div className="bg-white rounded-xl border border-[#E5EAF2] p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
            Total FAQs
          </div>
          <div className="text-xl font-bold text-slate-900">{faqs.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across all sections</div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5EAF2] p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
            Home Page
          </div>
          <div className="text-xl font-bold text-slate-900">{homeFaqsCount}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            {categories.length} active categories
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5EAF2] p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
            Book Demo Page
          </div>
          <div className="text-xl font-bold text-slate-900">{demoFaqsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Objection handling</div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5EAF2] p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
            Published Live
          </div>
          <div className="text-xl font-bold text-emerald-600 flex items-center gap-1.5">
            <span>{publishedCount}</span>
            <span className="text-xs font-normal text-slate-400">/ {faqs.length}</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Serving on live site</div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center justify-between border-b border-[#E5EAF2] mb-5">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("HOME")}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "HOME"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Home Page FAQs (Categorized)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "HOME" ? "bg-blue-50 text-[#2563EB]" : "bg-slate-100 text-slate-600"
              }`}
            >
              {homeFaqsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("BOOK_DEMO")}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "BOOK_DEMO"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Book Demo FAQs</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "BOOK_DEMO" ? "bg-blue-50 text-[#2563EB]" : "bg-slate-100 text-slate-600"
              }`}
            >
              {demoFaqsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("CATEGORIES")}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "CATEGORIES"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Category Manager</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "CATEGORIES" ? "bg-blue-50 text-[#2563EB]" : "bg-slate-100 text-slate-600"
              }`}
            >
              {categories.length}
            </span>
          </button>
        </div>

        {/* Live Site Anchor Link */}
        <div className="pb-2">
          <a
            href={
              activeTab === "BOOK_DEMO"
                ? "http://localhost:3000/contact#faq"
                : "http://localhost:3000/#faq"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#2563EB] transition-colors"
          >
            <span>View on Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* CATEGORIES TAB */}
      {activeTab === "CATEGORIES" ? (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E5EAF2] p-4 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Homepage Categories</h3>
              <p className="text-xs text-slate-500">
                Categories define the filterable tabs on the website homepage straight answers section.
              </p>
            </div>
            <button
              onClick={openAddCategoryModal}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Category</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#E5EAF2] overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5EAF2] bg-[#FAFBFD] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Sort</th>
                  <th className="py-3 px-5">Name & Description</th>
                  <th className="py-3 px-4">Slug Identifier</th>
                  <th className="py-3 px-4">Assigned FAQs</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF2] text-xs">
                {categories.map((cat) => {
                  const assignedCount = faqs.filter((f) => f.categoryId === cat.id).length;
                  return (
                    <tr key={cat.id} className="hover:bg-[#FAFBFD] transition-colors">
                      <td className="py-3 px-5 font-mono text-slate-500 font-medium">#{cat.sortOrder}</td>
                      <td className="py-3 px-5">
                        <div className="font-semibold text-slate-900">{cat.name}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{cat.description || "No description"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                          {cat.slug}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {assignedCount} FAQs
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditCategoryModal(cat)}
                            className="p-1.5 text-slate-400 hover:text-[#2563EB] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* FAQS TABS (HOME OR BOOK_DEMO) */
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions, answers, tags..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Category Filter Pills (HOME ONLY) */}
            {activeTab === "HOME" && (
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedCategory("ALL")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 ${
                    selectedCategory === "ALL"
                      ? "bg-[#2563EB] text-white"
                      : "bg-[#FAFBFD] text-slate-600 border border-[#E5EAF2] hover:bg-slate-100"
                  }`}
                >
                  All ({homeFaqsCount})
                </button>
                {categories.map((cat) => {
                  const count = faqs.filter((f) => f.location === "HOME" && f.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 ${
                        selectedCategory === cat.id
                          ? "bg-[#2563EB] text-white"
                          : "bg-[#FAFBFD] text-slate-600 border border-[#E5EAF2] hover:bg-slate-100"
                      }`}
                    >
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Status Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-700 focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="PUBLISHED">Published Only</option>
                <option value="DRAFT">Draft Only</option>
              </select>
            </div>
          </div>

          {/* FAQ Items List */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#2563EB] mb-2" />
              <p className="text-xs font-medium">Loading FAQ entries...</p>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="bg-white border border-dashed border-[#E5EAF2] rounded-xl p-12 text-center text-slate-400 text-xs">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No FAQ entries found</p>
              <p className="mt-1">Try adjusting your search or category filter.</p>
              <button
                onClick={openAddFaqModal}
                className="mt-4 px-3.5 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ to this section</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isExpanded = !!expandedIds[faq.id];
                return (
                  <div
                    key={faq.id}
                    className={`bg-white rounded-xl border p-4 shadow-2xs transition-colors ${
                      faq.isPublished
                        ? "border-[#E5EAF2] hover:border-slate-300"
                        : "border-amber-200 bg-amber-50/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Sort Order + Main Details */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200 shrink-0 mt-0.5">
                          #{faq.sortOrder}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            {/* Category Badge (HOME only) */}
                            {faq.location === "HOME" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
                                {faq.category?.name || "Uncategorized"}
                              </span>
                            )}

                            {/* Tag Pill */}
                            {faq.tag && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                <Tag className="w-2.5 h-2.5 text-slate-400" />
                                <span>{faq.tag}</span>
                              </span>
                            )}

                            {/* Status Badge */}
                            {faq.isPublished ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>Published</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <span>Draft / Hidden</span>
                              </span>
                            )}
                          </div>

                          {/* Question */}
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {faq.question}
                          </h4>

                          {/* Answer */}
                          <div className="mt-2 text-xs text-slate-600 leading-relaxed">
                            {isExpanded ? (
                              <p className="whitespace-pre-line">{faq.answer}</p>
                            ) : (
                              <p className="line-clamp-2">{faq.answer}</p>
                            )}
                          </div>

                          {faq.answer.length > 120 && (
                            <button
                              onClick={() => toggleExpand(faq.id)}
                              className="mt-1.5 text-[11px] font-medium text-[#2563EB] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>{isExpanded ? "Show less" : "Read full answer"}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                        {/* Toggle Publish button */}
                        <button
                          onClick={() => handleTogglePublish(faq.id)}
                          className={`p-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
                            faq.isPublished
                              ? "bg-slate-50 text-slate-600 border-[#E5EAF2] hover:bg-slate-100"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          }`}
                          title={faq.isPublished ? "Unpublish FAQ" : "Publish FAQ"}
                        >
                          {faq.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEditFaqModal(faq)}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-md border border-[#E5EAF2] transition-colors cursor-pointer"
                          title="Edit FAQ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteFaq(faq.id, faq.question)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md border border-[#E5EAF2] transition-colors cursor-pointer"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT FAQ MODAL */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-[#E5EAF2] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-[#E5EAF2] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {editingFaq ? "Edit FAQ Entry" : "Create New FAQ Entry"}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure question, answer, target section, and category.
                </p>
              </div>
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="p-6 space-y-4">
              {/* Target Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Website Section
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFaqForm({ ...faqForm, location: "HOME" })}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                      faqForm.location === "HOME"
                        ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
                        : "border-[#E5EAF2] bg-[#FAFBFD] text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Home Page (Categorized)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFaqForm({ ...faqForm, location: "BOOK_DEMO" })}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                      faqForm.location === "BOOK_DEMO"
                        ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
                        : "border-[#E5EAF2] bg-[#FAFBFD] text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Book Demo (/contact)
                  </button>
                </div>
              </div>

              {/* Category (if HOME) */}
              {faqForm.location === "HOME" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={faqForm.categoryId}
                    onChange={(e) => setFaqForm({ ...faqForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    required
                  >
                    <option value="">Select a category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tag / Pill */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tag / Short Label (Optional)
                </label>
                <input
                  type="text"
                  value={faqForm.tag}
                  onChange={(e) => setFaqForm({ ...faqForm, tag: e.target.value })}
                  placeholder="e.g. Deployment, Access Control, 30 Mins"
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Question */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Question <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. How is Bizonix deployed?"
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              {/* Answer */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Answer <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Provide a clear, direct answer..."
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] leading-relaxed"
                  required
                />
              </div>

              {/* Sort Order & Publish Switch */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={faqForm.sortOrder}
                    onChange={(e) => setFaqForm({ ...faqForm, sortOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Visibility
                  </label>
                  <button
                    type="button"
                    onClick={() => setFaqForm({ ...faqForm, isPublished: !faqForm.isPublished })}
                    className={`w-full px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      faqForm.isPublished
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 bg-slate-100 text-slate-600"
                    }`}
                  >
                    {faqForm.isPublished ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Published Live</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>Draft / Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#E5EAF2] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingFaq}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingFaq ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingFaq ? "Save Changes" : "Create FAQ"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-[#E5EAF2] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-[#E5EAF2] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {editingCat ? "Edit Category" : "New Homepage Category"}
                </h3>
                <p className="text-xs text-slate-500">
                  Categories organize questions into homepage tabs.
                </p>
              </div>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              {!editingCat && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Slug Identifier <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={catForm.slug}
                    onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                    placeholder="e.g. operations, setup, security"
                    className="w-full px-3 py-2 text-xs font-mono bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Used internally and in URL fragments (lowercase, dashes).
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. Core Operations"
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  placeholder="Brief description of this category topic"
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={catForm.sortOrder}
                  onChange={(e) => setCatForm({ ...catForm, sortOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="pt-4 border-t border-[#E5EAF2] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCat}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingCat ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingCat ? "Save Changes" : "Create Category"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
