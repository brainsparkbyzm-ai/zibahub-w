import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    "",
    "/jobs",
    "/industries",
    "/trades",
    "/apprenticeships",
    "/salaries",
    "/training",
    "/tools",
    "/employers",
    "/guides",
    "/calculators",
    "/sponsored",
  ].map((path) => ({
    url: `${brand.url}${path}`,
    lastModified: now,
  }));

  try {
    const [
      jobs,
      trades,
      guides,
      courses,
      apprenticeships,
      companies,
      products,
      articles,
    ] = await Promise.all([
      db.job.findMany({
        where: { status: "ACTIVE", isSeed: false },
        select: { slug: true, updatedAt: true },
      }),
      db.trade.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      db.guide.findMany({
        where: { status: "PUBLISHED", isSeed: false },
        select: { slug: true, updatedAt: true },
      }),
      db.course.findMany({
        where: { status: "PUBLISHED", isSeed: false },
        select: { slug: true, updatedAt: true },
      }),
      db.apprenticeship.findMany({
        where: { status: "PUBLISHED", isSeed: false },
        select: { slug: true, updatedAt: true },
      }),
      db.company.findMany({
        where: { status: "PUBLISHED", isSeed: false },
        select: { slug: true, updatedAt: true },
      }),
      db.affiliateProduct.findMany({
        where: { status: "PUBLISHED", isSeed: false },
        select: { slug: true, updatedAt: true },
      }),
      db.article.findMany({
        where: { status: "PUBLISHED", isSeed: false },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticRoutes,
      ...jobs.map((row) => ({
        url: `${brand.url}/jobs/${row.slug}`,
        lastModified: row.updatedAt,
      })),
      ...trades.map((row) => ({
        url: `${brand.url}/trades/${row.slug}`,
        lastModified: row.updatedAt,
      })),
      ...trades.map((row) => ({
        url: `${brand.url}/salaries/${row.slug}`,
        lastModified: row.updatedAt,
      })),
      ...guides.map((row) => ({
        url: `${brand.url}/guides/${row.slug}`,
        lastModified: row.updatedAt,
      })),
      ...courses.map((row) => ({
        url: `${brand.url}/training/${row.slug}`,
        lastModified: row.updatedAt,
      })),
      ...apprenticeships.map((row) => ({
        url: `${brand.url}/apprenticeships/${row.slug}`,
        lastModified: row.updatedAt,
      })),
      ...companies.map((row) => ({
        url: `${brand.url}/employers/${row.slug}`,
        lastModified: row.updatedAt,
      })),
      ...products.map((row) => ({
        url: `${brand.url}/tools/${row.slug}`,
        lastModified: row.updatedAt,
      })),
      ...articles.map((row) => ({
        url: `${brand.url}/articles/${row.slug}`,
        lastModified: row.updatedAt,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}


