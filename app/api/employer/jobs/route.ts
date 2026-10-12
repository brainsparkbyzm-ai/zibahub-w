import { jobSchema } from "@/validation/content";
import { createEmployerJob } from "@/services/jobs";
import { requireRole } from "@/lib/session";
import { fail, ok, readBody } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const user = await requireRole(["EMPLOYER", "ADMIN"]);
    const parsed = jobSchema.safeParse(await readBody(request));
    if (!parsed.success) return Response.json({ ok: false, error: { message: parsed.error.issues[0]?.message || "Check the job." } }, { status: 400 });
    const job = await createEmployerJob(user.id, parsed.data);
    return ok(request, { message: "Job submitted for review." }, `/employer/jobs/${job.id}/edit`);
  } catch (error) { return fail(error); }
}
