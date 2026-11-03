import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { recordEvent } from "@/lib/telemetry";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
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

  // Record view telemetry
  await recordEvent({
    eventType: "resume_view",
    targetId: "hero_cta_resume",
    targetUrl: resumeUrl,
    requestHeaders: request.headers,
  });

  // 3. Serve local file or redirect safely
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
          "Content-Disposition": 'inline; filename="Rohit_Bahuguna_Resume.pdf"',
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
    // If not found or traversal attempted, fall back to safe default
    return NextResponse.json({ error: "Resume file not found" }, { status: 404 });
  }

  // Safe external redirect (enforce https:// or http:// only)
  if (/^https?:\/\//i.test(resumeUrl)) {
    return NextResponse.redirect(resumeUrl, 302);
  }

  return NextResponse.redirect("https://drive.google.com/file/d/1J0kPC3TBdtLQpOvORigxMQtoilkYzL4H/view?usp=sharing", 302);
}
