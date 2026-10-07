import { expect, type Locator, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

const box = async (locator: Locator) => {
  const result = await locator.boundingBox();
  if (!result) throw new Error("Expected element to have a bounding box");

  return {
    height: Math.round(result.height),
    width: Math.round(result.width),
  };
};

test.describe("Switch", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/switch");
  });

  test("renders the preview switch with code and Ark link", async ({ page }) => {
    const preview = page.locator("#preview");
    const control = preview.getByRole("switch", { name: "Switch" });
    const snippet = preview.locator(".docs-code-block pre");

    await expect(page.locator("main h1").first()).toHaveText("Switch");
    await expect(page.locator(".docs-page-header__primitive-link")).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/switch",
    );
    await expect(control).toHaveAttribute("aria-checked", "false");
    await expect.poll(() => box(control)).toMatchObject({ width: 36, height: 18 });
    await expect.poll(() => box(preview.locator(".phi-switch__thumb"))).toMatchObject({ width: 18, height: 18 });

    await control.click();
    await expect(control).toHaveAttribute("aria-checked", "true");
    await expect(snippet).toContainText('from "@dicehub/phi/components/switch"');
    await expect(snippet).toContainText('v-model:checked="checked"');
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Off State",
      "On State",
      "Disabled",
      "Variants",
      "Neutral Variant",
      "Neutral States",
      "Sizes",
      "Custom ID",
      "Switch Group",
      "Visually Hidden Legend",
      "Custom Legend Styling",
      "API Reference",
      "Switch",
      "Switch.Group",
      "Switch.Legend",
      "Switch.Item",
      "Accessibility",
    ]);
  });

  test("renders documented examples and API reference", async ({ page }) => {
    const examples = page.locator("#examples");
    const offState = exampleById(page, "off-state");
    const onState = exampleById(page, "on-state");
    const disabled = exampleById(page, "disabled");
    const variants = exampleById(page, "variants");
    const sizes = exampleById(page, "sizes");
    const customId = exampleById(page, "custom-id");
    const group = exampleById(page, "switch-group");
    const srOnly = exampleById(page, "visually-hidden-legend");
    const customLegend = exampleById(page, "custom-legend-styling");

    await expect(examples.locator(".docs-component-example")).toHaveCount(11);
    await expect(offState.getByRole("switch", { name: "Switch" })).toHaveAttribute("aria-checked", "false");
    await expect(onState.getByRole("switch", { name: "Switch" })).toHaveAttribute("aria-checked", "true");
    await expect(disabled.getByRole("switch", { name: "Disabled" })).toBeDisabled();

    await expect(variants.locator(".phi-switch")).toHaveCount(4);
    await expect(variants.getByRole("switch", { name: "Default on" })).toHaveAttribute("data-variant", "default");
    await expect(variants.getByRole("switch", { name: "Neutral on" })).toHaveAttribute("data-variant", "neutral");
    await expect(variants.getByRole("switch", { name: "Neutral on" })).toHaveCSS("background-color", "rgb(115, 115, 115)");

    await expect.poll(() => box(sizes.getByRole("switch", { name: "Small" }))).toMatchObject({ width: 32, height: 16 });
    await expect.poll(() => box(sizes.getByRole("switch", { name: "Base (default)" }))).toMatchObject({
      width: 36,
      height: 18,
    });
    await expect.poll(() => box(sizes.getByRole("switch", { name: "Large" }))).toMatchObject({ width: 40, height: 20 });

    await expect(customId.locator("#my-custom-switch")).toHaveAttribute("aria-checked", "false");
    await customId.locator(".phi-switch-field__label").click();
    await expect(customId.locator("#my-custom-switch")).toHaveAttribute("aria-checked", "true");

    await expect(group.getByRole("group", { name: "Notification settings" })).toHaveCount(1);
    await group.locator(".phi-switch-item").filter({ hasText: "SMS notifications" }).locator(".phi-switch-item__label").click();
    await expect(group.getByRole("switch", { name: "SMS notifications" })).toHaveAttribute("aria-checked", "true");
    await expect(srOnly.locator(".phi-sr-only")).toHaveText("Notification settings");
    await expect(customLegend.locator(".switch-demo__legend-subtle")).toHaveText("Notification settings");

    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(4);
    await expect(page.locator("#api-reference")).toContainText("ariaLabel");
    await expect(page.locator("#api-reference")).toContainText("$attrs");
    await expect(page.locator("#api-reference")).toContainText("labelTooltip");
    await expect(page.locator("#api-reference")).toContainText("controlFirst");
    await expect(page.locator("#api-reference")).toContainText("description slot");
    await expect(page.locator("#api-reference")).toContainText("@checked-change");
    await expect(page.locator("#accessibility")).toContainText('role="switch"');
  });
});

test("Switch is reachable in the left docs navigation after Slider", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sidebar = page.locator(".docs-sidebar-panel--desktop");
  const links = sidebar.locator(".docs-nav-group__panel a");
  const skeletonLine = sidebar.getByRole("link", { name: "Skeleton Line" });
  const switchLink = sidebar.getByRole("link", { name: "Switch" });

  await expect(skeletonLine).toHaveAttribute("href", "/docs/components/skeleton-line");
  await expect(switchLink).toHaveAttribute("href", "/docs/components/switch");

  const labels = await links.evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(labels.indexOf("Switch")).toBe(labels.indexOf("Slider") + 1);
});
