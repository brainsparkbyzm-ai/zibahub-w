# Deployment

This repository is prepared for Vercel plus a hosted PostgreSQL database. Deployment is not complete until you connect your own project, database, and secrets.

## Environment

Copy `.env.example`.

Required:

- `DATABASE_URL`
- `AUTH_SECRET` (32+ random characters)
- `APP_URL` (the public https origin)

Optional:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `CRON_SECRET` for `POST /api/cron/alerts?frequency=DAILY`

Do not put secret keys in frontend code or in site settings.

## Release steps

```bash
npm install
npx prisma migrate deploy
npm run build
```

Point Vercel at this project. Set the environment variables in the Vercel project, not in git.

Stripe webhook endpoint: `https://YOUR_DOMAIN/api/webhooks/stripe`

Cron: call `POST /api/cron/alerts` with `Authorization: Bearer $CRON_SECRET`. Daily and weekly alerts do nothing until that job is scheduled. Instant alerts run when an admin publishes a job.

## Migrations

The initial SQL migration is in `prisma/migrations`. Generate a new one after schema changes with `npx prisma migrate dev`.

## Logo

The mark is an SVG component at `components/brand/Logo.tsx` and `public/favicon.svg`. Change it in those files; do not hard-code a different name outside `config/brand.ts`.
