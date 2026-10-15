import { expect, test } from "@playwright/test";

for (const dir of ["ltr", "rtl"]) {
  test(`Button and LinkButton balance icons and text in ${dir}`, async ({ page }) => {
    await page.goto("/docs/components/button");
    await page.locator("html").evaluate((element, value) => { element.dir = value; }, dir);
    for (const size of ["xs", "sm", "base", "lg"]) {
      const row = page.locator(`[data-alignment-size='${size}']`);
      const text = row.locator("[data-alignment='text']");
      await expect(text).toBeVisible();
      const geometry = await row.evaluate((element) => {
        const result = (name: string) => {
          const button = element.querySelector<HTMLElement>(`[data-alignment='${name}']`)!;
          const rect = button.getBoundingClientRect();
          const label = button.querySelector(".phi-button__label")?.getBoundingClientRect();
          const icon = button.querySelector(".phi-button__icon")?.getBoundingClientRect();
          const style = getComputedStyle(button);
          return {
            height: rect.height,
            padding: parseFloat(style.paddingInlineStart),
            labelOffset: label ? label.y + label.height / 2 - (rect.y + rect.height / 2) : null,
            iconOffset: icon ? icon.y + icon.height / 2 - (rect.y + rect.height / 2) : null,
          };
        };
        return Object.fromEntries(["text", "icon", "link-text", "link-icon", "square"].map((name) => [name, result(name)]));
      });
      const lift = ["xs", "sm"].includes(size) ? -0.5 : -1;
      for (const name of ["text", "icon", "link-text", "link-icon"]) {
        expect(geometry[name].labelOffset).toBeCloseTo(lift, 1);
        expect(geometry[name].height).toBe(geometry.text.height);
      }
      expect(geometry.icon.padding).toBe(geometry.text.padding - 2);
      expect(geometry["link-icon"].padding).toBe(geometry["link-text"].padding - 2);
      expect(geometry.icon.iconOffset).toBeCloseTo(0, 1);
      expect(geometry["link-icon"].iconOffset).toBeCloseTo(0, 1);
      expect(geometry.square.iconOffset).toBeCloseTo(0, 1);
      expect(geometry.square.padding).toBe(0);
    }
  });
}

test("Button and LinkButton remove optical text spacing for empty conditional slots", async ({ page }) => {
  await page.goto("/docs/components/button");
  const controls = page.locator("[data-alignment='conditional'], [data-alignment='conditional-link']");
  await expect(controls.first()).toContainText("Align");
  await page.getByRole("button", { name: "Toggle alignment labels" }).click();
  for (const control of await controls.all()) {
    await expect(control).not.toContainText("Align");
    await expect(control).toHaveCSS("padding-inline-start", "12px");
    await expect(control.locator(".phi-button__label")).toHaveCount(0);
  }
  await page.getByRole("button", { name: "Toggle alignment labels" }).click();
  for (const control of await controls.all()) {
    await expect(control).toContainText("Align");
    await expect(control).toHaveCSS("padding-inline-start", "10px");
  }
});
