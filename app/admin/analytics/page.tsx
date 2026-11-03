"use client";

import React, { useState, useEffect } from "react";
import AdminShell from "@/app/components/admin/AdminShell";
import AdminStickyBar from "@/app/components/admin/AdminStickyBar";
import toast from "react-hot-toast";
import {
  HiOutlineChartBar,
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlineCursorClick,
  HiOutlineGlobe,
  HiOutlineDatabase,
  HiOutlineRefresh,
} from "react-icons/hi";

interface Metrics {
  totalEvents: number;
  resumeDownloads: number;
  resumeViews: number;
  projectClicks: number;
  botCount: number;
}

interface EventItem {
  id: string;
  eventType: string;
  targetId: string | null;
  targetUrl: string | null;
  ipAddress: string | null;
  country: string | null;
  city: string | null;
  browser: string | null;
  os: string | null;
  deviceType: string | null;
  referrer: string | null;
  isBot: boolean;
  createdAt: string;
}

interface Breakdown {
  country?: string;
  device?: string;
  count: number;
}

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [recentEvents, setRecentEvents] = useState<EventItem[]>([]);
  const [countryStats, setCountryStats] = useState<Breakdown[]>([]);
  const [deviceStats, setDeviceStats] = useState<Breakdown[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [timeRange, setTimeRange] = useState<"all" | "today" | "7d" | "30d">("all");
  const [botFilter, setBotFilter] = useState<"humans_only" | "all">("humans_only");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?timeRange=${timeRange}&botFilter=${botFilter}`);
      const data = await res.json();
      if (res.ok) {
        setMetrics(data.metrics);
        setRecentEvents(data.recentEvents || []);
        setCountryStats(data.countryStats || []);
        setDeviceStats(data.deviceStats || []);
      } else {
        toast.error(data.error || "Failed to load telemetry");
      }
    } catch {
      toast.error("Network error loading analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, botFilter]);

  const handleDownloadBackup = () => {
    window.open("/api/admin/backup", "_blank");
  };

  return (
    <AdminShell title="Visitor Analytics">
      <AdminStickyBar
        title="Visitor Telemetry &amp; Analytics"
        description="Edge-aware tracking for resume views, downloads, clicks, and geographic distribution."
        onSave={fetchAnalytics}
        saveButtonText="Refresh Telemetry"
      />

      <div className="space-y-6">
        {/* Filter Controls Bar */}
        <div className="minimal-card p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Time Range:</span>
            <div className="inline-flex rounded-lg bg-muted p-1 text-xs">
              {(
                [
                  { id: "all", label: "All Time" },
                  { id: "30d", label: "Last 30D" },
                  { id: "7d", label: "Last 7D" },
                  { id: "today", label: "Today" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeRange(t.id)}
                  className={`px-3 py-1 rounded-md transition-all font-medium ${
                    timeRange === t.id
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Bot Heuristic:</span>
            <div className="inline-flex rounded-lg bg-muted p-1 text-xs">
              <button
                onClick={() => setBotFilter("humans_only")}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  botFilter === "humans_only"
                    ? "bg-background text-foreground shadow-sm font-semibold text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Humans Only
              </button>
              <button
                onClick={() => setBotFilter("all")}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  botFilter === "all"
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All (incl. Bots)
              </button>
            </div>
          </div>
        </div>

        {/* Metrics KPI Cards */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="minimal-card p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-medium uppercase tracking-wider">
                  Resume Downloads
                </span>
                <HiOutlineDownload className="text-lg text-primary" />
              </div>
              <div className="text-3xl font-bold tracking-tight text-foreground mt-2">
                {metrics.resumeDownloads}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Direct file acquisitions
              </span>
            </div>

            <div className="minimal-card p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-medium uppercase tracking-wider">
                  Resume Views
                </span>
                <HiOutlineEye className="text-lg text-primary" />
              </div>
              <div className="text-3xl font-bold tracking-tight text-foreground mt-2">
                {metrics.resumeViews}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                In-app document views
              </span>
            </div>

            <div className="minimal-card p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-medium uppercase tracking-wider">
                  Project Clicks
                </span>
                <HiOutlineCursorClick className="text-lg text-primary" />
              </div>
              <div className="text-3xl font-bold tracking-tight text-foreground mt-2">
                {metrics.projectClicks}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Demo &amp; code links
              </span>
            </div>

            <div className="minimal-card p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-medium uppercase tracking-wider">
                  Total Events
                </span>
                <HiOutlineChartBar className="text-lg text-primary" />
              </div>
              <div className="text-3xl font-bold tracking-tight text-foreground mt-2">
                {metrics.totalEvents}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                {metrics.botCount} crawlers filtered
              </span>
            </div>
          </div>
        )}

        {/* Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="minimal-card p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border pb-2">
              <HiOutlineGlobe /> Top Geographic Origins
            </h3>
            {countryStats.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No location events yet.</p>
            ) : (
              <div className="space-y-1.5">
                {countryStats.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1.5 px-2 rounded-md hover:bg-muted/50"
                  >
                    <span className="font-medium text-foreground">{c.country}</span>
                    <span className="font-mono text-muted-foreground">{c.count} hits</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="minimal-card p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
              Device Form Factors
            </h3>
            {deviceStats.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No device events yet.</p>
            ) : (
              <div className="space-y-1.5">
                {deviceStats.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1.5 px-2 rounded-md hover:bg-muted/50"
                  >
                    <span className="font-medium text-foreground capitalize">{d.device}</span>
                    <span className="font-mono text-muted-foreground">{d.count} hits</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Events Log Table */}
        <div className="minimal-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Activity Feed (Last 50 Events)
            </h3>
            <span className="text-[11px] text-muted-foreground">Auto-logged via Cloudflare Edge</span>
          </div>

          {recentEvents.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              No recent events logged.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/30 border-b border-border text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3">Type</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Target</th>
                    <th className="p-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-muted/20">
                      <td className="p-3">
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-muted text-foreground">
                          {evt.eventType}
                        </span>
                      </td>
                      <td className="p-3 font-medium">
                        {evt.country || "Local"} {evt.city ? `(${evt.city})` : ""}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {evt.isBot ? (
                          <span className="text-[10px] text-destructive bg-destructive/10 px-1.5 py-0.5 rounded font-medium">
                            Bot
                          </span>
                        ) : (
                          <span>{evt.browser || "Browser"}</span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-[11px] truncate max-w-[200px]" title={evt.targetUrl || ""}>
                        {evt.targetUrl || evt.targetId || "—"}
                      </td>
                      <td className="p-3 text-[10px] text-muted-foreground">
                        {new Date(evt.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
