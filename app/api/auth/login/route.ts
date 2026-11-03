import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, setAdminSession } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers);
    // Rate limit: max 5 login attempts per 15 minutes per IP
    const rateCheck = checkRateLimit(`login:${clientIp}`, 5, 15 * 60 * 1000);
    if (!rateCheck.success) {
      const retryAfterSeconds = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfterSeconds.toString(),
          },
        }
      );
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = await verifyAdminCredentials(username, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    await setAdminSession(user);

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
