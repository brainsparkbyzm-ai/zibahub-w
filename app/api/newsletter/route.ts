import { z } from "zod";
import { subscribeNewsletter } from "@/services/content";
import { hashToken } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";
import { fail, readBody } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
    await rateLimit(`newsletter:${hashToken(ip)}`, 10, 60 * 60 * 1000);

    const parsed = z.object({ email: z.string().email() }).safeParse(await readBody(request));
    if (!parsed.success) return Response.json({ ok: false, error: { message: "Enter a valid email." } }, { status: 400 });
    await subscribeNewsletter(parsed.data.email);
    return Response.json({ ok: true, message: "Saved." });
  } catch (error) {
    return fail(error);
  }
}
