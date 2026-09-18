"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/shell/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { apiClient } from "@/lib/api/client";
import { ArrowRight, RefreshCw } from "lucide-react";

interface DashboardData {
  metrics: {
    newEnquiries: number;
    awaitingResponse: number;
    demoScheduled: number;
    contentDrafts: number;
  };
  attentionEnquiries: Array<{
    id: string;
    fullName: string;
    companyName: string;
    status: string;
    priority: string;
    createdAt: string;
    nextAction: string | null;
    intent: string;
  }>;
  contentStatus: {
    publishedHero: { id: string; name: string; key: string } | null;
    draftHero: { id: string; name: string; key: string } | null;
    heroVariants: Array<{ id: string; name: string; key: string; status: string }>;
    totalHeroes: number;
    draftHeroesCount: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    resourceType: string;
    createdAt: string;
    actor: { displayName: string | null; email: string } | null;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<DashboardData>("/admin/dashboard/summary");
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

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

  const newCount = data?.metrics.newEnquiries ?? 0;
  const contactedCount = data?.metrics.awaitingResponse ?? 0;
  const demoCount = data?.metrics.demoScheduled ?? 0;
  const heroName = data?.contentStatus.publishedHero?.name || "Scale";
  const totalHeroes = data?.contentStatus.totalHeroes || 4;

  return (
    <AdminShell>
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Overview of inbound enquiries and website content."
        actions={
          <button
            onClick={fetchDashboard}
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
          <button onClick={fetchDashboard} className="font-medium underline hover:text-rose-900 cursor-pointer">
            Retry
          </button>
        </div>
      ) : null}

      {/* Row 1: Four Neutral Summary Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Block 1 */}
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            New Enquiries
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900 tracking-tight">
              {isLoading ? "—" : newCount}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Awaiting first response
          </p>
        </div>

        {/* Block 2 */}
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Awaiting Response
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900 tracking-tight">
              {isLoading ? "—" : contactedCount}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            In active follow-up
          </p>
        </div>

        {/* Block 3 */}
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Demo Scheduled
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900 tracking-tight">
              {isLoading ? "—" : demoCount}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Scheduled live walkthroughs
          </p>
        </div>

        {/* Block 4 */}
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Live Hero
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900 tracking-tight truncate">
              {isLoading ? "—" : heroName}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {totalHeroes} registered designs
          </p>
        </div>
      </div>

      {/* Main Workspace Grid: Left 65%, Right 35% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 65%: Enquiries Needing Attention */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-[#E5EAF2] rounded-xl overflow-hidden shadow-2xs">
            <div className="px-5 py-4 border-b border-[#E5EAF2] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Enquiries Needing Attention</h2>
                <p className="text-xs text-slate-500 mt-0.5">High-priority and unassigned leads awaiting triage.</p>
              </div>
              <Link
                href="/enquiries"
                className="text-xs font-medium text-[#2563EB] hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                <span>View all enquiries</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="p-8 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : data?.attentionEnquiries && data.attentionEnquiries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5EAF2] bg-[#FAFBFD] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-5">Prospect</th>
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Stage</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Submitted</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF2] text-xs">
                    {data.attentionEnquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-[#FAFBFD] transition-colors">
                        <td className="py-3.5 px-5">
                          <span className="font-medium text-slate-900 block">{enq.fullName}</span>
                          <span className="text-[11px] text-slate-400 capitalize">{enq.intent || "General"}</span>
                        </td>
                        <td className="py-3.5 px-4 font-normal text-slate-700">
                          {enq.companyName}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={enq.status} size="sm" />
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={enq.priority} size="sm" showDot={false} />
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {formatRelativeTime(enq.createdAt)}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <Link
                            href={`/enquiries/${enq.id}`}
                            className="text-xs font-medium text-[#2563EB] hover:text-blue-700 hover:underline"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center text-slate-400">
                <p className="text-xs font-normal">All incoming enquiries have been attended to.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 35%: Website Publishing Status + Recent Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Website Publishing Status */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Website Publishing
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-500">Homepage Live Hero</p>
              <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                {heroName}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {totalHeroes} registered designs available in repository
              </p>
            </div>

            <Link
              href="/hero"
              className="w-full mt-4 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-[#FAFBFD] hover:bg-slate-100/80 border border-[#E5EAF2] rounded-lg transition-colors"
            >
              <span>Manage Heroes</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
              <Link
                href="/audit"
                className="text-xs font-medium text-[#2563EB] hover:text-blue-700 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="mt-4 space-y-3.5">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-slate-50 rounded animate-pulse" />
                  ))}
                </div>
              ) : data?.recentActivity && data.recentActivity.length > 0 ? (
                data.recentActivity.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-start gap-2.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <p className="font-medium text-slate-900 truncate">
                          {log.action.replace(/_/g, " ")}
                        </p>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {formatRelativeTime(log.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {log.actor?.displayName || log.actor?.email || "System"} • {log.resourceType}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-3 text-center">No recent activity recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
