import Link from "next/link";
import { db } from "@/lib/db";
import { load } from "@/lib/safe";
import { formatDate } from "@/lib/format";
import { DatabaseNotice, EmptyState } from "@/components/ui/States";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Articles and Guest Posts",
  description: "Read original skilled-trade career and employer insights, researched for apprentices, technicians and hiring teams. Sponsored stories are labelled.",
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
      <p>Explore practical stories and research for skilled-trades professionals, apprentices and employers. Useful topics include career routes, training choices, pay information, job-search preparation, workplace skills and trade hiring.</p>
      <p>Editorial articles are intended to answer a clear reader question and identify their sources where facts can change. Sponsored submissions are reviewed separately and labelled when published. Read our <Link href="/sponsored">guest-post and sponsored-content information</Link> before submitting a story; sending a submission does not guarantee acceptance or publication.</p>
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
