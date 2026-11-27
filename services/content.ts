import { db } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { uniqueSlug } from "@/lib/format";
import type { Prisma } from "@prisma/client";

export async function publishedTrades() {
  return db.trade.findMany({ where: { status: "PUBLISHED" }, orderBy: { name: "asc" } });
}

export async function tradeBySlug(slug: string) {
  return db.trade.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      jobs: { where: { status: "ACTIVE", isSeed: false, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }], AND: [{ OR: [{ companyId: null }, { company: { status: "PUBLISHED" } }] }] }, take: 50, include: { company: true }, orderBy: { postedAt: "desc" } },
      salaryBands: { where: { isSeed: true }, take: 6 },
    },
  });
}

export async function listApprenticeships(query: Record<string, string | undefined>) {
  const where: Prisma.ApprenticeshipWhereInput = { status: "PUBLISHED" };
  if (query.country) where.country = query.country;
  if (query.trade) where.trade = { slug: query.trade };
  if (query.city) where.city = { contains: query.city, mode: "insensitive" };
  if (query.provider) where.providerName = { contains: query.provider, mode: "insensitive" };
  if (query.duration) where.duration = { contains: query.duration, mode: "insensitive" };
  if (query.paid === "1") where.paid = true;
  if (query.paid === "0") where.paid = false;
  if (query.requirements) where.requirements = { contains: query.requirements, mode: "insensitive" };
  return db.apprenticeship.findMany({ where, include: { trade: true, company: true }, orderBy: { createdAt: "desc" }, take: 60 });
}

export async function listCourses(query: Record<string, string | undefined>) {
  const where: Prisma.CourseWhereInput = { status: "PUBLISHED" };
  if (query.trade) where.trade = { slug: query.trade };
  if (query.country) where.country = query.country;
  if (query.delivery) where.delivery = query.delivery;
  return db.course.findMany({ where, include: { provider: true, trade: true }, orderBy: { title: "asc" }, take: 60 });
}

export async function listGuides(category?: string) {
  return db.guide.findMany({
    where: { status: "PUBLISHED", ...(category ? { category } : {}) },
    include: { trade: true, author: { select: { name: true } } },
    orderBy: { publishedAt: "desc" },
    take: 40,
  });
}

export async function listProducts(category?: string) {
  return db.affiliateProduct.findMany({
    where: { status: "PUBLISHED", ...(category ? { category } : {}) },
    include: { trade: true, _count: { select: { clicks: true } } },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
    take: 60,
  });
}

export async function recordAffiliateClick(slug: string, userId?: string | null) {
  const product = await db.affiliateProduct.findFirst({ where: { slug, status: "PUBLISHED" } });
  if (!product) throw new AppError(404, "not_found", "Product not found.");
  if (!product.affiliateUrl) throw new AppError(409, "link_not_configured", "An affiliate link has not been configured for this product.");
  let destination: URL;
  try {
    destination = new URL(product.affiliateUrl);
  } catch {
    throw new AppError(409, "invalid_affiliate_link", "The affiliate link is invalid.");
  }
  if (destination.protocol !== "https:") {
    throw new AppError(409, "invalid_affiliate_link", "The affiliate link must use HTTPS.");
  }
  await db.affiliateClick.create({ data: { productId: product.id, userId: userId || null } });
  return destination.toString();
}

export async function salaryBands(query: Record<string, string | undefined>) {
  const where: Prisma.SalaryBandWhereInput = {};
  if (query.trade) where.trade = { slug: query.trade };
  if (query.country) where.country = query.country;
  if (query.region) where.region = query.region;
  if (query.city) where.city = query.city;
  if (query.experience) where.experience = query.experience;
  return db.salaryBand.findMany({ where, include: { trade: true }, take: 40, orderBy: { country: "asc" } });
}

export async function globalSearch(q: string) {
  const term = q.trim();
  if (term.length < 2) return { jobs: [], trades: [], apprenticeships: [], courses: [], guides: [], employers: [] };
  const contains = { contains: term, mode: "insensitive" as const };
  const [jobs, trades, apprenticeships, courses, guides, employers] = await Promise.all([
    db.job.findMany({
      where: {
        status: "ACTIVE",
        isSeed: false,
        AND: [
          { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
          { OR: [{ companyId: null }, { company: { status: "PUBLISHED" } }] },
          { OR: [{ title: contains }, { city: contains }] },
        ],
      },
      include: { company: true },
      take: 6,
    }),
    db.trade.findMany({ where: { status: "PUBLISHED", name: contains }, take: 6 }),
    db.apprenticeship.findMany({ where: { status: "PUBLISHED", title: contains }, take: 6 }),
    db.course.findMany({ where: { status: "PUBLISHED", title: contains }, take: 6 }),
    db.guide.findMany({ where: { status: "PUBLISHED", title: contains }, take: 6 }),
    db.company.findMany({ where: { status: "PUBLISHED", name: contains }, take: 6 }),
  ]);
  return { jobs, trades, apprenticeships, courses, guides, employers };
}

export async function homeData() {
  const [
    jobs, trades, apprenticeships, courses, guides, employers, products, articles,
    activeJobCount, publishedEmployerCount, publishedTradeCount, apprenticeshipCount, courseCount,
  ] = await Promise.all([
    db.job.findMany({
      where: {
        status: "ACTIVE",
        isSeed: false,
        AND: [
          { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
          { OR: [{ companyId: null }, { company: { status: "PUBLISHED" } }] },
        ],
      },
      include: { company: true, trade: true },
      orderBy: [{ tier: "desc" }, { postedAt: "desc" }],
      take: 6,
    }),
    db.trade.findMany({ where: { status: "PUBLISHED" }, take: 10, orderBy: { name: "asc" } }),
    db.apprenticeship.findMany({ where: { status: "PUBLISHED" }, include: { trade: true }, take: 3 }),
    db.course.findMany({ where: { status: "PUBLISHED" }, include: { provider: true }, take: 3 }),
    db.guide.findMany({ where: { status: "PUBLISHED" }, take: 3, orderBy: { publishedAt: "desc" } }),
    db.company.findMany({ where: { status: "PUBLISHED" }, take: 4 }),
    db.affiliateProduct.findMany({ where: { status: "PUBLISHED" }, take: 4 }),
    db.article.findMany({ where: { status: "PUBLISHED", sponsored: true }, take: 2 }),
    db.job.count({
      where: {
        status: "ACTIVE",
        isSeed: false,
        AND: [
          { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
          { OR: [{ companyId: null }, { company: { status: "PUBLISHED" } }] },
        ],
      },
    }),
    db.company.count({ where: { status: "PUBLISHED" } }),
    db.trade.count({ where: { status: "PUBLISHED" } }),
    db.apprenticeship.count({ where: { status: "PUBLISHED" } }),
    db.course.count({ where: { status: "PUBLISHED" } }),
  ]);
  return {
    jobs, trades, apprenticeships, courses, guides, employers, products, articles,
    highlights: {
      jobs: activeJobCount,
      employers: publishedEmployerCount,
      trades: publishedTradeCount,
      training: apprenticeshipCount + courseCount,
    },
  };
}

export async function metrics() {
  const [users, employers, jobs, applications, views, clicks, posts, payments, reports, subscriptions] = await Promise.all([
    db.user.count(),
    db.company.count(),
    db.job.count(),
    db.application.count(),
    db.job.aggregate({ _sum: { viewCount: true } }),
    db.affiliateClick.count(),
    db.guestPost.count(),
    db.payment.aggregate({ _sum: { amountCents: true }, where: { status: "SUCCEEDED" } }),
    db.report.count({ where: { status: "OPEN" } }),
    db.subscription.count({ where: { status: "active" } }),
  ]);
  return {
    users,
    employers,
    jobs,
    applications,
    views: views._sum.viewCount || 0,
    clicks,
    posts,
    revenueCents: payments._sum.amountCents || 0,
    reports,
    subscriptions,
  };
}

export async function subscribeNewsletter(email: string) {
  await db.newsletterSubscriber.upsert({ where: { email: email.toLowerCase() }, update: {}, create: { email: email.toLowerCase() } });
}

export { uniqueSlug };

