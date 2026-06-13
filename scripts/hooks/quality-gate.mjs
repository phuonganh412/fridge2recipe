import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname, relative, resolve } from "node:path";

const SKIP_PATTERNS = [/\.sql$/, /pnpm-lock\.yaml$/, /database\.types\.ts$/];

const ROOT_FORMAT_EXTENSIONS = new Set([".json", ".md", ".yml", ".yaml"]);

const PATCH_PATH_RE =
  /^\*{1,3}\s*(?:Add File|Update File|Delete File|Move to):\s*(.+)$/gm;

function readStdin() {
  return readFileSync(0, "utf8");
}

function normalizeEventName(input) {
  return (input.hook_event_name ?? input.hookEventName ?? "").toLowerCase();
}

function getRepoRoot(input) {
  return input.workspace_roots?.[0] ?? input.cwd ?? process.cwd();
}

function parsePatchPaths(patchCommand) {
  if (!patchCommand || typeof patchCommand !== "string") {
    return [];
  }

  const paths = new Set();
  for (const match of patchCommand.matchAll(PATCH_PATH_RE)) {
    const path = match[1]?.trim();
    if (path) {
      paths.add(path);
    }
  }

  return [...paths];
}

function resolveFilePaths(input) {
  const eventName = normalizeEventName(input);

  if (eventName === "afterfileedit") {
    const filePath = input.file_path ?? input.path;
    return filePath ? [filePath] : [];
  }

  if (eventName !== "posttooluse") {
    return [];
  }

  if (input.tool_input?.path) {
    return [input.tool_input.path];
  }

  const patchCommand =
    typeof input.tool_input === "string"
      ? input.tool_input
      : input.tool_input?.command;

  if (patchCommand) {
    return parsePatchPaths(patchCommand);
  }

  return [];
}

function shouldSkip(absolutePath, repoRoot) {
  const rel = relative(repoRoot, absolutePath);
  return SKIP_PATTERNS.some((pattern) => pattern.test(rel));
}

function route(absolutePath, repoRoot) {
  const rel = relative(repoRoot, absolutePath);

  if (shouldSkip(absolutePath, repoRoot)) {
    return { skip: true };
  }

  if (rel.startsWith("apps/web/")) {
    return {
      skip: false,
      appRoot: resolve(repoRoot, "apps/web"),
      eslint: true,
      relToApp: relative(resolve(repoRoot, "apps/web"), absolutePath),
    };
  }

  if (rel.startsWith("apps/api/")) {
    return {
      skip: false,
      appRoot: resolve(repoRoot, "apps/api"),
      eslint: true,
      relToApp: relative(resolve(repoRoot, "apps/api"), absolutePath),
    };
  }

  if (ROOT_FORMAT_EXTENSIONS.has(extname(absolutePath))) {
    return {
      skip: false,
      appRoot: repoRoot,
      eslint: false,
      relToApp: rel,
    };
  }

  return { skip: true };
}

function runPrettier(appRoot, relToApp) {
  execFileSync("pnpm", ["exec", "prettier", "--write", relToApp], {
    cwd: appRoot,
    stdio: "pipe",
  });
}

function runEslint(appRoot, relToApp) {
  try {
    execFileSync("pnpm", ["exec", "eslint", relToApp], {
      cwd: appRoot,
      stdio: "pipe",
      encoding: "utf8",
    });
    return null;
  } catch (error) {
    const stdout = error.stdout?.toString() ?? "";
    const stderr = error.stderr?.toString() ?? "";
    return (stdout + stderr).trim() || error.message;
  }
}

function isCodexInput(input) {
  const raw = input.hookEventName ?? input.hook_event_name ?? "";
  return raw === "PostToolUse";
}

function emitLintContext(input, message) {
  if (isCodexInput(input)) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext: message,
        },
      }),
    );
    return;
  }

  process.stdout.write(JSON.stringify({ additional_context: message }));
}

function main() {
  const input = JSON.parse(readStdin());
  const eventName = normalizeEventName(input);
  const repoRoot = getRepoRoot(input);
  const filePaths = resolveFilePaths(input);

  if (filePaths.length === 0) {
    process.exit(0);
  }

  const runLint = eventName === "posttooluse";
  const lintMessages = [];

  for (const filePath of filePaths) {
    const absolutePath = resolve(repoRoot, filePath);
    const routing = route(absolutePath, repoRoot);

    if (routing.skip) {
      continue;
    }

    const { appRoot, eslint, relToApp } = routing;

    runPrettier(appRoot, relToApp);

    if (runLint && eslint) {
      const eslintOutput = runEslint(appRoot, relToApp);
      if (eslintOutput) {
        lintMessages.push(`${filePath}:\n${eslintOutput}`);
      }
    }
  }

  if (runLint && lintMessages.length > 0) {
    emitLintContext(input, `ESLint errors:\n${lintMessages.join("\n\n")}`);
  }

  process.exit(0);
}

main();
