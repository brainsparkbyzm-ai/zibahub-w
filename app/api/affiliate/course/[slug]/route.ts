import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const course = await db.course.findFirst({ where: { slug, status: "PUBLISHED" } });
  const target = course?.affiliateUrl || course?.url;
  if (!target) return Response.json({ ok: false, error: { message: "No provider link is configured." } }, { status: 409 });
  return NextResponse.redirect(target.startsWith("http") ? target : new URL(target, request.url));
}
