import { expect, type Page, test } from "@playwright/test";

const openDialog = (page: Page) => page.locator(".phi-command-palette-content");
const openBackdrop = (page: Page) => page.locator(".phi-command-palette-backdrop");
const openInput = (page: Page) => openDialog(page).locator(".phi-command-palette-input");
const openItems = (page: Page) => openDialog(page).locator(".phi-command-palette-item");
const highlightedItem = (page: Page) => openDialog(page).locator(".phi-command-palette-item[data-highlighted]");

async function expectDialogClosed(page: Page) {
  await expect(openDialog(page)).toHaveCount(0);
}

test.describe("CommandPalette", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/command-palette");
  });

  test("renders expected page sections and snippets", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("CommandPalette");
    await expect(page.locator(".docs-component-example")).toHaveCount(6);
    await expect(page.locator(".docs-code-block")).toHaveCount(11);
    await expect(page.locator("#preview .docs-code-block")).toContainText('from "@dicehub/phi/components/command-palette"');
    await expect(page.locator("#usage .docs-code-block")).toContainText("CommandPalette.Root");
    await expect(page.locator("#examples .docs-code-block").filter({ hasText: "CommandPalette.ResultItem" })).toHaveCount(1);
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    const toc = page.locator(".docs-page-toc");

    await expect(toc.locator("a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Keyboard Navigation",
      "Examples",
      "With Grouped Items",
      "Simple Flat List",
      "Loading State",
      "Disabling Browser Autocomplete",
      "ResultItem with Breadcrumbs",
      "Component Parts",
      "CommandPalette.Root",
      "CommandPalette.Dialog",
      "CommandPalette.Panel",
      "CommandPalette.Input",
      "CommandPalette.List",
      "CommandPalette.Results",
      "CommandPalette.Group",
      "CommandPalette.GroupLabel",
      "CommandPalette.Items",
      "CommandPalette.Item",
      "CommandPalette.ResultItem",
      "CommandPalette.HighlightedText",
      "CommandPalette.Empty",
      "CommandPalette.Loading",
      "CommandPalette.Footer",
      "API Reference",
      "CommandPalette.Root Props",
      "CommandPalette.ResultItem Props",
    ]);
    await expect(toc.locator("a[href='#preview']")).toHaveCount(0);
  });

  test("opens, filters, selects grouped commands, and closes", async ({ page }) => {
    await page.locator("#preview").getByRole("button", { name: "Open Command Palette" }).click();

    await expect(openDialog(page)).toBeVisible();
    await expect(openInput(page)).toBeFocused();
    await expect(openDialog(page).locator(".phi-command-palette-group-label")).toHaveText(["Commands", "Pages"]);

    await openInput(page).fill("settings");
    await expect(openItems(page)).toHaveCount(1);
    await expect(openItems(page).first()).toContainText("Open Settings");
    await openItems(page).first().click();

    await expectDialogClosed(page);
    await expect(page.locator("#preview")).toContainText("Last selected: Open Settings");
  });

  test("closes with Escape and outside click", async ({ page }) => {
    const trigger = page.locator("#preview").getByRole("button", { name: "Open Command Palette" });

    await trigger.click();
    await expect(openDialog(page)).toBeVisible();
    await openInput(page).press("Escape");
    await expectDialogClosed(page);

    await trigger.click();
    await expect(openDialog(page)).toBeVisible();
    await expect(openBackdrop(page)).toBeVisible();
    await openBackdrop(page).click({ position: { x: 8, y: 8 } });
    await expectDialogClosed(page);
  });

  test("resets search and highlight after selecting and reopening", async ({ page }) => {
    const trigger = page.locator("#preview").getByRole("button", { name: "Open Command Palette" });

    await trigger.click();
    await openInput(page).fill("settings");
    await expect(openItems(page)).toHaveText(["Open Settings"]);
    await openInput(page).press("Enter");
    await expectDialogClosed(page);
    await expect(page.locator("#preview")).toContainText("Last selected: Open Settings");

    await trigger.click();
    await expect(openInput(page)).toHaveValue("");
    await expect(openItems(page)).toHaveCount(6);
    await expect(highlightedItem(page)).toContainText("Create New Project");
  });

  test("selects the highlighted command with Enter", async ({ page }) => {
    await page.locator("#preview").getByRole("button", { name: "Open Command Palette" }).click();

    await expect(highlightedItem(page)).toContainText("Create New Project");
    await openInput(page).press("Enter");
    await expectDialogClosed(page);
    await expect(page.locator("#preview")).toContainText("Last selected: Create New Project");

    await page.locator("#preview").getByRole("button", { name: "Open Command Palette" }).click();
    await openInput(page).press("ArrowDown");
    await expect(highlightedItem(page)).toContainText("Open Settings");
    await openInput(page).press("Enter");
    await expectDialogClosed(page);
    await expect(page.locator("#preview")).toContainText("Last selected: Open Settings");
  });

  test("supports keyboard navigation and empty state in a flat list", async ({ page }) => {
    const simple = page.locator("#simple-flat-list + p + .docs-component-example");

    await simple.getByRole("button", { name: "Open Simple Palette" }).click();
    await openInput(page).fill("pa");
    await expect(openItems(page)).toHaveText(["Paste"]);
    await openInput(page).press("Enter");
    await expectDialogClosed(page);

    await simple.getByRole("button", { name: "Open Simple Palette" }).click();
    await openInput(page).fill("zzzz");
    await expect(openItems(page)).toHaveCount(0);
    await expect(openDialog(page).locator(".phi-command-palette-empty")).toHaveText("No actions found");
  });

  test("renders loading state", async ({ page }) => {
    const loading = page.locator("#loading-state + p + .docs-component-example");

    await loading.getByRole("button", { name: "Open with Loading" }).click();
    await expect(openDialog(page).locator(".phi-command-palette-loading")).toContainText("Loading...");
    await expect(openDialog(page).locator(".phi-command-palette-spinner")).toBeVisible();
  });

  test("passes browser autocomplete suppression attributes to the input", async ({ page }) => {
    const noAutocomplete = page.locator("#disabling-browser-autocomplete + p + .docs-component-example");

    await noAutocomplete.getByRole("button", { name: "Open Palette (No Autocomplete)" }).click();
    await expect(openInput(page)).toHaveAttribute("autocomplete", "off");
    await expect(openInput(page)).toHaveAttribute("autocapitalize", "none");
    await expect(openInput(page)).toHaveAttribute("data-1p-ignore", "true");
    await expect(openInput(page)).toHaveAttribute("data-lpignore", "true");
  });

  test("supports rich result items and modified enter selection", async ({ page }) => {
    const result = page.locator("#result-item-with-breadcrumbs + p + .docs-component-example");

    await result.getByRole("button", { name: "Open with ResultItem" }).click();
    await expect(openDialog(page).locator(".phi-command-palette-result-item").first()).toContainText("Components/Button");
    await expect(openDialog(page).locator(".phi-command-palette-result-item__icon").first()).toBeVisible();
    await openInput(page).press("Control+Enter");
    await expectDialogClosed(page);
  });

  test("filters and selects rich result items with Enter", async ({ page }) => {
    const result = page.locator("#result-item-with-breadcrumbs + p + .docs-component-example");

    await result.getByRole("button", { name: "Open with ResultItem" }).click();
    await openInput(page).fill("dialog");
    await expect(openItems(page)).toHaveCount(1);
    await expect(highlightedItem(page)).toContainText("Components/Dialog");
    await openInput(page).press("Enter");
    await expectDialogClosed(page);
  });

  test("documents every component part and API group", async ({ page }) => {
    await expect(page.locator("#component-parts h3")).toHaveText([
      "CommandPalette.Root",
      "CommandPalette.Dialog",
      "CommandPalette.Panel",
      "CommandPalette.Input",
      "CommandPalette.List",
      "CommandPalette.Results",
      "CommandPalette.Group",
      "CommandPalette.GroupLabel",
      "CommandPalette.Items",
      "CommandPalette.Item",
      "CommandPalette.ResultItem",
      "CommandPalette.HighlightedText",
      "CommandPalette.Empty",
      "CommandPalette.Loading",
      "CommandPalette.Footer",
    ]);
    await expect(page.locator("#api-reference .docs-code-block").first()).toContainText("interface CommandPaletteRootProps");
    await expect(page.locator("#api-reference .docs-code-block").last()).toContainText("interface CommandPaletteResultItemProps");
  });

  test("uses a 50 percent themed background for highlighted search matches", async ({ page }) => {
    const trigger = page
      .locator(".docs-sidebar-panel--desktop")
      .getByRole("button", { name: "Search docs" });
    await expect(trigger).toHaveAttribute("data-docs-search-ready", "true");
    await trigger.click();

    const docsSearch = page.locator("#docs-search-dialog");
    await expect(docsSearch).toBeVisible();
    await docsSearch.getByPlaceholder("Search documentation...").fill("button");
    const mark = docsSearch.locator(".phi-command-palette-mark").first();
    await expect(mark).toHaveText("Button");

    const lightBackground = await mark.evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(lightBackground).toMatch(/(?:\/ 0\.5\)|, 0\.5\))/);

    await page.evaluate(() => {
      document.documentElement.setAttribute("data-mode", "dark");
    });

    const darkBackground = await mark.evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(darkBackground).toMatch(/(?:\/ 0\.5\)|, 0\.5\))/);
  });
});
