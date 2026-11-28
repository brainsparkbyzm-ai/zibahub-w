import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicJob, recordJobView } from "@/services/jobs";
import { load } from "@/lib/safe";
import { DatabaseNotice, SampleBadge } from "@/components/ui/States";
import { renderMarkdown } from "@/lib/markdown";
import { salaryRange, titleCaseEnum, formatDate } from "@/lib/format";
import { brand } from "@/config/brand";
import { ShareBar } from "@/features/jobs/ShareBar";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await load(() => getPublicJob(slug));

  if (!result.ok || !result.data) {
    return pageMeta({
      title: "Skilled Trade Job | ZibaHub",
      description: "Explore skilled-trade job opportunities across the United States, United Kingdom and Canada.",
      path: `/jobs/${slug}`,
    });
  }

  const job = result.data;
  const employerName = job.externalCompanyName || job.company?.name || "Employer";
  const location = [job.city, job.region, job.country].filter(Boolean).join(", ");
  const description = (job.description || `Explore the ${job.title} opportunity at ${employerName}.`)
    .replace(/[#*_`>\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  const roleTitle = job.title.replace(/\s+/g, " ").trim();
  const localContext = [job.city, job.region].filter(Boolean).join(", ");
  const titleWithLocation = localContext ? `${roleTitle} in ${localContext}` : roleTitle;
  const conciseTitle = titleWithLocation.length <= 50
    ? titleWithLocation
    : roleTitle.length <= 50
      ? roleTitle
      : `${roleTitle.slice(0, 49).trimEnd()}…`;

  return pageMeta({
    title: conciseTitle,
    description: `${location ? `${location}. ` : ""}${description}`.slice(0, 160),
    path: `/jobs/${slug}`,
  });
}
export default async function JobDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await load(() => getPublicJob(slug));
  if (!result.ok) return <div className="shell page"><DatabaseNotice /></div>;
  if (!result.data) notFound();
  const job = result.data;
  const employerName = job.externalCompanyName || job.company?.name || "Employer";
  await recordJobView(job.id).catch(() => undefined);
  const jobDescriptionHtml = renderMarkdown(job.description);
  const salaryUnit = job.salaryType === "HOURLY"
    ? "HOUR"
    : job.salaryType === "DAILY"
      ? "DAY"
      : job.salaryType === "ANNUAL"
        ? "YEAR"
        : null;
  // Google requires JobPosting baseSalary to be employer-provided. External
  // feed salary estimates are not asserted as employer-provided ZibaHub data.
  const baseSalary = job.companyId && salaryUnit && (job.salaryMin != null || job.salaryMax != null)
    ? {
        "@type": "MonetaryAmount",
        currency: job.salaryCurrency,
        value: {
          "@type": "QuantitativeValue",
          ...(job.salaryMin != null ? { minValue: job.salaryMin / 100 } : {}),
          ...(job.salaryMax != null ? { maxValue: job.salaryMax / 100 } : {}),
          unitText: salaryUnit,
        },
      }
    : undefined;
  const employmentTypeSchema: Record<string, { employmentType: string }> = {
    FULL_TIME: { employmentType: "FULL_TIME" },
    PART_TIME: { employmentType: "PART_TIME" },
    CONTRACT: { employmentType: "CONTRACTOR" },
    TEMPORARY: { employmentType: "TEMPORARY" },
    SEASONAL: { employmentType: "TEMPORARY" },
    // APPRENTICESHIP is intentionally omitted: it is not a supported
    // Google JobPosting employmentType value.
  };
  const schema = job.isSeed ? null : {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: jobDescriptionHtml,
    datePosted: job.postedAt.toISOString(),
    ...(job.expiresAt ? { validThrough: job.expiresAt.toISOString() } : {}),
    ...(employmentTypeSchema[job.employmentType] || {}),
    ...(job.externalId ? {
      identifier: {
        "@type": "PropertyValue",
        name: employerName,
        value: job.externalId,
      },
    } : {}),
    ...(baseSalary ? { baseSalary } : {}),
    ...(job.locationType === "REMOTE" ? {
      jobLocationType: "TELECOMMUTE",
      applicantLocationRequirements: {
        "@type": "Country",
        name: job.country,
      },
    } : {}),
    hiringOrganization: {
      "@type": "Organization",
      name: employerName,
      ...(job.company?.website ? { sameAs: job.company.website } : {}),
    },
    ...(job.locationType !== "REMOTE" ? {
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: job.city || undefined,
          addressRegion: job.region || undefined,
          addressCountry: job.country,
        },
      },
    } : {}),
    directApply: job.applicationMethod === "ONSITE",
  };
  return (
    <div className="shell page">
      {schema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /> : null}
      <p className="kicker">{job.trade?.name || "Trade role"}</p>
      <h1 className="page-title">{job.title}</h1>
      <p className="meta">
        {job.isSeed ? <SampleBadge /> : null}
        {job.company ? <Link href={`/employers/${job.company.slug}`}>{employerName}</Link> : <span>{employerName}</span>}
        <span>{[job.city, job.region, job.country].filter(Boolean).join(", ")}</span>
        <span>{titleCaseEnum(job.locationType)}</span>
        <span>{titleCaseEnum(job.employmentType)}</span>
        <span>Posted {formatDate(job.postedAt)}</span>
        {job.sourceUrl && /^https?:\/\//i.test(job.sourceUrl) ? <a href={job.sourceUrl} rel="nofollow noopener noreferrer">Original listing</a> : null}
      </p>
      <p><strong>{salaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryType)}</strong></p>
      {job.isSeed ? <div className="notice">Sample listing for development. Do not treat the employer, pay, or requirements as a verified opening.</div> : null}
      <div className="grid-2">
        <article className="prose card" dangerouslySetInnerHTML={{ __html: jobDescriptionHtml }} />
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

