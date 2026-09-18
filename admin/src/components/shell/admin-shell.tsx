"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopBar } from "./admin-topbar";
import { ToastProvider } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth/context";
import { Search, X, ArrowRight } from "lucide-react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium tracking-wide">Loading Bizonix Console...</p>
        </div>
      </div>
    );
  }

  // Quick navigation shortcuts for Search dialog
  const quickLinks = [
    { label: "Dashboard", href: "/dashboard", section: "Overview" },
    { label: "Enquiries", href: "/enquiries", section: "Overview" },
    { label: "Heroes", href: "/hero", section: "Website" },
    { label: "Team", href: "/employees", section: "System" },
    { label: "Audit Trail", href: "/audit", section: "System" },
  ];

  const filteredLinks = quickLinks.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F7F9FC] text-slate-800 flex font-sans antialiased">
        {/* Desktop & Mobile Navigation Sidebar */}
        <AdminSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        {/* Main Work Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-[236px]">
          <AdminTopBar
            onOpenMobileNav={() => setMobileNavOpen(true)}
            onOpenSearch={() => setSearchOpen(true)}
          />

          <main className="flex-1 py-7 px-4 sm:px-6 lg:px-8 max-w-[1360px] w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Global Quick Search Modal (⌘K) */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
            <div
              className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Jump to section or search console..."
                  className="flex-1 text-sm bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                {filteredLinks.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No matching sections found.</p>
                ) : (
                  filteredLinks.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => {
                        setSearchOpen(false);
                        router.push(item.href);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-slate-50 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-700 font-medium">{item.label}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.section}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </button>
                  ))
                )}
              </div>

              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Navigate console with speed</span>
                <span>Press ESC to close</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToastProvider>
  );
}
