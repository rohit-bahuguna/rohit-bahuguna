"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineCheckCircle, HiOutlineArrowLeft, HiOutlineExternalLink } from "react-icons/hi";

export default function AdminPreviewBanner() {
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch("/api/publish", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to publish");
        return;
      }
      toast.success("All drafts are now LIVE! Redirecting to CMS Dashboard...", {
        duration: 5000,
      });
      setTimeout(() => {
        window.location.href = "/admin-vault/dashboard";
      }, 1200);
    } catch {
      toast.error("Network error publishing drafts", { duration: 5000 });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          className: "!border !border-border !bg-card !text-card-foreground !shadow-lg !text-xs !font-medium !rounded-lg !relative !overflow-hidden",
          style: {
            background: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
            border: "1px solid hsl(var(--border))",
          },
        }}
      />
      <div className="fixed top-0 left-0 right-0 h-11 z-50 bg-background/95 backdrop-blur-md border-b border-border px-4 sm:px-6 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <div>
            <span className="text-xs font-bold text-foreground block sm:inline">
              Preview Mode:
            </span>{" "}
            <span className="text-xs text-muted-foreground">
              Review your draft changes before publishing live.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/admin-vault/dashboard"
            className="btn-outline text-xs !py-1.5 !px-3 gap-1"
            title="Return to CMS Dashboard"
          >
            <HiOutlineArrowLeft className="text-xs" />
            <span className="hidden sm:inline">Back to Vault</span>
          </a>

          <a
            href="/"
            className="btn-ghost text-xs !py-1.5 !px-2.5 gap-1 text-muted-foreground hover:text-foreground"
            title="View current live site"
          >
            <HiOutlineExternalLink className="text-xs" />
            <span className="hidden sm:inline">Live Site</span>
          </a>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn-primary text-xs !py-1.5 !px-4 gap-1.5 font-semibold shadow-sm"
          >
            <HiOutlineCheckCircle className="text-sm" />
            <span>{publishing ? "Publishing to Live..." : "Publish to Live Site"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
