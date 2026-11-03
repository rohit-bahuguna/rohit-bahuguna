"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  HiOutlineViewGrid,
  HiOutlineMenuAlt2,
  HiOutlineSparkles,
  HiOutlineUser,
  HiOutlineCode,
  HiOutlineBadgeCheck,
  HiOutlineMail,
  HiOutlinePhotograph,
  HiOutlineDocumentText,
  HiOutlineSearch,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineX,
  HiOutlineChartBar,
} from "react-icons/hi";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onNavigate?: (href: string) => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  key?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export default function AdminSidebar({
  mobileOpen = false,
  onCloseMobile,
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [stagedKeys, setStagedKeys] = useState<string[]>([]);

  useEffect(() => {
    // Check which sections have staged draft changes (draft !== live)
    async function checkStaged() {
      try {
        const res = await fetch("/api/admin/staged-status");
        const json = await res.json();
        if (json?.stagedKeys) {
          setStagedKeys(json.stagedKeys);
        }
      } catch {}
    }
    checkStaged();
  }, [pathname]);

  const navGroups: NavGroup[] = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/admin-vault/dashboard", icon: HiOutlineViewGrid },
      ],
    },
    {
      title: "Content",
      items: [
        { label: "Header & Nav", href: "/admin-vault/header", icon: HiOutlineMenuAlt2, key: "header" },
        { label: "Hero Section", href: "/admin-vault/hero", icon: HiOutlineSparkles, key: "hero" },
        { label: "About & Journey", href: "/admin-vault/about", icon: HiOutlineUser, key: "about" },
        { label: "Projects", href: "/admin-vault/projects", icon: HiOutlineCode, key: "projects" },
        { label: "Skills", href: "/admin-vault/skills", icon: HiOutlineBadgeCheck, key: "skills" },
        { label: "Contact & Footer", href: "/admin-vault/contact", icon: HiOutlineMail, key: "contact" },
      ],
    },
    {
      title: "Resume",
      items: [
        { label: "Resume & In-App", href: "/admin-vault/resume", icon: HiOutlineDocumentText },
      ],
    },
    {
      title: "Assets & Telemetry",
      items: [
        { label: "Media Library", href: "/admin-vault/media", icon: HiOutlinePhotograph },
        { label: "Visitor Analytics", href: "/admin-vault/analytics", icon: HiOutlineChartBar },
      ],
    },
    {
      title: "System",
      items: [
        { label: "SEO & Social Preview", href: "/admin-vault/seo", icon: HiOutlineSearch, key: "seo" },
        { label: "Settings & Backup", href: "/admin-vault/settings", icon: HiOutlineCog, key: "settings" },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/admin-vault/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleItemClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onCloseMobile?.();
    if (onNavigate) {
      onNavigate(href);
    } else {
      router.push(href);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Brand & Workspace Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <a
          href="/admin-vault/dashboard"
          onClick={(e) => handleItemClick(e, "/admin-vault/dashboard")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-xs tracking-wider">
            RB
          </div>
          <div>
            <span className="text-xs font-bold tracking-tight text-foreground block group-hover:opacity-80 transition-opacity">
              Portfolio CMS
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
              Vault Control
            </span>
          </div>
        </a>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <HiOutlineX className="text-lg" />
          </button>
        )}
      </div>

      {/* Grouped Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h3 className="px-3 text-[11px] font-medium tracking-wider uppercase text-muted-foreground/70">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin-vault/dashboard" && pathname.startsWith(item.href));

                const isStaged =
                  item.key === "contact"
                    ? stagedKeys.includes("contact") || stagedKeys.includes("footer")
                    : item.key && stagedKeys.includes(item.key);

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleItemClick(e, item.href)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`text-base ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                      <span>{item.label}</span>
                    </div>

                    {isStaged && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"
                        title="Unpublished staged changes in this section"
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Admin User Card & Sign Out */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-semibold shrink-0">
              R
            </div>
            <div className="truncate">
              <span className="text-xs font-medium block truncate leading-none">rohit</span>
              <span className="text-[10px] text-muted-foreground block truncate leading-none mt-1">Admin</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded hover:bg-accent cursor-pointer"
            title="Sign out of Vault"
          >
            <HiOutlineLogout className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block fixed inset-y-0 left-0 w-64 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Slide-over */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
