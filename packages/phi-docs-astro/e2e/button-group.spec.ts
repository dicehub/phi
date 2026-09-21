import { expect, test, type Locator } from "@playwright/test";

const cornerRadii = (locator: Locator) =>
  locator.evaluate((element) => {
    const style = getComputedStyle(element);

    return {
      bottomLeft: style.borderBottomLeftRadius,
      bottomRight: style.borderBottomRightRadius,
      topLeft: style.borderTopLeftRadius,
      topRight: style.borderTopRightRadius,
    };
  });

test("joins two controls into one labelled group with a single seam", async ({ page }) => {
  await page.goto("/docs/components/button-group#preview");

  const group = page.locator("#preview .phi-button-group");
  await expect(group).toHaveAttribute("role", "group");
  await expect(group).toHaveAttribute("aria-label", "Deploy");

  const controls = group.locator("> button");
  await expect(controls).toHaveCount(2);

  const [first, second] = [controls.first(), controls.nth(1)];
  const firstBox = await first.boundingBox();
  const secondBox = await second.boundingBox();
  if (!firstBox || !secondBox) throw new Error("Button group controls have no bounding box");

  expect(secondBox.x).toBe(firstBox.x + firstBox.width - 1);
  expect(await cornerRadii(first)).toEqual({ topLeft: "8px", topRight: "0px", bottomLeft: "8px", bottomRight: "0px" });
  expect(await cornerRadii(second)).toEqual({ topLeft: "0px", topRight: "8px", bottomLeft: "0px", bottomRight: "8px" });
});

test("keeps native tab order and lifts the keyboard-focused control above the seam", async ({ page }) => {
  await page.goto("/docs/components/button-group#preview");

  const controls = page.locator("#preview .phi-button-group > button");
  const [first, second] = [controls.first(), controls.nth(1)];

  await second.click();
  await page.keyboard.press("Shift+Tab");
  await expect(first).toBeFocused();
  await expect(first).toHaveCSS("z-index", "1");

  await page.keyboard.press("Tab");
  await expect(second).toBeFocused();
});

test("keeps the outer corners of a disabled control behind its tooltip wrapper", async ({ page }) => {
  await page.goto("/docs/components/button-group#disabled-with-tooltip");

  const group = page.locator('.button-group-demo[data-variant="disabled-tooltip"] .phi-button-group');
  const wrapper = group.locator("> .phi-button-tooltip-trigger");
  await expect(wrapper).toHaveCount(1);
  await expect(wrapper).toHaveCSS("margin-inline-start", "-1px");

  const button = wrapper.locator(".phi-button");
  await expect(button).toBeDisabled();
  expect(await cornerRadii(button)).toEqual({ topLeft: "0px", topRight: "8px", bottomLeft: "0px", bottomRight: "8px" });
});

test("mirrors the joined corners under right-to-left", async ({ page }) => {
  await page.goto("/docs/components/button-group#right-to-left");

  const group = page.locator('.button-group-demo[data-variant="rtl"] .phi-button-group');
  await expect(group).toHaveAttribute("dir", "rtl");

  const controls = group.locator("> button");
  const [first, second] = [controls.first(), controls.nth(1)];
  const firstBox = await first.boundingBox();
  const secondBox = await second.boundingBox();
  if (!firstBox || !secondBox) throw new Error("Right-to-left controls have no bounding box");

  expect(firstBox.x).toBe(secondBox.x + secondBox.width - 1);
  expect(await cornerRadii(first)).toEqual({ topLeft: "0px", topRight: "8px", bottomLeft: "0px", bottomRight: "8px" });
  expect(await cornerRadii(second)).toEqual({ topLeft: "8px", topRight: "0px", bottomLeft: "8px", bottomRight: "0px" });
});
