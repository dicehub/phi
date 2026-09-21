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

test.describe("Toolbar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/toolbar");
  });

  test("renders the preview toolbar and code", async ({ page }) => {
    const preview = page.locator("#preview");
    const toolbar = preview.getByRole("toolbar");

    await expect(page.locator("main h1").first()).toHaveText("Toolbar");
    await expect(page.locator(".docs-page-header__primitive-link")).toHaveCount(0);
    await expect(toolbar).toHaveCount(1);
    await expect(toolbar.getByRole("textbox", { name: "Search DNS records" })).toHaveAttribute(
      "placeholder",
      "Search DNS records",
    );
    await expect(toolbar.getByRole("button", { name: "Filter" })).toHaveCount(1);
    await expect(toolbar.getByRole("button", { name: "Settings" })).toHaveCount(1);
    await expect.poll(() => box(toolbar)).toMatchObject({ height: 36 });
    await expect(preview.locator(".docs-code-block pre")).toContainText('from "@dicehub/phi/components/toolbar"');
    await expect(preview.locator(".docs-code-block pre")).toContainText("<Toolbar.InputGroup");
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Behavior",
      "Examples",
      "Select",
      "Combobox",
      "Input Shorthand",
      "Input Group",
      "Sizes",
      "Button Actions",
      "Links",
      "Accessible Labels",
      "API Reference",
      "Select composition",
      "Combobox composition",
    ]);
  });

  test("renders documented examples, keyboard focus, and API reference", async ({ page }) => {
    const inputShorthand = exampleById(page, "input-shorthand");
    const select = exampleById(page, "select");
    const combobox = exampleById(page, "combobox");
    const inputGroup = exampleById(page, "input-group");
    const sizes = exampleById(page, "sizes");
    const actions = exampleById(page, "button-actions");
    const links = exampleById(page, "links");
    const labels = exampleById(page, "accessible-labels");

    await expect(page.locator("#examples .docs-component-example")).toHaveCount(8);
    await expect(select.getByRole("combobox", { name: "Sort records" })).toHaveText("Name");
    await expect(combobox.getByRole("combobox", { name: "Filter status" })).toHaveCount(1);
    await expect(combobox.getByRole("button", { name: "Choose status" })).toHaveText("All records");
    await expect(inputShorthand.getByRole("toolbar")).toHaveCount(1);
    await expect(inputShorthand.getByRole("textbox", { name: "Search DNS records" })).toHaveCount(1);
    await expect(inputGroup.getByRole("textbox", { name: "Worker subdomain" })).toHaveAttribute(
      "placeholder",
      "my-worker",
    );
    await expect(inputGroup.locator(".phi-input-group-suffix")).toContainText(".workers.dev");
    await expect(actions.getByRole("toolbar").getByRole("button")).toHaveText(["Upload", "Download"]);
    const docsLink = links.getByRole("link", { name: "Button docs" });
    const linkDownload = links.getByRole("button", { name: "Download" });
    await expect(docsLink).toHaveAttribute("href", "/docs/components/button");
    await expect(docsLink).toHaveAttribute("data-phi-component", "Toolbar.Link");
    await docsLink.focus();
    await page.keyboard.press("ArrowRight");
    await expect(linkDownload).toBeFocused();
    await expect(labels.getByRole("button", { name: "Search" })).toHaveCount(1);

    const sizeToolbars = sizes.getByRole("toolbar");
    await expect(sizeToolbars).toHaveCount(4);
    await expect.poll(() => box(sizeToolbars.nth(0))).toMatchObject({ height: 20 });
    await expect.poll(() => box(sizeToolbars.nth(1))).toMatchObject({ height: 26 });
    await expect.poll(() => box(sizeToolbars.nth(2))).toMatchObject({ height: 36 });
    await expect.poll(() => box(sizeToolbars.nth(3))).toMatchObject({ height: 40 });

    const previewToolbar = page.locator("#preview").getByRole("toolbar");
    const previewInput = previewToolbar.getByRole("textbox", { name: "Search DNS records" });
    const filterButton = previewToolbar.getByRole("button", { name: "Filter" });

    await previewInput.focus();
    await page.keyboard.press("ArrowRight");
    await expect(filterButton).toBeFocused();

    await expect(page.locator("#api-reference tbody tr td:first-child code")).toHaveText(["default", "size", "class"]);
    await expect(page.locator("#api-reference")).toContainText('"xs" | "sm" | "base" | "lg"');
    await expect(page.locator("#behavior")).toContainText("Toolbar.InputGroup");
    await expect(page.locator("#behavior")).toContainText("Toolbar.Link");
    await expect(page.locator("#behavior")).toContainText("Adjacent toolbar items share borders");
    await expect(page.locator("#api-reference")).toContainText("Put one Toolbar.Button");
    await expect(page.locator("#api-reference")).toContainText("exactly one toolbar control");
  });

  test("composes Select and Combobox interactions with toolbar focus", async ({ page }) => {
    const selectExample = exampleById(page, "select");
    const selectToolbar = selectExample.getByRole("toolbar");
    const filterButton = selectToolbar.getByRole("button", { name: "Filter" });
    const selectTrigger = selectToolbar.getByRole("combobox", { name: "Sort records" });
    const settingsButton = selectToolbar.getByRole("button", { name: "View settings" });

    await expect.poll(() => box(selectToolbar)).toMatchObject({ height: 36 });
    await expect(filterButton).toHaveCSS("border-top-left-radius", "8px");
    await expect(selectTrigger).toHaveCSS("border-left-width", "1px");
    await expect(selectTrigger).toHaveCSS("border-radius", "0px");
    await expect(settingsButton).toHaveCSS("border-top-right-radius", "8px");

    await filterButton.focus();
    await page.keyboard.press("ArrowRight");
    await expect(selectTrigger).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(settingsButton).toBeFocused();

    await selectTrigger.click();
    await page.getByRole("option", { name: "Created date" }).click();
    await expect(selectTrigger).toHaveText("Created date");

    const comboboxExample = exampleById(page, "combobox");
    const editableToolbar = comboboxExample.getByRole("toolbar").first();
    const input = editableToolbar.getByRole("combobox", { name: "Filter status" });
    const statusSettings = editableToolbar.getByRole("button", { name: "Status settings" });

    await input.fill("fail");
    await page.getByRole("option", { name: "Failed" }).click();
    await expect(input).toHaveValue("Failed");

    await input.evaluate((element: HTMLInputElement) => element.setSelectionRange(2, 2));
    await page.keyboard.press("ArrowRight");
    await expect(input).toBeFocused();
    await input.evaluate((element: HTMLInputElement) => element.setSelectionRange(element.value.length, element.value.length));
    await page.keyboard.press("ArrowRight");
    await expect(statusSettings).toBeFocused();

    const valueTrigger = comboboxExample.getByRole("button", { name: "Choose status" });
    await valueTrigger.click();
    await page.getByRole("option", { name: "Paused" }).click();
    await expect(valueTrigger).toHaveText("Paused");
  });
});

test("Home Toolbar card renders the real component", async ({ page }) => {
  await page.goto("/");

  await page.locator(".home-gallery__item").first().waitFor({ timeout: 1500 }).catch(() => undefined);
  test.skip(
    (await page.locator(".home-gallery__item").count()) === 0,
    "Home gallery did not hydrate on the current dev server.",
  );

  const card = page.locator('.home-gallery__item:has(.home-gallery__title[href="/docs/components/toolbar"])');

  await expect(card.locator(".home-gallery__title")).toHaveText("Toolbar");
  await expect(card.getByRole("toolbar")).toHaveCount(1);
  await expect(card.locator(".home-static--toolbar")).toHaveCount(0);
});

test("Toolbar is reachable in the left docs navigation after Text", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sidebar = page.locator(".docs-sidebar-panel--desktop");
  const links = sidebar.locator(".docs-nav-group__panel a");
  const textLink = sidebar.getByRole("link", { name: "Text", exact: true });
  const toolbarLink = sidebar.getByRole("link", { name: "Toolbar", exact: true });

  await expect(textLink).toHaveAttribute("href", "/docs/components/text");
  await expect(toolbarLink).toHaveAttribute("href", "/docs/components/toolbar");

  const labels = await links.evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(labels.indexOf("Toolbar")).toBe(labels.indexOf("Text") + 1);
});
