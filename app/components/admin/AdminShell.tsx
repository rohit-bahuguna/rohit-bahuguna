"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import UnsavedChangesModal from "./UnsavedChangesModal";
import toast, { Toaster } from "react-hot-toast";

interface AdminShellProps {
  title?: string;
  isDirty?: boolean;
  onSave?: () => Promise<boolean | void> | void;
  onDiscard?: () => void;
  children: React.ReactNode;
}

export default function AdminShell({
  title = "Dashboard",
  isDirty = false,
  onSave,
  onDiscard,
  children,
}: AdminShellProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [modalSaving, setModalSaving] = useState(false);
  const [topPublishing, setTopPublishing] = useState(false);

  const handleNavigate = (href: string) => {
    if (isDirty) {
      setPendingHref(href);
      setModalOpen(true);
    } else {
      router.push(href);
    }
  };

  const handleModalSave = async () => {
    setModalSaving(true);
    try {
      if (onSave) {
        await onSave();
      }
      setModalOpen(false);
      if (pendingHref) {
        router.push(pendingHref);
      }
    } catch {
      toast.error("Failed to save changes before switching tabs");
    } finally {
      setModalSaving(false);
    }
  };

  const handleModalDiscard = () => {
    if (onDiscard) {
      onDiscard();
    }
    setModalOpen(false);
    if (pendingHref) {
      router.push(pendingHref);
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setPendingHref(null);
  };

  const handleTopPublish = async () => {
    setTopPublishing(true);
    try {
      if (isDirty && onSave) {
        toast.loading("Saving current draft...", { id: "publish-flow" });
        await onSave();
      }
      toast.loading("Publishing all drafts to Live site...", { id: "publish-flow" });
      const res = await fetch("/api/publish", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to publish live", { id: "publish-flow" });
        return;
      }
      toast.success("All changes are now LIVE on your website!", {
        id: "publish-flow",
        duration: 5000,
      });
      router.refresh();
    } catch {
      toast.error("Network error publishing changes", { id: "publish-flow" });
    } finally {
      setTopPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
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
          success: {
            duration: 5000,
          },
          error: {
            duration: 5000,
          },
        }}
      />

      {/* Unsaved Changes Confirmation Dialog */}
      <UnsavedChangesModal
        isOpen={modalOpen}
        saving={modalSaving}
        onSave={handleModalSave}
        onDiscard={handleModalDiscard}
        onCancel={handleModalCancel}
      />

      {/* Left Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area (Offset by Sidebar on Desktop) */}
      <div className="md:pl-64 flex-1 flex flex-col min-w-0">
        <AdminTopBar
          title={title}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          onPublish={handleTopPublish}
          publishing={topPublishing}
        />

        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
