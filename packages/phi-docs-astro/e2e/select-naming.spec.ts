import { expect, test } from "@playwright/test";

for (const kind of ["standard", "custom"]) {
  test(`${kind} Select respects explicit names and restores rich, text, and hidden labels`, async ({ page }) => {
    await page.goto("/docs/components/select");
    const demo = page.locator(".select-naming-demo");
    const example = page.locator(`[data-select-naming='${kind}']`);
    const trigger = example.getByRole("combobox");
    await expect(trigger).toHaveAccessibleName("Region");

    for (const labelMode of ["rich", "text", "hidden", "none"]) {
      await demo.getByLabel("Label content").selectOption(labelMode);
      await demo.getByLabel("Name source").selectOption("direct");
      await expect(trigger).toHaveAccessibleName("Target region");
      await expect(trigger).not.toHaveAttribute("aria-labelledby");
      await demo.getByLabel("Name source").selectOption("both");
      await expect(trigger).toHaveAccessibleName("Deployment region");
      await expect(trigger).toHaveAttribute("aria-labelledby", `select-naming-${kind}-external`);
      await demo.getByLabel("Name source").selectOption("external");
      await expect(trigger).toHaveAccessibleName("Deployment region");
      await expect(trigger).not.toHaveAttribute("aria-label");
      await demo.getByLabel("Name source").selectOption("label");
      await expect(trigger).toHaveAccessibleName(labelMode === "none" ? "Choose a region" : "Region");
    }
  });

  test(`${kind} Select label clicks and keyboard selection retain the field name`, async ({ page }) => {
    await page.goto("/docs/components/select");
    const example = page.locator(`[data-select-naming='${kind}']`);
    const trigger = example.getByRole("combobox", { name: "Region", exact: true });
    await example.locator(".phi-select-label").click();
    await expect(trigger).toBeFocused();
    await trigger.press("ArrowDown");
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    await page.keyboard.press("Home");
    await page.keyboard.press("Enter");
    await expect(trigger).toContainText("East");
    await expect(trigger).toHaveAccessibleName("Region");
    await expect(trigger).toBeFocused();
  });

  test(`${kind} Select keeps its placeholder fallback name after selection`, async ({ page }) => {
    await page.goto("/docs/components/select");
    await page.locator(".select-naming-demo").getByLabel("Label content").selectOption("none");
    const example = page.locator(`[data-select-naming='${kind}']`);
    const trigger = example.getByRole("combobox", { name: "Choose a region", exact: true });
    await trigger.click();
    await page.getByRole("listbox").getByRole("option", { name: "West", exact: true }).click();
    await expect(trigger).toContainText("West");
    await expect(trigger).toHaveAccessibleName("Choose a region");
    await page.locator(".select-naming-demo").getByLabel("Label content").selectOption("rich");
    await expect(example.getByRole("combobox")).toHaveAccessibleName("Region");
    await expect(example.getByRole("combobox")).not.toHaveAttribute("aria-label");
  });
}
