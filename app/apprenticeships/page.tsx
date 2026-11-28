import Link from "next/link";
import { SUPPORTED_JOB_COUNTRIES } from "@/config/markets";
import { listApprenticeships } from "@/services/content";
import { load } from "@/lib/safe";
import { DatabaseNotice, EmptyState, SampleBadge } from "@/components/ui/States";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Apprenticeships", description: "Compare skilled-trade apprenticeships by country, trade, provider, city, duration and paid status. Check requirements before applying.", path: "/apprenticeships" });

export default async function ApprenticeshipsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const query = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value || ""]));
  const result = await load(() => listApprenticeships(query));
  return (
    <div className="shell page zh-directory-page zh-page-apprenticeships">
      <h1 className="page-title">Apprenticeships</h1>
      <p>Compare published skilled-trade programmes by country, trade, city, provider, duration and whether the opportunity is marked paid. Listings can differ in entry requirements, training structure and application process, so read each programme description carefully.</p>
      <p>Before applying, confirm the provider, employer, pay or wage arrangement, expected hours, training location and current application status on the programme's official website. A directory listing is a starting point, not a guarantee that a vacancy is still open or that a qualification is recognised in every jurisdiction.</p>
      <section aria-labelledby="apprenticeship-checklist">
        <h2 id="apprenticeship-checklist">How to compare a programme</h2>
        <ol>
          <li>Check the occupation, level and entry requirements against your previous experience.</li>
          <li>Compare paid status, wage information, duration, working hours and where training takes place.</li>
          <li>Ask who provides supervision, assessment and any recognised qualification.</li>
          <li>Use the employer or training provider's official application page to confirm deadlines and availability.</li>
        </ol>
        <p>Useful official starting points include the <a href="https://www.apprenticeship.gov/apprenticeship-job-finder" target="_blank" rel="noopener noreferrer">United States Apprenticeship Job Finder</a>, <a href="https://www.gov.uk/apply-apprenticeship" target="_blank" rel="noopener noreferrer">Find an apprenticeship in England</a> and <a href="https://red-seal.ca/eng/resources/related-sites.shtml" target="_blank" rel="noopener noreferrer">Canadian Red Seal related trade resources</a>.</p>
      </section>
      <form className="filters glass" action="/apprenticeships">
        <label>Country<select name="country" defaultValue={query.country || ""}><option value="">Any</option>{SUPPORTED_JOB_COUNTRIES.map((country) => <option key={country}>{country}</option>)}</select></label>
        <label>Trade slug<input name="trade" defaultValue={query.trade || ""} /></label>
        <label>City<input name="city" defaultValue={query.city || ""} /></label>
        <label>Provider<input name="provider" defaultValue={query.provider || ""} /></label>
        <label>Duration<input name="duration" defaultValue={query.duration || ""} /></label>
        <label>Paid<select name="paid" defaultValue={query.paid || ""}><option value="">Any</option><option value="1">Paid</option><option value="0">Unpaid</option></select></label>
        <label>Entry requirement keyword<input name="requirements" defaultValue={query.requirements || ""} /></label>
        <button className="btn" type="submit">Filter</button>
      </form>
      {!result.ok ? <DatabaseNotice /> : result.data.length === 0 ? <EmptyState title="No apprenticeships" body="Published programmes will appear here." /> : (
        <div className="list">{result.data.map((item) => <article key={item.id} className="card"><h3><Link href={`/apprenticeships/${item.slug}`}>{item.title}</Link></h3><p>{item.providerName} · {item.country} · {item.paid ? "Paid" : "Unpaid"} {item.isSeed ? <SampleBadge /> : null}</p></article>)}</div>
      )}
    </div>
  );
}
