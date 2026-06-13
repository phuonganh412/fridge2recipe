# Fridge2Recipe

Turn known fridge contents into practical meal plans and recipe suggestions.

## Documentation

- [AGENTS.md](AGENTS.md) — agent guide, monorepo map, and commands
- [CONTEXT.md](CONTEXT.md) — product glossary (domain language only)
- [docs/architecture.md](docs/architecture.md) — monorepo architecture
- [docs/adr/0001-mvp-platform-stack.md](docs/adr/0001-mvp-platform-stack.md) — initial platform stack ADR
- [docs/adr/0002-nestjs-monorepo-backend.md](docs/adr/0002-nestjs-monorepo-backend.md) — NestJS monorepo backend ADR

## Monorepo layout

```
apps/
  web/       Next.js UI (Vercel) — auth sessions + REST client
  api/       NestJS REST API (Railway) — product logic, AI, database
packages/    shared packages (empty for now)
supabase/    database schema and CLI config
docs/        architecture and ADRs
```

## Requirements

- Node.js 20.9+ (use `nvm use` — see `.nvmrc`)
- pnpm 10 via Corepack (do not use Homebrew pnpm 11; it requires Node 22+)

## Local development

```bash
nvm use
corepack enable
cp .env.example .env.local   # repo root — both apps read from here
# Fill in keys for both apps, or run: vercel env pull .env.local --yes

pnpm install
pnpm dev          # runs web + api in parallel
```

Run individually:

```bash
pnpm dev:web      # http://localhost:3000
pnpm dev:api      # http://localhost:3001
```

## Commands

```bash
pnpm dev
pnpm dev:web
pnpm dev:api
pnpm build
pnpm typecheck    # tsc --noEmit per app
pnpm lint         # type-checked ESLint per app
pnpm test         # Jest per app
pnpm format       # Prettier (root)
pnpm format:check
```

After `pnpm install`, husky installs automatically via the `prepare` script.

## Quality harness

- **Cursor hooks** (`.cursor/hooks.json`) — auto-format after agent edits and report type-checked ESLint errors. Requires a trusted workspace.
- **Codex hooks** (`.codex/hooks.json`) — same behavior; both point at `scripts/hooks/quality-gate.mjs`. Review and trust hooks in Codex with `/hooks`.
- **Pre-commit** (`.husky/pre-commit`) — runs `pnpm typecheck`, `pnpm lint`, and `pnpm test` before every commit.

See [AGENTS.md](AGENTS.md) for details.

## Environment variables

See [.env.example](.env.example). Web needs `NEXT_PUBLIC_*` Supabase and API URL vars. API needs `DATABASE_URL` (Supabase direct Postgres URL), Supabase service role, JWT secret, and AI Gateway key.

## Database (Prisma)

Schema is defined in `apps/api/prisma/schema.prisma`. Postgres is hosted on Supabase but migrations are owned by Prisma:

```bash
pnpm --filter @fridge2recipe/api prisma:migrate:dev    # local schema changes
pnpm --filter @fridge2recipe/api prisma:migrate:deploy # apply migrations (CI / Railway)
```

Local `DATABASE_URL` example when using `supabase start`:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
```

## Supabase

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase start   # optional local Postgres, Auth, Storage
```

`supabase gen types` is only needed if Supabase client typings change (Storage). Postgres types come from Prisma Client.

## Deployment

| App        | Platform | Root directory |
| ---------- | -------- | -------------- |
| `apps/web` | Vercel   | `apps/web`     |
| `apps/api` | Railway  | `apps/api`     |

Set Railway env vars: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `AI_GATEWAY_API_KEY`, `WEB_ORIGIN`, `PORT`. `pnpm start` runs `prisma migrate deploy` before the API boots.

Set Vercel env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`.

See [AGENTS.md](AGENTS.md) for the expected Vercel workflow.
