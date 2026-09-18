"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ExternalLink, Bell, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth/context";

interface AdminTopBarProps {
  onOpenMobileNav: () => void;
  onOpenSearch?: () => void;
}

export function AdminTopBar({ onOpenMobileNav, onOpenSearch }: AdminTopBarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Generate clean breadcrumbs from pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    let label = seg.charAt(0).toUpperCase() + seg.slice(1);
    if (seg === "audit") label = "Audit Trail";
    if (seg === "enquiries") label = "Enquiries";
    if (seg === "dashboard") label = "Dashboard";
    if (seg === "employees") label = "Team";
    if (seg === "hero") label = "Heroes";
    return { label, href, isLast: idx === segments.length - 1 };
  });

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "A";

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E5EAF2] flex items-center justify-between px-6 select-none">
      {/* Left: Mobile Nav Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="hidden sm:flex items-center gap-1.5 text-[13px] text-slate-500 truncate">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors font-medium">
            Bizonix
          </Link>
          {breadcrumbs.map((crumb) => (
            <React.Fragment key={crumb.href}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              {crumb.isLast ? (
                <span className="text-slate-900 font-semibold truncate">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-slate-900 transition-colors font-medium">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Quick Search, Website Link, Notification Bell, User Account */}
      <div className="flex items-center gap-3">
        {/* Global Search trigger */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="flex items-center justify-between w-56 md:w-64 px-3 py-1.5 text-xs text-slate-400 bg-[#F8FAFC] hover:bg-slate-100/80 border border-[#E5EAF2] rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              <span className="text-slate-500 font-normal">Quick search...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-sans font-medium bg-white border border-slate-200 rounded text-slate-400 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        )}

        {/* View Production Site */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-[#F8FAFC] rounded-lg border border-[#E5EAF2] transition-colors"
        >
          <span>bizonix.com</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>

        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-600" />
        </button>

        <div className="h-5 w-[1px] bg-[#E5EAF2] hidden sm:block" />

        {/* User Mini Profile */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-semibold text-xs shrink-0 shadow-2xs">
            {userInitial}
          </div>
          <div className="hidden md:block text-left leading-tight">
            <span className="text-xs font-semibold text-slate-900 block truncate max-w-[120px]">
              {user?.displayName || "Administrator"}
            </span>
            <span className="text-[11px] font-normal text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

