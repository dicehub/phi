import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("MenuBar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/menu-bar");
  });

  test("renders the preview menu bar with code", async ({ page }) => {
    const preview = page.locator("#preview");
    const menuBar = preview.locator(".phi-menubar");
    const buttons = menuBar.locator(".phi-menubar__option");
    const arkLink = page.locator(".docs-page-header__primitive-link");

    await expect(page.locator("main h1").first()).toHaveText("MenuBar");
    await expect(arkLink).toHaveAttribute("href", "https://ark-ui.com/docs/components/menu");
    await expect(menuBar).toHaveCount(1);
    await expect(buttons).toHaveCount(2);
    await expect(buttons.nth(0)).toHaveAttribute("aria-label", "Bold");
    await expect(buttons.nth(1)).toHaveAttribute("aria-label", "Italic");
    await expect(buttons.nth(0)).toHaveAttribute("aria-pressed", "true");
    await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "false");
    await expect(menuBar).toHaveAttribute("role", "toolbar");
    await expect(menuBar).toHaveAttribute("aria-orientation", "horizontal");
    await expect(preview.getByRole("navigation")).toHaveCount(0);
    await expect(menuBar.locator(".phi-menubar__icon")).toHaveCount(2);
    await expect
      .poll(async () => buttons.nth(0).boundingBox().then((box) => Math.round(box?.width ?? Number.NaN)))
      .toBe(44);
    await expect
      .poll(async () => buttons.nth(0).boundingBox().then((box) => Math.round(box?.height ?? Number.NaN)))
      .toBe(18);
    await expect(preview.locator(".docs-code-block pre")).toContainText('from "@dicehub/phi/components/menubar"');
    await expect(preview.locator(".docs-code-block pre")).toContainText("PhTextBolder");
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");
  });

  test("toggles active option on click", async ({ page }) => {
    const preview = page.locator("#preview");
    const bold = preview.getByRole("button", { name: "Bold" });
    const italic = preview.getByRole("button", { name: "Italic" });

    await italic.click();
    await expect(bold).toHaveAttribute("aria-pressed", "false");
    await expect(italic).toHaveAttribute("aria-pressed", "true");
    await expect(italic).toHaveClass(/phi-menubar__option--active/);

    await italic.click();
    await expect(italic).toHaveAttribute("aria-pressed", "false");
    await expect(italic).not.toHaveClass(/phi-menubar__option--active/);
  });

  test("moves focus with horizontal arrow keys", async ({ page }) => {
    const preview = page.locator("#preview");
    const bold = preview.getByRole("button", { name: "Bold" });
    const italic = preview.getByRole("button", { name: "Italic" });

    await bold.focus();
    await page.keyboard.press("ArrowRight");
    await expect(italic).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(bold).toBeFocused();
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Text Formatting",
      "Without Active State",
      "API Reference",
      "Events",
    ]);
  });

  test("renders examples and API reference", async ({ page }) => {
    const textFormatting = exampleById(page, "text-formatting");
    const withoutActive = exampleById(page, "without-active-state");

    await expect(page.locator("#examples .docs-component-example")).toHaveCount(2);
    await expect(textFormatting.locator(".phi-menubar")).toHaveCount(1);
    await expect(textFormatting.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
    await expect(withoutActive.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "false");
    await expect(withoutActive.getByRole("button", { name: "Italic" })).toHaveAttribute("aria-pressed", "false");
    const apiTables = page.locator("#api-reference .docs-api-table");
    const propRows = apiTables.nth(0).locator("tbody tr");
    const eventRows = apiTables.nth(1).locator("tbody tr");

    await expect(apiTables).toHaveCount(2);
    await expect(propRows).toHaveCount(4);
    await expect(propRows.first()).toContainText("className");
    await expect(page.locator("#api-reference")).toContainText("MenuOptionProps[]");
    await expect(page.locator("#api-reference")).toContainText("options*");
    await expect(page.locator("#api-reference")).toContainText("optionIds");
    await expect(page.locator("#api-reference")).toContainText("number | string");
    await expect(page.locator("#api-reference")).not.toContainText("number | boolean | string");
    await expect(eventRows).toHaveCount(1);
    await expect(eventRows.first()).toContainText("@select");
    await expect(eventRows.first()).toContainText("MenuBarSelectDetails");
  });
});

test("Home MenuBar card renders a real menu bar", async ({ page }) => {
  await page.goto("/");

  const card = page
    .locator(".home-gallery__item")
    .filter({ has: page.getByRole("link", { name: "MenuBar" }) });

  await expect(card.getByRole("link", { name: "MenuBar" })).toHaveAttribute("href", "/docs/components/menu-bar");
  await expect(card.locator(".phi-menubar")).toHaveCount(1);
  await expect(card.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
  await expect(card.getByRole("button", { name: "Italic" })).toHaveAttribute("aria-pressed", "false");
});
