import { profileSchema } from "@/validation/content";
import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { fail, ok, readBody } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const parsed = profileSchema.safeParse(await readBody(request));
    if (!parsed.success) return Response.json({ ok: false, error: { message: parsed.error.issues[0]?.message || "Check the profile." } }, { status: 400 });
    await db.user.update({ where: { id: user.id }, data: { ...parsed.data, phone: parsed.data.phone || null, headline: parsed.data.headline || null, bio: parsed.data.bio || null, country: parsed.data.country || null, region: parsed.data.region || null, city: parsed.data.city || null, tradeId: parsed.data.tradeId || null, resumeUrl: parsed.data.resumeUrl || null, skills: (parsed.data.skills || "").split(",").map((item) => item.trim()).filter(Boolean) } });
    return ok(request, { message: "Profile saved." }, "/dashboard/profile");
  } catch (error) { return fail(error); }
}
