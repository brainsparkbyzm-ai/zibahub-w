import Stripe from "stripe";
import { getStripe } from "@/lib/payments";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return Response.json({ ok: false, error: { message: "Stripe webhook is not configured." } }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ ok: false }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return Response.json({ ok: false, error: { message: "Invalid webhook signature." } }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
    return Response.json({ ok: true, ignored: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return Response.json({ ok: true, pending: true });
  }

  const paymentId = session.metadata?.paymentId;
  const jobId = session.metadata?.jobId;
  const tier = session.metadata?.tier;
  if (!paymentId || !jobId || (tier !== "FEATURED" && tier !== "PREMIUM")) {
    return Response.json({ ok: true, ignored: true });
  }

  const payment = await db.payment.findUnique({ where: { id: paymentId } });
  if (!payment) return Response.json({ ok: false, error: { message: "Payment record not found." } }, { status: 503 });

  if (!payment.stripeSessionId) {
    return Response.json({ ok: false, error: { message: "Checkout session is still being recorded." } }, { status: 503 });
  }
  if (
    payment.stripeSessionId !== session.id ||
    payment.referenceId !== jobId ||
    payment.purpose !== `job_${tier.toLowerCase()}` ||
    session.amount_total !== payment.amountCents ||
    session.currency?.toUpperCase() !== payment.currency.toUpperCase()
  ) {
    await audit(null, "billing.webhook_rejected", "Payment", payment.id, { reason: "session_payment_mismatch" });
    return Response.json({ ok: true, ignored: true });
  }

  if (payment.status === "SUCCEEDED") {
    return Response.json({ ok: true, duplicate: true });
  }
  if (payment.status !== "PENDING" && payment.status !== "REQUIRES_ACTION") {
    await audit(null, "billing.webhook_rejected", "Payment", payment.id, { reason: "payment_not_pending" });
    return Response.json({ ok: true, ignored: true });
  }

  const applied = await db.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.updateMany({
      where: {
        id: payment.id,
        stripeSessionId: session.id,
        status: { in: ["PENDING", "REQUIRES_ACTION"] },
      },
      data: {
        status: "SUCCEEDED",
        stripePaymentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
      },
    });
    if (updatedPayment.count !== 1) return false;

    const updatedJob = await tx.job.updateMany({
      where: {
        id: jobId,
        company: { ownerId: payment.userId, status: "PUBLISHED" },
      },
      data: { tier },
    });
    if (updatedJob.count !== 1) throw new Error("Paid job upgrade could not be linked to an approved company job.");
    return true;
  });

  if (!applied) {
    const latest = await db.payment.findUnique({ where: { id: payment.id } });
    if (latest?.status === "SUCCEEDED" && latest.stripeSessionId === session.id) {
      return Response.json({ ok: true, duplicate: true });
    }
    await audit(null, "billing.webhook_rejected", "Payment", payment.id, { reason: "payment_state_changed" });
    return Response.json({ ok: true, ignored: true });
  }

  await audit(null, "billing.webhook_paid", "Payment", payment.id, { tier, jobId });
  return Response.json({ ok: true });
}
