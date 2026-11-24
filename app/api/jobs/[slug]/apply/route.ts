import { applyToJob } from "@/services/jobs";
import { requireUser } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { fail, ok, readBody } from "@/lib/http";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const user = await requireUser();
    await rateLimit(`job-apply:${user.id}`, 10, 60 * 60 * 1000);
    const body = await readBody(request);
    await applyToJob(user.id, slug, String(body.coverLetter || ""));
    return ok(request, { message: "Application submitted." }, "/dashboard/applications");
  } catch (error) {
    return fail(error);
  }
}
