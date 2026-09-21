import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("Pagination", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/pagination");
  });

  test("renders the preview pagination with code and ARIA labels", async ({ page }) => {
    const preview = page.locator("#preview");
    const pagination = preview.locator(".phi-pagination");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(page.locator("main h1").first()).toHaveText("Pagination");
    await expect(pagination).toHaveCount(1);
    await expect(preview.getByRole("navigation", { name: "Pagination" })).toHaveCount(1);
    await expect(preview.getByRole("button", { name: "First page" })).toBeDisabled();
    await expect(preview.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await expect(preview.getByRole("button", { name: "Next page" })).toBeEnabled();
    await expect(preview.getByRole("button", { name: "Last page" })).toBeEnabled();
    await expect(preview.getByRole("textbox", { name: "Page number" })).toHaveValue("1");
    await expect(preview.locator(".phi-pagination__info")).toContainText("Showing");
    await expect(preview.locator(".phi-pagination__info")).toContainText("1-10");
    await expect(snippet).toContainText('from "@dicehub/phi/components/pagination"');
    await expect(snippet).toContainText(":set-page=\"setPage\"");
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");
  });

  test("changes pages through buttons and clamps typed input", async ({ page }) => {
    const preview = page.locator("#preview");
    const input = preview.getByRole("textbox", { name: "Page number" });

    await preview.getByRole("button", { name: "Next page" }).click();
    await expect(input).toHaveValue("2");
    await expect(preview.locator(".phi-pagination__info")).toContainText("11-20");

    await input.fill("999");
    await input.press("Enter");
    await expect(input).toHaveValue("10");
    await expect(preview.locator(".phi-pagination__info")).toContainText("91-100");
    await expect(preview.getByRole("button", { name: "Next page" })).toBeDisabled();
    await expect(preview.getByRole("button", { name: "Last page" })).toBeDisabled();
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Full Controls (Default)",
      "Simple Controls",
      "Unknown Totals",
      "Mid-Page State",
      "Large Dataset",
      "Custom Text",
      "Compound Components",
      "Page Size Selector",
      "Custom Page Size Options",
      "Custom Info Text",
      "Custom Layout",
      "Dropdown Page Selector",
      "Internationalization",
      "API Reference",
      "Compound API",
    ]);
  });

  test("renders examples, compound components, i18n, and API reference", async ({ page }) => {
    const simple = exampleById(page, "simple-controls");
    const unknownTotal = exampleById(page, "unknown-totals");
    const pageSize = exampleById(page, "page-size-selector");
    const dropdown = exampleById(page, "dropdown-page-selector");
    const i18n = page.locator("#internationalization");

    await expect(page.locator("#examples .docs-component-example")).toHaveCount(6);
    await expect(page.locator("#compound-components .docs-component-example")).toHaveCount(5);
    await expect(simple.getByRole("button", { name: "Previous page" })).toHaveCount(1);
    await expect(simple.getByRole("button", { name: "Next page" })).toHaveCount(1);
    await expect(simple.getByRole("button", { name: "First page" })).toHaveCount(0);
    await expect(simple.getByRole("textbox", { name: "Page number" })).toHaveCount(0);

    await expect(unknownTotal.locator(".phi-pagination__info")).toContainText("Page 1");
    await expect(unknownTotal.getByRole("button", { name: "First page" })).toHaveCount(0);
    await expect(unknownTotal.getByRole("textbox", { name: "Page number" })).toHaveCount(0);
    await expect(unknownTotal.getByRole("button", { name: "Last page" })).toHaveCount(0);
    await unknownTotal.getByRole("button", { name: "Next page" }).click();
    await expect(unknownTotal.locator(".phi-pagination__info")).toContainText("Page 2");
    await unknownTotal.getByRole("button", { name: "Next page" }).click();
    await expect(unknownTotal.locator(".phi-pagination__info")).toContainText("Page 3");
    await expect(unknownTotal.getByRole("button", { name: "Next page" })).toBeDisabled();

    await pageSize.getByRole("combobox", { name: "Page size" }).click();
    await pageSize.getByRole("option", { name: "50", exact: true }).click();
    await expect(pageSize.locator(".phi-pagination__info")).toContainText("1-50");

    await expect(dropdown.getByRole("combobox", { name: "Page number" })).toHaveCount(1);
    await expect(dropdown.getByRole("textbox", { name: "Page number" })).toHaveCount(0);
    await expect(i18n.getByRole("button", { name: "Page suivante" })).toHaveCount(1);
    await expect(i18n).toContainText("Affichage de");

    const apiTables = page.locator("#api-reference .docs-api-table");
    await expect(apiTables).toHaveCount(2);
    await expect(apiTables.nth(0).locator("tbody tr")).toHaveCount(11);
    await expect(apiTables.nth(1).locator("tbody tr")).toHaveCount(13);
    await expect(page.locator("#api-reference")).toContainText("v-model:page");
    await expect(page.locator("#api-reference")).toContainText("hasNextPage");
    await expect(page.locator("#api-reference")).toContainText("Pagination.PageSize");
    await expect(page.locator("#api-reference")).toContainText("Pagination.Controls");
    await expect(page.locator("#api-reference")).toContainText("\"input\" | \"dropdown\"");
  });
});

test("Home Pagination card renders a real pagination control", async ({ page }) => {
  await page.goto("/docs");

  const card = page
    .locator(".home-gallery__item")
    .filter({ has: page.getByRole("link", { name: "Pagination" }) });

  await expect(card.getByRole("link", { name: "Pagination" })).toHaveAttribute("href", "/docs/components/pagination");
  await expect(card.locator(".phi-pagination")).toHaveCount(1);
  await expect(card.getByRole("button", { name: "Previous page" })).toBeDisabled();
  await expect(card.getByRole("button", { name: "Next page" })).toBeEnabled();
  await expect(card.locator(".home-static--pagination")).toHaveCount(0);
});

test("Pagination is reachable in the left docs navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sidebar = page.locator(".docs-sidebar-panel--desktop");
  const links = sidebar.locator(".docs-nav-group__panel a");
  const pagination = sidebar.getByRole("link", { name: "Pagination" });

  await expect(pagination).toHaveAttribute("href", "/docs/components/pagination");

  const labels = await links.evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(labels.indexOf("Pagination")).toBe(labels.indexOf("Meter") + 1);

  await pagination.scrollIntoViewIfNeeded();

  await expect(pagination).toBeInViewport();
});
