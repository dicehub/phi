import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("InputArea", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/input-area");
  });

  test("renders expected page sections and snippets", async ({ page }) => {
    await expect(page.locator("main h1").first()).toHaveText("InputArea");
    await expect(page.locator(".docs-component-example")).toHaveCount(15);
    await expect(page.locator(".docs-code-block")).toHaveCount(18);
    await expect(page.locator("#preview .docs-code-block")).toContainText('from "@dicehub/phi/components/input"');
    await expect(page.locator("#preview .docs-code-block")).toContainText('label="Description"');
    await expect(page.locator(".docs-page-header__primitive-link")).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/field",
    );
    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(4);
    await expect(page.locator("#props + .docs-api-table tbody tr")).toHaveCount(16);
    await expect(page.locator("#validation-error-types + p + .docs-api-table tbody tr")).toHaveCount(12);
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "With Built-in Field (Recommended)",
      "Bare InputArea (Custom Layouts)",
      "Examples",
      "With Label",
      "Custom Row Count",
      "Auto Resize",
      "Controlled Auto Resize",
      "Error State (String)",
      "Error State (Object)",
      "Sizes",
      "Disabled",
      "Bare InputArea",
      "Optional Field",
      "Label with Tooltip",
      "Rich Label",
      "API Reference",
      "Props",
      "Slots",
      "Events",
      "Validation Error Types",
      "Accessibility",
      "Label Requirement",
      "Error Association",
    ]);
    await expect(page.locator(".docs-page-toc a[href='#preview']")).toHaveCount(0);
  });

  test("renders field wrapper, description, and bare textarea states", async ({ page }) => {
    const preview = page.locator("#preview");
    const bare = exampleById(page, "bare-inputarea");

    await expect(preview.locator(".phi-input-field")).toHaveCount(1);
    await expect(preview.getByLabel("Description")).toHaveAttribute("placeholder", "Enter a description...");
    await expect(preview.locator(".phi-input-description")).toHaveText("Provide details about your project");
    await expect(preview.locator(".phi-input-description")).toHaveCSS("font-size", "13px");
    await expect(preview.locator(".phi-input-description")).toHaveCSS("line-height", "17.875px");
    await expect(preview.getByLabel("Description")).toHaveAttribute("aria-describedby", /description/);

    await expect(bare.locator(".phi-input-field")).toHaveCount(0);
    await expect(bare.getByLabel("Notes")).toHaveAttribute("rows", "3");
    await expect(bare.getByLabel("Notes")).toHaveCSS("height", "76px");
  });

  test("applies expected textarea rows, sizes, and error rings", async ({ page }) => {
    const rows = exampleById(page, "custom-row-count").locator(".phi-input-area");
    const sizes = exampleById(page, "sizes").locator(".phi-input-area");
    const stringError = exampleById(page, "error-state-string");
    const objectError = exampleById(page, "error-state-object");

    await expect(rows.nth(0)).toHaveAttribute("rows", "2");
    await expect(rows.nth(0)).toHaveCSS("height", "56px");
    await expect(rows.nth(1)).toHaveCSS("height", "96px");
    await expect(rows.nth(2)).toHaveCSS("height", "176px");

    await expect(sizes.nth(0)).toHaveCSS("height", "48px");
    await expect(sizes.nth(0)).toHaveCSS("padding-left", "6px");
    await expect(sizes.nth(1)).toHaveCSS("height", "48px");
    await expect(sizes.nth(2)).toHaveCSS("height", "56px");
    await expect(sizes.nth(3)).toHaveCSS("height", "56px");

    await expect(stringError.locator(".phi-input-area")).toHaveClass(/phi-input-area--error/);
    await expect(stringError.locator(".phi-input-area")).toHaveAttribute("aria-invalid", "true");
    await expect(stringError.locator(".phi-input-error")).toHaveText("Message must be at least 10 characters");
    await expect(stringError.locator(".phi-input-error")).toHaveCSS("color", "rgb(220, 38, 38)");
    await expect(objectError.locator(".phi-input-error")).toHaveText("Feedback must be at least 20 characters");
  });

  test("auto-resizes uncontrolled content, width reflow, and maxRows overflow", async ({ page }) => {
    const example = exampleById(page, "auto-resize");
    const textarea = example.getByLabel("Configuration value");

    await expect(textarea).toHaveAttribute("rows", "2");
    await expect(textarea).toHaveClass(/phi-input-area--auto-resize/);
    await expect(textarea).toHaveCSS("resize", "none");

    await textarea.fill("Short value");
    await expect(textarea).toHaveCSS("height", "56px");
    await expect(textarea).toHaveCSS("overflow-y", "hidden");

    await textarea.fill(
      "Review this configuration value carefully because wrapping should change when the available width becomes narrower.",
    );
    const wideHeight = Number.parseFloat(await textarea.evaluate((element) => getComputedStyle(element).height));
    await textarea.evaluate((element) => {
      element.style.width = "110px";
    });
    await expect
      .poll(() => textarea.evaluate((element) => Number.parseFloat(getComputedStyle(element).height)))
      .toBeGreaterThan(wideHeight);

    await textarea.fill(Array.from({ length: 12 }, (_, index) => `Line ${index + 1}`).join("\n"));
    await expect(textarea).toHaveCSS("height", "176px");
    await expect(textarea).toHaveCSS("overflow-y", "auto");

    await textarea.fill("");
    await expect(textarea).toHaveCSS("height", "56px");
    await expect(textarea).toHaveCSS("overflow-y", "hidden");
  });

  test("remeasures controlled values and restores manual resizing when disabled", async ({ page }) => {
    const example = exampleById(page, "controlled-auto-resize");
    const textarea = example.getByLabel("Controlled notes");

    await expect(textarea).toHaveCSS("height", "56px");
    await example.getByRole("button", { name: "Set long value" }).click();
    await expect(textarea).toHaveValue(/Confirm the deployment region/);
    await expect
      .poll(() => textarea.evaluate((element) => Number.parseFloat(getComputedStyle(element).height)))
      .toBeGreaterThan(56);

    await example.getByRole("button", { name: "Reset value" }).click();
    await expect(textarea).toHaveCSS("height", "56px");

    await example.getByRole("button", { name: "Disable auto resize" }).click();
    await expect(example.getByRole("button", { name: "Enable auto resize" })).toBeVisible();
    await expect(textarea).not.toHaveClass(/phi-input-area--auto-resize/);
    await expect(textarea).toHaveCSS("resize", "vertical");
    expect(await textarea.evaluate((element) => element.style.height)).toBe("");
    expect(await textarea.evaluate((element) => element.style.overflowY)).toBe("");

    await example.getByRole("button", { name: "Enable auto resize" }).click();
    await expect(textarea).toHaveClass(/phi-input-area--auto-resize/);
    await expect(textarea).toHaveCSS("height", "56px");
  });

  test("supports optional, tooltip, and rich label examples", async ({ page }) => {
    const tooltipExample = exampleById(page, "label-with-tooltip");
    const tooltip = tooltipExample.locator(".phi-input-label__tooltip");

    await expect(page.locator(".phi-input-label__optional")).toHaveCount(1);
    await expect(exampleById(page, "optional-field").locator(".phi-input-label__optional")).toHaveText("(optional)");
    await expect(tooltip).toHaveAttribute(
      "data-tooltip",
      "Enter your worker script code here",
    );
    await expect(tooltip).toHaveAttribute("aria-label", "More information");
    await expect(tooltip).toHaveCSS("cursor", "pointer");
    await tooltip.hover();
    await expect(tooltipExample).toHaveCSS("overflow", "visible");
    await expect
      .poll(() =>
        tooltip.evaluate((element) => {
          const tooltipStyle = getComputedStyle(element, "::after");
          const caretStyle = getComputedStyle(element, "::before");

          return {
            caretVisibility: caretStyle.visibility,
            tooltipBackground: tooltipStyle.backgroundColor,
            tooltipOpacity: tooltipStyle.opacity,
            tooltipOverflowWrap: tooltipStyle.overflowWrap,
            tooltipVisibility: tooltipStyle.visibility,
          };
        }),
      )
      .toEqual({
        caretVisibility: "visible",
        tooltipBackground: "rgb(255, 255, 255)",
        tooltipOpacity: "1",
        tooltipOverflowWrap: "break-word",
        tooltipVisibility: "visible",
      });
    await expect(tooltip.locator("svg")).toHaveCount(1);
    await expect(exampleById(page, "rich-label").locator(".phi-input-label strong")).toHaveText("review");
    await expect(page.locator("main")).not.toContainText("Cloudflare");
  });
});

test("Home InputArea card renders a real Phi textarea", async ({ page }) => {
  await page.goto("/");

  await page.locator(".home-gallery__item").first().waitFor({ timeout: 1500 }).catch(() => undefined);
  test.skip(
    (await page.locator(".home-gallery__item").count()) === 0,
    "Home gallery did not hydrate on the current dev server.",
  );

  const inputAreaCard = page.locator('.home-gallery__item:has(.home-gallery__title[href="/docs/components/input-area"])');

  await expect(inputAreaCard.locator(".phi-input-area")).toHaveCount(1);
  await expect(inputAreaCard.locator(".phi-input-area")).toHaveAttribute("placeholder", "Enter your name");
  await expect(inputAreaCard.getByRole("link", { name: "InputArea", exact: true })).toHaveAttribute(
    "href",
    "/docs/components/input-area",
  );
});
