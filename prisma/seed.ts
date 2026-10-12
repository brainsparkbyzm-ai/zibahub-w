import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const trades = [
  ["HVAC", "Heating, ventilation, and air conditioning", "Service, installation, and controls work for residential and commercial systems."],
  ["Electrician", "Electrical installation and maintenance", "Wiring, panels, troubleshooting, and code-aware electrical work."],
  ["Plumber", "Plumbing and pipefitting", "Water, drainage, fixtures, and commercial pipe systems."],
  ["Welder", "Welding and fabrication", "Shop and field welding across common processes."],
  ["Construction", "General construction", "Site work, coordination, and building trades support."],
  ["Mechanic", "Vehicle and equipment mechanics", "Diagnosis and repair for vehicles and shop equipment."],
  ["Carpenter", "Carpentry and finish work", "Framing, finish carpentry, and site woodwork."],
  ["Roofer", "Roofing", "Installation and repair of roof systems."],
  ["Heavy Equipment", "Heavy equipment operation", "Operation and basic care of site machinery."],
  ["Industrial Maintenance", "Industrial maintenance", "Plant equipment upkeep, downtime response, and preventive work."],
];

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_SEED !== "true") {
    throw new Error("Refusing to seed production. Set ALLOW_SEED=true only if you intend to load sample records.");
  }
  const email = process.env.SEED_ADMIN_EMAIL || "admin@zibahub.example";
  const password = process.env.SEED_ADMIN_PASSWORD || "ZibaHub-Dev-Admin-2026!";
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await db.user.upsert({
    where: { email },
    update: { role: "ADMIN", status: "ACTIVE", emailVerifiedAt: new Date(), passwordHash },
    create: { email, name: "ZibaHub Admin", role: "ADMIN", status: "ACTIVE", emailVerifiedAt: new Date(), passwordHash },
  });

  const tradeRows = [];
  for (const [name, summary, description] of trades) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    tradeRows.push(await db.trade.upsert({
      where: { slug },
      update: { name, summary, description, status: "PUBLISHED", isSeed: true },
      create: { name, slug, summary, description, status: "PUBLISHED", isSeed: true },
    }));
  }

  const employer = await db.user.upsert({
    where: { email: "hiring@northline.example" },
    update: {},
    create: { email: "hiring@northline.example", name: "Sample Hiring Desk", role: "EMPLOYER", passwordHash, emailVerifiedAt: new Date() },
  });
  const company = await db.company.upsert({
    where: { ownerId: employer.id },
    update: { status: "PUBLISHED", isSeed: true },
    create: {
      ownerId: employer.id,
      name: "Northline Mechanical (sample)",
      slug: "northline-mechanical-sample",
      description: "Fictional sample employer for development. Not a real company.",
      country: "United States",
      region: "Texas",
      city: "Austin",
      status: "PUBLISHED",
      isSeed: true,
    },
  });

  const electrician = tradeRows.find((trade) => trade.slug === "electrician");
  await db.job.upsert({
    where: { slug: "sample-journeyman-electrician-austin" },
    update: {},
    create: {
      slug: "sample-journeyman-electrician-austin",
      title: "Sample journeyman electrician",
      description: "This is development seed content.\n\n- Not a real opening\n- Pay figures are illustrative\n- Do not apply as if this employer exists",
      companyId: company.id,
      tradeId: electrician?.id,
      country: "United States",
      region: "Texas",
      city: "Austin",
      salaryMin: 6200000,
      salaryMax: 8400000,
      salaryCurrency: "USD",
      salaryType: "ANNUAL",
      employmentType: "FULL_TIME",
      experience: "Journeyman",
      skills: ["Commercial wiring", "Troubleshooting"],
      requirements: "Sample requirement text only.",
      benefits: "Sample benefit text only.",
      locationType: "ON_SITE",
      applicationMethod: "ONSITE",
      tier: "FEATURED",
      status: "ACTIVE",
      isSeed: true,
    },
  });

  await db.salaryBand.deleteMany({ where: { isSeed: true, sourceNote: { contains: "Illustrative development seed" } } });
  for (const trade of tradeRows) {
    await db.salaryBand.create({
      data: {
        tradeId: trade.id,
        country: "United States",
        experience: "Journeyman",
        currency: "USD",
        lowCents: 4800000,
        midCents: 6800000,
        highCents: 9200000,
        sourceNote: "Illustrative development seed. Not a verified wage survey.",
        isSeed: true,
      },
    });
  }

  await db.guide.upsert({
    where: { slug: "how-to-read-a-sample-listing" },
    update: {},
    create: {
      slug: "how-to-read-a-sample-listing",
      title: "How to read a sample listing",
      excerpt: "Sample rows are labeled and are not verified market data.",
      content: "ZibaHub marks development records as sample.\n\nDo not treat sample employers, pay bands, or courses as real-world claims.",
      category: "Career Guides",
      status: "PUBLISHED",
      isSeed: true,
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });

  await db.siteSetting.upsert({
    where: { key: "job_pricing" },
    update: {},
    create: { key: "job_pricing", value: { currency: "USD", FREE: 0, FEATURED: 14900, PREMIUM: 29900 } },
  });

  console.log(`Seeded admin ${email}. Development password is the SEED_ADMIN_PASSWORD value.`);
}

main().finally(() => db.$disconnect());
