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
  HiOutlineX,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
} from "react-icons/hi";

interface SkillItem {
  id?: string;
  name: string;
  category: string;
  iconUrl?: string | null;
  level?: number | null;
  order: number;
}

const CATEGORIES = ["Frontend", "Backend", "Database", "Tools"];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      if (res.ok) {
        setSkills(data.skills || []);
      }
    } catch {
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenCreate = () => {
    setEditingSkill({
      name: "",
      category: activeCategory !== "All" ? activeCategory : "Frontend",
      level: 80,
      iconUrl: "",
      order: skills.length,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (skill: SkillItem) => {
    setEditingSkill({ ...skill });
    setModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name.trim() || !editingSkill.category.trim()) {
      toast.error("Skill name and category are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSkill),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingSkill.id ? "Skill updated in draft!" : "Skill added to draft!");
        setModalOpen(false);
        fetchSkills();
      } else {
        toast.error(data.error || "Failed to save skill");
      }
    } catch {
      toast.error("Error saving skill");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this draft skill?")) return;

    try {
      const res = await fetch("/api/admin/skills", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success("Skill removed from draft");
        fetchSkills();
      } else {
        toast.error("Failed to delete skill");
      }
    } catch {
      toast.error("Error deleting skill");
    }
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= skills.length) return;

    const current = skills[index];
    const target = skills[targetIdx];

    try {
      await Promise.all([
        fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...current, order: target.order }),
        }),
        fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...target, order: current.order }),
        }),
      ]);
      fetchSkills();
    } catch {
      toast.error("Failed to reorder skills");
    }
  };

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <AdminShell title="Technical Skills">
      <AdminStickyBar
        title="Technical Skills"
        description="Manage skills taxonomy, proficiency ratings, and category groupings."
        onSave={handleOpenCreate}
        saveButtonText="+ Add Skill"
      />

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
              activeCategory === cat
                ? "bg-foreground text-background border-foreground font-semibold"
                : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-muted"
            }`}
          >
            {cat} (
            {cat === "All"
              ? skills.length
              : skills.filter((s) => s.category.toLowerCase() === cat.toLowerCase()).length}
            )
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground">
          Loading skills...
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="minimal-card p-12 text-center rounded-xl">
          <p className="text-xs text-muted-foreground font-medium">No skills in this category.</p>
          <button onClick={handleOpenCreate} className="mt-4 btn btn-primary text-xs h-9 px-4">
            Add First Skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredSkills.map((skill, idx) => (
            <div
              key={skill.id || idx}
              className="minimal-card p-4 rounded-xl flex flex-col justify-between gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {skill.iconUrl ? (
                    <div className="w-9 h-9 rounded-md border border-border bg-muted/30 flex items-center justify-center p-1.5">
                      <img
                        src={skill.iconUrl}
                        alt={skill.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-md border border-border bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      {skill.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground leading-tight">
                      {skill.name}
                    </h4>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      {skill.category}
                    </span>
                  </div>
                </div>

                {skill.level !== null && skill.level !== undefined && (
                  <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {skill.level}%
                  </span>
                )}
              </div>

              {skill.level !== null && skill.level !== undefined && (
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              )}

              <div className="pt-2 border-t border-border flex items-center justify-between">
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
                    disabled={idx === filteredSkills.length - 1}
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
                    onClick={() => handleOpenEdit(skill)}
                    className="btn btn-outline text-xs h-7 px-2.5 gap-1"
                  >
                    <HiOutlinePencil /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(skill.id)}
                    className="p-1 text-muted-foreground hover:text-destructive rounded hover:bg-accent text-xs"
                    title="Delete"
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {modalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl overflow-hidden text-card-foreground">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-base font-semibold tracking-tight">
                {editingSkill.id ? "Edit Skill" : "Add Technical Skill"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <HiOutlineX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, name: e.target.value })
                  }
                  className="w-full text-xs font-semibold px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Category *
                </label>
                <select
                  value={editingSkill.category}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, category: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3 py-2 border border-input rounded-md bg-background"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile">Mobile</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-foreground">
                    Proficiency Rating ({editingSkill.level || 0}%)
                  </label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={editingSkill.level || 0}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, level: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Icon Asset
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingSkill.iconUrl || ""}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, iconUrl: e.target.value })
                    }
                    placeholder="/Images/icons/..."
                    className="flex-1 text-xs font-mono px-3 py-2 border border-input rounded-md bg-background"
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

              <div className="pt-3 border-t border-border flex justify-end gap-2">
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
                  {saving ? "Saving..." : "Save Skill"}
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
        title="Select Skill Icon"
        onSelect={(url) => {
          if (editingSkill) {
            setEditingSkill({ ...editingSkill, iconUrl: url });
          }
        }}
      />
    </AdminShell>
  );
}
