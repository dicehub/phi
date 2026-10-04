import { expect, type Locator, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

const box = async (locator: Locator) => {
  const result = await locator.boundingBox();
  if (!result) throw new Error("Expected element to have a bounding box");

  return {
    height: Math.round(result.height),
    width: Math.round(result.width),
  };
};

test.describe("Table", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/table");
  });

  test("renders the preview table and code", async ({ page }) => {
    const preview = page.locator("#preview");
    const table = preview.locator(".phi-table");
    const bodyRows = table.locator("tbody tr");

    await expect(page.locator("main h1").first()).toHaveText("Table");
    await expect(table).toHaveCount(1);
    await expect(table.locator("thead th")).toHaveText(["Subject", "From", "Date"]);
    await expect(bodyRows).toHaveCount(3);
    await expect(bodyRows.first()).toContainText("Phi v1.0.0 released");
    await expect.poll(async () => (await box(table)).height).toBeGreaterThan(120);
    await expect(preview.locator(".docs-code-block pre")).toContainText('from "@dicehub/phi/components/table"');

    const rowBackgrounds = await bodyRows.evaluateAll((rows) =>
      rows.map((row) => getComputedStyle(row.querySelector("td")!).backgroundColor),
    );
    expect(rowBackgrounds[0]).toBe(rowBackgrounds[2]);
    expect(rowBackgrounds[0]).not.toBe(rowBackgrounds[1]);
    expect(rowBackgrounds[1]).toBe("oklch(0.98 0 0)");
    await expect(bodyRows.first().locator("td").first()).toHaveCSS("border-bottom-width", "0px");
    await expect(table.locator("thead th").first()).toHaveCSS("border-bottom-width", "1px");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "With Checkboxes",
      "Compact Header",
      "Selected Row",
      "Fixed Layout with Column Sizes",
      "Sticky Column",
      "Compact Header with Sticky Column",
      "Full Example",
      "API Reference",
      "Table",
      "Table.Header",
      "Table.Body",
      "Table.Row",
      "Table.Head",
      "Table.Cell",
      "Table.CheckHead",
      "Table.CheckCell",
      "Table.ResizeHandle",
      "TanStack Table Integration",
      "Accessibility",
    ]);
  });

  test("renders documented examples and API reference", async ({ page }) => {
    const examples = page.locator("#examples");
    const checkboxes = exampleById(page, "with-checkboxes");
    const compact = exampleById(page, "compact-header");
    const selected = exampleById(page, "selected-row");
    const fixed = exampleById(page, "fixed-layout-with-column-sizes");
    const sticky = exampleById(page, "sticky-column");
    const full = exampleById(page, "full-example");

    await expect(examples.locator(".docs-component-example")).toHaveCount(7);
    await expect(checkboxes.getByRole("checkbox", { name: "Select all rows" })).toHaveCount(1);
    const firstCheckboxRow = checkboxes.locator(".phi-table-row").filter({ hasText: "Phi v1.0.0 released" });
    await firstCheckboxRow.locator(".phi-checkbox__control").click();
    await expect(firstCheckboxRow.getByRole("checkbox", { name: "Select Phi v1.0.0 released" })).toBeChecked();

    await expect(compact.locator(".phi-table-header--compact")).toHaveCount(1);
    await expect(selected.locator(".phi-table-row--selected")).toContainText("New Job Offer");
    const selectedRows = selected.locator("tbody .phi-table-row");
    await selectedRows.first().locator(".phi-checkbox__control").click();
    await expect(selectedRows.first()).toHaveClass(/phi-table-row--selected/);
    const selectedBackgrounds = await selectedRows.evaluateAll((rows) =>
      rows.slice(0, 2).map((row) => getComputedStyle(row.querySelector("td")!).backgroundColor),
    );
    expect(selectedBackgrounds[0]).toBe(selectedBackgrounds[1]);
    await expect(selected.locator(".docs-code-block pre")).toContainText("const rows = [");
    await expect(selected.locator(".docs-code-block pre")).toContainText('const selectedIds = ref(new Set<string>(["2"]))');
    await expect(selected.locator(".docs-code-block pre")).toContainText("<Table.CheckHead");
    await expect(selected.locator(".docs-code-block pre")).toContainText(
      `:variant="selectedIds.has(row.id) ? 'selected' : 'default'"`,
    );
    await expect(fixed.locator(".phi-table")).toHaveAttribute("data-layout", "fixed");
    await expect(sticky.locator(".phi-table-head--sticky-right")).toHaveCount(1);
    await expect(sticky.locator(".phi-table-cell--sticky-right")).toHaveCount(5);
    const stickyRowBackgrounds = await sticky.locator("tbody .phi-table-row").evaluateAll((rows) =>
      rows.slice(0, 2).map((row) => {
        const regularCell = row.querySelector<HTMLElement>(".phi-table-cell:not(.phi-table-cell--sticky-right)")!;
        const stickyCell = row.querySelector<HTMLElement>(".phi-table-cell--sticky-right")!;
        return {
          regular: getComputedStyle(regularCell).backgroundColor,
          sticky: getComputedStyle(stickyCell).backgroundColor,
        };
      }),
    );
    expect(stickyRowBackgrounds[0].sticky).toBe(stickyRowBackgrounds[0].regular);
    expect(stickyRowBackgrounds[1].sticky).toBe(stickyRowBackgrounds[1].regular);
    expect(stickyRowBackgrounds[0].sticky).not.toBe(stickyRowBackgrounds[1].sticky);
    await expect(full.locator(".phi-badge")).toHaveText(["promotion"]);

    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(9);
    await expect(page.locator("#api-reference")).toContainText("Table.CheckHead");
    await expect(page.locator("#api-reference")).toContainText("@checked-change");
    await expect(page.locator("#api-reference")).toContainText("@value-change");
    await expect(page.locator("#tanstack-table-integration")).toContainText("useVueTable");
    await expect(page.locator("#tanstack-table-integration")).toContainText("<col");
    await expect(page.locator("#tanstack-table-integration")).toContainText("table.getHeaderGroups()");
    await expect(page.locator("#tanstack-table-integration")).toContainText("<Table.ResizeHandle");
    await expect(page.locator("#tanstack-table-integration")).toContainText("row.getVisibleCells()");
    await expect(page.locator("#accessibility")).toContainText("semantic");
  });
});

test("Table is reachable in the left docs navigation after Switch", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sidebar = page.locator(".docs-sidebar-panel--desktop");
  const links = sidebar.locator(".docs-nav-group__panel a");
  const switchLink = sidebar.getByRole("link", { name: "Switch" });
  const tableLink = sidebar.getByRole("link", { name: "Table", exact: true });

  await expect(switchLink).toHaveAttribute("href", "/docs/components/switch");
  await expect(tableLink).toHaveAttribute("href", "/docs/components/table");

  const labels = await links.evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(labels.indexOf("Table")).toBe(labels.indexOf("Switch") + 1);
});
