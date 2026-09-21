import { expect, type Page, test } from "@playwright/test";

const tableRowsAfterHeading = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-api-table ')][1]//tbody/tr");

const normalizeColor = (value: string) =>
  value
    .replace(/^oklch\(([\d.]+)%/, (_match, lightness) => {
      const decimal = (Number(lightness) / 100).toFixed(5).replace(/0+$/, "").replace(/\.$/, "");
      return `oklch(${decimal}`;
    })
    .replace("oklch(.", "oklch(0.")
    .replaceAll(" .", " 0.");

test.describe("Colors", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/colors");
  });

  test("teaches semantic Tailwind color usage", async ({ page }) => {
    await expect(page.locator("main h1").first()).toHaveText("Colors");
    await expect(page.locator("#usage")).toContainText("Always use semantic tokens instead of raw Tailwind colors");
    await expect(page.locator(".docs-code-block")).toHaveCount(7);
    await expect(page.locator("#usage .docs-code-block").first()).toContainText('@import "@dicehub/phi/styles/tailwind"');
    await expect(page.locator("#usage .docs-code-block").nth(1)).toContainText("bg-phi-base");
    await expect(page.locator("#usage .docs-code-block").nth(1)).toContainText("text-phi-default");
    await expect(page.locator("#usage .docs-code-block").nth(2)).toContainText("dark:bg-gray-900");
    await expect(page.locator("h4#correct")).toHaveText("Correct");
    await expect(page.locator("h4#correct")).toHaveRole("heading");
    await expect(page.locator("#correct a")).toHaveAttribute("href", "#correct");
    await expect(page.locator("h4#incorrect")).toHaveText("Incorrect");
    await expect(page.locator("h4#incorrect")).toHaveRole("heading");
    await expect(page.locator("#incorrect a")).toHaveAttribute("href", "#incorrect");
    await expect(page.locator(".docs-colors-code-example")).toHaveCount(0);
    await expect(page.locator("#mode .docs-code-block")).toContainText('data-mode="dark"');
    await expect(page.locator("#mode")).not.toContainText("data-phi-theme");
    await expect(page.locator("#themes .docs-code-block").first()).toContainText('data-theme="acme"');
    await expect(page.locator("#themes .docs-code-block").nth(1)).toContainText("codegen:themes --list");
    await expect(page.locator("#themes .docs-code-block").nth(2)).toContainText('AVAILABLE_THEMES = ["phi", "acme"]');
    await expect(page.locator("#themes")).toContainText("inherits its light and dark values");
    await expect(page.locator("#themes")).toContainText("theme:");
  });

  test("matches the semantic color information architecture", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Usage",
      "Mode",
      "Themes",
      "Available Themes",
      "Theme Generator",
      "Creating a New Theme",
      "Semantic Tokens",
      "Surface Hierarchy",
      "Accent",
      "Semantic Status Colors",
      "Text Colors",
      "Borders & Rings",
      "Token Reference",
    ]);
  });

  test("documents all generated token groups", async ({ page }) => {
    await expect(page.locator("#semantic-tokens .docs-api-table")).toHaveCount(5);
    await expect(tableRowsAfterHeading(page, "surface-hierarchy")).toHaveCount(6);
    await expect(tableRowsAfterHeading(page, "accent")).toHaveCount(4);
    await expect(tableRowsAfterHeading(page, "semantic-status-colors")).toHaveCount(12);
    await expect(tableRowsAfterHeading(page, "text-colors")).toHaveCount(7);
    await expect(tableRowsAfterHeading(page, "borders-and-rings")).toHaveCount(4);

    await expect(page.locator(".docs-colors-token-count")).toHaveText("Displaying 59 generated tokens");
    await expect(page.locator(".docs-colors-token-card")).toHaveCount(59);
    await expect(page.locator('[data-color-token="--color-phi-accent"]')).toContainText("oklch(0.5772 0.2324 260)");
    await expect(page.locator('[data-color-token="--color-phi-accent"]')).toContainText("oklch(0.51948 0.2324 260)");
    await expect(page.locator('[data-color-token="--text-color-phi-default"]')).toContainText("Primary body text");
    await expect(page.locator(".docs-colors-swatch__chip").first()).toHaveCSS("width", "28px");
  });

  test("compiles and renders real semantic utilities", async ({ page }) => {
    const surface = page.locator('[data-colors-demo="surface"]');
    const base = surface.locator(".bg-phi-base");
    const status = page.locator('[data-colors-demo="status"] .bg-phi-danger-tint');
    const dangerIcon = page.locator('[data-colors-demo="status"] .fill-phi-danger');

    await expect(surface).toBeVisible();
    await expect(base).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(status).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(dangerIcon).not.toHaveCSS("fill", "rgb(0, 0, 0)");

    await page.evaluate(() => document.documentElement.setAttribute("data-mode", "dark"));
    await expect(base).toHaveCSS("background-color", "oklch(0.17 0 0)");
  });

  test("uses canonical generated variables in both modes", async ({ page }) => {
    const values = await page.evaluate(() => {
      const root = document.documentElement;
      const read = (mode: "light" | "dark") => {
        root.setAttribute("data-mode", mode);
        const styles = getComputedStyle(root);

        return {
          accent: styles.getPropertyValue("--color-phi-accent").trim(),
          canvas: styles.getPropertyValue("--color-phi-canvas").trim(),
          danger: styles.getPropertyValue("--color-phi-danger").trim(),
          dangerText: styles.getPropertyValue("--text-color-phi-danger").trim(),
          warning: styles.getPropertyValue("--color-phi-warning").trim(),
        };
      };

      return { light: read("light"), dark: read("dark") };
    });

    expect(Object.fromEntries(Object.entries(values.light).map(([key, value]) => [key, normalizeColor(String(value))]))).toEqual({
      accent: "oklch(0.5772 0.2324 260)",
      canvas: "oklch(0.9875 0 0)",
      danger: "oklch(0.637 0.237 25.331)",
      dangerText: "oklch(0.505 0.213 27.518)",
      warning: "oklch(0.739 0.177 58.2)",
    });
    expect(Object.fromEntries(Object.entries(values.dark).map(([key, value]) => [key, normalizeColor(String(value))]))).toEqual({
      accent: "oklch(0.51948 0.2324 260)",
      canvas: "oklch(0.1 0 0)",
      danger: "oklch(0.577 0.245 27.325)",
      dangerText: "oklch(0.704 0.191 22.216)",
      warning: "oklch(0.645 0.168 50)",
    });
  });

  test("keeps the old mode attribute as a compatibility alias", async ({ page }) => {
    const value = await page.evaluate(() => {
      const root = document.documentElement;
      root.removeAttribute("data-mode");
      root.setAttribute("data-phi-theme", "dark");
      return getComputedStyle(root).getPropertyValue("--color-phi-canvas").trim();
    });

    expect(normalizeColor(value)).toBe("oklch(0.1 0 0)");
  });

  test("keeps token cards readable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/docs/colors#token-reference");

    const firstCard = page.locator(".docs-colors-token-card").first();
    const box = await firstCard.boundingBox();

    await expect(page.locator("#token-reference")).toBeInViewport();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  });
});

test("Colors is reachable in the primary docs navigation", async ({ page }) => {
  await page.goto("/docs");
  const colorsLink = page.locator(".docs-sidebar-panel--desktop").locator('a[href="/docs/colors"]');
  await expect(colorsLink).toHaveAttribute("href", "/docs/colors");
});
