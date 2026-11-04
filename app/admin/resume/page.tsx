"use client";

import React, { useState, useEffect } from "react";
import AdminShell from "@/app/components/admin/AdminShell";
import AdminStickyBar from "@/app/components/admin/AdminStickyBar";
import MediaPickerModal from "@/app/components/admin/MediaPickerModal";
import toast from "react-hot-toast";
import {
  HiOutlineDocumentText,
  HiOutlineUpload,
  HiOutlineExternalLink,
  HiOutlineCode,
  HiOutlineEye,
} from "react-icons/hi";

export default function AdminResumePage() {
  const [resumeUrl, setResumeUrl] = useState(
    "https://drive.google.com/file/d/1J0kPC3TBdtLQpOvORigxMQtoilkYzL4H/view?usp=sharing"
  );
  const [label, setLabel] = useState("Resume");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"viewer" | "latex">("viewer");

  useEffect(() => {
    async function loadHeroConfig() {
      try {
        const res = await fetch("/api/admin/config?key=hero&state=draft");
        const json = await res.json();
        if (json.data?.ctaResume) {
          if (json.data.ctaResume.fileUrl) {
            setResumeUrl(json.data.ctaResume.fileUrl);
          } else if (json.data.ctaResume.url && json.data.ctaResume.url !== "/resume") {
            setResumeUrl(json.data.ctaResume.url);
          }
          if (json.data.ctaResume.label) setLabel(json.data.ctaResume.label);
        }
      } catch {
        toast.error("Failed to load resume configuration");
      } finally {
        setLoading(false);
      }
    }
    loadHeroConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Fetch current draft hero config
      const res = await fetch("/api/admin/config?key=hero&state=draft");
      const json = await res.json();
      const currentHero = json.data || {};

      currentHero.ctaResume = {
        label,
        url: "/resume", // Public destination is always the in-app viewer
        fileUrl: resumeUrl, // The actual storage location
        target: "_self", // opens in-app viewer
      };

      // 2. Save updated hero draft
      const saveRes = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "hero",
          data: currentHero,
        }),
      });

      if (saveRes.ok) {
        toast.success("Resume configuration draft saved!");
        setIsDirty(false);
        return true;
      } else {
        toast.error("Failed to save resume draft");
        return false;
      }
    } catch {
      toast.error("Error saving resume draft");
      return false;
    } finally {
      setSaving(false);
    }
  };

  let embedUrl = resumeUrl;
  if (resumeUrl.includes("drive.google.com") && resumeUrl.includes("/view")) {
    embedUrl = resumeUrl.replace("/view", "/preview");
  }

  return (
    <AdminShell
      title="Resume & In-App Viewer"
      isDirty={isDirty}
      onSave={handleSave}
      onDiscard={() => setIsDirty(false)}
    >
      <AdminStickyBar
        title="Resume &amp; In-App Viewer"
        description="Configure your resume document, in-app viewer (/resume), and LaTeX editor seam."
        saving={saving}
        isDirty={isDirty}
        onSave={handleSave}
      />

      <div className="space-y-6">
        {/* Source Configuration Card */}
        <div className="minimal-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <HiOutlineDocumentText className="text-lg text-muted-foreground" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">Resume Document Source</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pick an uploaded PDF from your media library or provide an external drive link.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline text-xs h-9 px-3 gap-1.5"
                title="Preview in-app viewer on public site"
              >
                <HiOutlineEye className="text-sm" />
                <span>Open /resume</span>
              </a>

              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="btn btn-primary text-xs h-9 px-3 gap-1.5"
              >
                <HiOutlineUpload className="text-sm" />
                <span>Upload / Pick PDF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Button Display Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => {
                  setLabel(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full text-xs font-medium px-3 py-2 rounded-md border border-input bg-background"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1">
                PDF File Path or Document URL
              </label>
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => {
                  setResumeUrl(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="/uploads/my-resume.pdf or https://..."
                className="w-full text-xs font-mono px-3 py-2 rounded-md border border-input bg-background"
              />
            </div>
          </div>
        </div>

        {/* Tab Controls for Live Preview vs LaTeX Seam */}
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <button
            onClick={() => setActiveTab("viewer")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === "viewer"
                ? "bg-accent text-accent-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Live In-App Viewer Preview
          </button>
          <button
            onClick={() => setActiveTab("latex")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === "latex"
                ? "bg-accent text-accent-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            LaTeX Live Editor (Upcoming Feature)
          </button>
        </div>

        {activeTab === "viewer" ? (
          <div className="minimal-card p-4 rounded-xl overflow-hidden min-h-[700px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-muted-foreground">
              <span>Embedded Document View</span>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground"
              >
                <span>Direct Document Link</span>
                <HiOutlineExternalLink />
              </a>
            </div>
            <iframe
              src={embedUrl}
              title="Resume Preview"
              className="w-full flex-1 rounded-lg border border-border mt-3"
              style={{ minHeight: "650px" }}
            />
          </div>
        ) : (
          <div className="minimal-card p-12 text-center rounded-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center text-2xl">
              <HiOutlineCode />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-base font-semibold">Direct LaTeX Compiler &amp; Editor</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The architecture is now prepared with `/resume` routing. In the next iteration, a browser-based Monaco code editor and server-side tectonic/pdflatex compiler will compile `.tex` directly into your resume PDF on demand.
              </p>
            </div>
          </div>
        )}
      </div>

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        filterType="documents"
        title="Select Resume Document File"
        onSelect={(url) => {
          setResumeUrl(url);
          setIsDirty(true);
        }}
      />
    </AdminShell>
  );
}
