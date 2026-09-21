import { expect, type Locator, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

const skeletonWidth = (line: Locator) =>
  line.evaluate((element) => Number.parseFloat((element as HTMLElement).style.getPropertyValue("--skeleton-width")));

const roundedHeight = (line: Locator) => line.boundingBox().then((box) => Math.round(box?.height ?? Number.NaN));

test.describe("Skeleton Line", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/skeleton-line");
  });

  test("renders the preview skeleton lines with code", async ({ page }) => {
    const preview = page.locator("#preview");
    const lines = preview.locator(".phi-skeleton-line");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(page.locator("main h1").first()).toHaveText("Skeleton Line");
    await expect(lines).toHaveCount(3);
    await expect.poll(() => skeletonWidth(lines.nth(0))).toBeGreaterThanOrEqual(30);
    await expect.poll(() => skeletonWidth(lines.nth(0))).toBeLessThanOrEqual(100);
    await expect(lines.nth(0)).toHaveCSS("height", "8px");
    await expect(lines.nth(0)).toHaveCSS("border-radius", "2px");
    await expect(snippet).toContainText('from "@dicehub/phi/components/skeleton-line"');
    await expect(snippet).toContainText("<SkeletonLine />");
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Examples",
      "Custom Widths",
      "Custom Height",
      "Block Height",
      "Card Loading State",
      "API Reference",
    ]);
  });

  test("renders documented examples and API reference", async ({ page }) => {
    const examples = page.locator("#examples");
    const customWidths = exampleById(page, "custom-widths");
    const customHeight = exampleById(page, "custom-height");
    const blockHeight = exampleById(page, "block-height");
    const card = exampleById(page, "card-loading-state");

    await expect(examples.locator(".docs-component-example")).toHaveCount(4);
    await expect.poll(() => skeletonWidth(customWidths.locator(".phi-skeleton-line").nth(0))).toBeGreaterThanOrEqual(80);
    await expect.poll(() => skeletonWidth(customWidths.locator(".phi-skeleton-line").nth(0))).toBeLessThanOrEqual(100);
    await expect.poll(() => skeletonWidth(customWidths.locator(".phi-skeleton-line").nth(1))).toBeGreaterThanOrEqual(60);
    await expect.poll(() => skeletonWidth(customWidths.locator(".phi-skeleton-line").nth(1))).toBeLessThanOrEqual(80);
    await expect.poll(() => skeletonWidth(customWidths.locator(".phi-skeleton-line").nth(2))).toBeGreaterThanOrEqual(40);
    await expect.poll(() => skeletonWidth(customWidths.locator(".phi-skeleton-line").nth(2))).toBeLessThanOrEqual(60);
    await expect.poll(() => roundedHeight(customHeight.locator(".phi-skeleton-line").nth(0))).toBe(8);
    await expect.poll(() => roundedHeight(customHeight.locator(".phi-skeleton-line").nth(1))).toBe(16);
    await expect.poll(() => roundedHeight(customHeight.locator(".phi-skeleton-line").nth(2))).toBe(24);
    await expect.poll(() => roundedHeight(customHeight.locator(".phi-skeleton-line").nth(3))).toBe(32);
    await expect(blockHeight.locator(".phi-skeleton-line__block")).toHaveCount(3);
    await expect.poll(() => roundedHeight(blockHeight.locator(".phi-skeleton-line__block").nth(0))).toBe(32);
    await expect.poll(() => roundedHeight(blockHeight.locator(".phi-skeleton-line__block").nth(1))).toBe(48);
    await expect.poll(() => roundedHeight(blockHeight.locator(".phi-skeleton-line__block").nth(2))).toBe(64);
    await expect(card.locator(".phi-skeleton-line")).toHaveCount(4);
    await expect(page.locator("#api-reference tbody tr")).toHaveCount(8);
    await expect(page.locator("#api-reference tbody tr td:first-child code")).toHaveText([
      "minWidth",
      "maxWidth",
      "minDuration",
      "maxDuration",
      "minDelay",
      "maxDelay",
      "blockHeight",
      "className",
    ]);
  });
});

test("Home SkeletonLine card renders the real component", async ({ page }) => {
  await page.goto("/");

  const card = page
    .locator(".home-gallery__item")
    .filter({ has: page.getByRole("link", { name: "SkeletonLine" }) });

  await expect(card.getByRole("link", { name: "SkeletonLine" })).toHaveAttribute(
    "href",
    "/docs/components/skeleton-line",
  );
  await expect(card.locator(".phi-skeleton-line")).toHaveCount(3);
  await expect(card.locator(".home-static--skeleton-line")).toHaveCount(0);
});

test("Skeleton Line is reachable in the left docs navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sidebar = page.locator(".docs-sidebar-panel--desktop");
  const links = sidebar.locator(".docs-nav-group__panel a");
  const sidebarLink = sidebar.getByRole("link", { name: "Sidebar" });
  const skeletonLine = sidebar.getByRole("link", { name: "Skeleton Line" });

  await expect(sidebarLink).toHaveAttribute("href", "/docs/components/sidebar");
  await expect(skeletonLine).toHaveAttribute("href", "/docs/components/skeleton-line");

  const labels = await links.evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(labels.indexOf("Skeleton Line")).toBe(labels.indexOf("Sidebar") + 1);
});
