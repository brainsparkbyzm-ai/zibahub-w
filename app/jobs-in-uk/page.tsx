import Link from "next/link";
import { listJobs } from "@/services/jobs";
import { load } from "@/lib/safe";
import { JobList } from "@/components/jobs/JobList";
import { DatabaseNotice, EmptyState } from "@/components/ui/States";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Jobs in UK | Skilled Trade Jobs & Apprenticeships",
  description: "Find jobs in the UK with ZibaHub. Explore electrician, plumber, HVAC, construction, welding, carpenter, mechanic and apprenticeship opportunities by city.",
  path: "/jobs-in-uk",
});

const tradeSearches = [
  ["Electrician jobs UK", "Electrician"],
  ["Plumber jobs UK", "Plumber"],
  ["HVAC jobs UK", "HVAC"],
  ["Welder jobs UK", "Welder"],
  ["Carpenter jobs UK", "Carpenter"],
  ["Construction jobs UK", "Construction"],
  ["Mechanic jobs UK", "Mechanic"],
  ["Apprenticeships UK", "Apprentice"],
];

const cities = ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Bristol"];

export default async function UKJobsPage() {
  const result = await load(() => listJobs({ country: "United Kingdom" }));
  const jobs = result.ok ? result.data.jobs : [];
  const total = result.ok ? result.data.total : 0;

  return (
    <main className="shell page">
      <header className="jobs-hero">
        <div className="jobs-hero-copy">
          <p className="kicker jobs-kicker">ZibaHub · United Kingdom</p>
          <h1 className="page-title">Jobs in UK</h1>
          <p className="jobs-intro">Find skilled trade jobs in the United Kingdom. Search current opportunities for electricians, plumbers, HVAC engineers, welders, carpenters, mechanics and construction workers, as well as apprenticeships and entry-level trade roles.</p>
          <p className="jobs-intro">Use ZibaHub to explore trade careers, compare roles and follow the application instructions on each listing. Job availability changes as employers and job sources update their vacancies.</p>
          <p><Link className="btn btn-amber" href="/jobs?country=United%20Kingdom">Browse UK job listings</Link></p>
        </div>
      </header>

      <section className="jobs-results" aria-labelledby="uk-live-jobs">
        <div className="jobs-results-heading">
          <div>
            <span className="jobs-section-eyebrow">CURRENT OPPORTUNITIES</span>
            <h2 id="uk-live-jobs">Latest jobs in the UK</h2>
            <p><strong>{total}</strong> active UK opportunities currently listed on ZibaHub.</p>
          </div>
        </div>
        {!result.ok ? <DatabaseNotice /> : jobs.length ? <JobList jobs={jobs} /> : <EmptyState title="More UK jobs are on the way" body="There are no matching live UK listings at the moment. Check back soon or explore jobs in other countries." href="/jobs" action="Browse all jobs" />}
      </section>

      <section className="jobs-results" aria-labelledby="uk-trade-searches">
        <span className="jobs-section-eyebrow">SEARCH BY TRADE</span>
        <h2 id="uk-trade-searches">Skilled trade jobs in the UK</h2>
        <p>Go straight to the type of work you are looking for. Each search is filtered to United Kingdom listings.</p>
        <div className="chips">
          {tradeSearches.map(([label, q]) => <Link className="chip" key={q} href={`/jobs?country=United%20Kingdom&q=${encodeURIComponent(q)}`}>{label}</Link>)}
        </div>
      </section>

      <section className="jobs-results" aria-labelledby="uk-city-searches">
        <span className="jobs-section-eyebrow">SEARCH BY LOCATION</span>
        <h2 id="uk-city-searches">Trade jobs by UK city</h2>
        <p>Search for skilled trade and construction vacancies in major UK cities.</p>
        <div className="chips">
          {cities.map((city) => <Link className="chip" key={city} href={`/jobs?country=United%20Kingdom&city=${encodeURIComponent(city)}`}>{city} jobs</Link>)}
        </div>
      </section>

      <section className="prose">
        <h2>Find your next skilled trade job in the UK</h2>
        <p>ZibaHub brings skilled trade opportunities and career resources together in one place. Whether you are an experienced tradesperson, changing careers or starting an apprenticeship, use the job filters to narrow opportunities by trade, city, employment type and experience level.</p>
        <p>Common searches include electrician jobs, plumbing jobs, heating and ventilation roles, welding jobs, carpentry and joinery jobs, construction jobs, maintenance engineering and trade apprenticeships. Always check the employer's listing for qualifications, right-to-work requirements, pay details and application deadlines.</p>
        <h2>Explore more on ZibaHub</h2>
        <ul>
          <li><Link href="/trades">Explore skilled trades and career guides</Link></li>
          <li><Link href="/apprenticeships">Find apprenticeship opportunities</Link></li>
          <li><Link href="/salaries">Explore trade salary information</Link></li>
          <li><Link href="/training">Browse training and upskilling resources</Link></li>
          <li><Link href="/jobs">Search jobs across the USA, UK and Canada</Link></li>
        </ul>
      </section>
    </main>
  );
}
