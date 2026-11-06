import { expect, type Locator, type Page, test } from "@playwright/test";

const viewports = [
  { width: 390, height: 600, top: 32 },
  { width: 800, height: 400, top: 64 },
];

async function loadDialogDocs(page: Page) {
  await page.goto("/docs/components/dialog");
  // Keep host-page navigation out of the scroll-lock check. Trigger clicks
  // scroll into view directly, with no pending smooth hash scroll.
  await page.addStyleTag({ content: "html { scroll-behavior: auto; }" });
}

async function finishMotion(dialog: Locator) {
  await dialog.evaluate(async (element) => {
    await Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => undefined)));
  });
}

async function wheelToBottom(page: Page, dialog: Locator) {
  await dialog.hover();
  const initialScroll = await dialog.evaluate((element) => element.scrollTop);
  await page.mouse.wheel(0, 2000);
  await expect.poll(() => dialog.evaluate((element) => element.scrollTop)).toBeGreaterThan(initialScroll);
  // Firefox caps the distance of one wheel event. Keep using real wheel input
  // until the panel reaches its end, within the same bounded wait on each engine.
  await expect.poll(async () => {
    const remaining = await dialog.evaluate((element) => element.scrollHeight - element.clientHeight - element.scrollTop);
    if (remaining > 1) await page.mouse.wheel(0, 2000);
    return dialog.evaluate((element) => element.scrollHeight - element.clientHeight - element.scrollTop);
  }, { timeout: 8000, intervals: [100, 200, 300] }).toBeLessThanOrEqual(1);
}

async function panelMetrics(dialog: Locator) {
  return dialog.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      top: box.top,
      bottom: box.bottom,
      left: box.left,
      right: box.right,
      height: box.height,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      overflowX: style.overflowX,
      overflowY: style.overflowY,
      overscrollY: style.overscrollBehaviorY,
    };
  });
}

test("a padded dialog stays within the viewport without a host box-sizing reset", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 360 });
  await loadDialogDocs(page);
  // Remove the docs reset from the modal subtree without overriding component styles.
  await page.addStyleTag({ content: ":where(.phi-dialog-positioner, .phi-dialog-positioner *) { box-sizing: content-box; }" });
  await page.getByRole("button", { name: "Long dialog", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Long dialog", exact: true });
  await expect(dialog).toBeVisible();
  await finishMotion(dialog);
  const metrics = await panelMetrics(dialog);
  expect(metrics.top).toBe(32);
  expect(metrics.bottom).toBeLessThanOrEqual(345);
  expect(metrics.left).toBeGreaterThanOrEqual(15);
  expect(metrics.right).toBeLessThanOrEqual(375);
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
});

for (const viewport of viewports) {
  for (const example of [
    { label: "Long dialog", role: "dialog" },
    { label: "Long alert", role: "alertdialog" },
  ] as const) {
    test(`${example.label} scrolls to its final action at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await loadDialogDocs(page);
      const trigger = page.getByRole("button", { name: example.label, exact: true });
      await trigger.click();
      const dialog = page.getByRole(example.role, { name: example.label, exact: true });
      await expect(dialog).toBeVisible();
      await finishMotion(dialog);

      const metrics = await panelMetrics(dialog);
      expect(metrics.top).toBe(viewport.top);
      expect(metrics.bottom).toBeLessThanOrEqual(viewport.height - 15);
      expect(metrics.left).toBeGreaterThanOrEqual(15);
      expect(metrics.right).toBeLessThanOrEqual(viewport.width - 15);
      expect(metrics.scrollHeight).toBeGreaterThan(900);
      expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
      expect(metrics.overflowX).toBe("hidden");
      expect(metrics.overflowY).toBe("auto");
      expect(metrics.overscrollY).toBe("contain");

      const documentScroll = await page.evaluate(() => window.scrollY);
      await wheelToBottom(page, dialog);
      const save = dialog.getByRole("button", { name: "Save settings" });
      await expect.poll(async () => (await save.boundingBox())?.y ?? Infinity).toBeLessThan(viewport.height - 36);
      await expect(save).toBeInViewport({ ratio: 1 });
      expect(Math.abs(await page.evaluate(() => window.scrollY) - documentScroll)).toBeLessThanOrEqual(1);
      await save.click();
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  }

  test(`LayerCard sections keep their height at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await loadDialogDocs(page);
    const trigger = page.getByRole("button", { name: "Layered dialog", exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Layered dialog", exact: true });
    await expect(dialog).toBeVisible();
    await finishMotion(dialog);

    expect((await panelMetrics(dialog)).bottom).toBeLessThanOrEqual(viewport.height - 15);
    const primary = dialog.locator(".phi-layer-card__primary");
    expect((await primary.boundingBox())?.height).toBeGreaterThan(900);
    expect((await panelMetrics(dialog)).scrollHeight).toBeGreaterThan(900);

    await wheelToBottom(page, dialog);
    const save = dialog.getByRole("button", { name: "Save settings" });
    await expect(save).toBeInViewport({ ratio: 1 });
    await save.click();
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test(`a short dialog adjusts to a smaller viewport at width ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: 700 });
    await loadDialogDocs(page);
    const trigger = page.getByRole("button", { name: "Resize dialog", exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Resize dialog", exact: true });
    await expect(dialog).toBeVisible();
    await finishMotion(dialog);
    const original = await panelMetrics(dialog);
    expect(original.top).toBe(viewport.top);
    expect(original.height).toBeLessThan(500);
    expect(original.scrollHeight).toBe(original.clientHeight);
    await expect(dialog.getByRole("button", { name: "Close", exact: true })).toBeFocused();

    await page.setViewportSize({ width: viewport.width, height: 300 });
    await expect.poll(async () => (await panelMetrics(dialog)).bottom).toBeLessThanOrEqual(285);
    const resized = await panelMetrics(dialog);
    expect(resized.top).toBe(viewport.top);
    expect(resized.scrollHeight).toBeGreaterThan(resized.clientHeight);
    await page.keyboard.press("Tab");
    const save = dialog.getByRole("button", { name: "Save settings" });
    await expect(save).toBeFocused();
    await expect(save).toBeInViewport({ ratio: 1 });
    await page.keyboard.press("Enter");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
}
