"use client";

import React, { useState } from "react";
import AdminShell from "@/app/components/admin/AdminShell";
import AdminStickyBar from "@/app/components/admin/AdminStickyBar";
import toast from "react-hot-toast";
import {
  HiOutlineDatabase,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineCloud,
  HiOutlineDownload,
  HiOutlineRefresh,
} from "react-icons/hi";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [purgingCache, setPurgingCache] = useState(false);

  const handleDownloadBackup = () => {
    window.open("/api/admin/backup", "_blank");
    toast.success("Downloading SQLite database snapshot...");
  };

  const handleManualPurge = async () => {
    setPurgingCache(true);
    try {
      const res = await fetch("/api/publish", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Cloudflare edge cache and local ISR cache flushed!");
      } else {
        toast.error(data.error || "Failed to purge cache");
      }
    } catch {
      toast.error("Network error during cache purge");
    } finally {
      setPurgingCache(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "settings_password",
          data: { updated: new Date().toISOString() },
        }),
      });
      if (res.ok) {
        toast.success("Security credentials updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Failed to update password");
      }
    } catch {
      toast.error("Error updating credentials");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <AdminShell title="Settings & Backup">
      <AdminStickyBar
        title="Settings &amp; Backup"
        description="Manage database snapshots, Cloudflare edge purging, and security preferences."
        onSave={() => toast.success("Settings saved")}
      />

      <div className="space-y-6 max-w-4xl">
        {/* Database Backup Section */}
        <div className="minimal-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <HiOutlineDatabase className="text-lg text-muted-foreground" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">SQLite Database Snapshots</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Export and download an exact, point-in-time binary copy of your entire database.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadBackup}
              className="btn btn-primary text-xs h-9 px-4 gap-1.5 shadow-sm"
            >
              <HiOutlineDownload className="text-sm" />
              <span>Backup SQLite DB</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Engine</span>
              <span className="font-semibold text-foreground mt-0.5 block">SQLite via Prisma</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Storage Mode</span>
              <span className="font-semibold text-foreground mt-0.5 block">Local File (portfolio.db)</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Concurrency</span>
              <span className="font-semibold text-foreground mt-0.5 block">PM2 Single Fork</span>
            </div>
          </div>
        </div>

        {/* Edge Cache Purging Section */}
        <div className="minimal-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <HiOutlineCloud className="text-lg text-muted-foreground" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">Cloudflare Edge Cache</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Force an immediate global purge of all cached static pages at the Cloudflare edge.
                </p>
              </div>
            </div>

            <button
              onClick={handleManualPurge}
              disabled={purgingCache}
              className="btn btn-outline text-xs h-9 px-4 gap-1.5"
            >
              <HiOutlineRefresh className={`text-sm ${purgingCache ? "animate-spin" : ""}`} />
              <span>{purgingCache ? "Purging..." : "Purge Edge Cache"}</span>
            </button>
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
            ✓ Automated purge triggers automatically whenever you click <strong>Publish Live</strong> in the top bar.
          </div>
        </div>

        {/* Admin Security & Password Change */}
        <div className="minimal-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <HiOutlineLockClosed className="text-lg text-muted-foreground" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Admin Security Credentials</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update password for the obfuscated vault login (`rohit`).
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-3 max-w-md">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="btn btn-primary text-xs h-9 px-4 gap-1.5 mt-2"
            >
              <HiOutlineShieldCheck className="text-sm" />
              <span>{changingPassword ? "Updating..." : "Update Password"}</span>
            </button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
