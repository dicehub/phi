import { expect, test, type Page } from "@playwright/test";

const dialog = (page: Page) => page.locator("#docs-search-dialog");
const input = (page: Page) => dialog(page).getByPlaceholder("Search documentation...");
const results = (page: Page) => dialog(page).locator("[data-docs-search-result]");
const desktopTrigger = (page: Page) =>
  page.locator(".docs-sidebar-panel--desktop").getByRole("button", { name: "Search docs" });

test.describe("Docs search", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/button");
    await expect(desktopTrigger(page)).toHaveAttribute("data-docs-search-ready", "true");
  });

  test("opens an accessible grouped index from the sidebar", async ({ page }) => {
    const trigger = desktopTrigger(page);

    await expect(trigger).toHaveAttribute("aria-controls", "docs-search-dialog");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();

    await expect(dialog(page)).toBeVisible();
    await expect(dialog(page)).toHaveRole("dialog");
    await expect(dialog(page)).toHaveAccessibleName("Search documentation");
    await expect(input(page)).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(dialog(page).locator(".phi-command-palette-group-label")).toHaveText([
      "Guides",
      "Components",
      "Charts",
      "Blocks",
    ]);

    await expect(results(page).filter({ hasText: "Installation" })).toHaveCount(1);
    await expect(
      results(page).filter({ has: page.locator(".phi-command-palette-result-item__title", { hasText: /^Button$/ }) }),
    ).toHaveCount(1);
    await expect(
      results(page).filter({
        has: page.locator(".phi-command-palette-result-item__title", { hasText: /^Button Group$/ }),
      }),
    ).toHaveCount(1);
    await expect(results(page).filter({ hasText: "Timeseries" })).toHaveCount(1);
    await expect(results(page).filter({ hasText: "Delete Resource" })).toHaveCount(1);

    const colors = results(page).filter({ hasText: "Colors" });
    await expect(colors).toHaveCount(2);
    await expect(colors.nth(0)).toContainText("Guides");
    await expect(colors.nth(1)).toContainText("Charts");
  });

  test("opens with the keyboard, filters, resets, and closes with Escape", async ({ page }) => {
    await page.keyboard.press("Control+k");
    await expect(dialog(page)).toBeVisible();

    await input(page).fill("timeseries");
    await expect(dialog(page).locator(".phi-command-palette-group-label")).toHaveText("Results");
    await expect(results(page)).toHaveCount(1);
    await expect(results(page).first()).toContainText("Timeseries");

    await input(page).fill("not-a-doc-page");
    await expect(results(page)).toHaveCount(0);
    await expect(dialog(page).locator(".phi-command-palette-empty")).toContainText(
      "No results found for",
    );

    await input(page).press("Escape");
    await expect(dialog(page)).toHaveCount(0);
    await expect(desktopTrigger(page)).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("Control+k");
    await expect(input(page)).toHaveValue("");
  });

  test("navigates search results with ArrowDown and Enter", async ({ page }) => {
    const marker = `search-soft-nav-${Date.now()}`;
    await page.evaluate((value) => {
      (window as Window & { __phiSearchSoftNavMarker?: string }).__phiSearchSoftNavMarker = value;
    }, marker);
    await page.keyboard.press("Control+k");
    await input(page).fill("colors");
    await expect(results(page)).toHaveCount(2);

    await input(page).press("ArrowDown");
    await input(page).press("Enter");

    await expect(page).toHaveURL(/\/docs\/charts\/colors\/?$/);
    expect(
      await page.evaluate((value) => {
        return (window as Window & { __phiSearchSoftNavMarker?: string }).__phiSearchSoftNavMarker === value;
      }, marker),
    ).toBe(true);
  });

  test("opens from the mobile drawer and closes the drawer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();

    const app = page.locator("[data-docs-app]");
    const mobileSidebar = page.locator(".docs-sidebar-panel--mobile");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(app).toHaveAttribute("data-mobile-sidebar-open", "true");

    await mobileSidebar.getByRole("button", { name: "Search docs" }).click();

    await expect(app).toHaveAttribute("data-mobile-sidebar-open", "false");
    await expect
      .poll(async () => {
        const box = await mobileSidebar.boundingBox();
        return box ? box.x + box.width : 0;
      })
      .toBeLessThanOrEqual(0);
    await expect(dialog(page)).toBeVisible();
    await expect(input(page)).toBeFocused();
  });
});
