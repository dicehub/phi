import { expect, type Locator, type Page, test } from "@playwright/test";

const example = (page: Page, id: string) => page.locator(`#${id}`).locator(
  "xpath=following-sibling::div[contains(@class, 'docs-component-example')][1]",
);

const bounds = async (locator: Locator) => {
  const box = await locator.boundingBox();
  if (!box) throw new Error("Expected a visible card");
  return box;
};

const token = (locator: Locator, name: string) => locator.evaluate((element, name) => {
  const probe = document.createElement("span");
  probe.style.backgroundColor = `var(${name})`;
  element.append(probe);
  const color = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return color;
}, name);

for (const kind of ["radio", "checkbox"] as const) {
  const verticalId = kind === "radio" ? "radio-card" : "checkbox-card";
  const horizontalId = `${verticalId}-horizontal`;
  const itemSelector = `.phi-${kind}--appearance-card`;

  test(`${kind} cards share an outline and preserve keyboard selection and hover states`, async ({ page }) => {
    await page.goto(`/docs/components/${kind}`);
    const demo = example(page, verticalId);
    const group = demo.locator("fieldset");
    const items = demo.locator(itemSelector);
    const container = demo.locator(`.phi-${kind}-group__items`);
    const selected = items.first();
    const next = items.nth(1);
    const selectedControl = selected.getByRole(kind);
    const nextControl = next.getByRole(kind);

    await expect(selectedControl).toBeChecked();
    await expect(container).toHaveCSS("gap", "0px");
    await expect(container).toHaveCSS("border-radius", "8px");
    await expect(container).not.toHaveCSS("box-shadow", "none");
    await expect(group).toHaveCSS("gap", "8px");
    await expect(container).toHaveCSS("margin-top", "8px");
    await expect(selected).toHaveCSS("border-radius", "0px");
    await expect(selected).toHaveCSS("border-bottom-width", "1px");
    await expect(selected).toHaveCSS("border-bottom-color", await token(selected, "--phi-line"));
    await expect(items.last()).toHaveCSS("border-bottom-width", "0px");
    const firstBox = await bounds(selected);
    expect((await bounds(next)).y).toBeCloseTo(firstBox.y + firstBox.height, 1);
    expect((await bounds(selected.locator(`.phi-${kind}__control`))).x)
      .toBeGreaterThan((await bounds(selected.locator(`.phi-${kind}__label`))).x);

    const tint = await token(selected, "--phi-tint");
    const hover = await token(next, "--phi-elevated");
    await selected.hover();
    await expect(selected).toHaveCSS("background-color", tint);
    await next.hover();
    await expect(next).toHaveCSS("background-color", hover);
    expect(hover).not.toBe(tint);

    await nextControl.focus();
    await page.keyboard.press("Space");
    await expect(nextControl).toBeChecked();
    await expect(next).toHaveCSS("background-color", tint);
    if (kind === "radio") {
      await expect(selectedControl).not.toBeChecked();
      await page.keyboard.press("ArrowDown");
      await expect(items.nth(2).getByRole(kind)).toBeChecked();
    } else {
      await expect(selectedControl).toBeChecked();
      await page.keyboard.press("Space");
      await expect(nextControl).not.toBeChecked();
    }
  });

  test(`${kind} horizontal cards have correct desktop and mobile dividers`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto(`/docs/components/${kind}`);
    const demo = example(page, horizontalId);
    const items = demo.locator(itemSelector);
    const container = demo.locator(`.phi-${kind}-group__items`);
    await expect(items).toHaveCount(kind === "radio" ? 4 : 3);
    await expect(items.first()).toHaveCSS("border-right-width", "1px");
    await expect(items.nth(1)).toHaveCSS("border-right-width", "0px");
    await expect(items.last()).toHaveCSS("border-right-width", "0px");
    await expect(items.last()).toHaveCSS("border-bottom-width", "0px");
    await expect(items.nth(1)).toHaveCSS("border-bottom-width", "1px");
    if (kind === "radio") await expect(items.nth(2)).toHaveCSS("border-bottom-width", "0px");
    const first = await bounds(items.first());
    expect((await bounds(items.nth(1))).y).toBe(first.y);
    expect((await bounds(items.nth(1))).x).toBeCloseTo(first.x + first.width, 1);
    expect(first.width * 2).toBeCloseTo((await bounds(container)).width, 1);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(items.first()).toHaveCSS("border-right-width", "0px");
    const mobileFirst = await bounds(items.first());
    expect((await bounds(items.nth(1))).y).toBeCloseTo(mobileFirst.y + mobileFirst.height, 1);
    expect(mobileFirst.width).toBeCloseTo((await bounds(container)).width, 1);
    await expect(items.nth(kind === "radio" ? 2 : 1)).toHaveCSS("border-bottom-width", "1px");
    await expect(items.last()).toHaveCSS("border-bottom-width", "0px");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });

  test(`${kind} card dividers ignore a hidden composable legend`, async ({ page }) => {
    await page.goto(`/docs/components/${kind}`);
    const demo = example(page, "visually-hidden-legend");
    const items = demo.locator(itemSelector);
    await expect(demo.locator("legend")).toHaveClass(/phi-sr-only/);
    await expect(demo.locator("fieldset > legend")).toHaveCount(1);
    await expect(demo.locator(`.phi-${kind}-group__items legend`)).toHaveCount(0);
    await expect(items.first()).toHaveCSS("border-right-width", "1px");
    await expect(items.nth(1)).toHaveCSS("border-right-width", "0px");
    await expect(items.first()).toHaveCSS("border-bottom-width", kind === "radio" ? "0px" : "1px");
    await expect(items.last()).toHaveCSS("border-right-width", "0px");
    await expect(items.last()).toHaveCSS("border-bottom-width", "0px");
    const first = await bounds(items.first());
    expect((await bounds(items.nth(1))).y).toBe(first.y);
    expect((await bounds(items.nth(1))).x).toBeCloseTo(first.x + first.width, 1);
  });

  test(`${kind} custom legends stay outside cards and default items keep focus space`, async ({ page }) => {
    await page.goto(`/docs/components/${kind}`);
    const demo = example(page, "custom-legend-styling");
    const group = demo.locator(`.phi-${kind}-group--card`);
    const defaultGroup = demo.locator(`.phi-${kind}-group--default`);
    const defaultLegendBox = await bounds(defaultGroup.locator("legend"));
    expect((await bounds(defaultGroup.locator(`.phi-${kind}-group__items`))).y - defaultLegendBox.y - defaultLegendBox.height)
      .toBeCloseTo(8, 1);
    const legend = group.locator("legend");
    const container = group.locator(`.phi-${kind}-group__items`);
    const item = group.locator(`.phi-${kind}-item[data-appearance="default"]`);
    const input = item.getByRole(kind);
    await expect(legend).toHaveCount(1);
    await expect(container.locator("legend")).toHaveCount(0);
    const legendBox = await bounds(legend);
    expect((await bounds(container)).y - legendBox.y - legendBox.height).toBeCloseTo(8, 1);
    await expect(item).toHaveCSS("padding", "12px");
    await input.focus();
    const control = item.locator(`.phi-${kind}__control`);
    await expect(input).toBeFocused();
    await expect(control).not.toHaveCSS("box-shadow", "none");
    // Read both rectangles in one frame; focusing can scroll the page between tool calls.
    const clearance = await container.evaluate((element, kind) => {
      const control = element.querySelector(`.phi-${kind}-item[data-appearance="default"] .phi-${kind}__control`)!;
      const outer = element.getBoundingClientRect();
      const inner = control.getBoundingClientRect();
      return [inner.left - outer.left, inner.top - outer.top, outer.right - inner.right, outer.bottom - inner.bottom];
    }, kind);
    for (const gap of clearance) expect(gap).toBeGreaterThanOrEqual(4);
    await page.keyboard.press("Space");
    await expect(input).toBeChecked();
  });
}

test("Checkbox card descriptions, control order, disabled state, and standalone border", async ({ page }) => {
  await page.goto("/docs/components/checkbox");
  const demo = example(page, "checkbox-card-control-first");
  const items = demo.locator(".phi-checkbox-item");
  await expect(items.first().locator(".phi-checkbox__description")).toHaveText("Receive email updates.");
  expect((await bounds(items.first().locator(".phi-checkbox__control"))).x)
    .toBeLessThan((await bounds(items.first().locator(".phi-checkbox__label"))).x);
  await expect(items.last().getByRole("checkbox")).toBeDisabled();
  // Send a real pointer click without waiting for a disabled label to become enabled.
  await items.last().click({ force: true });
  await expect(items.last().getByRole("checkbox")).not.toBeChecked();
  const standalone = example(page, "standalone-checkbox-card").locator(".phi-checkbox-item");
  await expect(standalone).toHaveCSS("border-radius", "8px");
  await expect(standalone).toHaveCSS("border-top-width", "1px");
  await expect(standalone.getByRole("checkbox")).toBeChecked();
  await standalone.click();
  await expect(standalone.getByRole("checkbox")).not.toBeChecked();
});
