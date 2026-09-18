"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AdminShell } from "@/components/shell/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { apiClient } from "@/lib/api/client";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  beforeJson: any;
  afterJson: any;
  createdAt: string;
  actor: { id: string; displayName: string | null; email: string } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function getActionMarker(action: string): { dot: string; text: string; bg: string } {
  const a = action.toUpperCase();
  if (a.includes("DELETE") || a.includes("FAILED") || a.includes("SPAM")) {
    return { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50 border-rose-200/70" };
  }
  if (a.includes("SECURITY") || a.includes("WARN")) {
    return { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50 border-amber-200/70" };
  }
  if (a.includes("LOGIN") || a.includes("AUTH") || a.includes("CREATE") || a.includes("PUBLISH")) {
    return { dot: "bg-[#2563EB]", text: "text-[#2563EB]", bg: "bg-blue-50 border-blue-200/70" };
  }
  return { dot: "bg-slate-400", text: "text-slate-700", bg: "bg-slate-100 border-slate-200/70" };
}

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterResource, setFilterResource] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 25;

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(LIMIT));
      if (search.trim()) params.set("search", search.trim());
      if (filterAction.trim()) params.set("action", filterAction.trim());
      if (filterResource.trim()) params.set("resourceType", filterResource.trim());

      const data = await apiClient.get<{ items: AuditLog[]; pagination: Pagination }>(
        `/admin/audit?${params.toString()}`
      );
      setLogs(data.items);
      setPagination(data.pagination);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [page, search, filterAction, filterResource]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const clearFilters = () => {
    setSearch("");
    setFilterAction("");
    setFilterResource("");
    setPage(1);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminShell>
      {/* Page Header */}
      <PageHeader
        title="Audit Trail"
        subtitle="Administrative activity and governance events across Bizonix."
        badge={pagination?.total}
        actions={
          <button
            onClick={() => fetchLogs()}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-[#E5EAF2] rounded-lg shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#2563EB]" : "text-slate-400"}`} />
            <span>Sync</span>
          </button>
        }
      />

      {/* Toolbar: Search + Action Filter + Resource Filter */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl p-3.5 mb-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor or IP..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <select
            value={filterAction}
            onChange={(e) => {
              setFilterAction(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-700 focus:outline-none focus:border-[#2563EB] cursor-pointer"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="UPDATE">Update</option>
            <option value="CREATE">Create</option>
            <option value="ASSIGN">Assign</option>
            <option value="PUBLISH">Publish</option>
            <option value="DELETE">Delete</option>
          </select>

          <select
            value={filterResource}
            onChange={(e) => {
              setFilterResource(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-700 focus:outline-none focus:border-[#2563EB] cursor-pointer"
          >
            <option value="">All Resources</option>
            <option value="AUTH">Auth</option>
            <option value="ENQUIRY">Enquiry</option>
            <option value="USER">User</option>
            <option value="HERO">Hero</option>
            <option value="SETTINGS">Settings</option>
          </select>

          {(search || filterAction || filterResource) && (
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

      {/* Audit Log Table */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5EAF2] bg-[#FAFBFD] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF2] text-xs">
                {logs.map((log) => {
                  const marker = getActionMarker(log.action);
                  const isExpanded = expandedId === log.id;
                  const hasPayload = log.beforeJson || log.afterJson;

                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-[#FAFBFD] transition-colors">
                        {/* Action */}
                        <td className="py-3.5 px-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-medium ${marker.bg} ${marker.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${marker.dot}`} />
                            {log.action.replace(/_/g, " ")}
                          </span>
                        </td>

                        {/* Resource */}
                        <td className="py-3.5 px-4 font-normal text-slate-700">
                          {log.resourceType}
                          {log.resourceId && (
                            <span className="text-[11px] text-slate-400 block font-mono">
                              #{log.resourceId.slice(0, 8)}
                            </span>
                          )}
                        </td>

                        {/* Actor */}
                        <td className="py-3.5 px-4 text-slate-800">
                          {log.actor?.displayName || log.actor?.email || "System"}
                        </td>

                        {/* IP Address */}
                        <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                          {log.ipAddress || "—"}
                        </td>

                        {/* Timestamp */}
                        <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {formatDate(log.createdAt)}
                        </td>

                        {/* Details */}
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          {hasPayload ? (
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : log.id)}
                              className="inline-flex items-center gap-1 text-xs text-[#2563EB] hover:underline cursor-pointer"
                            >
                              <span>{isExpanded ? "Hide" : "Diff"}</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable JSON Diff Row */}
                      {isExpanded && hasPayload && (
                        <tr className="bg-[#FAFBFD] border-b border-[#E5EAF2]">
                          <td colSpan={6} className="px-5 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                              {log.beforeJson && (
                                <div>
                                  <p className="text-[11px] font-semibold text-slate-500 mb-1 font-sans">
                                    Before State
                                  </p>
                                  <pre className="p-3 rounded-lg bg-white border border-[#E5EAF2] text-slate-700 overflow-x-auto text-[11px] leading-relaxed">
                                    {JSON.stringify(log.beforeJson, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {log.afterJson && (
                                <div>
                                  <p className="text-[11px] font-semibold text-slate-500 mb-1 font-sans">
                                    After State
                                  </p>
                                  <pre className="p-3 rounded-lg bg-white border border-[#E5EAF2] text-slate-700 overflow-x-auto text-[11px] leading-relaxed">
                                    {JSON.stringify(log.afterJson, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <p className="text-sm font-medium text-slate-700">No audit events found</p>
            <p className="text-xs text-slate-400 mt-1">
              Events will appear as administrative actions occur across the platform.
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-[#E5EAF2] bg-[#FAFBFD] flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total events)
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
                disabled={page >= pagination.totalPages}
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
