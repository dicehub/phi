import { expect, test } from "@playwright/test";

test("auto-scroll affects only the viewport and only when the section opens", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/sidebar");
  const demo = page.locator(".docs-component-example").filter({
    has: page.getByText("Open Workers near the bottom of the list", { exact: true }),
  });
  const workers = demo.getByRole("button", { name: "Workers", exact: true });
  const toggle = demo.locator("[data-sidebar='trigger']");
  const sidebar = demo.locator("[data-sidebar='sidebar']");
  const viewport = demo.locator("[data-sidebar='viewport']");
  const content = viewport.locator(".phi-sidebar-collapsible-content");

  await demo.scrollIntoViewIfNeeded();
  await viewport.evaluate((element) => element.setAttribute("data-tall-section-example", ""));
  await page.addStyleTag({ content: `
    [data-tall-section-example] .phi-sidebar-collapsible-content--open > .phi-sidebar-collapsible-content__inner {
      min-height: 500px;
    }
  ` });
  await viewport.evaluate((element) => {
    const nativeScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (...args) {
      if (this.matches(".phi-sidebar-collapsible-content")) element.setAttribute("data-native-scroll", "true");
      nativeScrollIntoView.apply(this, args);
    };
    const viewportScrollTo = element.scrollTo;
    element.scrollTo = (...args: [ScrollToOptions?] | [number, number]) => {
      element.setAttribute("data-scroll-count", String(Number(element.getAttribute("data-scroll-count")) + 1));
      Reflect.apply(viewportScrollTo, element, args);
    };
    element.scrollTop = 0;
  });
  const pageTop = await page.evaluate(() => window.scrollY);
  await page.clock.install();
  await workers.evaluate((element: HTMLElement) => element.click());
  await expect(workers).toHaveAttribute("aria-expanded", "true");
  await page.clock.runFor(500);
  await expect(viewport).toHaveAttribute("data-scroll-count", "1");
  await expect(viewport).not.toHaveAttribute("data-native-scroll", "true");
  expect(await viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(pageTop);
  expect(await content.evaluate((element) => {
    const viewport = element.closest("[data-sidebar='viewport']")!;
    return Math.abs(element.getBoundingClientRect().top - viewport.getBoundingClientRect().top - viewport.clientTop);
  })).toBeLessThanOrEqual(1);

  await toggle.evaluate((element: HTMLElement) => element.click());
  await expect(sidebar).toHaveAttribute("data-state", "collapsed");
  await toggle.evaluate((element: HTMLElement) => element.click());
  await expect(sidebar).toHaveAttribute("data-state", "expanded");
  await expect(workers).toHaveAttribute("aria-expanded", "true");
  await page.clock.runFor(500);
  await expect(viewport).toHaveAttribute("data-scroll-count", "1");
  await expect(viewport).not.toHaveAttribute("data-native-scroll", "true");

  // An expansion interrupted by sidebar collapse must not scroll on the next reveal.
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await workers.evaluate((element: HTMLElement) => element.click());
  await expect(workers).toHaveAttribute("aria-expanded", "false");
  await viewport.evaluate((element) => { element.scrollTop = 0; });
  await workers.evaluate((element: HTMLElement) => element.click());
  await expect(workers).toHaveAttribute("aria-expanded", "true");
  await toggle.evaluate((element: HTMLElement) => element.click());
  await expect(sidebar).toHaveAttribute("data-state", "collapsed");
  await page.clock.runFor(500);
  await toggle.evaluate((element: HTMLElement) => element.click());
  await expect(sidebar).toHaveAttribute("data-state", "expanded");
  await page.clock.runFor(500);
  await expect(viewport).toHaveAttribute("data-scroll-count", "1");
});
