import { expect, type Locator, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

const templateColumnCount = async (locator: Locator) =>
  locator.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);

test.describe("Grid", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/grid");
  });

  test("renders expected page sections and snippets", async ({ page }) => {
    await expect(page.locator("main h1").first()).toHaveText("Grid");
    await expect(page.locator(".docs-component-example")).toHaveCount(5);
    await expect(page.locator(".docs-code-block")).toHaveCount(7);
    await expect(page.locator("#preview .docs-code-block")).toContainText('from "@dicehub/phi/components/grid"');
    await expect(page.locator("#preview .docs-code-block")).toContainText('<Grid variant="2up" gap="base">');
    await expect(page.locator(".docs-code-block").filter({ hasText: "v-for" })).toHaveCount(0);
    await expect(page.locator("#all-variants tbody tr")).toHaveCount(9);
    await expect(page.locator("#all-variants")).toContainText("1-2-4up");
    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(2);
    await expect(page.locator("#grid-api")).toContainText("mobileDivider");
    await expect(page.locator("#grid-api")).toContainText('"2up" | "side-by-side"');
    await expect(page.locator("#grid-item-api")).toContainText("default slot");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Grid Variants",
      "Asymmetric Layouts",
      "Gap Sizes",
      "Mobile Dividers",
      "All Variants",
      "API Reference",
      "Grid",
      "GridItem",
    ]);
    await expect(page.locator(".docs-page-toc a[href='#preview']")).toHaveCount(0);
  });

  test("renders preview and variant layouts", async ({ page }) => {
    const preview = page.locator("#preview .phi-grid");
    const variants = exampleById(page, "grid-variants");
    const asymmetric = exampleById(page, "asymmetric-layouts");

    await expect(preview).toHaveClass(/phi-grid--2up/);
    await expect(preview).toHaveClass(/phi-grid--gap-base/);
    await expect(preview.locator(".phi-grid-item")).toHaveText(["Item 1First grid item", "Item 2Second grid item"]);
    await expect.poll(() => templateColumnCount(preview)).toBe(2);
    await expect.poll(async () => preview.boundingBox().then((box) => box?.width ?? Number.NaN)).toBeLessThan(380);

    await expect(variants.locator(".phi-grid--2up")).toHaveCount(1);
    await expect(variants.locator(".phi-grid--3up")).toHaveCount(1);
    await expect(variants.locator(".phi-grid--4up")).toHaveCount(1);
    await expect.poll(() => templateColumnCount(variants.locator(".phi-grid--3up"))).toBe(3);
    await expect.poll(() => templateColumnCount(variants.locator(".phi-grid--4up"))).toBe(4);
    await expect.poll(async () => variants.locator(".phi-grid--4up").boundingBox().then((box) => box?.width ?? Number.NaN)).toBeLessThan(230);

    await expect(asymmetric.locator(".phi-grid--2-1")).toHaveCount(1);
    await expect(asymmetric.locator(".phi-grid--1-2")).toHaveCount(1);
    await expect(asymmetric).toContainText("Two-thirds width");
    await expect(asymmetric).toContainText("One-third width");
    await expect.poll(async () => asymmetric.locator(".phi-grid--2-1").boundingBox().then((box) => box?.width ?? Number.NaN)).toBeLessThan(460);
  });

  test("applies expected gap sizes", async ({ page }) => {
    const gaps = exampleById(page, "gap-sizes").locator(".phi-grid");

    await expect(gaps.nth(0)).toHaveCSS("column-gap", "0px");
    await expect(gaps.nth(1)).toHaveCSS("column-gap", "12px");
    await expect(gaps.nth(2)).toHaveCSS("column-gap", "32px");
    await expect(gaps.nth(3)).toHaveCSS("column-gap", "32px");
  });

  test("renders mobile dividers only on mobile", async ({ page }) => {
    const desktopDivider = exampleById(page, "mobile-dividers").locator(".phi-grid-item--mobile-divider").first();

    await expect(desktopDivider).toHaveCSS("border-bottom-style", "none");
    await expect(desktopDivider).toHaveCSS("padding-bottom", "0px");

    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/docs/components/grid#mobile-dividers");

    const mobileExample = exampleById(page, "mobile-dividers");
    const mobileDivider = mobileExample.locator(".phi-grid-item--mobile-divider").first();

    await expect(mobileExample.locator(".phi-grid-item--mobile-divider")).toHaveCount(4);
    await expect(mobileDivider).toHaveCSS("border-bottom-style", "solid");
    await expect(mobileDivider).toHaveCSS("padding-bottom", "32px");
    await expect.poll(() => templateColumnCount(mobileExample.locator(".phi-grid--4up"))).toBe(1);
  });
});

test("Home Grid card renders a real grid", async ({ page }) => {
  await page.goto("/");

  const card = page
    .locator(".home-gallery__item")
    .filter({ has: page.getByRole("link", { name: "Grid" }) });

  await expect(card.locator(".phi-grid")).toHaveCount(1);
  await expect(card.locator(".phi-grid")).toHaveClass(/phi-grid--2up/);
  await expect(card.locator(".phi-grid-item")).toHaveText(["1", "2", "3", "4"]);
});
