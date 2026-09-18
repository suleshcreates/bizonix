"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface SaveBarProps {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onPublish?: () => void;
  publishLabel?: string;
  isPublishing?: boolean;
}

export function SaveBar({
  isDirty,
  isSaving,
  onSave,
  onDiscard,
  onPublish,
  publishLabel = "Publish",
  isPublishing = false,
}: SaveBarProps) {
  if (!isDirty && !onPublish) return null;

  return (
    <div className="sticky bottom-4 z-40 max-w-3xl mx-auto px-4 w-full">
      <div className="flex items-center justify-between gap-4 p-3.5 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center gap-2 text-xs text-slate-300 pl-2">
          {isDirty ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>You have unsaved changes.</span>
            </>
          ) : (
            <span>All draft changes saved.</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <>
              <button
                type="button"
                onClick={onDiscard}
                disabled={isSaving}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-70"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save draft
              </button>
            </>
          )}

          {onPublish && (
            <button
              type="button"
              onClick={onPublish}
              disabled={isPublishing || isSaving}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-teal-600 hover:bg-teal-500 text-white shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-70 ml-1"
            >
              {isPublishing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {publishLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
