import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  void request;
  const { slug } = await context.params;
  const course = await db.course.findFirst({ where: { slug, status: "PUBLISHED" } });
  const target = course?.affiliateUrl || course?.url;
  if (!target) return Response.json({ ok: false, error: { message: "No provider link is configured." } }, { status: 409 });

  let destination: URL;
  try {
    destination = new URL(target);
  } catch {
    return Response.json({ ok: false, error: { message: "The provider link is invalid." } }, { status: 409 });
  }
  if (destination.protocol !== "https:") {
    return Response.json({ ok: false, error: { message: "The provider link must use HTTPS." } }, { status: 409 });
  }
  return NextResponse.redirect(destination);
}
