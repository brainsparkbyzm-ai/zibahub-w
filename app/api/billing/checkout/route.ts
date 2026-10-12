import { requireRole } from "@/lib/session";
import { requestJobUpgrade } from "@/services/billing";
import { fail, readBody } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const user = await requireRole(["EMPLOYER", "ADMIN"]);
    const body = await readBody(request);
    const tier = body.tier === "PREMIUM" ? "PREMIUM" : "FEATURED";
    const result = await requestJobUpgrade(user.id, String(body.jobId || ""), tier);
    if (!result.configured) return Response.json({ ok: true, message: "Payment provider is not configured. The request is pending manual review and has not been marked paid." });
    return Response.json({ ok: true, redirect: result.url || "/employer/billing", message: "Checkout created." });
  } catch (error) { return fail(error); }
}
