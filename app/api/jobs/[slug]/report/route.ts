import { reportJob } from "@/services/jobs";
import { getCurrentUser } from "@/lib/session";
import { reportSchema } from "@/validation/content";
import { fail, ok, readBody } from "@/lib/http";
export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const user = await getCurrentUser();
    const parsed = reportSchema.safeParse(await readBody(request));
    if (!parsed.success) return Response.json({ ok: false, error: { message: "Add a reason." } }, { status: 400 });
    await reportJob(user?.id || null, slug, parsed.data.reason, parsed.data.details);
    return ok(request, { message: "Report filed for moderation." }, `/jobs/${slug}`);
  } catch (error) { return fail(error); }
}
