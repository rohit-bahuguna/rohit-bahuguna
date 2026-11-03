"use client";

import React, { useEffect, useState } from "react";
import ThemeToggle from "@/app/components/ThemeToggle";
import {
  HiOutlineMenuAlt2,
  HiOutlineExternalLink,
  HiOutlineCloudUpload,
} from "react-icons/hi";

interface AdminTopBarProps {
  onToggleMobile?: () => void;
  title?: string;
  onPublish?: () => void;
  publishing?: boolean;
}

export default function AdminTopBar({
  onToggleMobile,
  title = "Dashboard",
  onPublish,
  publishing = false,
}: AdminTopBarProps) {
  const [hasStaged, setHasStaged] = useState(false);

  useEffect(() => {
    async function checkStaged() {
      try {
        const res = await fetch("/api/admin/staged-status");
        const json = await res.json();
        if (typeof json?.hasStaged === "boolean") {
          setHasStaged(json.hasStaged);
        }
      } catch {}
    }
    checkStaged();
  }, [title]);

  const handlePublishClick = () => {
    if (onPublish) {
      onPublish();
    } else {
      window.location.href = "/?preview=true";
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile trigger & Current Section Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="md:hidden p-2 rounded-md border border-input text-foreground hover:bg-accent"
          aria-label="Open navigation menu"
        >
          <HiOutlineMenuAlt2 className="text-lg" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-xs text-muted-foreground">Admin Vault</span>
          <span className="hidden sm:inline-block text-xs text-muted-foreground">/</span>
          <h1 className="text-sm font-semibold text-foreground tracking-tight">{title}</h1>
        </div>

        {hasStaged ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Draft Staged
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            All Live Synced
          </span>
        )}
      </div>

      {/* Right: Global Actions (Always Visible) */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Light / Dark Mode Toggle */}
        <ThemeToggle />

        {/* Single Gateway to Publish: Saves changes and redirects to Preview */}
        <button
          onClick={handlePublishClick}
          disabled={publishing}
          className="btn btn-primary text-xs h-9 px-4 gap-1.5 shadow-sm"
          title="Save changes and proceed to preview page to publish live"
        >
          <HiOutlineCloudUpload className="text-base" />
          <span>{publishing ? "Saving..." : "Publish Live"}</span>
        </button>

        {/* Public Live Site Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost text-xs h-9 px-2.5 text-muted-foreground hover:text-foreground"
          title="Open live website"
        >
          <HiOutlineExternalLink className="text-base" />
        </a>
      </div>
    </header>
  );
}
