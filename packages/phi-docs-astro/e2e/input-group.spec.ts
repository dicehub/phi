import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("InputGroup", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/input-group");
  });

  test("renders expected page sections and snippets", async ({ page }) => {
    await expect(page.locator("main h1").first()).toHaveText("InputGroup");
    await expect(page.locator(".docs-component-example")).toHaveCount(12);
    await expect(page.locator(".docs-code-block")).toHaveCount(14);
    await expect(page.locator("#preview .docs-code-block")).toContainText('from "@dicehub/phi/components/input-group"');
    await expect(page.locator("#preview .docs-code-block")).toContainText("InputGroup.Suffix");
    await expect(page.locator(".docs-page-header__primitive-link")).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/field",
    );
    await expect(page.locator("main")).not.toContainText("Cloudflare");
    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(7);
    await expect(page.locator("#inputgroup + p + .docs-api-table tbody tr")).toHaveCount(9);
    await expect(page.locator("#inputgroupinput + p + .docs-api-table tbody tr")).toHaveCount(6);
    await expect(page.locator("#validation-error-types + p + .docs-api-table tbody tr")).toHaveCount(12);
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "With Built-in Field (Recommended)",
      "Bare InputGroup (Custom Layouts)",
      "Examples",
      "Icon",
      "Text",
      "Button",
      "Button with Tooltip",
      "Kbd",
      "Loading",
      "Inline Suffix",
      "Sizes",
      "States",
      "API Reference",
      "InputGroup",
      "InputGroup.Input",
      "InputGroup.Addon",
      "InputGroup.Button",
      "InputGroup.Suffix",
      "Events",
      "Validation Error Types",
      "Accessibility",
      "Label Requirement",
      "Group Role",
    ]);
    await expect(page.locator(".docs-page-toc a[href='#preview']")).toHaveCount(0);
  });

  test("renders field wrapper, bare group, suffix, and accessibility states", async ({ page }) => {
    const preview = page.locator("#preview");
    const field = exampleById(page, "with-built-in-field-recommended");
    const bare = exampleById(page, "bare-inputgroup-custom-layouts");

    await expect(preview.locator(".phi-input-group")).toHaveAttribute("role", "group");
    await expect(preview.locator(".phi-input-group-input")).toHaveValue("phi");
    await expect(preview.locator(".phi-input-group-suffix")).toHaveText(".example.com");
    await expect(preview.locator(".phi-input-group")).toHaveCSS("height", "36px");
    const previewInput = preview.getByRole("textbox", { name: "Project subdomain" });
    await preview.locator(".phi-input-group").click({ position: { x: 144, y: 18 } });
    await expect(previewInput).toBeFocused();
    await previewInput.fill("phix");
    await expect(preview.getByRole("status", { name: "Loading" })).toHaveCount(1);
    await expect(preview.locator(".input-group-demo__success")).toHaveCount(0);
    await expect(preview.getByRole("status", { name: "Loading" })).toHaveCount(0, { timeout: 2000 });
    await expect(preview.locator(".input-group-demo__success")).toHaveCount(1);

    await expect(field.locator(".phi-input-field")).toHaveCount(1);
    await expect(field.getByRole("textbox", { name: "Search", exact: true })).toHaveAttribute("placeholder", "Search...");
    await expect(field.locator(".phi-input-description")).toHaveText("Find pages, components, and more");
    await expect(field.getByRole("textbox", { name: "Search", exact: true })).toHaveAttribute("aria-describedby", /description/);

    await expect(bare.locator(".phi-input-field")).toHaveCount(0);
    await expect(bare.getByLabel("Search")).toHaveAttribute("placeholder", "Search...");
  });

  test("supports icon, text, button, tooltip, kbd, loading, and suffix examples", async ({ page }) => {
    const button = exampleById(page, "button");
    const tooltip = exampleById(page, "button-with-tooltip").locator(".phi-input-group-button");
    const suffix = exampleById(page, "inline-suffix");

    await expect(exampleById(page, "icon").locator(".phi-input-group-addon svg")).toHaveCount(1);
    await expect(exampleById(page, "text").locator(".phi-input-group")).toHaveCount(3);

    await expect(button.locator('input[aria-label="Password"]')).toHaveAttribute("type", "password");
    await button.getByRole("button", { name: "Show password" }).click();
    await expect(button.locator('input[aria-label="Password"]')).toHaveAttribute("type", "text");
    await expect(button.getByRole("textbox", { name: "Search", exact: true })).toHaveValue("search");
    await button.getByRole("button", { name: "Clear search" }).click();
    await expect(button.getByRole("textbox", { name: "Search", exact: true })).toHaveValue("");
    await expect(button.getByRole("button", { name: "Search" })).toHaveCount(1);

    await expect(tooltip).toHaveAttribute("data-tooltip", "Query language help");
    await tooltip.hover();
    await expect
      .poll(() =>
        tooltip.evaluate((element) => {
          const group = element.closest(".phi-input-group");
          const tooltipStyle = getComputedStyle(element, "::after");
          const caretStyle = getComputedStyle(element, "::before");

          return {
            caretVisibility: caretStyle.visibility,
            groupOverflow: group ? getComputedStyle(group).overflow : undefined,
            tooltipBackground: tooltipStyle.backgroundColor,
            tooltipOpacity: tooltipStyle.opacity,
            tooltipVisibility: tooltipStyle.visibility,
          };
        }),
      )
      .toEqual({
        caretVisibility: "visible",
        groupOverflow: "visible",
        tooltipBackground: "rgb(255, 255, 255)",
        tooltipOpacity: "1",
        tooltipVisibility: "visible",
      });

    await expect(exampleById(page, "kbd").locator("kbd")).toHaveText("⌘K");
    await expect(exampleById(page, "loading").getByRole("status", { name: "Loading" })).toHaveCount(1);
    await expect(suffix.locator(".phi-input-group-suffix")).toHaveText([".example.com", ".example.com"]);
    await expect(suffix.locator(".phi-input-error")).toHaveText("This subdomain is unavailable");
    await expect(suffix.locator(".phi-input-group").nth(1)).toHaveAttribute("data-invalid", "");
    await expect(suffix.locator(".phi-input-group-input").nth(1)).toHaveAttribute("aria-invalid", "true");
    await expect
      .poll(() =>
        suffix.locator(".phi-input-group").evaluateAll((elements) =>
          elements.map((element) => Math.round(element.getBoundingClientRect().width)),
        ),
      )
      .toEqual([288, 288]);
  });

  test("applies expected group heights and shared disabled state", async ({ page }) => {
    const sizes = exampleById(page, "sizes").locator(".phi-input-group");
    const states = exampleById(page, "states");

    await expect(sizes.nth(0)).toHaveCSS("height", "24px");
    await expect(sizes.nth(1)).toHaveCSS("height", "28px");
    await expect(sizes.nth(2)).toHaveCSS("height", "36px");
    await expect(sizes.nth(3)).toHaveCSS("height", "44px");
    await expect(sizes.nth(3).locator(".phi-input-group-addon--start")).toHaveCSS("padding-left", "10px");
    await expect(sizes.nth(3).locator(".phi-input-group-addon--end")).toHaveCSS("padding-right", "2px");
    await expect(sizes.nth(2)).toHaveCSS("border-radius", "8px");
    await expect
      .poll(() =>
        sizes.evaluateAll((elements) =>
          elements.map((element) => Math.round(element.getBoundingClientRect().width)),
        ),
      )
      .toEqual([256, 256, 256, 256]);

    await expect(states.locator(".phi-input-error")).toHaveText("Please enter a valid email address");
    await expect(states.locator(".phi-input-label__optional")).toHaveText("(optional)");
    await expect(states.locator(".phi-input-group[data-disabled]")).toHaveCount(1);
    await expect(states.getByPlaceholder("Search...")).toBeDisabled();
    await expect
      .poll(() =>
        states.locator(".phi-input-group").evaluateAll((elements) =>
          elements.map((element) => Math.round(element.getBoundingClientRect().width)),
        ),
      )
      .toEqual([256, 256, 256, 256]);

    const labelTooltip = states.locator(".phi-input-label__tooltip");
    await expect(labelTooltip).toHaveAttribute("aria-label", "More information");
    await expect(labelTooltip).toHaveAttribute(
      "data-tooltip",
      "Your password is stored securely",
    );
    await expect(labelTooltip).toHaveCSS("cursor", "pointer");
    await labelTooltip.hover();
    await expect
      .poll(() =>
        labelTooltip.evaluate((element) => {
          const tooltipStyle = getComputedStyle(element, "::after");
          const caretStyle = getComputedStyle(element, "::before");

          return {
            caretVisibility: caretStyle.visibility,
            tooltipBackground: tooltipStyle.backgroundColor,
            tooltipOpacity: tooltipStyle.opacity,
            tooltipVisibility: tooltipStyle.visibility,
          };
        }),
      )
      .toEqual({
        caretVisibility: "visible",
        tooltipBackground: "rgb(255, 255, 255)",
        tooltipOpacity: "1",
        tooltipVisibility: "visible",
      });
  });

  test("keeps roots and nested buttons flat across interaction states", async ({ page }) => {
    const buttonExample = exampleById(page, "button");
    const states = exampleById(page, "states");
    const defaultGroup = buttonExample.locator(".phi-input-group").first();
    const invalidGroup = states.locator(".phi-input-group[data-invalid]");
    const addonButton = buttonExample.getByRole("button", { name: "Show password" });
    const trailingButton = buttonExample.getByRole("button", { name: "Search", exact: true });

    const shadows = async () => ({
      addon: await addonButton.evaluate((element) => getComputedStyle(element).boxShadow),
      default: await defaultGroup.evaluate((element) => getComputedStyle(element).boxShadow),
      invalid: await invalidGroup.evaluate((element) => getComputedStyle(element).boxShadow),
      trailing: await trailingButton.evaluate((element) => getComputedStyle(element).boxShadow),
    });

    await expect.poll(shadows).toEqual({
      addon: "none",
      default: "oklch(0.145 0 0 / 0.1) 0px 0px 0px 1px",
      invalid: "rgb(220, 38, 38) 0px 0px 0px 1px",
      trailing: "oklch(0.145 0 0 / 0.1) 1px 0px 0px 0px inset",
    });

    await buttonExample.getByRole("textbox", { name: "Password" }).focus();
    await expect(defaultGroup).toHaveCSS("box-shadow", "rgba(76, 99, 255, 0.5) 0px 0px 0px 1.5px");

    await states.getByRole("textbox", { name: "Error State" }).focus();
    await expect(invalidGroup).toHaveCSS("box-shadow", "rgba(220, 38, 38, 0.5) 0px 0px 0px 1.5px");
  });

  test("keeps field-wrapped input groups full-width", async ({ page }) => {
    const suffix = exampleById(page, "inline-suffix");
    const sizes = exampleById(page, "sizes");
    const states = exampleById(page, "states");

    const widthsBySection = async () => ({
      sizes: await sizes.locator(".phi-input-group").evaluateAll((elements) =>
        elements.map((element) => Math.round(element.getBoundingClientRect().width)),
      ),
      states: await states.locator(".phi-input-group").evaluateAll((elements) =>
        elements.map((element) => Math.round(element.getBoundingClientRect().width)),
      ),
      suffix: await suffix.locator(".phi-input-group").evaluateAll((elements) =>
        elements.map((element) => Math.round(element.getBoundingClientRect().width)),
      ),
    });

    await expect.poll(widthsBySection).toEqual({
      sizes: [256, 256, 256, 256],
      states: [256, 256, 256, 256],
      suffix: [288, 288],
    });
  });
});
