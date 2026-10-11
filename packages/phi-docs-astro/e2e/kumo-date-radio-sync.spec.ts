import { expect, test, type Locator, type Page } from "@playwright/test";

const dateDemo = (page: Page) => page.locator(".date-picker-outside-demo");
const dateButton = (root: Locator, value: string) => root.locator(`.phi-date-picker-cell-trigger[data-value="${value}"]`);
const radioDemo = (page: Page, variant = "segmented") => page.locator(`.segmented-radio-demo[data-variant="${variant}"]`);

test.describe("DatePicker outside months", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/docs/components/date-picker"); });

  test("hides duplicate date controls and range highlights in both month panels", async ({ page }) => {
    const demo = dateDemo(page);
    await expect(demo.locator(".phi-date-picker-month")).toHaveCount(2);
    const hidden = demo.locator(".phi-date-picker-table-cell[data-hidden]");
    await expect.poll(() => hidden.count()).toBeGreaterThan(0);
    expect(await hidden.evaluateAll(cells => cells.every(cell => getComputedStyle(cell).visibility === "hidden" && cell.getAttribute("aria-hidden") === "true" && !cell.querySelector(".phi-date-picker-cell-trigger")))).toBe(true);
    for (const value of ["2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02", "2026-10-03"]) {
      await expect(dateButton(demo, value)).toHaveCount(1);
      await expect(dateButton(demo, value)).toBeVisible();
      await expect(dateButton(demo, value)).toHaveAttribute("data-in-range", "");
    }
    const ids = await demo.locator(".phi-date-picker-cell-trigger").evaluateAll(cells => cells.map(cell => cell.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("inherits root overrides, accepts Calendar overrides, and updates month-count defaults", async ({ page }) => {
    const demo = dateDemo(page);
    await demo.getByRole("button", { name: "Show outside days", exact: true }).click();
    await expect(dateButton(demo, "2026-10-01")).toHaveCount(2);
    await demo.getByRole("button", { name: "Hide outside days", exact: true }).click();
    await expect(dateButton(demo, "2026-10-01")).toHaveCount(1);
    await demo.getByRole("button", { name: "Calendar shows outside days", exact: true }).click();
    await expect(dateButton(demo, "2026-10-01")).toHaveCount(2);
    await demo.getByRole("button", { name: "Calendar inherits root", exact: true }).click();
    await expect(dateButton(demo, "2026-10-01")).toHaveCount(1);
    await demo.getByRole("button", { name: "One month", exact: true }).click();
    await expect(dateButton(demo, "2026-10-01")).toHaveCount(0);
    await demo.getByRole("button", { name: "Default outside days", exact: true }).click();
    await expect(dateButton(demo, "2026-10-01")).toHaveCount(1);
    await demo.getByRole("button", { name: "Two months", exact: true }).click();
    await expect(dateButton(demo, "2026-10-01")).toHaveCount(1);
    await demo.getByRole("button", { name: "Three months", exact: true }).click();
    await expect(demo.locator(".phi-date-picker-month")).toHaveCount(3);
    await expect(dateButton(demo, "2026-12-01")).toHaveCount(0);
    await expect(demo.getByLabel("Selected dates")).toHaveText("2026-09-29 to 2026-10-03");
  });

  test("selects ranges in both directions and moves keyboard focus across panels", async ({ page }) => {
    const demo = dateDemo(page);
    await dateButton(demo, "2026-09-30").click();
    await dateButton(demo, "2026-10-02").click();
    await expect(demo.getByLabel("Selected dates")).toHaveText("2026-09-30 to 2026-10-02");
    await dateButton(demo, "2026-10-03").click();
    await dateButton(demo, "2026-09-29").click();
    await expect(demo.getByLabel("Selected dates")).toHaveText("2026-09-29 to 2026-10-03");
    await dateButton(demo, "2026-09-30").click();
    await expect(dateButton(demo, "2026-09-30")).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(dateButton(demo, "2026-10-01")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(demo.getByLabel("Selected dates")).toHaveText("2026-09-30 to 2026-10-01");
    await expect(dateButton(demo, "2026-10-10")).toBeDisabled();
    await dateButton(demo, "2026-10-01").click();
    await page.keyboard.press("ArrowRight");
    await expect(dateButton(demo, "2026-10-02")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(demo.getByLabel("Selected dates")).toHaveText("2026-10-01 to 2026-10-02");
  });

  test("retains outside-day hiding after calendar navigation", async ({ page }) => {
    const demo = dateDemo(page);
    await demo.getByRole("button", { name: "Next month", exact: true }).click();
    await expect(dateButton(demo, "2026-09-29")).toHaveCount(0);
    await expect.poll(() => demo.locator(".phi-date-picker-table-cell[data-hidden]").count()).toBeGreaterThan(0);
    const values = await demo.locator(".phi-date-picker-cell-trigger").evaluateAll(cells => cells.map(cell => cell.getAttribute("data-value")));
    expect(new Set(values).size).toBe(values.length);
  });

  test("supports explicit inline Content and gives nested pickers their own focus container", async ({ page }) => {
    const demo = dateDemo(page);
    await demo.getByRole("button", { name: "Hide outside days", exact: true }).click();
    await demo.getByRole("button", { name: "Toggle explicit content", exact: true }).click();
    const content = demo.locator('[data-scope="date-picker"][data-part="content"]');
    await expect(content).toHaveCount(2);
    const ids = await content.evaluateAll(elements => elements.map(element => element.id));
    expect(new Set(ids).size).toBe(2);
    const nested = demo.locator('[id="datepicker:docs-date-picker-nested"]');
    // The inner root resets both content ancestry and outside-day inheritance.
    await expect(dateButton(nested, "2026-10-01")).toHaveCount(1);
    await dateButton(nested, "2026-09-15").click();
    await page.keyboard.press("ArrowRight");
    await expect(dateButton(nested, "2026-09-16")).toBeFocused();
    await dateButton(nested, "2026-10-01").click();
    await expect(dateButton(nested, "2026-10-01")).toHaveAttribute("data-selected", "");
    await expect(nested.locator(".phi-date-picker-month-title")).toHaveText("October 2026");
    await page.keyboard.press("ArrowRight");
    await expect(dateButton(nested, "2026-10-02")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(dateButton(nested, "2026-10-02")).toHaveAttribute("data-selected", "");
  });

  test("preserves disabled outside days and permits a real range-start click when enabled", async ({ page }) => {
    const demo = dateDemo(page);
    await demo.getByRole("button", { name: "One month", exact: true }).click();
    const outside = dateButton(demo, "2026-10-01");
    await expect(outside).toBeDisabled();
    await outside.click({ force: true });
    await expect(demo.locator(".phi-date-picker-month-title")).toHaveText("September 2026");
    await expect(demo.getByLabel("Selected dates")).toHaveText("2026-09-29 to 2026-10-03");
    await demo.getByRole("button", { name: "Enable outside date selection", exact: true }).click();
    await outside.click();
    await expect(demo.getByLabel("Selected dates")).toHaveText("2026-10-01 to none");
    await page.keyboard.press("ArrowRight");
    await expect(dateButton(demo, "2026-10-02")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(demo.getByLabel("Selected dates")).toHaveText("2026-10-01 to 2026-10-02");
  });
});

test.describe("Segmented Radio", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/docs/components/radio"); });

  test("preserves radio semantics, pointer selection, and one keyboard change event", async ({ page }) => {
    const demo = radioDemo(page);
    const group = demo.getByRole("group", { name: "Theme", exact: true });
    await expect(group).toHaveAttribute("data-orientation", "horizontal");
    await expect(group.getByRole("radio", { name: "System", exact: true })).toBeChecked();
    await expect(group.locator(".phi-radio__control")).toHaveCount(0);
    await group.locator(".phi-radio").filter({ hasText: /^Light$/ }).click();
    await expect(demo.getByLabel("Selected theme")).toHaveText("light");
    await expect(demo.getByLabel("Radio change events")).toHaveText("1");
    await group.getByRole("radio", { name: "Light", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(group.getByRole("radio", { name: "System", exact: true })).toBeChecked();
    await expect(group.getByRole("radio", { name: "System", exact: true })).toBeFocused();
    await expect(demo.getByLabel("Radio change events")).toHaveText("2");
    await expect(group.locator(".phi-radio--checked")).toHaveCSS("outline-style", "solid");
  });

  test("keeps checked colors on hover and changes unchecked hover backgrounds", async ({ page }) => {
    const group = radioDemo(page).getByRole("group", { name: "Theme", exact: true });
    const checked = group.locator(".phi-radio--checked");
    const background = (item: Locator) => item.evaluate(element => getComputedStyle(element, "::before").backgroundColor);
    const color = await background(checked);
    await checked.hover();
    expect(await background(checked)).toBe(color);
    const light = group.locator(".phi-radio").first();
    await light.hover();
    expect(await background(light)).not.toBe("rgba(0, 0, 0, 0)");
    expect(await background(light)).not.toBe(color);
  });

  test("honors disabled fieldsets and items and keeps error rendering", async ({ page }) => {
    const demo = radioDemo(page, "segmented-states");
    const disabled = demo.getByRole("group", { name: "Disabled plan", exact: true });
    for (const radio of await disabled.getByRole("radio").all()) await expect(radio).toBeDisabled();
    await expect(disabled.locator(".phi-radio").first()).toHaveCSS("opacity", "0.5");
    await disabled.locator(".phi-radio").last().click({ force: true });
    await expect(disabled.getByRole("radio", { name: "Monthly", exact: true })).toBeChecked();
    const available = demo.getByRole("group", { name: "Availability", exact: true });
    await available.getByRole("radio", { name: "Ready", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(available.getByRole("radio", { name: "Done", exact: true })).toBeChecked();
    await expect(available.getByRole("radio", { name: "Paused", exact: true })).not.toBeChecked();
    const invalid = demo.getByRole("group", { name: "Required plan", exact: true });
    await expect(invalid).toHaveAttribute("aria-invalid", "true");
    await expect(invalid.locator(".phi-radio-group__error")).toHaveText("Choose a plan");
    await expect(invalid.locator(".phi-radio").first()).not.toHaveCSS("box-shadow", "none");
  });

  test("keeps custom legends outside the row and ignores item appearance overrides", async ({ page }) => {
    const demo = radioDemo(page, "segmented-legends");
    const group = demo.getByRole("group", { name: "Display mode", exact: true });
    await expect(group.locator(":scope > legend strong")).toHaveText("Display mode");
    await expect(group.locator(".phi-radio-group__items legend")).toHaveCount(0);
    await expect(group).toHaveAttribute("data-orientation", "horizontal");
    await expect(group.locator(".phi-radio--appearance-card, .phi-radio__description, .phi-radio__control")).toHaveCount(0);
    await demo.getByRole("button", { name: "Reverse options", exact: true }).click();
    await expect(group.locator(".phi-radio__label")).toHaveText(["◇ dark", "◇ system", "◇ light"]);
    await expect(group.getByRole("radio", { name: "system", exact: true })).toBeChecked();
    await expect(demo.getByRole("group", { name: "View", exact: true }).locator(":scope > legend")).toHaveClass(/phi-sr-only/);
  });

  test("preserves typed model values and submits native form values", async ({ page }) => {
    const demo = radioDemo(page, "segmented-form");
    await demo.getByRole("group", { name: "Rows", exact: true }).locator(".phi-radio").filter({ hasText: /^25$/ }).click();
    await demo.getByRole("group", { name: "Alerts", exact: true }).locator(".phi-radio").filter({ hasText: /^On$/ }).click();
    await expect(demo.getByLabel("Typed values")).toHaveText("number 25; boolean true");
    await demo.getByRole("button", { name: "Submit options", exact: true }).click();
    await expect(demo.getByLabel("Submitted options")).toHaveText('[["rows","25"],["alerts","true"]]');
  });

  test("uses one compact row with logical corners in both themes and RTL", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    const group = radioDemo(page).getByRole("group", { name: "Theme", exact: true });
    await expect(group.locator(".phi-radio-group__items")).toHaveCSS("flex-wrap", "nowrap");
    for (const mode of ["light", "dark"]) {
      await expect(page.locator("html")).toHaveAttribute("data-mode", mode);
      const selectedLabel = group.locator(".phi-radio--checked .phi-radio__label");
      const inverse = await selectedLabel.evaluate(element => {
        const probe = document.createElement("span");
        probe.style.color = "var(--text-color-phi-inverse)";
        element.append(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      });
      await expect(selectedLabel).toHaveCSS("color", inverse);
      const geometry = await group.locator(".phi-radio").evaluateAll(items => items.map(item => ({ y: item.getBoundingClientRect().y, height: item.getBoundingClientRect().height })));
      expect(geometry.every(item => item.height === 34 && item.y === geometry[0].y)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (mode === "light") await page.getByRole("button", { name: "Toggle theme", exact: true }).first().click();
    }
    await group.evaluate(element => element.setAttribute("dir", "rtl"));
    await expect(group.locator(".phi-radio").first()).toHaveCSS("border-top-right-radius", "8px");
    await expect(group.locator(".phi-radio").last()).toHaveCSS("border-top-left-radius", "8px");
  });
});
