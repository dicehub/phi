import { expect, type Locator, type Page, test } from "@playwright/test";

const openContent = (page: Page) => page.locator('.phi-combobox-content[data-state="open"]');
const openItems = (page: Page) => page.locator('.phi-combobox-content[data-state="open"] .phi-combobox-item');
const exampleById = (page: Page, id: string) => page.locator(`#${id} + .docs-component-example`);
const POPUP_WIDTH_TOLERANCE = 2;

async function expectPopupClosed(page: Page) {
  await expect(openContent(page)).toHaveCount(0);
}

async function replaceWithTyping(input: Locator, value: string) {
  await input.click();
  await input.selectText();
  await input.pressSequentially(value);
}

async function selectOption(page: Page, input: Locator, query: string, label: string) {
  await input.scrollIntoViewIfNeeded();
  await replaceWithTyping(input, query);

  const item = openItems(page).filter({ hasText: label }).first();
  await expect(item).toBeVisible();
  await item.click();

  await expect(input).toHaveValue(label);
  await expectPopupClosed(page);
}

async function selectFromValueTrigger(page: Page, trigger: Locator, query: string, label: string, placeholder = "Search") {
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();

  const search = openContent(page).getByPlaceholder(placeholder).first();
  await expect(search).toBeVisible();
  await replaceWithTyping(search, query);
  await expect(openItems(page).filter({ hasText: label })).toBeVisible();
  await openItems(page).filter({ hasText: label }).click();

  await expect(trigger).toContainText(label);
  await expectPopupClosed(page);
}

async function expectHorizontallyCentered(block: Locator, subject: Locator) {
  const previewBox = await block.locator(".docs-component-preview").boundingBox();
  const subjectBox = await subject.boundingBox();

  expect(previewBox).not.toBeNull();
  expect(subjectBox).not.toBeNull();
  expect(Math.abs((subjectBox!.x + subjectBox!.width / 2) - (previewBox!.x + previewBox!.width / 2))).toBeLessThanOrEqual(1);
}

async function expectPopupWidthToMatchTrigger(page: Page, trigger: Locator) {
  const triggerBox = await trigger.boundingBox();
  const popupBox = await openContent(page).first().boundingBox();

  expect(triggerBox).not.toBeNull();
  expect(popupBox).not.toBeNull();
  expect(popupBox!.width).toBeGreaterThanOrEqual(triggerBox!.width - POPUP_WIDTH_TOLERANCE);
  expect(popupBox!.width).toBeLessThanOrEqual(triggerBox!.width + POPUP_WIDTH_TOLERANCE);
}

test.describe("Combobox", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/combobox");
  });

  test("renders preview with code", async ({ page }) => {
    const preview = page.locator("#preview");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(preview.locator(".phi-combobox")).toHaveCount(1);
    await expect(preview.getByPlaceholder("Please select")).toHaveValue("Apple");
    const controlBox = await preview.locator(".phi-combobox-control").boundingBox();
    expect(controlBox).not.toBeNull();
    expect(controlBox!.width).toBeGreaterThanOrEqual(318);
    await expect(snippet).toContainText('from "@dicehub/phi/components/combobox"');
    await expect(snippet).toContainText("createComboboxCollection");
    await expect(snippet).toContainText("Combobox.TriggerInput");
    await expect(snippet).toContainText("Combobox.Item");
    await expect(page.locator("main")).not.toContainText("Cloudflare");
  });

  test("draws the Select double chevron in standard triggers", async ({ page }) => {
    const preview = page.locator("#preview");
    await expect(preview.locator(".phi-combobox-caret-icon")).toHaveCount(1);
    await expect(preview.locator(".phi-combobox-caret-icon")).toHaveAttribute("aria-hidden", "true");

    const caret = await preview.locator(".phi-combobox-caret-icon").evaluate((node) => {
      const up = getComputedStyle(node, "::before");
      const down = getComputedStyle(node, "::after");
      const own = getComputedStyle(node);

      return {
        ownHeight: own.height,
        ownWidth: own.width,
        ownPosition: own.position,
        upContent: up.content,
        upTransform: up.transform,
        downContent: down.content,
        downTransform: down.transform,
        borderBottomWidth: up.borderBottomWidth,
        borderLeftWidth: up.borderLeftWidth,
        borderRightWidth: up.borderRightWidth,
        borderTopWidth: up.borderTopWidth,
      };
    });

    expect(caret.ownPosition).toBe("relative");
    expect(caret.ownWidth).toBe(caret.ownHeight);
    expect(caret.upContent).toBe('""');
    expect(caret.downContent).toBe('""');
    // Chevron strokes draw the top and right borders only.
    expect(Number.parseFloat(caret.borderTopWidth)).toBeGreaterThan(0);
    expect(Number.parseFloat(caret.borderRightWidth)).toBeGreaterThan(0);
    expect(caret.borderLeftWidth).toBe("0px");
    expect(caret.borderBottomWidth).toBe("0px");

    // Up stroke rotates -45deg, down stroke rotates 135deg: opposite orientations.
    const rotation = (transform: string) => {
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      if (!matrix) return Number.NaN;

      const [a, b] = matrix[1].split(",").map(Number);
      return Math.round((Math.atan2(b, a) * 180) / Math.PI);
    };
    expect(rotation(caret.upTransform)).toBe(-45);
    expect(rotation(caret.downTransform)).toBe(135);
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    const toc = page.locator(".docs-page-toc");

    await expect(toc.locator("a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Sizes",
      "Searchable Item Inside",
      "Searchable Select with Placeholder",
      "Custom Trigger",
      "Grouped",
      "Multiple",
      "With Field",
      "Disabled",
      "Disabled Items",
      "Error State",
      "Positioning and Dropdown Size",
      "Sub-components",
      "API Reference",
      "Combobox.Root",
      "Combobox.Item",
      "Combobox.TriggerInput",
      "Combobox.TriggerValue",
      "Combobox.Content",
    ]);
    await expect(toc.locator("a[href='#preview']")).toHaveCount(0);
    await expect(toc.locator("a[href='#installation'] + ul a")).toHaveCount(2);
    await expect(toc.locator("a[href='#examples'] + ul a")).toHaveCount(10);
    await expect(toc.locator("a[href='#api-reference'] + ul a")).toHaveCount(5);
  });

  test("renders every example with a corresponding snippet", async ({ page }) => {
    const examples = page.locator("#examples");

    await expect(page.locator(".docs-component-example")).toHaveCount(14);
    await expect(examples.locator(".docs-component-example")).toHaveCount(11);
    await expect(examples.locator(".docs-code-block")).toHaveCount(11);
    await expect(examples.locator(".docs-code-block").filter({ hasText: "Combobox.TriggerInput" })).toHaveCount(6);
    await expect(examples.locator(".docs-code-block").filter({ hasText: "Combobox.TriggerValue" })).toHaveCount(4);
    await expect(examples.locator(".docs-code-block").filter({ hasText: "Combobox.TriggerMultipleWithInput" })).toHaveCount(1);
    await expect(exampleById(page, "custom-trigger").locator(".docs-code-block")).toContainText("Combobox.Trigger");
    await expect(exampleById(page, "custom-trigger").locator(".docs-code-block")).toContainText("Combobox.Value");
    const positioningSnippet = page.locator("#customizing-dropdown-height .docs-code-block");

    await expect(positioningSnippet).toContainText("max-h-48");
    await expect(positioningSnippet).toContainText('strategy="fixed"');
    await expect(positioningSnippet).toContainText(':flip="false"');
  });

  test("documents all Combobox sub-components and API groups", async ({ page }) => {
    await expect(page.locator("#sub-components tbody code")).toHaveText([
      "Combobox.Root",
      "Combobox.TriggerInput",
      "Combobox.TriggerValue",
      "Combobox.TriggerMultipleWithInput",
      "Combobox.Content",
      "Combobox.Input",
      "Combobox.List",
      "Combobox.Item",
      "Combobox.Group",
      "Combobox.GroupLabel",
      "Combobox.Chip",
      "Combobox.Empty",
    ]);
    await expect(page.locator("#combobox-root-api + .docs-api-table tbody tr")).toHaveCount(12);
    await expect(page.locator("#combobox-item-api + .docs-api-table tbody tr")).toHaveCount(2);
    await expect(page.locator("#combobox-trigger-input-api + .docs-api-table tbody tr")).toHaveCount(2);
    await expect(page.locator("#combobox-trigger-value-api + .docs-api-table tbody tr")).toHaveCount(2);
    const contentApi = page.locator("#combobox-content-api + .docs-api-table");

    await expect(contentApi.locator("tbody tr")).toHaveCount(23);
    await expect(contentApi.locator("tbody tr td:first-child code")).toHaveText([
      "class",
      "arrowPadding",
      "boundary",
      "fitViewport",
      "flip",
      "getAnchorElement",
      "getAnchorRect",
      "gutter",
      "hideWhenDetached",
      "listeners",
      "offset",
      "onComplete",
      "onPositioned",
      "overflowPadding",
      "overlap",
      "placement",
      "restoreStyles",
      "sameWidth",
      "shift",
      "sizeMiddleware",
      "slide",
      "strategy",
      "updatePosition",
    ]);
  });

  test("selects an item, updates the input, and closes the dropdown", async ({ page }) => {
    await selectOption(page, page.locator("#preview").getByPlaceholder("Please select"), "ban", "Banana");
  });

  test("filters and selects from the searchable value trigger", async ({ page }) => {
    const block = exampleById(page, "searchable-item-inside");
    const trigger = block.locator(".phi-combobox-value-trigger");

    await expect(trigger).toContainText("English");
    await trigger.click();
    const search = openContent(page).getByRole("searchbox");
    await expect(search).toBeVisible();
    await expect.poll(async () => {
      const input = await search.boundingBox();
      const popup = await openContent(page).boundingBox();
      if (!input || !popup) return null;
      return [input.x - popup.x, input.y - popup.y, input.width - popup.width].map(Math.round);
    }).toEqual([0, 0, 0]);
    await expect(search).toHaveCSS("border-bottom-left-radius", "0px");
    await expect(search).toHaveCSS("border-bottom-right-radius", "0px");
    await trigger.click();
    await selectFromValueTrigger(page, trigger, "germ", "German", "Search languages");
  });

  test("supports TriggerInput sizes", async ({ page }) => {
    const triggerInputSizes = exampleById(page, "trigger-input-sizes");

    await expect(triggerInputSizes.locator(".phi-combobox-control").nth(0)).toHaveClass(/phi-combobox-control--sm/);
    await expect(triggerInputSizes.locator(".phi-combobox-control").nth(1)).toHaveClass(/phi-combobox-control--base/);
    await selectOption(page, triggerInputSizes.getByPlaceholder("Small"), "blue", "Blueberry");
    await selectOption(page, triggerInputSizes.getByPlaceholder("Base"), "mango", "Mango");
  });

  test("supports TriggerValue sizes with dropdown search input", async ({ page }) => {
    const triggerValueSizes = exampleById(page, "trigger-value-sizes");

    await expect(triggerValueSizes.locator(".phi-combobox-value-trigger").nth(0)).toHaveClass(/phi-combobox-value-trigger--sm/);
    await expect(triggerValueSizes.locator(".phi-combobox-value-trigger").nth(1)).toHaveClass(/phi-combobox-value-trigger--base/);
    await selectFromValueTrigger(page, triggerValueSizes.locator(".phi-combobox-value-trigger").nth(0), "fren", "French");
    await selectFromValueTrigger(page, triggerValueSizes.locator(".phi-combobox-value-trigger").nth(1), "germ", "German");
  });

  test("supports TriggerValue placeholder state", async ({ page }) => {
    const placeholder = exampleById(page, "searchable-select-placeholder");

    await expect(placeholder.locator(".phi-combobox-value-trigger__label")).toHaveAttribute("data-placeholder", "");
    await expect(placeholder.locator(".phi-combobox-value-trigger")).toContainText("Select a language");
    await selectFromValueTrigger(page, placeholder.locator(".phi-combobox-value-trigger"), "span", "Spanish", "Search languages");
  });

  test("supports custom Trigger and Value composition", async ({ page }) => {
    const custom = exampleById(page, "custom-trigger");
    const customTrigger = custom.locator(".combobox-demo__button-trigger");
    const customValueBox = await custom.locator(".combobox-demo__custom-value").boundingBox();
    const customIconBox = await custom.locator(".combobox-demo__trigger-icon").boundingBox();

    expect(customValueBox).not.toBeNull();
    expect(customIconBox).not.toBeNull();
    expect(customIconBox!.x - (customValueBox!.x + customValueBox!.width)).toBeGreaterThanOrEqual(4);
    await customTrigger.click();
    await expectPopupWidthToMatchTrigger(page, customTrigger);
    await openItems(page).filter({ hasText: "French" }).click();
    await expect(customTrigger).toContainText("French");
    await expectHorizontallyCentered(custom, customTrigger);
  });

  test("supports grouped List, Group, GroupLabel, and Item filtering", async ({ page }) => {
    const grouped = exampleById(page, "grouped");
    const input = grouped.getByPlaceholder("Select server");

    await input.click();
    await expect(openContent(page).locator(".phi-combobox-group-label")).toHaveText(["Asia", "Europe", "North America"]);
    await replaceWithTyping(input, "tok");
    await expect(openContent(page).locator(".phi-combobox-group-label")).toHaveText(["Asia"]);
    await openItems(page).filter({ hasText: "Tokyo" }).click();
    await expect(input).toHaveValue("Tokyo");
    await expectPopupClosed(page);
    await expectHorizontallyCentered(grouped, grouped.locator(".phi-combobox"));
  });

  test("supports Empty state when filtering has no results", async ({ page }) => {
    const input = page.locator("#usage").getByPlaceholder("Select a fruit");

    await replaceWithTyping(input, "zzzz");
    await expect(openItems(page)).toHaveCount(0);
    await expect(openContent(page).locator(".phi-combobox-empty")).toHaveText("No results found.");
  });

  test("supports Content positioning and custom dropdown height", async ({ page }) => {
    const height = page.locator("#customizing-dropdown-height .docs-component-example");

    await height.getByPlaceholder("Select a fruit").click();
    await expect(height.locator(".phi-combobox-positioner")).toHaveCSS("position", "fixed");
    const contentHeight = await openContent(page).first().evaluate((element) => Math.round(element.getBoundingClientRect().height));
    expect(contentHeight).toBeLessThanOrEqual(200);
  });

  test("shows only the selected check indicator", async ({ page }) => {
    const input = page.locator("#preview").getByPlaceholder("Please select");

    await input.click();
    await expect(openItems(page)).toHaveCount(37);
    await expectPopupWidthToMatchTrigger(page, page.locator("#preview .phi-combobox-control"));
    const contentBox = await openContent(page).first().boundingBox();
    expect(contentBox).not.toBeNull();
    expect(contentBox!.height).toBeGreaterThan(300);

    const visibleIndicators = await openContent(page).locator(".phi-combobox-item-indicator").evaluateAll((nodes) =>
      nodes.filter((node) => {
        const style = window.getComputedStyle(node);
        const rect = node.getBoundingClientRect();

        return style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      }).length,
    );

    expect(visibleIndicators).toBe(1);
  });

  test("keeps the dropdown above following preview boxes", async ({ page }) => {
    const input = page.locator("#usage").getByPlaceholder("Select a fruit");

    await input.click();
    await expect(openContent(page).first()).toBeVisible();
    await replaceWithTyping(input, "a");
    await expect(openContent(page).first()).toBeVisible();

    await expect(openContent(page)).toHaveCSS("z-index", "1000");
    await expect(page.locator("#usage .docs-component-example")).toHaveCSS("overflow", "visible");
  });

  test("supports multiple chips and chip removal", async ({ page }) => {
    const multiple = exampleById(page, "multiple");

    await expect(multiple.locator(".phi-combobox-chip")).toHaveCount(0);
    await multiple.locator(".phi-combobox-multi-input").fill("duck");
    await openItems(page).filter({ hasText: "DuckDuckBot" }).click();

    await expect(multiple.locator(".phi-combobox-chip").filter({ hasText: "DuckDuckBot" })).toBeVisible();
    await expect(multiple.locator(".phi-combobox-chip__remove")).toHaveAccessibleName("Remove DuckDuckBot");
    await expect(multiple.locator(".phi-combobox-multi-input")).toHaveAttribute("placeholder", "Select bots");
    await multiple.getByRole("button", { name: "Remove DuckDuckBot" }).click();
    await expect(multiple.locator(".phi-combobox-chip").filter({ hasText: "DuckDuckBot" })).toHaveCount(0);
    await expectHorizontallyCentered(multiple, multiple.locator(".combobox-demo__multiple"));
  });

  test("keeps disabled Root variants non-interactive", async ({ page }) => {
    const disabled = exampleById(page, "disabled");
    const inputCombobox = disabled.locator(".phi-combobox").nth(0);
    const valueCombobox = disabled.locator(".phi-combobox").nth(1);

    await expect(inputCombobox.locator(".phi-combobox-input")).toBeDisabled();
    await expect(inputCombobox.locator(".phi-combobox-control")).toHaveAttribute("data-disabled", "");
    await expect(valueCombobox.locator(".phi-combobox-value-trigger")).toBeDisabled();
    await expect(valueCombobox.locator(".phi-combobox-value-trigger")).toHaveAttribute("data-disabled", "");

    await inputCombobox.locator(".phi-combobox-icon-button").last().click({ force: true });
    await expectPopupClosed(page);
    await valueCombobox.locator(".phi-combobox-value-trigger").click({ force: true });
    await expectPopupClosed(page);
  });

  test("does not select disabled items", async ({ page }) => {
    const input = exampleById(page, "disabled-items").getByPlaceholder("Select database");

    await input.click();
    await expect(openContent(page).first()).toBeVisible();
    await replaceWithTyping(input, "maria");
    await expect(openContent(page).first()).toBeVisible();
    await expect(openItems(page).filter({ hasText: "MariaDB" })).toHaveAttribute("data-disabled");
    await openItems(page).filter({ hasText: "MariaDB" }).click({ force: true });

    await expect(input).not.toHaveValue("MariaDB");

    await replaceWithTyping(input, "redis");
    await openItems(page).filter({ hasText: "Redis" }).click();
    await expect(input).toHaveValue("Redis");
    await expectPopupClosed(page);
  });

  test("uses field and error states", async ({ page }) => {
    const field = exampleById(page, "with-field");
    const error = exampleById(page, "error-state");

    await expect(field.locator(".phi-combobox-label")).toHaveText("Database");
    await expect(field.locator(".phi-combobox-description")).toHaveText("Select your preferred database");
    await expect(field.locator(".phi-combobox")).toHaveCSS("row-gap", "8px");
    await expect(field.locator(".phi-combobox-label")).toHaveCSS("font-size", "14px");
    await expect(field.locator(".phi-combobox-label")).toHaveCSS("font-weight", "500");
    await expect(field.locator(".phi-combobox-description")).toHaveCSS("font-size", "13px");
    await expect(field.locator(".phi-combobox-description")).toHaveCSS("margin-top", "0px");
    await expect(error.locator(".phi-combobox-error")).toHaveText("Please select a database.");
    await expect(error.locator(".phi-combobox-error")).toHaveCSS("font-size", "13px");
    await expect(error.locator(".phi-combobox-control")).toHaveAttribute("data-invalid", "");

    await selectOption(page, field.getByPlaceholder("Select database"), "redis", "Redis");
    await selectOption(page, error.getByPlaceholder("Select database"), "mysql", "MySQL");
  });

  test("uses dark mode control colors", async ({ page }) => {
    await page.evaluate(() => document.documentElement.setAttribute("data-mode", "dark"));

    await expect(page.locator("#preview .phi-combobox-control")).toHaveCSS("background-color", "oklch(0.205 0 0)");
  });
});
