import Link from "next/link";
import { listJobs } from "@/services/jobs";
import { load } from "@/lib/safe";
import { JobList } from "@/components/jobs/JobList";
import { DatabaseNotice, EmptyState } from "@/components/ui/States";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Jobs in Canada | Skilled Trade Jobs & Apprenticeships",
  description: "Find skilled trade jobs in Canada. Explore electrician, plumber, HVAC, welding, construction, mechanic and apprenticeship opportunities across provinces and cities.",
  path: "/jobs-in-canada",
});

const tradeSearches = [["Electrician jobs Canada","Electrician"],["Plumber jobs Canada","Plumber"],["HVAC jobs Canada","HVAC"],["Welder jobs Canada","Welder"],["Carpenter jobs Canada","Carpenter"],["Construction jobs Canada","Construction"],["Mechanic jobs Canada","Mechanic"],["Apprenticeships Canada","Apprentice"]];
const cities = ["Toronto","Vancouver","Calgary","Edmonton","Ottawa","Montreal","Winnipeg","Halifax"];

export default async function MarketJobsPage() {
  const result = await load(() => listJobs({ country: "Canada" }));
  const jobs = result.ok ? result.data.jobs : [];
  const total = result.ok ? result.data.total : 0;

  return (
    <main className="shell page">
      <header className="jobs-hero">
        <div className="jobs-hero-copy">
          <p className="kicker jobs-kicker">ZibaHub · Canada</p>
          <h1 className="page-title">Jobs in Canada</h1>
          <p className="jobs-intro">Find skilled trade jobs in Canada. Explore electrician, plumber, HVAC, welding, construction, mechanic and apprenticeship opportunities across provinces and cities.</p>
          <p className="jobs-intro">Listings are filtered to this market. Check the employer's original requirements, location, salary currency, work authorisation and application deadline before applying.</p>
          <p><Link className="btn btn-amber" href="/jobs?country=Canada">Browse Canada job listings</Link></p>
        </div>
      </header>
      <section className="jobs-results" aria-labelledby="market-live-jobs">
        <div className="jobs-results-heading"><div><span className="jobs-section-eyebrow">CURRENT OPPORTUNITIES</span><h2 id="market-live-jobs">Latest jobs in Canada</h2><p><strong>{total}</strong> active opportunities currently listed.</p></div></div>
        {!result.ok ? <DatabaseNotice /> : jobs.length ? <JobList jobs={jobs} /> : <EmptyState title="No matching live listings yet" body="We do not invent vacancies. Check back as employers publish roles, or explore other markets." href="/jobs" action="Browse all jobs" />}
      </section>
      <section className="jobs-results"><span className="jobs-section-eyebrow">SEARCH BY TRADE</span><h2>Skilled trade jobs by occupation</h2><div className="chips">{tradeSearches.map(([label,q]) => <Link className="chip" key={q} href={`/jobs?country=Canada&q=${encodeURIComponent(q)}`}>{label}</Link>)}</div></section>
      <section className="jobs-results"><span className="jobs-section-eyebrow">SEARCH BY LOCATION</span><h2>Jobs by city and region</h2><div className="chips">{cities.map((city) => <Link className="chip" key={city} href={`/jobs?country=Canada&city=${encodeURIComponent(city)}`}>{city} jobs</Link>)}</div></section>
      <section className="prose"><h2>Build a skilled trade career in Canada</h2><p>Explore current employer vacancies, compare pay details in the stated currency and check the local qualifications or licences required for the role. Apprenticeship structures, safety cards, professional recognition and right-to-work rules vary by jurisdiction.</p><p>Use ZibaHub's trade directory, salary information, apprenticeship listings and training resources to research your next step. Confirm licensing and qualification recognition with the relevant local authority before relying on a credential for work.</p><ul><li><Link href="/trades">Explore skilled trades</Link></li><li><Link href="/apprenticeships">Compare apprenticeships</Link></li><li><Link href="/salaries">Explore trade salary guides</Link></li><li><Link href="/training">Find training and certifications</Link></li><li><Link href="/markets">Explore all ZibaHub markets</Link></li></ul></section>
    </main>
  );
}
