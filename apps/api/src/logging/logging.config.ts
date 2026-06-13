import { randomUUID } from "node:crypto";

import type { Params } from "nestjs-pino";
import type { IncomingMessage, ServerResponse } from "node:http";

function resolveLogLevel(): string {
  return (
    process.env.LOG_LEVEL ??
    (process.env.NODE_ENV === "production" ? "info" : "debug")
  );
}

function usePrettyTransport(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  if (process.env.LOG_PRETTY === "false") {
    return false;
  }

  return true;
}

function genRequestId(
  req: IncomingMessage,
  _res: ServerResponse,
): string {
  const header = req.headers["x-request-id"];

  if (typeof header === "string" && header.length > 0) {
    return header;
  }

  return randomUUID();
}

export function createLoggerModuleParams(): Params {
  const level = resolveLogLevel();
  const pretty = usePrettyTransport();

  return {
    pinoHttp: {
      level,
      autoLogging: {
        ignore: (req) => req.url === "/health",
      },
      genReqId: genRequestId,
      customProps: (req) => ({
        requestId: req.id,
      }),
      redact: {
        paths: [
          "req.headers.authorization",
          "req.headers.cookie",
          "password",
          "*.password",
          "*.token",
          "*.apiKey",
          "*.secret",
        ],
        censor: "[Redacted]",
      },
      ...(pretty
        ? {
            transport: {
              target: "pino-pretty",
              options: {
                colorize: true,
                singleLine: true,
              },
            },
          }
        : {}),
    },
  };
}
