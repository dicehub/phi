import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

const box = async (locator: ReturnType<Page["locator"]>) => {
  const result = await locator.boundingBox();
  if (!result) throw new Error("Expected element to have a bounding box");

  return {
    height: Math.round(result.height),
    width: Math.round(result.width),
    x: Math.round(result.x),
    y: Math.round(result.y),
  };
};

test.describe("Sensitive Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/sensitive-input");
  });

  test("renders the masked preview at its expected size and reveal flow", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/docs/components/sensitive-input");

    const preview = page.locator("#preview");
    const control = preview.locator(".phi-sensitive-input-control");
    const input = preview.locator(".phi-sensitive-input");

    await expect(page.locator("main h1").first()).toHaveText("Sensitive Input");
    await expect(page.locator(".docs-page-header__primitive-link")).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/field",
    );
    await expect(preview.locator(".phi-sensitive-input-label")).toHaveText("API Key");
    await expect(control).toHaveAttribute("role", "button");
    await expect(control).toHaveAttribute("aria-label", "API Key, masked.");
    await expect(input).toHaveAttribute("type", "password");
    await expect(input).toHaveAttribute("aria-hidden", "true");
    await expect.poll(() => box(control)).toMatchObject({ width: 320, height: 36 });
    await expect(preview.locator(".phi-sensitive-input-mask__bullets")).toHaveText("••••••••");

    await control.click();
    await expect(input).toHaveAttribute("type", "text");
    await expect(input).toHaveValue("example-api-key");
    await expect(preview.locator(".phi-sensitive-input-toggle")).toHaveAttribute("aria-label", "Hide value");

    await page.keyboard.press("Escape");
    await expect(control).toHaveAttribute("role", "button");
    await expect(input).toHaveAttribute("type", "password");
  });

  test("matches the documented examples and interactive states", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/docs/components/sensitive-input");

    await expect(page.locator("#examples .docs-component-example")).toHaveCount(3);
    await expect(page.locator(".docs-page-toc a")).toContainText([
      "Sizes",
      "Controlled",
      "States",
    ]);

    const sizeControls = exampleById(page, "sizes").locator(".phi-sensitive-input-control");
    await expect.poll(() => box(sizeControls.nth(0))).toMatchObject({ width: 205, height: 20 });
    await expect.poll(() => box(sizeControls.nth(1))).toMatchObject({ width: 213, height: 26 });
    await expect.poll(() => box(sizeControls.nth(2))).toMatchObject({ width: 266, height: 36 });
    await expect.poll(() => box(sizeControls.nth(3))).toMatchObject({ width: 282, height: 40 });

    const controlled = exampleById(page, "controlled");
    await controlled.getByRole("button", { name: "Controlled Secret, masked." }).click();
    await expect(controlled.locator(".phi-sensitive-input")).toHaveValue("my-secret-value");
    await controlled.getByRole("button", { name: "Change value" }).click();
    await expect(controlled.locator(".sensitive-input-demo__value code")).toHaveText("new-secret-1");
    await controlled.getByRole("button", { name: "Clear" }).click();
    await expect(controlled.locator(".sensitive-input-demo__value code")).toHaveText("");

    const states = exampleById(page, "states");
    await expect(states.locator(".phi-sensitive-input-error")).toHaveCSS("color", "rgb(180, 35, 24)");
    await expect(states.locator(".phi-sensitive-input-description")).toHaveCSS("font-size", "13px");
    await expect(states.locator(".phi-sensitive-input-control--disabled")).toHaveCSS("cursor", "not-allowed");
    const readOnlyField = states.locator(".phi-sensitive-input-field").filter({ hasText: "Read-only" });
    await readOnlyField.getByRole("button", { name: "Read-only, masked." }).click();
    await expect(readOnlyField.locator(".phi-sensitive-input")).toHaveAttribute("type", "text");
  });

  test("restarts feedback after each successful copy", async ({ page }) => {
    const preview = page.locator("#preview");
    const button = preview.locator(".phi-sensitive-input-copy");
    await preview.locator(".phi-sensitive-input-control").hover();
    await expect(button).toHaveAttribute("aria-label", "Copy to clipboard");
    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async () => {} },
      });
    });
    await page.clock.install();
    await page.clock.pauseAt(new Date(Date.now() + 1000));

    await button.click();
    await expect(button).toHaveAttribute("aria-label", "Copied");
    await page.clock.fastForward(1500);
    await button.click();
    await page.clock.fastForward(600);
    await expect(button).toHaveAttribute("aria-label", "Copied");
    await page.clock.fastForward(1399);
    await expect(button).toHaveAttribute("aria-label", "Copied");
    await page.clock.fastForward(1);
    await expect(button).toHaveAttribute("aria-label", "Copy to clipboard");
  });

  test("supports copy feedback and documents API", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/docs/components/sensitive-input");

    const preview = page.locator("#preview");
    const control = preview.locator(".phi-sensitive-input-control");
    await control.hover();
    const copyButton = preview.getByRole("button", { name: "Copy to clipboard" });
    await expect(copyButton).toHaveCSS("opacity", "1");
    await copyButton.click();
    await expect(preview.getByRole("button", { name: "Copied" })).toBeVisible();

    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(3);
    await expect(page.locator("#api-reference")).toContainText("modelValue / v-model");
    await expect(page.locator("#api-reference")).toContainText("@copy");
    await expect(page.locator("#api-reference")).toContainText("label");

    const sidebar = page.locator(".docs-sidebar-panel--desktop");
    const labels = await sidebar.locator(".docs-nav-group__panel a").evaluateAll((items) =>
      items.map((item) => item.textContent?.trim()),
    );
    expect(labels.indexOf("Sensitive Input")).toBe(labels.indexOf("Select") + 1);
    await expect(sidebar.getByRole("link", { name: "Sensitive Input" })).toHaveAttribute(
      "href",
      "/docs/components/sensitive-input",
    );
  });
});
