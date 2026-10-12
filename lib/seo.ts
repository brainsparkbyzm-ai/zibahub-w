import type { Metadata } from "next";
import { brand } from "@/config/brand";

export function pageMeta(input: { title: string; description: string; path: string }): Metadata {
  const url = `${brand.url}${input.path}`;
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: brand.name,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: input.title, description: input.description },
  };
}
