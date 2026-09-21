import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("Link", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/link");
  });

  test("renders the preview variants with code", async ({ page }) => {
    const preview = page.locator("#preview");
    const links = preview.locator(".phi-link");

    await expect(page.locator("main h1").first()).toHaveText("Link");
    await expect(links).toHaveCount(3);
    await expect(preview.locator(".phi-link--inline")).toHaveText("Default inline link");
    await expect(preview.locator(".phi-link--current")).toHaveText("Current color link");
    await expect(preview.locator(".phi-link--plain")).toHaveText("Plain inline link");
    await expect(preview.locator(".phi-link--inline")).toHaveCSS("text-decoration-line", "underline");
    await expect(preview.locator(".phi-link--plain")).toHaveCSS("text-decoration-line", "none");
    const defaultPlainColor = await preview
      .locator(".phi-link--plain")
      .evaluate((element) => getComputedStyle(element).color);
    await preview.locator(".phi-link--plain").hover();
    await expect
      .poll(async () =>
        preview.locator(".phi-link--plain").evaluate((element) => getComputedStyle(element).color),
      )
      .not.toBe(defaultPlainColor);
    await expect
      .poll(async () =>
        preview.locator(".phi-link--plain").evaluate((element) => getComputedStyle(element).color),
      )
      .toMatch(/\/ 0\.7\)$/);
    await expect(preview.locator(".docs-code-block pre")).toContainText('from "@dicehub/phi/components/link"');
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    const toc = page.locator(".docs-page-toc");

    await expect(toc.locator("a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Basic Link",
      "External Links",
      "Framework Integration",
      "Composition with RouterLink",
      "Examples",
      "Inline in Paragraph",
      "External Link with Icon",
      "Current Variant (Color Inheritance)",
      "Plain Links",
      "Composition with RouterLink",
      "Test IDs",
      "API Reference",
      "Link Props",
      "Variants",
      "Link.ExternalIcon",
      "Design Guidelines",
      "When to Use Each Variant",
      "External Link Indicators",
      "Framework Integration",
      "Accessibility",
    ]);
  });

  test("renders examples and forwards native anchor attributes", async ({ page }) => {
    const external = exampleById(page, "external-link-with-icon");
    const current = exampleById(page, "current-variant");
    const plain = exampleById(page, "plain-links");
    const composition = exampleById(page, "composition-with-routerlink");
    const testIds = exampleById(page, "test-ids");

    await expect(page.locator("#examples .docs-component-example")).toHaveCount(6);
    await expect(exampleById(page, "inline-in-paragraph")).toContainText("Links maintain proper underline offset for readability.");
    await expect(external.getByRole("link", { name: "Visit example" })).toHaveAttribute("target", "_blank");
    await expect(external.getByRole("link", { name: "Visit example" })).toHaveAttribute("rel", "noopener noreferrer");
    await expect(external.locator(".phi-link__external-icon")).toHaveAttribute("aria-hidden", "true");
    await expect(current.locator(".phi-link--current")).toHaveCSS("color", "oklch(0.637 0.237 25.331)");
    await expect(plain.locator(".phi-link--plain")).toHaveCount(3);
    await expect(composition.getByRole("link", { name: "Dashboard" })).toHaveAttribute("data-router", "true");
    await expect(testIds.locator("[data-testid='docs-link']")).toHaveAttribute("aria-label", "Open docs");
    await expect(page.locator("#api-reference #link-props + p + .docs-api-table tbody tr")).toHaveCount(6);
    await expect(page.locator("#api-reference #variants + .docs-api-table tbody tr")).toHaveCount(3);
  });
});

test("Home Link card renders a real link preview", async ({ page }) => {
  await page.goto("/");

  const card = page
    .locator(".home-gallery__item")
    .filter({ has: page.getByRole("link", { name: "Link" }) });

  await expect(card.locator(".phi-link")).toHaveCount(2);
  await expect(card.locator(".phi-link").first()).toHaveAttribute("href", "/docs/components/link");
  await expect(card.locator(".phi-link__external-icon")).toHaveCount(1);
});
