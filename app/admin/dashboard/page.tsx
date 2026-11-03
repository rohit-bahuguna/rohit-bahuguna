import React from "react";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/app/components/admin/AdminShell";
import Link from "next/link";
import {
  HiOutlinePhotograph,
  HiOutlineCode,
  HiOutlineBadgeCheck,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineMenuAlt2,
  HiOutlineSparkles,
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineSearch,
  HiOutlineCog,
  HiOutlineArrowRight,
} from "react-icons/hi";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin-vault/login");
  }

  const [projectCount, skillCount, mediaCount, configCount, eventCount] = await Promise.all([
    prisma.project.count({ where: { state: "draft" } }),
    prisma.skill.count({ where: { state: "draft" } }),
    prisma.media.count(),
    prisma.siteConfig.count({ where: { state: "draft" } }),
    prisma.analyticsEvent.count(),
  ]);

  const siteConfigs = await prisma.siteConfig.findMany({
    where: { state: "draft" },
    select: { key: true, updatedAt: true },
  });

  const cards = [
    {
      title: "Header & Navigation",
      desc: "Brand logo, tabs, link targets, and CTA button",
      href: "/admin-vault/header",
      icon: HiOutlineMenuAlt2,
    },
    {
      title: "Hero Section",
      desc: "Headlines, bio, portrait photo, and social profiles",
      href: "/admin-vault/hero",
      icon: HiOutlineSparkles,
    },
    {
      title: "About & Journey",
      desc: "Biography narrative, statistics, and career milestones",
      href: "/admin-vault/about",
      icon: HiOutlineUser,
    },
    {
      title: "Projects Portfolio",
      desc: `${projectCount} draft projects • CRUD & custom ordering`,
      href: "/admin-vault/projects",
      icon: HiOutlineCode,
    },
    {
      title: "Technical Skills",
      desc: `${skillCount} skills • Categorized taxonomy`,
      href: "/admin-vault/skills",
      icon: HiOutlineBadgeCheck,
    },
    {
      title: "Contact & Footer",
      desc: "Direct contact channels, Web3Forms key, and copyright",
      href: "/admin-vault/contact",
      icon: HiOutlineMail,
    },
    {
      title: "Resume & In-App Viewer",
      desc: "Document routing, in-app viewer (/resume), and PDF downloads",
      href: "/admin-vault/resume",
      icon: HiOutlineDocumentText,
    },
    {
      title: "Media Asset Library",
      desc: `${mediaCount} uploads • Safe deletion reference guard`,
      href: "/admin-vault/media",
      icon: HiOutlinePhotograph,
    },
    {
      title: "Visitor Analytics",
      desc: `${eventCount} events tracked • Edge geolocation & bot detection`,
      href: "/admin-vault/analytics",
      icon: HiOutlineChartBar,
    },
    {
      title: "SEO & Social Sharing",
      desc: "Meta tags, OpenGraph cards, and live snippet preview",
      href: "/admin-vault/seo",
      icon: HiOutlineSearch,
    },
  ];

  return (
    <AdminShell title="Dashboard Overview">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="minimal-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Portfolio Control Center
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {session.username}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              All edits in the CMS save directly to a staged draft. Click <strong className="text-foreground">Publish Live</strong> in the top bar to review your changes on the Preview page and promote them to the live website.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/?preview=true"
              className="btn btn-primary text-xs h-9 px-4 gap-1.5"
            >
              Publish Live &rarr; Preview
            </a>
          </div>
        </div>

        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="minimal-card p-5">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
              Draft Projects
            </span>
            <div className="text-3xl font-bold tracking-tight text-foreground mt-2">
              {projectCount}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 block">
              In portfolio database
            </span>
          </div>

          <div className="minimal-card p-5">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
              Draft Skills
            </span>
            <div className="text-3xl font-bold tracking-tight text-foreground mt-2">
              {skillCount}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 block">
              Categorized skills
            </span>
          </div>

          <div className="minimal-card p-5">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
              Media Files
            </span>
            <div className="text-3xl font-bold tracking-tight text-foreground mt-2">
              {mediaCount}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 block">
              Tracked uploads
            </span>
          </div>

          <div className="minimal-card p-5">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
              Tracked Events
            </span>
            <div className="text-3xl font-bold tracking-tight text-foreground mt-2">
              {eventCount}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 block">
              Telemetry interactions
            </span>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Manage Portfolio Content &amp; System
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="minimal-card p-5 flex flex-col justify-between group hover:shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-md bg-muted text-foreground flex items-center justify-center text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground group-hover:underline">
                        {card.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-foreground mt-4 pt-3 border-t border-border/50">
                    <span>Configure Section</span>
                    <HiOutlineArrowRight className="text-xs" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
