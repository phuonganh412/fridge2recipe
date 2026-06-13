import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "../../apps/api/package.json"),
);
const { createClient } = require("@supabase/supabase-js");

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.AGENT_TEST_USER_EMAIL;
const password = process.env.AGENT_TEST_USER_PASSWORD;

if (!url || !serviceRoleKey || !email || !password) {
  console.error(
    "seed.mjs requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, AGENT_TEST_USER_EMAIL, AGENT_TEST_USER_PASSWORD",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: existing, error: listError } =
  await supabase.auth.admin.listUsers();

if (listError) {
  console.error("Failed to list users:", listError.message);
  process.exit(1);
}

const alreadyExists = existing.users.some((user) => user.email === email);
if (alreadyExists) {
  console.log(`Agent test user already exists: ${email}`);
  process.exit(0);
}

const { error: createError } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (createError) {
  if (createError.message.toLowerCase().includes("already")) {
    console.log(`Agent test user already exists: ${email}`);
    process.exit(0);
  }
  console.error("Failed to create agent test user:", createError.message);
  process.exit(1);
}

console.log(`Created agent test user: ${email}`);
