import { expect, test, type Locator, type Page } from "@playwright/test";

const day = (root: Locator, value: string) => root.locator(`.phi-date-picker-cell-trigger[data-value="${value}"]`).first();
const cell = (root: Locator, value: string) => root.locator(`.phi-date-picker-table-cell[data-value="${value}"]`).first();
const demo = (page: Page) => page.locator(".date-picker-outside-demo");

async function tokenColor(element: Locator, token: string) {
  return element.evaluate((node, variable) => {
    const probe = document.createElement("span");
    probe.style.color = `var(${variable})`;
    node.append(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  }, token);
}

async function band(element: Locator) {
  return element.evaluate(node => {
    const style = getComputedStyle(node, "::before");
    return {
      content: style.content,
      background: style.backgroundColor,
      width: style.width,
      start: style.insetInlineStart,
      end: style.insetInlineEnd,
      startRadius: style.borderStartStartRadius,
      endRadius: style.borderStartEndRadius,
    };
  });
}

test.describe("DatePicker theme and range refresh", () => {
  test.beforeEach(async ({ page }) => {
    // May 20 is selected in the hero, which also checks the selected-today state.
    await page.clock.setFixedTime(new Date("2026-05-20T12:00:00Z"));
    await page.goto("/docs/components/date-picker");
    await expect(page.locator("#preview .phi-date-picker-cell-trigger[data-selected]")).toBeVisible();
  });

  test("aligns 32px days and navigation in 36px columns with 8px between weeks", async ({ page }) => {
    const preview = page.locator("#preview");
    const metrics = await preview.evaluate(root => {
      const button = root.querySelector<HTMLElement>('.phi-date-picker-cell-trigger[data-value="2026-05-20"]')!;
      const nav = root.querySelector<HTMLElement>(".phi-date-picker-nav-trigger")!;
      const rows = root.querySelectorAll(".phi-date-picker-table-body > .phi-date-picker-table-row");
      const buttonBox = button.getBoundingClientRect();
      const cellBox = button.closest("td")!.getBoundingClientRect();
      return {
        buttonWidth: buttonBox.width,
        buttonHeight: buttonBox.height,
        cellWidth: cellBox.width,
        sideSpace: buttonBox.left - cellBox.left,
        navWidth: nav.getBoundingClientRect().width,
        navHeight: nav.getBoundingClientRect().height,
        weekGap: rows[1].getBoundingClientRect().top - rows[0].getBoundingClientRect().bottom,
        font: getComputedStyle(button).fontSize,
      };
    });
    expect(metrics).toEqual({ buttonWidth: 32, buttonHeight: 32, cellWidth: 36, sideSpace: 2, navWidth: 32, navHeight: 32, weekGap: 8, font: "14px" });
    // Enter the day grid through the keyboard so all engines use focus-visible.
    await preview.getByRole("button", { name: "Next month", exact: true }).focus();
    await page.keyboard.press("Tab");
    await expect(day(preview, "2026-05-01")).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(day(preview, "2026-05-02")).toBeFocused();
    await expect(day(preview, "2026-05-02")).toHaveCSS("outline-style", "solid");
    await expect(day(preview, "2026-05-02")).toHaveCSS("outline-width", "2px");
    // July has five weeks and August has six: captions and grids must still align.
    const root = demo(page);
    await root.getByRole("button", { name: "Previous month", exact: true }).click();
    const months = await root.locator(".phi-date-picker-month").evaluateAll(elements => elements.map(element => ({
      title: element.querySelector(".phi-date-picker-month-title")!.textContent,
      titleHeight: element.querySelector(".phi-date-picker-month-title")!.getBoundingClientRect().height,
      gridTop: element.querySelector(".phi-date-picker-table")!.getBoundingClientRect().top,
      weeks: element.querySelectorAll(".phi-date-picker-table-body > tr").length,
    })));
    expect(months.map(month => month.title)).toEqual(["July 2026", "August 2026"]);
    expect(months.map(month => month.weeks)).toEqual([5, 6]);
    expect(months.map(month => month.titleHeight)).toEqual([32, 32]);
    expect(months[0].gridTop).toBe(months[1].gridTop);
  });

  test("keeps selected today and range endpoints in contrast colors on hover in both themes", async ({ page }) => {
    const preview = page.locator("#preview");
    const range = page.locator(".date-picker-demo--range");
    const selectedToday = day(preview, "2026-05-20");
    await expect(selectedToday).toHaveAttribute("data-today", "");
    for (const mode of ["light", "dark"]) {
      await expect(page.locator("html")).toHaveAttribute("data-mode", mode);
      for (const button of [selectedToday, day(range, "2026-05-12"), day(range, "2026-05-16")]) {
        await page.mouse.move(0, 0);
        const background = await tokenColor(button, "--phi-contrast");
        const color = await tokenColor(button, "--phi-inverse");
        await expect(button).toHaveCSS("background-color", background);
        await expect(button).toHaveCSS("color", color);
        await button.hover();
        await expect(button).toHaveCSS("background-color", background);
        await expect(button).toHaveCSS("color", color);
      }
      const unavailable = day(page.locator(".date-picker-demo--disabled-dates"), "2026-06-05");
      await expect(unavailable).toHaveCSS("color", await tokenColor(unavailable, "--phi-inactive"));
      await expect(unavailable).toHaveCSS("opacity", "1");
      const outside = day(preview, "2026-04-30");
      await expect(outside).toHaveCSS("color", await tokenColor(outside, "--phi-inactive"));
      if (mode === "light") await page.getByRole("button", { name: "Toggle theme", exact: true }).first().click();
    }
  });

  test("joins range cells and rounds week wraps after a week-number column", async ({ page }) => {
    const root = demo(page);
    await root.getByRole("button", { name: "Toggle week numbers", exact: true }).click();
    await expect(root.locator(".phi-date-picker-week-number-cell").first()).toHaveText("36");
    await day(root, "2026-09-19").click();
    await day(root, "2026-09-22").click();
    await page.mouse.move(0, 0);
    await expect(root.getByLabel("Selected dates")).toHaveText("2026-09-19 to 2026-09-22");
    expect(await band(cell(root, "2026-09-19"))).toMatchObject({ start: "18px", end: "0px", width: "18px" });
    expect(await band(cell(root, "2026-09-20"))).toMatchObject({ start: "0px", end: "0px", width: "36px", endRadius: "6px" });
    expect(await band(cell(root, "2026-09-21"))).toMatchObject({ start: "0px", end: "0px", width: "36px", startRadius: "6px" });
    expect(await band(cell(root, "2026-09-22"))).toMatchObject({ start: "0px", end: "18px", width: "18px" });
    await expect(day(root, "2026-09-21")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    expect((await band(cell(root, "2026-09-21"))).background).toBe(await tokenColor(root, "--phi-fill"));
    await expect(day(root, "2026-09-19")).toHaveCSS("border-start-end-radius", "0px");
    await expect(day(root, "2026-09-22")).toHaveCSS("border-start-start-radius", "0px");
    // Endpoints at week edges retain all four corners and need no band.
    await day(root, "2026-09-20").click();
    await day(root, "2026-09-21").click();
    await page.mouse.move(0, 0);
    for (const value of ["2026-09-20", "2026-09-21"]) {
      expect((await band(cell(root, value))).content).toBe("none");
      await expect(day(root, value)).toHaveCSS("border-radius", "6px");
    }
  });

  test("keeps one-day ranges round and reverses band edges, navigation, and keys in RTL", async ({ page }) => {
    const root = demo(page);
    await root.getByRole("button", { name: "Select one-day range", exact: true }).click();
    await expect(day(root, "2026-09-29")).toHaveCSS("border-radius", "6px");
    expect((await band(cell(root, "2026-09-29"))).width).toBe("0px");
    await root.getByRole("button", { name: "Toggle right-to-left", exact: true }).click();
    await expect(root.locator(".phi-date-picker-table").first()).toHaveAttribute("dir", "rtl");
    await day(root, "2026-09-22").click();
    await day(root, "2026-09-24").click();
    await page.mouse.move(0, 0);
    await expect(day(root, "2026-09-22")).toHaveCSS("border-top-left-radius", "0px");
    await expect(day(root, "2026-09-24")).toHaveCSS("border-top-right-radius", "0px");
    const startBand = await cell(root, "2026-09-22").evaluate(element => ({ left: getComputedStyle(element, "::before").left, right: getComputedStyle(element, "::before").right }));
    expect(startBand).toEqual({ left: "0px", right: "18px" });
    const placement = await root.evaluate(element => {
      const nav = element.querySelector(".phi-date-picker-nav")!.getBoundingClientRect();
      const months = element.querySelector(".phi-date-picker-months")!.getBoundingClientRect();
      return nav.left - months.left;
    });
    expect(placement).toBe(2);
    await day(root, "2026-09-24").focus();
    await page.keyboard.press("ArrowLeft");
    await expect(day(root, "2026-09-25")).toBeFocused();
    await root.getByRole("button", { name: "Next month", exact: true }).click();
    // A two-month view advances by two months.
    await expect(root.locator(".phi-date-picker-month-title").first()).toContainText("نوفمبر");
  });

  test("styles month/year selects and removes popup motion when reduced motion is requested", async ({ page }) => {
    const root = demo(page);
    await root.getByRole("button", { name: "Toggle month and year controls", exact: true }).click();
    const month = root.getByLabel("Calendar month", { exact: true });
    const year = root.getByLabel("Calendar year", { exact: true });
    // Choose a month beyond the current September–October view.
    await month.selectOption("11");
    await expect(root.locator(".phi-date-picker-month-title").first()).toHaveText("November 2026");
    await year.selectOption("2027");
    await expect(root.locator(".phi-date-picker-month-title").first()).toHaveText("November 2027");
    await month.focus();
    await page.keyboard.press("Tab");
    await expect(year).toBeFocused();
    await expect(year).not.toHaveCSS("box-shadow", "none");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.locator(".date-picker-demo--popup .date-picker-demo__popover-trigger").click();
    const popup = page.locator(".phi-date-picker-content:not([hidden])");
    await expect(popup).toBeVisible();
    await expect(popup).toHaveCSS("animation-name", "none");
    await page.keyboard.press("Escape");
    await expect(popup).toHaveCount(0);
  });
});
