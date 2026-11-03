"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import {
  HiOutlineViewGrid,
  HiOutlinePhotograph,
  HiOutlineColorSwatch,
  HiOutlineCode,
  HiOutlineBadgeCheck,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineMenuAlt2,
  HiOutlineSparkles,
  HiOutlineExternalLink,
  HiOutlineEye,
  HiOutlineCloudUpload,
  HiOutlineLogout,
  HiOutlineChartBar,
} from "react-icons/hi";

export default function AdminNav() {
  const pathname = usePathname();
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    if (!confirm("Are you sure you want to publish all draft changes to the live website? This will update the public site immediately.")) {
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch("/api/publish", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Published successfully!");
      } else {
        toast.error(data.error || "Publishing failed");
      }
    } catch {
      toast.error("Network error while publishing");
    } finally {
      setPublishing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin-vault/login";
    } catch {
      toast.error("Logout failed");
    }
  };

  const navLinks = [
    { label: "Overview", href: "/admin-vault/dashboard", icon: HiOutlineViewGrid },
    { label: "Header & Nav", href: "/admin-vault/header", icon: HiOutlineMenuAlt2 },
    { label: "Hero", href: "/admin-vault/hero", icon: HiOutlineSparkles },
    { label: "About", href: "/admin-vault/about", icon: HiOutlineUser },
    { label: "Projects", href: "/admin-vault/projects", icon: HiOutlineCode },
    { label: "Skills", href: "/admin-vault/skills", icon: HiOutlineBadgeCheck },
    { label: "Contact & Footer", href: "/admin-vault/contact", icon: HiOutlineMail },
    { label: "Theme", href: "/admin-vault/theme", icon: HiOutlineColorSwatch },
    { label: "Media", href: "/admin-vault/media", icon: HiOutlinePhotograph },
    { label: "Analytics", href: "/admin-vault/analytics", icon: HiOutlineChartBar },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b-3 border-black shadow-[0_4px_0px_#000]">
      {/* Top Bar with Branding & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin-vault/dashboard"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-black text-white rounded font-black flex items-center justify-center text-sm shadow-[2px_2px_0px_#000] group-hover:bg-primary transition-colors">
              RB
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-black block leading-none">
                PORTFOLIO CMS
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                Vault Control
              </span>
            </div>
          </Link>
          <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-black bg-yellow-300 text-black rounded shadow-[1px_1px_0px_#000]">
            Draft Mode
          </span>
        </div>

        {/* Global CMS Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/?preview=true"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline text-xs px-3 py-1.5 font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_#000] hover:translate-y-[-1px]"
            title="Preview staged draft content before publishing"
          >
            <HiOutlineEye className="text-sm text-purple-700" />
            <span className="hidden md:inline">Preview Draft</span>
          </a>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn !bg-emerald-600 hover:!bg-emerald-700 !text-white border-2 border-black text-xs !py-1.5 !px-4 font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_#000] hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-50 cursor-pointer"
            title="Promote all draft changes to live site and purge cache"
          >
            <HiOutlineCloudUpload className="text-base" />
            <span>{publishing ? "Publishing..." : "Publish Live"}</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-slate-100 text-black border-2 border-black text-xs px-2.5 py-1.5 font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_#000] hover:bg-slate-200"
            title="View public live site"
          >
            <HiOutlineExternalLink />
          </a>

          <button
            onClick={handleLogout}
            className="btn bg-red-100 text-red-900 border-2 border-black text-xs px-2.5 py-1.5 font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_#000] hover:bg-red-200"
            title="Sign out of Admin Vault"
          >
            <HiOutlineLogout />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto border-t border-slate-200 flex items-center gap-1 py-1.5 scrollbar-none">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin-vault/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase rounded transition-all whitespace-nowrap border-2 ${
                isActive
                  ? "bg-black text-white border-black shadow-[2px_2px_0px_#000]"
                  : "bg-white text-slate-800 border-transparent hover:border-black hover:bg-slate-50"
              }`}
            >
              <Icon className="text-sm" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
