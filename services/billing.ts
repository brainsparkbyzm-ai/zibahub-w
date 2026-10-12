import { db } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { audit } from "@/lib/audit";
import { getJobPricing, getStripe, paymentsConfigured } from "@/lib/payments";
import { brand } from "@/config/brand";

export async function requestJobUpgrade(userId: string, jobId: string, tier: "FEATURED" | "PREMIUM") {
  const job = await db.job.findFirst({ where: { id: jobId, company: { ownerId: userId } } });
  if (!job) throw new AppError(404, "not_found", "Job not found.");
  const pricing = await getJobPricing();
  const amount = pricing[tier];
  const payment = await db.payment.create({
    data: { userId, amountCents: amount, currency: pricing.currency, purpose: `job_${tier.toLowerCase()}`, referenceId: job.id, status: "PENDING" },
  });
  await db.job.update({ where: { id: job.id }, data: { tier } });
  const stripe = getStripe();
  if (!stripe) {
    await audit(userId, "billing.requested_manual", "Payment", payment.id, { tier });
    return { configured: false as const, paymentId: payment.id };
  }
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${brand.url}/employer/billing?payment=success`,
    cancel_url: `${brand.url}/employer/billing?payment=cancelled`,
    line_items: [{ quantity: 1, price_data: { currency: pricing.currency.toLowerCase(), unit_amount: amount, product_data: { name: `ZibaHub ${tier} job` } } }],
    metadata: { paymentId: payment.id, jobId: job.id },
  });
  await db.payment.update({ where: { id: payment.id }, data: { stripeSessionId: session.id, status: "REQUIRES_ACTION" } });
  return { configured: true as const, url: session.url, paymentId: payment.id };
}

export async function markPayment(actorId: string, paymentId: string, status: "SUCCEEDED" | "CANCELED" | "FAILED") {
  const payment = await db.payment.update({ where: { id: paymentId }, data: { status } });
  await audit(actorId, "billing.mark", "Payment", payment.id, { status });
  return payment;
}

export function billingReady() {
  return paymentsConfigured();
}
