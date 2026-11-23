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
  const total = result.ok ? result.data[0].total : 0;
  const shown = result.ok ? result.data[0].jobs.length : 0;

  return (
    <div className="shell page jobs-page">
      <header className="jobs-hero">
        <div className="jobs-hero-copy">
          <p className="kicker jobs-kicker">Skilled-trade marketplace</p>
          <h1 className="page-title">Find your next trade role</h1>
          <p className="jobs-intro">Discover skilled-trade opportunities and narrow your search by location, trade and the way you want to work.</p>
        </div>
        <div className="jobs-hero-note">
          <span className="jobs-note-icon" aria-hidden="true">↗</span>
          <span><strong>Make your next move</strong><small>Explore roles that match your skills</small></span>
        </div>
      </header>

      <section className="jobs-filter-panel" aria-labelledby="jobs-filter-title">
        <div className="jobs-filter-heading">
          <div>
            <span className="jobs-section-eyebrow">JOB DISCOVERY</span>
            <h2 id="jobs-filter-title">Search and refine</h2>
            <p>Use the filters below to find the right opportunity.</p>
          </div>
          <Link className="jobs-reset-link" href="/jobs">Reset all filters <span aria-hidden="true">↺</span></Link>
        </div>

        <form className="jobs-filter-form" action="/jobs">
          <label className="jobs-field jobs-field-keyword"><span>Keyword</span>
            <input name="q" placeholder="Job title, employer or city" defaultValue={query.q || ""} />
          </label>
          <label className="jobs-field"><span>Industry</span>
            <select name="sector" defaultValue={query.sector || ""}>
              <option value="">All industries</option>
              <option value="hotels">Hotels &amp; Hospitality</option>
              <option value="grocery">Grocery &amp; Supermarkets</option>
              <option value="trainers">Fitness &amp; Trainers</option>
            </select>
          </label>
          <label className="jobs-field"><span>Country</span>
            <select name="country" defaultValue={query.country || ""}>
              <option value="">Any country</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
            </select>
          </label>
          <label className="jobs-field"><span>City</span>
            <input name="city" placeholder="e.g. London" defaultValue={query.city || ""} />
          </label>
          <label className="jobs-field"><span>Trade</span>
            <select name="trade" defaultValue={query.trade || ""}>
              <option value="">All trades</option>
              {result.ok ? result.data[1].map((trade) => <option key={trade.id} value={trade.slug}>{trade.name}</option>) : null}
            </select>
          </label>
          <label className="jobs-field"><span>Experience</span>
            <select name="experience" defaultValue={query.experience || ""}>
              <option value="">Any experience</option>
              <option value="ENTRY">Entry / Apprentice</option>
              <option value="JOURNEYMAN">Journeyman</option>
              <option value="SENIOR">Master / Senior</option>
            </select>
          </label>
          <label className="jobs-field"><span>Employment type</span>
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
          <label className="jobs-field"><span>Work location</span>
            <select name="location" defaultValue={query.location || ""}>
              <option value="">Any location</option>
              <option value="ON_SITE">On-site</option>
              <option value="HYBRID">Hybrid</option>
              <option value="REMOTE">Remote</option>
            </select>
          </label>
          <label className="jobs-field"><span>Minimum listed pay</span>
            <input name="salary" type="number" min="0" step="1000" placeholder="e.g. 40000" defaultValue={query.salary || ""} />
            <small className="jobs-field-help">Enter an amount in the listing's currency.</small>
          </label>
          <label className="jobs-field"><span>Posted within</span>
            <select name="posted" defaultValue={query.posted || ""}>
              <option value="">Any time</option>
              <option value="1">Past 24 hours</option>
              <option value="7">Past 7 days</option>
              <option value="14">Past 14 days</option>
              <option value="30">Past 30 days</option>
            </select>
          </label>
          <div className="jobs-filter-footer">
            <label className="jobs-featured-toggle">
              <input type="checkbox" name="featured" value="1" defaultChecked={query.featured === "1"} />
              <span><strong>Featured &amp; premium</strong><small>Show promoted opportunities only</small></span>
            </label>
            <div className="jobs-filter-actions">
              <button className="btn btn-amber jobs-search-button" type="submit"><span aria-hidden="true">⌕</span> Search jobs</button>
              <Link className="btn btn-ghost jobs-clear-button" href="/jobs">Clear filters</Link>
            </div>
          </div>
        </form>
      </section>

      {!result.ok ? <DatabaseNotice /> : result.data[0].jobs.length === 0 ? (
        <div className="jobs-empty-wrap">
          <EmptyState title="No matching jobs" body="Try removing a filter or searching a wider location. We never fill results with placeholder listings." href="/employers" action="Explore employers" />
        </div>
      ) : (
        <section className="jobs-results" aria-labelledby="jobs-results-title">
          <div className="jobs-results-heading">
            <div>
              <span className="jobs-section-eyebrow">OPPORTUNITIES</span>
              <h2 id="jobs-results-title">Latest trade jobs</h2>
              <p><strong>{shown}</strong> shown <span aria-hidden="true">·</span> <strong>{total}</strong> open opportunities</p>
            </div>
            <span className="jobs-page-size">12 jobs per page</span>
          </div>
          <JobList jobs={result.data[0].jobs} />
          <nav className="jobs-pagination" aria-label="Job results pages">
            {result.data[0].page > 1 ? (
              <Link className="btn btn-ghost" href={`/jobs?${new URLSearchParams({ ...query, page: String(result.data[0].page - 1) })}`}>← Previous</Link>
            ) : <span />}
            <span className="jobs-page-indicator">Page <strong>{result.data[0].page}</strong> of {result.data[0].pages}</span>
            {result.data[0].page < result.data[0].pages ? (
              <Link className="btn btn-ghost" href={`/jobs?${new URLSearchParams({ ...query, page: String(result.data[0].page + 1) })}`}>Next →</Link>
            ) : <span />}
          </nav>
        </section>
      )}
    </div>
  );
}
