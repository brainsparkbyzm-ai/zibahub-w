import { db } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { audit } from "@/lib/audit";
import { publishJob } from "@/services/jobs";
import { uniqueSlug } from "@/lib/format";
import type { ContentStatus, GuestPostStatus, JobStatus, ReportStatus, Role } from "@prisma/client";

export async function setUserRole(actorId: string, userId: string, role: Role, status?: "ACTIVE" | "SUSPENDED") {
  if (actorId === userId && role !== "ADMIN") throw new AppError(400, "self_demote", "You cannot remove your own admin access.");
  const user = await db.user.update({ where: { id: userId }, data: { role, ...(status ? { status } : {}) } });
  await audit(actorId, "admin.user_update", "User", user.id, { role, status });
  return user;
}

export async function adminVerifyEmail(actorId: string, userId: string) {
  await db.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() } });
  await audit(actorId, "admin.verify_email", "User", userId);
}

export async function setJobModeration(actorId: string, jobId: string, status: JobStatus) {
  if (status === "ACTIVE") return publishJob(actorId, jobId);
  const job = await db.job.update({ where: { id: jobId }, data: { status } });
  await audit(actorId, "admin.job_status", "Job", jobId, { status });
  return job;
}

export async function setContentStatus(actorId: string, entity: "company" | "trade" | "course" | "guide" | "article" | "product" | "ad" | "apprenticeship" | "provider" | "certification", id: string, status: ContentStatus) {
  const publishedAt = status === "PUBLISHED" ? new Date() : undefined;
  if (entity === "company") await db.company.update({ where: { id }, data: { status } });
  if (entity === "trade") await db.trade.update({ where: { id }, data: { status } });
  if (entity === "course") await db.course.update({ where: { id }, data: { status } });
  if (entity === "guide") await db.guide.update({ where: { id }, data: { status, ...(publishedAt ? { publishedAt } : {}) } });
  if (entity === "article") await db.article.update({ where: { id }, data: { status, ...(publishedAt ? { publishedAt } : {}) } });
  if (entity === "product") await db.affiliateProduct.update({ where: { id }, data: { status } });
  if (entity === "ad") await db.advertisement.update({ where: { id }, data: { status } });
  if (entity === "apprenticeship") await db.apprenticeship.update({ where: { id }, data: { status } });
  if (entity === "provider") await db.trainingProvider.update({ where: { id }, data: { status } });
  if (entity === "certification") await db.certification.update({ where: { id }, data: { status } });
  await audit(actorId, "admin.status", entity, id, { status });
}

export async function deleteEntity(actorId: string, entity: string, id: string) {
  const map = {
    trade: () => db.trade.delete({ where: { id } }),
    category: () => db.category.delete({ where: { id } }),
    guide: () => db.guide.delete({ where: { id } }),
    article: () => db.article.delete({ where: { id } }),
    product: () => db.affiliateProduct.delete({ where: { id } }),
    ad: () => db.advertisement.delete({ where: { id } }),
    apprenticeship: () => db.apprenticeship.delete({ where: { id } }),
    course: () => db.course.delete({ where: { id } }),
    provider: () => db.trainingProvider.delete({ where: { id } }),
    certification: () => db.certification.delete({ where: { id } }),
    notification: () => db.notification.delete({ where: { id } }),
  } as const;
  if (!(entity in map)) throw new AppError(400, "unsupported", "This record cannot be deleted here.");
  await map[entity as keyof typeof map]();
  await audit(actorId, "admin.delete", entity, id);
}

export async function setReportStatus(actorId: string, id: string, status: ReportStatus) {
  await db.report.update({ where: { id }, data: { status } });
  await audit(actorId, "admin.report", "Report", id, { status });
}

export async function setGuestStatus(actorId: string, id: string, status: GuestPostStatus, reviewNote?: string) {
  const post = await db.guestPost.update({ where: { id }, data: { status, reviewNote: reviewNote || null } });
  if (status === "PUBLISHED") {
    await db.article.create({
      data: {
        slug: uniqueSlug(post.title),
        title: post.title,
        excerpt: `Sponsored submission from ${post.companyName}.`,
        content: post.content,
        category: post.category,
        sponsored: post.sponsored,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
  }
  await audit(actorId, "admin.guest_post", "GuestPost", id, { status });
  return post;
}

export async function saveSetting(actorId: string, key: string, value: unknown) {
  await db.siteSetting.upsert({ where: { key }, update: { value: value as object }, create: { key, value: value as object } });
  await audit(actorId, "admin.setting", "SiteSetting", key);
}

export async function upsertTrade(actorId: string, input: { id?: string; name: string; summary: string; description: string }) {
  if (input.id) {
    const trade = await db.trade.update({ where: { id: input.id }, data: { name: input.name, summary: input.summary, description: input.description } });
    await audit(actorId, "admin.trade_update", "Trade", trade.id);
    return trade;
  }
  const trade = await db.trade.create({ data: { name: input.name, slug: uniqueSlug(input.name), summary: input.summary, description: input.description, status: "PUBLISHED" } });
  await audit(actorId, "admin.trade_create", "Trade", trade.id);
  return trade;
}

export async function upsertGuide(actorId: string, input: { id?: string; title: string; excerpt: string; content: string; category: string; seoTitle?: string; seoDescription?: string }) {
  const data = { title: input.title, excerpt: input.excerpt, content: input.content, category: input.category, seoTitle: input.seoTitle || null, seoDescription: input.seoDescription || null, authorId: actorId };
  const guide = input.id
    ? await db.guide.update({ where: { id: input.id }, data })
    : await db.guide.create({ data: { ...data, slug: uniqueSlug(input.title), status: "DRAFT" } });
  await audit(actorId, "admin.guide_save", "Guide", guide.id);
  return guide;
}

export async function upsertProduct(actorId: string, input: { id?: string; name: string; description: string; category: string; brand?: string; priceDisplay?: string; affiliateUrl?: string }) {
  const data = {
    name: input.name,
    description: input.description,
    category: input.category,
    brand: input.brand || null,
    priceDisplay: input.priceDisplay || null,
    affiliateUrl: input.affiliateUrl || null,
  };
  const product = input.id
    ? await db.affiliateProduct.update({ where: { id: input.id }, data })
    : await db.affiliateProduct.create({ data: { ...data, slug: uniqueSlug(input.name), status: "DRAFT" } });
  await audit(actorId, "admin.product_save", "AffiliateProduct", product.id);
  return product;
}
