# Use Prisma as Postgres ORM and schema source of truth

Fridge2Recipe uses Prisma Migrate and `schema.prisma` in `apps/api` as the single source of truth for Postgres schema. The API connects via `DATABASE_URL` (direct Postgres), so the database host can change without rewriting migrations. Supabase remains the Postgres host for the MVP, plus Auth and Storage; `@supabase/supabase-js` stays for those platform features, not for product queries.

## Considered Options

- Supabase SQL migrations with Prisma `db pull` were rejected because schema evolution would split across two tools and drift from git.
- Keeping `@supabase/supabase-js` for Postgres queries was rejected to avoid two query layers and tighter coupling to Supabase's client API.

## Consequences

- Schema changes go through `prisma migrate dev` / `prisma migrate deploy`, not `supabase migration`.
- `supabase/` CLI is for local Auth/Storage stack and platform config, not schema ownership.
- Railway deploys should run `prisma migrate deploy` before or during API startup.
- `apps/api/src/supabase/database.types.ts` is legacy for Supabase client typings; Postgres types come from the generated Prisma Client.
