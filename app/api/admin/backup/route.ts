import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let dbPath = path.join(/* turbopackIgnore: true */ process.cwd(), "prisma", "portfolio.db");
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl && dbUrl.startsWith("file:")) {
      const stripped = dbUrl.replace(/^file:/, "");
      dbPath = path.isAbsolute(stripped)
        ? stripped
        : path.resolve(/* turbopackIgnore: true */ process.cwd(), stripped);
    }

    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: "Database file not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(dbPath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `portfolio-backup-${timestamp}.db`;

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/x-sqlite3",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache",
      },
    });
  } catch (error) {
    console.error("Backup download error:", error);
    return NextResponse.json({ error: "Failed to download backup" }, { status: 500 });
  }
}
