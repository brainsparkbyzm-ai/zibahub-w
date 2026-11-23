import Link from "next/link";
import { listJobs } from "@/services/jobs";
import { load } from "@/lib/safe";
import { DatabaseNotice } from "@/components/ui/States";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Industry Jobs",
  description: "Explore hospitality, grocery retail and fitness trainer opportunities alongside skilled-trade careers.",
  path: "/industries",
});

const sectors = [
  { slug: "hotels", number: "01", title: "Hotels & Hospitality", description: "Find hotel operations, guest services, housekeeping, front desk, concierge and resort roles.", roles: ["Front desk", "Housekeeping", "Guest services", "Hotel operations"], icon: "✦" },
  { slug: "grocery", number: "02", title: "Grocery & Supermarkets", description: "Explore supermarket, grocery retail, checkout, stocking, produce and deli opportunities.", roles: ["Store associate", "Cashier", "Stocker", "Produce & deli"], icon: "▦" },
  { slug: "trainers", number: "03", title: "Fitness & Trainers", description: "Discover personal training, gym instruction, fitness coaching and strength coaching roles.", roles: ["Personal trainer", "Gym instructor", "Fitness coach", "Strength coach"], icon: "↗" },
] as const;

export default async function IndustriesPage() {
  const result = await load(() => Promise.all(sectors.map((sector) => listJobs({ sector: sector.slug }))));
  return (
    <div className="shell page zh-industry-page">
      <header className="zh-industry-hero">
        <span className="zh-eyebrow">EXPLORE MORE CAREER PATHS</span>
        <h1 className="page-title">More industries. More ways to move forward.</h1>
        <p>ZibaHub is expanding beyond the skilled trades. Explore hospitality, grocery retail and fitness roles in one place, with listings drawn from the same live job directory.</p>
        <div className="zh-industry-hero-meta"><span>03 industry areas</span><span>Live listings only</span><span>US · UK · Canada</span></div>
      </header>
      {!result.ok ? <DatabaseNotice /> : null}
      <section className="zh-industry-grid" aria-label="Industry job categories">
        {sectors.map((sector, index) => (
          <article className="zh-industry-card" key={sector.slug}>
            <div className="zh-industry-card-top"><span>{sector.number} / INDUSTRY</span><i aria-hidden="true">{sector.icon}</i></div>
            <h2>{sector.title}</h2>
            <p>{sector.description}</p>
            <div className="zh-industry-roles">{sector.roles.map((role) => <span key={role}>{role}</span>)}</div>
            <div className="zh-industry-card-bottom">
              <strong>{result.ok ? result.data[index].total.toLocaleString() : "—"} <small>matching jobs</small></strong>
              <Link href={`/jobs?sector=${sector.slug}`}>Explore jobs <b aria-hidden="true">↗</b></Link>
            </div>
          </article>
        ))}
      </section>
      <section className="zh-industry-note">
        <div><span className="zh-eyebrow">NO PLACEHOLDER LISTINGS</span><h2>Only real matching opportunities.</h2><p>Industry pages filter published job listings by job title, description and employer. If an industry has no matching live listings yet, the count stays at zero rather than showing invented jobs.</p></div>
        <Link className="btn btn-amber" href="/jobs">Browse all jobs</Link>
      </section>
    </div>
  );
}
