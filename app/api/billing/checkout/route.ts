import { requireRole } from "@/lib/session";
import { requestJobUpgrade } from "@/services/billing";
import { AppError } from "@/lib/errors";
import { fail, readBody } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const user = await requireRole(["EMPLOYER", "ADMIN"]);
    const body = await readBody(request);
    if (body.tier !== "FEATURED" && body.tier !== "PREMIUM") {
      throw new AppError(400, "invalid_tier", "Choose a valid job upgrade.");
    }
    const jobId = typeof body.jobId === "string" ? body.jobId.trim() : "";
    if (!jobId) throw new AppError(400, "invalid_job", "A job ID is required.");

    const result = await requestJobUpgrade(user.id, jobId, body.tier);
    if (!result.configured) {
      return Response.json({
        ok: true,
        message: "Payment provider is not configured. The request is pending manual review and has not been marked paid.",
      });
    }
    return Response.json({ ok: true, redirect: result.url, message: "Checkout created." });
  } catch (error) {
    return fail(error);
  }
}
