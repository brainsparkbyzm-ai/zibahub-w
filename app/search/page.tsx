import Link from "next/link";
import { globalSearch } from "@/services/content";
import { load } from "@/lib/safe";
import { DatabaseNotice, EmptyState } from "@/components/ui/States";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Search", description: "Search jobs, trades, training, guides, and employers.", path: "/search" });

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const q = (Array.isArray(raw.q) ? raw.q[0] : raw.q) || "";
  const result = q.length >= 2 ? await load(() => globalSearch(q)) : null;
  return (
    <div className="shell page">
      <h1 className="page-title">Search</h1>
      <form className="filters glass" action="/search"><label>Query<input name="q" defaultValue={q} minLength={2} required /></label><button className="btn" type="submit">Search</button></form>
      {q.length < 2 ? <EmptyState title="Type at least two characters" body="Search covers jobs, trades, apprenticeships, training, guides, and employers." /> : !result || !result.ok ? <DatabaseNotice /> : (
        <div className="grid-2">
          <section className="card"><h2>Jobs</h2>{result.data.jobs.length ? result.data.jobs.map((job) => <p key={job.id}><Link href={`/jobs/${job.slug}`}>{job.title}</Link></p>) : <p>No jobs.</p>}</section>
          <section className="card"><h2>Trades</h2>{result.data.trades.map((item) => <p key={item.id}><Link href={`/trades/${item.slug}`}>{item.name}</Link></p>)}{result.data.trades.length === 0 ? <p>No trades.</p> : null}</section>
          <section className="card"><h2>Apprenticeships</h2>{result.data.apprenticeships.map((item) => <p key={item.id}><Link href={`/apprenticeships/${item.slug}`}>{item.title}</Link></p>)}</section>
          <section className="card"><h2>Training</h2>{result.data.courses.map((item) => <p key={item.id}><Link href={`/training/${item.slug}`}>{item.title}</Link></p>)}</section>
          <section className="card"><h2>Guides</h2>{result.data.guides.map((item) => <p key={item.id}><Link href={`/guides/${item.slug}`}>{item.title}</Link></p>)}</section>
          <section className="card"><h2>Employers</h2>{result.data.employers.map((item) => <p key={item.id}><Link href={`/employers/${item.slug}`}>{item.name}</Link></p>)}</section>
        </div>
      )}
    </div>
  );
}
