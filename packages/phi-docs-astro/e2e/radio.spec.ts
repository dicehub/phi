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

test.describe("Radio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/radio");
  });

  test("renders the preview radio group with code and expected surface dimensions", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/docs/components/radio");

    const preview = page.locator("#preview");
    const previewSurface = preview.locator(".docs-component-preview");
    const fieldset = preview.locator("fieldset");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(page.locator("main h1").first()).toHaveText("Radio");
    await expect(page.locator(".docs-page-header__primitive-link")).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/radio-group",
    );
    await expect(preview.getByRole("group", { name: "Notification preference" })).toHaveCount(1);
    await expect(preview.getByRole("radio", { name: "Email" })).toBeChecked();
    await expect(preview.getByRole("radio", { name: "SMS" })).not.toBeChecked();
    await expect(snippet).toContainText('from "@dicehub/phi/components/radio"');
    await expect(snippet).toContainText("<Radio.Group");
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");

    await expect.poll(() => box(previewSurface)).toMatchObject({ width: 846, height: 162 });
    await expect.poll(() => box(fieldset)).toMatchObject({ height: 112 });
    await expect.poll(() => box(snippet)).toMatchObject({ width: 846 });
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Default (Vertical)",
      "Horizontal",
      "With Description",
      "Control Position",
      "Radio Card",
      "Radio Card (Control on the Left)",
      "Rich Label Content",
      "Radio Card (Horizontal)",
      "With Error",
      "Disabled",
      "Visually Hidden Legend",
      "Custom Legend Styling",
      "Typed Values",
      "API Reference",
      "Radio.Group",
      "Radio.Legend",
      "Radio.Item",
      "Accessibility",
    ]);
  });

  test("renders examples with expected radio layout", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/docs/components/radio");

    await expect(page.locator("#examples .docs-component-example")).toHaveCount(13);

    const descriptionGroup = exampleById(page, "with-description").locator("fieldset");
    await expect(descriptionGroup).toHaveCSS("gap", "16px");
    await expect(exampleById(page, "with-description").locator(".phi-radio-group__description")).toHaveCSS(
      "font-size",
      "13px",
    );

    const horizontalGroup = exampleById(page, "horizontal").locator("fieldset");
    await expect(horizontalGroup.locator(".phi-radio-group__items")).toHaveCSS("flex-direction", "row");

    const controlPosition = exampleById(page, "control-position");
    await expect(controlPosition.getByRole("radio", { name: "Label before radio" })).toBeChecked();
    await controlPosition.locator(".phi-radio").filter({ hasText: "Another option" }).click();
    await expect(controlPosition.getByRole("radio", { name: "Another option" })).toBeChecked();
    await expect(controlPosition.locator(".phi-radio").nth(1)).toHaveAttribute("data-state", "checked");

    const cardGroup = exampleById(page, "radio-card").locator("fieldset");
    const cardItems = exampleById(page, "radio-card").locator(".phi-radio--appearance-card");
    await expect.poll(async () => (await box(cardItems.first())).width).toBe((await box(cardGroup)).width);
    await expect(cardItems.first()).toHaveCSS("padding", "12px");
    await expect(cardItems.first()).toHaveCSS("border-top-width", "0px");
    await expect(cardItems.first()).toHaveCSS("border-bottom-width", "1px");

    const horizontalCardGroup = exampleById(page, "radio-card-horizontal").locator("fieldset");
    const horizontalCardItems = exampleById(page, "radio-card-horizontal").locator(".phi-radio--appearance-card");
    await expect.poll(() => box(horizontalCardGroup)).toMatchObject({ width: 796 });
    await expect.poll(() => box(horizontalCardItems.first())).toMatchObject({ width: 398 });

    const richLabel = exampleById(page, "rich-label-content");
    await expect(richLabel.locator(".phi-badge--neutral")).toHaveText("$0");
    await expect(richLabel.locator(".phi-badge--primary")).toHaveText("Popular");
    await expect(richLabel.locator(".docs-code-block pre")).toContainText('Badge variant="primary"');

    const errorGroups = exampleById(page, "with-error").locator("fieldset");
    const errorExample = exampleById(page, "with-error");
    await expect.poll(async () => (await box(errorGroups.nth(0))).width).toBe((await box(errorGroups.nth(1))).width);
    await expect(exampleById(page, "with-error").locator(".phi-radio-group__error").first()).toHaveCSS(
      "font-size",
      "13px",
    );
    await errorExample.locator(".phi-radio").filter({ hasText: "PayPal" }).first().click();
    await expect(errorExample.locator(".phi-radio").nth(1)).toHaveAttribute("data-state", "checked");

    const disabledExample = exampleById(page, "disabled");
    const disabledGroups = disabledExample.locator("fieldset");
    await expect(disabledGroups).toHaveCount(4);
    await expect.poll(async () => (await box(disabledGroups.nth(0))).width).toBe((await box(disabledGroups.nth(2))).width);
    await expect(page.locator("#disabled + p code")).toHaveText("disabled");
    await expect(disabledExample.locator(".phi-radio").nth(0)).toHaveCSS("opacity", "0.5");
    await expect(disabledExample.locator(".phi-radio").nth(3)).toHaveCSS("opacity", "0.5");

    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(3);
    await expect(page.locator("#api-reference")).toContainText("default slot");
    await expect(page.locator("#api-reference")).toContainText("modelValue");
    await expect(page.locator("#api-reference")).toContainText("value");
    await expect(page.locator("#api-reference")).toContainText("@update:model-value");
    await expect(page.locator("#api-reference")).toContainText("@value-change");
    await expect(page.locator("#api-reference")).toContainText(
      "(value: RadioValue, details: RadioValueChangeDetails) => void",
    );
    await expect(page.locator("#accessibility")).toContainText("Semantic HTML");
  });
});

test("Radio is reachable in the left docs navigation after Popover", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/");

  const sidebar = page.locator(".docs-sidebar-panel--desktop");
  const sidebarScroll = sidebar.locator("[data-sidebar-scroll='desktop']");
  const links = sidebar.locator(".docs-nav-group__panel a");
  const popover = sidebar.getByRole("link", { name: "Popover" });
  const radio = sidebar.getByRole("link", { name: "Radio" });

  await expect(popover).toHaveAttribute("href", "/docs/components/popover");
  await expect(radio).toHaveAttribute("href", "/docs/components/radio");

  const labels = await links.evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(labels.indexOf("Radio")).toBe(labels.indexOf("Popover") + 1);

  await sidebarScroll.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });

  await expect(radio).toBeInViewport();
});
