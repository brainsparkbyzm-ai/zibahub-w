import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/format";
import { SampleBadge } from "@/components/ui/States";
import { brand } from "@/config/brand";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await db.guide.findFirst({ where: { slug, status: "PUBLISHED" } });
  return { title: guide?.seoTitle || guide?.title || "Guide", description: guide?.seoDescription || guide?.excerpt || brand.description };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await db.guide.findFirst({ where: { slug, status: "PUBLISHED" }, include: { author: true, trade: true } });
  if (!guide) notFound();
  const related = await db.guide.findMany({ where: { status: "PUBLISHED", category: guide.category, NOT: { id: guide.id } }, take: 3 });
  const schema = guide.isSeed ? null : { "@context": "https://schema.org", "@type": "Article", headline: guide.title, datePublished: guide.publishedAt?.toISOString(), author: guide.author?.name || "ZibaHub" };
  return (
    <div className="shell page">
      {schema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /> : null}
      <p className="kicker">{guide.category}</p>
      <h1 className="page-title">{guide.title}</h1>
      <p>{guide.author?.name || "ZibaHub"} · {formatDate(guide.publishedAt)} {guide.isSeed ? <SampleBadge /> : null}</p>
      <article className="prose card" dangerouslySetInnerHTML={{ __html: renderMarkdown(guide.content) }} />
      {related.length ? <section><h2>Related</h2>{related.map((item) => <p key={item.id}><a href={`/guides/${item.slug}`}>{item.title}</a></p>)}</section> : null}
    </div>
  );
}
