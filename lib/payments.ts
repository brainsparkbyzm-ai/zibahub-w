import Stripe from "stripe";
import { db } from "@/lib/db";

export type JobPricing = {
  currency: string;
  FREE: number;
  FEATURED: number;
  PREMIUM: number;
};

export const defaultPricing: JobPricing = { currency: "USD", FREE: 0, FEATURED: 14900, PREMIUM: 29900 };

export async function getJobPricing(): Promise<JobPricing> {
  const row = await db.siteSetting.findUnique({ where: { key: "job_pricing" } });
  if (!row || typeof row.value !== "object" || row.value == null || Array.isArray(row.value)) return defaultPricing;
  const value = row.value as Partial<JobPricing>;
  return {
    currency: typeof value.currency === "string" ? value.currency : defaultPricing.currency,
    FREE: Number(value.FREE ?? 0),
    FEATURED: Number(value.FEATURED ?? defaultPricing.FEATURED),
    PREMIUM: Number(value.PREMIUM ?? defaultPricing.PREMIUM),
  };
}

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function paymentsConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
