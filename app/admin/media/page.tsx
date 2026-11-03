"use client";

import React, { useState, useEffect } from "react";
import AdminShell from "@/app/components/admin/AdminShell";
import AdminStickyBar from "@/app/components/admin/AdminStickyBar";
import toast from "react-hot-toast";
import {
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlineUpload,
  HiOutlineTrash,
  HiOutlineClipboardCopy,
  HiOutlineExternalLink,
  HiOutlineExclamation,
  HiOutlineSearch,
} from "react-icons/hi";

interface MediaItem {
  id: string;
  name: string;
  fileName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

interface Reference {
  type: string;
  name: string;
  detail: string;
}

export default function MediaManagerPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "images" | "documents">("all");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  // Reference guard modal state
  const [guardModalOpen, setGuardModalOpen] = useState(false);
  const [blockedItem, setBlockedItem] = useState<{ id: string; name: string } | null>(null);
  const [blockedReferences, setBlockedReferences] = useState<Reference[]>([]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType !== "all") params.set("type", filterType);
      if (search.trim()) params.set("q", search.trim());

      const res = await fetch(`/api/media?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setMediaList(data.media || []);
      }
    } catch {
      toast.error("Failed to load media assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [filterType, search]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Upload failed");
        return;
      }

      toast.success("Asset uploaded successfully!");
      fetchMedia();
    } catch {
      toast.error("Error during file upload");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`Copied to clipboard`);
  };

  const handleDelete = async (id: string, force = false) => {
    try {
      const res = await fetch("/api/media/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, force }),
      });
      const data = await res.json();

      if (data.blocked) {
        const item = mediaList.find((m) => m.id === id);
        setBlockedItem({ id, name: item?.name || "Asset" });
        setBlockedReferences(data.references || []);
        setGuardModalOpen(true);
        return;
      }

      if (!res.ok) {
        toast.error(data.error || "Failed to delete");
        return;
      }

      toast.success("Asset deleted");
      setGuardModalOpen(false);
      setBlockedItem(null);
      fetchMedia();
    } catch {
      toast.error("Error executing delete");
    }
  };

  return (
    <AdminShell title="Media Library">
      <AdminStickyBar
        title="Media Asset Library"
        description="Upload, preview, and safely manage images and resume PDFs stored locally on your VPS."
        onSave={() => document.getElementById("file-upload-input")?.click()}
        saveButtonText="+ Upload File"
      />

      <input
        id="file-upload-input"
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
        accept="image/*,application/pdf,.doc,.docx"
      />

      {/* Filter and Search Bar */}
      <div className="minimal-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(["all", "images", "documents"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                filterType === type
                  ? "bg-foreground text-background font-semibold"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Grid of Uploaded Assets */}
      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground">
          Loading media library...
        </div>
      ) : mediaList.length === 0 ? (
        <div className="minimal-card p-12 text-center rounded-xl space-y-3">
          <HiOutlinePhotograph className="text-4xl text-muted-foreground mx-auto" />
          <h4 className="text-sm font-semibold">No media assets found</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Upload images or documents to use across your portfolio and resume.
          </p>
          <label className="btn btn-primary text-xs h-9 px-4 cursor-pointer inline-flex">
            Choose File to Upload
            <input
              type="file"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
              accept="image/*,application/pdf,.doc,.docx"
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaList.map((item) => {
            const isImage = item.mimeType.startsWith("image/");
            return (
              <div
                key={item.id}
                className="minimal-card rounded-xl overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-40 w-full bg-muted/30 border-b border-border flex items-center justify-center overflow-hidden">
                    {isImage ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <HiOutlineDocumentText className="text-4xl mb-1 text-primary" />
                        <span className="text-[10px] uppercase font-mono">
                          {item.fileName.split(".").pop()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-1">
                    <h5 className="text-xs font-semibold text-foreground truncate" title={item.name}>
                      {item.name}
                    </h5>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{(item.sizeBytes / 1024).toFixed(0)} KB</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-border bg-muted/10 flex items-center justify-between gap-1">
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    className="btn btn-ghost text-xs h-7 px-2 gap-1 text-muted-foreground hover:text-foreground"
                    title="Copy path"
                  >
                    <HiOutlineClipboardCopy className="text-sm" />
                    <span>Copy URL</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-accent"
                      title="Open full file"
                    >
                      <HiOutlineExternalLink className="text-sm" />
                    </a>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive rounded hover:bg-accent"
                      title="Delete asset"
                    >
                      <HiOutlineTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reference Guard Conflict Modal */}
      {guardModalOpen && blockedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-xl overflow-hidden p-6 space-y-4 text-card-foreground">
            <div className="flex items-center gap-3 text-amber-500">
              <HiOutlineExclamation className="text-2xl shrink-0" />
              <h3 className="text-base font-semibold text-foreground">
                Reference Guard: Deletion Blocked
              </h3>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>{blockedItem.name}</strong> cannot be deleted safely because it is currently linked to portfolio content:
            </p>

            <div className="space-y-1.5 max-h-48 overflow-y-auto p-3 rounded-lg bg-muted/40 border border-border text-xs">
              {blockedReferences.map((ref, i) => (
                <div key={i} className="flex items-center justify-between text-muted-foreground">
                  <span className="font-medium text-foreground">{ref.name}</span>
                  <span className="text-[10px] uppercase font-mono">{ref.type}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setGuardModalOpen(false)}
                className="btn btn-primary text-xs h-9 px-4"
              >
                Keep File
              </button>
              <button
                onClick={() => handleDelete(blockedItem.id, true)}
                className="btn btn-outline text-xs h-9 px-4 text-destructive border-destructive/40 hover:bg-destructive/10"
              >
                Force Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
