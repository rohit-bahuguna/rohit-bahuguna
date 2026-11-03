import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import { HiOutlineArrowLeft, HiOutlineDownload, HiOutlineDocumentText } from "react-icons/hi";

export const dynamic = "force-dynamic";

export default async function ResumePage() {
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

  // Format embed URL if it's Google Drive or local /uploads/...
  let embedUrl = resumeUrl;
  if (resumeUrl.includes("drive.google.com") && resumeUrl.includes("/view")) {
    embedUrl = resumeUrl.replace("/view", "/preview");
  }

  // Sanitize embed URL to prevent javascript: or data: iframe protocol injection
  const isSafeProtocol = /^https?:\/\//i.test(embedUrl) || embedUrl.startsWith("/uploads/");
  const safeIframeSrc = isSafeProtocol ? embedUrl : "about:blank";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Minimal Navigation Bar */}
      <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="btn btn-outline text-xs h-9 px-3 gap-1.5"
            title="Return to portfolio homepage"
          >
            <HiOutlineArrowLeft className="text-sm" />
            <span>Back to Home</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            <HiOutlineDocumentText className="text-muted-foreground text-lg" />
            <span className="text-sm font-semibold tracking-tight">Rohit Bahuguna — Resume</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <a
            href="/api/resume/download"
            className="btn btn-primary text-xs h-9 px-4 gap-1.5 shadow-sm"
            title="Download resume as PDF file"
          >
            <HiOutlineDownload className="text-sm" />
            <span>Download PDF</span>
          </a>
        </div>
      </header>

      {/* Main Resume In-App Viewer Frame */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col">
        <div className="flex-1 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden min-h-[80vh] flex flex-col">
          <iframe
            src={safeIframeSrc}
            title="Rohit Bahuguna Resume"
            className="w-full flex-1 border-0 rounded-xl"
            style={{ minHeight: "85vh" }}
          />
        </div>
      </main>
    </div>
  );
}
