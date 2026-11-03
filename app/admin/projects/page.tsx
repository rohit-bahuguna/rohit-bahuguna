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
  HiOutlinePencil,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlineX,
} from "react-icons/hi";

interface ProjectItem {
  id?: string;
  title: string;
  description: string;
  tags: string | string[];
  imageUrl?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured: boolean;
  order: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects || []);
      }
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditingProject({
      title: "",
      description: "",
      tags: [],
      imageUrl: "",
      liveUrl: "",
      githubUrl: "",
      featured: false,
      order: projects.length,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (project: ProjectItem) => {
    let parsedTags: string[] = [];
    if (Array.isArray(project.tags)) {
      parsedTags = project.tags;
    } else if (typeof project.tags === "string") {
      try {
        const parsed = JSON.parse(project.tags);
        parsedTags = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        parsedTags = [project.tags];
      }
    }
    setEditingProject({
      ...project,
      tags: parsedTags,
    });
    setModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title.trim() || !editingProject.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingProject.id ? "Project updated in draft!" : "Project added to draft!");
        setModalOpen(false);
        fetchProjects();
      } else {
        toast.error(data.error || "Failed to save project");
      }
    } catch {
      toast.error("Error saving project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this draft project?")) return;

    try {
      const res = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success("Project removed from draft");
        fetchProjects();
      } else {
        toast.error("Failed to delete project");
      }
    } catch {
      toast.error("Error deleting project");
    }
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;

    const current = projects[index];
    const target = projects[targetIdx];

    try {
      await Promise.all([
        fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...current, order: target.order }),
        }),
        fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...target, order: current.order }),
        }),
      ]);
      fetchProjects();
    } catch {
      toast.error("Failed to reorder projects");
    }
  };

  return (
    <AdminShell title="Projects Portfolio">
      <AdminStickyBar
        title="Projects Portfolio"
        description="Add, edit, reorder, and feature your showcased technical projects."
        onSave={handleOpenCreate}
        saveButtonText="+ Add Project"
      />

      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="minimal-card p-12 text-center rounded-xl">
          <p className="text-xs text-muted-foreground font-medium">No projects in draft state.</p>
          <button onClick={handleOpenCreate} className="mt-4 btn btn-primary text-xs h-9 px-4">
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => {
            let tagsList: string[] = [];
            try {
              tagsList = Array.isArray(proj.tags) ? proj.tags : JSON.parse(proj.tags || "[]");
            } catch {
              tagsList = [];
            }

            return (
              <div
                key={proj.id || idx}
                className="minimal-card rounded-xl flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="relative h-44 border-b border-border bg-muted/30 flex items-center justify-center overflow-hidden">
                    {proj.imageUrl ? (
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                      />
                    ) : (
                      <div className="text-muted-foreground flex flex-col items-center">
                        <HiOutlinePhotograph className="text-3xl mb-1" />
                        <span className="text-[11px]">No Cover</span>
                      </div>
                    )}
                    {proj.featured && (
                      <span className="absolute top-2.5 left-2.5 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
                        Featured
                      </span>
                    )}
                    <span className="absolute top-2.5 right-2.5 bg-background/90 text-foreground border border-border text-[10px] font-mono px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h4 className="text-base font-semibold text-foreground tracking-tight line-clamp-1">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tagsList.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-border flex items-center justify-between gap-2 bg-muted/10">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleReorder(idx, "up")}
                      className="p-1 rounded border border-input hover:bg-accent disabled:opacity-30 text-xs"
                      title="Move Up"
                    >
                      <HiOutlineArrowUp />
                    </button>
                    <button
                      type="button"
                      disabled={idx === projects.length - 1}
                      onClick={() => handleReorder(idx, "down")}
                      className="p-1 rounded border border-input hover:bg-accent disabled:opacity-30 text-xs"
                      title="Move Down"
                    >
                      <HiOutlineArrowDown />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(proj)}
                      className="btn btn-outline text-xs h-7 px-2.5 gap-1"
                    >
                      <HiOutlinePencil /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(proj.id)}
                      className="p-1 text-muted-foreground hover:text-destructive rounded hover:bg-accent text-xs"
                      title="Delete project"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Create Project Modal */}
      {modalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-card border border-border rounded-xl shadow-xl my-8 overflow-hidden text-card-foreground">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="text-base font-semibold tracking-tight">
                {editingProject.id ? "Edit Project" : "Add New Project"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <HiOutlineX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                  className="w-full text-xs font-semibold px-3 py-2 rounded-md border border-input bg-background"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3 py-2 rounded-md border border-input bg-background leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Tech Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={
                    Array.isArray(editingProject.tags)
                      ? editingProject.tags.join(", ")
                      : editingProject.tags
                  }
                  onChange={(e) => {
                    const array = e.target.value.split(",").map((s) => s.trim());
                    setEditingProject({ ...editingProject, tags: array });
                  }}
                  className="w-full text-xs font-medium px-3 py-2 rounded-md border border-input bg-background"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Cover Image Asset
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProject.imageUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, imageUrl: e.target.value })
                    }
                    className="flex-1 text-xs font-mono px-3 py-2 rounded-md border border-input bg-background"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="btn btn-outline text-xs h-9 px-3 gap-1 shrink-0"
                  >
                    <HiOutlinePhotograph /> Pick
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    value={editingProject.liveUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, liveUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full text-xs font-mono px-3 py-2 rounded-md border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    GitHub Repo URL
                  </label>
                  <input
                    type="text"
                    value={editingProject.githubUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, githubUrl: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full text-xs font-mono px-3 py-2 rounded-md border border-input bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.featured}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, featured: e.target.checked })
                    }
                    className="accent-foreground"
                  />
                  Featured project on homepage
                </label>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline text-xs h-9 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary text-xs h-9 px-4"
                >
                  {saving ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        filterType="images"
        title="Select Project Cover"
        onSelect={(url) => {
          if (editingProject) {
            setEditingProject({ ...editingProject, imageUrl: url });
          }
        }}
      />
    </AdminShell>
  );
}
