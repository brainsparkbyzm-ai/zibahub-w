import Link from "next/link";
import { listCourses } from "@/services/content";
import { db } from "@/lib/db";
import { load } from "@/lib/safe";
import { DatabaseNotice, EmptyState, SampleBadge } from "@/components/ui/States";
import { money } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Training", description: "Compare skilled-trade courses and certifications by trade, country and delivery format. Check provider details, fees and qualification outcomes.", path: "/training" });

export default async function TrainingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const query = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value || ""]));
  const result = await load(() => Promise.all([listCourses(query), db.certification.findMany({ where: { status: "PUBLISHED" }, take: 20 })]));
  return (
    <div className="shell page zh-directory-page zh-page-training">
      <h1 className="page-title">Training and certifications</h1>
      <p>Compare published courses by trade, country and delivery format. Where information is available, a listing shows the provider, duration, price, delivery method and certification details. Course availability and fees can change, so confirm them directly with the provider before enrolling.</p>
      <p>A certificate or course title does not automatically mean that a licence is recognised in every country. Check the relevant regulator, apprenticeship authority or industry body for your intended workplace. For reference, see <a href="https://www.citb.co.uk/funding-support" target="_blank" rel="noopener noreferrer">CITB training and funding information</a> in the UK and <a href="https://red-seal.ca/eng/resources/related-sites.shtml" target="_blank" rel="noopener noreferrer">Canadian Red Seal trade resources</a>.</p>
      <form className="filters glass" action="/training">
        <label>Trade slug<input name="trade" defaultValue={query.trade || ""} /></label>
        <label>Country<input name="country" defaultValue={query.country || ""} /></label>
        <label>Delivery<select name="delivery" defaultValue={query.delivery || ""}><option value="">Any</option><option value="Online">Online</option><option value="In person">In person</option><option value="Hybrid">Hybrid</option></select></label>
        <button className="btn" type="submit">Filter</button>
      </form>
      {!result.ok ? <DatabaseNotice /> : (
        <>
          {result.data[0].length === 0 ? <EmptyState title="No courses published" body="Providers and admins add courses. Affiliate URLs stay empty until configured." /> : <div className="grid-3">{result.data[0].map((course) => <article key={course.id} className="card"><h3><Link href={`/training/${course.slug}`}>{course.title}</Link></h3><p>{course.provider?.name || "Provider"} · {course.delivery} · {course.priceCents != null ? money(course.priceCents, course.currency) : "Price not listed"} {course.isSeed ? <SampleBadge /> : null}</p></article>)}</div>}
          <h2>Certifications</h2>
          <div className="list">{result.data[1].map((item) => <article key={item.id} className="card"><h3>{item.name}</h3><p>{item.body} · {item.country} {item.isSeed ? <SampleBadge /> : null}</p><p>{item.description}</p></article>)}</div>
        </>
      )}
    </div>
  );
}
