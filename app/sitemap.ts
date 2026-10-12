import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["", "/jobs", "/trades", "/apprenticeships", "/salaries", "/training", "/tools", "/employers", "/guides", "/calculators", "/search", "/sponsored"].map((path) => ({ url: `${brand.url}${path}`, lastModified: now }));
  try {
    const [jobs, trades, guides, courses] = await Promise.all([
      db.job.findMany({ where: { status: "ACTIVE", isSeed: false }, select: { slug: true, updatedAt: true } }),
      db.trade.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      db.guide.findMany({ where: { status: "PUBLISHED", isSeed: false }, select: { slug: true, updatedAt: true } }),
      db.course.findMany({ where: { status: "PUBLISHED", isSeed: false }, select: { slug: true, updatedAt: true } }),
    ]);
    return [
      ...staticRoutes,
      ...jobs.map((row) => ({ url: `${brand.url}/jobs/${row.slug}`, lastModified: row.updatedAt })),
      ...trades.map((row) => ({ url: `${brand.url}/trades/${row.slug}`, lastModified: row.updatedAt })),
      ...guides.map((row) => ({ url: `${brand.url}/guides/${row.slug}`, lastModified: row.updatedAt })),
      ...courses.map((row) => ({ url: `${brand.url}/training/${row.slug}`, lastModified: row.updatedAt })),
    ];
  } catch {
    return staticRoutes;
  }
}
