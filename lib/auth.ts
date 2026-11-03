import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

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

export interface AdminSession {
  userId: string;
  username: string;
}

export async function createSessionToken(payload: AdminSession): Promise<string> {
  const key = getSecretKey();
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key);
    return {
      userId: payload.userId as string,
      username: payload.username as string,
    };
  } catch {
    return null;
  }
}

export async function setAdminSession(user: { id: string; username: string }) {
  const token = await createSessionToken({ userId: user.id, username: user.username });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Constant dummy hash to eliminate timing side-channel attacks on nonexistent usernames
const DUMMY_BCRYPT_HASH = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export async function verifyAdminCredentials(username: string, password: string) {
  const admin = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (!admin) {
    // Constant-time execution to prevent username harvesting via response latency
    await bcrypt.compare(password, DUMMY_BCRYPT_HASH);
    return null;
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return null;

  return { id: admin.id, username: admin.username };
}
