import Link from "next/link";
import { MARKET_LINKS, EUROPEAN_COUNTRIES } from "@/config/markets";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Global Skilled Trade Jobs | USA, Canada, UK & Europe",
  description: "Explore skilled trade jobs, apprenticeships, salaries, training and employer opportunities across the United States, Canada, the United Kingdom and Europe.",
  path: "/markets",
});

export default function MarketsPage() {
  return (
    <main className="shell page">
      <header className="jobs-hero"><div className="jobs-hero-copy"><p className="kicker jobs-kicker">ZibaHub · Global markets</p><h1 className="page-title">Skilled Trade Careers Across Borders</h1><p className="jobs-intro">Explore jobs, apprenticeships, salary information and training resources across North America and Europe. Select a market to find opportunities relevant to that country or region.</p></div></header>
      <section className="jobs-results"><h2>Explore our markets</h2><div className="grid-3">{MARKET_LINKS.map((market) => <article className="card" key={market.href}><h3>{market.label}</h3><p>Browse skilled trade jobs, apprenticeships and career resources for this market.</p><Link href={market.href}>Explore {market.short} →</Link></article>)}</div></section>
      <section className="jobs-results"><h2>European country directory</h2><p>Search vacancies by the country shown on each listing. Country-specific inventory will grow as employers and verified feeds are added.</p><div className="chips">{EUROPEAN_COUNTRIES.map((country) => <Link className="chip" key={country} href={`/jobs?country=${encodeURIComponent(country)}`}>{country}</Link>)}</div></section>
      <section className="prose"><h2>One platform for trade careers</h2><p>Use ZibaHub to discover job opportunities, compare available salary information, explore training and apprenticeship routes, and connect with employers. Always verify the original vacancy, qualifications, right-to-work rules and salary details before applying.</p></section>
    </main>
  );
}
