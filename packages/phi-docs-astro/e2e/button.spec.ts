import { expect, type Locator, type Page, test } from "@playwright/test";

async function expectTitleTooltip(page: Page, trigger: Locator, text: string) {
  await trigger.hover();
  await expect(trigger).toHaveAttribute("aria-describedby", /^tooltip:/, { timeout: 5000 });

  const tooltipId = await trigger.getAttribute("aria-describedby");
  await expect(page.locator(`[id="${tooltipId}"]`)).toContainText(text);

  await page.mouse.move(4, 4);
  await expect(page.locator(`[id="${tooltipId}"]`)).toHaveCount(0);
}

test.describe("Button", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/button");
  });

  test("renders preview with code", async ({ page }) => {
    const preview = page.locator("#preview");
    const buttons = preview.locator(".phi-button");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(buttons).toHaveCount(2);
    await expect(buttons.first()).toHaveText("Button");
    await expect(preview.getByRole("button", { name: "Add" })).toHaveClass(/phi-button--square/);
    await expect(preview.locator(".docs-demo-row")).toHaveCSS("justify-content", "center");
    await expect(preview.locator(".docs-component-preview")).toHaveCSS("padding-top", "36px");
    await expect(preview.locator(".docs-component-preview")).toHaveCSS("padding-bottom", "36px");
    await expect(snippet).toContainText('from "@phosphor-icons/vue"');
    await expect(snippet).toContainText('<Button variant="secondary">Button</Button>');
    await expect(snippet).toContainText('shape="square"');
    await expect(snippet).not.toContainText("v-for");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    const toc = page.locator(".docs-page-toc");

    await expect(toc.locator("a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Variants",
      "Sizes",
      "With Icon",
      "Icon Only",
      "Loading State",
      "Disabled State",
      "Title",
      "Link as Button",
      "API Reference",
    ]);
    await expect(toc.locator("a[href='#preview']")).toHaveCount(0);
    await expect(toc.locator("a[href='#installation'] + ul a")).toHaveCount(2);
    await expect(toc.locator("a[href='#examples'] + ul a")).toHaveCount(8);
  });

  test("renders usage example above its code", async ({ page }) => {
    const usage = page.locator("#usage");

    await expect(usage.locator(".docs-component-preview .phi-button")).toHaveText("Click me");
    await expect(usage.locator(".docs-code-block")).toContainText('<Button variant="secondary">Click me</Button>');
  });

  test("renders every documented example with snippets", async ({ page }) => {
    const examples = page.locator("#examples");
    const exampleBlocks = examples.locator(".docs-component-example");

    await expect(examples.getByRole("heading", { name: "Variants" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Primary" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Secondary", exact: true })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Ghost" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Destructive", exact: true })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Outline" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Secondary Destructive" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Sizes" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "With Icon" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Icon Only" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Loading State" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Disabled State" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Title" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Link as Button" })).toBeVisible();
    await expect(examples.locator(".docs-component-example")).toHaveCount(13);
    await expect(examples.locator(".docs-code-block")).toHaveCount(13);
    await expect(exampleBlocks.nth(0).locator(".docs-demo-row")).toHaveCSS("justify-content", "center");
    await expect(exampleBlocks.nth(1).locator(".docs-demo-row")).toHaveCSS("justify-content", "center");
    await expect(examples).not.toContainText("v-for");
  });

  test("supports sizes, icon-only, loading, disabled, and link button states", async ({ page }) => {
    const examples = page.locator("#examples");
    const exampleBlocks = examples.locator(".docs-component-example");
    const sizes = exampleBlocks.nth(6);
    const iconOnly = exampleBlocks.nth(8);
    const loading = examples.getByRole("button", { name: "Loading..." });
    const disabled = examples.getByRole("button", { name: "Disabled" });
    const links = exampleBlocks.nth(12).locator("a.phi-link-button");
    const disabledLink = exampleBlocks.nth(12).getByRole("button", { name: "Restricted link" });

    await expect(sizes.locator(".phi-button--xs")).toHaveText("Extra Small");
    await expect(sizes.locator(".phi-button--sm")).toHaveText("Small");
    await expect(sizes.locator(".phi-button--base")).toHaveText("Base");
    await expect(sizes.locator(".phi-button--lg")).toHaveText("Large");
    await expect(iconOnly.getByRole("button", { name: "Add item" })).toHaveCount(2);
    await expect(iconOnly.locator(".phi-button--square")).toHaveCount(1);
    await expect(iconOnly.locator(".phi-button--circle")).toHaveCount(1);
    await expect(loading).toBeDisabled();
    await expect(loading).toHaveAttribute("aria-busy", "true");
    await expect(loading.locator(".phi-button__spinner")).toBeVisible();
    await expect(disabled).toBeDisabled();
    await expect(disabled).toHaveCSS("user-select", "none");
    await expect(links).toHaveCount(2);
    await expect(links.first()).toHaveCSS("user-select", "text");
    await expect(links.first()).toHaveAttribute("href", "/docs/components/link");
    await expect(links.nth(1)).toContainText("External Docs");
    await expect(links.nth(1)).toHaveAttribute("target", "_blank");
    await expect(links.nth(1)).toHaveAttribute("rel", "noopener noreferrer");
    await expect(disabledLink).toBeDisabled();
    await expect(disabledLink).toHaveAttribute("type", "button");
    await expect(disabledLink).toHaveAttribute("data-phi-component", "LinkButton");
    await expect(disabledLink).toHaveCSS("user-select", "text");
    await expect(disabledLink).not.toHaveAttribute("href");
    await expect(disabledLink).not.toHaveAttribute("target");
    await expect(disabledLink).not.toHaveAttribute("rel");
    await expect(disabledLink).not.toHaveAttribute("download");
  });

  test("shows title tooltips for enabled, disabled, and loading buttons", async ({ page }) => {
    const titleExample = page.locator("#title ~ .docs-component-example").first();
    const enabled = titleExample.getByRole("button", { name: "Create Worker" });
    const iconOnly = titleExample.getByRole("button", { name: "Add item" });
    const explicitlyLabelled = titleExample.getByRole("button", { name: "Create item" });
    const disabled = titleExample.getByRole("button", { name: "Restricted action" });
    const loading = titleExample.getByRole("button", { name: "Creating..." });
    const disabledTrigger = disabled.locator("..");
    const loadingTrigger = loading.locator("..");

    await expect(enabled).not.toHaveAttribute("title");
    await expect(iconOnly).toHaveAttribute("aria-label", "Add item");
    await expect(iconOnly).not.toHaveAttribute("title");
    await expect(explicitlyLabelled).toHaveAttribute("aria-label", "Create item");
    await expect(disabled).toBeDisabled();
    await expect(loading).toBeDisabled();
    await expect(loading).toHaveAttribute("aria-busy", "true");
    await expect(disabledTrigger).toHaveClass(/phi-button-tooltip-trigger/);
    await expect(loadingTrigger).toHaveClass(/phi-button-tooltip-trigger/);
    await expect(disabledTrigger).toHaveAttribute("tabindex", "0");
    await expect(loadingTrigger).toHaveAttribute("tabindex", "0");
    await expect(disabledTrigger).not.toHaveAttribute("disabled");
    await expect(loadingTrigger).not.toHaveAttribute("disabled");

    const disabledBox = await disabled.boundingBox();
    const disabledTriggerBox = await disabledTrigger.boundingBox();
    expect(disabledBox).not.toBeNull();
    expect(disabledTriggerBox).not.toBeNull();
    expect(disabledTriggerBox!.width).toBeCloseTo(disabledBox!.width, 1);
    expect(disabledTriggerBox!.height).toBeCloseTo(disabledBox!.height, 1);

    await expectTitleTooltip(page, enabled, "Create a new Worker");
    await expectTitleTooltip(page, iconOnly, "Add item");
    await expectTitleTooltip(page, explicitlyLabelled, "Add item");
    await disabledTrigger.focus();
    await expect(disabledTrigger).toBeFocused();
    await expect(disabledTrigger).toHaveAttribute("aria-describedby", /^tooltip:/, { timeout: 5000 });
    const disabledTooltipId = await disabledTrigger.getAttribute("aria-describedby");
    await expect(page.locator(`[id="${disabledTooltipId}"]`)).toContainText(
      "You need edit access to create a Worker",
    );
    await disabledTrigger.evaluate((element) => element.blur());
    await expectTitleTooltip(page, loadingTrigger, "Worker creation is in progress");
  });

  test("shows title tooltips for enabled and disabled link buttons", async ({ page }) => {
    const linkExample = page.locator("#link-as-button ~ .docs-component-example").first();
    const enabled = linkExample.getByRole("link", { name: "Read Link docs" });
    const disabled = linkExample.getByRole("button", { name: "Restricted link" });
    const disabledTrigger = disabled.locator("..");

    await expect(enabled).not.toHaveAttribute("title");
    await expect(disabled).not.toHaveAttribute("title");
    await expect(disabled).toBeDisabled();
    await expect(disabledTrigger).toHaveClass(/phi-button-tooltip-trigger/);
    await expect(disabledTrigger).toHaveAttribute("tabindex", "0");

    await expectTitleTooltip(page, enabled, "Read the Link component documentation");
    await disabledTrigger.focus();
    await expect(disabledTrigger).toHaveAttribute("aria-describedby", /^tooltip:/, { timeout: 5000 });
    const tooltipId = await disabledTrigger.getAttribute("aria-describedby");
    await expect(page.locator(`[id="${tooltipId}"]`)).toContainText(
      "You need access to open this destination",
    );
  });
});
