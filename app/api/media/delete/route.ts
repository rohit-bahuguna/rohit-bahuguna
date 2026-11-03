import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkMediaReferences } from "@/lib/media-guard";
import { unlink } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, force } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Media ID required" }, { status: 400 });
    }

    const media = await prisma.media.findUnique({
      where: { id },
    });
    if (!media) {
      return NextResponse.json({ error: "Media record not found" }, { status: 404 });
    }

    // Reference Guard check
    const references = await checkMediaReferences(media.url);
    if (references.length > 0 && !force) {
      return NextResponse.json({
        blocked: true,
        references,
        message: `This asset is actively used in ${references.length} place(s). Deleting it will cause broken links or missing images.`,
      });
    }

    // Safe disk deletion strictly confined to public/uploads
    if (media.url.startsWith("/uploads/")) {
      const safeUploadsDir = path.resolve(process.cwd(), "public", "uploads");
      const cleanFileName = path.basename(media.fileName);
      const diskPath = path.resolve(safeUploadsDir, cleanFileName);

      if (diskPath.startsWith(safeUploadsDir)) {
        try {
          await unlink(diskPath);
        } catch (err: unknown) {
          const error = err as { code?: string };
          if (error.code !== "ENOENT") {
            console.warn("Could not delete file from disk:", diskPath, err);
          }
        }
      }
    }

    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Failed to delete media asset" }, { status: 500 });
  }
}
