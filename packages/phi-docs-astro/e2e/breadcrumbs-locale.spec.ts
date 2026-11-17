import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (text: string) => { document.documentElement.dataset.copiedText = text; } },
    });
  });
  await page.goto("/docs/components/breadcrumbs");
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await expect(page.locator(".breadcrumbs-locale-demo")).toBeVisible();
  await page.locator(".breadcrumbs-locale-demo").scrollIntoViewIfNeeded();
});

test("updates translations on mounted trails and preserves nested overrides", async ({ page }) => {
  const demo = page.locator(".breadcrumbs-locale-demo");
  const trail = demo.locator("[data-example='translated']");
  const nested = demo.locator("[data-example='nested']");
  await expect(trail).toHaveAccessibleName("Fil d’Ariane");
  await expect(trail.getByRole("button")).toHaveAccessibleName("Copier");
  await expect(nested).toHaveAccessibleName("Project path");
  await expect(nested.getByRole("button")).toHaveAccessibleName("Copier");
  await nested.getByRole("button").hover();
  await expect(page.getByRole("tooltip")).toHaveText("Copy project address");
  await demo.getByRole("button", { name: "Use English", exact: true }).click();
  await expect(trail).toHaveAccessibleName("breadcrumb");
  await expect(trail.getByRole("button")).toHaveAccessibleName("Copy");
  await expect(nested).toHaveAccessibleName("Project path");
  await expect(nested.getByRole("button")).toHaveAccessibleName("Copy");
  await nested.getByRole("button").hover();
  await expect(page.getByRole("tooltip")).toHaveText("Copy project address");
  await demo.getByRole("button", { name: "Use French", exact: true }).click();
  await expect(trail).toHaveAccessibleName("Fil d’Ariane");
  await expect(page.locator("#preview .phi-breadcrumbs")).toHaveAccessibleName("breadcrumb");
  await expect(page.locator("#clipboard + .docs-component-example .phi-breadcrumbs__clipboard")).toHaveAccessibleName("Copy");
});

test("uses translated copy feedback and tooltip with keyboard focus", async ({ page }) => {
  const demo = page.locator(".breadcrumbs-locale-demo");
  const trail = demo.locator("[data-example='translated']");
  const copy = trail.getByRole("button");
  await page.clock.install();
  await trail.getByRole("link").focus();
  await page.keyboard.press("Tab");
  await expect(copy).toBeFocused();
  await expect(copy).toHaveCSS("opacity", "1");
  await expect(page.getByRole("tooltip")).toHaveText("Cliquer pour copier");
  // Hold the two-second feedback state while testing the locale change.
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-copied-text", "/settings");
  await expect(copy).toHaveAccessibleName("Copié");
  await expect(copy.locator(".phi-breadcrumbs__clipboard-icon--copied")).toBeVisible();
  await copy.hover();
  await page.clock.runFor(800);
  await expect(page.getByRole("tooltip")).toHaveText("Copié");
  await demo.getByRole("button", { name: "Use English", exact: true }).click();
  await expect(copy).toHaveAccessibleName("Copied");
  await page.clock.fastForward(2100);
  await expect(copy).toHaveAccessibleName("Copy");
  await copy.hover();
  await page.clock.runFor(800);
  await expect(page.getByRole("tooltip")).toHaveText("Click to copy");
});

for (const width of [1280, 390]) {
  test(`mirrors inherited RTL separators and respects nested LTR at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const demo = page.locator(".breadcrumbs-locale-demo");
    const rtl = demo.locator("[data-example='rtl']");
    const ltr = demo.locator("[data-example='ltr']");
    await expect(rtl).toHaveCSS("direction", "rtl");
    await expect(rtl.locator(".phi-breadcrumbs__separator svg")).toHaveCSS("rotate", "180deg");
    await expect(ltr).toHaveCSS("direction", "ltr");
    await expect(ltr.locator(".phi-breadcrumbs__separator svg")).toHaveCSS("rotate", "none");
    for (const [trail, isRtl] of [[rtl, true], [ltr, false]] as const) {
      const link = await trail.getByRole("link").boundingBox();
      const current = await trail.locator(".phi-breadcrumbs__current").boundingBox();
      expect(link).not.toBeNull();
      expect(current).not.toBeNull();
      expect(link!.x > current!.x).toBe(isRtl);
      await expect(trail).toHaveCSS("margin-left", "0px");
      await expect(trail).toHaveCSS("margin-right", "0px");
      await expect(trail.locator(".phi-breadcrumbs__separator")).toHaveAttribute("aria-hidden", "true");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
