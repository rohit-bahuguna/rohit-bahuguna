"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlineUpload,
  HiOutlineX,
  HiOutlineSearch,
} from "react-icons/hi";

export interface MediaItem {
  id: string;
  name: string;
  fileName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
  filterType?: "all" | "images" | "documents";
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = "Select Media Asset",
  filterType = "all",
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

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
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, filterType, search]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      toast.success("Uploaded successfully!");
      setActiveTab("library");
      fetchMedia();
      if (data.media?.url) {
        onSelect(data.media.url);
        onClose();
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-card border border-border rounded-xl shadow-xl flex flex-col max-h-[85vh] overflow-hidden text-card-foreground">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiOutlinePhotograph className="text-lg text-muted-foreground" />
            <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <HiOutlineX className="text-lg" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-4 flex items-center justify-between gap-4">
          <div className="inline-flex items-center rounded-lg bg-muted p-1 text-muted-foreground text-xs font-medium">
            <button
              onClick={() => setActiveTab("library")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === "library"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "hover:text-foreground"
              }`}
            >
              Browse Library ({mediaList.length})
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === "upload"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "hover:text-foreground"
              }`}
            >
              Upload New File
            </button>
          </div>

          {activeTab === "library" && (
            <div className="relative flex-1 max-w-xs">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
              <input
                type="text"
                placeholder="Filter files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "library" ? (
            <div>
              {loading ? (
                <div className="text-center py-16 text-xs text-muted-foreground">
                  Loading media library...
                </div>
              ) : mediaList.length === 0 ? (
                <div className="text-center py-16 text-xs text-muted-foreground border border-dashed border-border rounded-xl p-8">
                  No media files found matching your search.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mediaList.map((item) => {
                    const isImg = item.mimeType.startsWith("image/");
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelect(item.url);
                          onClose();
                        }}
                        className="group cursor-pointer rounded-lg border border-border p-2 bg-card hover:border-foreground/30 hover:bg-accent/40 transition-all flex flex-col justify-between"
                      >
                        <div className="w-full h-24 rounded-md border border-border/60 bg-muted/30 flex items-center justify-center overflow-hidden mb-2 relative">
                          {isImg ? (
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <HiOutlineDocumentText className="text-3xl text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium truncate" title={item.name}>
                            {item.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {(item.sizeBytes / 1024).toFixed(0)} KB • {isImg ? "Image" : "Document"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 px-6 flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-muted/20 text-center">
              <HiOutlineUpload className="text-4xl text-muted-foreground mb-3" />
              <h4 className="text-sm font-semibold">Upload a media file</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Supports JPG, PNG, WebP, SVG, and PDF documents up to 25MB.
              </p>
              <label className="mt-5 btn btn-primary h-9 px-4 text-xs font-medium cursor-pointer">
                {uploading ? "Uploading..." : "Select File"}
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  accept="image/*,application/pdf,.doc,.docx"
                />
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border flex justify-end">
          <button onClick={onClose} className="btn btn-outline text-xs h-8 px-3">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
