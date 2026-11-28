import Link from "next/link";
import { EUROPEAN_COUNTRIES } from "@/config/markets";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Jobs in Europe | Skilled Trade Jobs & Apprenticeships",
  description: "Explore skilled trade jobs and apprenticeships across Europe. Browse country-specific searches for electricians, plumbers, HVAC technicians, welders, mechanics and construction workers.",
  path: "/jobs-in-europe",
});

const tradeSearches = [
  ["Electrician jobs Europe", "Electrician"],
  ["Plumber jobs Europe", "Plumber"],
  ["HVAC jobs Europe", "HVAC"],
  ["Welder jobs Europe", "Welder"],
  ["Carpenter jobs Europe", "Carpenter"],
  ["Construction jobs Europe", "Construction"],
  ["Mechanic jobs Europe", "Mechanic"],
  ["Apprenticeships Europe", "Apprentice"],
];

export default function EuropeJobsPage() {
  return (
    <main className="shell page">
      <header className="jobs-hero"><div className="jobs-hero-copy">
        <p className="kicker jobs-kicker">ZibaHub · Europe</p>
        <h1 className="page-title">Skilled Trade Jobs in Europe</h1>
        <p className="jobs-intro">Explore skilled trade careers across European countries. Choose a country to search for electrician, plumbing, HVAC, welding, carpentry, construction, industrial maintenance and apprenticeship opportunities.</p>
        <p className="jobs-intro">Job titles, professional licences, apprenticeship systems, salary currencies and work authorisation requirements differ between countries. Always confirm local recognition and eligibility with the relevant authority and employer.</p>
      </div></header>
      <section className="jobs-results"><span className="jobs-section-eyebrow">SEARCH BY TRADE</span><h2>Popular skilled trade searches</h2><div className="chips">{tradeSearches.map(([label,q]) => <Link className="chip" key={q} href={`/jobs?q=${encodeURIComponent(q)}`}>{label}</Link>)}</div></section>
      <section className="jobs-results"><span className="jobs-section-eyebrow">COUNTRY DIRECTORY</span><h2>Browse jobs by European country</h2><p>Choose a country to see only listings tagged to that market. A country with no active listings will show no vacancies rather than sample or invented jobs.</p><div className="chips">{EUROPEAN_COUNTRIES.map((country) => <Link className="chip" key={country} href={`/jobs?country=${encodeURIComponent(country)}`}>{country} jobs</Link>)}</div></section>
      <section className="prose"><h2>Plan your next move across Europe</h2><p>Before applying across borders, check the job's required language, local trade certification, health and safety credentials, salary basis, tax and social contribution arrangements, and whether your current qualifications are recognised. Some occupations are regulated and require formal recognition before you can practise.</p><p>ZibaHub is building a country-by-country directory of real vacancies and practical career resources. We will expand country-specific salary, apprenticeship and training information as verified local data becomes available.</p><ul><li><Link href="/trades">Explore skilled trades</Link></li><li><Link href="/salaries">Compare trade salary information</Link></li><li><Link href="/apprenticeships">Explore apprenticeships</Link></li><li><Link href="/training">Browse training and certification resources</Link></li><li><Link href="/markets">Explore all ZibaHub markets</Link></li></ul></section>
    </main>
  );
}
