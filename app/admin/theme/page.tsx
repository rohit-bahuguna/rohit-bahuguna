"use client";

import React, { useState, useEffect } from "react";
import AdminShell from "@/app/components/admin/AdminShell";
import AdminStickyBar from "@/app/components/admin/AdminStickyBar";
import toast from "react-hot-toast";
import {
  HiOutlineColorSwatch,
  HiOutlineCheckCircle,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi";

interface PresetColor {
  name: string;
  value: string;
}

interface ThemeConfig {
  primaryColor: string;
  presets: PresetColor[];
}

export default function AdminThemePage() {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetColor, setNewPresetColor] = useState("#3b82f6");

  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await fetch("/api/admin/config?key=theme&state=draft");
        const json = await res.json();
        if (json.data) {
          setTheme(json.data);
        } else {
          setTheme({
            primaryColor: "#573e60",
            presets: [
              { name: "Plum", value: "#573e60" },
              { name: "Terracotta", value: "#e2725b" },
              { name: "Yellow", value: "#facc15" },
              { name: "Emerald", value: "#10b981" },
              { name: "Rose", value: "#f43f5e" },
              { name: "Indigo", value: "#4f46e5" },
              { name: "Cyan", value: "#06b6d4" },
            ],
          });
        }
      } catch {
        toast.error("Failed to load theme configuration");
      } finally {
        setLoading(false);
      }
    }
    loadTheme();
  }, []);

  const handleSave = async () => {
    if (!theme) return false;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "theme",
          data: theme,
        }),
      });
      if (res.ok) {
        toast.success("Theme draft saved!");
        setIsDirty(false);
        return true;
      } else {
        toast.error("Failed to save theme draft");
        return false;
      }
    } catch {
      toast.error("Error saving theme draft");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddPreset = () => {
    if (!theme || !newPresetName.trim()) return;
    setTheme({
      ...theme,
      presets: [...theme.presets, { name: newPresetName.trim(), value: newPresetColor }],
    });
    setNewPresetName("");
    setIsDirty(true);
  };

  const handleDeletePreset = (index: number) => {
    if (!theme) return;
    setTheme({
      ...theme,
      presets: theme.presets.filter((_, i) => i !== index),
    });
    setIsDirty(true);
  };

  if (loading || !theme) {
    return (
      <AdminShell title="Theme Customizer">
        <div className="py-20 text-center text-xs text-muted-foreground">
          Loading theme configuration...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Theme Customizer"
      isDirty={isDirty}
      onSave={handleSave}
      onDiscard={() => setIsDirty(false)}
    >
      <AdminStickyBar
        title="Theme Customizer"
        description="Configure brand accent colors, custom palette presets, and live preview rendering."
        saving={saving}
        isDirty={isDirty}
        onSave={handleSave}
      />

      <div className="space-y-6 max-w-4xl">
        {/* Primary Color Picker & Live Preview */}
        <section className="minimal-card p-6 space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-sm font-semibold text-foreground">
              1. Brand Accent Color
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select or enter your primary brand accent hex code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Color Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Hex Color Code
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => {
                      setTheme({ ...theme, primaryColor: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-10 h-10 rounded-md border border-input cursor-pointer bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => {
                      setTheme({ ...theme, primaryColor: e.target.value });
                      setIsDirty(true);
                    }}
                    className="flex-1 text-xs font-mono font-medium px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-2">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {theme.presets.map((preset, idx) => {
                    const isSelected =
                      theme.primaryColor.toLowerCase() === preset.value.toLowerCase();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setTheme({ ...theme, primaryColor: preset.value });
                          setIsDirty(true);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
                          isSelected
                            ? "ring-2 ring-primary border-primary shadow-sm scale-102"
                            : "border-border hover:border-foreground/40"
                        }`}
                        style={{ backgroundColor: `${preset.value}15`, color: preset.value }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: preset.value }}
                        />
                        <span>{preset.name}</span>
                        {isSelected && <span className="text-[10px] ml-0.5">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Component Preview */}
            <div className="p-5 border border-border rounded-xl bg-muted/20 space-y-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Component Accent Preview
              </span>

              <div
                className="p-4 rounded-lg border bg-card shadow-xs space-y-3"
                style={{ borderColor: theme.primaryColor }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${theme.primaryColor}20`,
                      color: theme.primaryColor,
                    }}
                  >
                    Active Accent
                  </span>
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                </div>

                <h4 className="text-sm font-semibold text-foreground">
                  Interactive Accent Preview
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Buttons, highlighted badges, and active focus borders will dynamically adapt to this theme color.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    className="text-xs font-medium px-3 py-1.5 rounded-md text-white shadow-xs"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    type="button"
                    className="text-xs font-medium px-3 py-1.5 rounded-md border"
                    style={{
                      color: theme.primaryColor,
                      borderColor: theme.primaryColor,
                    }}
                  >
                    Outline Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preset Manager */}
        <section className="minimal-card p-6 space-y-4">
          <div className="border-b border-border pb-3">
            <h3 className="text-sm font-semibold text-foreground">
              2. Palette Presets Library
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Save custom hex color presets for quick one-click theme switching.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 p-3 border border-border rounded-lg bg-muted/20">
            <input
              type="color"
              value={newPresetColor}
              onChange={(e) => setNewPresetColor(e.target.value)}
              className="w-9 h-9 rounded-md border border-input cursor-pointer bg-transparent p-0.5"
            />
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Preset Name (e.g. Cobalt, Sunset)"
              className="flex-1 text-xs px-3 py-2 border border-input rounded-md bg-background"
            />
            <button
              type="button"
              onClick={handleAddPreset}
              className="btn btn-outline text-xs h-9 px-3 gap-1 shrink-0"
            >
              <HiOutlinePlus className="text-sm" />
              <span>Add Preset</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {theme.presets.map((preset, idx) => (
              <div
                key={idx}
                className="p-2.5 border border-border rounded-lg bg-card flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full border border-border shrink-0"
                    style={{ backgroundColor: preset.value }}
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-medium block truncate">{preset.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground block truncate">
                      {preset.value}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeletePreset(idx)}
                  className="text-muted-foreground hover:text-destructive text-xs p-1 rounded transition-colors"
                  title="Delete preset"
                >
                  <HiOutlineTrash />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
