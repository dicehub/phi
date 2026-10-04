import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("Loader", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/loader");
  });

  test("renders the preview loader with code", async ({ page }) => {
    const preview = page.locator("#preview");
    const loader = preview.locator(".phi-loader");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(page.locator("main h1").first()).toHaveText("Loader");
    await expect(loader).toHaveCount(1);
    await expect(preview.getByRole("status", { name: "Loading" })).toHaveCount(1);
    await expect(loader).toHaveAttribute("viewBox", "0 0 24 24");
    await expect(loader.locator("circle")).toHaveCount(2);
    await expect(loader.locator("animateTransform")).toHaveAttribute("dur", "2s");
    await expect(loader.locator("animate")).toHaveCount(2);
    await expect
      .poll(async () => loader.boundingBox().then((box) => Math.round(box?.width ?? Number.NaN)))
      .toBe(24);
    await expect(snippet).toContainText('from "@dicehub/phi/components/loader"');
    await expect(snippet).toContainText("<Loader />");
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
      "Default Size",
      "Custom Size",
      "API Reference",
    ]);
    await expect(toc.locator("a[href='#preview']")).toHaveCount(0);
    await expect(toc.locator("a[href='#installation'] + ul a")).toHaveCount(2);
    await expect(toc.locator("a[href='#examples'] + ul a")).toHaveCount(2);
  });

  test("renders examples and API reference", async ({ page }) => {
    const examples = page.locator("#examples");
    const defaultSize = exampleById(page, "default-size");
    const customSize = exampleById(page, "custom-size");

    await expect(examples.getByRole("heading", { name: "Default Size" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Custom Size" })).toBeVisible();
    await expect(examples.locator(".docs-component-example")).toHaveCount(2);
    await expect(defaultSize.locator(".phi-loader")).toHaveCount(1);
    await expect(customSize.locator(".phi-loader")).toHaveCount(1);
    await expect(customSize.locator(".docs-code-block")).toContainText(':size="24"');
    await expect
      .poll(async () => customSize.locator(".phi-loader").boundingBox().then((box) => Math.round(box?.width ?? Number.NaN)))
      .toBe(24);
    await expect(page.locator("#api-reference tbody tr")).toHaveCount(2);
    await expect(page.locator("#api-reference")).toContainText('"sm" | "base" | "lg" | number');
    await expect(page.locator("#api-reference")).not.toContainText("aria-label");
  });
});
