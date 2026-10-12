import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicJob, recordJobView } from "@/services/jobs";
import { load } from "@/lib/safe";
import { DatabaseNotice, SampleBadge } from "@/components/ui/States";
import { renderMarkdown } from "@/lib/markdown";
import { salaryRange, titleCaseEnum, formatDate } from "@/lib/format";
import { brand } from "@/config/brand";
import { ShareBar } from "@/features/jobs/ShareBar";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " "), description: "Skilled-trade job on ZibaHub." };
}

export default async function JobDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await load(() => getPublicJob(slug));
  if (!result.ok) return <div className="shell page"><DatabaseNotice /></div>;
  if (!result.data) notFound();
  const job = result.data;
  await recordJobView(job.id).catch(() => undefined);
  const schema = job.isSeed ? null : {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt.toISOString(),
    employmentType: job.employmentType,
    hiringOrganization: { "@type": "Organization", name: job.company.name },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.city || undefined, addressRegion: job.region || undefined, addressCountry: job.country } },
  };
  return (
    <div className="shell page">
      {schema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /> : null}
      <p className="kicker">{job.trade?.name || "Trade role"}</p>
      <h1 className="page-title">{job.title}</h1>
      <p className="meta">
        {job.isSeed ? <SampleBadge /> : null}
        <Link href={`/employers/${job.company.slug}`}>{job.company.name}</Link>
        <span>{[job.city, job.region, job.country].filter(Boolean).join(", ")}</span>
        <span>{titleCaseEnum(job.locationType)}</span>
        <span>{titleCaseEnum(job.employmentType)}</span>
        <span>Posted {formatDate(job.postedAt)}</span>
      </p>
      <p><strong>{salaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryType)}</strong></p>
      {job.isSeed ? <div className="notice">Sample listing for development. Do not treat the employer, pay, or requirements as a verified opening.</div> : null}
      <div className="grid-2">
        <article className="prose card" dangerouslySetInnerHTML={{ __html: renderMarkdown(job.description) }} />
        <aside className="card">
          <h2>Apply</h2>
          {job.applicationMethod === "ONSITE" ? <Link className="btn btn-amber" href={`/jobs/${job.slug}/apply`}>Apply on ZibaHub</Link> : job.applicationMethod === "URL" && job.applicationTarget ? <a className="btn" href={job.applicationTarget} rel="nofollow noopener noreferrer">Employer application</a> : job.applicationMethod === "EMAIL" && job.applicationTarget ? <a className="btn" href={`mailto:${job.applicationTarget}`}>Email the employer</a> : <p>Application method is not configured.</p>}
          <form action={`/api/jobs/${job.slug}/save`} method="post"><button className="btn-line" type="submit">Save job</button></form>
          <ShareBar url={`${brand.url}/jobs/${job.slug}`} />
          <h3>Report</h3>
          <form action={`/api/jobs/${job.slug}/report`} method="post" style={{ display: "grid", gap: 8 }}>
            <input name="reason" required placeholder="Reason" />
            <textarea name="details" placeholder="What looks wrong?" />
            <button className="btn-line" type="submit">Report listing</button>
          </form>
        </aside>
      </div>
      {job.requirements ? <section className="card"><h2>Requirements</h2><div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(job.requirements) }} /></section> : null}
      {job.benefits ? <section className="card"><h2>Benefits</h2><div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(job.benefits) }} /></section> : null}
      {job.skills.length ? <p className="chips">{job.skills.map((skill) => <span className="chip" key={skill}>{skill}</span>)}</p> : null}
    </div>
  );
}
