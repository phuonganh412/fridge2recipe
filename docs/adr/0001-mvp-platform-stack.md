# Choose Vercel, Supabase, and Vercel AI Gateway for the MVP

Fridge2Recipe will use a full-stack Next.js app on Vercel, Supabase for managed backend capabilities, and Vercel AI Gateway through the Vercel AI SDK for multi-model AI features. This optimizes for the fastest credible live MVP within a `$0-$20/month` prototype budget while preserving a future path to Telegram-style chat agents through Next.js webhook routes.

## Considered Options

- Firebase was considered for backend speed, but the fridge, meal plan, recipe, and usage data are relational enough that Postgres and row-level security are a better fit.
- OpenRouter was considered for broad model marketplace access, but Vercel AI Gateway is a better first choice while the app is hosted on Vercel because deployment, auth, spend tracking, and model calls fit together with less setup.
- A separate backend service was considered for future chat agents, but Next.js route handlers can receive chat webhooks and call shared server-side services. Durable workflow infrastructure can be added later when agent work becomes long-running or multi-step.

## Consequences

The MVP leans into the Vercel and Supabase ecosystem for speed. To keep the exit path open, AI calls should go through an internal wrapper and core product behavior should live in shared server-side services rather than directly inside UI routes.
