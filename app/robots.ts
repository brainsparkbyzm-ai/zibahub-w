import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep authenticated employer workspace private without blocking public
      // /employers and /employers/[slug] company profiles from search engines.
      // Exact roots plus their subpaths; keep similarly named public
      // routes such as /employers and /articles crawlable.
      disallow: ["/admin$", "/admin/", "/dashboard$", "/dashboard/", "/employer$", "/employer/", "/api"],
    },
    sitemap: `${brand.url}/sitemap.xml`,
  };
}
