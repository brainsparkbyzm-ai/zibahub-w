import { setEmployerJobStatus } from "@/services/jobs";
import { requireRole } from "@/lib/session";
import { fail, ok, readBody } from "@/lib/http";
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(["EMPLOYER", "ADMIN"]);
    const { id } = await context.params;
    const body = await readBody(request);
    const status = String(body.status || "");
    if (status !== "PAUSED" && status !== "CLOSED" && status !== "PENDING") return Response.json({ ok: false, error: { message: "Unsupported status." } }, { status: 400 });
    await setEmployerJobStatus(user.id, id, status);
    return ok(request, { message: "Status updated." }, "/employer/jobs");
  } catch (error) { return fail(error); }
}
