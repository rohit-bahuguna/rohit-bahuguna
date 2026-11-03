"use client";

import React from "react";
import { HiOutlineExclamation } from "react-icons/hi";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  saving?: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export default function UnsavedChangesModal({
  isOpen,
  saving = false,
  onSave,
  onDiscard,
  onCancel,
}: UnsavedChangesModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="minimal-card w-full max-w-md p-6 bg-card border border-border rounded-xl shadow-xl space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
            <HiOutlineExclamation className="text-xl" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              Unsaved Changes
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              You have unsaved changes in this tab. How would you like to proceed before switching?
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-border/40">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="btn-outline text-xs h-9 px-4 font-medium"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onDiscard}
            disabled={saving}
            className="btn-ghost text-xs h-9 px-4 font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="btn-primary text-xs h-9 px-4 font-semibold gap-1.5"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
