import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await db.article.findFirst({ where: { slug, status: "PUBLISHED" } });
  if (!article) notFound();
  return (
    <div className="shell page">
      {article.sponsored ? <span className="badge ink">Sponsored</span> : null}
      <h1 className="page-title">{article.title}</h1>
      <article className="prose card" dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }} />
    </div>
  );
}
