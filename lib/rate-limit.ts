import { db } from "@/lib/db";
import { AppError } from "@/lib/errors";

export async function rateLimit(key: string, limit: number, windowMs: number) {
  const now = new Date();
  const existing = await db.rateBucket.findUnique({ where: { key } });
  if (!existing || now.getTime() - existing.windowStart.getTime() > windowMs) {
    await db.rateBucket.upsert({
      where: { key },
      create: { key, count: 1, windowStart: now },
      update: { count: 1, windowStart: now },
    });
    return;
  }
  if (existing.count >= limit) {
    throw new AppError(429, "rate_limited", "Too many attempts. Wait a few minutes and try again.");
  }
  await db.rateBucket.update({ where: { key }, data: { count: { increment: 1 } } });
}
