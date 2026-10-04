import { existsSync, readdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

const docsRoutes = (directory: string) => {
  const routes = readdirSync(new URL(`../src/pages/docs/${directory}/`, import.meta.url))
    .filter((file) => file.endsWith(".astro") && file !== "menubar.astro")
    .map((file) => `/docs/${directory}/${file.replace(/\.astro$/, "")}`.replace(/\/index$/, ""));
  if (existsSync(new URL(`../src/pages/docs/${directory}.astro`, import.meta.url))) {
    routes.push(`/docs/${directory}`);
  }
  return routes.sort();
};

test.describe("Docs home without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const path of ["/", "/docs/"]) {
    test(`lists every component, chart, and block on ${path}`, async ({ page }) => {
      await page.goto(path);

      const main = page.getByRole("main");
      await expect(main.getByRole("heading", { level: 1 })).toHaveText("Components and blocks");
      const sections = [["Components", "components"], ["Charts", "charts"], ["Blocks", "blocks"]];
      for (const [name, directory] of sections) {
        const list = main.getByRole("list", { name, exact: true });
        await expect(list).toBeVisible();
        const hrefs = await list.getByRole("link").evaluateAll((links) =>
          links.map((link) => link.getAttribute("href")!).sort(),
        );
        expect(hrefs).toEqual(docsRoutes(directory));
        const labels = await list.getByRole("link").allTextContents();
        expect(labels).toEqual(
          [...labels].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })),
        );
      }
      await expect(main.locator("astro-island")).toHaveCount(0);
    });
  }
});

test("opens a block guide from the home list with the keyboard", async ({ page }) => {
  await page.goto("/docs/");
  const link = page.getByRole("main").getByRole("link", { name: "Page Header", exact: true });
  await link.focus();
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/docs\/blocks\/page-header\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page Header");
});

test("shows the complete directory within a desktop viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs/");
  const links = page.getByRole("main").getByRole("link");
  await expect(links.last()).toBeVisible();
  expect(await links.evaluateAll((items) => items.every((item) => {
    const bounds = item.getBoundingClientRect();
    return bounds.top >= 0 && bounds.bottom <= innerHeight;
  }))).toBe(true);
});

test("keeps the home list within a narrow viewport in both themes", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/docs/");

  for (const mode of ["light", "dark"]) {
    await expect(page.locator("html")).toHaveAttribute("data-mode", mode);
    const headingColor = await page.getByRole("heading", { level: 1 }).evaluate(
      (heading) => getComputedStyle(heading).color,
    );
    for (const heading of await page.getByRole("main").getByRole("heading", { level: 2 }).all()) {
      await expect(heading).toHaveCSS("color", headingColor);
    }
    await expect(
      page.getByRole("main").getByRole("list", { name: "Components", exact: true }),
    ).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.getByRole("main").getByRole("link").evaluateAll((links) =>
      links.every((link) => link.scrollWidth <= link.clientWidth),
    )).toBe(true);
    if (mode === "light") await page.getByRole("button", { name: "Toggle theme" }).first().click();
  }
});
