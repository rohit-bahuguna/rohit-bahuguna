import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const timeRange = searchParams.get("timeRange") || "all";
  const botFilter = searchParams.get("botFilter") || "humans_only";

  // Date filtering
  const whereClause: any = {};

  if (botFilter === "humans_only") {
    whereClause.isBot = false;
  }

  const now = new Date();
  if (timeRange === "today") {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    whereClause.createdAt = { gte: startOfDay };
  } else if (timeRange === "7d") {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    whereClause.createdAt = { gte: sevenDaysAgo };
  } else if (timeRange === "30d") {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    whereClause.createdAt = { gte: thirtyDaysAgo };
  }

  try {
    // 1. Metric counts
    const [totalEvents, resumeDownloads, resumeViews, projectClicks, botCount] = await Promise.all([
      prisma.analyticsEvent.count({ where: whereClause }),
      prisma.analyticsEvent.count({ where: { ...whereClause, eventType: "resume_download" } }),
      prisma.analyticsEvent.count({ where: { ...whereClause, eventType: "resume_view" } }),
      prisma.analyticsEvent.count({ where: { ...whereClause, eventType: "project_click" } }),
      prisma.analyticsEvent.count({ where: { isBot: true } }),
    ]);

    // 2. Recent events list (last 50)
    const recentEvents = await prisma.analyticsEvent.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // 3. Country breakdown
    const countryStats = await prisma.analyticsEvent.groupBy({
      by: ["country"],
      where: whereClause,
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 10,
    });

    // 4. Device breakdown
    const deviceStats = await prisma.analyticsEvent.groupBy({
      by: ["deviceType"],
      where: whereClause,
      _count: { deviceType: true },
    });

    return NextResponse.json({
      metrics: {
        totalEvents,
        resumeDownloads,
        resumeViews,
        projectClicks,
        botCount,
      },
      recentEvents,
      countryStats: countryStats.map((c) => ({
        country: c.country || "Unknown",
        count: c._count.country,
      })),
      deviceStats: deviceStats.map((d) => ({
        device: d.deviceType || "desktop",
        count: d._count.deviceType,
      })),
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
