import { expect, test } from "@playwright/test";

for (const scale of [1, 0.75]) {
  test(`scrolls only the owning sidebar viewport at scale ${scale}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/docs/components/sidebar#scrolling-to-items");
    const demo = page.locator(".sidebar-scroll-demo");
    await expect(demo).toBeVisible();
    await demo.evaluate((node, scale) => { node.style.transform = `scale(${scale})`; }, scale);
    await demo.scrollIntoViewIfNeeded();
    const scrollTop = () => demo.locator('[data-sidebar="viewport"]').evaluate((node) => node.scrollTop);
    const documentTop = await page.evaluate(() => window.scrollY);
    const otherScrollTops = await page.locator(".sidebar-demo [data-sidebar='viewport']").evaluateAll((nodes) => nodes.map((node) => node.scrollTop));
    const alignment = (id: string) => demo.locator(`[data-sidebar-item-id='${id}']`).evaluate((node) => {
      const item = node.getBoundingClientRect();
      const viewport = node.closest('[data-sidebar="viewport"]')!.getBoundingClientRect();
      return { top: item.top - viewport.top, center: (item.top + item.bottom - viewport.top - viewport.bottom) / 2, bottom: item.bottom - viewport.bottom };
    });

    await demo.getByRole("button", { name: "Reveal item 24", exact: true }).click();
    await expect.poll(scrollTop).toBeGreaterThan(0);
    await expect.poll(async () => Math.abs((await alignment("item-24")).center)).toBeLessThanOrEqual(1);
    await demo.getByRole("button", { name: "Align item 24", exact: true }).click();
    await expect.poll(async () => Math.abs((await alignment("item-24")).top)).toBeLessThanOrEqual(1);
    const alignedTop = await scrollTop();
    // Explicit center alignment must not move a fully visible item.
    await demo.getByRole("button", { name: "Reveal item 24", exact: true }).click();
    expect(await scrollTop()).toBe(alignedTop);
    await demo.getByRole("button", { name: "Reveal wrapped item" }).click();
    await expect.poll(async () => Math.abs((await alignment("item-12")).center)).toBeLessThanOrEqual(1);
    await demo.getByRole("button", { name: "Reveal first item" }).click();
    await expect.poll(async () => Math.abs((await alignment("item-1")).top)).toBeLessThanOrEqual(1);
    await demo.getByRole("button", { name: "Reveal nested button" }).click();
    await expect.poll(async () => Math.abs((await alignment("item-16")).bottom)).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => window.scrollY)).toBe(documentTop);
    expect(await page.locator(".sidebar-demo [data-sidebar='viewport']").evaluateAll((nodes) => nodes.map((node) => node.scrollTop))).toEqual(otherScrollTops);
  });
}

test("updates item registration after renaming and unmounting", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/sidebar#scrolling-to-items");
  const demo = page.locator(".sidebar-scroll-demo");
  const viewport = demo.locator('[data-sidebar="viewport"]');
  await demo.getByLabel("Rename item 24").check();
  await expect(demo.locator('[data-sidebar-item-id="renamed"]')).toHaveCount(1);
  await demo.getByRole("button", { name: "Reveal item 24", exact: true }).click();
  expect(await viewport.evaluate((node) => node.scrollTop)).toBe(0);
  await demo.getByRole("button", { name: "Reveal renamed item" }).click();
  await expect.poll(() => viewport.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await demo.getByLabel("Show item 24").uncheck();
  await demo.getByRole("button", { name: "Reveal first item" }).click();
  const before = await viewport.evaluate((node) => node.scrollTop);
  await demo.getByRole("button", { name: "Reveal renamed item" }).click();
  expect(await viewport.evaluate((node) => node.scrollTop)).toBe(before);
  await demo.getByLabel("Show item 24").check();
  await demo.getByRole("button", { name: "Reveal renamed item" }).click();
  await expect.poll(() => viewport.evaluate((node) => node.scrollTop)).toBeGreaterThan(before);
});
