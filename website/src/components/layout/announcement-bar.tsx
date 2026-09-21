"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import type { AnnouncementBarData } from "@/lib/content/navigation/navigation-resolver";

const THEME_STYLES: Record<string, { bg: string; text: string; badge: string; link: string; border: string }> = {
  blue: {
    bg: "bg-[#2563EB]",
    text: "text-white",
    badge: "bg-white/20 text-white font-semibold border-white/30",
    link: "text-white hover:text-blue-100 underline decoration-white/50",
    border: "border-blue-700/40",
  },
  navy: {
    bg: "bg-[#0B1B3D]",
    text: "text-slate-100",
    badge: "bg-blue-500/20 text-blue-300 font-semibold border-blue-400/30",
    link: "text-blue-300 hover:text-white underline decoration-blue-400/50",
    border: "border-blue-950",
  },
  dark: {
    bg: "bg-[#111827]",
    text: "text-slate-100",
    badge: "bg-slate-700 text-slate-200 font-semibold border-slate-600",
    link: "text-amber-300 hover:text-amber-200 underline decoration-amber-400/50",
    border: "border-slate-800",
  },
  amber: {
    bg: "bg-[#D97706]",
    text: "text-white",
    badge: "bg-white/20 text-white font-semibold border-white/30",
    link: "text-white hover:text-amber-100 underline decoration-white/50",
    border: "border-amber-800/40",
  },
  emerald: {
    bg: "bg-[#059669]",
    text: "text-white",
    badge: "bg-white/20 text-white font-semibold border-white/30",
    link: "text-white hover:text-emerald-100 underline decoration-white/50",
    border: "border-emerald-700/40",
  },
};

export function AnnouncementBar({ announcement }: { announcement?: AnnouncementBarData }) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!announcement?.isActive) return;
    const isDismissed = sessionStorage.getItem(`bz_announcement_dismissed_${announcement.text}`);
    if (!isDismissed) {
      setDismissed(false);
    }
  }, [announcement]);

  if (!announcement?.isActive || dismissed) {
    return null;
  }

  const themeStyle = THEME_STYLES[announcement.theme] || THEME_STYLES.blue;

  const handleDismiss = () => {
    setDismissed(true);
    if (announcement.isDismissible) {
      sessionStorage.setItem(`bz_announcement_dismissed_${announcement.text}`, "true");
    }
  };

  return (
    <aside
      aria-label="Announcement"
      className={`relative z-[55] w-full px-4 py-2 border-b text-xs transition-all ${themeStyle.bg} ${themeStyle.text} ${themeStyle.border}`}
    >
      <div className="shell flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap mx-auto text-center justify-center">
          {announcement.badge && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase border ${themeStyle.badge}`}
            >
              {announcement.badge}
            </span>
          )}

          <span className="font-medium leading-normal">{announcement.text}</span>

          {announcement.linkText && announcement.linkHref && (
            <Link
              href={announcement.linkHref}
              className={`inline-flex items-center gap-1 font-semibold transition-colors ${themeStyle.link}`}
            >
              <span>{announcement.linkText}</span>
              <ArrowRight className="w-3.5 h-3.5 inline-block" />
            </Link>
          )}
        </div>

        {announcement.isDismissible && (
          <button
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
            className="p-1 -mr-1 rounded-md opacity-70 hover:opacity-100 transition-opacity cursor-pointer flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
}
