import { db } from "@/lib/db";
import { AppError } from "@/lib/errors";

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<number> {
  const now = new Date();
  const cutoff = new Date(now.getTime() - windowMs);

  // Atomic PostgreSQL upsert prevents parallel requests from bypassing the counter.
  const rows = await db.$queryRaw<Array<{ count: number }>>`
    INSERT INTO "RateBucket" ("key", "count", "windowStart")
    VALUES (${key}, 1, ${now})
    ON CONFLICT ("key") DO UPDATE
    SET
      "count" = CASE
        WHEN "RateBucket"."windowStart" <= ${cutoff} THEN 1
        ELSE "RateBucket"."count" + 1
      END,
      "windowStart" = CASE
        WHEN "RateBucket"."windowStart" <= ${cutoff} THEN ${now}
        ELSE "RateBucket"."windowStart"
      END
    RETURNING "count"
  `;

  const count = Number(rows[0]?.count ?? 1);
  if (count > limit) {
    throw new AppError(429, "rate_limited", "Too many attempts. Wait a few minutes and try again.");
  }
  return count;
}
