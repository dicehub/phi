import { expect, type Locator, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

const visibleMenu = (page: Page, text: string) =>
  page.locator('.phi-dropdown-content[data-state="open"]').filter({ hasText: text }).last();

const closedMenu = (page: Page, text: string) =>
  page.locator('.phi-dropdown-content[data-state="open"]').filter({ hasText: text });

const openExample = async (page: Page, id: string, buttonName: string) => {
  const example = id === "preview" ? page.locator("#preview .docs-component-example") : exampleById(page, id);

  await example.getByRole("button", { name: buttonName }).click();
  return example;
};

const itemColor = async (item: Locator) => item.evaluate((element) => getComputedStyle(element).color);
const nextAnimationFrame = async (page: Page) =>
  page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  );

test.describe("Dropdown Menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/dropdown");
  });

  test("renders expected page sections and snippets", async ({ page }) => {
    await expect(page.locator("main h1").first()).toHaveText("Dropdown Menu");
    const arkLink = page.locator(".docs-page-header__primitive-link");
    await expect(arkLink).toHaveAttribute("href", "https://ark-ui.com/docs/components/menu");
    await expect(arkLink).toHaveAttribute("target", "_blank");
    await expect(arkLink).toHaveAttribute("rel", "noopener noreferrer");
    await expect(arkLink.locator("svg")).toHaveAttribute("aria-label", "Ark UI");

    await expect(page.locator(".docs-component-example")).toHaveCount(8);
    await expect(page.locator(".docs-code-block")).toHaveCount(11);
    await expect(page.locator("#preview .docs-code-block")).toContainText('from "@dicehub/phi/components/dropdown"');
    await expect(page.locator("#preview .docs-code-block")).toContainText("<DropdownMenu.Item value=\"worker\">Worker</DropdownMenu.Item>");
    await expect(page.locator("#examples .docs-code-block").filter({ hasText: "DropdownMenu.CheckboxItem" })).toHaveCount(1);
    await expect(page.locator("#examples .docs-code-block").filter({ hasText: "DropdownMenu.SubTrigger" })).toHaveCount(1);
    await expect(page.locator("#examples .docs-code-block").filter({ hasText: "DropdownMenu.LinkItem" })).toHaveCount(1);
    await expect(page.locator(".docs-code-block").filter({ hasText: "v-for" })).toHaveCount(0);
    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(16);
    await expect(page.locator("#dropdown-menu-item-api")).toContainText("variant");
    await expect(page.locator("#dropdown-menu-item-api")).toContainText('"default" | "danger"');
    await expect(page.locator("#dropdown-menu-checkbox-item-api")).toContainText("checked / v-model:checked");
    await expect(page.locator("#dropdown-menu-content-api")).toContainText("Menu.ContentProps");
    await expect(page.locator("#dropdown-menu-radio-group-api")).toContainText("modelValue / v-model");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Basic Dropdown",
      "Inset Items",
      "Handling Item Clicks",
      "Checkbox Items",
      "Nested Menu with Radio Selection",
      "Custom Trigger with Avatar",
      "Navigation Links",
      "API Reference",
      "DropdownMenu",
      "DropdownMenu.Trigger",
      "DropdownMenu.Content",
      "DropdownMenu.Item",
      "DropdownMenu.LinkItem",
      "DropdownMenu.CheckboxItem",
      "DropdownMenu.Group",
      "DropdownMenu.Label",
      "DropdownMenu.Sub",
      "DropdownMenu.SubTrigger",
      "DropdownMenu.SubContent",
      "DropdownMenu.Separator",
      "DropdownMenu.Shortcut",
      "DropdownMenu.RadioGroup",
      "DropdownMenu.RadioItem",
      "DropdownMenu.RadioItemIndicator",
    ]);
    await expect(page.locator(".docs-page-toc a[href='#preview']")).toHaveCount(0);
  });

  test("opens and closes a basic dropdown", async ({ page }) => {
    await openExample(page, "preview", "Add");
    const menu = visibleMenu(page, "Worker");

    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Worker" })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Pages" })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "KV Namespace" })).toBeVisible();

    await menu.getByRole("menuitem", { name: "Worker" }).click();
    await expect(closedMenu(page, "Worker")).toHaveCount(0);
  });

  test("renders inset rows and danger items with expected styling", async ({ page }) => {
    await openExample(page, "inset-items", "Edit");
    const menu = visibleMenu(page, "Move to folder");
    const rename = menu.getByRole("menuitem", { name: "Rename" });
    const move = menu.getByRole("menuitem", { name: "Move to folder" });
    const danger = menu.getByRole("menuitem", { name: "Delete" });

    await expect(menu).toBeVisible();
    await expect(menu.locator(".phi-dropdown-separator")).toHaveCount(2);
    await expect(move).toHaveClass(/phi-dropdown-item--inset/);
    await expect(danger).toHaveClass(/phi-dropdown-item--danger/);

    const [renameBox, moveBox] = await Promise.all([rename.boundingBox(), move.boundingBox()]);
    expect(renameBox).not.toBeNull();
    expect(moveBox).not.toBeNull();
    expect(moveBox!.x).toBe(renameBox!.x);
    expect(await itemColor(danger)).not.toBe(await itemColor(rename));
  });

  test("handles item select callbacks", async ({ page }) => {
    const example = await openExample(page, "handling-item-clicks", "Actions");
    const menu = visibleMenu(page, "Duplicate");

    await menu.getByRole("menuitem", { name: "Delete" }).click();
    await expect(closedMenu(page, "Duplicate")).toHaveCount(0);
    await expect(example.locator(".dropdown-demo__status")).toHaveText("Last action: Deleted");
  });

  test("keeps checkbox items open and toggles their checked state", async ({ page }) => {
    await openExample(page, "checkbox-items", "View Options");
    const menu = visibleMenu(page, "Show sidebar");
    const sidebar = menu.getByRole("menuitemcheckbox", { name: "Show sidebar" });
    const lineNumbers = menu.getByRole("menuitemcheckbox", { name: "Show line numbers" });

    await expect(menu).toBeVisible();
    await expect(menu.getByText("Display")).toBeVisible();
    await expect(sidebar).toHaveAttribute("aria-checked", "true");
    await expect(sidebar.locator(".phi-dropdown-item-indicator")).toBeVisible();
    await expect(lineNumbers).toHaveAttribute("aria-checked", "false");
    await expect(lineNumbers.locator(".phi-dropdown-item-indicator")).toBeHidden();

    await lineNumbers.click();
    await expect(menu).toBeVisible();
    await expect(lineNumbers).toHaveAttribute("aria-checked", "true");
    await expect(lineNumbers.locator(".phi-dropdown-item-indicator")).toBeVisible();

    await sidebar.click();
    await expect(menu).toBeVisible();
    await expect(sidebar).toHaveAttribute("aria-checked", "false");
    await expect(sidebar.locator(".phi-dropdown-item-indicator")).toBeHidden();
  });

  test("supports nested submenus with radio selection", async ({ page }) => {
    await openExample(page, "nested-menu-with-radio-selection", "Account");
    const rootMenu = page.locator('[id="menu:dropdown-nested-menu-with-radio-selection:content"][data-state="open"]');
    const languageTrigger = page.locator('[id="menu:dropdown-nested-menu-with-radio-selection-language:trigger"]');
    const languageMenu = page.locator('[id="menu:dropdown-nested-menu-with-radio-selection-language:content"]');
    const german = page.locator('[id="dropdown-nested-menu-with-radio-selection-language/de"]');
    const english = page.locator('[id="dropdown-nested-menu-with-radio-selection-language/en"]');
    const spanish = page.locator('[id="dropdown-nested-menu-with-radio-selection-language/es"]');

    await expect(rootMenu).toBeVisible();
    await expect(rootMenu).toBeFocused();
    await expect(languageTrigger).toBeVisible();

    for (const item of ["Profile", "Billing", "Dark mode", "Language"]) {
      await page.keyboard.press("ArrowDown");
      await expect(rootMenu.getByRole("menuitem", { name: item, exact: true })).toHaveAttribute("data-highlighted", "");
      await nextAnimationFrame(page);
    }
    await expect(languageTrigger).toHaveAttribute("data-highlighted", "");
    await page.keyboard.press("ArrowRight");
    await expect(languageMenu).toBeVisible();
    await expect(languageMenu).toBeFocused();
    await expect(german).toHaveAttribute("data-highlighted", "");
    await nextAnimationFrame(page);
    await expect(english).toHaveAttribute("aria-checked", "true");
    await expect(spanish).toHaveAttribute("aria-checked", "false");

    await page.keyboard.press("ArrowDown");
    await expect(english).toHaveAttribute("data-highlighted", "");
    await nextAnimationFrame(page);
    await page.keyboard.press("ArrowDown");
    await expect(spanish).toHaveAttribute("data-highlighted", "");
    await page.keyboard.press("Enter");
    await expect(languageMenu).toBeVisible();
    await expect(spanish).toHaveAttribute("aria-checked", "true");
    await expect(english).toHaveAttribute("aria-checked", "false");
  });

  test("supports custom avatar triggers", async ({ page }) => {
    const example = exampleById(page, "custom-trigger-with-avatar");
    const trigger = example.getByRole("button", { name: "Open account menu" });

    await expect(trigger).toHaveText("MR");
    await trigger.click();

    const menu = visibleMenu(page, "Settings");
    await expect(menu.getByRole("menuitem", { name: "Profile" })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Settings" })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Log out" })).toHaveClass(/phi-dropdown-item--danger/);
  });

  test("renders semantic navigation links", async ({ page }) => {
    await openExample(page, "navigation-links", "Resources");
    const menu = visibleMenu(page, "Developer Docs");

    await expect(menu.getByRole("menuitem", { name: "Settings" })).toHaveAttribute("href", "/docs/installation");
    await expect(menu.getByRole("menuitem", { name: "Documentation" })).toHaveAttribute("href", "/docs");
    await expect(menu.getByRole("menuitem", { name: "Developer Docs" })).toHaveAttribute(
      "href",
      "https://developers.cloudflare.com",
    );
    await expect(menu.getByRole("menuitem", { name: "Developer Docs" })).toHaveAttribute("target", "_blank");
  });
});
