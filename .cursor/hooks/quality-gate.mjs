import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname, relative, resolve } from "node:path";

const SKIP_PATTERNS = [/\.sql$/, /pnpm-lock\.yaml$/, /database\.types\.ts$/];

const ROOT_FORMAT_EXTENSIONS = new Set([".json", ".md", ".yml", ".yaml"]);

function readStdin() {
  return readFileSync(0, "utf8");
}

function resolveFilePath(input) {
  const roots = input.workspace_roots ?? [];
  const repoRoot = roots[0] ?? process.cwd();

  if (input.hook_event_name === "afterFileEdit") {
    const filePath = input.file_path ?? input.path;
    if (!filePath) return null;
    return resolve(repoRoot, filePath);
  }

  if (input.hook_event_name === "postToolUse") {
    const filePath = input.tool_input?.path;
    if (!filePath) return null;
    return resolve(repoRoot, filePath);
  }

  return null;
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

function main() {
  const input = JSON.parse(readStdin());
  const repoRoot = input.workspace_roots?.[0] ?? process.cwd();
  const absolutePath = resolveFilePath(input);

  if (!absolutePath) {
    process.exit(0);
  }

  const routing = route(absolutePath, repoRoot);
  if (routing.skip) {
    process.exit(0);
  }

  const { appRoot, eslint, relToApp } = routing;

  runPrettier(appRoot, relToApp);

  if (input.hook_event_name === "afterFileEdit") {
    process.exit(0);
  }

  if (input.hook_event_name === "postToolUse" && eslint) {
    const eslintOutput = runEslint(appRoot, relToApp);
    if (eslintOutput) {
      process.stdout.write(
        JSON.stringify({
          additional_context: `ESLint errors:\n${eslintOutput}`,
        }),
      );
    }
  }

  process.exit(0);
}

main();
