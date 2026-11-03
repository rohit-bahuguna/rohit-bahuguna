"use client";

import React, { useState, useEffect } from "react";
import AdminShell from "@/app/components/admin/AdminShell";
import AdminStickyBar from "@/app/components/admin/AdminStickyBar";
import MediaPickerModal from "@/app/components/admin/MediaPickerModal";
import toast from "react-hot-toast";
import {
  HiOutlineSearch,
  HiOutlinePhotograph,
  HiOutlineGlobe,
  HiOutlineShare,
} from "react-icons/hi";

interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  author: string;
  twitterHandle: string;
}

export default function AdminSeoPage() {
  const [config, setConfig] = useState<SeoConfig>({
    metaTitle: "Rohit Bahuguna | Full Stack Developer",
    metaDescription:
      "Portfolio of Rohit Bahuguna — Full Stack Developer specialising in modern high-performance web applications, React, and Next.js.",
    keywords: "Rohit Bahuguna, Full Stack Developer, Next.js, React, TypeScript, Portfolio",
    ogImage: "/Images/rohitBahuguna.jpg",
    author: "Rohit Bahuguna",
    twitterHandle: "@the_rohit_bahuguna",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  useEffect(() => {
    async function loadSeo() {
      try {
        const res = await fetch("/api/admin/config?key=seo&state=draft");
        const json = await res.json();
        if (json.data) {
          setConfig(json.data);
        }
      } catch {
        toast.error("Failed to load SEO configuration");
      } finally {
        setLoading(false);
      }
    }
    loadSeo();
  }, []);

  const handleChange = (field: keyof SeoConfig, val: string) => {
    setConfig((prev) => ({ ...prev, [field]: val }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "seo",
          data: config,
        }),
      });
      if (res.ok) {
        toast.success("SEO & Social metadata draft saved!");
        setIsDirty(false);
        return true;
      } else {
        toast.error("Failed to save SEO draft");
        return false;
      }
    } catch {
      toast.error("Error saving SEO draft");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="SEO & Social Preview"
      isDirty={isDirty}
      onSave={handleSave}
      onDiscard={() => setIsDirty(false)}
    >
      <AdminStickyBar
        title="SEO &amp; Social Share Preview"
        description="Configure search engine metadata, OpenGraph cards, and social sharing banners."
        saving={saving}
        isDirty={isDirty}
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Form Settings */}
        <div className="space-y-6">
          <div className="minimal-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <HiOutlineSearch className="text-base text-muted-foreground" />
              Search Engine Metadata
            </h3>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Page Title Tag
              </label>
              <input
                type="text"
                value={config.metaTitle}
                onChange={(e) => handleChange("metaTitle", e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Recommended length: 50–60 characters ({config.metaTitle.length} chars)
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={config.metaDescription}
                onChange={(e) => handleChange("metaDescription", e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Recommended length: 140–160 characters ({config.metaDescription.length} chars)
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Keywords (Comma-separated)
              </label>
              <input
                type="text"
                value={config.keywords}
                onChange={(e) => handleChange("keywords", e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="minimal-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <HiOutlineShare className="text-base text-muted-foreground" />
              Social Sharing &amp; Cards
            </h3>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Social Banner Image (OpenGraph / Twitter)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={config.ogImage}
                  onChange={(e) => handleChange("ogImage", e.target.value)}
                  className="flex-1 text-xs font-mono px-3 py-2 rounded-md border border-input bg-background"
                />
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="btn btn-outline text-xs h-9 px-3 shrink-0"
                >
                  <HiOutlinePhotograph /> Pick
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Author Name
                </label>
                <input
                  type="text"
                  value={config.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-md border border-input bg-background"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Twitter / X Handle
                </label>
                <input
                  type="text"
                  value={config.twitterHandle}
                  onChange={(e) => handleChange("twitterHandle", e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-md border border-input bg-background"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Previews */}
        <div className="space-y-6">
          {/* Google Search Result Preview */}
          <div className="minimal-card p-6 space-y-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Google Search Result Snippet
            </span>
            <div className="p-4 rounded-lg bg-card border border-border space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px]">
                  🌐
                </div>
                <span className="text-xs text-muted-foreground truncate">
                  https://rohitbahuguna.online
                </span>
              </div>
              <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
                {config.metaTitle || "Page Title"}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {config.metaDescription || "Search snippet description goes here."}
              </p>
            </div>
          </div>

          {/* Social Card Preview (LinkedIn / Twitter / WhatsApp) */}
          <div className="minimal-card p-6 space-y-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Social Card Preview (LinkedIn / Twitter / WhatsApp)
            </span>
            <div className="rounded-xl border border-border overflow-hidden bg-muted/20">
              <div className="h-44 w-full bg-muted/50 overflow-hidden flex items-center justify-center relative">
                {config.ogImage ? (
                  <img
                    src={config.ogImage}
                    alt="Social preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">No image set</span>
                )}
              </div>
              <div className="p-4 space-y-1 bg-card">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                  rohitbahuguna.online
                </span>
                <h4 className="text-sm font-semibold truncate leading-tight">
                  {config.metaTitle}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {config.metaDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        filterType="images"
        title="Select Social Share Banner"
        onSelect={(url) => {
          setConfig((prev) => ({ ...prev, ogImage: url }));
          setIsDirty(true);
        }}
      />
    </AdminShell>
  );
}
