# Fridge2Recipe Agent Guide

## Monorepo map

| Path | Role |
|------|------|
| `apps/web` | Next.js UI on Vercel — rendering, Supabase Auth sessions, REST client |
| `apps/api` | NestJS REST API on Railway — product logic, AI, Prisma Postgres access |
| `supabase/` | Supabase CLI config (local Auth, Storage, Postgres) |
| `packages/` | Shared packages (empty for now) |
| `docs/` | Architecture and ADRs |

## Talk before action

Default to discussion. **Do not edit files or commit** until the user explicitly asks to implement (e.g. "go ahead", "implement this") or switches to Agent mode after a planning thread.

While waiting: read/search the codebase and run **non-mutating** commands only (`git status`, `git log`, repro tests).

When design seems settled and the user has not asked to implement, stop and ask: *"Want a plan doc, or should I implement?"* Plan docs stay in chat unless the user names a path or says "save it".

Do not infer implementation from problem statements or finished design discussions.

## Rules

- Product behavior goes in `apps/api`, not `apps/web/src/services` or Next.js route handlers.
- `apps/web` never queries Postgres directly. Use `apps/web/src/lib/api/client.ts` to call the API.
- `apps/api` validates Supabase JWTs and filters all queries by `userId` from the token — never from request bodies.
- Postgres access in `apps/api` uses Prisma (`DATABASE_URL`). `@supabase/supabase-js` is for Storage (and Realtime if needed), not Postgres queries.
- Database schema lives in `apps/api/prisma/schema.prisma`. Apply changes with `pnpm --filter @fridge2recipe/api prisma:migrate:dev`.
- AI calls go through `apps/api/src/ai/`, not the web app.

## Commands

```bash
pnpm install
pnpm dev          # web + api in parallel
pnpm dev:web
pnpm dev:api
pnpm build
pnpm lint
```

## Documentation

- [docs/architecture.md](docs/architecture.md) — current architecture
- [docs/adr/0002-nestjs-monorepo-backend.md](docs/adr/0002-nestjs-monorepo-backend.md) — backend split decision
- [CONTEXT.md](CONTEXT.md) — domain glossary (no implementation details)

## Next.js (apps/web)

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Vercel root directory: `apps/web`.

## NestJS (apps/api)

Default port: `3001`. Health check: `GET /health`. Authenticated routes require `Authorization: Bearer <supabase-access-token>`.

Railway root directory: `apps/api`.
