import Link from "next/link";
import { publishedTrades } from "@/services/content";
import { load } from "@/lib/safe";
import { DatabaseNotice, EmptyState } from "@/components/ui/States";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Trades", description: "Explore electrician, HVAC, plumbing, welding and construction careers. Compare trade roles, live jobs, apprenticeship routes and pay context.", path: "/trades" });

export default async function TradesPage() {
  const result = await load(publishedTrades);
  return (
    <div className="shell page zh-directory-page zh-page-trades">
      <h1 className="page-title">Trades</h1>
      <p>Explore skilled-trade career paths, from electrical and HVAC work to plumbing, welding, carpentry and construction. Each trade profile explains the work and links to related opportunities where listings are available.</p>
      <p>Use a profile to move between current jobs, apprenticeship listings and salary context. Requirements, licences and recognised qualifications differ by country and sometimes by state or province, so check the relevant local authority before paying for training or accepting work.</p>
      {!result.ok ? <DatabaseNotice /> : result.data.length === 0 ? <EmptyState title="No trades yet" body="An admin can add trades. The list is not filled with fake categories." /> : (
        <div className="grid-3">{result.data.map((trade) => <article key={trade.id} className="card"><h2><Link href={`/trades/${trade.slug}`}>{trade.name}</Link></h2><p>{trade.summary}</p></article>)}</div>
      )}
    </div>
  );
}
