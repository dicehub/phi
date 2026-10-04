import { expect, type Locator, type Page, test } from "@playwright/test";

const openContent = (page: Page) => page.locator('.phi-autocomplete-content[data-state="open"]');
const openItems = (page: Page) => page.locator('.phi-autocomplete-content[data-state="open"] .phi-autocomplete-item');

async function expectPopupClosed(page: Page) {
  await expect(openContent(page)).toHaveCount(0);

  const closedContent = page.locator('.phi-autocomplete-content[data-state="closed"]');
  const count = await closedContent.count();

  for (let index = 0; index < count; index += 1) {
    const content = closedContent.nth(index);
    const box = await content.boundingBox();

    if (!box || box.width <= 1 || box.height <= 1) {
      continue;
    }

    await expect(content).toHaveCSS("opacity", "0");
    await expect(content).toHaveCSS("pointer-events", "none");
  }
}

async function selectSuggestion(page: Page, input: Locator, query: string, label: string) {
  await input.scrollIntoViewIfNeeded();
  await input.click();
  await input.fill(query);

  const item = openItems(page).filter({ hasText: label }).first();
  await expect(item).toBeVisible();
  await item.click();

  await expect(input).toHaveValue(label);
  await expectPopupClosed(page);
}

test.describe("Autocomplete", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/autocomplete");
  });

  test("selects a suggestion and hides the dropdown after click", async ({ page }) => {
    await selectSuggestion(page, page.getByPlaceholder("Search fruits...").first(), "blue", "Blueberry");
  });

  test("does not show the full list when the query is cleared", async ({ page }) => {
    const input = page.getByPlaceholder("Search fruits...").first();

    await input.click();
    await input.fill("ap");
    await expect(page.getByRole("option", { name: "Apple", exact: true })).toBeVisible();

    await input.fill("");

    await expect(openItems(page)).toHaveCount(0);
  });

  test("keeps controlled input in sync and clears without reopening the full list", async ({ page }) => {
    const input = page.getByPlaceholder("Type a fruit...").first();

    await selectSuggestion(page, input, "pear", "Pear");
    await expect(page.getByText("Input: Pear")).toBeVisible();

    await page.getByRole("button", { name: "Clear input" }).click();

    await expect(input).toHaveValue("");
    await expect(page.getByText("Input: empty")).toBeVisible();
    await expect(openItems(page)).toHaveCount(0);
  });

  test("selects grouped suggestions", async ({ page }) => {
    await selectSuggestion(
      page,
      page.getByPlaceholder("Select region...").first(),
      "frank",
      "EU Central (Frankfurt)",
    );
  });

  test("supports keyboard selection", async ({ page }) => {
    const input = page.getByPlaceholder("Search fruits...").first();

    await input.click();
    await input.fill("blue");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(input).toHaveValue("Blueberry");
    await expectPopupClosed(page);
  });

  test("does not render default check icons or caret triggers", async ({ page }) => {
    await page.getByPlaceholder("Search fruits...").first().fill("blue");

    await expect(openItems(page).filter({ hasText: "Blueberry" })).toBeVisible();
    await expect(page.locator(".autocomplete-demo .phi-autocomplete-check")).toHaveCount(0);
    await expect(page.locator(".autocomplete-demo .phi-autocomplete-trigger")).toHaveCount(0);
  });
});
