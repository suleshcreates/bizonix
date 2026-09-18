"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/shell/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth/context";
import { apiClient } from "@/lib/api/client";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  displayName: string | null;
  status: string;
}

interface EnquiryDetail {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string | null;
  city: string | null;
  outletCount: string | null;
  currentSoftware: string | null;
  role: string | null;
  industry: string | null;
  priorities: string[];
  timeline: string | null;
  intent: string;
  source: string;
  page: string;
  message: string | null;
  status: string;
  priority: string;
  leadScore: number;
  assignedToId: string | null;
  nextAction: string | null;
  demoDate: string | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    displayName: string | null;
    email: string;
  } | null;
  notes: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: { id: string; displayName: string | null; email: string };
  }>;
  activities: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
    actor?: { displayName: string | null; email: string } | null;
  }>;
  emails: Array<{
    id: string;
    direction: string;
    recipient: string;
    subject: string;
    body: string;
    deliveryStatus: string;
    errorMessage: string | null;
    sentAt: string | null;
    createdAt: string;
    senderUser?: { displayName: string | null; email: string } | null;
  }>;
}

const PIPELINE_STEPS = [
  { key: "NEW", label: "Intake", index: 1 },
  { key: "CONTACTED", label: "Contacted", index: 2 },
  { key: "QUALIFIED", label: "Qualified", index: 3 },
  { key: "DEMO_SCHEDULED", label: "Demo", index: 4 },
  { key: "CONVERTED", label: "Converted", index: 5 },
];

export default function EnquiryDetailPage() {
  const params = useParams();
  const enquiryId = (params?.id as string) || "";

  const router = useRouter();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [enquiry, setEnquiry] = useState<EnquiryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [nextActionInput, setNextActionInput] = useState("");
  const [demoDateInput, setDemoDateInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("");
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyDemoDate, setReplyDemoDate] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);

  // Assignment
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [assignToId, setAssignToId] = useState<string>("");

  const fetchEnquiry = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [data, users] = await Promise.all([
        apiClient.get<EnquiryDetail>(`/admin/enquiries/${enquiryId}`),
        apiClient.get<AdminUser[]>("/admin/users").catch(() => [] as AdminUser[]),
      ]);
      setEnquiry(data);
      setAdminUsers(users);
      setAssignToId(data.assignedToId || "");
      setNextActionInput(data.nextAction || "");
      setPriorityInput(data.priority || "MEDIUM");
      if (data.demoDate) {
        setDemoDateInput(new Date(data.demoDate).toISOString().slice(0, 16));
      }
      setReplySubject((current) => current || `Bizonix Demo — ${data.companyName}`);
    } catch (err: any) {
      setError(err.message || "Failed to load enquiry details");
    } finally {
      setIsLoading(false);
    }
  }, [enquiryId]);

  useEffect(() => {
    fetchEnquiry();
  }, [fetchEnquiry]);

  const handleStatusChange = async (newStatus: string) => {
    if (!enquiry || isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await apiClient.patch<EnquiryDetail>(`/admin/enquiries/${enquiry.id}/status`, {
        status: newStatus,
      });
      setEnquiry(updated);
      success(`Status updated to ${newStatus.replace("_", " ")}`);
    } catch (err: any) {
      toastError(err.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAssign = async (targetUserId: string) => {
    if (!enquiry) return;
    try {
      const updated = await apiClient.patch<EnquiryDetail>(`/admin/enquiries/${enquiry.id}/assign`, {
        assignedToId: targetUserId || null,
      });
      setEnquiry(updated);
      setAssignToId(targetUserId);
      success("Assignment updated");
    } catch (err: any) {
      toastError(err.message || "Failed to assign lead");
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiry || isUpdatingDetails) return;
    setIsUpdatingDetails(true);
    try {
      const updated = await apiClient.patch<EnquiryDetail>(`/admin/enquiries/${enquiry.id}/details`, {
        nextAction: nextActionInput.trim() || null,
        demoDate: demoDateInput ? new Date(demoDateInput).toISOString() : null,
        priority: priorityInput,
      });
      setEnquiry(updated);
      success("Details saved");
    } catch (err: any) {
      toastError(err.message || "Failed to update details");
    } finally {
      setIsUpdatingDetails(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiry || !newNote.trim() || isAddingNote) return;
    setIsAddingNote(true);
    try {
      const created = await apiClient.post<any>(`/admin/enquiries/${enquiry.id}/notes`, {
        content: newNote.trim(),
      });
      setEnquiry((prev) => (prev ? { ...prev, notes: [created, ...(prev.notes || [])] } : null));
      setNewNote("");
      success("Note added");
    } catch (err: any) {
      toastError(err.message || "Failed to save note");
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiry || !replySubject.trim() || !replyMessage.trim() || isSendingReply) return;
    setIsSendingReply(true);
    try {
      await apiClient.post(`/admin/enquiries/${enquiry.id}/send-email`, {
        subject: replySubject.trim(),
        message: replyMessage.trim(),
        demoDate: replyDemoDate ? new Date(replyDemoDate).toISOString() : undefined,
      });
      success("Email dispatched to prospect");
      setReplyMessage("");
      fetchEnquiry();
    } catch (err: any) {
      toastError(err.message || "Failed to send email");
    } finally {
      setIsSendingReply(false);
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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Determine current pipeline stage index
  const getPipelineIndex = (status: string) => {
    switch (status) {
      case "NEW": return 1;
      case "CONTACTED": return 2;
      case "QUALIFIED": return 3;
      case "DEMO_SCHEDULED":
      case "DEMO_COMPLETED": return 4;
      case "CONVERTED": return 5;
      default: return 1;
    }
  };

  const currentStep = enquiry ? getPipelineIndex(enquiry.status) : 1;

  if (isLoading) {
    return (
      <AdminShell>
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#2563EB] mb-2" />
          <p className="text-xs font-medium">Loading enquiry dossier...</p>
        </div>
      </AdminShell>
    );
  }

  if (!enquiry || error) {
    return (
      <AdminShell>
        <div className="p-8 bg-white border border-[#E5EAF2] rounded-xl text-center">
          <p className="text-sm font-medium text-slate-800">{error || "Enquiry not found"}</p>
          <Link
            href="/enquiries"
            className="mt-3 inline-flex items-center gap-1 text-xs text-[#2563EB] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to enquiries
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      {/* Page Header */}
      <PageHeader
        title={enquiry.companyName}
        subtitle={`Submitted by ${enquiry.fullName} (${enquiry.email}) • Origin: ${enquiry.page || "Website"}`}
        breadcrumbs={[
          { label: "Enquiries", href: "/enquiries" },
          { label: enquiry.companyName },
        ]}
        meta={<StatusBadge status={enquiry.status} size="sm" />}
        actions={
          <div className="flex items-center gap-2">
            {enquiry.status === "NEW" && (
              <button
                onClick={() => handleStatusChange("CONTACTED")}
                disabled={isUpdatingStatus}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Mark Contacted
              </button>
            )}
            {enquiry.status === "CONTACTED" && (
              <button
                onClick={() => handleStatusChange("QUALIFIED")}
                disabled={isUpdatingStatus}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Qualify Prospect
              </button>
            )}
            {enquiry.status === "QUALIFIED" && (
              <button
                onClick={() => handleStatusChange("DEMO_SCHEDULED")}
                disabled={isUpdatingStatus}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Schedule Demo
              </button>
            )}
            {enquiry.status === "DEMO_SCHEDULED" && (
              <button
                onClick={() => handleStatusChange("CONVERTED")}
                disabled={isUpdatingStatus}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Convert Deal
              </button>
            )}
          </div>
        }
      />

      {/* Thin Horizontal Pipeline Journey */}
      <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 mb-6 shadow-2xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {PIPELINE_STEPS.map((step, idx) => {
            const isCompleted = step.index < currentStep;
            const isCurrent = step.index === currentStep;

            return (
              <React.Fragment key={step.key}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      isCurrent
                        ? "bg-[#2563EB] text-white"
                        : isCompleted
                        ? "bg-slate-100 text-slate-700 border border-slate-200"
                        : "bg-slate-50 text-slate-400 border border-slate-200"
                    }`}
                  >
                    {isCompleted ? "✓" : step.index}
                  </div>
                  <span
                    className={`text-xs transition-colors ${
                      isCurrent
                        ? "font-semibold text-[#2563EB]"
                        : isCompleted
                        ? "font-medium text-slate-700"
                        : "font-normal text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {idx < PIPELINE_STEPS.length - 1 && (
                  <div className="flex-1 mx-3 h-0.5 bg-[#E5EAF2]" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): CRM Dossier, Notes, Email History, Activity */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dossier Card */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-6 shadow-2xs">
            {/* Contact Information */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Contact & Organization
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs">
                <div>
                  <span className="text-slate-500 block">Full name</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">{enquiry.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Email address</span>
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="font-medium text-[#2563EB] hover:underline mt-0.5 block truncate"
                  >
                    {enquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block">Phone number</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">{enquiry.phone || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Company name</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">{enquiry.companyName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Designation / Role</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">{enquiry.role || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">City / Location</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">{enquiry.city || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Retail industry</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">{enquiry.industry || "General Retail"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Outlet scale</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">{enquiry.outletCount || "—"}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E5EAF2] my-5" />

            {/* Request & Requirements */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Request & Requirements
              </h3>
              {enquiry.priorities && enquiry.priorities.length > 0 && (
                <div className="mb-3">
                  <span className="text-xs text-slate-500 block mb-1.5">Key Priorities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {enquiry.priorities.map((p, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAFBFD] text-slate-700 border border-[#E5EAF2]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {enquiry.message && (
                <div>
                  <span className="text-xs text-slate-500 block mb-1.5">Submitted Note</span>
                  <div className="p-3.5 rounded-lg bg-[#FAFBFD] border border-[#E5EAF2] text-xs text-slate-700 leading-relaxed">
                    {enquiry.message}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Internal Notes Card */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-6 shadow-2xs">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Internal Notes
            </h3>

            <form onSubmit={handleAddNote} className="mb-5">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write an internal operational note..."
                rows={3}
                className="w-full p-3 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!newNote.trim() || isAddingNote}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  {isAddingNote ? "Saving..." : "Add Note"}
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {enquiry.notes && enquiry.notes.length > 0 ? (
                enquiry.notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E5EAF2] text-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="font-medium text-slate-800">
                        {note.author?.displayName || note.author?.email || "Admin"}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatRelativeTime(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{note.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">No internal notes added yet.</p>
              )}
            </div>
          </div>

          {/* Email Communication History */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-6 shadow-2xs">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Email History
            </h3>

            <div className="space-y-2.5">
              {enquiry.emails && enquiry.emails.length > 0 ? (
                enquiry.emails.map((email) => {
                  const isExpanded = expandedEmailId === email.id;
                  return (
                    <div
                      key={email.id}
                      className="rounded-lg border border-[#E5EAF2] overflow-hidden text-xs transition-colors"
                    >
                      <button
                        onClick={() => setExpandedEmailId(isExpanded ? null : email.id)}
                        className="w-full p-3 bg-[#FAFBFD] hover:bg-slate-100/70 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <p className="font-medium text-slate-900 truncate">{email.subject}</p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            To: {email.recipient} • {formatRelativeTime(email.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <StatusBadge status={email.deliveryStatus} size="sm" showDot={false} />
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-3.5 bg-white border-t border-[#E5EAF2] text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-mono">
                          {email.body}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">No emails dispatched yet.</p>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-6 shadow-2xs">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Activity History
            </h3>

            <div className="space-y-3">
              {enquiry.activities && enquiry.activities.length > 0 ? (
                enquiry.activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium text-slate-900">{act.description}</span>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {formatRelativeTime(act.createdAt)}
                        </span>
                      </div>
                      {act.actor && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          By {act.actor.displayName || act.actor.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">No activity recorded.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Rail (5 cols): Triage Governance + Send Reply Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Triage & Management Panel */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-[#E5EAF2]">
              Management & Ownership
            </h3>

            {/* Stage Selector */}
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1.5">Pipeline Stage</label>
              <select
                value={enquiry.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdatingStatus}
                className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="NEW">New Lead</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="DEMO_SCHEDULED">Demo Scheduled</option>
                <option value="DEMO_COMPLETED">Demo Completed</option>
                <option value="FOLLOW_UP">Follow-up</option>
                <option value="CONVERTED">Converted</option>
                <option value="CLOSED">Closed</option>
                <option value="SPAM">Spam</option>
              </select>
            </div>

            {/* Owner Assignment */}
            {user?.roles?.includes("SUPER_ADMIN") ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-700">Assigned Owner</label>
                  {user && assignToId !== user.id && (
                    <button
                      onClick={() => handleAssign(user.id)}
                      className="text-[11px] text-[#2563EB] hover:underline cursor-pointer"
                    >
                      Assign to me
                    </button>
                  )}
                </div>
                <select
                  value={assignToId}
                  onChange={(e) => handleAssign(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {adminUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.displayName || u.email}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1.5">Assigned Owner</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-[#E5EAF2] rounded-lg text-xs text-slate-700">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-800">
                    {enquiry.assignedTo?.displayName || enquiry.assignedTo?.email || "Assigned to You"}
                  </span>
                  <span className="ml-auto text-[10px] text-slate-400 font-medium">(Read-only)</span>
                </div>
              </div>
            )}

            {/* Priority & Next Action Form */}
            <form onSubmit={handleSaveDetails} className="space-y-3 pt-2 border-t border-[#E5EAF2]">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1.5">Priority</label>
                <select
                  value={priorityInput}
                  onChange={(e) => setPriorityInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1.5">Next Action</label>
                <input
                  type="text"
                  value={nextActionInput}
                  onChange={(e) => setNextActionInput(e.target.value)}
                  placeholder="e.g. Call back on Tuesday..."
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1.5">Scheduled Demo Date</label>
                <input
                  type="datetime-local"
                  value={demoDateInput}
                  onChange={(e) => setDemoDateInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingDetails}
                className="w-full py-2 text-xs font-medium text-slate-700 bg-[#FAFBFD] hover:bg-slate-100 border border-[#E5EAF2] rounded-lg transition-colors cursor-pointer"
              >
                {isUpdatingDetails ? "Saving..." : "Save Details"}
              </button>
            </form>
          </div>

          {/* Send Prospect Reply Panel */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-[#E5EAF2] mb-3">
              Send Prospect Reply
            </h3>

            <form onSubmit={handleSendReply} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">To</label>
                <input
                  type="text"
                  disabled
                  value={enquiry.email}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-[#E5EAF2] rounded-lg text-slate-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Subject</label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  placeholder="Email subject..."
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Message</label>
                <textarea
                  rows={4}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Write a personalized reply to the prospect..."
                  className="w-full p-3 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Confirm Demo Date (Optional)</label>
                <input
                  type="datetime-local"
                  value={replyDemoDate}
                  onChange={(e) => setReplyDemoDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <button
                type="submit"
                disabled={!replySubject.trim() || !replyMessage.trim() || isSendingReply}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingReply ? "Sending..." : "Send Email"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
