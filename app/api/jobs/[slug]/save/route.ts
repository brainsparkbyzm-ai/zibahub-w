import { toggleSave } from "@/services/jobs";
import { requireUser } from "@/lib/session";
import { fail, ok, readBody } from "@/lib/http";
export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const user = await requireUser();
    await readBody(request).catch(() => ({}));
    const result = await toggleSave(user.id, slug);
    return ok(request, { message: result.saved ? "Saved." : "Removed.", saved: result.saved }, `/jobs/${slug}`);
  } catch (error) { return fail(error); }
}
