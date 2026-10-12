import { NextResponse } from "next/server";
import { AppError, jsonError } from "@/lib/errors";

export async function readBody(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) throw new AppError(403, "csrf", "This request was rejected.");
  if (new URL(origin).host !== host) throw new AppError(403, "csrf", "This request was rejected.");
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return request.json() as Promise<Record<string, unknown>>;
  const form = await request.formData();
  return Object.fromEntries(form.entries()) as Record<string, unknown>;
}

export function ok(request: Request, data: Record<string, unknown> = {}, redirectTo?: string) {
  const type = request.headers.get("content-type") || "";
  if (!type.includes("application/json") && redirectTo) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }
  return Response.json({ ok: true, redirect: redirectTo, ...data });
}

export function fail(error: unknown) {
  return jsonError(error);
}
