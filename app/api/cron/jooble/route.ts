import { AppError } from "@/lib/errors";
import { fail } from "@/lib/http";
import { importJoobleJobs } from "@/services/jooble";

async function runJoobleImport(request: Request, defaultDryRun: boolean) {
  try {
    const secret = process.env.CRON_SECRET;
    if (!secret) throw new AppError(503, "cron_not_configured", "CRON_SECRET is not configured.");
    if (request.headers.get("authorization") !== `Bearer ${secret}`) {
      throw new AppError(401, "unauthorized", "Invalid cron secret.");
    }

    const dryRunParam = new URL(request.url).searchParams.get("dryRun");
    const dryRun = dryRunParam === null ? defaultDryRun : dryRunParam === "true";
    const result = await importJoobleJobs({ dryRun });
    return Response.json({ ok: true, ...result });
  } catch (error) {
    return fail(error);
  }
}

// Vercel Cron sends GET. GET defaults to a real import; add ?dryRun=true to preview.
export async function GET(request: Request) {
  return runJoobleImport(request, false);
}

// Manual POST stays dry-run by default to avoid accidental imports.
export async function POST(request: Request) {
  return runJoobleImport(request, true);
}
