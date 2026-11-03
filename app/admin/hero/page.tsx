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
  HiOutlineSparkles,
} from "react-icons/hi";

interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

interface HeroConfig {
  badgeText: string;
  greeting: string;
  nameHighlight: string;
  nameSurname: string;
  bio: string;
  portraitImage: string;
  ctaProjects: {
    label: string;
    target: string;
  };
  ctaResume: {
    label: string;
    url: string;
    target: string;
  };
  socials: SocialLink[];
}

export default function AdminHeroPage() {
  const [config, setConfig] = useState<HeroConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/admin/config?key=hero&state=draft");
        const json = await res.json();
        if (json.data) {
          setConfig(json.data);
        }
      } catch {
        toast.error("Failed to load hero configuration");
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
          key: "hero",
          data: config,
        }),
      });
      if (res.ok) {
        toast.success("Hero draft saved!");
        setIsDirty(false);
        return true;
      } else {
        toast.error("Failed to save hero draft");
        return false;
      }
    } catch {
      toast.error("Error saving hero draft");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddSocial = () => {
    if (!config) return;
    setConfig({
      ...config,
      socials: [
        ...config.socials,
        { label: "New Profile", href: "https://", icon: "AiFillGithub" },
      ],
    });
    setIsDirty(true);
  };

  const handleUpdateSocial = (index: number, field: keyof SocialLink, value: string) => {
    if (!config) return;
    const items = [...config.socials];
    items[index] = { ...items[index], [field]: value };
    setConfig({ ...config, socials: items });
    setIsDirty(true);
  };

  const handleDeleteSocial = (index: number) => {
    if (!config) return;
    const items = config.socials.filter((_, i) => i !== index);
    setConfig({ ...config, socials: items });
    setIsDirty(true);
  };

  if (loading || !config) {
    return (
      <AdminShell title="Hero Section">
        <div className="py-20 text-center text-xs text-muted-foreground">
          Loading Hero Settings...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Hero Section"
      isDirty={isDirty}
      onSave={handleSave}
      onDiscard={() => setIsDirty(false)}
    >
      <AdminStickyBar
        title="Hero Section"
        description="Configure your personal headline, short bio, portrait photo, and action triggers."
        saving={saving}
        isDirty={isDirty}
        onSave={handleSave}
      />

      <div className="space-y-6 max-w-4xl">
        {/* Headlines & Bio */}
        <section className="minimal-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            1. Headline &amp; Narrative
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Badge Tagline
              </label>
              <input
                type="text"
                value={config.badgeText}
                onChange={(e) => {
                  setConfig({ ...config, badgeText: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full text-xs font-medium px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Greeting
              </label>
              <input
                type="text"
                value={config.greeting}
                onChange={(e) => {
                  setConfig({ ...config, greeting: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full text-xs font-medium px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                First Name
              </label>
              <input
                type="text"
                value={config.nameHighlight}
                onChange={(e) => {
                  setConfig({ ...config, nameHighlight: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full text-xs font-semibold px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={config.nameSurname}
                onChange={(e) => {
                  setConfig({ ...config, nameSurname: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full text-xs font-semibold px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Short Bio Description
            </label>
            <textarea
              rows={3}
              value={config.bio}
              onChange={(e) => {
                setConfig({ ...config, bio: e.target.value });
                setIsDirty(true);
              }}
              className="w-full text-xs font-medium px-3 py-2 border border-input rounded-md bg-background leading-relaxed"
            />
          </div>
        </section>

        {/* Portrait Photo */}
        <section className="minimal-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            2. Hero Portrait Photo
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-border rounded-lg bg-muted/20">
            {config.portraitImage ? (
              <div className="w-28 h-36 rounded-lg border border-border bg-background overflow-hidden shrink-0 shadow-sm">
                <img
                  src={config.portraitImage}
                  alt="Portrait preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-28 h-36 rounded-lg border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0">
                No Photo
              </div>
            )}

            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="text-[10px] text-muted-foreground uppercase font-medium block mb-1">
                  Photo Asset Path
                </label>
                <input
                  type="text"
                  value={config.portraitImage}
                  onChange={(e) => {
                    setConfig({ ...config, portraitImage: e.target.value });
                    setIsDirty(true);
                  }}
                  className="w-full text-xs font-mono px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>

              <button
                type="button"
                onClick={() => setMediaModalOpen(true)}
                className="btn btn-outline text-xs h-8 px-3 gap-1.5"
              >
                <HiOutlinePhotograph /> Pick from Media Library
              </button>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="minimal-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            3. Action Buttons (CTAs)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg bg-muted/10 space-y-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Primary CTA Button (Projects)
              </span>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">Label</label>
                <input
                  type="text"
                  value={config.ctaProjects.label}
                  onChange={(e) => {
                    setConfig({
                      ...config,
                      ctaProjects: { ...config.ctaProjects, label: e.target.value },
                    });
                    setIsDirty(true);
                  }}
                  className="w-full text-xs font-medium px-3 py-1.5 border border-input rounded-md bg-background"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">Target Anchor</label>
                <input
                  type="text"
                  value={config.ctaProjects.target}
                  onChange={(e) => {
                    setConfig({
                      ...config,
                      ctaProjects: { ...config.ctaProjects, target: e.target.value },
                    });
                    setIsDirty(true);
                  }}
                  className="w-full text-xs font-mono px-3 py-1.5 border border-input rounded-md bg-background"
                />
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg bg-muted/10 space-y-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Secondary CTA Button (Resume)
              </span>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">Label</label>
                <input
                  type="text"
                  value={config.ctaResume.label}
                  onChange={(e) => {
                    setConfig({
                      ...config,
                      ctaResume: { ...config.ctaResume, label: e.target.value },
                    });
                    setIsDirty(true);
                  }}
                  className="w-full text-xs font-medium px-3 py-1.5 border border-input rounded-md bg-background"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">Destination</label>
                <p className="text-xs text-muted-foreground py-1 font-mono">
                  /resume (In-App Document Viewer)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Profiles */}
        <section className="minimal-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-semibold text-foreground">
              4. Social Profiles
            </h3>
            <button
              onClick={handleAddSocial}
              className="btn btn-outline text-xs h-8 px-3 gap-1"
            >
              <HiOutlinePlus /> Add Link
            </button>
          </div>

          <div className="space-y-2">
            {config.socials.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdateSocial(index, "label", e.target.value)}
                    placeholder="Platform (e.g. GitHub)"
                    className="text-xs font-medium px-3 py-1.5 border border-input rounded-md bg-background"
                  />
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => handleUpdateSocial(index, "href", e.target.value)}
                    placeholder="https://..."
                    className="text-xs font-mono px-3 py-1.5 border border-input rounded-md bg-background sm:col-span-2"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteSocial(index)}
                  className="p-1.5 text-muted-foreground hover:text-destructive rounded hover:bg-accent transition-colors"
                  title="Delete social profile"
                >
                  <HiOutlineTrash />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <MediaPickerModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        filterType="images"
        title="Select Portrait Photo"
        onSelect={(url) => {
          setConfig({ ...config, portraitImage: url });
          setIsDirty(true);
        }}
      />
    </AdminShell>
  );
}
