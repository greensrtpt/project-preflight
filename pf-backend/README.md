# Community Resource Hub Backend

## วิธีติดตั้งและรัน

```bash
cp .env.example .env
pnpm install
docker compose up -d postgres
pnpm run db:push
pnpm run seed
pnpm run dev
```