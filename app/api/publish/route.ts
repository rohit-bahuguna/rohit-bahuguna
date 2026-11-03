import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { purgeCloudflareCache } from "@/lib/cloudflare";

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Promote SiteConfig drafts to live
    const draftConfigs = await prisma.siteConfig.findMany({
      where: { state: "draft" },
    });
    for (const cfg of draftConfigs) {
      await prisma.siteConfig.upsert({
        where: { key_state: { key: cfg.key, state: "live" } },
        update: { data: cfg.data },
        create: {
          key: cfg.key,
          state: "live",
          data: cfg.data,
        },
      });
    }

    // 2. Promote Projects drafts to live
    const draftProjects = await prisma.project.findMany({
      where: { state: "draft" },
    });
    await prisma.project.deleteMany({ where: { state: "live" } });
    for (const p of draftProjects) {
      await prisma.project.create({
        data: {
          title: p.title,
          description: p.description,
          tags: p.tags,
          imageUrl: p.imageUrl,
          liveUrl: p.liveUrl,
          githubUrl: p.githubUrl,
          featured: p.featured,
          order: p.order,
          state: "live",
        },
      });
    }

    // 3. Promote Skills drafts to live
    const draftSkills = await prisma.skill.findMany({
      where: { state: "draft" },
    });
    await prisma.skill.deleteMany({ where: { state: "live" } });
    for (const s of draftSkills) {
      await prisma.skill.create({
        data: {
          name: s.name,
          category: s.category,
          iconUrl: s.iconUrl,
          level: s.level,
          order: s.order,
          state: "live",
        },
      });
    }

    // 4. Invalidate local Next.js cache (On-Demand ISR)
    revalidatePath("/");
    revalidatePath("/resume");

    // 5. Purge Cloudflare Edge Cache worldwide
    const cfResult = await purgeCloudflareCache(["/", "/resume"]);

    return NextResponse.json({
      success: true,
      message: "Published all changes to Live and triggered ISR revalidation!",
      cloudflare: cfResult,
      publishedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Publish error:", err);
    return NextResponse.json({ error: "Failed to publish changes to live" }, { status: 500 });
  }
}
