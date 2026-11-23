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
      <header style={{ marginBottom: 28 }}>
        <p className="kicker">Skilled-trade marketplace</p>
        <h1 className="page-title">Find your next trade role</h1>
        <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 680 }}>
          Search open opportunities by trade, location, experience and employment type.
        </p>
      </header>

      <div style={{ position: "relative", zIndex: 2, marginBottom: 28 }}>
        <form className="filters glass" action="/jobs" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))", alignItems: "end", gap: 14, padding: 20 }}>
          <label>Keyword
            <input name="q" placeholder="Job title, employer or city" defaultValue={query.q || ""} />
          </label>
          <label>Country
            <select name="country" defaultValue={query.country || ""}>
              <option value="">Any country</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
            </select>
          </label>
          <label>City
            <input name="city" placeholder="e.g. London" defaultValue={query.city || ""} />
          </label>
          <label>Trade
            <select name="trade" defaultValue={query.trade || ""}>
              <option value="">All trades</option>
              {result.ok ? result.data[1].map((trade) => <option key={trade.id} value={trade.slug}>{trade.name}</option>) : null}
            </select>
          </label>
          <label>Experience
            <select name="experience" defaultValue={query.experience || ""}>
              <option value="">Any experience</option>
              <option value="ENTRY">Entry / Apprentice</option>
              <option value="JOURNEYMAN">Journeyman</option>
              <option value="SENIOR">Master / Senior</option>
            </select>
          </label>
          <label>Employment type
            <select name="employment" defaultValue={query.employment || ""}>
              <option value="">Any type</option>
              <option value="FULL_TIME">Full time</option>
              <option value="PART_TIME">Part time</option>
              <option value="CONTRACT">Contract</option>
              <option value="APPRENTICESHIP">Apprenticeship</option>
              <option value="TEMPORARY">Temporary</option>
              <option value="SEASONAL">Seasonal</option>
            </select>
          </label>
          <label>Work location
            <select name="location" defaultValue={query.location || ""}>
              <option value="">Any location</option>
              <option value="ON_SITE">On-site</option>
              <option value="HYBRID">Hybrid</option>
              <option value="REMOTE">Remote</option>
            </select>
          </label>
          <label>Minimum listed pay (same unit as the job listing)
            <input name="salary" type="number" min="0" step="1000" placeholder="e.g. 40000" defaultValue={query.salary || ""} />
          </label>
          <label>Posted within
            <select name="posted" defaultValue={query.posted || ""}>
              <option value="">Any time</option>
              <option value="1">24 hours</option>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
            </select>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 9, minHeight: 42 }}>
            <input type="checkbox" name="featured" value="1" defaultChecked={query.featured === "1"} style={{ width: 17, minHeight: 17 }} />
            Featured and premium only
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-amber" type="submit" style={{ minHeight: 44 }}>Search jobs</button>
            <Link className="btn btn-ghost" href="/jobs">Clear filters</Link>
          </div>
        </form>
      </div>

      {!result.ok ? <DatabaseNotice /> : result.data[0].jobs.length === 0 ? (
        <EmptyState title="No matching jobs" body="Try removing a filter or searching a wider location. We never fill results with placeholder listings." href="/employers" action="Explore employers" />
      ) : (
        <div style={{ display: "grid", gap: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 650, color: "var(--muted)" }}>
              Showing {result.data[0].jobs.length} of {result.data[0].total} open opportunities
            </span>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>12 jobs per page</span>
          </div>
          <JobList jobs={result.data[0].jobs} />
          <nav aria-label="Job results pages" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, flexWrap: "wrap", paddingTop: 22, borderTop: "1px solid var(--line)" }}>
            {result.data[0].page > 1 ? (
              <Link className="btn btn-ghost" href={`/jobs?${new URLSearchParams({ ...query, page: String(result.data[0].page - 1) })}`}>Previous</Link>
            ) : null}
            <span style={{ fontSize: 14, fontWeight: 700 }}>
              Page <span style={{ color: "var(--amber-deep)" }}>{result.data[0].page}</span> of {result.data[0].pages}
            </span>
            {result.data[0].page < result.data[0].pages ? (
              <Link className="btn btn-ghost" href={`/jobs?${new URLSearchParams({ ...query, page: String(result.data[0].page + 1) })}`}>Next</Link>
            ) : null}
          </nav>
        </div>
      )}
    </div>
  );
}
