import { expect, test } from "@playwright/test";

for (const name of ["Field", "Input", "InputArea", "TagInput"]) {
  test(`${name} updates empty labels, optional indicators, and tooltips`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => { if (message.type() === "warning") errors.push(message.text()); });
    await page.goto("/docs/components/field");
    const demo = page.locator("[data-field-label-content]");
    const control = demo.locator(`[data-label-case="${name}"]`);
    await expect(control.getByRole("textbox", { name: `${name} control`, exact: true })).toBeVisible();
    await expect(control.locator("label")).toHaveCount(0);
    await expect(control).toContainText(`${name} help`);
    for (let i = 0; i < 2; i++) {
      await demo.getByLabel("Show label text", { exact: true }).check();
      await expect(control.locator("label")).toHaveText(`${name} label`);
      await expect(control.getByRole("textbox")).toHaveAccessibleName(name === "Field" ? "Field control" : `${name} label`);
      await demo.getByLabel("Show label text", { exact: true }).uncheck();
      await expect(control.locator("label")).toHaveCount(0);
      await expect(control.getByRole("textbox")).toHaveAccessibleName(`${name} control`);
    }
    await demo.getByLabel("Show optional indicator").check();
    await expect(control.locator("label")).toContainText("(optional)");
    await expect(control.getByRole("textbox")).toHaveAccessibleName(`${name} control`);
    await demo.getByLabel("Show optional indicator").uncheck();
    await expect(control.locator("label")).toHaveCount(0);
    await demo.getByLabel("Show label tooltip").check();
    await expect(control.locator("label [data-tooltip]")).toBeVisible();
    await expect(control.getByRole("textbox")).toHaveAccessibleName(`${name} control`);
    if (name === "Field") {
      await demo.getByLabel("Hide Field label").check();
      await expect(control.locator("label")).toHaveCount(0);
      await expect(control.getByRole("textbox")).toHaveAccessibleName("Field control");
    }
    expect(errors.filter((message) => message.includes("invoked outside of the render function"))).toEqual([]);
  });
}

for (const name of ["Input", "InputArea"]) {
  test(`${name} preserves the control and draft when conditional labels change`, async ({ page }) => {
    await page.goto("/docs/components/field");
    const demo = page.locator("[data-field-label-content]");
    const field = demo.locator(`[data-uncontrolled-case="${name}"]`);
    const input = field.getByRole("textbox");
    await input.fill("Keep this draft");
    await input.evaluate((element) => element.setAttribute("data-original-control", "true"));
    for (const show of [true, false, true]) {
      // Programmatic click leaves focus on the control while the parent rerenders.
      await demo.getByLabel("Show label text", { exact: true }).evaluate((element: HTMLInputElement) => element.click());
      await expect(field.locator("label")).toHaveCount(show ? 1 : 0);
      await expect(input).toHaveAttribute("data-original-control", "true");
      await expect(input).toHaveValue("Keep this draft");
      await expect(input).toBeFocused();
    }
  });
}

test("empty text slots do not expose unused fallback labels", async ({ page }) => {
  await page.goto("/docs/components/field");
  const demo = page.locator("[data-empty-text-labels]");
  await expect(demo.getByRole("textbox")).toHaveCount(4);
  await expect(demo.locator("label")).toHaveCount(0);
  for (const name of ["Field", "Input", "InputArea", "TagInput"]) {
    await expect(demo.getByRole("textbox", { name: `Empty ${name} slot`, exact: true })).toBeVisible();
  }
});
