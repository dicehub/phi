import { expect, type Locator, type Page, test } from "@playwright/test";

const openContent = (page: Page) => page.locator(".phi-date-picker-content:not([hidden])");
const exampleById = (page: Page, id: string) => page.locator(`#${id} + .docs-component-example`);
const visibleDayButtons = (block: Locator) =>
  block.locator('.phi-date-picker-view:not([hidden]) .phi-date-picker-cell-trigger[data-view="day"]');
const dayButton = (block: Locator, day: number) =>
  visibleDayButtons(block).filter({ hasText: new RegExp(`^${day}$`) }).first();
const selectedDayButtons = (block: Locator) =>
  block.locator('.phi-date-picker-view:not([hidden]) .phi-date-picker-cell-trigger[data-view="day"][data-selected]');
const popupMonthDayButton = (page: Page, monthIndex: number, day: number) =>
  openContent(page)
    .locator('.phi-date-picker-view:not([hidden]) .phi-date-picker-month')
    .nth(monthIndex)
    .locator('.phi-date-picker-cell-trigger[data-view="day"]')
    .filter({ hasText: new RegExp(`^${day}$`) })
    .first();

async function expectPopupClosed(page: Page) {
  await expect(openContent(page)).toHaveCount(0);
}

async function expectHiddenPopoversCollapsed(page: Page) {
  const visibleHiddenPopovers = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>(".phi-date-picker-content[hidden]"))
      .map((content) => {
        const rect = content.getBoundingClientRect();
        return {
          display: getComputedStyle(content).display,
          height: rect.height,
          id: content.id,
          width: rect.width,
        };
      })
      .filter((content) => content.display !== "none" || content.width > 0 || content.height > 0),
  );

  expect(visibleHiddenPopovers).toEqual([]);
}

async function expectCompactInlineCalendar(block: Locator) {
  const rootBox = await block.locator(".phi-date-picker--inline").first().boundingBox();
  const tableBox = await block.locator('.phi-date-picker-view:not([hidden]) .phi-date-picker-table').first().boundingBox();
  const headerCenterDelta = await block.evaluate((element) => {
    const title = element.querySelector(".phi-date-picker-month-title");
    const nav = element.querySelector(".phi-date-picker-nav");
    const titleBox = title?.getBoundingClientRect();
    const navBox = nav?.getBoundingClientRect();

    return titleBox && navBox
      ? Math.abs(titleBox.top + titleBox.height / 2 - (navBox.top + navBox.height / 2))
      : null;
  });

  expect(rootBox).not.toBeNull();
  expect(tableBox).not.toBeNull();
  expect(headerCenterDelta).not.toBeNull();
  expect(rootBox!.width).toBeLessThanOrEqual(300);
  expect(tableBox!.width).toBeGreaterThanOrEqual(240);
  expect(tableBox!.width).toBeLessThanOrEqual(280);
  expect(headerCenterDelta!).toBeLessThanOrEqual(1);
}

async function expectAnchoredPopover(page: Page, id: string) {
  const metrics = await page.evaluate((exampleId) => {
    const block = document.querySelector(`#${exampleId} + .docs-component-example`);
    const trigger = block?.querySelector(".date-picker-demo__popover-trigger");
    const content = block?.querySelector(".phi-date-picker-content:not([hidden])");
    const positioner = block?.querySelector(".phi-date-picker-positioner:has(.phi-date-picker-content:not([hidden]))");
    const title = content?.querySelector(".phi-date-picker-month-title");
    const nav = content?.querySelector(".phi-date-picker-nav");
    const outsideDay = content?.querySelector('.phi-date-picker-cell-trigger[data-outside-range]');
    const triggerBox = trigger?.getBoundingClientRect();
    const contentBox = content?.getBoundingClientRect();
    const titleBox = title?.getBoundingClientRect();
    const navBox = nav?.getBoundingClientRect();

    if (!content || !title || !triggerBox || !contentBox || !positioner || !titleBox || !navBox) return null;

    return {
      caretContent: getComputedStyle(content, "::before").content,
      contentAboveTriggerBy: triggerBox.top - contentBox.bottom,
      contentBelowTriggerBy: contentBox.top - triggerBox.bottom,
      contentDeltaFromTrigger: contentBox.left + contentBox.width / 2 - (triggerBox.left + triggerBox.width / 2),
      headerCenterDelta: Math.abs(titleBox.top + titleBox.height / 2 - (navBox.top + navBox.height / 2)),
      headerTopDelta: Math.abs(titleBox.top - navBox.top),
      outsideDayOpacity: outsideDay ? Number.parseFloat(getComputedStyle(outsideDay).opacity) : undefined,
      outsideDayTextDecoration: outsideDay ? getComputedStyle(outsideDay).textDecorationLine : undefined,
      shadow: getComputedStyle(content).boxShadow,
      titleFontSize: Number.parseFloat(getComputedStyle(title).fontSize),
      x: getComputedStyle(positioner).getPropertyValue("--x"),
      y: getComputedStyle(positioner).getPropertyValue("--y"),
    };
  }, id);

  expect(metrics).not.toBeNull();
  expect(metrics!.x).toMatch(/px$/);
  expect(metrics!.y).toMatch(/px$/);
  expect(metrics!.shadow).not.toBe("none");
  expect(metrics!.caretContent).toBe('""');
  expect(metrics!.headerCenterDelta).toBeLessThanOrEqual(1);
  expect(metrics!.headerTopDelta).toBeLessThanOrEqual(1);
  expect(metrics!.outsideDayOpacity).toBeLessThanOrEqual(0.45);
  expect(metrics!.outsideDayTextDecoration).toBe("none");
  expect(metrics!.titleFontSize).toBeLessThanOrEqual(14);
  expect(Math.abs(metrics!.contentDeltaFromTrigger)).toBeLessThanOrEqual(1);
  expect(Math.max(metrics!.contentBelowTriggerBy, metrics!.contentAboveTriggerBy)).toBeGreaterThanOrEqual(4);
}

test.describe("DatePicker", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/date-picker");
  });

  test("renders expected page sections and snippets", async ({ page }) => {
    await expect(page.locator("main h1").first()).toHaveText("DatePicker");
    await expect(page.locator(".docs-component-example")).toHaveCount(12);
    await expect(page.locator(".docs-code-block")).toHaveCount(14);
    await expect(page.locator("#preview .docs-code-block")).toContainText('from "@dicehub/phi/components/date-picker"');
    await expect(page.locator("#preview .docs-code-block")).toContainText("v-model:selected");
    await expect(page.locator("#examples .docs-code-block").filter({ hasText: "mode=\"range\"" })).toHaveCount(5);
    await expect(page.locator("#examples .docs-code-block").filter({ hasText: "range-min-days" })).toHaveCount(1);
    await expect(page.locator("#examples .docs-code-block").filter({ hasText: "PresetTrigger" })).toHaveCount(2);
    await expect(page.locator("#preview .phi-date-picker-table-header")).toHaveText(["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]);

    await expect(page.locator(".phi-date-picker")).toHaveCount(12);
    const datePickerIds = await page.locator(".phi-date-picker").evaluateAll((nodes) => nodes.map((node) => node.id));
    expect(new Set(datePickerIds).size).toBe(datePickerIds.length);
    await expect(page.locator("#month-1")).toHaveCount(0);
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    const toc = page.locator(".docs-page-toc");

    await expect(toc.locator("a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Single Date",
      "Multiple Dates",
      "Date Range",
      "Range Constraints",
      "Popup",
      "Popup Range",
      "Range Presets",
      "Disabled Dates with Usage Limits",
      "Usage Limits",
      "Full Popup Example",
      "Sub-components",
      "API Reference",
      "DatePicker.Root",
      "DatePicker.Calendar",
      "DatePicker.Content",
    ]);
    await expect(toc.locator("a[href='#preview']")).toHaveCount(0);
    await expect(toc.locator("a[href='#installation'] + ul a")).toHaveCount(2);
    await expect(toc.locator("a[href='#examples'] + ul a")).toHaveCount(10);
    await expect(toc.locator("a[href='#api-reference'] + ul a")).toHaveCount(3);
  });

  test("selects a single inline date", async ({ page }) => {
    const preview = page.locator("#preview");

    await expect(preview.locator(".phi-date-picker")).toHaveCount(1);
    await expectCompactInlineCalendar(preview);
    await expect(preview.locator(".date-picker-demo__status")).toContainText("May 20, 2026");
    await dayButton(preview, 21).click();
    await expect(preview.locator(".date-picker-demo__status")).toContainText("May 21, 2026");
    const selectedDay = dayButton(preview, 21);
    await expect(selectedDay).toHaveAttribute("data-selected", "");
    await page.mouse.move(0, 0);
    const selectedStyle = await selectedDay.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        color: style.color,
      };
    });
    await selectedDay.hover();
    await expect
      .poll(() =>
        selectedDay.evaluate((element) => {
          const style = getComputedStyle(element);
          return {
            background: style.backgroundColor,
            color: style.color,
          };
        }),
      )
      .toEqual(selectedStyle);
  });

  test("supports multiple selection and max selected dates", async ({ page }) => {
    const multiple = exampleById(page, "multiple-dates");

    await expect(multiple.locator(".date-picker-demo__status")).toContainText("May 12, 2026, May 14, 2026");
    await dayButton(multiple, 15).click();
    await dayButton(multiple, 16).click();
    await expect(multiple.locator(".date-picker-demo__status")).toContainText("May 16, 2026");
    await expect(selectedDayButtons(multiple)).toHaveCount(4);
    await expect(dayButton(multiple, 18)).toBeEnabled();
    await dayButton(multiple, 18).click();
    await expect(multiple.locator(".date-picker-demo__status")).toContainText("May 18, 2026");
    await expect(selectedDayButtons(multiple)).toHaveCount(5);
  });

  test("selects date ranges and enforces range constraints", async ({ page }) => {
    const range = exampleById(page, "date-range");
    const constrained = exampleById(page, "range-constraints");

    await expect(range.locator(".date-picker-demo__status")).toContainText("May 12, 2026 - May 16, 2026");
    await expect(range.locator(".phi-date-picker-month")).toHaveCount(2);
    await dayButton(range, 20).click();
    await dayButton(range, 23).click();
    await expect(range.locator(".date-picker-demo__status")).toContainText("May 20, 2026 - May 23, 2026");

    await dayButton(constrained, 20).click();
    await dayButton(constrained, 25).click();
    await expect(constrained.locator(".date-picker-demo__status")).toContainText("May 20, 2026 - May 25, 2026");
    await dayButton(constrained, 1).click();
    await dayButton(constrained, 10).click();
    await expect(constrained.locator(".date-picker-demo__status")).not.toContainText("May 10, 2026");
    await expect(constrained.locator(".date-picker-demo__status")).toContainText("May 1, 2026 - None");
    await dayButton(constrained, 4).click();
    await expect(constrained.locator(".date-picker-demo__status")).toContainText("May 1, 2026 - May 4, 2026");
  });

  test("opens popup calendars and closes after single selection", async ({ page }) => {
    const popup = exampleById(page, "popup");

    await page.locator("#popup").evaluate((heading) => heading.scrollIntoView({ block: "start" }));
    await popup.locator(".date-picker-demo__popover-trigger").click();
    await expect(openContent(page)).toBeVisible();
    await expectAnchoredPopover(page, "popup");
    await openContent(page).locator(".phi-date-picker-cell-trigger").filter({ hasText: /^4$/ }).first().click();
    await expect(popup.locator(".date-picker-demo__status")).toContainText("Jun 4, 2026");
    await expect(popup.locator(".date-picker-demo__popover-trigger")).toContainText("Jun 4, 2026");
    await expectPopupClosed(page);
  });

  test("supports range popup with two months", async ({ page }) => {
    const popupRange = exampleById(page, "popup-range");

    await page.locator("#popup-range").evaluate((heading) => heading.scrollIntoView({ block: "start" }));
    await expectPopupClosed(page);
    await expectHiddenPopoversCollapsed(page);
    await popupRange.locator(".date-picker-demo__popover-trigger").click();
    await expect(openContent(page).locator(".phi-date-picker-month")).toHaveCount(2);
    await expectAnchoredPopover(page, "popup-range");
    await popupRange.locator(".docs-component-preview").click({ position: { x: 16, y: 16 } });
    await expectPopupClosed(page);
    await expectHiddenPopoversCollapsed(page);
    await popupRange.locator(".date-picker-demo__popover-trigger").click();
    await popupMonthDayButton(page, 0, 10).click();
    await expect(popupRange.locator(".date-picker-demo__status")).toContainText("Jun 10, 2026 - None");
    await expect(openContent(page)).toBeVisible();
    await popupRange.locator(".docs-component-preview").click({ position: { x: 16, y: 16 } });
    await expectPopupClosed(page);
    await popupRange.locator(".date-picker-demo__popover-trigger").click();
    await popupMonthDayButton(page, 0, 14).click();
    await expect(popupRange.locator(".date-picker-demo__status")).toContainText("Jun 10, 2026 - Jun 14, 2026");
    await expect(openContent(page)).toBeVisible();
  });

  test("applies range presets", async ({ page }) => {
    const presets = exampleById(page, "range-presets");

    await page.locator("#range-presets").evaluate((heading) => heading.scrollIntoView({ block: "start" }));
    await presets.locator(".date-picker-demo__popover-trigger").click();
    await expect(openContent(page).locator(".date-picker-demo__preset-list")).toBeVisible();
    await expectAnchoredPopover(page, "range-presets");
    await page.keyboard.press("Escape");
    await expectPopupClosed(page);

    await presets.locator(".date-picker-demo__popover-trigger").click();
    await popupMonthDayButton(page, 0, 10).click();
    await expect(presets.locator(".date-picker-demo__status")).toContainText("Jun 10, 2026 - None");
    await expect(openContent(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expectPopupClosed(page);

    await presets.locator(".date-picker-demo__popover-trigger").click();
    await page.getByRole("button", { name: /select Mon Jun 01 2026 to Sun Jun 07 2026|This month/ }).click();
    await expect(presets.locator(".date-picker-demo__status")).toContainText("Jun 1, 2026 - Jun 7, 2026");
  });

  test("marks disabled dates as unavailable", async ({ page }) => {
    const disabledDates = exampleById(page, "disabled-dates");
    const usageLimits = exampleById(page, "usage-limits");
    const disabledDay = dayButton(disabledDates, 5);
    const enabledDay = dayButton(disabledDates, 9);

    await expect(disabledDates.locator(".date-picker-demo__status")).toContainText(
      "0/5 days selected. Grayed dates are unavailable.",
    );
    await expect(disabledDay).toBeDisabled();
    await expect(dayButton(disabledDates, 12)).toBeDisabled();
    await expect(enabledDay).toBeEnabled();
    await expect(dayButton(usageLimits, 5)).toBeDisabled();
    await expect(usageLimits.locator(".date-picker-demo__status")).toContainText(
      "0/5 days selected. Grayed dates are unavailable.",
    );

    for (const day of [6, 9, 10, 11, 15]) {
      await dayButton(disabledDates, day).click();
    }
    await expect(disabledDates.locator(".date-picker-demo__status")).toContainText("5/5 days selected");
    await expect(selectedDayButtons(disabledDates)).toHaveCount(5);
    await dayButton(disabledDates, 16).click();
    await expect(disabledDates.locator(".date-picker-demo__status")).toContainText("5/5 days selected");
    await expect(selectedDayButtons(disabledDates)).toHaveCount(5);

    const disabledStyle = await disabledDay.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        cursor: style.cursor,
        opacity: Number.parseFloat(style.opacity),
      };
    });
    const enabledStyle = await enabledDay.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        cursor: style.cursor,
        opacity: Number.parseFloat(style.opacity),
      };
    });

    expect(disabledStyle.cursor).toBe("not-allowed");
    expect(disabledStyle.opacity).toBeLessThanOrEqual(0.45);
    expect(enabledStyle.cursor).toBe("pointer");
    expect(enabledStyle.opacity).toBe(1);
  });

  test("renders all documented DatePicker sub-components and API groups", async ({ page }) => {
    await expect(page.locator("#sub-components tbody code")).toHaveText([
      "DatePicker.Root",
      "DatePicker.Control",
      "DatePicker.Input",
      "DatePicker.Trigger",
      "DatePicker.Content",
      "DatePicker.Calendar",
      "DatePicker.PresetTrigger",
      "DatePicker.ValueText",
      "DatePicker.RangeText",
    ]);
    await expect(page.locator("#date-picker-root-api + .docs-api-table tbody tr")).toHaveCount(12);
    await expect(page.locator("#date-picker-calendar-api + .docs-api-table tbody tr")).toHaveCount(1);
    await expect(page.locator("#date-picker-content-api + .docs-api-table tbody tr")).toHaveCount(1);
  });
});
