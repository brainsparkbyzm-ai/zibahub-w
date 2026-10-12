import { jwtVerify } from "jose";
import type { Role, SessionClaims } from "@/types/domain";

export const SESSION_COOKIE = "zibahub_session";

export async function verifySessionToken(token: string | undefined): Promise<SessionClaims | null> {
  const value = process.env.AUTH_SECRET;
  if (!token || !value || value.length < 32) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(value));
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
