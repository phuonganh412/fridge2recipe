# Add NestJS monorepo backend for shared web and chat API

Fridge2Recipe moves from a single full-stack Next.js app to a pnpm monorepo with `apps/web` (Next.js on Vercel) and `apps/api` (NestJS on Railway). The NestJS API owns all product behavior, Supabase data access, and AI calls so the web app and a future chatbot share one backend. This supersedes ADR 0001's decision to defer a separate backend and route chat webhooks through Next.js.

## Considered Options

- Keeping Next.js route handlers and `src/services/` for product logic was rejected because a chatbot would duplicate or fork that logic.
- User-scoped Supabase clients with RLS as a safety net were rejected in favor of service-role access with mandatory `user_id` filtering in NestJS application code, trading RLS backup for simpler query patterns in the API layer.
- tRPC and GraphQL were rejected in favor of REST for standard NestJS conventions and straightforward chatbot integration later.

## Consequences

- `apps/web` must not query Postgres directly; it forwards Supabase JWTs to `apps/api`.
- Database types are generated into `apps/api` only.
- Railway deployment for `apps/api` is required alongside the existing Vercel deployment for `apps/web`.
- Chatbot account linking is explicitly deferred; when built, it will authenticate against `apps/api`, not `apps/web`.
