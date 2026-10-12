import Link from "next/link";
import { notFound } from "next/navigation";
import { tradeBySlug } from "@/services/content";
import { load } from "@/lib/safe";
import { DatabaseNotice } from "@/components/ui/States";
import { JobList } from "@/components/jobs/JobList";
import { renderMarkdown } from "@/lib/markdown";

export default async function TradePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await load(() => tradeBySlug(slug));
  if (!result.ok) return <div className="shell page"><DatabaseNotice /></div>;
  if (!result.data) notFound();
  const trade = result.data;
  return (
    <div className="shell page">
      <p className="kicker">Trade</p>
      <h1 className="page-title">{trade.name}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(trade.description) }} />
      <p className="chips">
        <Link className="chip" href={`/jobs?trade=${trade.slug}`}>Jobs</Link>
        <Link className="chip" href={`/salaries/${trade.slug}`}>Pay context</Link>
        <Link className="chip" href={`/apprenticeships?trade=${trade.slug}`}>Apprenticeships</Link>
      </p>
      {trade.jobs.length ? <JobList jobs={trade.jobs} /> : <p>No active jobs in this trade.</p>}
    </div>
  );
}
