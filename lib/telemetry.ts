import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export interface TelemetryContext {
  ipAddress: string | null;
  country: string | null;
  city: string | null;
  browser: string | null;
  os: string | null;
  deviceType: string | null;
  referrer: string | null;
  isBot: boolean;
  clientType: "human" | "bot" | "crawler";
  userAgent: string;
}

export function parseTelemetry(headerList: Headers): TelemetryContext {
  // 1. IP extraction (prioritizing Cloudflare headers)
  const cfIp = headerList.get("cf-connecting-ip");
  const xForwarded = headerList.get("x-forwarded-for");
  const xReal = headerList.get("x-real-ip");
  const ipAddress = cfIp || (xForwarded ? xForwarded.split(",")[0].trim() : xReal) || null;

  // 2. Geolocation from Cloudflare
  const country = headerList.get("cf-ipcountry") || null;
  const city = headerList.get("cf-ipcity") || null;

  // 3. User Agent & Referrer
  const userAgent = headerList.get("user-agent") || "";
  const referrer = headerList.get("referer") || null;

  // 4. Bot detection
  const botPattern =
    /(googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver|twitterbot|facebookexternalhit|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator|wget|curl|python|urllib|postman|insomnia|headless|phantom|puppeteer|lighthouse|bot|crawler|spider)/i;
  const isBot = botPattern.test(userAgent) || !userAgent;
  const clientType = isBot ? "bot" : "human";

  // 5. Basic OS detection
  let os: string | null = null;
  if (/windows/i.test(userAgent)) os = "Windows";
  else if (/android/i.test(userAgent)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(userAgent)) os = "iOS";
  else if (/macintosh|mac os x/i.test(userAgent)) os = "macOS";
  else if (/linux/i.test(userAgent)) os = "Linux";

  // 6. Basic Browser detection
  let browser: string | null = null;
  if (/edg/i.test(userAgent)) browser = "Edge";
  else if (/chrome|crios/i.test(userAgent)) browser = "Chrome";
  else if (/firefox|fxios/i.test(userAgent)) browser = "Firefox";
  else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = "Safari";
  else if (/opera|opr/i.test(userAgent)) browser = "Opera";
  else if (isBot) browser = "Bot Crawler";

  // 7. Device type
  let deviceType: string = "desktop";
  if (/tablet|ipad/i.test(userAgent)) deviceType = "tablet";
  else if (/mobile|iphone|android/i.test(userAgent)) deviceType = "mobile";

  return {
    ipAddress,
    country,
    city,
    browser,
    os,
    deviceType,
    referrer,
    isBot,
    clientType,
    userAgent,
  };
}

export async function recordEvent(data: {
  eventType: string;
  targetId?: string | null;
  targetUrl?: string | null;
  requestHeaders?: Headers;
}) {
  try {
    const headerList = data.requestHeaders || (await headers());
    const telemetry = parseTelemetry(headerList);

    return await prisma.analyticsEvent.create({
      data: {
        eventType: data.eventType,
        targetId: data.targetId || null,
        targetUrl: data.targetUrl || null,
        ipAddress: telemetry.ipAddress,
        country: telemetry.country,
        city: telemetry.city,
        browser: telemetry.browser,
        os: telemetry.os,
        deviceType: telemetry.deviceType,
        referrer: telemetry.referrer,
        isBot: telemetry.isBot,
        clientType: telemetry.clientType,
      },
    });
  } catch (error) {
    console.error("Telemetry recording error:", error);
    return null;
  }
}
