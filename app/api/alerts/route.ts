import { alertSchema } from "@/validation/content";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { fail, ok, readBody } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const parsed = alertSchema.safeParse(await readBody(request));
    if (!parsed.success) return Response.json({ ok: false, error: { message: parsed.error.issues[0]?.message || "Check the alert." } }, { status: 400 });
    await db.jobAlert.create({ data: { userId: user.id, name: parsed.data.name, frequency: parsed.data.frequency, filters: { keywords: parsed.data.keywords || "", country: parsed.data.country || "", tradeId: parsed.data.tradeId || "", salaryMin: parsed.data.salaryMin || undefined } } });
    return ok(request, { message: "Alert saved." }, "/jobs/alerts");
  } catch (error) { return fail(error); }
}
