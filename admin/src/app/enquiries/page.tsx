"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/shell/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { apiClient } from "@/lib/api/client";
import {
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  X,
} from "lucide-react";

interface EnquiryItem {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string | null;
  city: string | null;
  role: string | null;
  industry: string | null;
  outletCount: string | null;
  status: string;
  priority: string;
  leadScore: number;
  intent: string;
  nextAction: string | null;
  demoDate: string | null;
  assignedTo: { id: string; displayName: string | null; email: string } | null;
  createdAt: string;
}

interface EnquiriesResponse {
  items: EnquiryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: Record<string, number>;
}

const STATUS_TABS = [
  { key: "ALL", label: "All" },
  { key: "NEW", label: "New" },
  { key: "CONTACTED", label: "Contacted" },
  { key: "QUALIFIED", label: "Qualified" },
  { key: "DEMO_SCHEDULED", label: "Demo Scheduled" },
  { key: "FOLLOW_UP", label: "Follow-up" },
  { key: "CONVERTED", label: "Converted" },
  { key: "CLOSED", label: "Closed" },
];

export default function EnquiriesPage() {
  const [data, setData] = useState<EnquiriesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 15;

  const fetchEnquiries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (activeTab !== "ALL") params.append("status", activeTab);
      if (priorityFilter) params.append("priority", priorityFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await apiClient.get<EnquiriesResponse>(`/admin/enquiries?${params.toString()}`);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load enquiries");
    } finally {
      setIsLoading(false);
    }
  }, [page, activeTab, priorityFilter, searchQuery]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchEnquiries();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriorityFilter("");
    setActiveTab("ALL");
    setPage(1);
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return "Just now";
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return dateStr;
    }
  };

  const counts = data?.counts || {};
  const totalLeads = data?.total || 0;

  return (
    <AdminShell>
      {/* Page Header */}
      <PageHeader
        title="Enquiries"
        subtitle="Demo requests and inbound commercial enquiries."
        badge={totalLeads}
        actions={
          <button
            onClick={() => fetchEnquiries()}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-[#E5EAF2] rounded-lg shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#2563EB]" : "text-slate-400"}`} />
            <span>Sync</span>
          </button>
        }
      />

      {error ? (
        <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
          <p>{error}</p>
          <button onClick={() => fetchEnquiries()} className="font-medium underline hover:text-rose-900 cursor-pointer">
            Retry
          </button>
        </div>
      ) : null}

      {/* Horizontal Status Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E5EAF2] mb-5 overflow-x-auto select-none scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = tab.key === "ALL" ? totalLeads : counts[tab.key] || 0;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs transition-colors border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-[#2563EB] text-[#2563EB] font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-normal ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Toolbar: Search, Priority Filter, Clear */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl p-3.5 mb-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by prospect, company, or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
          />
        </form>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-700 focus:outline-none focus:border-[#2563EB] cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {(searchQuery || priorityFilter || activeTab !== "ALL") && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Enquiries CRM Table */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : data?.items && data.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5EAF2] bg-[#FAFBFD] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Prospect</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF2] text-xs">
                {data.items.map((item) => {
                  const ownerName = item.assignedTo?.displayName || item.assignedTo?.email?.split("@")[0];
                  return (
                    <tr key={item.id} className="hover:bg-[#FAFBFD] transition-colors">
                      {/* Prospect */}
                      <td className="py-4 px-5">
                        <div className="min-w-0">
                          <Link
                            href={`/enquiries/${item.id}`}
                            className="font-medium text-slate-900 hover:text-[#2563EB] block truncate"
                          >
                            {item.fullName}
                          </Link>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {item.email}
                          </span>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="py-4 px-4">
                        <div className="min-w-0">
                          <span className="font-normal text-slate-800 block truncate">
                            {item.companyName}
                          </span>
                          {item.city && (
                            <span className="text-[11px] text-slate-400 block truncate">
                              {item.city}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stage */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} size="sm" />
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={item.priority} size="sm" showDot={false} />
                      </td>

                      {/* Owner */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {ownerName ? (
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600">
                              {ownerName.charAt(0).toUpperCase()}
                            </div>
                            <span className="truncate max-w-[110px]">{ownerName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-normal">Unassigned</span>
                        )}
                      </td>

                      {/* Submitted */}
                      <td className="py-4 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {formatRelativeTime(item.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <Link
                          href={`/enquiries/${item.id}`}
                          className="text-xs font-medium text-[#2563EB] hover:text-blue-700 hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <p className="text-sm font-medium text-slate-700">No enquiries found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try changing the filter options or clearing your search term.
            </p>
          </div>
        )}

        {/* Pagination Strip */}
        {data && data.totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-[#E5EAF2] bg-[#FAFBFD] flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {data.page} of {data.totalPages} ({data.total} total)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded border border-[#E5EAF2] bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded border border-[#E5EAF2] bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
