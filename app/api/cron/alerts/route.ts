import { runDigest } from "@/services/alerts";
import { AppError } from "@/lib/errors";
import { fail } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const secret = process.env.CRON_SECRET;
    if (!secret) throw new AppError(503, "cron_not_configured", "CRON_SECRET is not configured.");
    if (request.headers.get("authorization") !== `Bearer ${secret}`) throw new AppError(401, "unauthorized", "Invalid cron secret.");
    const frequency = new URL(request.url).searchParams.get("frequency") === "WEEKLY" ? "WEEKLY" : "DAILY";
    const result = await runDigest(frequency);
    return Response.json({ ok: true, ...result, emailConfigured: result.email.configured });
  } catch (error) { return fail(error); }
}
