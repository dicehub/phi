import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) => page.locator(`#${id} + .docs-component-example`);
const openDialog = (page: Page) => page.locator(".phi-dialog-content");
const waitForDialogMotion = async (page: Page) => {
  await openDialog(page).first().evaluate(async (element) => {
    await Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => undefined)));
  });
};

test.describe("Dialog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/dialog");
  });

  test("renders expected page sections and snippets", async ({ page }) => {
    await expect(page.locator("main h1").first()).toHaveText("Dialog");
    const arkLink = page.locator(".docs-page-header__primitive-link");
    await expect(arkLink).toHaveAttribute("href", "https://ark-ui.com/docs/components/dialog");
    await expect(arkLink).toHaveAttribute("target", "_blank");
    await expect(arkLink).toHaveAttribute("rel", "noopener noreferrer");
    await expect(arkLink.locator("svg")).toHaveAttribute("aria-label", "Ark UI");

    await expect(page.locator(".docs-component-example")).toHaveCount(10);
    await expect(page.locator(".docs-code-block")).toHaveCount(12);
    await expect(page.locator("#preview .docs-code-block")).toContainText('from "@dicehub/phi/components/dialog"');
    await expect(page.locator("#preview .docs-code-block")).toContainText("<Button>Delete</Button>");
    await expect(page.locator("#preview .docs-code-block")).not.toContainText("dialog-demo__panel--alert");
    await expect(page.locator("#examples .docs-code-block").filter({ hasText: 'role="alertdialog"' })).toHaveCount(1);
    await expect(page.locator("#examples .docs-code-block").filter({ hasText: "disable-pointer-dismissal" })).toHaveCount(1);
    await expect(page.locator("#examples .docs-code-block").filter({ hasText: "Combobox" })).toHaveCount(1);
    await expect(page.locator("#examples .docs-code-block").filter({ hasText: "DropdownMenu" })).toHaveCount(1);

    const topTriggerTextColor = await page.locator("#preview").getByRole("button", { name: "Delete" }).first().evaluate((element) => getComputedStyle(element).color);
    expect(topTriggerTextColor).not.toBe("rgb(255, 255, 255)");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Dialog vs Alert Dialog",
      "Examples",
      "Basic Dialog",
      'Alert Dialog (role="alertdialog")',
      "Confirmation Dialog (with disablePointerDismissal)",
      "With Actions",
      "Max Width Override",
      "With Select",
      "With Combobox",
      "With Dropdown",
      "Sub-components",
      "API Reference",
      "Dialog",
      "Dialog.Root",
      "Dialog Parts",
    ]);
  });

  test("opens, closes, and outside-dismisses a basic dialog", async ({ page }) => {
    const basic = exampleById(page, "basic-dialog");

    await basic.getByRole("button", { name: "Click me" }).click();
    const dialog = page.getByRole("dialog", { name: "Modal Title" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Lorem ipsum");
    await expect(openDialog(page)).toHaveClass(/phi-dialog-content--base/);

    await page.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toHaveCount(0);

    await basic.getByRole("button", { name: "Click me" }).click();
    await expect(dialog).toBeVisible();
    await page.locator(".phi-dialog-backdrop").click({ position: { x: 12, y: 12 } });
    await expect(dialog).toHaveCount(0);
  });

  test("matches the expected top-actions modal size and spacing", async ({ page }) => {
    await page.locator("#preview").getByRole("button", { name: "Delete" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Modal Title" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Lorem ipsum");
    await waitForDialogMotion(page);

    const metrics = await dialog.evaluate((element) => {
      const style = getComputedStyle(element);
      const title = element.querySelector(".phi-dialog-title");
      const close = element.querySelector(".phi-dialog-close");
      const closeIcon = element.querySelector(".phi-dialog-close__icon");
      const actions = element.querySelector(".dialog-demo__actions");
      const description = element.querySelector(".phi-dialog-description");
      const closeBox = close?.getBoundingClientRect();
      const closeIconBox = closeIcon?.getBoundingClientRect();
      const actionsBox = actions?.getBoundingClientRect();
      const descriptionBox = description?.getBoundingClientRect();
      const contentBox = element.getBoundingClientRect();

      return {
        actionTopGap: actionsBox && descriptionBox ? actionsBox.top - descriptionBox.bottom : null,
        animationDuration: style.animationDuration,
        closeHeight: closeBox?.height ?? null,
        closeIconWidth: closeIconBox?.width ?? null,
        height: contentBox.height,
        overflow: style.overflow,
        paddingTop: Number.parseFloat(style.paddingTop),
        radius: Number.parseFloat(style.borderRadius),
        top: contentBox.top,
        titleFontSize: title ? Number.parseFloat(getComputedStyle(title).fontSize) : null,
        width: contentBox.width,
      };
    });

    expect(metrics.width).toBeGreaterThanOrEqual(380);
    expect(metrics.width).toBeLessThanOrEqual(388);
    expect(metrics.height).toBeGreaterThanOrEqual(252);
    expect(metrics.height).toBeLessThanOrEqual(284);
    expect(metrics.animationDuration).toBe("0.15s");
    expect(metrics.paddingTop).toBe(32);
    expect(metrics.titleFontSize).toBe(24);
    expect(metrics.closeHeight).toBeGreaterThanOrEqual(35);
    expect(metrics.closeHeight).toBeLessThanOrEqual(37);
    expect(metrics.closeIconWidth).toBeGreaterThanOrEqual(13);
    expect(metrics.closeIconWidth).toBeLessThanOrEqual(15);
    expect(metrics.actionTopGap).toBeGreaterThanOrEqual(31);
    expect(metrics.radius).toBe(12);
    expect(metrics.top).toBe(64);
    expect(metrics.overflow).toBe("hidden");
  });

  test("uses alertdialog role and keeps alert dialogs open on outside click", async ({ page }) => {
    const alert = exampleById(page, "alert-dialog");

    await alert.getByRole("button", { name: "Delete Account" }).click();
    const dialog = page.getByRole("alertdialog", { name: "Delete Account?" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(
      "This action cannot be undone. All your data will be permanently removed from our servers. Are you sure you want to proceed?",
    );
    await waitForDialogMotion(page);

    const metrics = await dialog.evaluate((element) => {
      const style = getComputedStyle(element);
      const description = element.querySelector(".phi-dialog-description");
      const descriptionBox = description?.getBoundingClientRect();
      const descriptionStyle = description ? getComputedStyle(description) : null;
      const contentBox = element.getBoundingClientRect();

      return {
        descriptionHeight: descriptionBox?.height ?? null,
        descriptionLineHeight: descriptionStyle ? Number.parseFloat(descriptionStyle.lineHeight) : null,
        height: contentBox.height,
        paddingTop: Number.parseFloat(style.paddingTop),
        width: contentBox.width,
      };
    });

    expect(metrics.width).toBeGreaterThanOrEqual(380);
    expect(metrics.width).toBeLessThanOrEqual(388);
    expect(metrics.height).toBeGreaterThanOrEqual(256);
    expect(metrics.height).toBeLessThanOrEqual(288);
    expect(metrics.paddingTop).toBe(32);
    expect(metrics.descriptionHeight).toBeGreaterThanOrEqual(72);
    expect(metrics.descriptionHeight).toBeLessThanOrEqual(96);
    expect(metrics.descriptionLineHeight).toBe(24);

    await page.locator(".phi-dialog-backdrop").click({ position: { x: 12, y: 12 } });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toHaveCount(0);
  });

  test("supports disablePointerDismissal for confirmation flows", async ({ page }) => {
    const confirmation = exampleById(page, "confirmation-dialog");

    await confirmation.getByRole("button", { name: "Delete Project" }).click();
    const dialog = page.getByRole("dialog", { name: "Delete Project?" });
    await expect(dialog).toBeVisible();
    await page.locator(".phi-dialog-backdrop").click({ position: { x: 12, y: 12 } });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toHaveCount(0);
  });

  test("uses a Phi-styled select field in the select example", async ({ page }) => {
    const selectExample = exampleById(page, "with-select");

    await selectExample.getByRole("button", { name: "Open Form" }).click();
    const dialog = page.getByRole("dialog", { name: "Create Resource" });
    await expect(dialog).toBeVisible();

    const select = dialog.getByRole("combobox", { name: "Region" });
    await expect(select).toHaveValue("us-east");

    const metrics = await select.evaluate((element) => {
      const style = getComputedStyle(element);
      const wrapper = element.parentElement;
      const chevron = wrapper ? getComputedStyle(wrapper, "::after") : null;

      return {
        appearance: style.appearance,
        chevronBorderWidth: Number.parseFloat(chevron?.borderRightWidth ?? "0"),
        chevronContent: chevron?.content ?? null,
        paddingRight: Number.parseFloat(style.paddingRight),
      };
    });

    expect(metrics.appearance).toBe("none");
    expect(metrics.chevronBorderWidth).toBeGreaterThanOrEqual(1);
    expect(metrics.chevronContent).not.toBe("none");
    expect(metrics.paddingRight).toBeGreaterThanOrEqual(36);
  });

  test("respects a consumer width override without viewport overflow", async ({ page }) => {
    const capped = exampleById(page, "max-width-override");

    await capped.getByRole("button", { name: "Open capped dialog" }).click();
    const dialog = page.getByRole("dialog", { name: "Max width override" });
    await expect(dialog).toBeVisible();
    await waitForDialogMotion(page);

    const box = await openDialog(page).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(500);
    expect(box!.width).toBeLessThanOrEqual(544);
  });

  test("keeps dialog open while using nested combobox content", async ({ page }) => {
    const combobox = exampleById(page, "with-combobox");

    await combobox.getByRole("button", { name: "Open Form" }).click();
    const dialog = page.getByRole("dialog", { name: "Create Resource" });
    await expect(dialog).toBeVisible();
    await dialog.getByPlaceholder("Search regions").click();
    await expect(page.locator(".phi-combobox-item").filter({ hasText: "US West" })).toBeVisible();
    await page.locator(".phi-combobox-item").filter({ hasText: "US West" }).click();
    await expect(dialog).toBeVisible();
  });

  test("keeps dialog open while using nested dropdown content", async ({ page }) => {
    const dropdown = exampleById(page, "with-dropdown");

    await dropdown.getByRole("button", { name: "Open Form" }).click();
    const dialog = page.getByRole("dialog", { name: "Resource Actions" });
    await expect(dialog).toBeVisible();
    const closeIds = await dialog.locator("[data-part='close-trigger']").evaluateAll((nodes) => nodes.map((node) => node.id));
    expect(new Set(closeIds).size).toBe(closeIds.length);
    await dialog.getByRole("button", { name: "Actions" }).click();
    await expect(page.locator(".phi-dropdown-item").filter({ hasText: "Edit" })).toBeVisible();
    const deleteColor = await page.locator(".phi-dropdown-item").filter({ hasText: "Delete" }).evaluate((element) => getComputedStyle(element).color);
    expect(deleteColor).toBe("oklch(0.637 0.237 25.331)");
    await page.locator(".phi-dropdown-item").filter({ hasText: "Edit" }).click();
    await expect(dialog).toBeVisible();
    await dialog.locator(".phi-dialog-close-trigger").filter({ hasText: "Close" }).click();
    await expect(dialog).toHaveCount(0);
  });
});
