# Structured JSON logging for the NestJS API

Fridge2Recipe uses `nestjs-pino` to emit JSON log lines on stdout from `apps/api`. Railway and local agent tooling consume stdout directly; humans get pretty-printed output in non-production by default.

## Considered Options

- Nest built-in `Logger` with manual `JSON.stringify` was rejected — no consistent schema, no HTTP timing, and no redaction helpers.
- Raw `pino` with a custom Nest adapter was rejected in favor of `nestjs-pino`, which integrates HTTP auto-logging and replaces Nest's logger with less boilerplate.
- An external log platform (Axiom, Datadog) was deferred until traffic warrants it.

## Consequences

- All API logs go to stdout as JSON in production; agents filter with `jq` on stable fields (`level`, `requestId`, `msg`, `err.stack`).
- Every inbound HTTP request is auto-logged except `GET /health`.
- `X-Request-Id` is accepted from clients; otherwise the API generates a UUID.
- Sensitive fields (`Authorization`, `Cookie`, `password`, `token`, `apiKey`, `secret`) are redacted before write.
- Default log level is `debug` locally and `info` in production; override with `LOG_LEVEL`.
- Pretty-print is on in non-production unless `LOG_PRETTY=false`; production always emits raw JSON.

## TODOs

- **Bind `userId` to log context after auth** — when login work lands, attach the authenticated user's ID to every log line in that request.
- **Forward `X-Request-Id` from the web client** — `apps/web/src/lib/api/client.ts` should generate and send the header for end-to-end tracing.
- **Define AI operation logging policy** — log operational metadata only (feature name, model, duration, success/failure); not prompts, responses, or token counts.
