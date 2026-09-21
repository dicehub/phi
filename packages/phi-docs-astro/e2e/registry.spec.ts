import { expect, test } from "@playwright/test";

test.describe("Registry documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/registry");
  });

  test("documents generated runtime and JSON registry exports", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Registry");
    await expect(page.locator(".docs-article--registry")).toContainText(/\d+ components/);
    await expect(page.locator(".docs-article--registry")).toContainText(/\d+ block/);
    await expect(page.locator(".docs-code-block").filter({ hasText: "componentRegistry" })).toHaveCount(1);
    await expect(
      page.locator(".docs-code-block").filter({ hasText: "registry/component-registry.json" }),
    ).toHaveCount(1);
    await expect(page.locator(".docs-code-block").filter({ hasText: "codegen:registry" })).toHaveCount(1);
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Overview",
      "Runtime API",
      "JSON Export",
      "Registry Contract",
      "Block Templates",
      "Generation",
    ]);
    await expect(page.getByText("placeholder navigation mock")).toHaveCount(0);
  });
});
