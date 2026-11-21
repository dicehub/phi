import { expect, test } from "@playwright/test";

test("mirrors overflow controls and reveals the selected tab in RTL", async ({ page }) => {
  await page.goto("/docs/components/tabs");
  const demo = page.locator(".tabs-demo__overflow");
  const rtl = demo.getByRole("checkbox", { name: "Right-to-left tabs" });
  const root = demo.locator(".phi-tabs");
  const list = root.getByRole("tablist");
  const start = root.locator("button[data-side='start']");
  const end = root.locator("button[data-side='end']");
  const scrollLeft = () => list.evaluate((element) => element.scrollLeft);

  await expect(end).toHaveAccessibleName("Scroll tabs right");
  await rtl.check();
  await expect(list).toHaveCSS("direction", "rtl");
  await expect(start).toHaveAttribute("aria-hidden", "true");
  await expect(end).toHaveAccessibleName("Scroll tabs left");
  await expect(end).toHaveCSS("left", "0px");
  await expect(end).toHaveCSS("background-image", /linear-gradient\(to right/);
  await expect(end.locator("svg")).toHaveCSS("rotate", "180deg");
  await expect(list).toHaveCSS("mask-image", /linear-gradient\(to left/);

  await end.click();
  await expect.poll(scrollLeft).toBeLessThan(-100);
  await expect(start).toHaveAccessibleName("Scroll tabs right");
  await expect(start).toHaveCSS("right", "0px");
  await start.click();
  await expect.poll(scrollLeft).toBeGreaterThanOrEqual(-1);

  const overview = root.getByRole("tab", { name: "Overview" });
  const analytics = root.getByRole("tab", { name: "Analytics" });
  await overview.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(analytics).toBeFocused();

  // A programmatic selection does not trigger the browser's native focus scroll.
  const last = root.getByRole("tab", { name: "Integrations" });
  await last.evaluate((element: HTMLElement) => element.click());
  await expect(last).toHaveAttribute("aria-selected", "true");
  await expect.poll(scrollLeft).toBeLessThan(-100);
  await expect(end).toHaveAttribute("aria-hidden", "true");
  const isLastTabInView = () => last.evaluate((element) => {
    const tab = element.getBoundingClientRect();
    const viewport = element.closest("[role='tablist']")!.getBoundingClientRect();
    return tab.left >= viewport.left - 1 && tab.right <= viewport.right + 1;
  });
  await expect.poll(isLastTabInView).toBe(true);

  await rtl.uncheck();
  await expect(list).toHaveCSS("direction", "ltr");
  await expect(last).toHaveAttribute("aria-selected", "true");
  await expect.poll(scrollLeft).toBeGreaterThan(100);
  await expect.poll(isLastTabInView).toBe(true);
});
