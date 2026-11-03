import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { recordEvent } from "@/lib/telemetry";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  // 1. Fetch live or draft hero config to find the configured resume URL
  let resumeUrl = "https://drive.google.com/file/d/1J0kPC3TBdtLQpOvORigxMQtoilkYzL4H/view?usp=sharing";

  try {
    const heroConfig = await prisma.siteConfig.findUnique({
      where: { key_state: { key: "hero", state: "live" } },
    });
    if (heroConfig?.data) {
      const parsed = JSON.parse(heroConfig.data);
      if (parsed?.ctaResume?.url && parsed.ctaResume.url !== "/resume") {
        resumeUrl = parsed.ctaResume.url;
      }
    }
  } catch (err) {
    console.error("Error reading hero resume URL:", err);
  }

  // 2. Record download telemetry
  await recordEvent({
    eventType: "resume_download",
    targetId: "hero_cta_resume",
    targetUrl: resumeUrl,
    requestHeaders: request.headers,
  });

  // 3. Serve the resume
  // Case A: Local uploaded file (e.g. /uploads/...)
  if (resumeUrl.startsWith("/uploads/")) {
    const safeUploadsDir = path.resolve(process.cwd(), "public", "uploads");
    const cleanRelative = resumeUrl.replace(/^\/+/, "");
    const resolvedPath = path.resolve(process.cwd(), "public", cleanRelative);

    // Strictly ensure resolved path resides inside public/uploads and exists
    if (resolvedPath.startsWith(safeUploadsDir) && fs.existsSync(resolvedPath)) {
      const fileBuffer = fs.readFileSync(resolvedPath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="Rohit_Bahuguna_Resume.pdf"',
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
    return NextResponse.json({ error: "Resume file not found" }, { status: 404 });
  }

  // Case B: External link (Google Drive, Dropbox, etc. with safe scheme)
  if (/^https?:\/\//i.test(resumeUrl)) {
    return NextResponse.redirect(resumeUrl, 302);
  }

  return NextResponse.redirect("https://drive.google.com/file/d/1J0kPC3TBdtLQpOvORigxMQtoilkYzL4H/view?usp=sharing", 302);
}
