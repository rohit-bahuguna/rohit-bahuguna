import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum size limit of 25MB" },
        { status: 400 }
      );
    }

    const originalName = file.name || "unnamed";
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename & validate extensions
    const ext = path.extname(originalName).toLowerCase();
    
    // Strict extension and MIME type allowlist to prevent Stored XSS / arbitrary uploads
    const ALLOWED_EXTENSIONS = new Set([
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
      ".gif",
      ".ico",
      ".pdf",
      ".svg",
    ]);

    const ALLOWED_MIME_TYPES = new Set([
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
      "image/x-icon",
      "image/vnd.microsoft.icon",
      "application/pdf",
      "image/svg+xml",
      "application/octet-stream", // fallback from some clients
    ]);

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `Disallowed file extension '${ext}'. Permitted: PNG, JPG, WEBP, GIF, ICO, PDF, SVG.` },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: `Disallowed MIME type '${file.type}'.` },
        { status: 400 }
      );
    }

    // If SVG, perform deep active-content sanitization check
    if (ext === ".svg") {
      const svgText = buffer.toString("utf-8");
      if (/<script|javascript:|onload|onerror|onclick|onmouseover|<foreignObject/i.test(svgText)) {
        return NextResponse.json(
          { error: "SVG contains disallowed active scripts or event handlers." },
          { status: 400 }
        );
      }
    }

    const baseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);

    const uniqueFileName = `${Date.now()}-${baseName}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });
    const diskPath = path.join(uploadDir, uniqueFileName);
    await writeFile(diskPath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;

    const mediaRecord = await prisma.media.create({
      data: {
        name: originalName,
        fileName: uniqueFileName,
        url: publicUrl,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
      },
    });

    return NextResponse.json({
      success: true,
      media: mediaRecord,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload and store file" },
      { status: 500 }
    );
  }
}
