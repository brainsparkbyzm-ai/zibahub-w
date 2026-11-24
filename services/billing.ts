import { db } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { audit } from "@/lib/audit";
import { getJobPricing, getStripe, paymentsConfigured } from "@/lib/payments";
import { brand } from "@/config/brand";

export async function requestJobUpgrade(userId: string, jobId: string, tier: "FEATURED" | "PREMIUM") {
  const job = await db.job.findFirst({
    where: { id: jobId, company: { ownerId: userId, status: "PUBLISHED" } },
  });
  if (!job) throw new AppError(404, "not_found", "Job not found or company is not approved.");

  const pricing = await getJobPricing();
  const amount = pricing[tier];
  const currency = pricing.currency.trim().toUpperCase();
  if (!Number.isSafeInteger(amount) || amount <= 0 || !/^[A-Z]{3}$/.test(currency)) {
    throw new AppError(503, "pricing_unavailable", "Job upgrade pricing is not configured correctly.");
  }

  const payment = await db.payment.create({
    data: {
      userId,
      amountCents: amount,
      currency,
      purpose: `job_${tier.toLowerCase()}`,
      referenceId: job.id,
      status: "PENDING",
    },
  });

  const stripe = getStripe();
  if (!stripe) {
    await audit(userId, "billing.requested_manual", "Payment", payment.id, { tier });
    return { configured: false as const, paymentId: payment.id };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${brand.url}/employer/billing?payment=success`,
      cancel_url: `${brand.url}/employer/billing?payment=cancelled`,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: amount,
          product_data: { name: `ZibaHub ${tier} job` },
        },
      }],
      metadata: { paymentId: payment.id, jobId: job.id, tier },
    });

    if (!session.url) throw new AppError(502, "checkout_unavailable", "The payment provider did not return a checkout URL.");

    await db.payment.update({
      where: { id: payment.id },
      data: { stripeSessionId: session.id, status: "REQUIRES_ACTION" },
    });

    return { configured: true as const, url: session.url, paymentId: payment.id };
  } catch (error) {
    await db.payment.updateMany({
      where: { id: payment.id, status: "PENDING" },
      data: { status: "FAILED" },
    });
    throw error;
  }
}

export async function markPayment(actorId: string, paymentId: string, status: "SUCCEEDED" | "CANCELED" | "FAILED") {
  const existing = await db.payment.findUnique({ where: { id: paymentId } });
  if (!existing) throw new AppError(404, "not_found", "Payment not found.");
  if (existing.status === "SUCCEEDED") {
    if (status === "SUCCEEDED") return existing;
    throw new AppError(409, "payment_final", "A successful payment cannot be downgraded.");
  }

  const payment = await db.$transaction(async (tx) => {
    const changed = await tx.payment.updateMany({
      where: { id: paymentId, status: { in: ["PENDING", "REQUIRES_ACTION"] } },
      data: { status },
    });
    if (changed.count !== 1) throw new AppError(409, "payment_state", "Payment status has already changed.");

    if (status === "SUCCEEDED" && (existing.purpose === "job_featured" || existing.purpose === "job_premium")) {
      if (!existing.referenceId) throw new AppError(409, "payment_reference", "The payment is missing its job reference.");
      const job = await tx.job.findFirst({
        where: {
          id: existing.referenceId,
          company: { ownerId: existing.userId, status: "PUBLISHED" },
        },
      });
      if (!job) throw new AppError(409, "job_not_eligible", "The job or approved company could not be verified.");
      await tx.job.update({
        where: { id: job.id },
        data: { tier: existing.purpose === "job_featured" ? "FEATURED" : "PREMIUM" },
      });
    }

    return tx.payment.findUniqueOrThrow({ where: { id: paymentId } });
  });

  await audit(actorId, "billing.mark", "Payment", payment.id, { status });
  return payment;
}

export function billingReady() {
  return paymentsConfigured();
}
