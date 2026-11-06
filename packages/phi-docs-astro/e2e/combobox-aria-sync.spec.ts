import { expect, test, type Locator } from "@playwright/test";

async function waitForPopupAnimation(popup: Locator) {
  await expect(popup).toBeVisible();
  await popup.evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished));
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/combobox");
  await expect(page.locator('[data-aria-example="multiple"] .phi-combobox-multi-input')).toBeVisible();
});

test("names the multi-input, combines help text, and keeps container attributes on its wrapper", async ({ page }) => {
  const example = page.locator('[data-aria-example="multiple"]');
  const input = example.getByRole("combobox", { name: "Fruit selection", exact: true });
  await expect(input).toHaveAccessibleDescription("Use the arrow keys to choose a fruit. You can choose more than one fruit.");
  await expect(input).toHaveAttribute("aria-describedby", "combobox-aria-fruits-hint combobox-aria-fruits-description");
  await expect(example.locator(".phi-combobox-multi-control")).toHaveClass(/combobox-aria-demo__multi/);
  await expect(example.locator(".phi-combobox-multi-control")).not.toHaveAttribute("aria-label");
  await expect(input).not.toHaveClass(/combobox-aria-demo__multi/);

  await example.getByRole("button", { name: "Use visible name" }).click();
  await expect(input).toHaveCount(0);
  const namedByElement = example.getByRole("combobox", { name: "Favorite fruits", exact: true });
  await expect(namedByElement).toHaveAttribute("aria-labelledby", "combobox-aria-fruits-label");
  await expect(namedByElement).not.toHaveAttribute("aria-label");
  await example.getByRole("button", { name: "Use direct name" }).click();
  await expect(input).toHaveAttribute("aria-label", "Fruit selection");
  await expect(input).not.toHaveAttribute("aria-labelledby");
});

test("updates multi-input descriptions when field validation changes", async ({ page }) => {
  const example = page.locator('[data-aria-example="multiple"]');
  const input = example.getByRole("combobox", { name: "Fruit selection", exact: true });
  await example.getByRole("button", { name: "Show validation error" }).click();
  await expect(input).toHaveAttribute("aria-describedby", "combobox-aria-fruits-hint combobox-aria-fruits-description combobox-aria-fruits-error");
  await expect(input).toHaveAccessibleDescription("Use the arrow keys to choose a fruit. You can choose more than one fruit. Choose a fruit before you continue.");
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await example.getByRole("button", { name: "Hide validation error" }).click();
  await expect(input).toHaveAttribute("aria-describedby", "combobox-aria-fruits-hint combobox-aria-fruits-description");
  await expect(input).not.toHaveAttribute("aria-invalid");
});

test("keeps the named multi-input usable from the keyboard", async ({ page }) => {
  const example = page.locator('[data-aria-example="multiple"]');
  const input = example.getByRole("combobox", { name: "Fruit selection", exact: true });
  await input.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator('.phi-combobox-content[data-state="open"]')).toBeVisible();
  await page.keyboard.press("Home");
  await page.keyboard.press("Enter");
  await expect(example.locator(".phi-combobox-chip")).toContainText("Apple");
  await expect(input).toBeFocused();
  await expect(input).toHaveAccessibleName("Fruit selection");
  await page.keyboard.press("Escape");
});

test("keeps standard value-trigger names, descriptions, and displayed selection", async ({ page }) => {
  const example = page.locator('[data-aria-example="value"]');
  const trigger = example.getByRole("button", { name: "Delivery fruit", exact: true });
  await expect(trigger).toContainText("Choose a fruit");
  await expect(trigger).toHaveAccessibleDescription("Choose a fruit for the delivery. A delivery contains one fruit.");
  await trigger.click();
  const popup = page.locator('.phi-combobox-content[data-state="open"]');
  await waitForPopupAnimation(popup);
  await popup.getByRole("option", { name: "Banana", exact: true }).click();
  await expect(trigger).toContainText("Banana");
  await expect(trigger).toHaveAccessibleName("Delivery fruit");
  await expect(trigger).toHaveAttribute("aria-describedby", "combobox-aria-value-hint combobox-aria-value-description");
});

test("forwards external names and combined descriptions through a custom value trigger", async ({ page }) => {
  const example = page.locator('[data-aria-example="custom"]');
  const trigger = example.getByRole("button", { name: "Gift fruit", exact: true });
  await expect(trigger).toContainText("Gift: Apple");
  await expect(trigger).toHaveAccessibleDescription("Choose a fruit for the gift. A gift contains one fruit.");
  await expect(trigger).toHaveAttribute("aria-labelledby", "combobox-aria-custom-label");
  await trigger.click();
  const popup = page.locator('.phi-combobox-content[data-state="open"]');
  await waitForPopupAnimation(popup);
  await popup.getByRole("option", { name: "Cherry", exact: true }).click();
  await expect(trigger).toContainText("Gift: Cherry");
  await expect(trigger).toHaveAccessibleName("Gift fruit");
  await expect(trigger).toHaveAttribute("aria-describedby", "combobox-aria-custom-hint combobox-aria-custom-description");
});
