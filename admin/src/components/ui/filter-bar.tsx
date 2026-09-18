"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  statusFilter?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: FilterOption[];
  priorityFilter?: string;
  onPriorityChange?: (value: string) => void;
  priorityOptions?: FilterOption[];
  sourceFilter?: string;
  onSourceChange?: (value: string) => void;
  sourceOptions?: FilterOption[];
  onReset?: () => void;
  hasActiveFilters?: boolean;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search by name, company, email...",
  statusFilter,
  onStatusChange,
  statusOptions,
  priorityFilter,
  onPriorityChange,
  priorityOptions,
  sourceFilter,
  onSourceChange,
  sourceOptions,
  onReset,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs mb-4">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {statusOptions && onStatusChange && (
          <select
            value={statusFilter || ""}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50/60 hover:bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {priorityOptions && onPriorityChange && (
          <select
            value={priorityFilter || ""}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50/60 hover:bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">All Priorities</option>
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {sourceOptions && onSourceChange && (
          <select
            value={sourceFilter || ""}
            onChange={(e) => onSourceChange(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50/60 hover:bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">All Sources</option>
            {sourceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {hasActiveFilters && onReset && (
          <button
            onClick={onReset}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
