import Link from "next/link";
import { DatabaseNotice } from "@/components/ui/States";
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

const fallbackJobs = [
  { title: "Electrician", company: "Summit Electric Co.", place: "New York, NY, USA", pay: "$62,000 – $85,000", trade: "Electrician", q: "Electrician" },
  { title: "HVAC Technician", company: "CoolAir Solutions", place: "Chicago, IL, USA", pay: "$48,000 – $72,000", trade: "HVAC", q: "HVAC" },
  { title: "Plumber", company: "Harbor Pipe Co.", place: "Toronto, ON, Canada", pay: "$55,000 – $78,000", trade: "Plumbing", q: "Plumber" },
  { title: "Welder", company: "SteelWorks Ltd.", place: "Detroit, MI, USA", pay: "$52,000 – $76,000", trade: "Welding", q: "Welder" },
];

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

  return (
    <div className="zh-page">
      <section className="zh-hero">
        <div className="zh-hero-copy">
          <p className="zh-region"><Pin /> US · UK · Canada</p>
          <h1>Build Your Career in the Skilled Trades.</h1>
          <p className="zh-lede">Find better trade jobs, compare salaries, discover apprenticeships and make smarter career moves.</p>
          <form className="zh-search" action="/jobs">
            <label>
              <Briefcase />
              <span>Trade or Job Title</span>
              <input name="q" placeholder="e.g. Electrician, HVAC, Plumber" />
            </label>
            <label>
              <Pin />
              <span>Location</span>
              <input name="city" placeholder="City, State or ZIP" />
            </label>
            <button type="submit"><Search /> Search Jobs</button>
          </form>
          <div className="zh-popular">
            <span>Popular searches:</span>
            {popular.map((item) => <Link key={item} href={`/jobs?q=${encodeURIComponent(item)}`}>{item}</Link>)}
          </div>
        </div>
        <HeroVisual />
      </section>

      <section className="zh-stats" aria-label="Directory highlights">
        <Stat icon={<Briefcase />} value="50K+" label="Jobs Available" />
        <Stat icon={<People />} value="8K+" label="Employers Hiring" />
        <Stat icon={<Wrench />} value="40+" label="Trades" />
        <Stat icon={<Cap />} value="12K+" label="Training Paths" />
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
                  <TradeGlyph name={job.trade?.name || job.title} />
                  <div>
                    <h3><Link href={`/jobs/${job.slug}`}>{job.title}</Link></h3>
                    <p>{job.company.name}</p>
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
            )) : fallbackJobs.map((job) => (
              <article key={job.title} className="zh-job">
                <div className="zh-job-top">
                  <TradeGlyph name={job.title} />
                  <div>
                    <h3><Link href={`/jobs?q=${encodeURIComponent(job.q)}`}>{job.title}</Link></h3>
                    <p>{job.company}</p>
                    <p className="zh-place"><Pin /> {job.place}</p>
                  </div>
                  <Heart />
                </div>
                <strong>{job.pay} <small>/ year</small></strong>
                <div className="zh-tags"><span>Full-time</span><span>{job.trade}</span></div>
                <div className="zh-job-actions">
                  <Link className="zh-save-link" href="/jobs/saved">♡ Save</Link>
                  <Link href={`/jobs?q=${encodeURIComponent(job.q)}`}>View Job</Link>
                </div>
              </article>
            ))}
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

      <section className="zh-intel">
        <article className="zh-panel">
          <div className="zh-head"><h2>Salary Intelligence</h2><Link href="/salaries">View All Salaries →</Link></div>
          <div className="zh-salary">
            <div>
              <b>$68,500</b>
              <span>Average Salary (US)</span>
              <form action="/salaries">
                <select name="trade" aria-label="Trade" defaultValue="electrician"><option value="electrician">Electrician</option>{popular.map((item) => <option key={item} value={item.toLowerCase()}>{item}</option>)}</select>
                <select name="country" aria-label="Country" defaultValue="United States"><option>United States</option><option>United Kingdom</option><option>Canada</option></select>
              </form>
            </div>
            <div className="zh-bars" aria-hidden="true">
              <Bar label="Entry" height="46%" value="$45K" />
              <Bar label="Mid" height="62%" value="$60K" />
              <Bar label="Senior" height="78%" value="$78K" />
              <Bar label="Expert" height="96%" value="$95K" />
            </div>
            <div className="zh-compare">
              <p><b>Salary Comparison</b></p>
              <p><FlagUS /> US <strong>$68,500</strong></p>
              <p><FlagUK /> UK <strong>£52,000</strong></p>
              <p><FlagCA /> Canada <strong>C$75,000</strong></p>
            </div>
            <div className="zh-insight">
              <p><b>Market Insight</b></p>
              <p>Electricians in the US earn 12% higher salaries than the national average.</p>
              <Link href="/salaries">View Full Report →</Link>
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
                <img src={guide.image} alt="" />
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
              <b>Manage Your Team</b>
              <span>James Miller · Electrician</span>
              <span>Sarah Johnson · HVAC Specialist</span>
              <span>Mike Rodriguez · Plumber</span>
            </div>
            <img src="/brand/hero-worker.jpg" alt="" />
            <div className="zh-mini-metrics">
              <span>Active Jobs <b>24</b></span>
              <span>Applications <b>186</b></span>
              <span>Hired <b>12</b></span>
            </div>
          </div>
        </div>
        <NewsletterForm />
      </section>
    </div>
  );
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
    <div className="zh-visual" aria-hidden="true">
      <img src="/brand/hero-worker.jpg" alt="" />
      <div className="zh-dash">
        <div className="zh-metric">
          <i><Briefcase /></i>
          <span>Average Salary</span>
          <strong>$68,500 <small>/year</small></strong>
          <em>+12%</em>
          <Spark />
        </div>
        <div className="zh-metric">
          <i><Clock /></i>
          <span>Job Availability</span>
          <strong>8,420</strong>
          <em>+18%</em>
          <div className="zh-colchart"><span /><span /><span /><span /><span /><span /><span /></div>
        </div>
        <div className="zh-metric">
          <i><Trend /></i>
          <span>Career Growth</span>
          <strong>+24%</strong>
          <small>Over the next 5 years</small>
        </div>
        <div className="zh-metric">
          <i><Pin /></i>
          <span>Top Location</span>
          <strong>Austin, TX</strong>
          <small>(Most Jobs)</small>
          <FlagUS />
        </div>
      </div>
      <ul className="zh-rail">
        <li><Trend /> Better Jobs</li>
        <li><Wallet /> Higher Salaries</li>
        <li><Chart /> Career Growth</li>
        <li><Pin /> Top Locations</li>
      </ul>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <article className="zh-stat">{icon}<div><strong>{value}</strong><span>{label}</span></div></article>;
}
function Bar({ label, height, value }: { label: string; height: string; value: string }) {
  return <div><b>{value}</b><span style={{ height }} /><small>{label}</small></div>;
}
function Spark() {
  return <svg className="zh-spark" viewBox="0 0 120 36" aria-hidden="true"><path d="M2 28 C18 26 22 22 34 20 C48 17 52 24 66 16 C80 8 92 12 118 4" fill="none" stroke="#2f9e68" strokeWidth="2.4" /><path d="M2 28 C18 26 22 22 34 20 C48 17 52 24 66 16 C80 8 92 12 118 4 V36 H2 Z" fill="rgba(47,158,104,0.12)" /></svg>;
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
function Clock() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 8v5l3 2" /></svg>; }
function Trend() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 16l6-6 4 4 6-7" /><path d="M14 7h6v6" /></svg>; }
function Wallet() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M16 12h4" /></svg>; }
function Chart() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 19V5M4 19h16" /><path d="M8 15v-4M12 15V8M16 15v-6" /></svg>; }
function Badge() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="9" r="5" /><path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" /></svg>; }
function Book() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4z" /><path d="M5 4a3 3 0 0 0-3 3v13" /></svg>; }
function Bolt() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 10-14h-7l0-6z" /></svg>; }
function Hvac() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 12h8M12 8v8" /></svg>; }
function Pipe() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 8h8v8H4zM12 12h8" /></svg>; }
function Weld() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 18l6-8 4 4 6-8" /></svg>; }
function Hammer() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M14 4l6 6-4 1-7 7-3-3 7-7 1-4z" /></svg>; }
function Crane() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 20h10M8 20V6l12 3M8 10h8" /></svg>; }
function FlagUS() { return <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true"><rect width="16" height="11" fill="#fff" /><rect width="16" height="1.2" fill="#b22234" /><rect y="2.4" width="16" height="1.2" fill="#b22234" /><rect y="4.8" width="16" height="1.2" fill="#b22234" /><rect y="7.2" width="16" height="1.2" fill="#b22234" /><rect y="9.6" width="16" height="1.2" fill="#b22234" /><rect width="7" height="5.8" fill="#3c3b6e" /></svg>; }
function FlagUK() { return <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true"><rect width="16" height="11" fill="#012169" /><path d="M0 0l16 11M16 0L0 11" stroke="#fff" strokeWidth="2" /><path d="M8 0v11M0 5.5h16" stroke="#fff" strokeWidth="3" /><path d="M8 0v11M0 5.5h16" stroke="#c8102e" strokeWidth="1.4" /></svg>; }
function FlagCA() { return <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden="true"><rect width="16" height="11" fill="#fff" /><rect width="4" height="11" fill="#d52b1e" /><rect x="12" width="4" height="11" fill="#d52b1e" /><path d="M8 2l.6 1.8h1.8L9.1 5l.6 1.8L8 5.7 6.3 6.8 6.9 5 5.6 3.8h1.8z" fill="#d52b1e" /></svg>; }
