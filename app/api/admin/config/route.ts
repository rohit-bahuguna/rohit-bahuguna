import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = request.nextUrl.searchParams.get("key");
  const state = request.nextUrl.searchParams.get("state") || "draft";

  if (key) {
    const config = await prisma.siteConfig.findUnique({
      where: { key_state: { key, state } },
    });
    if (!config) {
      return NextResponse.json({ data: null });
    }
    try {
      return NextResponse.json({ data: JSON.parse(config.data) });
    } catch {
      return NextResponse.json({ data: config.data });
    }
  }

  const configs = await prisma.siteConfig.findMany({
    where: { state },
  });

  const configMap: Record<string, any> = {};
  for (const cfg of configs) {
    try {
      configMap[cfg.key] = JSON.parse(cfg.data);
    } catch {
      configMap[cfg.key] = cfg.data;
    }
  }

  return NextResponse.json({ configs: configMap });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { key, data } = await request.json();
    if (!key || data === undefined) {
      return NextResponse.json({ error: "Key and data are required" }, { status: 400 });
    }

    const jsonString = typeof data === "string" ? data : JSON.stringify(data);

    // Save strictly to draft state
    const updated = await prisma.siteConfig.upsert({
      where: { key_state: { key, state: "draft" } },
      update: { data: jsonString },
      create: {
        key,
        state: "draft",
        data: jsonString,
      },
    });

    return NextResponse.json({ success: true, config: updated });
  } catch (err) {
    console.error("Config save error:", err);
    return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 });
  }
}
