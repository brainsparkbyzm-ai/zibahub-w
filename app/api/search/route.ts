import { globalSearch } from "@/services/content";
import { hashToken } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";
import { fail } from "@/lib/http";

export async function GET(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
    await rateLimit(`search:${hashToken(ip)}`, 40, 60 * 1000);

    const q = (new URL(request.url).searchParams.get("q") || "").trim().slice(0, 100);
    return Response.json({ ok: true, data: await globalSearch(q) });
  } catch (error) {
    return fail(error);
  }
}
