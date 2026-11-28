import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { getJobPricing } from "@/lib/payments";
import { money } from "@/lib/format";

export const metadata = pageMeta({
  title: "Hire Skilled Tradespeople",
  description: "Create a ZibaHub employer profile and submit electrician, HVAC, plumbing, welding and construction vacancies for review.",
  path: "/for-employers",
});

export default async function ForEmployersPage() {
  const pricing = await getJobPricing().catch(() => null);

  return (
    <main className="shell page">
      <h1 className="page-title">Hire skilled tradespeople with ZibaHub</h1>
      <p>
        ZibaHub is building a focused careers platform for employers hiring across
        electrical, HVAC, plumbing, welding, construction, maintenance and related trades.
        Set up your company profile and submit genuine vacancies for review.
      </p>

      <section className="card" aria-labelledby="employer-start">
        <h2 id="employer-start">Get your company started</h2>
        <ol>
          <li>Create an employer account and provide your company details.</li>
          <li>Complete your company profile with your website, location and hiring information.</li>
          <li>Submit a vacancy with a clear role, trade, location, pay details where available and a working application route.</li>
          <li>Company profiles and vacancies may require moderation before they appear publicly.</li>
        </ol>
        <p>
          <Link className="btn btn-amber" href="/sign-up">Create employer account</Link>
          {" "}
          <Link href="/employer/profile">Already registered? Complete company profile</Link>
        </p>
      </section>

      <section aria-labelledby="employer-why">
        <h2 id="employer-why">Built around skilled-trade hiring</h2>
        <ul>
          <li>Trade-focused categories for roles such as electrician, HVAC technician, plumber and welder.</li>
          <li>Company profile fields for website, location, company size and description.</li>
          <li>Job submission through an employer account, with a review step before public publication.</li>
          <li>Public employer and vacancy pages to help candidates understand the opportunity.</li>
        </ul>
      </section>

      <section aria-labelledby="employer-quality">
        <h2 id="employer-quality">What to include in a strong vacancy</h2>
        <ul>
          <li>Exact trade, job title, work location and employment type.</li>
          <li>Required experience, licences, tickets or certifications for that jurisdiction.</li>
          <li>Pay range and pay period where possible, plus hours, overtime and travel expectations.</li>
          <li>Clear responsibilities, safety expectations and a working application destination.</li>
        </ul>
      </section>

      <section className="card" aria-labelledby="employer-membership">
        <h2 id="employer-membership">Founding-employer pricing</h2>
        {pricing ? (
          <>
            <p>Standard vacancy: {money(pricing.FREE, pricing.currency)}.</p>
            <p>Featured vacancy: {money(pricing.FEATURED, pricing.currency)} one-time.</p>
            <p>Premium vacancy: {money(pricing.PREMIUM, pricing.currency)} one-time.</p>
            <p>Pay only for the vacancy upgrade you choose. No recurring subscription is charged through this checkout.</p>
          </>
        ) : <p>Current placement prices will be shown in your employer billing area before checkout.</p>}
        <p>Founding employers can create a company profile and submit a standard vacancy for review without a paid upgrade.</p>
        <p><Link href="/sign-up">Create your employer account</Link></p>
      </section>
    </main>
  );
}
