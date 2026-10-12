import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { audit } from "@/lib/audit";
import { notify } from "@/lib/notifications";
import { uniqueSlug } from "@/lib/format";
import { pageNumber } from "@/lib/query";
import { dispatchInstantAlerts } from "@/services/alerts";
import type { z } from "zod";
import { jobSchema } from "@/validation/content";

const jobInclude = { company: true, trade: true, _count: { select: { applications: true } } } satisfies Prisma.JobInclude;

function activeWhere(): Prisma.JobWhereInput {
  return { status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] };
}

export async function listJobs(query: Record<string, string | undefined>) {
  const page = pageNumber(query.page);
  const take = 12;
  const filters: Prisma.JobWhereInput[] = [activeWhere()];
  if (query.country) filters.push({ country: query.country });
  if (query.region) filters.push({ region: query.region });
  if (query.city) filters.push({ city: { contains: query.city, mode: "insensitive" } });
  if (query.trade) filters.push({ trade: { slug: query.trade } });
  if (query.company) filters.push({ company: { slug: query.company } });
  if (query.employment) filters.push({ employmentType: query.employment as Prisma.EnumEmploymentTypeFilter["equals"] });
  if (query.location) filters.push({ locationType: query.location as Prisma.EnumLocationTypeFilter["equals"] });
  if (query.experience) filters.push({ experience: query.experience });
  if (query.apprenticeship === "1") filters.push({ isApprenticeship: true });
  if (query.featured === "1") filters.push({ tier: { in: ["FEATURED", "PREMIUM"] } });
  if (query.salary) filters.push({ salaryMin: { gte: Number(query.salary) * 100 } });
  if (query.posted) {
    const days = Number(query.posted);
    if (Number.isFinite(days)) filters.push({ postedAt: { gte: new Date(Date.now() - days * 86400000) } });
  }
  if (query.q) {
    filters.push({
      OR: [
        { title: { contains: query.q, mode: "insensitive" } },
        { city: { contains: query.q, mode: "insensitive" } },
        { company: { name: { contains: query.q, mode: "insensitive" } } },
      ],
    });
  }
  const where = { AND: filters };
  const [total, jobs] = await Promise.all([
    db.job.count({ where }),
    db.job.findMany({
      where,
      include: jobInclude,
      orderBy: [{ tier: "desc" }, { postedAt: "desc" }],
      skip: (page - 1) * take,
      take,
    }),
  ]);
  return { jobs, total, page, pages: Math.max(1, Math.ceil(total / take)) };
}

export async function getPublicJob(slug: string) {
  return db.job.findFirst({ where: { slug, ...activeWhere() }, include: jobInclude });
}

export async function recordJobView(id: string) {
  await db.job.update({ where: { id }, data: { viewCount: { increment: 1 } } });
}

export function dollarsToCents(value?: number) {
  if (value == null || Number.isNaN(value)) return undefined;
  return Math.round(value * 100);
}

export async function createEmployerJob(ownerId: string, input: z.infer<typeof jobSchema>) {
  const company = await db.company.findUnique({ where: { ownerId } });
  if (!company) throw new AppError(400, "company_required", "Create a company profile before posting a job.");
  if (company.status === "REJECTED" || company.status === "ARCHIVED") {
    throw new AppError(403, "company_inactive", "This company profile cannot post jobs.");
  }
  const job = await db.job.create({
    data: {
      slug: uniqueSlug(input.title),
      title: input.title,
      description: input.description,
      companyId: company.id,
      tradeId: input.tradeId || null,
      country: input.country,
      region: input.region || null,
      city: input.city || null,
      salaryMin: dollarsToCents(input.salaryMin),
      salaryMax: dollarsToCents(input.salaryMax),
      salaryCurrency: input.salaryCurrency,
      salaryType: input.salaryType,
      employmentType: input.employmentType,
      experience: input.experience || null,
      skills: (input.skills || "").split(",").map((item) => item.trim()).filter(Boolean),
      requirements: input.requirements || null,
      benefits: input.benefits || null,
      locationType: input.locationType,
      applicationMethod: input.applicationMethod,
      applicationTarget: input.applicationTarget || null,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      tier: input.tier,
      isApprenticeship: Boolean(input.isApprenticeship) || input.employmentType === "APPRENTICESHIP",
      status: "PENDING",
    },
  });
  await audit(ownerId, "job.create", "Job", job.id, { tier: job.tier });
  return job;
}

export async function updateEmployerJob(ownerId: string, jobId: string, input: z.infer<typeof jobSchema>) {
  const job = await db.job.findFirst({ where: { id: jobId, company: { ownerId } } });
  if (!job) throw new AppError(404, "not_found", "Job not found.");
  if (job.status === "CLOSED") throw new AppError(400, "closed", "Closed jobs cannot be edited. Post a new listing.");
  return db.job.update({
    where: { id: job.id },
    data: {
      title: input.title,
      description: input.description,
      tradeId: input.tradeId || null,
      country: input.country,
      region: input.region || null,
      city: input.city || null,
      salaryMin: dollarsToCents(input.salaryMin),
      salaryMax: dollarsToCents(input.salaryMax),
      salaryCurrency: input.salaryCurrency,
      salaryType: input.salaryType,
      employmentType: input.employmentType,
      experience: input.experience || null,
      skills: (input.skills || "").split(",").map((item) => item.trim()).filter(Boolean),
      requirements: input.requirements || null,
      benefits: input.benefits || null,
      locationType: input.locationType,
      applicationMethod: input.applicationMethod,
      applicationTarget: input.applicationTarget || null,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      tier: input.tier,
      isApprenticeship: Boolean(input.isApprenticeship) || input.employmentType === "APPRENTICESHIP",
      status: job.status === "REJECTED" ? "PENDING" : job.status,
    },
  });
}

export async function setEmployerJobStatus(ownerId: string, jobId: string, status: "PAUSED" | "CLOSED" | "PENDING") {
  const job = await db.job.findFirst({ where: { id: jobId, company: { ownerId } } });
  if (!job) throw new AppError(404, "not_found", "Job not found.");
  return db.job.update({ where: { id: job.id }, data: { status } });
}

export async function publishJob(actorId: string, jobId: string) {
  const job = await db.job.update({ where: { id: jobId }, data: { status: "ACTIVE", postedAt: new Date() } });
  await audit(actorId, "job.publish", "Job", job.id);
  await dispatchInstantAlerts(job.id);
  return job;
}

export async function toggleSave(userId: string, slug: string) {
  const job = await db.job.findUnique({ where: { slug } });
  if (!job) throw new AppError(404, "not_found", "Job not found.");
  const existing = await db.savedJob.findUnique({ where: { userId_jobId: { userId, jobId: job.id } } });
  if (existing) {
    await db.savedJob.delete({ where: { id: existing.id } });
    return { saved: false };
  }
  await db.savedJob.create({ data: { userId, jobId: job.id } });
  return { saved: true };
}

export async function applyToJob(userId: string, slug: string, coverLetter?: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(401, "unauthenticated", "Sign in to apply.");
  if (!user.emailVerifiedAt) throw new AppError(403, "email_unverified", "Verify your email before applying.");
  const job = await db.job.findFirst({ where: { slug, status: "ACTIVE" }, include: { company: true } });
  if (!job) throw new AppError(404, "not_found", "This job is not open.");
  if (job.applicationMethod !== "ONSITE") throw new AppError(400, "external_apply", "This employer accepts applications outside ZibaHub.");
  if (job.company.ownerId === userId) throw new AppError(400, "own_job", "You cannot apply to your own listing.");
  const application = await db.application.upsert({
    where: { jobId_userId: { jobId: job.id, userId } },
    update: { coverLetter: coverLetter || null, status: "SUBMITTED" },
    create: { jobId: job.id, userId, coverLetter: coverLetter || null, resumeUrl: user.resumeUrl },
  });
  await notify({
    userId: job.company.ownerId,
    type: "APPLICATION",
    title: "New application",
    body: `${user.name} applied for ${job.title}.`,
    href: "/employer/applications",
  });
  await notify({
    userId,
    type: "APPLICATION",
    title: "Application submitted",
    body: `Your application for ${job.title} was sent to ${job.company.name}.`,
    href: "/dashboard/applications",
  });
  return application;
}

export async function reportJob(userId: string | null, slug: string, reason: string, details?: string) {
  const job = await db.job.findUnique({ where: { slug } });
  if (!job) throw new AppError(404, "not_found", "Job not found.");
  return db.report.create({
    data: { reporterId: userId, targetType: "job", targetId: job.id, jobId: job.id, reason, details: details || null },
  });
}

export { jobInclude };
