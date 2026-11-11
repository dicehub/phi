import { expect, test } from "@playwright/test";

for (const dir of ["ltr", "rtl"]) {
  test(`DatePicker isolates weekday headers from host table styles in ${dir}`, async ({ page }) => {
    await page.goto("/docs/components/date-picker");
    const preview = page.locator(".date-picker-outside-demo");
    const header = preview.locator(".phi-date-picker-table-head").first();
    await expect(header).toBeVisible();
    if (dir === "rtl") await preview.getByRole("button", { name: "Toggle right-to-left", exact: true }).click();
    await expect(preview.locator(".phi-date-picker-table").first()).toHaveAttribute("dir", dir);
    await page.addStyleTag({ content: "table thead { background: rgb(12, 34, 56); }" });
    await page.evaluate(() => {
      const table = document.createElement("table");
      table.id = "host-table-probe";
      table.createTHead().insertRow().appendChild(document.createElement("th")).textContent = "Host header";
      document.body.append(table);
    });

    for (const mode of ["light", "dark"]) {
      await page.locator("html").evaluate((element, value) => { element.setAttribute("data-mode", value); }, mode);
      await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await expect(page.locator("#host-table-probe thead")).toHaveCSS("background-color", "rgb(12, 34, 56)");
      await expect(header.locator("th")).toHaveCount(7);
      await expect(header.locator("th").first()).not.toHaveText("");
    }

    // Host table styling must leave selection and month navigation usable.
    const day = preview.locator('.phi-date-picker-cell-trigger[data-value="2026-09-21"]').first();
    await day.click();
    await expect(day).toHaveAttribute("data-selected", "");
    await day.focus();
    await page.keyboard.press("ArrowDown");
    await expect(preview.locator('.phi-date-picker-cell-trigger[data-value="2026-09-28"]').first()).toBeFocused();
    await preview.getByRole("button", { name: "Next month", exact: true }).click();
    await expect(preview.locator('.phi-date-picker-cell-trigger[data-value="2026-11-01"]:not([data-outside-range])')).toBeVisible();
    await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

    // Explicit consumer overrides still win over the component default.
    await header.evaluate(element => { element.style.background = "rgb(20, 40, 60)"; });
    await expect(header).toHaveCSS("background-color", "rgb(20, 40, 60)");
  });
}
