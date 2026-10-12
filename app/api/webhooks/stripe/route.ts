import { getStripe } from "@/lib/payments";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return Response.json({ ok: false, error: { message: "Stripe webhook is not configured." } }, { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ ok: false }, { status: 400 });
  const event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const paymentId = session.metadata?.paymentId;
    if (paymentId) {
      await db.payment.update({ where: { id: paymentId }, data: { status: "SUCCEEDED", stripePaymentId: typeof session.payment_intent === "string" ? session.payment_intent : null } });
      await audit(null, "billing.webhook_paid", "Payment", paymentId);
    }
  }
  return Response.json({ ok: true });
}
