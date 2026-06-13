# Add a local agent harness for autonomous development

Fridge2Recipe uses a cross-agent local harness so Cursor, Codex, and Claude can start a reproducible stack, capture UI screenshots, optionally capture failure audit bundles, and tear down safely. Supabase runs on the host via the CLI; web and api run in Docker Compose. Playwright E2E specs are deferred until feature work begins.

## Considered Options

- All-in-one Docker Compose including Supabase was rejected to keep the official Supabase CLI workflow for migrations and local dev.
- IDE browser MCP as the primary verification tool was rejected because it is not portable to Codex or Claude Code.
- Continuous server log files on disk were rejected; logs are streamed interactively and written to `.agent/audit/` only on demand. UI screenshots go to gitignored `.agent/screenshots/`.

## Consequences

- Agent runs require `.env.agent.local` separate from daily `.env.local`.
- Containers reach host Supabase via `host.docker.internal` (Mac-oriented).
- Agents must run `pnpm agent:down` after sessions; `pnpm agent:reset` clears bad local DB state.
- Screenshots under `.agent/screenshots/` are gitignored.
- Failure audit dirs under `.agent/audit/` are gitignored and accumulate locally.
