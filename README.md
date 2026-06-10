# Fridge2Recipe

Turn known fridge contents into practical meal plans and recipe suggestions.

## Documentation

- [AGENTS.md](AGENTS.md) — agent guide, stack direction, and commands
- [CONTEXT.md](CONTEXT.md) — product glossary (domain language only)
- [docs/architecture.md](docs/architecture.md) — MVP architecture
- [docs/adr/0001-mvp-platform-stack.md](docs/adr/0001-mvp-platform-stack.md) — platform stack ADR

## Requirements

- Node.js 20.9+ (use `nvm use` — see `.nvmrc`)
- pnpm 10 via Corepack (do not use Homebrew pnpm 11; it requires Node 22+)

## Local development

```bash
nvm use
corepack enable
cp .env.example .env.local
# Fill in Supabase and AI Gateway keys, or run: vercel env pull .env.local --yes

pnpm install
pnpm dev
```

## Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
```

## Supabase

```bash
npx supabase init
npx supabase link --project-ref <your-project-ref>
npx supabase gen types typescript --linked > src/lib/supabase/database.types.ts
```

## Deployment

Production deploys from `main` via Vercel. See [AGENTS.md](AGENTS.md) for the expected Vercel workflow.
