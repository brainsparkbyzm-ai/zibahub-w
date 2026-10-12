import Link from "next/link";
import { listApprenticeships } from "@/services/content";
import { load } from "@/lib/safe";
import { DatabaseNotice, EmptyState, SampleBadge } from "@/components/ui/States";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Apprenticeships", description: "Apprenticeship listings for skilled trades.", path: "/apprenticeships" });

export default async function ApprenticeshipsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const query = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value || ""]));
  const result = await load(() => listApprenticeships(query));
  return (
    <div className="shell page">
      <h1 className="page-title">Apprenticeships</h1>
      <form className="filters glass" action="/apprenticeships">
        <label>Country<select name="country" defaultValue={query.country || ""}><option value="">Any</option><option>United States</option><option>United Kingdom</option><option>Canada</option></select></label>
        <label>Trade slug<input name="trade" defaultValue={query.trade || ""} /></label>
        <label>City<input name="city" defaultValue={query.city || ""} /></label>
        <label>Provider<input name="provider" defaultValue={query.provider || ""} /></label>
        <label>Duration<input name="duration" defaultValue={query.duration || ""} /></label>
        <label>Paid<select name="paid" defaultValue={query.paid || ""}><option value="">Any</option><option value="1">Paid</option><option value="0">Unpaid</option></select></label>
        <label>Entry requirement keyword<input name="requirements" defaultValue={query.requirements || ""} /></label>
        <button className="btn" type="submit">Filter</button>
      </form>
      {!result.ok ? <DatabaseNotice /> : result.data.length === 0 ? <EmptyState title="No apprenticeships" body="Published programmes will appear here." /> : (
        <div className="list">{result.data.map((item) => <article key={item.id} className="card"><h3><Link href={`/apprenticeships/${item.slug}`}>{item.title}</Link></h3><p>{item.providerName} · {item.country} · {item.paid ? "Paid" : "Unpaid"} {item.isSeed ? <SampleBadge /> : null}</p></article>)}</div>
      )}
    </div>
  );
}
