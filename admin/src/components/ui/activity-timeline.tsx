"use client";

import React from "react";
import { Clock, CheckCircle2, User, FileText, Calendar, ArrowRight } from "lucide-react";

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  actor?: {
    displayName: string | null;
    email: string;
  } | null;
}

interface ActivityTimelineProps {
  items: ActivityItem[];
  emptyMessage?: string;
}

export function ActivityTimeline({ items, emptyMessage = "No activity recorded yet." }: ActivityTimelineProps) {
  if (items.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-slate-400 italic">
        {emptyMessage}
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "STATUS_CHANGED":
        return <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />;
      case "ASSIGNED":
        return <User className="w-3.5 h-3.5 text-blue-600" />;
      case "NOTE_ADDED":
        return <FileText className="w-3.5 h-3.5 text-indigo-600" />;
      case "DEMO_SCHEDULED":
        return <Calendar className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-200">
      {items.map((item) => (
        <div key={item.id} className="relative flex items-start gap-3 text-xs">
          <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
            {getIcon(item.type)}
          </div>
          <div className="flex-1 min-w-0 bg-slate-50/50 rounded-lg p-2.5 border border-slate-200/60">
            <p className="text-slate-800 font-medium leading-snug">{item.description}</p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              {item.actor ? (
                <span className="text-slate-600 font-medium">
                  {item.actor.displayName || item.actor.email}
                </span>
              ) : (
                <span>System</span>
              )}
              <span>•</span>
              <span>{formatTime(item.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
