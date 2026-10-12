import { jobSchema } from "@/validation/content";
import { updateEmployerJob } from "@/services/jobs";
import { requireRole } from "@/lib/session";
import { fail, ok, readBody } from "@/lib/http";
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(["EMPLOYER", "ADMIN"]);
    const { id } = await context.params;
    const parsed = jobSchema.safeParse(await readBody(request));
    if (!parsed.success) return Response.json({ ok: false, error: { message: parsed.error.issues[0]?.message || "Check the job." } }, { status: 400 });
    await updateEmployerJob(user.id, id, parsed.data);
    return ok(request, { message: "Job updated." }, `/employer/jobs/${id}/edit`);
  } catch (error) { return fail(error); }
}
