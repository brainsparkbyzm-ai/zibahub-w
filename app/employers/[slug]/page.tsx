import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { JobList } from "@/components/jobs/JobList";
import { SampleBadge } from "@/components/ui/States";
import { pageMeta } from "@/lib/seo";


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await db.company.findFirst({
    where: { slug, status: "PUBLISHED" },
  });

  if (!company) {
    return pageMeta({
      title: "Employer Not Found | ZibaHub",
      description: "Explore skilled-trade employers and career opportunities on ZibaHub.",
      path: `/employers/${slug}`,
    });
  }

  const description = (company.description || `Explore jobs and company information for ${company.name} on ZibaHub.`)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  return pageMeta({
    title: `${company.name} | Employer Profile | ZibaHub`,
    description,
    path: `/employers/${slug}`,
  });
}
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

