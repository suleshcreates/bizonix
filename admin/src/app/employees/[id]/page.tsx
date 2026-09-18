"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/shell/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { apiClient } from "@/lib/api/client";
import {
  ArrowLeft,
  Mail,
  Loader2,
  Calendar,
  Building2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface AssignedEnquiry {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string | null;
  status: string;
  priority: string;
  leadScore: number;
  intent: string;
  createdAt: string;
  demoDate: string | null;
  nextAction: string | null;
}

interface SentEmail {
  id: string;
  direction: string;
  recipient: string;
  subject: string;
  deliveryStatus: string;
  sentAt: string | null;
  createdAt: string;
  enquiry: {
    id: string;
    companyName: string;
    fullName: string;
  } | null;
}

interface EmployeeProfile {
  id: string;
  email: string;
  displayName: string | null;
  status: string;
  createdAt: string;
  lastLoginAt: string | null;
  userRoles: { role: { name: string } }[];
  assignedEnquiries: AssignedEnquiry[];
  sentEnquiryEmails: SentEmail[];
  stats: {
    totalLeads: number;
    activeLeads: number;
    convertedLeads: number;
    emailsSent: number;
    conversionRate: number;
  };
}

export default function EmployeeDetailPage() {
  const params = useParams();
  const employeeId = (params?.id as string) || "";

  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"enquiries" | "emails">("enquiries");

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await apiClient.get<EmployeeProfile>(`/admin/users/${employeeId}`);
        setEmployee(data);
      } catch (err: any) {
        setError(err.message || "Failed to load team member profile");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [employeeId]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
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

  if (isLoading) {
    return (
      <AdminShell>
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#2563EB] mb-2" />
          <p className="text-xs font-medium">Loading profile...</p>
        </div>
      </AdminShell>
    );
  }

  if (!employee || error) {
    return (
      <AdminShell>
        <div className="p-8 bg-white border border-[#E5EAF2] rounded-xl text-center">
          <p className="text-sm font-medium text-slate-800">{error || "Team member not found"}</p>
          <Link
            href="/employees"
            className="mt-3 inline-flex items-center gap-1 text-xs text-[#2563EB] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to team
          </Link>
        </div>
      </AdminShell>
    );
  }

  const roleName = employee.userRoles?.[0]?.role?.name || "SITE_ADMIN";
  const initial = employee.displayName ? employee.displayName.charAt(0).toUpperCase() : "U";

  return (
    <AdminShell>
      {/* Page Header */}
      <PageHeader
        title={employee.displayName || "Staff Profile"}
        subtitle={`${employee.email} • Joined ${formatDate(employee.createdAt)}`}
        breadcrumbs={[
          { label: "Team", href: "/employees" },
          { label: employee.displayName || employee.email },
        ]}
        actions={
          <a
            href={`mailto:${employee.email}`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-[#E5EAF2] rounded-lg shadow-2xs transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>Send Email</span>
          </a>
        }
      />

      {/* Member Profile Overview Card */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl p-6 mb-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E5EAF2]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-semibold text-lg shrink-0">
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-slate-900">
                  {employee.displayName || "Unnamed Member"}
                </h2>
                <StatusBadge status={employee.status} size="sm" />
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FAFBFD] text-slate-700 border border-[#E5EAF2]">
                  {roleName.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{employee.email}</p>
            </div>
          </div>
        </div>

        {/* 4 Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Assigned Leads
            </p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">
              {employee.stats?.totalLeads ?? employee.assignedEnquiries?.length ?? 0}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Active Cases
            </p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">
              {employee.stats?.activeLeads ?? 0}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Converted Clients
            </p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">
              {employee.stats?.convertedLeads ?? 0}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Emails Sent
            </p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">
              {employee.stats?.emailsSent ?? employee.sentEnquiryEmails?.length ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Assigned Enquiries | Email History */}
      <div className="flex items-center gap-1 border-b border-[#E5EAF2] mb-5">
        <button
          onClick={() => setActiveTab("enquiries")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs transition-colors border-b-2 -mb-px cursor-pointer ${
            activeTab === "enquiries"
              ? "border-[#2563EB] text-[#2563EB] font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <span>Assigned Enquiries</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
            {employee.assignedEnquiries?.length ?? 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("emails")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs transition-colors border-b-2 -mb-px cursor-pointer ${
            activeTab === "emails"
              ? "border-[#2563EB] text-[#2563EB] font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <span>Email History</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
            {employee.sentEnquiryEmails?.length ?? 0}
          </span>
        </button>
      </div>

      {/* Tab 1: Assigned Enquiries Table */}
      {activeTab === "enquiries" && (
        <div className="bg-white border border-[#E5EAF2] rounded-xl overflow-hidden shadow-2xs">
          {employee.assignedEnquiries && employee.assignedEnquiries.length > 0 ? (
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
                  {employee.assignedEnquiries.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAFBFD] transition-colors">
                      <td className="py-4 px-5">
                        <Link
                          href={`/enquiries/${item.id}`}
                          className="font-medium text-slate-900 hover:text-[#2563EB] block"
                        >
                          {item.fullName}
                        </Link>
                        <span className="text-[11px] text-slate-400">{item.email}</span>
                      </td>

                      <td className="py-4 px-4 text-slate-800">
                        {item.companyName}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} size="sm" />
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={item.priority} size="sm" showDot={false} />
                      </td>

                      <td className="py-4 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {formatRelativeTime(item.createdAt)}
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <Link
                          href={`/enquiries/${item.id}`}
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
              <p className="text-xs">No enquiries are currently assigned to this team member.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Email History Table */}
      {activeTab === "emails" && (
        <div className="bg-white border border-[#E5EAF2] rounded-xl overflow-hidden shadow-2xs">
          {employee.sentEnquiryEmails && employee.sentEnquiryEmails.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5EAF2] bg-[#FAFBFD] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-5">Subject</th>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Linked Client</th>
                    <th className="py-3 px-4">Delivery</th>
                    <th className="py-3 px-4">Date Sent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EAF2] text-xs">
                  {employee.sentEnquiryEmails.map((email) => (
                    <tr key={email.id} className="hover:bg-[#FAFBFD] transition-colors">
                      <td className="py-3.5 px-5 font-medium text-slate-900">
                        {email.subject}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {email.recipient}
                      </td>

                      <td className="py-3.5 px-4">
                        {email.enquiry ? (
                          <Link
                            href={`/enquiries/${email.enquiry.id}`}
                            className="text-[#2563EB] hover:underline"
                          >
                            {email.enquiry.companyName}
                          </Link>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={email.deliveryStatus} size="sm" showDot={false} />
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {formatDate(email.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-slate-400">
              <p className="text-xs">No outbound email communications recorded.</p>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
