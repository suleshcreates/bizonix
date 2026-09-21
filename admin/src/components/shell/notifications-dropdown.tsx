"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import {
  Bell,
  CheckCheck,
  Inbox,
  Shield,
  Activity,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export interface NotificationItem {
  id: string;
  type: "enquiry" | "audit" | "system";
  title: string;
  description: string;
  timestamp: string;
  href: string;
  priority?: string;
  badge?: string;
}

function timeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

export function NotificationsDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load read notifications from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bizonix_read_notifications");
      if (stored) {
        setReadIds(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save read notifications to localStorage
  const persistReadIds = (newReadIds: Set<string>) => {
    setReadIds(newReadIds);
    try {
      localStorage.setItem("bizonix_read_notifications", JSON.stringify(Array.from(newReadIds)));
    } catch {
      // ignore
    }
  };

  // Fetch enquiries and audit activity
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const [enquiriesRes, auditRes] = await Promise.allSettled([
        apiClient.get<any>("/admin/enquiries?page=1&limit=6"),
        apiClient.get<any>("/admin/audit?limit=4"),
      ]);

      const items: NotificationItem[] = [];

      if (enquiriesRes.status === "fulfilled" && enquiriesRes.value?.items) {
        enquiriesRes.value.items.forEach((enq: any) => {
          items.push({
            id: `enq_${enq.id}`,
            type: "enquiry",
            title: `New Enquiry: ${enq.fullName}`,
            description: `${enq.companyName ? `${enq.companyName} • ` : ""}${enq.workEmail || enq.email || "Lead"}`,
            timestamp: enq.createdAt,
            href: "/enquiries",
            priority: enq.priority,
            badge: enq.status,
          });
        });
      }

      if (auditRes.status === "fulfilled" && auditRes.value?.items) {
        auditRes.value.items.forEach((log: any) => {
          items.push({
            id: `aud_${log.id}`,
            type: "audit",
            title: log.action.replace(/_/g, " "),
            description: `${log.actor?.displayName || "System"} • ${log.resourceType || "Audit"}`,
            timestamp: log.createdAt,
            href: "/audit",
            badge: "LOG",
          });
        });
      }

      // Sort by newest timestamp
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // If no notifications exist yet, supply a default onboarding item
      if (items.length === 0) {
        items.push({
          id: "sys_welcome",
          type: "system",
          title: "System Ready",
          description: "All services are operational. Inbound enquiries will appear here.",
          timestamp: new Date().toISOString(),
          href: "/settings",
          badge: "SYSTEM",
        });
      }

      setNotifications(items);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount and interval
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Derived counts
  const unreadNotifications = useMemo(() => {
    return notifications.filter((n) => !readIds.has(n.id));
  }, [notifications, readIds]);

  const unreadCount = unreadNotifications.length;

  const displayedNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return unreadNotifications;
    }
    return notifications;
  }, [activeTab, notifications, unreadNotifications]);

  const handleMarkAllRead = () => {
    const updated = new Set(readIds);
    notifications.forEach((n) => updated.add(n.id));
    persistReadIds(updated);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!readIds.has(item.id)) {
      const updated = new Set(readIds);
      updated.add(item.id);
      persistReadIds(updated);
    }
    setIsOpen(false);
    router.push(item.href);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            fetchNotifications();
          }
        }}
        title="Notifications"
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
          isOpen
            ? "text-blue-600 bg-blue-50"
            : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        }`}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[14px] h-[14px] px-0.5 text-[9px] font-bold text-white bg-blue-600 rounded-full ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-[#E5EAF2] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div className="p-3.5 border-b border-[#E5EAF2] flex items-center justify-between bg-[#FAFBFD]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 hover:underline font-medium cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={fetchNotifications}
                disabled={isLoading}
                title="Refresh notifications"
                className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200/60 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-[#E5EAF2] px-3 pt-2 gap-2 bg-white text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2 px-1 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === "all"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`pb-2 px-1 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === "unread"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#E5EAF2]">
            {displayedNotifications.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-xs font-semibold text-slate-700">All caught up!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {activeTab === "unread"
                    ? "You have no unread notifications."
                    : "No notifications found."}
                </p>
              </div>
            ) : (
              displayedNotifications.map((item) => {
                const isRead = readIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-start gap-3 text-left ${
                      !isRead ? "bg-blue-50/40" : "bg-white"
                    }`}
                  >
                    {/* Type Icon */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        item.type === "enquiry"
                          ? "bg-blue-100 text-blue-600"
                          : item.type === "audit"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {item.type === "enquiry" && <Inbox className="w-4 h-4" />}
                      {item.type === "audit" && <Activity className="w-4 h-4" />}
                      {item.type === "system" && <Shield className="w-4 h-4" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {timeAgo(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1">
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            {item.badge}
                          </span>
                        )}
                        {item.priority && item.priority === "URGENT" && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-100 text-red-700">
                            URGENT
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Unread indicator */}
                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-2 border-t border-[#E5EAF2] bg-[#FAFBFD] flex items-center justify-between text-[11px] text-slate-600">
            <Link
              href="/enquiries"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 font-medium hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <span>View Enquiries</span>
              <ChevronRight className="w-3 h-3" />
            </Link>

            <Link
              href="/audit"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 font-medium hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <span>Audit Log</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
