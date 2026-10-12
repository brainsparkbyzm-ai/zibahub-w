import Link from "next/link";
import { listCourses } from "@/services/content";
import { db } from "@/lib/db";
import { load } from "@/lib/safe";
import { DatabaseNotice, EmptyState, SampleBadge } from "@/components/ui/States";
import { money } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Training", description: "Courses and certifications for skilled trades.", path: "/training" });

export default async function TrainingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const query = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value || ""]));
  const result = await load(() => Promise.all([listCourses(query), db.certification.findMany({ where: { status: "PUBLISHED" }, take: 20 })]));
  return (
    <div className="shell page">
      <h1 className="page-title">Training and certifications</h1>
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
