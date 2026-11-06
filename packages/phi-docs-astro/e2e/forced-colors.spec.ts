import { expect, test, type Locator, type Page } from "@playwright/test";

const example = (page: Page, name: string) => page.locator(`[data-focus-case="${name}"]`);
const controls = [
  { name: "button", focus: ".phi-button", paint: ".phi-button" },
  { name: "disabled-button", focus: ".phi-button-tooltip-trigger", paint: ".phi-button" },
  { name: "input", focus: ".phi-input", paint: ".phi-input" },
  { name: "textarea", focus: ".phi-input-area", paint: ".phi-input-area" },
  { name: "checkbox", focus: ".phi-checkbox__input", paint: ".phi-checkbox__control" },
  { name: "radio", focus: ".phi-radio__input", paint: ".phi-radio__control" },
  { name: "segmented-radio", focus: ".phi-radio__input", paint: ".phi-radio" },
  { name: "switch", focus: ".phi-switch", paint: ".phi-switch" },
  { name: "input-group", focus: ".phi-input-group-input", paint: ".phi-input-group" },
  { name: "tag-input", focus: ".phi-tag-input-chip__remove", paint: ".phi-tag-input" },
  { name: "sensitive-input", focus: ".phi-sensitive-input-control", paint: ".phi-sensitive-input-control" },
  { name: "select", focus: ".phi-select-trigger", paint: ".phi-select-trigger" },
  { name: "combobox", focus: ".phi-combobox-input", paint: ".phi-combobox-control" },
  { name: "autocomplete", focus: ".phi-autocomplete-input", paint: ".phi-autocomplete-control" },
  { name: "date-picker", focus: ".phi-date-picker-input", paint: ".phi-date-picker-control" },
  { name: "menubar", focus: ".phi-menubar__option", paint: ".phi-menubar__option" },
  { name: "slider", focus: ".phi-slider__thumb", paint: ".phi-slider__thumb" },
  { name: "inline-copy-text", focus: ".phi-inline-copy-text", paint: ".phi-inline-copy-text" },
  { name: "sidebar", focus: ".phi-sidebar-trigger", paint: ".phi-sidebar-trigger" },
];

async function keyboardEntry(page: Page, name: string) {
  const root = example(page, name);
  await root.locator("[data-focus-start]").focus();
  await page.keyboard.press("Tab");
  return root;
}

async function expectOutline(target: Locator, systemColor = true) {
  await expect(target).toHaveCSS("outline-style", "solid");
  await expect(target).toHaveCSS("outline-width", "2px");
  await expect(target).toHaveCSS("box-shadow", "none");
  const colors = await target.evaluate((element) => {
    const sample = document.createElement("span");
    sample.style.color = "Highlight";
    document.body.append(sample);
    const highlight = getComputedStyle(sample).color;
    sample.remove();
    const style = getComputedStyle(element);
    return { outline: style.outlineColor, foreground: style.color, highlight };
  });
  // Engines can map currentColor outlines to Highlight for keyboard focus.
  expect(systemColor ? [colors.highlight] : [colors.foreground, colors.highlight]).toContain(colors.outline);
  expect(colors.outline).not.toBe("rgba(0, 0, 0, 0)");
}

test.describe("forced-colors keyboard focus", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    await page.goto("/docs/accessibility#keyboard-and-focus");
    test.skip(
      !await page.evaluate(() => matchMedia("(forced-colors: active)").matches),
      "This browser does not emulate forced colors.",
    );
    await expect(page.locator('astro-island[component-url*="ForcedColorsDocsDemo"]')).not.toHaveAttribute("ssr");
    await expect(page.locator("[data-forced-colors-demo] .phi-slider__thumb")).toBeVisible();
  });

  for (const control of controls) {
    test(`shows the ${control.name} focus indicator after Tab`, async ({ page }) => {
      const root = await keyboardEntry(page, control.name);
      const focused = root.locator(control.focus).first();
      await expect(focused).toBeFocused();
      expect(await focused.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
      await expectOutline(root.locator(control.paint).first(), control.name !== "inline-copy-text");
    });
  }

  test("moves focus between shared inputs and their individual actions", async ({ page }) => {
    const group = await keyboardEntry(page, "input-group");
    await page.keyboard.press("Tab");
    const groupButton = group.locator(".phi-input-group-button");
    await expect(groupButton).toBeFocused();
    await expectOutline(groupButton);
    await expect(groupButton).toHaveCSS("outline-offset", "-2px");
    await expectOutline(group.locator(".phi-input-group"));

    const tags = await keyboardEntry(page, "tag-input");
    await expectOutline(tags.locator(".phi-tag-input-chip__remove"));
    await page.keyboard.press("Tab");
    await expect(tags.locator(".phi-tag-input__input")).toBeFocused();
    await expectOutline(tags.locator(".phi-tag-input"));

    const sensitive = await keyboardEntry(page, "sensitive-input");
    await page.keyboard.press("Tab");
    await expect(sensitive.locator(".phi-sensitive-input-copy")).toBeFocused();
    await expectOutline(sensitive.locator(".phi-sensitive-input-copy"));
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Enter");
    await expect(sensitive.locator(".phi-sensitive-input")).toBeFocused();
    await expectOutline(sensitive.locator(".phi-sensitive-input-control"));
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(sensitive.locator(".phi-sensitive-input-toggle")).toBeFocused();
    await expectOutline(sensitive.locator(".phi-sensitive-input-toggle"));
  });

  test("follows the active Select option while DOM focus stays on its list", async ({ page }) => {
    await keyboardEntry(page, "select");
    await page.keyboard.press("ArrowDown");
    const listbox = page.locator(".phi-select-content");
    await expect(listbox.locator(".phi-select-list")).toBeFocused();
    await page.keyboard.press("Home");
    const first = listbox.getByRole("option", { name: "Europe" });
    const second = listbox.getByRole("option", { name: "Asia" });
    await expect(first).toHaveAttribute("data-highlighted", "");
    await expectOutline(first);
    await page.keyboard.press("ArrowDown");
    await expect(second).toHaveAttribute("data-highlighted", "");
    await expectOutline(second);
    await expect(first).toHaveCSS("outline-style", "none");
  });

  test("keeps the Sidebar menu, submenu, and resize control visible", async ({ page }) => {
    const root = await keyboardEntry(page, "sidebar");
    for (const selector of [".phi-sidebar-menu-button", ".phi-sidebar-menu-sub-button", ".phi-sidebar-resize-handle"]) {
      await page.keyboard.press("Tab");
      await expect(root.locator(selector)).toBeFocused();
      await expectOutline(root.locator(selector));
    }
    await page.keyboard.press("ArrowRight");
    await expectOutline(root.locator(".phi-sidebar-resize-handle"));
  });

  for (const variant of ["underline", "segmented"]) {
    for (const size of ["base", "sm"]) {
      test(`keeps ${variant} ${size} tab outlines inside the scrolling viewport`, async ({ page }) => {
        const root = await keyboardEntry(page, `tabs-${variant}-${size}`);
        const tabs = root.getByRole("tab");
        const list = root.locator(".phi-tabs__list");
        expect(await list.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
        // Firefox makes overflowing scroll containers an extra native Tab stop.
        if (await list.evaluate((element) => document.activeElement === element)) {
          await page.keyboard.press("Tab");
        }

        for (const [index, tab] of [tabs.first(), tabs.last()].entries()) {
          if (index === 1) {
            await page.keyboard.press("End");
            await expect(tab).toBeFocused();
            await page.keyboard.press("Enter");
            await expect(tab).toHaveAttribute("aria-selected", "true");
          }
          await expect(tab).toBeFocused();
          await expectOutline(tab);
          await expect(tab).toHaveCSS("outline-offset", "-2px");
          await expect.poll(() => tab.evaluate((element) => {
            const style = getComputedStyle(element);
            const growth = Math.max(0, parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset));
            const bounds = element.getBoundingClientRect();
            const viewport = element.closest(".phi-tabs__list")!.getBoundingClientRect();
            return bounds.left - growth >= viewport.left - 1 && bounds.right + growth <= viewport.right + 1
              && bounds.top - growth >= viewport.top - 1 && bounds.bottom + growth <= viewport.bottom + 1;
          })).toBe(true);
        }
        if (variant === "segmented") {
          await page.keyboard.press("Tab");
          const startControl = root.locator('.phi-tabs__overflow-control[data-side="start"]');
          await expect(startControl).toBeFocused();
          await expectOutline(startControl.locator(".phi-tabs__overflow-control-icon"));
        }
      });
    }
  }

  test("does not add a keyboard outline after a pointer click", async ({ page }) => {
    const root = example(page, "button");
    await root.locator("[data-focus-start]").click();
    await root.locator(".phi-button").click();
    await expect(root.locator(".phi-button")).toBeFocused();
    expect(await root.locator(".phi-button").evaluate((element) => element.matches(":focus-visible"))).toBe(false);
    await expect(root.locator(".phi-button")).toHaveCSS("outline-style", "none");
  });
});

test("keeps the existing focus rings when forced colors are off", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "none", reducedMotion: "reduce" });
  await page.goto("/docs/accessibility#keyboard-and-focus");
  await expect(page.locator('astro-island[component-url*="ForcedColorsDocsDemo"]')).not.toHaveAttribute("ssr");
  await expect(page.locator("[data-forced-colors-demo] .phi-slider__thumb")).toBeVisible();
  for (const control of controls.filter(({ name }) => name !== "slider" && name !== "segmented-radio")) {
    const root = await keyboardEntry(page, control.name);
    await expect(root.locator(control.focus).first()).toBeFocused();
    await expect(root.locator(control.paint).first()).not.toHaveCSS("box-shadow", "none");
  }
});
