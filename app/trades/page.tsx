import Link from "next/link";
import { publishedTrades } from "@/services/content";
import { load } from "@/lib/safe";
import { DatabaseNotice, EmptyState } from "@/components/ui/States";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Trades", description: "Skilled trades covered by ZibaHub.", path: "/trades" });

export default async function TradesPage() {
  const result = await load(publishedTrades);
  return (
    <div className="shell page">
      <h1 className="page-title">Trades</h1>
      {!result.ok ? <DatabaseNotice /> : result.data.length === 0 ? <EmptyState title="No trades yet" body="An admin can add trades. The list is not filled with fake categories." /> : (
        <div className="grid-3">{result.data.map((trade) => <article key={trade.id} className="card"><h3><Link href={`/trades/${trade.slug}`}>{trade.name}</Link></h3><p>{trade.summary}</p></article>)}</div>
      )}
    </div>
  );
}
