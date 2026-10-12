# Database

The Prisma schema lives in `prisma/schema.prisma`. PostgreSQL is required.

```bash
docker compose up -d
npx prisma migrate deploy
npm run db:seed
```

Seed data is labeled `isSeed` and must not be presented as verified market information. The seed script refuses to run when `NODE_ENV=production` unless `ALLOW_SEED=true`.
