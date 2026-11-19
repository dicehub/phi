import { expect, test } from "@playwright/test";

for (const [width, gap] of [[1280, 32], [390, 16]]) {
  test(`positions the toast and its close button at inline end at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/docs/components/toast");
    await page.locator("#preview").getByRole("button", { name: "Show toast", exact: true }).click();

    const toast = page.locator(".phi-toast").filter({ hasText: "Toast created" });
    const viewport = page.locator(".phi-toast-viewport").filter({ has: toast });
    const content = toast.locator(".phi-toast__content");
    const close = toast.getByRole("button", { name: "Close", exact: true });

    for (const direction of ["ltr", "rtl"]) {
      await page.locator("html").evaluate((element, dir) => element.setAttribute("dir", dir), direction);
      const inlineEnd = direction === "ltr" ? "right" : "left";
      const inlineStart = direction === "ltr" ? "left" : "right";
      await expect(viewport).toHaveCSS("direction", direction);
      await expect(viewport).toHaveCSS(inlineEnd, `${gap}px`);
      await expect(close).toHaveCSS(inlineEnd, "-8px");
      await expect(content).toHaveCSS(`padding-${inlineEnd}`, "24px");
      await expect(content).toHaveCSS(`padding-${inlineStart}`, "0px");

      const geometry = await toast.evaluate((element, dir) => {
        const viewport = element.closest(".phi-toast-viewport")!.getBoundingClientRect();
        const text = element.querySelector(".phi-toast__copy")!.getBoundingClientRect();
        const close = element.querySelector(".phi-toast__close")!.getBoundingClientRect();
        return dir === "ltr"
          ? { gap: document.documentElement.clientWidth - viewport.right, space: close.left - text.right }
          : { gap: viewport.left, space: text.left - close.right };
      }, direction);
      expect(geometry.gap).toBeCloseTo(gap, 0);
      expect(geometry.space).toBeGreaterThan(0);
    }

    await close.focus();
    await close.press("Enter");
    await expect(toast).toHaveCount(0);
  });
}
