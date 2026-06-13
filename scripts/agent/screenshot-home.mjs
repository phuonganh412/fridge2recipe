import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(path.join(repoRoot, "package.json"));
const { chromium } = require("playwright");

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = path.join(repoRoot, ".agent/screenshots");
const baseUrl = process.env.AGENT_WEB_URL ?? "http://localhost:3000";
const headed = process.argv.includes("--headed");

mkdirSync(outDir, { recursive: true });

const outputPath = path.join(outDir, "homepage.png");

const browser = await chromium.launch({ headless: !headed });
const page = await browser.newPage();

await page.goto(baseUrl);
await page.getByRole("heading", { name: "Fridge2Recipe" }).waitFor();
await page.screenshot({ path: outputPath, fullPage: true });

await browser.close();

console.log(`Screenshot saved: ${outputPath}`);
