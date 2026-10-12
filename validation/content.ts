import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(40).max(12000),
  tradeId: z.string().optional(),
  country: z.enum(["United States", "United Kingdom", "Canada"]),
  region: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  salaryMin: z.coerce.number().int().nonnegative().optional(),
  salaryMax: z.coerce.number().int().nonnegative().optional(),
  salaryCurrency: z.string().length(3).default("USD"),
  salaryType: z.enum(["HOURLY", "ANNUAL", "DAILY", "UNSPECIFIED"]).default("ANNUAL"),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "APPRENTICESHIP", "TEMPORARY", "SEASONAL"]),
  experience: z.string().max(40).optional(),
  skills: z.string().max(400).optional(),
  requirements: z.string().max(4000).optional(),
  benefits: z.string().max(4000).optional(),
  locationType: z.enum(["ON_SITE", "REMOTE", "HYBRID"]),
  applicationMethod: z.enum(["ONSITE", "URL", "EMAIL"]),
  applicationTarget: z.string().max(240).optional(),
  expiresAt: z.string().optional(),
  tier: z.enum(["FREE", "FEATURED", "PREMIUM"]).default("FREE"),
  isApprenticeship: z.coerce.boolean().optional(),
});

export const alertSchema = z.object({
  name: z.string().trim().min(2).max(80),
  keywords: z.string().max(80).optional(),
  country: z.string().max(40).optional(),
  tradeId: z.string().optional(),
  salaryMin: z.coerce.number().int().optional(),
  frequency: z.enum(["INSTANT", "DAILY", "WEEKLY"]).default("DAILY"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().max(40).optional(),
  headline: z.string().max(140).optional(),
  bio: z.string().max(2000).optional(),
  country: z.string().max(40).optional(),
  region: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  experienceYears: z.coerce.number().int().min(0).max(60).optional(),
  skills: z.string().max(400).optional(),
  tradeId: z.string().optional(),
  resumeUrl: z.string().url().optional().or(z.literal("")),
});

export const companySchema = z.object({
  name: z.string().trim().min(2).max(120),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().max(4000).optional(),
  country: z.string().max(40).optional(),
  region: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  size: z.string().max(40).optional(),
});

export const guestPostSchema = z.object({
  companyName: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(80),
  contactEmail: z.string().trim().email(),
  title: z.string().trim().min(6).max(160),
  content: z.string().trim().min(80).max(20000),
  category: z.string().trim().min(2).max(80),
  website: z.string().url().optional().or(z.literal("")),
  requestedDate: z.string().optional(),
  sponsored: z.coerce.boolean().optional(),
});

export const reportSchema = z.object({
  reason: z.string().trim().min(3).max(80),
  details: z.string().max(1000).optional(),
});
