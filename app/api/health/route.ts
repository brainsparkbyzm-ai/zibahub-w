import { db } from "@/lib/db";
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ ok: true, database: "up", email: Boolean(process.env.SMTP_HOST), payments: Boolean(process.env.STRIPE_SECRET_KEY) });
  } catch {
    return Response.json({ ok: false, database: "down" }, { status: 503 });
  }
}
