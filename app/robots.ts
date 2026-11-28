import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep authenticated employer workspace private without blocking public
      // /employers and /employers/[slug] company profiles from search engines.
      disallow: ["/admin", "/dashboard", "/employer/", "/api"],
    },
    sitemap: `${brand.url}/sitemap.xml`,
  };
}
