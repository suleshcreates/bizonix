"use client";

import React from "react";

export type StatusType =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "DEMO_SCHEDULED"
  | "DEMO_COMPLETED"
  | "FOLLOW_UP"
  | "CONVERTED"
  | "CLOSED"
  | "SPAM"
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
  showDot?: boolean;
}

const statusConfig: Record<string, { label: string; dot: string; bg: string; text: string; border: string }> = {
  // Enquiries Stages
  NEW: { label: "New", dot: "bg-blue-600", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200/70" },
  CONTACTED: { label: "Contacted", dot: "bg-blue-500", bg: "bg-blue-50/70", text: "text-blue-700", border: "border-blue-200/60" },
  QUALIFIED: { label: "Qualified", dot: "bg-emerald-600", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/70" },
  DEMO_SCHEDULED: { label: "Demo Scheduled", dot: "bg-blue-600", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200/70" },
  DEMO_COMPLETED: { label: "Demo Done", dot: "bg-emerald-600", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/70" },
  FOLLOW_UP: { label: "Follow-up", dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200/70" },
  CONVERTED: { label: "Converted", dot: "bg-emerald-600", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/70" },
  CLOSED: { label: "Closed", dot: "bg-slate-400", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200/70" },
  SPAM: { label: "Spam", dot: "bg-rose-500", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200/70" },

  // Content Stages
  DRAFT: { label: "Draft", dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200/70" },
  PUBLISHED: { label: "Live", dot: "bg-emerald-600", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/70" },
  ARCHIVED: { label: "Archived", dot: "bg-slate-400", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200/70" },

  // Priorities
  LOW: { label: "Low", dot: "bg-slate-400", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200/70" },
  MEDIUM: { label: "Medium", dot: "bg-blue-500", bg: "bg-blue-50/70", text: "text-blue-700", border: "border-blue-200/60" },
  HIGH: { label: "High", dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200/70" },
  URGENT: { label: "Urgent", dot: "bg-rose-600", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200/70" },

  // System & User
  ACTIVE: { label: "Active", dot: "bg-emerald-600", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/70" },
  INACTIVE: { label: "Inactive", dot: "bg-slate-400", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200/70" },
  SUSPENDED: { label: "Suspended", dot: "bg-rose-600", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200/70" },
};

export function StatusBadge({ status, size = "md", className = "", showDot = true }: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();
  const config = statusConfig[normalized] || {
    label: status ? status.replace(/_/g, " ") : "Unknown",
    dot: "bg-slate-400",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200/70",
  };

  const isSmall = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium select-none ${config.bg} ${config.text} ${config.border} ${
        isSmall ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-0.5 text-xs"
      } ${className}`}
    >
      {showDot && (
        <span className={`rounded-full shrink-0 ${config.dot} ${isSmall ? "w-1.5 h-1.5" : "w-1.5 h-1.5"}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
}

