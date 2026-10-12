import { companySchema } from "@/validation/content";
import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { uniqueSlug } from "@/lib/format";
import { fail, ok, readBody } from "@/lib/http";
import { AppError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const user = await requireRole(["EMPLOYER", "ADMIN"]);
    const body = await readBody(request);
    const parsed = companySchema.safeParse(body);
    if (!parsed.success) return Response.json({ ok: false, error: { message: parsed.error.issues[0]?.message || "Check the company." } }, { status: 400 });
    const logoUrl = String(body.logoUrl || "");
    if (logoUrl && !logoUrl.startsWith("https://")) throw new AppError(400, "logo", "Logo must be an https URL.");
    const data = { name: parsed.data.name, website: parsed.data.website || null, description: parsed.data.description || null, country: parsed.data.country || null, region: parsed.data.region || null, city: parsed.data.city || null, size: parsed.data.size || null, logoUrl: logoUrl || null };
    const existing = await db.company.findUnique({ where: { ownerId: user.id } });
    if (existing) await db.company.update({ where: { id: existing.id }, data });
    else await db.company.create({ data: { ...data, ownerId: user.id, slug: uniqueSlug(parsed.data.name), status: "PENDING" } });
    return ok(request, { message: "Company saved. Publishing still requires admin approval." }, "/employer/profile");
  } catch (error) { return fail(error); }
}
