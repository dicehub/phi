import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { defineConfig, devices, type Project } from "@playwright/test";
import { analyticsEnv } from "./e2e/analytics-fixture";

const packageDir = fileURLToPath(new URL(".", import.meta.url));

const PORT = 4328;
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalBaseURL ?? `http://127.0.0.1:${PORT}`;

// Astro 7.2 runs `preview` as a background server that outlives its parent. Clear any stale one
// before Playwright decides whether the base URL is already served. Workers reload this config, so
// only the main process may stop the server.
if (!externalBaseURL && process.env.TEST_WORKER_INDEX === undefined) {
  try {
    execSync("pnpm exec astro preview stop", { cwd: packageDir, stdio: "ignore" });
  } catch {
    // No preview server to stop.
  }
}

// Smoke coverage for cross-browser risks: body teleports and portal stacking,
// clipboard controls, and responsive overflow. Later feature MRs extend this
// list (portal isolation guide, ButtonGroup focus).
const smokeSpecs = [
  "button-group.spec.ts",
  "choice-cards.spec.ts",
  "clipboard-text.spec.ts",
  "dialog.spec.ts",
  "docs-home.spec.ts",
  "docs-analytics.spec.ts",
  "inline-copy-text.spec.ts",
  "docs-layout.spec.ts",
  "popover.spec.ts",
  "portal-stacking.spec.ts",
  "slider.spec.ts",
  "label-translations.spec.ts",
  "kumo-date-radio-sync.spec.ts",
  "tooltip.spec.ts",
];

const projects: Project[] = [
  {
    name: "chromium",
    use: { ...devices["Desktop Chrome"] },
  },
];

// CI covers every supported browser engine. Local runs stay on Chromium;
// opt in with PLAYWRIGHT_ALL_BROWSERS=1 after `playwright install firefox webkit`.
if (process.env.CI || process.env.PLAYWRIGHT_ALL_BROWSERS) {
  projects.push(
    {
      name: "firefox-smoke",
      testMatch: smokeSpecs,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit-smoke",
      testMatch: smokeSpecs,
      use: { ...devices["Desktop WebKit"] },
    },
  );
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects,
  webServer: externalBaseURL
    ? undefined
    : {
        // The preview command exits once its background server is up, so the long sleep keeps the
        // Playwright process alive for the run.
        command: `pnpm build && pnpm exec astro preview --host 127.0.0.1 --port ${PORT} && sleep infinity`,
        env: analyticsEnv,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
});
