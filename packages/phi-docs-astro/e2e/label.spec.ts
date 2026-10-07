import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("Label", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/label");
  });

  test("renders expected page sections and snippets", async ({ page }) => {
    await expect(page.locator("main h1").first()).toHaveText("Label");
    await expect(page.locator(".docs-component-example")).toHaveCount(7);
    await expect(page.locator(".docs-code-block")).toHaveCount(11);
    await expect(page.locator("#preview .docs-code-block")).toContainText('from "@dicehub/phi/components/label"');
    await expect(page.locator("#preview .docs-code-block")).toContainText("show-optional");
    await expect(page.locator(".docs-page-header__primitive-link")).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/field",
    );
    await expect(page.locator("main")).not.toContainText("Cloudflare");
    await expect(page.locator("main")).not.toContainText("React");
    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(2);
    await expect(page.locator("#label-props + p + .docs-api-table tbody tr")).toHaveCount(9);
    await expect(page.locator("#form-component-label-props + p + .docs-api-table tbody tr")).toHaveCount(3);
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "With Form Components (Recommended)",
      "Standalone Label",
      "Examples",
      "Optional Field",
      "With Tooltip",
      "Rich Label Content",
      "Form with Mixed Fields",
      "Standalone Label",
      "Translations",
      "API Reference",
      "Label Props",
      "Form Component Label Props",
      "Design Guidelines",
      "When to Use Optional Indicators",
      "When to Use Tooltips",
      "Accessibility",
    ]);
    await expect(page.locator(".docs-page-toc a[href='#preview']")).toHaveCount(0);
  });

  test("renders standalone labels with optional text and tooltip", async ({ page }) => {
    const preview = page.locator("#preview");
    const tooltip = preview.locator(".phi-label__tooltip");

    await expect(preview.locator(".phi-label")).toHaveCount(3);
    await expect(preview.locator(".phi-label").first()).toHaveText("Default Label");
    await expect(preview.locator(".phi-label").first()).toHaveCSS("font-size", "14px");
    await expect(preview.locator(".phi-label").first()).toHaveCSS("line-height", "20px");
    await expect(preview.locator(".phi-label").first()).toHaveCSS("gap", "4px");
    await expect(preview.locator(".label-demo__stack")).toHaveCSS("gap", "16px");
    await expect(preview.locator(".phi-label__optional")).toHaveText("(optional)");
    await expect(tooltip).toHaveAttribute("aria-label", "More information");
    await expect(tooltip).toHaveAttribute("data-tooltip", "More information about this field");
    await expect(tooltip).toHaveCSS("cursor", "pointer");
    await expect(tooltip.locator("svg")).toHaveCount(1);

    await tooltip.hover();
    await expect
      .poll(() =>
        tooltip.evaluate((element) => {
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

  test("supports form labels, rich content, and mixed form examples", async ({ page }) => {
    const optional = exampleById(page, "optional-field");
    const tooltip = exampleById(page, "with-tooltip");
    const rich = exampleById(page, "rich-label-content");
    const mixed = exampleById(page, "form-with-mixed-fields");
    const standalone = exampleById(page, "standalone-label");

    await expect(optional.getByLabel("Phone Number")).toHaveAttribute("placeholder", "+1 555-0000");
    await expect(optional.locator(".phi-input-field")).toHaveCSS("width", "226px");
    await expect(optional.locator(".phi-input-field")).toHaveCSS("gap", "8px");
    await expect(optional.locator(".phi-input-label__optional")).toHaveText("(optional)");

    await expect(tooltip.getByLabel("API Key")).toHaveAttribute("placeholder", "sk_live_...");
    await expect(tooltip.locator(".phi-input-label__tooltip")).toHaveAttribute(
      "data-tooltip",
      "Find this in your dashboard settings under API > Keys",
    );

    await expect(rich.locator(".phi-checkbox__label strong")).toHaveText("Terms of Service");
    await expect(mixed.locator(".phi-input-field")).toHaveCount(3);
    await expect(mixed.locator(".phi-checkbox")).toHaveCount(0);
    await expect(mixed.getByLabel("Email")).toHaveAttribute("type", "email");
    await expect(mixed.locator(".phi-input-label__optional")).toHaveText("(optional)");
    await expect(mixed.locator(".label-demo__form")).toHaveCSS("width", "226px");
    const countrySelect = mixed.getByRole("combobox", { name: "Country" });
    await expect(countrySelect).toHaveText("Select a country");
    await expect(countrySelect).toHaveCSS("height", "36px");
    await expect(countrySelect).toHaveCSS("gap", "6px");
    await expect(countrySelect).toHaveCSS("padding-left", "12px");
    await expect(countrySelect).toHaveCSS("padding-right", "12px");
    await expect(countrySelect.locator(".label-demo__select-indicator svg")).toBeVisible();
    await expect
      .poll(() =>
        countrySelect
          .locator(".label-demo__select-indicator svg path")
          .first()
          .evaluate((element) => element.getAttribute("d") ?? ""),
      )
      .toContain("M181.66");
    await expect
      .poll(() =>
        countrySelect.evaluate((element) => {
          const form = element.closest(".label-demo__form");
          return form ? element.getBoundingClientRect().width < form.getBoundingClientRect().width : false;
        }),
      )
      .toBe(true);
    await countrySelect.click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect
      .poll(() =>
        page.locator(".label-demo__select-item-indicator").evaluateAll((elements) =>
          elements.filter((element) => {
            const style = getComputedStyle(element);
            return style.display !== "none" && style.visibility !== "hidden";
          }).length,
        ),
      )
      .toBe(0);
    await expect(page.getByRole("option", { name: "United States" })).toBeVisible();
    await page.getByRole("option", { name: "United Kingdom" }).click();
    await expect(countrySelect).toHaveText("United Kingdom");
    await expect(page.locator(".label-demo__select-content")).toBeHidden();
    await countrySelect.click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect
      .poll(() =>
        page.locator(".label-demo__select-item-indicator").evaluateAll((elements) =>
          elements
            .filter((element) => {
              const style = getComputedStyle(element);
              return style.display !== "none" && style.visibility !== "hidden";
            })
            .map((element) => element.closest('[role="option"]')?.textContent?.trim()),
        ),
      )
      .toEqual(["United Kingdom"]);

    await expect(standalone.locator(".phi-label")).toHaveCount(3);
    await expect(standalone.locator(".phi-label__tooltip")).toHaveAttribute("data-tooltip", "Important field");
  });
});
