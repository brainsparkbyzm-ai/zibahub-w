import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { hashToken, randomToken } from "@/lib/password";
import type { Role, SessionClaims } from "@/types/domain";

export const SESSION_COOKIE = "zibahub_session";
const WEEK = 60 * 60 * 24 * 7;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new AppError(503, "auth_not_configured", "AUTH_SECRET must be at least 32 characters.");
  }
  return new TextEncoder().encode(value);
}

export async function createSession(user: { id: string; email: string; name: string; role: Role }, meta?: { userAgent?: string | null; ip?: string | null }) {
  const raw = randomToken();
  const expiresAt = new Date(Date.now() + WEEK * 1000);
  const session = await db.session.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(raw),
      expiresAt,
      userAgent: meta?.userAgent || null,
      ip: meta?.ip || null,
    },
  });
  const token = await new SignJWT({ sid: session.id, role: user.role, email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${WEEK}s`)
    .sign(secret());
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return token;
}

export async function readClaims(): Promise<SessionClaims | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || typeof payload.sid !== "string" || typeof payload.role !== "string") return null;
    return {
      sub: payload.sub,
      sid: payload.sid,
      role: payload.role as Role,
      email: String(payload.email || ""),
      name: String(payload.name || ""),
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const claims = await readClaims();
  if (!claims) return null;
  const session = await db.session.findUnique({
    where: { id: claims.sid },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date() || session.user.status !== "ACTIVE") return null;
  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new AppError(401, "unauthenticated", "Sign in to continue.");
  return user;
}

export async function requireRole(roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new AppError(403, "forbidden", "You do not have access to this area.");
  return user;
}

export async function clearSession() {
  const claims = await readClaims();
  if (claims) {
    await db.session.deleteMany({ where: { id: claims.sid } }).catch(() => undefined);
  }
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
