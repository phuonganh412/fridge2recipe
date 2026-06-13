import path from "node:path";
import { config as loadEnv } from "dotenv";
import type { NextConfig } from "next";

loadEnv({ path: path.join(__dirname, "../../.env.local") });
loadEnv({ path: path.join(__dirname, "../../.env") });
if (process.env.AGENT_MODE === "1") {
  loadEnv({
    path: path.join(__dirname, "../../.env.agent.local"),
    override: true,
  });
}

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

export default nextConfig;
