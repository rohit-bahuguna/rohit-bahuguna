import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "portfolio_admin_session";

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
      throw new Error(
        "CRITICAL SECURITY ERROR: SESSION_SECRET is not configured in the production environment."
      );
    }
    return new TextEncoder().encode("local_dev_only_temporary_secret_key_not_for_prod_12345");
  }
  return new TextEncoder().encode(secret);
}

async function isValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const key = getSecretKey();
    await jwtVerify(token, key);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rawSecret = process.env.ADMIN_SECRET_PATH || "admin-vault";
  const secretPath = rawSecret.replace(/^\/+|\/+$/g, ""); // strip slashes: "admin-vault"

  // 1. Block direct requests to /admin with a strict 404 to avoid bot scanning
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 2. Check if request matches the obfuscated secret admin path
  const isSecretAdminRoute =
    pathname === `/${secretPath}` || pathname.startsWith(`/${secretPath}/`);

  if (isSecretAdminRoute) {
    const subPath = pathname.slice(secretPath.length + 1) || "/";
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const authenticated = await isValidToken(token);

    const isLoginPage = subPath === "/login";
    const isAuthApi = subPath.startsWith("/api/auth");

    // If unauthenticated and not on the login page or auth API, redirect to secret login
    if (!authenticated && !isLoginPage && !isAuthApi) {
      const loginUrl = new URL(`/${secretPath}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    // If already authenticated and trying to visit login page, redirect to secret dashboard
    if (authenticated && isLoginPage) {
      const dashUrl = new URL(`/${secretPath}/dashboard`, request.url);
      return NextResponse.redirect(dashUrl);
    }

    // Rewrite internally to /admin/... preserving the visible secret URL in the browser
    const rewriteDestination = subPath === "/" ? "/admin/dashboard" : `/admin${subPath}`;
    const rewriteUrl = new URL(rewriteDestination, request.url);
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-admin-secret-path", secretPath);

    return NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (Images, uploads, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|Images/|uploads/).*)",
  ],
};
