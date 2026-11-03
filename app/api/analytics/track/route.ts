import { NextRequest, NextResponse } from "next/server";
import { recordEvent } from "@/lib/telemetry";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const ALLOWED_EVENT_TYPES = new Set([
  "click",
  "page_view",
  "resume_view",
  "resume_download",
  "project_click",
  "social_click",
  "nav_click",
  "theme_toggle",
]);

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers);
    // Rate limit: max 30 telemetry events per minute per IP
    const rateCheck = checkRateLimit(`telemetry:${clientIp}`, 30, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateCheck.resetAt - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const body = await request.json();
    let { eventType = "click" } = body;
    const { targetId, targetUrl } = body;

    // Strict input validation & bounding
    if (typeof eventType !== "string" || !ALLOWED_EVENT_TYPES.has(eventType)) {
      eventType = "click";
    }

    const cleanTargetId =
      typeof targetId === "string" ? targetId.slice(0, 100) : null;
    const cleanTargetUrl =
      typeof targetUrl === "string" ? targetUrl.slice(0, 500) : null;

    const event = await recordEvent({
      eventType,
      targetId: cleanTargetId,
      targetUrl: cleanTargetUrl,
      requestHeaders: request.headers,
    });

    return NextResponse.json({ success: true, eventId: event?.id });
  } catch (error) {
    console.error("Tracking endpoint error:", error);
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
  }
}
