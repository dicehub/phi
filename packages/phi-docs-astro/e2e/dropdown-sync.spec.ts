import { expect, type Locator, test } from "@playwright/test";

async function settlePopup(popup: Locator) {
  await expect(popup).toBeVisible();
  await expect.poll(() => popup.evaluate((element) => element.parentElement!.style.getPropertyValue("--x"))).not.toBe("");
  await popup.evaluate(async (element) => { await Promise.all(element.getAnimations().map((animation) => animation.finished)); });
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1080 });
});

for (const mode of ["light", "dark"]) {
  test(`Dropdown uses tint and aligns submenu rows in ${mode}`, async ({ page }) => {
    await page.goto("/docs/components/dropdown");
    await page.locator("html").evaluate((element, value) => { element.dataset.mode = value; }, mode);
    const example = page.locator("#nested-menu-with-radio-selection ~ .docs-component-example").first();
    await example.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
    await example.getByRole("button", { name: "Account" }).click();
    const parent = page.locator('[id="menu:dropdown-nested-menu-with-radio-selection:content"]');
    await settlePopup(parent);
    const trigger = parent.getByRole("menuitem", { name: "Language", exact: true });
    await expect(trigger).toHaveCSS("padding-inline-start", "32px");
    await trigger.hover();
    const child = page.locator('[id="menu:dropdown-nested-menu-with-radio-selection-language:content"]');
    await settlePopup(child);
    const first = child.getByRole("menuitemradio", { name: "Deutsch" });
    await first.hover();
    const tint = await parent.evaluate((element) => {
      const probe = document.createElement("span");
      probe.style.position = "fixed";
      probe.style.pointerEvents = "none";
      probe.style.backgroundColor = "var(--phi-tint)";
      element.append(probe);
      const color = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return color;
    });
    await expect(first).toHaveCSS("background-color", tint);
    await expect(trigger).toHaveCSS("background-color", tint);
    await expect.poll(async () => {
      const endAligned = (await child.getAttribute("data-placement"))?.endsWith("-end");
      const itemBox = await (endAligned ? child.getByRole("menuitemradio").last() : first).boundingBox();
      const triggerBox = await trigger.boundingBox();
      return Math.abs(endAligned
        ? itemBox!.y + itemBox!.height - triggerBox!.y - triggerBox!.height
        : itemBox!.y - triggerBox!.y);
    }).toBeLessThanOrEqual(1);
    await expect(first).toHaveCSS("padding-inline-start", "8px");
  });
}

test("Dropdown scopes automatic inset to each popup and updates dynamic icons", async ({ page }) => {
  await page.goto("/docs/components/dropdown");
  const example = page.locator("[data-dropdown-alignment]");
  await example.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await example.getByRole("button", { name: "Aligned menu" }).click();
  const parent = page.locator('[id="menu:dropdown-alignment:content"]');
  await settlePopup(parent);
  const plain = parent.getByRole("menuitem", { name: "Plain action", exact: true });
  const label = parent.locator(".phi-dropdown-label");
  await expect(plain).toHaveCSS("padding-inline-start", "32px");
  await expect(label).toHaveCSS("padding-inline-start", "32px");
  await expect(parent.getByRole("menuitem", { name: "Documentation", exact: true }).locator(".phi-dropdown-item__icon > svg")).toHaveCSS("width", "16px");
  await settlePopup(parent);
  const trigger = parent.getByRole("menuitem", { name: "Child actions", exact: true });
  await expect(trigger.locator(".phi-dropdown-item__icon > svg")).toHaveCSS("width", "16px");
  await trigger.hover();
  const child = page.locator('[id="menu:dropdown-alignment-child:content"]');
  await settlePopup(child);
  await expect(child.getByRole("menuitem", { name: "Child plain action" })).toHaveCSS("padding-inline-start", "8px");
  await expect(child.getByRole("menuitem", { name: "Forced inset" })).toHaveCSS("padding-inline-start", "32px");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await example.getByRole("button", { name: "Toggle menu icons" }).click();
  await example.getByRole("button", { name: "Aligned menu" }).click();
  await settlePopup(parent);
  // The other submenu still contains an icon, but must not affect this popup.
  await expect(plain).toHaveCSS("padding-inline-start", "8px");
  await expect(label).toHaveCSS("padding-inline-start", "8px");
  await expect(parent.locator(":scope > .phi-dropdown-group .phi-dropdown-item__icon")).toHaveCount(0);
  await parent.getByRole("menuitem", { name: "Custom offsets", exact: true }).hover();
  const custom = page.locator('[id="menu:dropdown-alignment-custom:content"]');
  await settlePopup(custom);
  await expect(custom.getByRole("menuitem", { name: "Custom plain action" })).toHaveCSS("padding-inline-start", "32px");
  await expect(plain).toHaveCSS("padding-inline-start", "8px");
});

test("Dropdown honors custom submenu offsets and keeps keyboard selection", async ({ page }) => {
  await page.goto("/docs/components/dropdown");
  const example = page.locator("[data-dropdown-alignment]");
  await example.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await example.getByRole("button", { name: "Aligned menu" }).click();
  const parent = page.locator('[id="menu:dropdown-alignment:content"]');
  await settlePopup(parent);
  const trigger = parent.getByRole("menuitem", { name: "Custom offsets", exact: true });
  await page.keyboard.press("End");
  await expect(trigger).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("ArrowRight");
  const child = page.locator('[id="menu:dropdown-alignment-custom:content"]');
  await settlePopup(child);
  await expect(child).toBeFocused();
  await expect.poll(async () => {
    const anchor = await trigger.boundingBox();
    const popup = await child.boundingBox();
    return { gap: Math.round(popup!.x - anchor!.x - anchor!.width), shift: Math.round(popup!.y - anchor!.y) };
  }).toEqual({ gap: 14, shift: 3 });
  await page.keyboard.press("ArrowLeft");
  await expect(child).toBeHidden();
  await expect(trigger).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Escape");
  await expect(parent).toBeHidden();
});

test("Dropdown shares tint across action, link, and checkbox rows", async ({ page }) => {
  await page.goto("/docs/components/dropdown");
  const example = page.locator("[data-dropdown-alignment]");
  await example.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await example.getByRole("button", { name: "Aligned menu" }).click();
  const parent = page.locator('[id="menu:dropdown-alignment:content"]');
  await settlePopup(parent);
  const colors: string[] = [];
  for (const name of ["Profile", "Documentation", "Enabled"]) {
    const row = parent.getByRole(name === "Enabled" ? "menuitemcheckbox" : "menuitem", { name, exact: true });
    await row.hover();
    await expect(row).toHaveAttribute("data-highlighted", "");
    // Finish the background-color transition before comparing rows.
    await expect.poll(() => row.evaluate((element) => element.getAnimations().length)).toBe(0);
    colors.push(await row.evaluate((element) => getComputedStyle(element).backgroundColor));
    await expect(row).toHaveCSS("border-radius", "6px");
  }
  expect(new Set(colors).size).toBe(1);
  const checkbox = parent.getByRole("menuitemcheckbox", { name: "Enabled" });
  await checkbox.click();
  await expect(checkbox).toHaveAttribute("aria-checked", "true");
  await expect(parent.getByRole("menuitem", { name: "Disabled action" })).toHaveAttribute("data-disabled", "");
});

test("Dropdown honors custom portal containers and inherits RTL in submenus", async ({ page }) => {
  await page.goto("/docs/components/dropdown");
  const example = page.locator("[data-dropdown-alignment]");
  await example.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await example.getByRole("button", { name: "Contained RTL menu" }).click();
  const container = page.locator("[data-dropdown-container]");
  const parent = container.locator('[id="menu:dropdown-contained:content"]');
  await settlePopup(parent);
  await page.keyboard.press("End");
  const trigger = parent.getByRole("menuitem", { name: "More settings" });
  await expect(trigger).toHaveAttribute("dir", "rtl");
  await expect(trigger).toHaveCSS("padding-inline-start", "32px");
  await page.keyboard.press("ArrowLeft");
  const child = container.locator('[id="menu:dropdown-contained-child:content"]');
  await settlePopup(child);
  await expect(child).toHaveAttribute("dir", "rtl");
  await expect.poll(async () => {
    const anchor = await trigger.boundingBox();
    const popup = await child.boundingBox();
    return Math.round(anchor!.x - popup!.x - popup!.width);
  }).toBe(2);
  await page.keyboard.press("ArrowRight");
  await expect(child).toBeHidden();
});
