import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stagedKeys: string[] = [];

    // 1. Compare SiteConfig (header, hero, about, contact, footer, seo, etc.)
    const configs = await prisma.siteConfig.findMany();
    const byKey: Record<string, { draft?: string; live?: string }> = {};

    for (const c of configs) {
      if (!byKey[c.key]) byKey[c.key] = {};
      byKey[c.key][c.state as "draft" | "live"] = c.data;
    }

    for (const [k, v] of Object.entries(byKey)) {
      if (v.draft && v.live) {
        if (v.draft.trim() !== v.live.trim()) {
          stagedKeys.push(k);
        }
      } else if (v.draft && !v.live) {
        stagedKeys.push(k);
      }
    }

    // 2. Compare Projects
    const [draftProjects, liveProjects] = await Promise.all([
      prisma.project.findMany({ where: { state: "draft" }, orderBy: { order: "asc" } }),
      prisma.project.findMany({ where: { state: "live" }, orderBy: { order: "asc" } }),
    ]);

    const normalizeP = (list: typeof draftProjects) =>
      list.map((p) => ({
        title: p.title,
        desc: p.description,
        tags: p.tags,
        img: p.imageUrl,
        live: p.liveUrl,
        git: p.githubUrl,
        featured: p.featured,
        order: p.order,
      }));

    if (JSON.stringify(normalizeP(draftProjects)) !== JSON.stringify(normalizeP(liveProjects))) {
      stagedKeys.push("projects");
    }

    // 3. Compare Skills
    const [draftSkills, liveSkills] = await Promise.all([
      prisma.skill.findMany({ where: { state: "draft" }, orderBy: { order: "asc" } }),
      prisma.skill.findMany({ where: { state: "live" }, orderBy: { order: "asc" } }),
    ]);

    const normalizeS = (list: typeof draftSkills) =>
      list.map((s) => ({
        name: s.name,
        category: s.category,
        icon: s.iconUrl,
        level: s.level,
        order: s.order,
      }));

    if (JSON.stringify(normalizeS(draftSkills)) !== JSON.stringify(normalizeS(liveSkills))) {
      stagedKeys.push("skills");
    }

    return NextResponse.json({
      success: true,
      stagedKeys,
      hasStaged: stagedKeys.length > 0,
    });
  } catch (err) {
    console.error("Staged status check error:", err);
    return NextResponse.json({ error: "Failed to check staged status" }, { status: 500 });
  }
}
