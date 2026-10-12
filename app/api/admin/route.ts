import { requireRole } from "@/lib/session";
import { fail, ok, readBody } from "@/lib/http";
import { AppError } from "@/lib/errors";
import { adminVerifyEmail, deleteEntity, saveSetting, setContentStatus, setGuestStatus, setJobModeration, setReportStatus, setUserRole, upsertGuide, upsertProduct, upsertTrade } from "@/services/admin";
import { markPayment } from "@/services/billing";
import { db } from "@/lib/db";
import { notify } from "@/lib/notifications";
import { uniqueSlug } from "@/lib/format";
import type { ContentStatus, GuestPostStatus, JobStatus, ReportStatus, Role } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const actor = await requireRole(["ADMIN"]);
    const body = await readBody(request);
    const action = String(body.action || "status");
    const entity = String(body.entity || "");
    const id = String(body.id || "");
    const status = String(body.status || "");

    if (action === "trade") {
      await upsertTrade(actor.id, { name: String(body.name || ""), summary: String(body.summary || ""), description: String(body.description || "") });
      return ok(request, { message: "Trade saved." }, "/admin/trades");
    }
    if (action === "guide") {
      await upsertGuide(actor.id, { title: String(body.title || ""), excerpt: String(body.excerpt || ""), content: String(body.content || ""), category: String(body.category || "Career Guides"), seoTitle: String(body.seoTitle || ""), seoDescription: String(body.seoDescription || "") });
      return ok(request, { message: "Guide saved as draft." }, "/admin/guides");
    }
    if (action === "product") {
      await upsertProduct(actor.id, { name: String(body.name || ""), description: String(body.description || ""), category: String(body.category || "Tools"), brand: String(body.brand || ""), priceDisplay: String(body.priceDisplay || ""), affiliateUrl: String(body.affiliateUrl || "") });
      return ok(request, { message: "Product saved as draft. It is not public until published." }, "/admin/products");
    }
    if (action === "category") {
      const name = String(body.name || "");
      await db.category.create({ data: { type: String(body.type || "general"), name, slug: uniqueSlug(name) } });
      return ok(request, { message: "Category added." }, "/admin/categories");
    }
    if (action === "apprenticeship") {
      const title = String(body.title || "");
      await db.apprenticeship.create({ data: { title, slug: uniqueSlug(title), providerName: String(body.providerName || ""), country: String(body.country || "United States"), description: String(body.description || ""), status: "PENDING" } });
      return ok(request, { message: "Apprenticeship added as pending." }, "/admin/apprenticeships");
    }
    if (action === "course") {
      const title = String(body.title || "");
      await db.course.create({ data: { title, slug: uniqueSlug(title), description: String(body.description || ""), delivery: String(body.delivery || "Online"), status: "DRAFT" } });
      return ok(request, { message: "Course saved as draft." }, "/admin/courses");
    }
    if (action === "ad") {
      await db.advertisement.create({ data: { name: String(body.name || "Ad"), placement: String(body.placement || "homepage"), targetUrl: String(body.targetUrl || "") || null, status: "DRAFT" } });
      return ok(request, { message: "Ad saved as draft." }, "/admin/ads");
    }
    if (action === "notify") {
      const user = await db.user.findUnique({ where: { email: String(body.email || "").toLowerCase() } });
      if (!user) throw new AppError(404, "not_found", "No user with that email.");
      await notify({ userId: user.id, type: "ADMIN", title: String(body.title || "Message"), body: String(body.body || ""), href: "/dashboard/notifications" });
      return ok(request, { message: "Notification sent." }, "/admin/notifications");
    }
    if (action === "pricing") {
      await saveSetting(actor.id, "job_pricing", { currency: String(body.currency || "USD"), FREE: 0, FEATURED: Number(body.FEATURED || 0), PREMIUM: Number(body.PREMIUM || 0) });
      return ok(request, { message: "Pricing saved." }, "/admin/settings");
    }
    if (action === "setting") {
      await saveSetting(actor.id, String(body.key || "seo"), { description: String(body.description || "") });
      return ok(request, { message: "Setting saved." }, "/admin/seo");
    }
    if (action === "delete") {
      await deleteEntity(actor.id, entity, id);
      return ok(request, { message: "Deleted." });
    }
    if (entity === "user") {
      if (status === "VERIFY") await adminVerifyEmail(actor.id, id);
      else if (status === "ACTIVE" || status === "SUSPENDED") {
        const current = await db.user.findUnique({ where: { id } });
        if (!current) throw new AppError(404, "not_found", "User not found.");
        await setUserRole(actor.id, id, current.role, status);
      } else if (status === "USER" || status === "EMPLOYER" || status === "ADMIN") await setUserRole(actor.id, id, status as Role);
      else throw new AppError(400, "bad_status", "Unsupported user action.");
      return ok(request, { message: "User updated." });
    }
    if (entity === "job") {
      await setJobModeration(actor.id, id, status as JobStatus);
      return ok(request, { message: "Job updated." });
    }
    if (entity === "guest") {
      await setGuestStatus(actor.id, id, status as GuestPostStatus);
      return ok(request, { message: status === "PUBLISHED" ? "Published as a labeled article." : "Submission updated." });
    }
    if (entity === "report") {
      await setReportStatus(actor.id, id, status as ReportStatus);
      return ok(request, { message: "Report updated." });
    }
    if (entity === "payment") {
      if (status !== "SUCCEEDED" && status !== "FAILED" && status !== "CANCELED") throw new AppError(400, "bad_status", "Unsupported payment status.");
      await markPayment(actor.id, id, status);
      return ok(request, { message: "Payment updated and recorded in the audit log." });
    }
    const contentMap = { company: "company", trade: "trade", course: "course", guide: "guide", article: "article", product: "product", ad: "ad", apprenticeship: "apprenticeship", provider: "provider", certification: "certification", category: "category" } as const;
    if (entity in contentMap && entity !== "category") {
      await setContentStatus(actor.id, contentMap[entity as keyof typeof contentMap] as "company", id, status as ContentStatus);
      return ok(request, { message: "Status updated." });
    }
    if (entity === "category") {
      await db.category.update({ where: { id }, data: { status: status as ContentStatus } });
      return ok(request, { message: "Category updated." });
    }
    throw new AppError(400, "unsupported", "That admin action is not available.");
  } catch (error) { return fail(error); }
}
