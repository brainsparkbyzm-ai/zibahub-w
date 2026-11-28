import type { Metadata } from "next";
import { brand } from "@/config/brand";

export function pageMeta(input: { title: string; description: string; path: string }): Metadata {
  const url = `${brand.url}${input.path}`;
  const title = input.title.replace(/\s*[|·]\s*ZibaHub$/i, "").trim();

  return {
    title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: input.description,
      url,
      siteName: brand.name,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description: input.description },
  };
}
