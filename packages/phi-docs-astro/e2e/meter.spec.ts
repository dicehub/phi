import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

const indicatorRatio = async (page: Page, rootSelector: string) =>
  page.locator(rootSelector).evaluate((root) => {
    const track = root.querySelector(".phi-meter__track");
    const indicator = root.querySelector(".phi-meter__indicator");
    if (!(track instanceof HTMLElement) || !(indicator instanceof HTMLElement)) return Number.NaN;

    return Math.round((indicator.getBoundingClientRect().width / track.getBoundingClientRect().width) * 100);
  });

test.describe("Meter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/meter");
  });

  test("renders the preview meter with code and ARIA semantics", async ({ page }) => {
    const preview = page.locator("#preview");
    const meter = preview.locator(".phi-meter");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(page.locator("main h1").first()).toHaveText("Meter");
    await expect(meter).toHaveCount(1);
    await expect(preview.getByRole("meter", { name: "Storage used" })).toHaveCount(1);
    await expect(meter).toHaveAttribute("aria-valuemin", "0");
    await expect(meter).toHaveAttribute("aria-valuemax", "100");
    await expect(meter).toHaveAttribute("aria-valuenow", "65");
    await expect(meter).toHaveAttribute("aria-valuetext", "65%");
    await expect(meter.locator(".phi-meter__label")).toHaveText("Storage used");
    await expect(meter.locator(".phi-meter__value")).toHaveText("65%");
    await expect.poll(() => indicatorRatio(page, "#preview .phi-meter")).toBe(65);
    await expect(snippet).toContainText('from "@dicehub/phi/components/meter"');
    await expect(snippet).toContainText('<Meter label="Storage used" :value="65" />');
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Basic Meter",
      "Custom Value Display",
      "Hidden Value",
      "Full Meter",
      "Low Value",
      "API Reference",
    ]);
  });

  test("renders examples and API reference", async ({ page }) => {
    const examples = page.locator("#examples");
    const customValue = exampleById(page, "custom-value-display");
    const hiddenValue = exampleById(page, "hidden-value");
    const fullMeter = exampleById(page, "full-meter");
    const lowValue = exampleById(page, "low-value");

    await expect(examples.locator(".docs-component-example")).toHaveCount(5);
    await expect(customValue.locator(".phi-meter__value")).toHaveText("750 / 1,000");
    await expect(customValue.locator(".phi-meter")).toHaveAttribute("aria-valuetext", "750 / 1,000");
    await expect(hiddenValue.locator(".phi-meter__value")).toHaveCount(0);
    await expect(fullMeter.locator(".phi-meter__value")).toHaveText("100%");
    await expect.poll(() => indicatorRatio(page, "#full-meter + p + .docs-component-example .phi-meter")).toBe(100);
    await expect(lowValue.locator(".phi-meter__value")).toHaveText("15%");
    await expect(page.locator("#api-reference tbody tr")).toHaveCount(9);
    await expect(page.locator("#api-reference")).toContainText("className");
    await expect(page.locator("#api-reference")).toContainText("customValue");
    await expect(page.locator("#api-reference")).toContainText("trackClassName");
    await expect(page.locator("#api-reference")).toContainText("indicatorClassName");
    await expect(page.locator("#api-reference")).toContainText("value*");
  });
});

test("Meter is reachable in the left docs navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sidebar = page.locator(".docs-sidebar-panel--desktop");
  const links = sidebar.locator(".docs-nav-group__panel a");
  const menuBar = sidebar.getByRole("link", { name: "MenuBar" });
  const meter = sidebar.getByRole("link", { name: "Meter" });

  await expect(menuBar).toHaveAttribute("href", "/docs/components/menu-bar");
  await expect(meter).toHaveAttribute("href", "/docs/components/meter");

  const labels = await links.evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(labels.indexOf("Meter")).toBe(labels.indexOf("MenuBar") + 1);

  await meter.scrollIntoViewIfNeeded();

  await expect(meter).toBeInViewport();
});
