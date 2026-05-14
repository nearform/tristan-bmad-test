import { defineConfig, devices } from "@playwright/test";

const apiUrl = process.env.E2E_API_URL ?? "http://127.0.0.1:4000";
const databaseUrl =
  process.env.DATABASE_URL ?? "postgresql://todo:todo@127.0.0.1:55432/todo?schema=public";

export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.E2E_WEB_URL ?? "http://127.0.0.1:5173",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "pnpm --filter @todo/api run prisma:generate && pnpm --filter @todo/api run dev",
      url: `${apiUrl}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
        WEB_ORIGIN: process.env.E2E_WEB_ORIGIN ?? "http://127.0.0.1:5173",
        PORT: "4000",
        HOST: "0.0.0.0",
      },
    },
    {
      command: "pnpm --filter @todo/web dev --host 127.0.0.1 --port 5173",
      url: process.env.E2E_WEB_URL ?? "http://127.0.0.1:5173",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
