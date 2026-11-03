import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all"; // 'all', 'images', 'documents'

  const whereClause: {
    name?: { contains: string };
    mimeType?: { startsWith?: string; not?: { startsWith: string } };
  } = {};

  if (q.trim()) {
    whereClause.name = { contains: q.trim() };
  }

  if (type === "images") {
    whereClause.mimeType = { startsWith: "image/" };
  } else if (type === "documents") {
    whereClause.mimeType = { not: { startsWith: "image/" } };
  }

  const media = await prisma.media.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ media });
}
