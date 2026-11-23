import Image from "next/image";
import Link from "next/link";
import { DatabaseNotice, EmptyState } from "@/components/ui/States";
import { NewsletterForm } from "@/features/home/NewsletterForm";
import { load } from "@/lib/safe";
import { money, titleCaseEnum } from "@/lib/format";
import { homeData } from "@/services/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Build Your Career in the Skilled Trades",
  description: "Find better trade jobs, compare salaries, discover apprenticeships and make smarter career moves.",
  path: "/",
});

const popular = ["Electrician", "HVAC", "Plumber", "Welder", "Carpenter", "Construction"];

const tradeCards = [
  ["Electrician", "Install & maintain electrical systems", "bolt"],
  ["HVAC Technician", "Heating, cooling & ventilation systems", "hvac"],
  ["Plumber", "Water systems & piping", "pipe"],
  ["Welder", "Fabrication & metalwork", "weld"],
  ["Carpenter", "Woodwork & construction", "hammer"],
  ["Construction", "Build & maintain structures", "crane"],
] as const;

const guideCards = [
  { kicker: "Career advice", title: "How to Become an Electrician (Complete Guide)", image: "/brand/guide-electrician.jpg", href: "/guides" },
  { kicker: "Industry insights", title: "Top 10 High-Paying Trades in 2025", image: "/brand/guide-tools.jpg", href: "/guides" },
  { kicker: "Skills & training", title: "Resume Tips for Skilled Trades Professionals", image: "/brand/guide-resume.jpg", href: "/guides" },
];

export default async function HomePage() {
  const result = await load(homeData);
  const jobs = result.ok ? result.data.jobs.slice(0, 4) : [];
  const trades = result.ok && result.data.trades.length ? result.data.trades.slice(0, 6) : null;
  const guides = result.ok && result.data.guides.length ? result.data.guides.slice(0, 3) : null;
  const highlights = result.ok ? result.data.highlights : null;

  return (
    <div className="zh-page zh-home-refresh">
      <section className="zh-hero">
        <div className="zh-hero-copy">
          <p className="zh-region"><span className="zh-bolt">ϟ</span> Build Your Skilled Career with ZibaHub</p>
          <h1>Skilled Trades Jobs<br/>for a <em>Better Tomorrow</em></h1>
          <p className="zh-lede">Discover top job opportunities, grow your skills, and build a rewarding career in skilled trades worldwide.</p>
          <form className="zh-search" action="/jobs">
            <label>
              <Briefcase />
              <span>Search for Jobs</span>
              <input name="q" placeholder="Search jobs (e.g. Electrician, Welder...)" />
            </label>
            <label>
              <Pin />
              <span>Location</span>
              <input name="city" placeholder="City, State or ZIP" />
            </label>
            <button type="submit"><Search /> Find Jobs <span aria-hidden="true">→</span></button>
          </form>
          <div className="zh-popular">
            <span>Popular trades:</span>
            {popular.map((item) => <Link key={item} href={`/jobs?q=${encodeURIComponent(item)}`}>{item}</Link>)}
          </div>
        </div>
        <HeroVisual />
      </section>

      <section className="zh-stats" aria-label="Directory highlights">
        <Stat icon={<Briefcase />} value={highlights ? highlights.jobs.toLocaleString() : "—"} label="Active Job Listings" />
        <Stat icon={<People />} value={highlights ? highlights.employers.toLocaleString() : "—"} label="Published Employers" />
        <Stat icon={<Wrench />} value={highlights ? highlights.trades.toLocaleString() : "—"} label="Trade Categories" />
        <Stat icon={<Cap />} value={highlights ? highlights.training.toLocaleString() : "—"} label="Training Opportunities" />
      </section>

      {!result.ok ? <DatabaseNotice /> : null}

      <section className="zh-block">
        <div className="zh-jobs-col">
          <div className="zh-head">
            <h2>Featured Jobs</h2>
            <Link href="/jobs">View All Jobs →</Link>
          </div>
          <div className="zh-job-grid">
            {jobs.length ? jobs.map((job) => (
              <article key={job.id} className="zh-job">
                <div className="zh-job-top">
                  <Image className="zh-job-photo" src={jobPhoto(job.trade?.name || job.title)} alt="" width={112} height={132} />
                  <div>
                    <h3><Link href={`/jobs/${job.slug}`}>{job.title}</Link></h3>
                    <p>{job.externalCompanyName || job.company?.name || "Employer"}</p>
                    <p className="zh-place"><Pin /> {[job.city, job.region, job.country].filter(Boolean).join(", ")}</p>
                  </div>
                  <Heart />
                </div>
                <strong>{payLine(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryType)}</strong>
                <div className="zh-tags">
                  <span>{jobType(job.employmentType)}</span>
                  <span>{job.trade?.name || "Trade"}</span>
                </div>
                <div className="zh-job-actions">
                  <form action={`/api/jobs/${job.slug}/save`} method="post">
                    <button type="submit">♡ Save</button>
                  </form>
                  <Link href={`/jobs/${job.slug}`}>View Job</Link>
                </div>
              </article>
            )) : <EmptyState title="No featured jobs yet" body="New verified opportunities will appear here as employers publish roles." href="/jobs" action="Browse all jobs" />}
          </div>
        </div>
        <div>
          <div className="zh-head">
            <h2>Popular Trades</h2>
            <Link href="/trades">View All Trades →</Link>
          </div>
          <div className="zh-trade-grid">
            {(trades ? trades.map((trade) => [trade.name, trade.summary, trade.slug] as const) : tradeCards.map(([name, summary]) => [name, summary, ""] as const)).map(([name, summary, slug]) => (
              <Link key={name} className="zh-trade" href={slug ? `/trades/${slug}` : `/jobs?q=${encodeURIComponent(name)}`}>
                <TradeGlyph name={name} />
                <strong>{name}</strong>
                <span>{summary}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="zh-industry-strip">
        <div className="zh-directory-heading">
          <div><span className="zh-eyebrow">EXPANDING THE OPPORTUNITY</span><h2>Explore jobs beyond the trades</h2><p>Discover opportunities in hospitality, grocery retail and fitness — alongside skilled-trade careers.</p></div>
          <Link href="/industries">Explore all industries <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="zh-industry-strip-grid">
          <Link href="/jobs?sector=hotels"><span>01 / HOSPITALITY</span><b>Hotel &amp; Resort Jobs</b><small>Guest services · Front desk · Housekeeping</small><i aria-hidden="true">↗</i></Link>
          <Link href="/jobs?sector=grocery"><span>02 / RETAIL</span><b>Grocery &amp; Supermarket Jobs</b><small>Store teams · Cashiers · Stock &amp; produce</small><i aria-hidden="true">↗</i></Link>
          <Link href="/jobs?sector=trainers"><span>03 / FITNESS</span><b>Fitness &amp; Trainer Jobs</b><small>Personal training · Gym instruction · Coaching</small><i aria-hidden="true">↗</i></Link>
        </div>
      </section>

      <section className="zh-intel">
        <article className="zh-panel">
          <div className="zh-head"><h2>Salary Intelligence</h2><Link href="/salaries">View All Salaries →</Link></div>
          <div className="zh-salary">
            <div>
              <b>Salary data by trade</b>
              <span>Explore available salary ranges and source notes.</span>
              <form action="/salaries">
                <select name="trade" aria-label="Trade" defaultValue="electrician"><option value="electrician">Electrician</option>{popular.map((item) => <option key={item} value={item.toLowerCase()}>{item}</option>)}</select>
                <select name="country" aria-label="Country" defaultValue="United States"><option>United States</option><option>United Kingdom</option><option>Canada</option></select>
                <button type="submit">Explore Salaries</button>
              </form>
            </div>
            <div className="zh-bars" aria-hidden="true">
              <div><b>Trade</b><span style={{ height: "76%" }} /><small>Compare</small></div>
              <div><b>Region</b><span style={{ height: "58%" }} /><small>Filter</small></div>
              <div><b>Level</b><span style={{ height: "88%" }} /><small>Experience</small></div>
              <div><b>Source</b><span style={{ height: "68%" }} /><small>Review</small></div>
            </div>
            <div className="zh-insight">
              <p><b>Compare with confidence</b></p>
              <p>Browse salary bands by trade, country and experience. Check each listing's source note before making career decisions.</p>
              <Link href="/salaries">View Salary Data →</Link>
            </div>
          </div>
        </article>
        <article className="zh-panel">
          <div className="zh-head"><h2>Career & Training</h2><Link href="/training">View All →</Link></div>
          <div className="zh-train">
            <Link href="/apprenticeships"><Cap /><strong>Apprenticeships</strong><span>Earn while you learn and gain real experience.</span></Link>
            <Link href="/training"><Badge /><strong>Certifications</strong><span>Get certified and boost your career.</span></Link>
            <Link href="/training"><Book /><strong>Trade Courses</strong><span>Build skills with flexible online & in-person courses.</span></Link>
          </div>
        </article>
        <article className="zh-panel">
          <div className="zh-head"><h2>Career Guides</h2><Link href="/guides">View All Guides →</Link></div>
          <div className="zh-guides">
            {(guides ? guides.map((guide) => ({ kicker: guide.category, title: guide.title, image: guideCards[0].image, href: `/guides/${guide.slug}` })) : guideCards).map((guide) => (
              <Link key={guide.title} href={guide.href} className="zh-guide">
                <Image src={guide.image} alt="" width={320} height={72} />
                <small>{guide.kicker}</small>
                <strong>{guide.title}</strong>
                <em>Read Guide →</em>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="zh-bottom">
        <div className="zh-hire">
          <div>
            <h2>Hire Skilled Talent Faster.</h2>
            <p>Reach qualified tradespeople across the US, UK and Canada.</p>
            <div className="zh-hire-actions">
              <Link className="zh-gold" href="/employer/jobs/new">Post a Job</Link>
              <Link className="zh-ghost" href="/employers">Explore Employers</Link>
            </div>
          </div>
          <div className="zh-hire-art" aria-hidden="true">
            <div className="zh-team">
              <b>Employer workspace</b>
              <span>Publish skilled-trade opportunities</span>
              <span>Review candidate applications</span>
              <span>Manage your hiring pipeline</span>
            </div>
            <Image src="/brand/hero-worker.jpg" alt="" width={900} height={700} />
            <div className="zh-mini-metrics">
              <span>Job <b>Posting</b></span>
              <span>Candidate <b>Review</b></span>
              <span>Hiring <b>Tools</b></span>
            </div>
          </div>
        </div>
        <NewsletterForm />
      </section>
    </div>
  );
}

function jobPhoto(name: string) {
  const value = name.toLowerCase();
  if (value.includes("electric") || value.includes("hvac") || value.includes("plumb")) return "/brand/guide-electrician.jpg";
  if (value.includes("weld") || value.includes("construct") || value.includes("carpent")) return "/brand/guide-tools.jpg";
  return "/brand/guide-resume.jpg";
}

function payLine(min: number | null, max: number | null, currency: string, type: string) {
  if (min == null && max == null) return "Pay not listed";
  const suffix = type === "HOURLY" ? "/ hour" : type === "DAILY" ? "/ day" : "/ year";
  if (min != null && max != null) return `${money(min, currency)} – ${money(max, currency)} ${suffix}`;
  return `${money(min ?? max, currency)} ${suffix}`;
}

function jobType(value: string) {
  if (value === "FULL_TIME") return "Full-time";
  if (value === "PART_TIME") return "Part-time";
  return titleCaseEnum(value);
}

function HeroVisual() {
  return (
    <div className="zh-visual zh-visual-clean" aria-label="Skilled trades professional at work">
      <Image src="/brand/hero-worker.jpg" alt="Skilled trades professional wearing a hard hat at a construction site" width={1200} height={900} priority />
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <article className="zh-stat">{icon}<div><strong>{value}</strong><span>{label}</span></div></article>;
}
function TradeGlyph({ name }: { name: string }) {
  const key = name.toLowerCase();
  const icon = key.includes("hvac") ? <span className="zh-glyph hvac"><Hvac /></span> : key.includes("plumb") ? <span className="zh-glyph pipe"><Pipe /></span> : key.includes("weld") ? <span className="zh-glyph weld"><Weld /></span> : key.includes("carpent") ? <span className="zh-glyph hammer"><Hammer /></span> : key.includes("construct") ? <span className="zh-glyph crane"><Crane /></span> : <span className="zh-glyph bolt"><Bolt /></span>;
  return icon;
}

function Pin() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.2" /></svg>; }
function Briefcase() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>; }
function Search() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.2-3.2" /></svg>; }
function Heart() { return <svg className="zh-heart" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" /></svg>; }
function People() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.4" /><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5S14 16 14.6 19" /><path d="M14 14.6c1.8-.3 3.4.3 4.5 1.6.6 1.2.8 2.8.9 2.8" /></svg>; }
function Wrench() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M14 7a4 4 0 0 0-5.7 5.1L4 16.4 7.6 20l4.3-4.3A4 4 0 0 0 17 10l-3 3-2-2 2-4z" /></svg>; }
function Cap() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 10l9-5 9 5-9 5-9-5z" /><path d="M7 12v4c2 1.5 8 1.5 10 0v-4" /></svg>; }
function Badge() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="9" r="5" /><path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" /></svg>; }
function Book() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4z" /><path d="M5 4a3 3 0 0 0-3 3v13" /></svg>; }
function Bolt() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 10-14h-7l0-6z" /></svg>; }
function Hvac() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 12h8M12 8v8" /></svg>; }
function Pipe() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 8h8v8H4zM12 12h8" /></svg>; }
function Weld() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 18l6-8 4 4 6-8" /></svg>; }
function Hammer() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M14 4l6 6-4 1-7 7-3-3 7-7 1-4z" /></svg>; }
function Crane() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 20h10M8 20V6l12 3M8 10h8" /></svg>; }

