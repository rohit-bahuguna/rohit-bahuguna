"use client";

import React, { useState, useEffect } from "react";
import AdminNav from "@/app/components/admin/AdminNav";
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
    if (!theme) return;
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
        toast.success("Theme draft saved! Check Preview Mode to see it in action.");
      } else {
        toast.error("Failed to save theme draft");
      }
    } catch {
      toast.error("Error saving theme draft");
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
  };

  const handleDeletePreset = (index: number) => {
    if (!theme) return;
    setTheme({
      ...theme,
      presets: theme.presets.filter((_, i) => i !== index),
    });
  };

  if (loading || !theme) {
    return (
      <div className="min-h-screen bg-[--bg]">
        <AdminNav />
        <div className="max-w-4xl mx-auto p-10 text-center font-black">Loading Theme Settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--bg]">
      <AdminNav />

      <main className="max-w-4xl mx-auto p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 brutal-card bg-white p-6 rounded-xl border-3 border-black shadow-[4px_4px_0px_#000]">
          <div>
            <span className="mono text-[10px] font-black uppercase tracking-wider text-black border-2 border-black bg-yellow-300 px-2 py-0.5 rounded shadow-[1px_1px_0px_#000] inline-block mb-1">
              Draft Editor
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-black">Theme Customizer</h1>
            <p className="text-xs font-bold text-slate-600 mt-1">
              Configure the single-source-of-truth brand color across the entire portfolio.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn !bg-black !text-white text-xs px-5 py-2.5 font-black uppercase flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-y-[-1px] disabled:opacity-50"
          >
            <HiOutlineCheckCircle className="text-lg" />
            <span>{saving ? "Saving Draft..." : "Save Theme Draft"}</span>
          </button>
        </div>

        {/* Primary Color Picker & Live Preview */}
        <section className="brutal-card bg-white p-6 rounded-xl border-3 border-black shadow-[4px_4px_0px_#000] space-y-6">
          <h2 className="text-lg font-black text-black border-b-2 border-black pb-2">
            1. Brand Primary Accent Color
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Color Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Hex Code Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                    className="w-12 h-12 rounded border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] p-1 bg-white"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                    className="flex-1 text-sm font-mono font-bold px-3 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Color Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {theme.presets.map((preset, idx) => {
                    const isSelected = theme.primaryColor.toLowerCase() === preset.value.toLowerCase();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTheme({ ...theme, primaryColor: preset.value })}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-black text-xs font-bold transition-transform shadow-[2px_2px_0px_#000] ${
                          isSelected ? "scale-105 ring-2 ring-black" : "hover:scale-102"
                        }`}
                        style={{ backgroundColor: preset.value, color: "#fff" }}
                      >
                        <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{preset.name}</span>
                        {isSelected && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Card Preview with Chosen Color */}
            <div className="p-6 border-3 border-black rounded-xl bg-slate-50 shadow-[4px_4px_0px_#000] space-y-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                Live Dynamic Component Preview
              </span>

              <div
                className="p-4 rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_#000]"
                style={{ borderColor: theme.primaryColor }}
              >
                <span
                  className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-black inline-block mb-2"
                  style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}
                >
                  Active Accent
                </span>
                <h3 className="text-base font-black text-black">
                  Interactive Preview Title
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Every button, badge border, and link on your portfolio will dynamically adopt this palette.
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="button"
                    className="text-xs font-black uppercase px-3 py-1.5 rounded border-2 border-black shadow-[2px_2px_0px_#000] text-white"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    type="button"
                    className="text-xs font-black uppercase px-3 py-1.5 rounded border-2 border-black shadow-[2px_2px_0px_#000] bg-white text-black"
                    style={{ color: theme.primaryColor }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preset Manager */}
        <section className="brutal-card bg-white p-6 rounded-xl border-3 border-black shadow-[4px_4px_0px_#000] space-y-4">
          <h2 className="text-lg font-black text-black border-b-2 border-black pb-2">
            2. Manage Color Presets
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-3 p-3 border-2 border-black rounded-lg bg-slate-50">
            <input
              type="color"
              value={newPresetColor}
              onChange={(e) => setNewPresetColor(e.target.value)}
              className="w-10 h-10 rounded border-2 border-black cursor-pointer bg-white"
            />
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Preset Name (e.g. Cobalt)"
              className="flex-1 text-xs font-bold px-3 py-2 border-2 border-black rounded bg-white shadow-[1px_1px_0px_#000]"
            />
            <button
              type="button"
              onClick={handleAddPreset}
              className="btn bg-black text-white text-xs px-3 py-2 font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_#000]"
            >
              <HiOutlinePlus /> Add Preset
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {theme.presets.map((preset, idx) => (
              <div
                key={idx}
                className="p-2.5 border-2 border-black rounded-lg bg-white flex items-center justify-between shadow-[2px_2px_0px_#000]"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded border border-black shadow-[1px_1px_0px_#000]"
                    style={{ backgroundColor: preset.value }}
                  />
                  <div>
                    <span className="text-xs font-bold block leading-none">{preset.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 leading-none">{preset.value}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeletePreset(idx)}
                  className="text-red-600 hover:text-red-800 text-xs p-1"
                  title="Delete preset"
                >
                  <HiOutlineTrash />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
