"use client";

import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/shell/admin-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SaveBar } from "@/components/ui/save-bar";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/context";
import {
  Building2,
  Mail,
  Link2,
  Users,
  Shield,
  Bell,
  Cpu,
  Plus,
  Trash2,
  Edit2,
  KeyRound,
  Lock,
  Unlock,
  Check,
  AlertCircle,
  Copy,
  RotateCcw,
  Activity,
  Send,
  Database,
  Server,
  RefreshCw,
  Search,
  ExternalLink,
} from "lucide-react";

interface SiteSettings {
  siteName: string;
  companyName: string;
  tagline: string;
  description: string;
  currency: string;
  timezone: string;
  locale: string;
  addressCity: string;
  addressState: string;
  addressCountry: string;
  addressPostal: string;

  salesEmail: string;
  supportEmail: string;
  salesPhone: string;
  whatsappNumber: string;
  whatsappUrl: string;
  officeLocation: string;

  publicSiteUrl: string;
  tenantPortalUrl: string;
  calendlyUrl: string;
  brochureUrl: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  metaPixelId: string;

  maxLoginAttempts: string;
  lockoutDurationMinutes: string;
  sessionTimeoutMinutes: string;
  enforceStrongPassword: boolean;
  forcePasswordChangeFirstLogin: boolean;

  leadNotificationEmails: string;
  autoReplyLeadEmail: boolean;

  maintenanceMode: boolean;
  maintenanceMessage: string;
}

interface AdminUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  status: "ACTIVE" | "DISABLED";
  role: string;
  failedLoginCount: number;
  isLocked: boolean;
  lockedUntil: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

interface SystemDiagnostics {
  database: {
    status: string;
    latencyMs: number;
    provider: string;
  };
  server: {
    nodeVersion: string;
    platform: string;
    arch: string;
    uptimeSeconds: number;
    memory: {
      heapUsedMb: number;
      heapTotalMb: number;
      rssMb: number;
    };
  };
  security: {
    activeSessions: number;
  };
  email: {
    isConfigured: boolean;
  };
}

export default function SettingsPage() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "identity" | "contact" | "integrations" | "users" | "security" | "notifications" | "maintenance"
  >("identity");

  // Settings State
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [initialSettings, setInitialSettings] = useState<SiteSettings | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Users State
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isUserLoading, setIsUserLoading] = useState(false);

  // Modals State
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [resettingUser, setResettingUser] = useState<AdminUser | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [resetPasswordMode, setResetPasswordMode] = useState<"auto" | "custom">("auto");
  const [resetCustomPassword, setResetCustomPassword] = useState("");

  // Change Password Form State (For logged-in user in Security Tab)
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    displayName: "",
    email: "",
    username: "",
    role: "SITE_ADMIN" as const,
    password: "",
  });

  // Diagnostics State
  const [diagnostics, setDiagnostics] = useState<SystemDiagnostics | null>(null);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  // Feedback Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    loadSettings();
    loadUsers();
  }, []);

  useEffect(() => {
    if (activeTab === "maintenance") {
      loadDiagnostics();
    }
  }, [activeTab]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get<SiteSettings>("/admin/settings");
      if (res) {
        setSettings(res);
        setInitialSettings(JSON.parse(JSON.stringify(res)));
        setIsDirty(false);
      }
    } catch (err: any) {
      console.error("Failed to load site settings:", err);
      showToast(err?.message || "Failed to load settings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setIsUserLoading(true);
      const res = await apiClient.get<AdminUser[]>("/admin/users");
      if (Array.isArray(res)) {
        setUsersList(res);
      }
    } catch (err: any) {
      console.error("Failed to load users:", err);
    } finally {
      setIsUserLoading(false);
    }
  };

  const loadDiagnostics = async () => {
    try {
      const res = await apiClient.get<SystemDiagnostics>("/admin/settings/diagnostics");
      if (res) {
        setDiagnostics(res);
      }
    } catch (err) {
      console.error("Diagnostics load error:", err);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      setIsSaving(true);
      await apiClient.put("/admin/settings", settings);
      setInitialSettings(JSON.parse(JSON.stringify(settings)));
      setIsDirty(false);
      showToast("Platform settings saved and applied successfully!", "success");
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      showToast(err?.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardSettings = () => {
    if (initialSettings) {
      setSettings(JSON.parse(JSON.stringify(initialSettings)));
      setIsDirty(false);
      showToast("Unsaved changes discarded", "success");
    }
  };

  const updateSettingField = (field: keyof SiteSettings, value: any) => {
    setSettings((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [field]: value };
      setIsDirty(true);
      return next;
    });
  };

  // User Actions
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.displayName || !newUserForm.email) {
      alert("Name and email are required.");
      return;
    }
    try {
      const res = await apiClient.post<any>("/admin/users", newUserForm);
      showToast(`User ${newUserForm.displayName} created successfully!`, "success");
      setGeneratedPassword(res.temporaryPassword || "Password set");
      setNewUserForm({
        displayName: "",
        email: "",
        username: "",
        role: "SITE_ADMIN",
        password: "",
      });
      await loadUsers();
    } catch (err: any) {
      alert(err?.message || "Failed to create user");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await apiClient.patch(`/admin/users/${editingUser.id}`, {
        displayName: editingUser.displayName,
        email: editingUser.email,
        username: editingUser.username,
        role: editingUser.role,
      });
      showToast("User details updated successfully!", "success");
      setEditingUser(null);
      await loadUsers();
    } catch (err: any) {
      alert(err?.message || "Failed to update user");
    }
  };

  const handleResetPassword = async (id: string, customPassword?: string) => {
    try {
      const cleanCustom = customPassword?.trim();
      const res = await apiClient.post<any>(`/admin/users/${id}/reset-password`, {
        password: cleanCustom || undefined,
      });
      setGeneratedPassword(res.temporaryPassword || cleanCustom || "Password successfully updated");
      showToast("Password reset successfully!", "success");
      await loadUsers();
    } catch (err: any) {
      alert(err?.message || "Failed to reset password");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError("");
    setChangePasswordSuccess(false);

    if (changePasswordForm.newPassword.length < 8) {
      setChangePasswordError("New password must be at least 8 characters.");
      return;
    }
    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      setChangePasswordError("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await apiClient.post("/auth/change-password", {
        currentPassword: changePasswordForm.currentPassword.trim(),
        newPassword: changePasswordForm.newPassword.trim(),
      });
      setChangePasswordSuccess(true);
      setChangePasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast("Your password was changed successfully!", "success");
    } catch (err: any) {
      setChangePasswordError(err?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleToggleUserStatus = async (user: AdminUser) => {
    if (user.id === currentUser?.id) {
      alert("You cannot disable your own account.");
      return;
    }
    const action = user.status === "ACTIVE" ? "disable" : "activate";
    if (!confirm(`Are you sure you want to ${action} ${user.displayName}'s access?`)) return;

    try {
      await apiClient.patch(`/admin/users/${user.id}/toggle-status`, {});
      showToast(`User ${action}d successfully.`, "success");
      await loadUsers();
    } catch (err: any) {
      alert(err?.message || "Failed to toggle user status");
    }
  };

  const handleUnlockUser = async (user: AdminUser) => {
    try {
      await apiClient.post(`/admin/users/${user.id}/unlock`, {});
      showToast(`User ${user.displayName} unlocked successfully!`, "success");
      await loadUsers();
    } catch (err: any) {
      alert(err?.message || "Failed to unlock user");
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (user.id === currentUser?.id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!confirm(`Permanently delete user "${user.displayName}" (${user.email})? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiClient.delete(`/admin/users/${user.id}`);
      showToast("User deleted successfully.", "success");
      await loadUsers();
    } catch (err: any) {
      alert(err?.message || "Failed to delete user");
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress) {
      alert("Enter a recipient email address.");
      return;
    }
    try {
      setIsSendingTestEmail(true);
      const res = await apiClient.post<any>("/admin/settings/test-email", {
        recipientEmail: testEmailAddress,
      });
      if (res?.success) {
        showToast("Test email dispatched successfully!", "success");
      } else {
        showToast(res?.message || "Failed to send test email.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to send test email", "error");
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleRevokeSessions = async () => {
    if (!confirm("This will log out all currently active users across all devices. Proceed?")) return;
    try {
      const res = await apiClient.post<any>("/admin/settings/revoke-sessions", {});
      showToast(`Terminated ${res.count} active sessions.`, "success");
      await loadDiagnostics();
    } catch (err: any) {
      showToast(err?.message || "Failed to revoke sessions", "error");
    }
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.displayName?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (isLoading || !settings) {
    return (
      <AdminShell>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-slate-500">Loading Platform Settings...</p>
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-3">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-xs font-medium text-white ${
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Settings & Governance"
        subtitle="Configure enterprise brand identity, inbound contact channels, integrations, power user management, and system security."
        breadcrumbs={[{ label: "System" }, { label: "Settings" }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving || !isDirty}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        }
      />

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#E5EAF2] mb-6 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("identity")}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "identity"
              ? "border-[#2563EB] text-[#2563EB]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Organization & Brand</span>
        </button>

        <button
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "contact"
              ? "border-[#2563EB] text-[#2563EB]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Inbound & Sales</span>
        </button>

        <button
          onClick={() => setActiveTab("integrations")}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "integrations"
              ? "border-[#2563EB] text-[#2563EB]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>Integrations & URLs</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "users"
              ? "border-[#2563EB] text-[#2563EB]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Power User Management</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "security"
              ? "border-[#2563EB] text-[#2563EB]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Governance</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "notifications"
              ? "border-[#2563EB] text-[#2563EB]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications & Email</span>
        </button>

        <button
          onClick={() => setActiveTab("maintenance")}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "maintenance"
              ? "border-[#2563EB] text-[#2563EB]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>System & Maintenance</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: ORGANIZATION & BRAND */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "identity" && (
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Brand & Organization Profile</h3>
            <p className="text-xs text-slate-500">
              Corporate identity and operating regional parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Platform Brand Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateSettingField("siteName", e.target.value)}
                placeholder="e.g. Bizonix"
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Legal Entity / Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => updateSettingField("companyName", e.target.value)}
                placeholder="e.g. Fibonce Tech Solutions Pvt. Ltd."
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-medium mb-1.5">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => updateSettingField("tagline", e.target.value)}
                placeholder="e.g. Business and Operations, Smarter Together"
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-medium mb-1.5">Enterprise Description</label>
              <textarea
                rows={3}
                value={settings.description}
                onChange={(e) => updateSettingField("description", e.target.value)}
                placeholder="Elevator pitch used for metadata and SEO..."
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Operating Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => updateSettingField("currency", e.target.value)}
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="INR">INR (₹) — Indian Rupee</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="AED">AED (د.إ) — UAE Dirham</option>
                <option value="GBP">GBP (£) — British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">System Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSettingField("timezone", e.target.value)}
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                <option value="UTC">UTC (+0:00)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                <option value="America/New_York">America/New_York (EST -5:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Registered Office City</label>
              <input
                type="text"
                value={settings.addressCity}
                onChange={(e) => updateSettingField("addressCity", e.target.value)}
                placeholder="e.g. Bangalore"
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">State & Country</label>
              <input
                type="text"
                value={`${settings.addressState}, ${settings.addressCountry}`}
                onChange={(e) => {
                  const parts = e.target.value.split(",");
                  updateSettingField("addressState", parts[0]?.trim() || "");
                  updateSettingField("addressCountry", parts[1]?.trim() || "India");
                }}
                placeholder="Karnataka, India"
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: INBOUND CONTACT & SALES */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "contact" && (
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Inbound Sales & Contact Channels</h3>
            <p className="text-xs text-slate-500">
              Configure communication channels rendered in the public header, footer, and lead intake forms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Official Sales Email</label>
              <input
                type="email"
                value={settings.salesEmail}
                onChange={(e) => updateSettingField("salesEmail", e.target.value)}
                placeholder="sales@bizonix.in"
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => updateSettingField("supportEmail", e.target.value)}
                placeholder="support@bizonix.in"
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Sales Phone Hotline</label>
              <input
                type="text"
                value={settings.salesPhone}
                onChange={(e) => updateSettingField("salesPhone", e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">WhatsApp Direct Number (with Country Code)</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => {
                  const num = e.target.value.replace(/[^0-9]/g, "");
                  updateSettingField("whatsappNumber", num);
                  updateSettingField("whatsappUrl", `https://wa.me/${num}`);
                }}
                placeholder="919876543210"
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-medium mb-1.5">Generated WhatsApp Direct Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={settings.whatsappUrl}
                  className="w-full px-3 py-2 bg-slate-50 border border-[#E5EAF2] rounded-lg text-slate-600 font-mono text-[11px]"
                />
                <a
                  href={settings.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1 font-semibold whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Link</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 3: INTEGRATIONS & TRACKING */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "integrations" && (
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Platform Integrations & External URLs</h3>
            <p className="text-xs text-slate-500">
              Configure endpoints, customer login portals, and marketing tracking tags.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Public Website Origin</label>
              <input
                type="text"
                value={settings.publicSiteUrl}
                onChange={(e) => updateSettingField("publicSiteUrl", e.target.value)}
                placeholder="http://localhost:3000"
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Tenant Login / ERP Portal URL</label>
              <input
                type="text"
                value={settings.tenantPortalUrl}
                onChange={(e) => updateSettingField("tenantPortalUrl", e.target.value)}
                placeholder="https://app.bizonix.in"
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Calendly Meeting Scheduler URL</label>
              <input
                type="text"
                value={settings.calendlyUrl}
                onChange={(e) => updateSettingField("calendlyUrl", e.target.value)}
                placeholder="https://calendly.com/bizonix-demo"
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Brochure PDF Download URL</label>
              <input
                type="text"
                value={settings.brochureUrl}
                onChange={(e) => updateSettingField("brochureUrl", e.target.value)}
                placeholder="/brochure-coming-soon"
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Google Analytics 4 (GA4 ID)</label>
              <input
                type="text"
                value={settings.googleAnalyticsId}
                onChange={(e) => updateSettingField("googleAnalyticsId", e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Google Tag Manager (GTM ID)</label>
              <input
                type="text"
                value={settings.googleTagManagerId}
                onChange={(e) => updateSettingField("googleTagManagerId", e.target.value)}
                placeholder="GTM-XXXXXXX"
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 4: POWER USER MANAGEMENT */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5EAF2] flex-wrap gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">System Users & Access Delegation</h3>
                <p className="text-xs text-slate-500">
                  Manage administrative accounts, role levels, login lockouts, and credentials.
                </p>
              </div>

              <button
                onClick={() => {
                  setGeneratedPassword(null);
                  setIsCreateUserModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create User</span>
              </button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user by name, email, or username..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Filter Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-800 focus:outline-none"
                >
                  <option value="ALL">All Roles</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  <option value="SITE_ADMIN">SITE_ADMIN</option>
                  <option value="EDITOR">EDITOR</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto border border-[#E5EAF2] rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5EAF2] bg-[#FAFBFD] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Security</th>
                    <th className="py-3 px-4">Last Login</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EAF2] text-xs">
                  {filteredUsers.map((u) => {
                    const isSelf = u.id === currentUser?.id;
                    return (
                      <tr key={u.id} className="hover:bg-[#FAFBFD] transition-colors">
                        <td className="py-3.5 px-4">
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{u.displayName}</span>
                              {isSelf && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-100 text-blue-700 font-bold">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                              u.role === "SUPER_ADMIN"
                                ? "bg-purple-100 text-purple-700 border border-purple-200"
                                : u.role === "SITE_ADMIN"
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              u.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
                              }`}
                            />
                            <span>{u.status}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {u.isLocked ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-700 font-bold">
                              <Lock className="w-3 h-3" />
                              <span>LOCKED</span>
                            </span>
                          ) : u.failedLoginCount > 0 ? (
                            <span className="text-[11px] text-amber-600 font-medium">
                              {u.failedLoginCount} failed attempts
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Normal</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "Never"}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Unlock button if locked */}
                            {u.isLocked && (
                              <button
                                onClick={() => handleUnlockUser(u)}
                                title="Unlock account"
                                className="p-1 text-amber-600 hover:bg-amber-50 rounded cursor-pointer"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Reset Password */}
                            <button
                              onClick={() => {
                                setResettingUser(u);
                                setGeneratedPassword(null);
                              }}
                              title="Reset Password"
                              className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded cursor-pointer"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Profile */}
                            <button
                              onClick={() => setEditingUser({ ...u })}
                              title="Edit user details"
                              className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Status Toggle (Activate / Disable) */}
                            {!isSelf && (
                              <button
                                onClick={() => handleToggleUserStatus(u)}
                                title={u.status === "ACTIVE" ? "Disable account" : "Activate account"}
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                                  u.status === "ACTIVE"
                                    ? "text-slate-500 hover:text-red-600 hover:bg-red-50"
                                    : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                                }`}
                              >
                                {u.status === "ACTIVE" ? "Disable" : "Activate"}
                              </button>
                            )}

                            {/* Delete User */}
                            {!isSelf && (
                              <button
                                onClick={() => handleDeleteUser(u)}
                                title="Delete user"
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 5: SECURITY & GOVERNANCE */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "security" && (
        <div className="bg-white border border-[#E5EAF2] rounded-xl p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Security & Authentication Policies</h3>
            <p className="text-xs text-slate-500">
              Argon2 hashing governance, lockout limits, session expiry, and emergency access revocation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">
                Max Failed Login Attempts Before Lockout
              </label>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => updateSettingField("maxLoginAttempts", e.target.value)}
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">
                Lockout Duration (Minutes)
              </label>
              <input
                type="number"
                value={settings.lockoutDurationMinutes}
                onChange={(e) => updateSettingField("lockoutDurationMinutes", e.target.value)}
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">
                Inactivity Session Expiration (Minutes)
              </label>
              <input
                type="number"
                value={settings.sessionTimeoutMinutes}
                onChange={(e) => updateSettingField("sessionTimeoutMinutes", e.target.value)}
                className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex flex-col justify-end space-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enforceStrongPassword}
                  onChange={(e) => updateSettingField("enforceStrongPassword", e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-medium text-slate-800">
                  Enforce Strong Password Complexity (min 8 chars, mixed case, numbers & symbols)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.forcePasswordChangeFirstLogin}
                  onChange={(e) => updateSettingField("forcePasswordChangeFirstLogin", e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-medium text-slate-800">
                  Require Password Change on First Sign In
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5EAF2] flex items-center justify-between flex-wrap gap-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-900">Emergency Session Revocation</h4>
              <p className="text-[11px] text-slate-500">
                Immediately terminates all active refresh sessions across all admin users.
              </p>
            </div>
            <button
              onClick={handleRevokeSessions}
              className="px-3.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg cursor-pointer transition-colors"
            >
              Revoke All Active Sessions
            </button>
          </div>

          {/* Change Account Password Card */}
          <div className="pt-6 border-t border-[#E5EAF2] space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-900">Change Your Account Password</h4>
              <p className="text-[11px] text-slate-500">
                Update your login credentials. Minimum 8 characters required.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="max-w-md space-y-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={changePasswordForm.currentPassword}
                  onChange={(e) =>
                    setChangePasswordForm({ ...changePasswordForm, currentPassword: e.target.value })
                  }
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={changePasswordForm.newPassword}
                    onChange={(e) =>
                      setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })
                    }
                    placeholder="Min 8 characters"
                    className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={changePasswordForm.confirmPassword}
                    onChange={(e) =>
                      setChangePasswordForm({ ...changePasswordForm, confirmPassword: e.target.value })
                    }
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {changePasswordError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{changePasswordError}</span>
                </div>
              )}

              {changePasswordSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Your password has been changed successfully!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isChangingPassword ||
                  !changePasswordForm.currentPassword ||
                  changePasswordForm.newPassword.length < 8 ||
                  changePasswordForm.newPassword !== changePasswordForm.confirmPassword
                }
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg cursor-pointer transition-colors flex items-center gap-2"
              >
                {isChangingPassword ? "Updating Password…" : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 6: NOTIFICATIONS & EMAIL */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Inbound Lead & Email Notifications</h3>
              <p className="text-xs text-slate-500">
                Manage email routing for demo requests and verify live deliverability.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1.5">
                  Lead Notification Alert Recipients (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={settings.leadNotificationEmails}
                  onChange={(e) => updateSettingField("leadNotificationEmails", e.target.value)}
                  placeholder="admin@bizonix.com, sales-leads@bizonix.com"
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Whenever a prospect submits a demo or contact form, automated alert emails are sent to these addresses.
                </span>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoReplyLeadEmail}
                    onChange={(e) => updateSettingField("autoReplyLeadEmail", e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="font-medium text-slate-800">
                    Send Instant Confirmation Auto-Responder Email to Lead
                  </span>
                </label>
              </div>
            </div>

            {/* Test Email Dispatch Utility */}
            <div className="p-4 bg-[#FAFBFD] border border-[#E5EAF2] rounded-xl space-y-3">
              <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-blue-600" />
                <span>Test Email Delivery</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Send a real test email to verify that your configured provider is actively delivering messages.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  placeholder="Enter email to receive test message..."
                  className="px-3 py-1.5 text-xs bg-white border border-[#E5EAF2] rounded-lg text-slate-900 w-full sm:w-80"
                />
                <button
                  onClick={handleSendTestEmail}
                  disabled={isSendingTestEmail}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  {isSendingTestEmail ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Send Test Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 7: SYSTEM & MAINTENANCE */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "maintenance" && (
        <div className="space-y-6">
          {/* Maintenance Mode Card */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Maintenance Mode</h3>
                <p className="text-xs text-slate-500">
                  Put the public storefront into maintenance state while performing backend updates.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => updateSettingField("maintenanceMode", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                <span className="ml-2.5 text-xs font-medium text-slate-700">
                  {settings.maintenanceMode ? "Enabled" : "Normal Mode"}
                </span>
              </label>
            </div>

            {settings.maintenanceMode && (
              <div className="text-xs">
                <label className="block text-slate-700 font-medium mb-1.5">
                  Visitor Maintenance Notice
                </label>
                <textarea
                  rows={2}
                  value={settings.maintenanceMessage}
                  onChange={(e) => updateSettingField("maintenanceMessage", e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-amber-300 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Live System Diagnostics */}
          <div className="bg-white border border-[#E5EAF2] rounded-xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>Live System Diagnostics</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time health telemetry from the NestJS runtime and PostgreSQL database.
                </p>
              </div>

              <button
                onClick={loadDiagnostics}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg border border-[#E5EAF2] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Diagnostics</span>
              </button>
            </div>

            {diagnostics ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Database */}
                <div className="p-3.5 bg-[#FAFBFD] border border-[#E5EAF2] rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-medium">PostgreSQL 16</span>
                    <Database className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{diagnostics.database.status}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Latency: {diagnostics.database.latencyMs}ms
                  </div>
                </div>

                {/* Server Uptime */}
                <div className="p-3.5 bg-[#FAFBFD] border border-[#E5EAF2] rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-medium">Runtime Uptime</span>
                    <Server className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    {Math.floor(diagnostics.server.uptimeSeconds / 60)} min {diagnostics.server.uptimeSeconds % 60}s
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Node: {diagnostics.server.nodeVersion}
                  </div>
                </div>

                {/* Heap Memory */}
                <div className="p-3.5 bg-[#FAFBFD] border border-[#E5EAF2] rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-medium">Heap Memory</span>
                    <Cpu className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    {diagnostics.server.memory.heapUsedMb} MB
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Total: {diagnostics.server.memory.heapTotalMb} MB
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="p-3.5 bg-[#FAFBFD] border border-[#E5EAF2] rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-medium">Active Sessions</span>
                    <Shield className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    {diagnostics.security.activeSessions}
                  </div>
                  <div className="text-[11px] text-slate-500">Valid JWT Tokens</div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                Click "Refresh Diagnostics" to load server metrics.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL: CREATE USER */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {isCreateUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-[#E5EAF2] shadow-2xl max-w-md w-full p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-semibold text-slate-900">Create New Administrator User</h3>

            {generatedPassword ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>User Created Successfully!</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Copy this temporary password and deliver it to the user. It will not be shown again.
                </p>
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-emerald-300">
                  <span className="font-mono text-xs font-bold text-slate-900 flex-1 truncate select-all">
                    {generatedPassword}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPassword);
                      showToast("Password copied to clipboard!", "success");
                    }}
                    className="p-1 hover:bg-slate-100 rounded text-slate-600"
                    title="Copy Password"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setIsCreateUserModalOpen(false);
                      setGeneratedPassword(null);
                    }}
                    className="px-4 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateUser} className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.displayName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, displayName: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="priya@bizonix.com"
                    className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Username (Optional)</label>
                  <input
                    type="text"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    placeholder="priya.sharma"
                    className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Role Level</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="SITE_ADMIN">SITE_ADMIN (Can edit all content & enquiries)</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Full platform governance)</option>
                    <option value="EDITOR">EDITOR (Drafts & CMS editorial)</option>
                    <option value="VIEWER">VIEWER (Read-only access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Initial Password (Optional)</label>
                  <input
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder="Leave blank to auto-generate secure 14-char password"
                    className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    If blank, a random Argon2-hashed password will be generated for you to copy.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
                  <button
                    type="button"
                    onClick={() => setIsCreateUserModalOpen(false)}
                    className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                  >
                    Create User
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL: EDIT USER */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-[#E5EAF2] shadow-2xl max-w-md w-full p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-semibold text-slate-900">Edit User Details</h3>

            <form onSubmit={handleUpdateUser} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.displayName}
                  onChange={(e) => setEditingUser({ ...editingUser, displayName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={editingUser.username || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Role Level</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="SITE_ADMIN">SITE_ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  <option value="EDITOR">EDITOR</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL: RESET PASSWORD */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-[#E5EAF2] shadow-2xl max-w-md w-full p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-semibold text-slate-900">
              Reset Password for {resettingUser.displayName}
            </h3>

            {generatedPassword ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Password Reset Completed!</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Copy the new password and provide it securely to the user:
                </p>
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-emerald-300">
                  <span className="font-mono text-xs font-bold text-slate-900 flex-1 truncate select-all">
                    {generatedPassword}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPassword);
                      showToast("Password copied to clipboard!", "success");
                    }}
                    className="p-1 hover:bg-slate-100 rounded text-slate-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setResettingUser(null);
                      setGeneratedPassword(null);
                    }}
                    className="px-4 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-1 bg-[#F1F4F9] p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setResetPasswordMode("auto")}
                    className={`flex-1 py-1 text-center font-medium rounded-md transition-colors cursor-pointer ${
                      resetPasswordMode === "auto" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Auto-Generate
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetPasswordMode("custom")}
                    className={`flex-1 py-1 text-center font-medium rounded-md transition-colors cursor-pointer ${
                      resetPasswordMode === "custom" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Set Custom Password
                  </button>
                </div>

                {resetPasswordMode === "auto" ? (
                  <p className="text-slate-600 leading-relaxed">
                    Generate a cryptographically secure 14-character temporary password hashed with Argon2. All existing active sessions for this user will be invalidated.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-slate-700 font-medium">
                      Enter New Password (minimum 8 characters)
                    </label>
                    <input
                      type="text"
                      value={resetCustomPassword}
                      onChange={(e) => setResetCustomPassword(e.target.value)}
                      placeholder="e.g. Bizonix#2026Secure!"
                      className="w-full px-3 py-2 bg-[#FAFBFD] border border-[#E5EAF2] rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 font-mono text-xs"
                    />
                    <p className="text-[11px] text-slate-400">
                      User will be able to log in immediately with this chosen password.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5EAF2]">
                  <button
                    type="button"
                    onClick={() => {
                      setResettingUser(null);
                      setResetCustomPassword("");
                      setResetPasswordMode("auto");
                    }}
                    className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={resetPasswordMode === "custom" && resetCustomPassword.trim().length < 8}
                    onClick={() =>
                      handleResetPassword(
                        resettingUser.id,
                        resetPasswordMode === "custom" ? resetCustomPassword.trim() : undefined,
                      )
                    }
                    className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg cursor-pointer transition-colors"
                  >
                    {resetPasswordMode === "custom" ? "Save Custom Password" : "Generate New Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating SaveBar */}
      <SaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSaveSettings}
        onDiscard={handleDiscardSettings}
        onPublish={handleSaveSettings}
        publishLabel="Save Settings"
      />
    </AdminShell>
  );
}
