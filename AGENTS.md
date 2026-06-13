# Fridge2Recipe Agent Guide

## Monorepo map

| Path             | Role                                                                    |
| ---------------- | ----------------------------------------------------------------------- |
| `apps/web`       | Next.js UI on Vercel — rendering, Supabase Auth sessions, REST client   |
| `apps/api`       | NestJS REST API on Railway — product logic, AI, Prisma Postgres access  |
| `supabase/`      | Supabase CLI config (local Auth, Storage, Postgres)                     |
| `packages/`      | Shared packages (empty for now)                                         |
| `docs/`          | Architecture and ADRs                                                   |
| `scripts/agent/` | Local agent stack lifecycle (Docker, seed, screenshots)                 |
| `scripts/hooks/` | Shared agent hook scripts (Prettier + type-checked ESLint quality gate) |
| `.cursor/`       | Cursor hook config (`.cursor/hooks.json`)                               |
| `.codex/`        | Codex hook config (`.codex/hooks.json`)                                 |

## Talk before action

Default to discussion. **Do not edit files or commit** until the user explicitly asks to implement (e.g. "go ahead", "implement this") or switches to Agent mode after a planning thread.

While waiting: read/search the codebase and run **non-mutating** commands only (`git status`, `git log`, repro tests).

When design seems settled and the user has not asked to implement, stop and ask: _"Want a plan doc, or should I implement?"_ Plan docs stay in chat unless the user names a path or says "save it".

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
pnpm dev          # web + api in parallel (daily dev, remote Supabase)
pnpm dev:web
pnpm dev:api
pnpm build
pnpm typecheck    # tsc --noEmit per app
pnpm lint         # type-checked ESLint per app
pnpm test         # Jest per app
pnpm format       # Prettier (root)
pnpm format:check
```

## Quality harness

Two-layer quality gates keep AI edits and commits clean:

1. **Edit hook** — after agent file edits, Prettier formats the file and type-checked ESLint runs on the edited file. Lint errors are injected back into agent context. Both agents call the shared script at `scripts/hooks/quality-gate.mjs`.
   - **Cursor**: `.cursor/hooks.json` (`afterFileEdit` + `postToolUse`). Requires a **trusted** workspace.
   - **Codex**: `.codex/hooks.json` (`PostToolUse` on `Edit|Write|apply_patch`). Trust project hooks via `/hooks` in the Codex CLI.
2. **Pre-commit** (husky) — runs `typecheck → lint → test` on the full repo before any commit.

Do not skip pre-commit with `--no-verify` unless the user explicitly asks.

## Agent harness

Cross-agent local stack for autonomous development. See [docs/adr/0003-agent-harness.md](docs/adr/0003-agent-harness.md).

**Setup (once):**

```bash
cp .env.agent.example .env.agent.local
supabase start
# Copy keys from `supabase status` into .env.agent.local
pnpm exec playwright install chromium
```

**Playbook:**

```bash
pnpm agent:up       # supabase start + docker compose (web + api)
pnpm agent:seed     # create test User (auth only)
# optional UI capture (web must be reachable on :3000):
pnpm agent:screenshot --headed
# live tail: pnpm agent:logs --since 10m
pnpm agent:down     # always run, even on failure
# if DB state is bad: pnpm agent:reset
```

**Commands:**

| Command                 | Purpose                                                 |
| ----------------------- | ------------------------------------------------------- |
| `pnpm agent:up`         | Start local Supabase + agent containers                 |
| `pnpm agent:down`       | Stop containers (`--full` also stops Supabase)          |
| `pnpm agent:reset`      | Reset local DB, re-seed, restart stack                  |
| `pnpm agent:seed`       | Create idempotent test **User**                         |
| `pnpm agent:logs`       | Stream Docker logs (`--since`, `--level error`)         |
| `pnpm agent:screenshot` | Save homepage PNG to `.agent/screenshots/` (`--headed`) |
| `pnpm agent:run`        | Keep stack up with caps + mandatory teardown            |

**Screenshots** (gitignored):

```text
.agent/screenshots/homepage.png
```

**Failure audit bundle** (optional, via `scripts/agent/capture-logs.sh`):

```text
.agent/audit/{runId}/
  server-api.log
  server-web.log
  manifest.json
```

E2E tests are deferred until feature work begins.

## Documentation

- [docs/architecture.md](docs/architecture.md) — current architecture
- [docs/adr/0002-nestjs-monorepo-backend.md](docs/adr/0002-nestjs-monorepo-backend.md) — backend split decision
- [docs/adr/0003-agent-harness.md](docs/adr/0003-agent-harness.md) — local agent harness
- [docs/adr/0005-structured-api-logging.md](docs/adr/0005-structured-api-logging.md) — API structured logging
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

### Structured logging

See [docs/adr/0005-structured-api-logging.md](docs/adr/0005-structured-api-logging.md). Logs are JSON lines on stdout in production; local dev pretty-prints by default.

| Env var      | Default                               | Purpose                             |
| ------------ | ------------------------------------- | ----------------------------------- |
| `LOG_LEVEL`  | `debug` (local) / `info` (production) | Minimum log level                   |
| `LOG_PRETTY` | on in non-production                  | Set to `false` for raw JSON locally |

Useful filters while tailing API output:

```bash
# errors only (pino level 50 = error)
pnpm dev:api 2>&1 | jq 'select(.level >= 50)'

# trace one request
pnpm dev:api 2>&1 | jq 'select(.requestId=="abc-123")'

# force raw JSON locally (agent-friendly)
LOG_PRETTY=false pnpm dev:api
```
