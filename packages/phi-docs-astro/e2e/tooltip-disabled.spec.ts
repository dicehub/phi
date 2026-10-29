import { expect, test } from "@playwright/test";

test("disabled internal tooltip triggers leave the tab order and return when enabled", async ({ page }) => {
  await page.goto("/docs/components/tooltip");
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  const demo = page.locator("[data-tooltip-disabled-demo]");
  await demo.scrollIntoViewIfNeeded();
  const trigger = demo.getByRole("button", { name: "Variable name", exact: true });
  await expect(trigger).toHaveAttribute("tabindex", "-1");
  await demo.getByRole("button", { name: "Before", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(demo.getByRole("button", { name: "After", exact: true })).toBeFocused();
  await trigger.hover();
  await expect(page.getByRole("tooltip")).toHaveCount(0);

  await page.mouse.move(4, 4);
  await demo.getByLabel("Disable tooltip").uncheck();
  await expect(trigger).not.toHaveAttribute("tabindex", "-1");
  await demo.getByRole("button", { name: "Before", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("tooltip")).toHaveText("Full variable name");

  await demo.getByLabel("Disable tooltip").check();
  await expect(trigger).toHaveAttribute("tabindex", "-1");
  await demo.getByRole("button", { name: "Before", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(demo.getByRole("button", { name: "After", exact: true })).toBeFocused();
});

test("disabled as-child tooltips preserve custom trigger tab order", async ({ page }) => {
  await page.goto("/docs/components/tooltip");
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  const demo = page.locator("[data-tooltip-disabled-demo]");
  await demo.scrollIntoViewIfNeeded();
  const save = demo.getByRole("button", { name: "Save", exact: true });
  const excluded = demo.getByRole("button", { name: "Custom excluded", exact: true });
  await expect(excluded).toHaveAttribute("tabindex", "-1");
  await demo.getByRole("button", { name: "Before custom", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(save).toBeFocused();
  await expect(save).not.toHaveAttribute("tabindex", "-1");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await page.keyboard.press("Tab");
  await expect(demo.getByRole("button", { name: "After custom", exact: true })).toBeFocused();
});
