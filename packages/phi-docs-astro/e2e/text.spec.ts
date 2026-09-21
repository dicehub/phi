import { expect, type Locator, type Page, test } from "@playwright/test";

const box = async (locator: Locator) => {
  const result = await locator.boundingBox();
  if (!result) throw new Error("Expected element to have a bounding box");

  return {
    height: Math.round(result.height),
    width: Math.round(result.width),
    x: Math.round(result.x),
    y: Math.round(result.y),
  };
};

const textExample = (page: Page, label: string) =>
  page.locator("#preview [data-phi-component='Text']").filter({ hasText: new RegExp(`^${label}$`) }).first();

test.describe("Text", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/text");
  });

  test("renders the preview text variants with expected styles", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto("/docs/components/text");

    const preview = page.locator("#preview");
    const cards = preview.locator(".text-demo-card");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(page.locator("main h1").first()).toHaveText("Text");
    await expect(page.locator(".docs-page-header__primitive-link")).toHaveCount(0);
    await expect(page.getByLabel("View source on GitLab")).toHaveCount(0);
    await expect(cards).toHaveCount(13);
    await expect.poll(() => box(cards.first()).then((card) => card.width)).toBeGreaterThanOrEqual(200);
    await expect.poll(() => box(cards.first()).then((card) => card.width)).toBeLessThanOrEqual(208);

    await expect(textExample(page, "Heading")).toHaveCSS("font-size", "16px");
    await expect(textExample(page, "Heading")).toHaveCSS("font-weight", "600");
    await expect(textExample(page, "Heading")).toHaveCSS("line-height", "20px");
    await expect(textExample(page, "Heading large")).toHaveCSS("font-size", "20px");
    await expect(textExample(page, "Heading large")).toHaveCSS("line-height", "28px");
    await expect(textExample(page, "Body")).toHaveCSS("font-size", "14px");
    await expect(textExample(page, "Body")).toHaveCSS("line-height", "21px");
    await expect(textExample(page, "Body bold")).toHaveCSS("font-weight", "500");
    await expect(textExample(page, "Body lg")).toHaveCSS("line-height", "24px");
    await expect(textExample(page, "Body sm")).toHaveCSS("line-height", "19.5px");
    await expect(textExample(page, "Body xs")).toHaveCSS("line-height", "18px");
    await expect(textExample(page, "Body secondary")).toHaveCSS("color", "oklch(0.556 0 0)");
    await expect(textExample(page, "Monospace")).toHaveCSS("font-size", "13px");
    await expect(textExample(page, "Success")).toHaveCSS("color", "oklch(0.685 0.169 237.323)");
    await expect(textExample(page, "Error")).toHaveCSS("color", "oklch(0.637 0.237 25.331)");
    await expect(snippet).toContainText('from "@dicehub/phi/components/text"');
    await expect(snippet).toContainText('variant="heading" size="lg" as="h2"');
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Truncate",
      "API Reference",
    ]);
  });

  test("renders usage, truncate, and the documented API reference", async ({ page }) => {
    const truncateText = page
      .locator("#truncate [data-phi-component='Text']")
      .filter({ hasText: "This is a long piece of text" });

    await expect(page.locator("#usage")).toContainText("Semantic HTML");
    await expect(page.locator("#usage")).toContainText("Restrictions");
    await expect(page.locator("#usage .docs-code-block pre").nth(1)).toContainText('variant="heading" size="lg" as="h1"');
    await expect(page.locator("#usage .docs-code-block pre").nth(2)).toContainText('variant="mono" size="lg"');

    await expect(truncateText).toHaveCSS("overflow", "hidden");
    await expect(truncateText).toHaveCSS("text-overflow", "ellipsis");
    await expect(truncateText).toHaveCSS("white-space", "nowrap");
    await expect
      .poll(() => truncateText.evaluate((element) => element.scrollWidth - Math.round(element.getBoundingClientRect().width)))
      .toBeGreaterThan(300);

    await expect(page.locator("#api-reference tbody tr td:first-child code")).toHaveText([
      "variant",
      "size",
      "bold",
      "truncate",
      "as",
      "default",
    ]);
    await expect(page.locator("#api-reference")).toContainText('"mono-secondary"');
    await expect(page.locator("#api-reference")).toContainText('"label"');
    const defaultSlotRow = page.locator("#api-reference tbody tr").last();
    await expect(defaultSlotRow.locator("td").nth(0)).toHaveText("default");
    await expect(defaultSlotRow.locator("td").nth(1)).toHaveText("slot");
    await expect(defaultSlotRow.locator("td").nth(3)).toHaveText("Text content.");
  });
});

test("Home Text card renders the real component", async ({ page }) => {
  await page.goto("/");

  const card = page
    .locator(".home-gallery__item")
    .filter({ has: page.getByRole("link", { name: "Text", exact: true }) });

  await expect(card.getByRole("link", { name: "Text", exact: true })).toHaveAttribute("href", "/docs/components/text");
  await expect(card.locator("[data-phi-component='Text']")).toHaveCount(3);
  await expect(card.locator(".home-static--text")).toHaveCount(0);
});

test("Text is reachable in the left docs navigation after Tag Input", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sidebar = page.locator(".docs-sidebar-panel--desktop");
  const links = sidebar.locator(".docs-nav-group__panel a");
  const tagInputLink = sidebar.getByRole("link", { name: "Tag Input" });
  const textLink = sidebar.getByRole("link", { name: "Text", exact: true });

  await expect(tagInputLink).toHaveAttribute("href", "/docs/components/tag-input");
  await expect(textLink).toHaveAttribute("href", "/docs/components/text");

  const labels = await links.evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(labels.indexOf("Text")).toBe(labels.indexOf("Tag Input") + 1);
});
