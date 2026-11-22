import { AppError } from "@/lib/errors";
import { fail } from "@/lib/http";
import { importJoobleJobs } from "@/services/jooble";

export async function POST(request: Request) {
  try {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
      throw new AppError(503, "cron_not_configured", "CRON_SECRET is not configured.");
    }
    if (request.headers.get("authorization") !== `Bearer ${secret}`) {
      throw new AppError(401, "unauthorized", "Invalid cron secret.");
    }

    const dryRun = new URL(request.url).searchParams.get("dryRun") !== "false";
    const result = await importJoobleJobs({ dryRun });
    return Response.json({ ok: true, ...result });
  } catch (error) {
    return fail(error);
  }
}
