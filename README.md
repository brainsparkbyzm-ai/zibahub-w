# ZibaHub

Production-oriented marketplace for skilled-trade jobs, apprenticeships, training, salaries, employers, and sponsored content across the United States, the United Kingdom, and Canada.

The brand name, colors, and metadata live in `config/brand.ts`.

## Stack

- Next.js, TypeScript, React
- PostgreSQL and Prisma
- Session cookies signed with `AUTH_SECRET`
- Passwords hashed with bcrypt
- Stripe and SMTP only when environment variables are set

## Local setup

```bash
cp .env.example .env
# Put a random 32+ character AUTH_SECRET in .env
docker compose up -d
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Development admin, only after seeding:

- Email: `admin@zibahub.example`
- Password: `ZibaHub-Dev-Admin-2026!`

Change both before any shared deployment. The seed script refuses to run when `NODE_ENV=production` unless `ALLOW_SEED=true`.

Sample employers, jobs, guides, and salary bands are labeled in the interface and excluded from JobPosting and Article structured data. They are not verified market information.

## Checks

```bash
npm run typecheck
npm run build
```

## What is intentionally not faked

- Email is not described as sent unless SMTP is configured.
- Payments are not marked successful unless Stripe confirms them or an admin records a manual decision in the audit log.
- Affiliate buttons do not invent merchant URLs.
- Empty directories stay empty.
