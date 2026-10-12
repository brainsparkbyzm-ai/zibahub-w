import Link from "next/link";
import { listJobs } from "@/services/jobs";
import { publishedTrades } from "@/services/content";
import { load } from "@/lib/safe";
import { JobList } from "@/components/jobs/JobList";
import { DatabaseNotice, EmptyState } from "@/components/ui/States";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Jobs", description: "Search skilled-trade jobs across the US, UK, and Canada.", path: "/jobs" });

export default async function JobsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const query = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value || ""]));
  const result = await load(() => Promise.all([listJobs(query), publishedTrades()]));
  return (
    <div className="shell page">
      <div style={{ marginBottom: 32 }}>
        <p className="kicker">Marketplace</p>
        <h1 className="page-title">Available Trade Roles</h1>
        <p style={{ color: "var(--muted)", fontSize: 16 }}>Connecting skilled journeymen and apprentices with premium contractors.</p>
      </div>

      <div style={{ position: "sticky", top: 84, zIndex: 30, marginBottom: 32 }}>
        <form className="filters glass" action="/jobs" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", alignItems: "end" }}>
          <label>Trade Keyword<input name="q" placeholder="Search title..." defaultValue={query.q || ""} /></label>
          <label>Region<select name="country" defaultValue={query.country || ""}><option value="">Any Region</option><option>United States</option><option>United Kingdom</option><option>Canada</option></select></label>
          <label>Trade Category<select name="trade" defaultValue={query.trade || ""}><option value="">Any Trade</option>{result.ok ? result.data[1].map((trade) => <option key={trade.id} value={trade.slug}>{trade.name}</option>) : null}</select></label>
          <label>Experience<select name="experience" defaultValue={query.experience || ""}><option value="">Any Level</option><option value="ENTRY">Entry / Apprentice</option><option value="JOURNEYMAN">Journeyman</option><option value="SENIOR">Master / Senior</option></select></label>
          <label>Employment<select name="employment" defaultValue={query.employment || ""}><option value="">Any Type</option><option value="FULL_TIME">Full time</option><option value="CONTRACT">Contract</option><option value="APPRENTICESHIP">Apprenticeship</option></select></label>
          <button className="btn btn-amber" type="submit" style={{ minHeight: 44 }}>Filter Jobs</button>
        </form>
      </div>

      {!result.ok ? <DatabaseNotice /> : result.data[0].jobs.length === 0 ? <EmptyState title="No matching jobs" body="Try a broader trade or country. Empty results are empty, not filled with placeholders." href="/employers" action="See employers" /> : (
        <div style={{ display: "grid", gap: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--muted)" }}>
              Showing {result.data[0].jobs.length} of {result.data[0].total} open opportunities
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {/* Add sorting or view toggle if needed */}
            </div>
          </div>

          <JobList jobs={result.data[0].jobs} />
          
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
            {result.data[0].page > 1 ? (
              <Link className="btn btn-ghost" href={`/jobs?${new URLSearchParams({ ...query, page: String(result.data[0].page - 1) })}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Previous
              </Link>
            ) : <div style={{ width: 100 }} />}
            
            <span style={{ fontSize: 14, fontWeight: 700 }}>
              Page <span style={{ color: "var(--amber-deep)" }}>{result.data[0].page}</span> of {result.data[0].pages}
            </span>

            {result.data[0].page < result.data[0].pages ? (
              <Link className="btn btn-ghost" href={`/jobs?${new URLSearchParams({ ...query, page: String(result.data[0].page + 1) })}`}>
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            ) : <div style={{ width: 100 }} />}
          </div>
        </div>
      )}
    </div>
  );
}
