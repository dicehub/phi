import { expect, type Locator, type Page, test } from "@playwright/test";

const examples = [
  { id: "plain", label: "Scrollable body" },
  { id: "primary", label: "Scrollable primary section" },
  { id: "secondary", label: "Scrollable secondary section" },
];

async function openExample(page: Page, example: typeof examples[number]) {
  await page.goto("/docs/components/dialog");
  await page.addStyleTag({ content: "html { scroll-behavior: auto; }" });
  const trigger = page.getByRole("button", { name: example.label, exact: true });
  await trigger.click();
  const panel = page.getByRole("dialog", { name: example.label, exact: true });
  await expect(panel).toBeVisible();
  await panel.evaluate(async element => {
    await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => undefined)));
  });
  return { trigger, panel, body: panel.locator("[data-dialog-scroll-body]"), save: panel.getByRole("button", { name: "Save settings" }) };
}

async function checkScrollLayout(panel: Locator, body: Locator, save: Locator) {
  await expect(body).toHaveCSS("flex-shrink", "1");
  expect(await body.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(500);
  const panelBox = (await panel.boundingBox())!;
  const saveBox = (await save.boundingBox())!;
  expect(saveBox.y + saveBox.height).toBeLessThanOrEqual(panelBox.y + panelBox.height);
  expect(await panel.evaluate(element => element.scrollHeight - element.clientHeight)).toBeLessThanOrEqual(1);
}

for (const viewport of [{ width: 390, height: 600 }, { width: 800, height: 400 }]) {
  for (const example of examples) {
    test(`${example.id} Dialog body scrolls with fixed actions at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      const { trigger, panel, body, save } = await openExample(page, example);
      await checkScrollLayout(panel, body, save);
      await expect(save).toBeInViewport({ ratio: 1 });
      const pageScroll = await page.evaluate(() => scrollY);
      const saveTop = (await save.boundingBox())!.y;
      await body.hover();
      await page.mouse.wheel(0, 300);
      await expect.poll(() => body.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
      expect(await panel.evaluate(element => element.scrollTop)).toBe(0);
      expect(Math.abs((await save.boundingBox())!.y - saveTop)).toBeLessThanOrEqual(1);
      expect(Math.abs(await page.evaluate(() => scrollY) - pageScroll)).toBeLessThanOrEqual(1);

      await panel.getByRole("button", { name: "Close", exact: true }).focus();
      await page.keyboard.press("Tab");
      // Firefox includes the scroll container itself in the native Tab order.
      if (await body.evaluate(element => element === document.activeElement)) await page.keyboard.press("Tab");
      const input = body.getByRole("textbox", { name: "Final setting" });
      await expect(input).toBeFocused();
      await expect(input).toBeInViewport({ ratio: 1 });
      await page.keyboard.press("Tab");
      await expect(save).toBeFocused();
      await expect(save).toBeInViewport({ ratio: 1 });
      await page.keyboard.press("Enter");
      await expect(panel).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  }
}

for (const example of examples.filter(example => example.id !== "plain")) {
  test(`${example.id} section accepts a consumer flex class before or after library styles`, async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 400 });
    const { panel, body, save } = await openExample(page, example);
    await body.evaluate(element => {
      element.classList.remove("flex-1");
      element.classList.add("consumer-scroll-body");
    });
    for (const placement of ["before", "after"]) {
      const style = await page.addStyleTag({ content: ".consumer-scroll-body { flex: 1 1 0%; }" });
      if (placement === "before") await style.evaluate(element => document.head.prepend(element));
      await checkScrollLayout(panel, body, save);
      await style.evaluate(element => element.parentNode?.removeChild(element));
    }
  });
}

test("LayerCard sections keep natural heights in a bounded standalone card", async ({ page }) => {
  await page.goto("/docs/components/layer-card");
  const card = page.locator("#preview .phi-layer-card");
  const sections = card.locator(":scope > .phi-layer-card__primary, :scope > .phi-layer-card__secondary");
  await expect(sections).toHaveCount(2);
  await sections.evaluateAll(elements => elements.forEach(element => { (element as HTMLElement).style.minHeight = "0"; }));
  const heights = await sections.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height));
  await card.evaluate(element => { element.style.maxHeight = "70px"; element.style.overflowY = "auto"; });
  expect(await sections.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height))).toEqual(heights);
  expect(await card.evaluate(element => element.scrollHeight)).toBeGreaterThan(70);
  await card.evaluate(element => { element.scrollTop = element.scrollHeight; });
  expect(await card.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
});
