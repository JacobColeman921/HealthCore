import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "portfolio-screenshots.spec.ts",
  outputDir: "docs/qa/portfolio-playwright-results",
  reporter: "list",
  fullyParallel: false,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:4175/HealthCore/",
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4175",
    url: "http://127.0.0.1:4175/HealthCore/",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [{ name: "portfolio", use: { browserName: "chromium" } }],
});
