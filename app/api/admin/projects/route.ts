import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { state: "draft" },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, description, tags, imageUrl, liveUrl, githubUrl, featured, order } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const tagsJson = typeof tags === "string" ? tags : JSON.stringify(tags || []);

    if (id) {
      // Update existing draft project
      const updated = await prisma.project.update({
        where: { id },
        data: {
          title,
          description,
          tags: tagsJson,
          imageUrl: imageUrl || null,
          liveUrl: liveUrl || null,
          githubUrl: githubUrl || null,
          featured: Boolean(featured),
          order: typeof order === "number" ? order : 0,
        },
      });
      return NextResponse.json({ success: true, project: updated });
    } else {
      // Create new draft project
      const count = await prisma.project.count({ where: { state: "draft" } });
      const created = await prisma.project.create({
        data: {
          state: "draft",
          title,
          description,
          tags: tagsJson,
          imageUrl: imageUrl || null,
          liveUrl: liveUrl || null,
          githubUrl: githubUrl || null,
          featured: Boolean(featured),
          order: typeof order === "number" ? order : count,
        },
      });
      return NextResponse.json({ success: true, project: created });
    }
  } catch (err) {
    console.error("Project save error:", err);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
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
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Project delete error:", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
