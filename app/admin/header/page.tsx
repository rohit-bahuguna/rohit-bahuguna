"use client";

import React, { useState, useEffect } from "react";
import AdminShell from "@/app/components/admin/AdminShell";
import AdminStickyBar from "@/app/components/admin/AdminStickyBar";
import MediaPickerModal from "@/app/components/admin/MediaPickerModal";
import toast from "react-hot-toast";
import {
  HiOutlinePhotograph,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
} from "react-icons/hi";

interface NavItem {
  label: string;
  target: string;
  visible: boolean;
  order: number;
}

interface HeaderConfig {
  logoType: "text" | "image";
  logoText: string;
  logoImage: string;
  navItems: NavItem[];
  ctaButton: {
    label: string;
    target: string;
    visible: boolean;
  };
}

export default function AdminHeaderPage() {
  const [config, setConfig] = useState<HeaderConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/admin/config?key=header&state=draft");
        const json = await res.json();
        if (json.data) {
          setConfig(json.data);
        }
      } catch {
        toast.error("Failed to load header configuration");
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSave = async () => {
    if (!config) return false;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "header",
          data: config,
        }),
      });
      if (res.ok) {
        toast.success("Header draft saved!");
        setIsDirty(false);
        return true;
      } else {
        toast.error("Failed to save header draft");
        return false;
      }
    } catch {
      toast.error("Error saving header draft");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddNavItem = () => {
    if (!config) return;
    const newItem: NavItem = {
      label: "New Tab",
      target: "#section",
      visible: true,
      order: config.navItems.length,
    };
    setConfig({
      ...config,
      navItems: [...config.navItems, newItem],
    });
    setIsDirty(true);
  };

  const handleUpdateNavItem = (index: number, field: keyof NavItem, value: any) => {
    if (!config) return;
    const items = [...config.navItems];
    items[index] = { ...items[index], [field]: value };
    setConfig({ ...config, navItems: items });
    setIsDirty(true);
  };

  const handleDeleteNavItem = (index: number) => {
    if (!config) return;
    const items = config.navItems.filter((_, i) => i !== index);
    setConfig({ ...config, navItems: items });
    setIsDirty(true);
  };

  const handleMoveNavItem = (index: number, direction: "up" | "down") => {
    if (!config) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= config.navItems.length) return;
    const items = [...config.navItems];
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    items.forEach((item, idx) => (item.order = idx));
    setConfig({ ...config, navItems: items });
    setIsDirty(true);
  };

  if (loading || !config) {
    return (
      <AdminShell title="Header & Navigation">
        <div className="py-20 text-center text-xs text-muted-foreground">
          Loading Header Settings...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Header & Navigation"
      isDirty={isDirty}
      onSave={handleSave}
      onDiscard={() => setIsDirty(false)}
    >
      <AdminStickyBar
        title="Header &amp; Navigation"
        description="Configure brand logo, navbar menu tabs, navigation targets, and the action button."
        saving={saving}
        isDirty={isDirty}
        onSave={handleSave}
      />

      <div className="space-y-6 max-w-4xl">
        {/* Brand Logo Settings */}
        <section className="minimal-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            1. Brand Logo
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-2">
                Display Mode
              </label>
              <div className="flex gap-4 text-xs font-medium">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="logoType"
                    checked={config.logoType === "image"}
                    onChange={() => {
                      setConfig({ ...config, logoType: "image" });
                      setIsDirty(true);
                    }}
                    className="accent-foreground"
                  />
                  Image Signature / Logo
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="logoType"
                    checked={config.logoType === "text"}
                    onChange={() => {
                      setConfig({ ...config, logoType: "text" });
                      setIsDirty(true);
                    }}
                    className="accent-foreground"
                  />
                  Text Branding
                </label>
              </div>
            </div>

            {config.logoType === "image" ? (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-foreground">
                  Logo Image Asset
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-border rounded-lg bg-muted/20">
                  {config.logoImage ? (
                    <div className="w-24 h-12 bg-background border border-border rounded flex items-center justify-center p-2">
                      <img
                        src={config.logoImage}
                        alt="Logo preview"
                        className="max-h-full max-w-full object-contain brightness-0 contrast-200 dark:invert transition-all"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-12 bg-muted rounded flex items-center justify-center text-[10px] text-muted-foreground">
                      No Image
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={config.logoImage}
                      onChange={(e) => {
                        setConfig({ ...config, logoImage: e.target.value });
                        setIsDirty(true);
                      }}
                      placeholder="/Images/rohitsign.png"
                      className="w-full text-xs font-mono px-3 py-2 border border-input rounded-md bg-background"
                    />
                    <button
                      type="button"
                      onClick={() => setMediaModalOpen(true)}
                      className="btn btn-outline text-xs h-8 px-3 gap-1.5"
                    >
                      <HiOutlinePhotograph /> Pick from Media Library
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Logo Text
                </label>
                <input
                  type="text"
                  value={config.logoText}
                  onChange={(e) => {
                    setConfig({ ...config, logoText: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="e.g. Rohit.dev"
                  className="w-full text-xs font-semibold px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>
            )}
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="minimal-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-semibold text-foreground">
              2. Navigation Tabs &amp; Links
            </h3>
            <button
              onClick={handleAddNavItem}
              className="btn btn-outline text-xs h-8 px-3 gap-1"
            >
              <HiOutlinePlus /> Add Tab
            </button>
          </div>

          <div className="space-y-2">
            {config.navItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center gap-3 p-3 border border-border rounded-lg bg-card"
              >
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveNavItem(index, "up")}
                    className="p-1 rounded border border-input hover:bg-accent disabled:opacity-30 text-xs"
                    title="Move Up"
                  >
                    <HiOutlineArrowUp />
                  </button>
                  <button
                    type="button"
                    disabled={index === config.navItems.length - 1}
                    onClick={() => handleMoveNavItem(index, "down")}
                    className="p-1 rounded border border-input hover:bg-accent disabled:opacity-30 text-xs"
                    title="Move Down"
                  >
                    <HiOutlineArrowDown />
                  </button>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase font-medium block mb-1">
                      Tab Label
                    </label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateNavItem(index, "label", e.target.value)}
                      className="w-full text-xs font-medium px-3 py-1.5 border border-input rounded-md bg-background"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase font-medium block mb-1">
                      Target Link / Anchor
                    </label>
                    <input
                      type="text"
                      value={item.target}
                      onChange={(e) => handleUpdateNavItem(index, "target", e.target.value)}
                      placeholder="#about or https://..."
                      className="w-full text-xs font-mono px-3 py-1.5 border border-input rounded-md bg-background"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.visible}
                      onChange={(e) => handleUpdateNavItem(index, "visible", e.target.checked)}
                      className="accent-foreground"
                    />
                    Visible
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDeleteNavItem(index)}
                    className="p-1.5 text-muted-foreground hover:text-destructive rounded hover:bg-accent transition-colors"
                    title="Delete tab"
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Header Action Button (CTA) */}
        <section className="minimal-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            3. Header Action Button (CTA)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={config.ctaButton.label}
                onChange={(e) => {
                  setConfig({
                    ...config,
                    ctaButton: { ...config.ctaButton, label: e.target.value },
                  });
                  setIsDirty(true);
                }}
                className="w-full text-xs font-medium px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Button Target (Anchor or URL)
              </label>
              <input
                type="text"
                value={config.ctaButton.target}
                onChange={(e) => {
                  setConfig({
                    ...config,
                    ctaButton: { ...config.ctaButton, target: e.target.value },
                  });
                  setIsDirty(true);
                }}
                className="w-full text-xs font-mono px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={config.ctaButton.visible}
                onChange={(e) => {
                  setConfig({
                    ...config,
                    ctaButton: { ...config.ctaButton, visible: e.target.checked },
                  });
                  setIsDirty(true);
                }}
                className="accent-foreground"
              />
              Show Action Button in Header
            </label>
          </div>
        </section>
      </div>

      <MediaPickerModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        filterType="images"
        title="Select Brand Logo Image"
        onSelect={(url) => {
          setConfig({ ...config, logoImage: url });
          setIsDirty(true);
        }}
      />
    </AdminShell>
  );
}
