import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/input");
  });

  test("renders expected page sections and snippets", async ({ page }) => {
    await expect(page.locator("main h1").first()).toHaveText("Input");
    await expect(page.locator(".docs-component-example")).toHaveCount(17);
    await expect(page.locator(".docs-code-block")).toHaveCount(19);
    await expect(page.locator("#preview .docs-code-block")).toContainText('from "@dicehub/phi/components/input"');
    await expect(page.locator("#preview .docs-code-block")).toContainText('label="Email"');
    await expect(page.locator(".docs-page-header__primitive-link")).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/field",
    );
    await expect(page.locator(".docs-code-block").filter({ hasText: "React" })).toHaveCount(0);
    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(4);
    await expect(page.locator("#props + .docs-api-table tbody tr")).toHaveCount(15);
    await expect(page.locator("#validation-error-types + p + .docs-api-table tbody tr")).toHaveCount(12);
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "With Built-in Field (Recommended)",
      "Bare Input (Custom Layouts)",
      "Examples",
      "With Label and Description",
      "With Error (String)",
      "With Error (Validation Object)",
      "Input Sizes",
      "Disabled",
      "Optional Field",
      "With Label Tooltip",
      "Rich Label",
      "Controlled with v-model",
      "Controlled with valueChange",
      "Bare Input (No Label)",
      "Error Without Label",
      "Input Types",
      "Password Manager Overlays",
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

  test("renders field wrapper, description, and bare input states", async ({ page }) => {
    const preview = page.locator("#preview");
    const bare = page.locator("#bare-input-custom-layouts + p + .docs-component-example");

    await expect(preview.locator(".phi-input-field")).toHaveCount(1);
    await expect(preview.getByLabel("Email")).toHaveAttribute("placeholder", "you@example.com");
    await expect(preview.locator(".phi-input-description")).toHaveText("We'll never share your email");
    await expect(preview.locator(".phi-input-description")).toHaveCSS("font-size", "13px");
    await expect(preview.locator(".phi-input-description")).toHaveCSS("line-height", "17.875px");
    await expect(preview.getByLabel("Email")).toHaveAttribute("aria-describedby", /description/);

    await expect(bare.locator(".phi-input-field")).toHaveCount(0);
    await expect(bare.getByLabel("Search products")).toHaveAttribute("placeholder", "Search...");
  });

  test("applies expected sizes and error rings", async ({ page }) => {
    const sizes = exampleById(page, "input-sizes").locator(".phi-input");
    const stringError = exampleById(page, "with-error-string");
    const objectError = exampleById(page, "with-error-validation-object");

    await expect(sizes.nth(0)).toHaveCSS("height", "20px");
    await expect(sizes.nth(0)).toHaveCSS("padding-left", "6px");
    await expect(sizes.nth(1)).toHaveCSS("height", "26px");
    await expect(sizes.nth(2)).toHaveCSS("height", "36px");
    await expect(sizes.nth(3)).toHaveCSS("height", "40px");

    await expect(stringError.locator(".phi-input")).toHaveClass(/phi-input--error/);
    await expect(stringError.locator(".phi-input")).toHaveAttribute("aria-invalid", "true");
    await expect(stringError.locator(".phi-input-error")).toHaveText("Please enter a valid email address");
    await expect(stringError.locator(".phi-input-error")).toHaveCSS("color", "rgb(220, 38, 38)");
    await expect(objectError.locator(".phi-input-error")).toHaveText("Password must be at least 8 characters");
  });

  test("supports optional, tooltip, rich label, native types, and password manager attrs", async ({ page }) => {
    const tooltipExample = exampleById(page, "with-label-tooltip");
    const tooltip = tooltipExample.locator(".phi-input-label__tooltip");

    await expect(page.locator(".phi-input-label__optional")).toHaveCount(1);
    await expect(exampleById(page, "optional-field").locator(".phi-input-label__optional")).toHaveText("(optional)");
    await expect(tooltip).toHaveAttribute(
      "data-tooltip",
      "Find this in your dashboard under Settings > API Keys",
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
    await expect(exampleById(page, "rich-label").locator(".phi-input-label strong")).toHaveText("billing");
    await expect(exampleById(page, "input-types").locator(".phi-input").first()).toHaveAttribute("type", "email");
    await expect(exampleById(page, "input-types").locator(".phi-input").nth(1)).toHaveAttribute("type", "password");
    await expect(exampleById(page, "input-types").locator(".phi-input").nth(2)).toHaveAttribute("type", "number");
    await expect(exampleById(page, "input-types").locator(".phi-input").nth(3)).toHaveAttribute("type", "tel");

    const ignored = exampleById(page, "password-manager-overlays").locator(".keeper-ignore");
    await expect(ignored).toHaveCount(1);
    await expect(ignored).toHaveAttribute("data-1p-ignore", "true");
    await expect(ignored).toHaveAttribute("data-bwignore", "true");
    await expect(ignored).toHaveAttribute("data-form-type", "other");
    await expect(ignored).toHaveAttribute("data-lpignore", "true");
    await expect(page.locator("#input-types + p")).toContainText("email");
    await expect(page.locator("#input-types + p code")).toHaveText(["email", "password", "number", "tel"]);
    await expect(page.locator("#password-manager-overlays + p code")).toHaveText("passwordManagerIgnore");
  });

  test("supports controlled v-model and valueChange demos", async ({ page }) => {
    const model = exampleById(page, "controlled-with-v-model");
    const valueChange = exampleById(page, "controlled-with-value-change");

    await model.getByLabel("With v-model").fill("alpha");
    await expect(model.locator(".phi-input-description")).toHaveText("Value: alpha");

    await valueChange.getByLabel("With valueChange").fill("beta");
    await expect(valueChange.locator(".phi-input-description")).toHaveText("Value: beta");
  });
});

test("Home Input cards render real Phi inputs", async ({ page }) => {
  await page.goto("/");

  const inputCard = page
    .locator(".home-gallery__item")
    .filter({ has: page.getByRole("link", { name: "Input", exact: true }) });
  const validationCard = page
    .locator(".home-gallery__item")
    .filter({ has: page.getByRole("link", { name: "Input (with validation)" }) });

  await expect(inputCard.locator(".phi-input")).toHaveCount(2);
  await expect(inputCard.locator(".phi-input--error")).toHaveCount(1);
  await expect(validationCard.locator(".phi-input-field")).toHaveCount(1);
  await expect(validationCard.locator(".phi-input-error")).toHaveText("Please enter a valid email.");
});
