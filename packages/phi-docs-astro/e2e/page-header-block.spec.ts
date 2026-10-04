import { expect, test, type Page } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`.block-page-header-demo[data-variant="${variant}"]`);

test.describe("PageHeader block", () => {
  test("renders the installed template with breadcrumbs, tabs, and actions", async ({ page }) => {
    await page.goto("/docs/blocks/page-header#preview");

    const preview = demo(page, "hero");
    const header = preview.locator(".phi-page-header");
    await expect(header).toHaveCount(1);

    await expect(header.locator(".phi-breadcrumbs")).toContainText("Workers & Pages");
    await expect(header.locator(".phi-tabs__tab")).toHaveCount(6);
    await expect(header.getByRole("button", { name: "Visit" })).toBeVisible();
  });

  test("emits one value change per tab selection", async ({ page }) => {
    await page.goto("/docs/blocks/page-header#preview");

    const preview = demo(page, "hero");
    const status = preview.locator("[data-last-tab-value]");
    const tabs = preview.locator(".phi-tabs__tab");

    await expect(status).toHaveText("");
    await tabs.nth(2).click();
    await expect(status).toHaveText("deployments");
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");

    await tabs.nth(4).click();
    await expect(status).toHaveText("observability");
  });

  test("renders the complete example with title, description, tabs, and actions", async ({ page }) => {
    await page.goto("/docs/blocks/page-header#complete-example");

    const preview = demo(page, "complete");
    const header = preview.locator(".phi-page-header");

    await expect(header.locator("h1")).toHaveText("Page title");
    await expect(header.locator(".phi-page-header__description")).toContainText("Action-led");
    await expect(header.locator(".phi-tabs__tab")).toHaveCount(3);
    await expect(header.getByRole("button", { name: "New Item" })).toBeVisible();
  });

  test("documents the install command and the local import", async ({ page }) => {
    await page.goto("/docs/blocks/page-header#installation");

    const installation = page.locator("#installation");
    await expect(installation).toContainText("pnpm dlx @dicehub/phi@beta add PageHeader");
    await expect(installation).toContainText('import PageHeader from "./components/phi/page-header/PageHeader.vue";');
    await expect(installation).not.toContainText("Preview design");
  });

  test("keeps the tab row usable at narrow widths", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/docs/blocks/page-header#preview");

    const preview = demo(page, "hero");
    await expect(preview.locator(".phi-tabs__tab").first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  });
});
