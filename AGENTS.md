# Fridge2Recipe Agent Guide

## Monorepo map

| Path | Role |
|------|------|
| `apps/web` | Next.js UI on Vercel — rendering, Supabase Auth sessions, REST client |
| `apps/api` | NestJS REST API on Railway — all product logic, AI, Supabase data access |
| `supabase/` | Shared database schema and CLI config |
| `packages/` | Shared packages (empty for now) |
| `docs/` | Architecture and ADRs |

## Rules

- Product behavior goes in `apps/api`, not `apps/web/src/services` or Next.js route handlers.
- `apps/web` never queries Postgres directly. Use `apps/web/src/lib/api/client.ts` to call the API.
- `apps/api` validates Supabase JWTs and filters all queries by `userId` from the token — never from request bodies.
- AI calls go through `apps/api/src/ai/`, not the web app.
- Database types are generated into `apps/api/src/supabase/database.types.ts` only.

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
