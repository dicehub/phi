import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("Layer Card", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/layer-card");
  });

  test("renders the preview with code", async ({ page }) => {
    const preview = page.locator("#preview");
    const card = preview.locator(".phi-layer-card");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(page.locator("main h1").first()).toHaveText("Layer Card");
    await expect(card).toHaveCount(1);
    await expect(card.locator(".phi-layer-card__secondary")).toContainText("Next Steps");
    await expect(card.locator(".phi-layer-card__primary")).toContainText("Get started with Phi");
    await expect(preview.getByRole("button", { name: "Go to next steps" })).toBeVisible();
    await expect(snippet).toContainText('from "@dicehub/phi/components/layer-card"');
    await expect(snippet).toContainText("<LayerCard.Secondary");
    await expect(snippet).toContainText("<LayerCard.Primary");
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    const toc = page.locator(".docs-page-toc");

    await expect(toc.locator("a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Basic Card",
      "Surface-style Card",
      "Multiple Cards",
      "Filter Toolbar with Small Tabs",
      "Test IDs",
      "API Reference",
    ]);
    await expect(toc.locator("a[href='#preview']")).toHaveCount(0);
    await expect(toc.locator("a[href='#installation'] + ul a")).toHaveCount(2);
    await expect(toc.locator("a[href='#examples'] + ul a")).toHaveCount(5);
  });

  test("renders layered and surface usage modes", async ({ page }) => {
    const usage = page.locator("#usage");
    const card = usage.locator(".docs-component-preview .phi-layer-card");

    await expect(card.locator(".phi-layer-card__secondary")).toContainText("Documentation");
    await expect(card.locator(".phi-layer-card__primary")).toContainText("Learn how to use Phi components");
    await expect(usage.locator(".docs-code-block").first()).toContainText('style="width: 250px;"');
    await expect(usage.locator(".docs-code-block").last()).toContainText("padding: 1rem");
  });

  test("renders every example and forwards test attributes", async ({ page }) => {
    const examples = page.locator("#examples");
    const surface = exampleById(page, "surface-style-card");
    const multiple = exampleById(page, "multiple-cards");
    const testIds = exampleById(page, "test-ids");

    await expect(examples.getByRole("heading", { name: "Basic Card" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Surface-style Card" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Multiple Cards" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Filter Toolbar with Small Tabs" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Test IDs" })).toBeVisible();
    await expect(examples.locator(".docs-component-example")).toHaveCount(5);
    await expect(examples.locator(".docs-code-block")).toHaveCount(5);
    await expect(surface.locator(".phi-layer-card__primary")).toHaveCount(0);
    await expect(surface.locator(".phi-layer-card")).toContainText("Quick start guide for new users");
    await expect
      .poll(async () => surface.locator(".phi-layer-card").boundingBox().then((box) => box?.width ?? Number.NaN))
      .toBeLessThan(270);
    await expect(multiple.locator(".phi-layer-card")).toHaveCount(2);
    await expect(testIds.locator("[data-testid='card-header']")).toContainText("Getting Started");
    await expect(testIds.locator("[data-testid='card-body']")).toHaveAttribute("aria-label", "Getting started body");
    await expect(page.locator("#api-reference thead th")).toHaveText(["Prop", "Type", "Default", "Description"]);
    await expect(page.locator("#api-reference tbody tr")).toHaveCount(6);
    await expect(page.locator("#api-reference tbody tr td:first-child")).toHaveText([
      "as",
      "default slot",
      "class",
      "id",
      "lang",
      "title",
    ]);
  });

  test("filters the subrequests mockup", async ({ page }) => {
    const filterExample = exampleById(page, "filter-toolbar-with-small-tabs");
    const tabs = filterExample.locator(".layer-card-demo__tabs");
    const indicator = tabs.locator(".layer-card-demo__tabs-indicator");

    await expect(indicator).toHaveCount(1);
    await expect
      .poll(async () =>
        indicator.evaluate((element) => getComputedStyle(element).transition),
      )
      .toContain("0.2s");
    const initialIndicatorLeft = await indicator.evaluate((element) => element.getBoundingClientRect().left);

    await expect(filterExample.locator(".layer-card-demo__row").filter({ hasText: "api.example.com" })).toBeVisible();
    await filterExample.getByRole("tab", { name: "4xx" }).click();
    await expect
      .poll(async () =>
        indicator.evaluate((element) => element.getBoundingClientRect().left),
      )
      .toBeGreaterThan(initialIndicatorLeft + 80);
    await expect(filterExample.locator(".layer-card-demo__row").filter({ hasText: "Unknown" })).toBeVisible();
    await expect(filterExample.locator(".layer-card-demo__row").filter({ hasText: "challenges.cloudflare.com" })).toHaveCount(0);
    await expect(filterExample.locator(".layer-card-demo__footer")).toHaveText("Showing 2 of 3");

    await filterExample.getByLabel("Filter origins").fill("api");
    await expect(filterExample.locator(".layer-card-demo__row").filter({ hasText: "api.example.com" })).toBeVisible();
    await expect(filterExample.locator(".layer-card-demo__row").filter({ hasText: "Unknown" })).toHaveCount(0);
    await expect(filterExample.locator(".layer-card-demo__footer")).toHaveText("Showing 1 of 3");
  });
});

test("Home LayerCard card renders a real layered card", async ({ page }) => {
  await page.goto("/");

  const card = page
    .locator(".home-gallery__item")
    .filter({ has: page.getByRole("link", { name: "LayerCard" }) });

  await expect(card.locator(".phi-layer-card")).toHaveCount(1);
  await expect(card.locator(".phi-layer-card__secondary")).toContainText("Next Steps");
  await expect(card.locator(".phi-layer-card__primary")).toContainText("Get started with Phi");
});
