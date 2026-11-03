import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skills = await prisma.skill.findMany({
    where: { state: "draft" },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ skills });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, category, iconUrl, level, order } = body;

    if (!name || !category) {
      return NextResponse.json({ error: "Skill name and category are required" }, { status: 400 });
    }

    const parsedLevel = level !== undefined && level !== null ? parseInt(level, 10) : null;
    const parsedOrder = typeof order === "number" ? order : 0;

    if (id) {
      const updated = await prisma.skill.update({
        where: { id },
        data: {
          name,
          category,
          iconUrl: iconUrl || null,
          level: isNaN(parsedLevel as any) ? null : parsedLevel,
          order: parsedOrder,
        },
      });
      return NextResponse.json({ success: true, skill: updated });
    } else {
      const count = await prisma.skill.count({ where: { state: "draft" } });
      const created = await prisma.skill.create({
        data: {
          state: "draft",
          name,
          category,
          iconUrl: iconUrl || null,
          level: isNaN(parsedLevel as any) ? null : parsedLevel,
          order: typeof order === "number" ? order : count,
        },
      });
      return NextResponse.json({ success: true, skill: created });
    }
  } catch (err) {
    console.error("Skill save error:", err);
    return NextResponse.json({ error: "Failed to save skill" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    await prisma.skill.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Skill delete error:", err);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
