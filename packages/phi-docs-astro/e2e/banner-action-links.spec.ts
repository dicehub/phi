import { expect, test, type Locator } from "@playwright/test";

const action = (demo: Locator, name: string) => demo.locator(`[data-banner-action="${name}"]`);

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/banner");
  await expect(page.locator("[data-banner-links]")).toBeVisible();
});

test("link actions keep banner variants, density, and accents in both themes", async ({ page }) => {
  const demo = page.locator("[data-banner-links]");
  await expect(demo.getByRole("link")).toHaveCount(4);
  const primary = action(demo, "primary");
  const secondary = action(demo, "external");
  const compact = action(demo, "stateful");
  const ghost = action(demo, "empty");
  for (const link of [primary, secondary, compact, ghost]) {
    await expect(link).toHaveJSProperty("tagName", "A");
    await expect(link).not.toHaveAttribute("type");
  }
  await expect(primary).toHaveClass(/phi-banner-action--primary/);
  await expect(primary).toHaveClass(/phi-button--sm/);
  await expect(secondary).toHaveClass(/phi-banner-action--secondary/);
  await expect(secondary).toHaveClass(/phi-button--outline/);
  await expect(compact).toHaveClass(/phi-button--xs/);
  await expect(ghost).toHaveClass(/phi-banner-action--ghost/);
  await expect(ghost).toHaveAttribute("href", "");

  for (const mode of ["light", "dark"]) {
    await page.locator("html").evaluate((element, value) => element.setAttribute("data-mode", value), mode);
    for (const link of [primary, compact]) {
      const colors = await link.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          gradient: style.getPropertyValue("--phi-button-emphasis-gradient-end").trim(),
          accent: style.getPropertyValue("--phi-banner-action-accent").trim(),
        };
      });
      expect(colors.gradient).toBe(colors.accent);
    }
  }
  await expect(secondary).toHaveAttribute("href", "https://example.com/billing");
  await expect(secondary).toHaveAttribute("target", "_blank");
  await expect(secondary).toHaveAttribute("rel", "noopener noreferrer");
});

test("native link activation navigates and preserves click handlers", async ({ page }) => {
  const demo = page.locator("[data-banner-links]");
  const primary = action(demo, "primary");
  await primary.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/docs\/components\/banner#api$/);
  await expect(demo.getByRole("status")).toHaveText("Link activations: 1");
});

test("disabled link actions become inert buttons and restore their link attributes", async ({ page }) => {
  const demo = page.locator("[data-banner-links]");
  const control = action(demo, "stateful");
  await demo.getByRole("checkbox", { name: "Disable action" }).check();
  await expect(control).toHaveJSProperty("tagName", "BUTTON");
  await expect(control).toBeDisabled();
  await expect(control).toHaveAttribute("aria-label", "Open workspace settings");
  for (const attr of ["href", "target", "rel", "download"]) await expect(control).not.toHaveAttribute(attr);
  await control.evaluate((element) => (element as HTMLButtonElement).click());
  await expect(demo.getByRole("status")).toHaveText("Link activations: 0");
  await expect(page).toHaveURL(/\/docs\/components\/banner$/);

  await demo.getByRole("checkbox", { name: "Disable action" }).uncheck();
  await expect(control).toHaveJSProperty("tagName", "A");
  await expect(control).toHaveAttribute("href", "#api");
  await expect(control).toHaveAttribute("target", "_blank");
  await expect(control).toHaveAttribute("rel", "nofollow");
  await expect(control).toHaveAttribute("download", "settings.json");
  await control.click();
  await expect(demo.getByRole("status")).toHaveText("Link activations: 1");
  await expect(page).toHaveURL(/\/docs\/components\/banner$/);
});

test("loading link actions keep their spinner and block navigation until ready", async ({ page }) => {
  const demo = page.locator("[data-banner-links]");
  const control = action(demo, "stateful");
  await demo.getByRole("checkbox", { name: "Show loading" }).check();
  await expect(control).toHaveJSProperty("tagName", "BUTTON");
  await expect(control).toBeDisabled();
  await expect(control).toHaveAttribute("aria-busy", "true");
  await expect(control.locator(".phi-button__spinner")).toHaveCount(1);
  await expect(control).toHaveClass(/phi-banner-action--primary/);
  await expect(control).toHaveClass(/phi-button--xs/);
  for (const attr of ["href", "target", "rel", "download"]) await expect(control).not.toHaveAttribute(attr);
  await control.evaluate((element) => (element as HTMLButtonElement).click());
  await expect(demo.getByRole("status")).toHaveText("Link activations: 0");
  await expect(page).toHaveURL(/\/docs\/components\/banner$/);

  await demo.getByRole("checkbox", { name: "Disable action" }).check();
  await demo.getByRole("checkbox", { name: "Show loading" }).uncheck();
  await expect(control).toBeDisabled();
  await expect(control).not.toHaveAttribute("href");
  await expect(control.locator(".phi-button__spinner")).toHaveCount(0);
  await demo.getByRole("checkbox", { name: "Disable action" }).uncheck();
  await expect(control).toHaveJSProperty("tagName", "A");
  await expect(control).toHaveAttribute("href", "#api");
  await expect(control).not.toHaveAttribute("aria-busy");
  await control.click();
  await expect(demo.getByRole("status")).toHaveText("Link activations: 1");
});
