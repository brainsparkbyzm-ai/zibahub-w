import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { uniqueSlug } from "@/lib/format";

const TRADES = [
  { slug: "electrician", keyword: "electrician" },
  { slug: "hvac", keyword: "HVAC technician" },
  { slug: "plumber", keyword: "plumber" },
  { slug: "welder", keyword: "welder" },
  { slug: "construction", keyword: "construction worker" },
  { slug: "carpenter", keyword: "carpenter" },
  { slug: "mechanic", keyword: "mechanic" },
  { slug: "roofer", keyword: "roofer" },
];

const INDUSTRIES = [
  { slug: "hotels", keyword: "hotel hospitality front desk housekeeping guest services" },
  { slug: "grocery", keyword: "grocery supermarket cashier stocker produce deli" },
  { slug: "trainers", keyword: "personal trainer fitness trainer gym instructor fitness coach" },
];

type JoobleJob = {
  title?: string;
  location?: string;
  snippet?: string;
  salary?: string;
  source?: string;
  type?: string;
  link?: string;
  company?: string;
  updated?: string;
};

function cleanText(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSalary(value?: string) {
  if (!value) {
    return { salaryMin: null, salaryMax: null, salaryCurrency: "USD", salaryType: "UNSPECIFIED" as const };
  }

  const currency = value.includes("£") ? "GBP" : value.includes("€") ? "EUR" : "USD";
  const numbers = [...value.matchAll(/[\d,]+(?:\.\d+)?/g)]
    .map((match) => Number(match[0].replace(/,/g, "")))
    .filter((number) => Number.isFinite(number) && number > 0);

  if (!numbers.length) {
    return { salaryMin: null, salaryMax: null, salaryCurrency: currency, salaryType: "UNSPECIFIED" as const };
  }

  const type = /hour|hr\b|per hour/i.test(value)
    ? "HOURLY" as const
    : /day|daily/i.test(value)
      ? "DAILY" as const
      : /year|annual|annum/i.test(value)
        ? "ANNUAL" as const
        : "UNSPECIFIED" as const;

  return {
    salaryMin: Math.round(Math.min(...numbers) * 100),
    salaryMax: Math.round(Math.max(...numbers) * 100),
    salaryCurrency: currency,
    salaryType: type,
  };
}

function parseEmployment(value?: string) {
  const type = (value || "").toLowerCase();
  if (type.includes("apprentice")) return "APPRENTICESHIP" as const;
  if (type.includes("part")) return "PART_TIME" as const;
  if (type.includes("contract")) return "CONTRACT" as const;
  if (type.includes("temporary") || type.includes("temp")) return "TEMPORARY" as const;
  if (type.includes("season")) return "SEASONAL" as const;
  return "FULL_TIME" as const;
}

function parseLocation(value?: string) {
  const parts = (value || "").split(",").map((part) => part.trim()).filter(Boolean);
  return {
    city: parts.length > 1 ? parts.slice(0, -1).join(", ") : parts[0] || null,
    region: parts.length > 1 ? parts[parts.length - 1] : null,
  };
}

export async function importJoobleJobs(options: { dryRun?: boolean } = {}) {
  const dryRun = options.dryRun ?? false;
  const key = process.env.JOOBLE_API_KEY;

  if (!key) throw new Error("JOOBLE_API_KEY is not configured.");

  let imported = 0;
  let updated = 0;
  let skipped = 0;
  let searches = 0;
  const errors: string[] = [];
  const seenExternalIds = new Set<string>();
  const candidates: { externalId: string; title: string; data: any }[] = [];

  let trades;
  try {
    trades = await db.trade.findMany({
      where: { slug: { in: TRADES.map((trade) => trade.slug) } },
      select: { id: true, slug: true },
    });
  } catch (error) {
    return {
      dryRun, imported, updated, skipped, searches,
      errors: [`Database trade lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }

  const tradeMap = new Map(trades.map((trade) => [trade.slug, trade.id]));

  const importSearches = [
    ...TRADES.map((item) => ({ ...item, tradeId: tradeMap.get(item.slug) })),
    ...INDUSTRIES.map((item) => ({ ...item, tradeId: null as string | null })),
  ];

  for (const tradeConfig of importSearches) {
    const tradeId = tradeConfig.tradeId;

    if (tradeId === undefined) {
      errors.push(`Trade not found: ${tradeConfig.slug}`);
      continue;
    }

    try {
      const response = await fetch(`https://jooble.org/api/${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: tradeConfig.keyword,
          location: "United States",
          page: "1",
        }),
        signal: AbortSignal.timeout(20000),
      });

      if (!response.ok) {
        errors.push(`Jooble ${tradeConfig.slug}: HTTP ${response.status}`);
        continue;
      }

      const payload = await response.json() as { jobs?: JoobleJob[] };
      searches++;

      for (const item of payload.jobs || []) {
        const title = cleanText(item.title || "");
        const link = (item.link || "").trim();

        if (!title || !link || !/^https?:\/\//i.test(link)) {
          skipped++;
          continue;
        }

        const description = cleanText(item.snippet || "");
        if (!description) {
          skipped++;
          continue;
        }

        const updatedAt = item.updated ? new Date(item.updated) : new Date();
        const postedAt = Number.isNaN(updatedAt.getTime()) ? new Date() : updatedAt;

        if (postedAt.getTime() > Date.now() + 86400000 ||
            Date.now() - postedAt.getTime() > 30 * 86400000) {
          skipped++;
          continue;
        }

        const externalId = createHash("sha256").update(link).digest("hex");

        if (seenExternalIds.has(externalId)) {
          skipped++;
          continue;
        }
        seenExternalIds.add(externalId);

        const location = parseLocation(item.location);
        const salary = parseSalary(item.salary);
        const employmentType = parseEmployment(item.type);
        const locationType: "REMOTE" | "ON_SITE" =
          /remote/i.test(item.location || "") ? "REMOTE" : "ON_SITE";

        candidates.push({
          externalId,
          title,
          data: {
            title,
            description,
            companyId: null,
            externalCompanyName: cleanText(item.company || "") || "Employer not listed",
            source: "JOOBLE",
            externalId,
            sourceUrl: link,
            tradeId,
            country: "United States",
            region: location.region,
            city: location.city,
            salaryMin: salary.salaryMin,
            salaryMax: salary.salaryMax,
            salaryCurrency: salary.salaryCurrency,
            salaryType: salary.salaryType,
            employmentType,
            experience: null,
            skills: [],
            requirements: null,
            benefits: null,
            locationType,
            applicationMethod: "URL",
            applicationTarget: link,
            postedAt,
            expiresAt: new Date(postedAt.getTime() + 30 * 86400000),
            tier: "FREE",
            status: "ACTIVE",
            isApprenticeship: employmentType === "APPRENTICESHIP",
            isSeed: false,
          },
        });
      }
    } catch (error) {
      errors.push(`${tradeConfig.slug}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  if (!candidates.length) {
    return { dryRun, imported, updated, skipped, searches, errors };
  }

  let existingIds: Set<string>;

  try {
    const existingJobs = await db.job.findMany({
      where: {
        source: "JOOBLE",
        externalId: { in: candidates.map((item) => item.externalId) },
      },
      select: { externalId: true },
    });

    existingIds = new Set(existingJobs.map((job) => job.externalId).filter((id): id is string => Boolean(id)));
  } catch (error) {
    errors.push(`Database existing-job lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    return {
      dryRun, imported: 0, updated: 0,
      skipped, searches, failed: candidates.length, errors,
    };
  }

  for (const candidate of candidates) {
    const existing = existingIds.has(candidate.externalId);

    if (dryRun) {
      if (existing) updated++;
      else imported++;
      continue;
    }

    try {
      await db.job.upsert({
        where: {
          source_externalId: {
            source: "JOOBLE",
            externalId: candidate.externalId,
          },
        },
        create: {
          ...candidate.data,
          slug: uniqueSlug(candidate.title),
        },
        update: candidate.data,
      });

      if (existing) updated++;
      else imported++;
    } catch (error) {
      errors.push(`Job ${candidate.externalId.slice(0, 12)}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  return { dryRun, imported, updated, skipped, searches, errors };
}
