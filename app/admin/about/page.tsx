"use client";

import React, { useState, useEffect } from "react";
import AdminShell from "@/app/components/admin/AdminShell";
import AdminStickyBar from "@/app/components/admin/AdminStickyBar";
import toast from "react-hot-toast";
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
} from "react-icons/hi";

interface StatItem {
  label: string;
  value: string;
}

interface JourneyItem {
  year: string;
  title: string;
  description: string;
}

interface AboutConfig {
  badgeText: string;
  heading: string;
  paragraphs: string[];
  stats: StatItem[];
  timelineBadge: string;
  timelineHeading: string;
  journey: JourneyItem[];
}

export default function AdminAboutPage() {
  const [config, setConfig] = useState<AboutConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(0);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/admin/config?key=about&state=draft");
        const json = await res.json();
        if (json.data) {
          setConfig(json.data);
        }
      } catch {
        toast.error("Failed to load about section configuration");
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
          key: "about",
          data: config,
        }),
      });
      if (res.ok) {
        toast.success("About & Timeline draft saved!");
        setIsDirty(false);
        return true;
      } else {
        toast.error("Failed to save about draft");
        return false;
      }
    } catch {
      toast.error("Error saving about draft");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Paragraph handlers
  const handleAddParagraph = () => {
    if (!config) return;
    setConfig({ ...config, paragraphs: [...config.paragraphs, ""] });
    setIsDirty(true);
  };

  const handleUpdateParagraph = (index: number, val: string) => {
    if (!config) return;
    const p = [...config.paragraphs];
    p[index] = val;
    setConfig({ ...config, paragraphs: p });
    setIsDirty(true);
  };

  const handleDeleteParagraph = (index: number) => {
    if (!config) return;
    setConfig({ ...config, paragraphs: config.paragraphs.filter((_, i) => i !== index) });
    setIsDirty(true);
  };

  // Stats handlers
  const handleAddStat = () => {
    if (!config) return;
    setConfig({ ...config, stats: [...config.stats, { label: "Metric", value: "Value" }] });
    setIsDirty(true);
  };

  const handleUpdateStat = (index: number, field: keyof StatItem, val: string) => {
    if (!config) return;
    const s = [...config.stats];
    s[index] = { ...s[index], [field]: val };
    setConfig({ ...config, stats: s });
    setIsDirty(true);
  };

  const handleDeleteStat = (index: number) => {
    if (!config) return;
    setConfig({ ...config, stats: config.stats.filter((_, i) => i !== index) });
    setIsDirty(true);
  };

  // Journey handlers
  const handleAddJourney = () => {
    if (!config) return;
    const newMilestone = {
      year: "2026",
      title: "New Career Milestone",
      description: "Details regarding this milestone...",
    };
    setConfig({
      ...config,
      journey: [...config.journey, newMilestone],
    });
    setExpandedMilestone(config.journey.length);
    setIsDirty(true);
  };

  const handleUpdateJourney = (index: number, field: keyof JourneyItem, val: string) => {
    if (!config) return;
    const j = [...config.journey];
    j[index] = { ...j[index], [field]: val };
    setConfig({ ...config, journey: j });
    setIsDirty(true);
  };

  const handleDeleteJourney = (index: number) => {
    if (!config) return;
    setConfig({ ...config, journey: config.journey.filter((_, i) => i !== index) });
    setIsDirty(true);
  };

  const handleMoveJourney = (index: number, direction: "up" | "down") => {
    if (!config) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= config.journey.length) return;
    const j = [...config.journey];
    const temp = j[index];
    j[index] = j[targetIdx];
    j[targetIdx] = temp;
    setConfig({ ...config, journey: j });
    setExpandedMilestone(targetIdx);
    setIsDirty(true);
  };

  if (loading || !config) {
    return (
      <AdminShell title="About & Journey">
        <div className="py-20 text-center text-xs text-muted-foreground">
          Loading About Settings...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="About & Journey"
      isDirty={isDirty}
      onSave={handleSave}
      onDiscard={() => setIsDirty(false)}
    >
      <AdminStickyBar
        title="About &amp; Journey"
        description="Configure your biography narrative, statistic metrics, and career timeline."
        saving={saving}
        isDirty={isDirty}
        onSave={handleSave}
      />

      <div className="space-y-6 max-w-4xl">
        {/* Headings & Paragraphs */}
        <section className="minimal-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            1. Section Headlines &amp; Bio Paragraphs
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Badge Label
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
                Section Heading
              </label>
              <input
                type="text"
                value={config.heading}
                onChange={(e) => {
                  setConfig({ ...config, heading: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full text-xs font-semibold px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">
                Narrative Paragraphs
              </label>
              <button
                type="button"
                onClick={handleAddParagraph}
                className="btn btn-outline text-xs h-7 px-2.5 gap-1"
              >
                <HiOutlinePlus /> Add Paragraph
              </button>
            </div>

            {config.paragraphs.map((p, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <textarea
                  rows={2}
                  value={p}
                  onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                  className="flex-1 text-xs font-medium p-3 border border-input rounded-md bg-background leading-relaxed"
                  placeholder={`Paragraph ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteParagraph(idx)}
                  className="p-2 text-muted-foreground hover:text-destructive rounded hover:bg-accent transition-colors"
                  title="Delete paragraph"
                >
                  <HiOutlineTrash />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Statistic Metrics */}
        <section className="minimal-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-semibold text-foreground">
              2. Key Stat Metrics
            </h3>
            <button
              type="button"
              onClick={handleAddStat}
              className="btn btn-outline text-xs h-7 px-2.5 gap-1"
            >
              <HiOutlinePlus /> Add Stat
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {config.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-3 border border-border rounded-lg bg-card space-y-2 relative"
              >
                <button
                  type="button"
                  onClick={() => handleDeleteStat(idx)}
                  className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-destructive text-sm"
                  title="Delete stat"
                >
                  <HiOutlineTrash />
                </button>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase font-medium block mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleUpdateStat(idx, "label", e.target.value)}
                    className="w-full text-xs font-medium px-2 py-1.5 border border-input rounded bg-background"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase font-medium block mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleUpdateStat(idx, "value", e.target.value)}
                    className="w-full text-xs font-bold px-2 py-1.5 border border-input rounded bg-background"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Career Timeline with Accordions */}
        <section className="minimal-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                3. Career Timeline &amp; Milestones
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAddJourney}
              className="btn btn-outline text-xs h-8 px-3 gap-1"
            >
              <HiOutlinePlus /> Add Milestone
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Timeline Badge
              </label>
              <input
                type="text"
                value={config.timelineBadge}
                onChange={(e) => {
                  setConfig({ ...config, timelineBadge: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full text-xs font-medium px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Timeline Heading
              </label>
              <input
                type="text"
                value={config.timelineHeading}
                onChange={(e) => {
                  setConfig({ ...config, timelineHeading: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full text-xs font-semibold px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {config.journey.map((item, idx) => {
              const isExpanded = expandedMilestone === idx;
              return (
                <div
                  key={idx}
                  className="border border-border rounded-lg bg-card overflow-hidden transition-all"
                >
                  {/* Accordion Row Header */}
                  <div
                    className="p-3.5 flex items-center justify-between gap-3 cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors"
                    onClick={() => setExpandedMilestone(isExpanded ? null : idx)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-xs">
                        {isExpanded ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
                      </span>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
                        {item.year || "Year"}
                      </span>
                      <span className="text-xs font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                        {item.title || "Untitled Milestone"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveJourney(idx, "up")}
                        className="p-1 rounded border border-input hover:bg-accent disabled:opacity-30 text-xs"
                        title="Move Up"
                      >
                        <HiOutlineArrowUp />
                      </button>
                      <button
                        type="button"
                        disabled={idx === config.journey.length - 1}
                        onClick={() => handleMoveJourney(idx, "down")}
                        className="p-1 rounded border border-input hover:bg-accent disabled:opacity-30 text-xs"
                        title="Move Down"
                      >
                        <HiOutlineArrowDown />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteJourney(idx)}
                        className="p-1 text-muted-foreground hover:text-destructive rounded hover:bg-accent text-xs ml-2"
                        title="Delete milestone"
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </div>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div className="p-4 border-t border-border space-y-3 bg-card animate-in fade-in duration-100">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase font-medium block mb-1">
                            Year / Era
                          </label>
                          <input
                            type="text"
                            value={item.year}
                            onChange={(e) => handleUpdateJourney(idx, "year", e.target.value)}
                            className="w-full text-xs font-medium px-3 py-1.5 border border-input rounded-md bg-background"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="text-[10px] text-muted-foreground uppercase font-medium block mb-1">
                            Title / Position
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateJourney(idx, "title", e.target.value)}
                            className="w-full text-xs font-medium px-3 py-1.5 border border-input rounded-md bg-background"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-muted-foreground uppercase font-medium block mb-1">
                          Milestone Description
                        </label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => handleUpdateJourney(idx, "description", e.target.value)}
                          className="w-full text-xs font-medium p-2.5 border border-input rounded-md bg-background leading-relaxed"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
