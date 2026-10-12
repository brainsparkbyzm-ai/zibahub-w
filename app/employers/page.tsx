import Link from "next/link";
import { db } from "@/lib/db";
import { load } from "@/lib/safe";
import { DatabaseNotice, EmptyState, SampleBadge } from "@/components/ui/States";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Employers", description: "Companies hiring skilled trades on ZibaHub.", path: "/employers" });

export default async function EmployersPage() {
  const result = await load(() => db.company.findMany({ where: { status: "PUBLISHED" }, include: { _count: { select: { jobs: true } } }, orderBy: { name: "asc" } }));
  return (
    <div className="shell page">
      <h1 className="page-title">Employers</h1>
      {!result.ok ? <DatabaseNotice /> : result.data.length === 0 ? <EmptyState title="No published employers" body="Company profiles appear after an admin publishes them." href="/sign-up" action="Create an employer account" /> : (
        <div className="grid-3">{result.data.map((company) => <article key={company.id} className="card"><h3><Link href={`/employers/${company.slug}`}>{company.name}</Link></h3><p>{[company.city, company.country].filter(Boolean).join(", ")} · {company._count.jobs} jobs {company.isSeed ? <SampleBadge /> : null}</p></article>)}</div>
      )}
    </div>
  );
}
