import { guestPostSchema } from "@/validation/content";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { fail, readBody } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const body = await readBody(request);
    const parsed = guestPostSchema.safeParse({ ...body, sponsored: body.sponsored === "true" || body.sponsored === true });
    if (!parsed.success) return Response.json({ ok: false, error: { message: parsed.error.issues[0]?.message || "Check the submission." } }, { status: 400 });
    const user = await getCurrentUser();
    await db.guestPost.create({ data: { ...parsed.data, website: parsed.data.website || null, requestedDate: parsed.data.requestedDate ? new Date(parsed.data.requestedDate) : null, sponsored: Boolean(parsed.data.sponsored), submitterId: user?.id || null, status: "SUBMITTED" } });
    return Response.json({ ok: true, message: "Submitted for review. It will not publish automatically." });
  } catch (error) { return fail(error); }
}
