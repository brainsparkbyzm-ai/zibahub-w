import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { notify } from "@/lib/notifications";
import { sendTransactionalEmail, emailConfig } from "@/lib/email";
import { brand } from "@/config/brand";

type AlertFilters = { keywords?: string; country?: string; tradeId?: string; salaryMin?: number };

function matches(job: { title: string; country: string; tradeId: string | null; salaryMin: number | null }, filters: AlertFilters) {
  if (filters.country && filters.country !== job.country) return false;
  if (filters.tradeId && filters.tradeId !== job.tradeId) return false;
  if (filters.salaryMin && (job.salaryMin == null || job.salaryMin < filters.salaryMin * 100)) return false;
  if (filters.keywords && !job.title.toLowerCase().includes(filters.keywords.toLowerCase())) return false;
  return true;
}

export async function dispatchInstantAlerts(jobId: string) {
  const job = await db.job.findUnique({ where: { id: jobId }, include: { company: true } });
  if (!job || job.status !== "ACTIVE") return { notified: 0, email: emailConfig() };
  const alerts = await db.jobAlert.findMany({ where: { active: true, frequency: "INSTANT" }, include: { user: true } });
  let notified = 0;
  for (const alert of alerts) {
    const filters = alert.filters as AlertFilters;
    if (!matches(job, filters)) continue;
    await notify({
      userId: alert.userId,
      type: "JOB_ALERT",
      title: alert.name,
      body: `${job.title} at ${job.company.name} matches this alert.`,
      href: `/jobs/${job.slug}`,
    });
    await sendTransactionalEmail({
      to: alert.user.email,
      subject: `ZibaHub alert: ${job.title}`,
      text: `${job.title} at ${job.company.name} matches “${alert.name}”.\n${brand.url}/jobs/${job.slug}`,
    });
    await db.jobAlert.update({ where: { id: alert.id }, data: { lastSentAt: new Date() } });
    notified += 1;
  }
  return { notified, email: emailConfig() };
}

export async function runDigest(frequency: "DAILY" | "WEEKLY") {
  const since = new Date(Date.now() - (frequency === "DAILY" ? 1 : 7) * 86400000);
  const jobs = await db.job.findMany({
    where: { status: "ACTIVE", postedAt: { gte: since } },
    include: { company: true },
    take: 100,
  });
  const alerts = await db.jobAlert.findMany({ where: { active: true, frequency }, include: { user: true } });
  let notified = 0;
  for (const alert of alerts) {
    const filters = alert.filters as AlertFilters;
    const hits = jobs.filter((job) => matches(job, filters));
    if (!hits.length) continue;
    await notify({
      userId: alert.userId,
      type: "JOB_ALERT",
      title: `${hits.length} new match${hits.length === 1 ? "" : "es"}`,
      body: hits.slice(0, 3).map((job) => job.title).join(", "),
      href: "/jobs",
    });
    await sendTransactionalEmail({
      to: alert.user.email,
      subject: `ZibaHub ${frequency.toLowerCase()} job alert`,
      text: hits.map((job) => `${job.title} — ${brand.url}/jobs/${job.slug}`).join("\n"),
    });
    await db.jobAlert.update({ where: { id: alert.id }, data: { lastSentAt: new Date() } });
    notified += 1;
  }
  return { notified, scanned: jobs.length, email: emailConfig() };
}

export type { Prisma };
