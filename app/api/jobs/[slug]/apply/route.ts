import { applyToJob } from "@/services/jobs";
import { requireUser } from "@/lib/session";
import { fail, ok, readBody } from "@/lib/http";
export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const user = await requireUser();
    const body = await readBody(request);
    await applyToJob(user.id, slug, String(body.coverLetter || ""));
    return ok(request, { message: "Application submitted." }, "/dashboard/applications");
  } catch (error) { return fail(error); }
}
