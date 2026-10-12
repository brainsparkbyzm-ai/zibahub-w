import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { JobList } from "@/components/jobs/JobList";
import { SampleBadge } from "@/components/ui/States";

export default async function EmployerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await db.company.findFirst({ where: { slug, status: "PUBLISHED" }, include: { jobs: { where: { status: "ACTIVE" }, include: { company: true, trade: true } } } });
  if (!company) notFound();
  return (
    <div className="shell page">
      <h1 className="page-title">{company.name}</h1>
      <p>{[company.city, company.region, company.country].filter(Boolean).join(", ")} {company.isSeed ? <SampleBadge /> : null}</p>
      {company.isSeed ? <div className="notice">Sample employer. Not a verified company.</div> : null}
      <p>{company.description}</p>
      {company.website ? <p><a href={company.website} rel="nofollow noopener noreferrer">Website</a></p> : null}
      {company.jobs.length ? <JobList jobs={company.jobs} /> : <p>No active jobs.</p>}
    </div>
  );
}
