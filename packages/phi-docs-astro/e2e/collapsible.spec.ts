import { expect, test } from "@playwright/test";

test.describe("Collapsible", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/collapsible");
  });

  test("renders preview with code", async ({ page }) => {
    const preview = page.locator("#preview");
    const trigger = preview.getByRole("button", { name: "What is Phi?" });
    const snippet = preview.locator(".docs-code-block pre");

    await expect(preview.locator(".phi-collapsible")).toHaveCount(1);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(trigger).toHaveCSS("font-size", "16px");
    await expect(trigger.locator(".phi-collapsible-default-trigger__icon-frame")).toHaveCSS("width", "16px");
    await expect(trigger.locator(".phi-collapsible-default-trigger__icon")).toHaveCSS("width", "12px");
    const panel = preview.locator(".phi-collapsible-default-panel");
    await expect(panel).toHaveCSS("overflow-y", "hidden");
    await expect(panel).toHaveCSS("animation-duration", "0.1s");
    await expect(panel.locator(".phi-collapsible-default-panel__content")).toContainText("Phi is a Vue component library.");
    await expect(snippet).toContainText('from "@dicehub/phi/components/collapsible"');
    await expect(snippet).toContainText("v-model:open");
    await expect(snippet).toContainText("Collapsible.DefaultTrigger");
    await expect(snippet).toContainText("Collapsible.DefaultPanel");
    await expect(page.locator("main")).not.toContainText("Cloudflare");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    const toc = page.locator(".docs-page-toc");

    await expect(toc.locator("a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "With Default Styling",
      "Custom Trigger",
      "Examples",
      "Basic",
      "Multiple Items",
      "Custom Trigger",
      "Keep Mounted",
      "Accordion Pattern",
      "Sub-components",
      "API Reference",
      "Collapsible.Root",
      "Collapsible.Trigger",
      "Collapsible.Panel",
      "Collapsible.DefaultTrigger",
      "Collapsible.DefaultPanel",
    ]);
    await expect(toc.locator("a[href='#preview']")).toHaveCount(0);
    await expect(toc.locator("a[href='#installation'] + ul a")).toHaveCount(2);
    await expect(toc.locator("a[href='#usage'] + ul a")).toHaveCount(2);
    await expect(toc.locator("a[href='#examples'] + ul a")).toHaveCount(5);
    await expect(toc.locator("a[href='#api-reference'] + ul a")).toHaveCount(5);
  });

  test("renders every example with a corresponding snippet", async ({ page }) => {
    const examples = page.locator("#examples");

    await expect(examples.getByRole("heading", { name: "Basic" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Multiple Items" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Custom Trigger" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Keep Mounted" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Accordion Pattern" })).toBeVisible();
    await expect(examples.locator(".docs-component-example")).toHaveCount(5);
    await expect(examples.locator(".docs-code-block")).toHaveCount(5);
    await expect(examples.locator(".docs-code-block").filter({ hasText: "v-model:open" })).toHaveCount(4);
    await expect(examples.locator(".docs-code-block").filter({ hasText: "v-for" })).toHaveCount(1);
  });

  test("supports basic, multiple, custom trigger, keep mounted, and accordion interactions", async ({ page }) => {
    const examples = page.locator("#examples");
    const blocks = examples.locator(".docs-component-example");
    const basic = blocks.nth(0);
    const multiple = blocks.nth(1);
    const custom = blocks.nth(2);
    const keepMounted = blocks.nth(3);
    const accordion = blocks.nth(4);

    await expect(basic.locator(".phi-collapsible-default-panel")).toBeHidden();
    await basic.getByRole("button", { name: "What is Phi?" }).click();
    await expect(basic.locator(".phi-collapsible-default-panel")).toBeVisible();

    await multiple.getByRole("button", { name: "What is Phi?" }).click();
    await multiple.getByRole("button", { name: "How do I use it?" }).click();
    await expect(multiple.locator(".phi-collapsible-default-panel").filter({ hasText: "Phi is a Vue component library." })).toBeVisible();
    await expect(multiple.locator(".phi-collapsible-default-panel").filter({ hasText: "Install the components" })).toBeVisible();

    await expect(custom.getByRole("button", { name: "Show details" })).toBeVisible();
    await custom.getByRole("button", { name: "Show details" }).click();
    await expect(custom.getByRole("button", { name: "Hide details" })).toBeVisible();
    await expect(custom.locator(".collapsible-demo__custom-panel")).toBeVisible();

    const input = keepMounted.getByPlaceholder("Type here...");
    const keepMountedPanel = keepMounted.locator(".phi-collapsible-default-panel");
    await expect(keepMountedPanel).toHaveCSS("overflow-y", "hidden");
    await expect(input).toHaveCSS("line-height", "20px");
    await expect(async () => {
      const bottomRoom = await keepMounted.evaluate((node) => {
        const content = node.querySelector(".phi-collapsible-default-panel__content");
        const input = node.querySelector("input");

        if (!(content instanceof HTMLElement) || !(input instanceof HTMLElement)) {
          return 0;
        }

        return content.getBoundingClientRect().bottom - input.getBoundingClientRect().bottom;
      });

      expect(bottomRoom).toBeGreaterThanOrEqual(4);
    }).toPass();
    await input.fill("Ros");
    await keepMounted.getByRole("button", { name: "Edit details" }).click();
    await expect(input).toBeHidden();
    await keepMounted.getByRole("button", { name: "Edit details" }).click();
    await expect(input).toHaveValue("Ros");

    await expect(accordion.locator(".phi-collapsible-default-panel").filter({ hasText: "built on accessible primitives" })).toBeVisible();
    await accordion.getByRole("button", { name: "How do I install it?" }).click();
    await expect(accordion.locator(".phi-collapsible-default-panel").filter({ hasText: "built on accessible primitives" })).toBeHidden();
    await expect(accordion.locator(".phi-collapsible-default-panel").filter({ hasText: "Install the package" })).toBeVisible();
  });

  test("uses dark mode panel colors", async ({ page }) => {
    await page.evaluate(() => document.documentElement.setAttribute("data-mode", "dark"));

    await expect(page.locator("#preview .phi-collapsible-default-panel__content")).toHaveCSS("border-left-color", "oklch(0.32 0 0)");
  });
});
