import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { getJobPricing, paymentsConfigured } from "@/lib/payments";
import { money } from "@/lib/format";
import { ApiForm } from "@/components/forms/ApiForm";

export default async function BillingPage() {
  const user = await getCurrentUser();
  const pricing = await getJobPricing().catch(() => null);
  const jobs = user ? await db.job.findMany({ where: { company: { ownerId: user.id } } }) : [];
  const payments = user ? await db.payment.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }) : [];
  return (
    <div>
      <h1 className="page-title">Billing</h1>
      {!paymentsConfigured() ? <div className="notice">Stripe is not configured. A feature request is recorded for manual review. No payment is marked successful.</div> : <p>Stripe checkout is configured.</p>}
      {pricing ? (
        <section className="card" aria-labelledby="placement-pricing">
          <h2 id="placement-pricing">Founding-employer placement prices</h2>
          <p>Standard job posting: {money(pricing.FREE, pricing.currency)}</p>
          <p>Featured vacancy: {money(pricing.FEATURED, pricing.currency)} one-time</p>
          <p>Premium vacancy: {money(pricing.PREMIUM, pricing.currency)} one-time</p>
          <p>Paid upgrades are per vacancy. There is no recurring subscription in this checkout.</p>
        </section>
      ) : null}
      <ApiForm action="/api/billing/checkout" submitLabel="Continue to secure checkout">
        <label>Job<select name="jobId">{jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}</select></label>
        <label>Tier<select name="tier"><option value="FEATURED">Featured</option><option value="PREMIUM">Premium</option></select></label>
      </ApiForm>
      <div className="list">{payments.map((payment) => <article key={payment.id} className="card">{payment.purpose} · {money(payment.amountCents, payment.currency)} · {payment.status}</article>)}</div>
    </div>
  );
}
