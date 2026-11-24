import { db } from "@/lib/db";
import { paymentsConfigured } from "@/lib/payments";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({
      ok: true,
      database: "up",
      email: Boolean(process.env.SMTP_HOST && process.env.EMAIL_FROM),
      payments: paymentsConfigured(),
      jooble: Boolean(process.env.JOOBLE_API_KEY),
      cron: Boolean(process.env.CRON_SECRET),
    });
  } catch {
    return Response.json({ ok: false, database: "down" }, { status: 503 });
  }
}
