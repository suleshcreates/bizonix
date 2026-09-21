"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Home,
  LayoutTemplate,
  HelpCircle,
  Layers,
  Building2,
  Handshake,
  Compass,
  Search,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { apiClient } from "@/lib/api/client";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: string;
  external?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAVIGATION_SECTIONS: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Enquiries", href: "/enquiries", icon: Inbox, badgeKey: "newEnquiries" },
    ],
  },
  {
    title: "WEBSITE",
    items: [
      { label: "Home", href: "http://localhost:3000", icon: Home, external: true },
      { label: "Heroes", href: "/hero", icon: LayoutTemplate },
      { label: "FAQs", href: "/faqs", icon: HelpCircle },
      { label: "Modules", href: "/modules", icon: Layers },
      { label: "Industries", href: "/industries", icon: Building2 },
      { label: "Partners", href: "/partners", icon: Handshake },
      { label: "Navigation", href: "/navigation", icon: Compass },
    ],
  },
  {
    title: "GROWTH",
    items: [
      { label: "SEO", href: "/seo", icon: Search },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Team", href: "/employees", icon: Users },
      { label: "Audit Trail", href: "/audit", icon: ShieldCheck },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [newEnquiriesCount, setNewEnquiriesCount] = useState<number>(0);

  useEffect(() => {
    const fetchBadge = async () => {
      try {
        const stats = await apiClient.get<{ counts: { NEW: number } }>("/admin/enquiries/stats");
        if (stats?.counts?.NEW) {
          setNewEnquiriesCount(stats.counts.NEW);
        }
      } catch {
        // Silently ignore if not authorized or network issue
      }
    };
    fetchBadge();
  }, [pathname]);

  const isActive = (href: string) => {
    if (href.startsWith("http")) return false;
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const userRole = user?.roles?.[0] ? user.roles[0].replace("_", " ") : "ADMINISTRATOR";
  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "A";

  const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN");
  const visibleSections = isSuperAdmin
    ? NAVIGATION_SECTIONS
    : NAVIGATION_SECTIONS.filter((section) => section.title === "OVERVIEW");

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-[236px] bg-white border-r border-[#E5EAF2] flex flex-col transition-transform duration-200 ease-in-out select-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#E5EAF2] shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-md bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs tracking-tight shadow-xs">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-slate-900 leading-tight">BIZONIX</span>
              <span className="text-[10px] text-slate-400 font-medium leading-none tracking-wider">CONSOLE</span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Rail */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {visibleSections.map((section) => (
            <div key={section.title}>
              <p className="px-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  const badgeValue = item.badgeKey === "newEnquiries" ? newEnquiriesCount : 0;

                  const linkProps = item.external
                    ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                    : { href: item.href };

                  return (
                    <Link
                      key={item.href + item.label}
                      {...linkProps}
                      onClick={() => onClose && onClose()}
                      className={`group flex items-center justify-between h-9 px-2.5 rounded-lg text-[13px] transition-colors ${
                        active
                          ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-[#F8FAFC] font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            active ? "text-[#2563EB]" : "text-slate-400 group-hover:text-slate-600"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {badgeValue > 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 text-blue-700">
                            {badgeValue}
                          </span>
                        )}
                        {item.external && (
                          <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-slate-400" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Account Footer */}
        <div className="p-3 border-t border-[#E5EAF2] bg-[#FAFBFD] shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white border border-[#E5EAF2] flex items-center justify-center font-semibold text-xs text-slate-700 shrink-0 shadow-2xs">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate leading-tight">
                  {user?.displayName || "Admin User"}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[11px] font-normal text-slate-500 truncate">
                    {userRole}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign out"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
