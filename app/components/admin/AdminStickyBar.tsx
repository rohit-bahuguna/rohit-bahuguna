"use client";

import React, { useEffect } from "react";
import { HiOutlineCheckCircle, HiOutlineClock } from "react-icons/hi";

interface AdminStickyBarProps {
  title: string;
  description?: string;
  saving?: boolean;
  isDirty?: boolean;
  onSave: () => void;
  saveButtonText?: string;
}

export default function AdminStickyBar({
  title,
  description,
  saving = false,
  isDirty = false,
  onSave,
  saveButtonText = "Save Changes",
}: AdminStickyBarProps) {
  // 1. Keyboard Shortcut (Ctrl+S / Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        onSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave]);

  // 2. Unsaved Changes Warning (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  return (
    <div className="sticky top-16 z-10 -mx-6 -mt-6 sm:-mx-10 sm:-mt-10 px-6 sm:px-10 py-4 bg-background/95 backdrop-blur-md border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          {isDirty ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Unsaved changes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <HiOutlineCheckCircle className="text-xs" /> All changes saved
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden lg:inline-flex items-center text-[11px] text-muted-foreground bg-muted px-2 py-1 rounded border border-border">
          Ctrl + S
        </span>

        <button
          onClick={onSave}
          disabled={saving}
          className="btn btn-primary h-10 px-5 text-xs font-semibold gap-2 shadow-sm"
          title="Save draft configuration (Shortcut: Ctrl+S)"
        >
          {saving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <HiOutlineCheckCircle className="text-base" />
              <span>{saveButtonText}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
