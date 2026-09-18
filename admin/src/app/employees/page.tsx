"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/shell/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { apiClient } from "@/lib/api/client";
import {
  Plus,
  Search,
  Users,
  Shield,
  Loader2,
  X,
  Mail,
  ChevronRight,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Key,
} from "lucide-react";

interface TeamMember {
  id: string;
  email: string;
  username: string | null;
  displayName: string | null;
  status: string;
  welcomeEmailSent: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  _count: {
    assignedEnquiries: number;
    sentEnquiryEmails: number;
  };
  userRoles: { role: { name: string } }[];
}

interface ProvisionedMember {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  status: string;
  temporaryPassword?: string;
  welcomeEmailSent: boolean;
}

export default function EmployeesPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Add Employee Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"SITE_ADMIN" | "SUPER_ADMIN">("SITE_ADMIN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Newly provisioned employee banner state
  const [provisionedMember, setProvisionedMember] = useState<ProvisionedMember | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fetchTeam = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<TeamMember[]>("/admin/users/team");
      setTeam(res);
    } catch (err: any) {
      setError(err.message || "Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    setIsSubmitting(true);
    setAddError(null);

    try {
      const res = await apiClient.post<ProvisionedMember>("/admin/users", {
        email: newEmail.trim(),
        displayName: newName.trim(),
        role: newRole,
      });
      setIsAdding(false);
      setNewEmail("");
      setNewName("");
      setNewRole("SITE_ADMIN");
      setProvisionedMember(res);
      fetchTeam();
    } catch (err: any) {
      setAddError(err.message || "Failed to add team member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTeam = useMemo(() => {
    return team.filter((member) => {
      const matchesSearch =
        !search.trim() ||
        (member.displayName || "").toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase());

      const memberRole = member.userRoles?.[0]?.role?.name || "SITE_ADMIN";
      const matchesRole = roleFilter === "ALL" || memberRole === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [team, search, roleFilter]);

  const totalStaff = team.length;
  const totalAssignedLeads = team.reduce((acc, m) => acc + (m._count?.assignedEnquiries || 0), 0);
  const totalEmailsDispatched = team.reduce((acc, m) => acc + (m._count?.sentEnquiryEmails || 0), 0);

  const formatDate = (dateStr: string) => {
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

  return (
    <AdminShell>
      {/* Page Header */}
      <PageHeader
        title="Team"
        subtitle="Manage staff members and active enquiry assignments."
        badge={totalStaff}
        actions={
          <button
            onClick={() => setIsAdding((prev) => !prev)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isAdding ? "Cancel" : "Add Team Member"}</span>
          </button>
        }
      />

      {error ? (
        <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
          <p>{error}</p>
          <button onClick={fetchTeam} className="font-medium underline hover:text-rose-900 cursor-pointer">
            Retry
          </button>
        </div>
      ) : null}

      {/* Add Member Panel (collapsible) */}
      {isAdding && (
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 mb-6 shadow-2xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2] mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Provision New Team Member</h3>
              <p className="text-xs text-slate-500 mt-0.5">Invite a staff member with explicit role permissions.</p>
            </div>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {addError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {addError}
            </div>
          )}

          <form onSubmit={handleAddEmployee} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Sulesh Waghmare"
                className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="name@bizonix.com"
                className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Role & Permissions</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="SITE_ADMIN">Site Admin (Enquiries & Content)</option>
                <option value="SUPER_ADMIN">Super Admin (Full Governance)</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2 pt-2 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                {isSubmitting ? "Creating..." : "Save Member"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Provisioned Member Credentials Banner */}
      {provisionedMember && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Staff Account Provisioned & Credentials Generated
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Account is ready. The credentials will be automatically emailed to the employee upon their first deal assignment.
                </p>
              </div>
            </div>
            <button
              onClick={() => setProvisionedMember(null)}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-lg border border-emerald-100 shadow-2xs">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Full Name & Email
              </span>
              <span className="text-xs font-semibold text-slate-900 block truncate">
                {provisionedMember.displayName}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                {provisionedMember.email}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Generated Username
              </span>
              <div className="flex items-center gap-1.5">
                <code className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded text-slate-800">
                  {provisionedMember.username}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(provisionedMember.username, 'username')}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Copy username"
                >
                  {copiedKey === 'username' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Temporary Password
              </span>
              <div className="flex items-center gap-1.5">
                <code className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded">
                  {provisionedMember.temporaryPassword}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(provisionedMember.temporaryPassword || '', 'password')}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Copy password"
                >
                  {copiedKey === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-emerald-900">
            <span className="flex items-center gap-1.5 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              Automated trigger: When you assign an enquiry to {provisionedMember.displayName}, their welcome email with login link, username, and password will be sent automatically.
            </span>
            <button
              onClick={() => setProvisionedMember(null)}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Summary Row: 3 Neutral Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Staff
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900 tracking-tight">
              {isLoading ? "—" : totalStaff}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Active accounts in directory</p>
        </div>

        <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Assigned Leads
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900 tracking-tight">
              {isLoading ? "—" : totalAssignedLeads}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Inbound cases currently distributed</p>
        </div>

        <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Communications Dispatched
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900 tracking-tight">
              {isLoading ? "—" : totalEmailsDispatched}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Total client emails sent</p>
        </div>
      </div>

      {/* Toolbar: Search + Role Filter */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl p-3.5 mb-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-700 focus:outline-none focus:border-[#2563EB] cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="SITE_ADMIN">Site Admin</option>
          </select>

          {(search || roleFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setRoleFilter("ALL");
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Team Directory Table */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredTeam.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5EAF2] bg-[#FAFBFD] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Name & Username</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Credentials</th>
                  <th className="py-3 px-4">Assigned Enquiries</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF2] text-xs">
                {filteredTeam.map((member) => {
                  const roleName = member.userRoles?.[0]?.role?.name || "SITE_ADMIN";
                  const initial = member.displayName ? member.displayName.charAt(0).toUpperCase() : "U";
                  return (
                    <tr key={member.id} className="hover:bg-[#FAFBFD] transition-colors">
                      {/* Name & Username */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-700 shrink-0">
                            {initial}
                          </div>
                          <div>
                            <Link
                              href={`/employees/${member.id}`}
                              className="font-medium text-slate-900 hover:text-[#2563EB] truncate block"
                            >
                              {member.displayName || "Unnamed Member"}
                            </Link>
                            {member.username && (
                              <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                                @{member.username}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 text-slate-600">
                        {member.email}
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FAFBFD] text-slate-700 border border-[#E5EAF2]">
                          {roleName.replace("_", " ")}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={member.status} size="sm" />
                      </td>

                      {/* Credentials Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {member.welcomeEmailSent ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Emailed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200" title="Will be emailed upon first deal assignment">
                            <Clock className="w-3 h-3" /> Awaiting 1st Deal
                          </span>
                        )}
                      </td>

                      {/* Assigned Enquiries */}
                      <td className="py-4 px-4 font-normal text-slate-700">
                        {member._count?.assignedEnquiries ?? 0} leads
                      </td>

                      {/* Joined */}
                      <td className="py-4 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {formatDate(member.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <Link
                          href={`/employees/${member.id}`}
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
            <p className="text-sm font-medium text-slate-700">No team members found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search criteria or add a new team member.
            </p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
