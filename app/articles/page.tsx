import Link from "next/link";
import { db } from "@/lib/db";
import { load } from "@/lib/safe";
import { formatDate } from "@/lib/format";
import { DatabaseNotice, EmptyState } from "@/components/ui/States";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Articles and Guest Posts",
  description: "Skilled-trades, career and employer insights, including clearly labelled sponsored stories.",
  path: "/articles",
});

export default async function ArticlesPage() {
  const result = await load(() => db.article.findMany({
    where: { status: "PUBLISHED", isSeed: false },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 60,
  }));

  return (
    <div className="shell page">
      <p className="kicker">ZibaHub insights</p>
      <h1 className="page-title">Articles and guest posts</h1>
      <p>Practical stories and insights for skilled-trades professionals, apprentices and employers. Sponsored content is labelled clearly.</p>
      {!result.ok ? <DatabaseNotice /> : result.data.length === 0 ? (
        <EmptyState title="No articles published yet" body="Approved guest posts and editorial stories will appear here." href="/sponsored" action="Write for ZibaHub" />
      ) : (
        <div className="list">
          {result.data.map((article) => (
            <article key={article.id} className="card">
              <div className="row">
                <span className={article.sponsored ? "badge ink" : "badge"}>{article.sponsored ? "Sponsored" : "Editorial"}</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <h2><Link href={`/articles/${article.slug}`}>{article.title}</Link></h2>
              <p>{article.excerpt}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
