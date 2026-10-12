import { NextResponse } from "next/server";
import { recordAffiliateClick } from "@/services/content";
import { getCurrentUser } from "@/lib/session";
export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const user = await getCurrentUser().catch(() => null);
  const url = await recordAffiliateClick(slug, user?.id);
  return NextResponse.redirect(url);
}
