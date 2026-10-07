import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.goto("/docs/components/label"); });

test("translates generated text across fields and updates mounted controls", async ({ page }) => {
  const demo = page.locator(".label-translations-demo");
  const markers = demo.locator(".phi-label__optional, .phi-input-label__optional");
  await expect(markers).toHaveCount(10);
  await expect(demo.locator("[data-example='translated-label'] .phi-label__optional")).toHaveText("(opcional)");
  await expect(markers).toHaveText(["(opcional)", "(custom)", "(custom rich text)", ...Array(7).fill("(opcional)")]);
  await expect(demo.locator("[data-example='translated-label'] button")).toHaveAttribute("aria-label", "Mais informações");
  const phone = demo.getByRole("textbox", { name: "Phone" });
  await phone.fill("123");
  await demo.getByRole("button", { name: "Use English", exact: true }).click();
  await expect(demo.locator("[data-example='translated-label'] .phi-label__optional")).toHaveText("(optional)");
  await expect(markers).toHaveText(["(optional)", "(custom)", "(custom rich text)", ...Array(7).fill("(optional)")]);
  await expect(demo.locator(".phi-input-label__tooltip").first()).toHaveAttribute("aria-label", "More information");
  await expect(phone).toHaveValue("123");
  await demo.getByRole("button", { name: "Use Portuguese", exact: true }).click();
  await expect(demo.locator("[data-example='translated-label'] .phi-label__optional")).toHaveText("(opcional)");
  await expect(page.locator("#preview .phi-label__optional")).toHaveText("(optional)");
});

test("preserves label overrides, rich optional content, and nested defaults", async ({ page }) => {
  const demo = page.locator(".label-translations-demo");
  await expect(demo.locator("[data-example='overrides'] .phi-label__optional")).toHaveText("(custom)");
  await expect(demo.getByRole("button", { name: "Custom help", exact: true })).toBeVisible();
  await expect(demo.locator("[data-example='rich-optional'] .phi-label__optional strong")).toHaveText("(custom rich text)");
  await expect(demo.locator("[data-example='nested'] .phi-label__optional")).toHaveText("(opcional)");
  await expect(demo.getByRole("button", { name: "Nested help", exact: true })).toBeVisible();
  await demo.getByRole("button", { name: "Use English", exact: true }).click();
  await expect(demo.locator("[data-example='overrides'] .phi-label__optional")).toHaveText("(custom)");
  await expect(demo.locator("[data-example='nested'] .phi-label__optional")).toHaveText("(optional)");
});

test("opening checkbox label help does not toggle the checkbox", async ({ page }) => {
  const checkbox = page.locator(".label-translations-demo .phi-checkbox");
  await expect(checkbox.getByRole("checkbox")).not.toBeChecked();
  await checkbox.getByRole("button", { name: "Mais informações", exact: true }).click();
  await expect(checkbox.getByRole("checkbox")).not.toBeChecked();
  await checkbox.locator(".phi-checkbox__label").click({ position: { x: 5, y: 5 } });
  await expect(checkbox.getByRole("checkbox")).toBeChecked();
});
