import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await db.article.findFirst({ where: { slug, status: "PUBLISHED" } });
  return pageMeta({
    title: article ? `${article.title}${article.sponsored ? " | Sponsored" : ""}` : "Article | ZibaHub",
    description: (article?.excerpt || "Skilled-trades and career insights from ZibaHub.").replace(/\\s+/g, " ").trim().slice(0, 160),
    path: `/articles/${slug}`,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await db.article.findFirst({ where: { slug, status: "PUBLISHED" } });
  if (!article) notFound();
  return (
    <div className="shell page">
      {article.sponsored ? <span className="badge ink">Sponsored</span> : null}
      <h1 className="page-title">{article.title}</h1>
      <p>{article.excerpt} · {formatDate(article.publishedAt)}</p>
      <article className="prose card" dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }} />
    </div>
  );
}
