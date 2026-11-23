import Image from "next/image";
import Link from "next/link";
import { DatabaseNotice } from "@/components/ui/States";
import { NewsletterForm } from "@/features/home/NewsletterForm";
import { load } from "@/lib/safe";
import { homeData } from "@/services/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Build Your Career in the Skilled Trades",
  description: "Find skilled-trade jobs, explore career paths, compare pay and build your future.",
  path: "/",
});

const popular = ["Electrician", "HVAC", "Plumber", "Welder", "Carpenter", "Construction"];

const destinations = [
  { number: "01", title: "Find your next job", description: "Search real skilled-trade opportunities by role, location and work type.", href: "/jobs", label: "Explore jobs", icon: "↗" },
  { number: "02", title: "Explore skilled trades", description: "Compare trade paths, skills, requirements and career opportunities.", href: "/trades", label: "Browse trades", icon: "⌁" },
  { number: "03", title: "Understand salaries", description: "Review available pay information by trade, market and experience.", href: "/salaries", label: "Compare salaries", icon: "＄" },
  { number: "04", title: "Learn a new skill", description: "Find training, certifications and practical learning opportunities.", href: "/training", label: "Explore training", icon: "＋" },
  { number: "05", title: "Start an apprenticeship", description: "Discover earn-while-you-learn routes into skilled careers.", href: "/apprenticeships", label: "View pathways", icon: "⌂" },
  { number: "06", title: "Make smarter moves", description: "Read practical career guides, advice and industry insights.", href: "/guides", label: "Read guides", icon: "≡" },
];

export default async function HomePage() {
  const result = await load(homeData);
  const highlights = result.ok ? result.data.highlights : null;

  return (
    <div className="zh-page zh-home-refresh">
      <section className="zh-hero">
        <div className="zh-hero-copy">
          <p className="zh-region"><Pin /> US · UK · Canada</p>
          <h1>Build a career that moves you forward.</h1>
          <p className="zh-lede">A clearer way to find skilled-trade work, understand your earning potential and take the next step in your career.</p>
          <form className="zh-search" action="/jobs">
            <label><Briefcase /><span>Trade or job title</span><input name="q" placeholder="Electrician, HVAC, plumber…" /></label>
            <label><Pin /><span>Location</span><input name="city" placeholder="City, state or ZIP" /></label>
            <button type="submit"><Search /> Find jobs</button>
          </form>
          <div className="zh-popular"><span>Popular:</span>{popular.map((item) => <Link key={item} href={`/jobs?q=${encodeURIComponent(item)}`}>{item}</Link>)}</div>
        </div>
        <HeroVisual />
      </section>

      <section className="zh-stats" aria-label="Live directory figures">
        <Stat value={highlights ? highlights.jobs.toLocaleString() : "—"} label="Active job listings" />
        <Stat value={highlights ? highlights.employers.toLocaleString() : "—"} label="Published employers" />
        <Stat value={highlights ? highlights.trades.toLocaleString() : "—"} label="Trade categories" />
        <Stat value={highlights ? highlights.training.toLocaleString() : "—"} label="Training opportunities" />
      </section>

      {!result.ok ? <DatabaseNotice /> : null}

      <section className="zh-directory" aria-labelledby="zh-directory-title">
        <div className="zh-directory-heading">
          <div><span className="zh-eyebrow">YOUR CAREER, YOUR NEXT STEP</span><h2 id="zh-directory-title">Everything you need. Clearly organized.</h2><p>Explore each part of your career journey in its own dedicated space.</p></div>
          <span className="zh-directory-index">01 — 06</span>
        </div>
        <div className="zh-destination-grid">
          {destinations.map((item) => (
            <Link className="zh-destination" href={item.href} key={item.href}>
              <span className="zh-destination-top"><small>{item.number} / 06</small><i>{item.icon}</i></span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="zh-destination-link">{item.label}<b>↗</b></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="zh-employer-band">
        <div><span className="zh-eyebrow">FOR EMPLOYERS</span><h2>Build your team with skilled people.</h2><p>Publish opportunities, manage applications and connect with trade talent.</p><div className="zh-hire-actions"><Link className="zh-gold" href="/employer/jobs/new">Post a job</Link><Link className="zh-ghost" href="/employers">Explore employers</Link></div></div>
        <div className="zh-employer-art"><Image src="/brand/hero-worker.jpg" alt="Skilled trades professional at work" width={620} height={440} /></div>
      </section>

      <section className="zh-home-newsletter"><div><span className="zh-eyebrow">STAY AHEAD</span><h2>Career opportunities, delivered.</h2><p>Get useful skilled-trade updates and new opportunities in your inbox.</p></div><NewsletterForm /></section>
    </div>
  );
}

function HeroVisual() {
  return <div className="zh-visual" aria-hidden="true"><Image src="/brand/hero-worker.jpg" alt="" width={900} height={700} /><div className="zh-dash"><div className="zh-metric"><i><Briefcase /></i><span>Discover opportunities</span><strong>Skilled trade jobs</strong><small>Search by role and location</small></div><div className="zh-metric"><i>↗</i><span>Plan your next move</span><strong>Career growth</strong><small>Training, pay and pathways</small></div></div><ul className="zh-rail"><li>Better job discovery</li><li>Career development</li><li>Market insights</li></ul></div>;
}
function Stat({ value, label }: { value: string; label: string }) { return <article className="zh-stat"><strong>{value}</strong><span>{label}</span></article>; }
function Pin() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/></svg>; }
function Briefcase() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>; }
function Search() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/></svg>; }
