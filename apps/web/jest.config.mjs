import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
};

export default createJestConfig(config);
