import { expect, test, type Page } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`.inline-copy-text-demo[data-variant="${variant}"]`);

test("copies the value, announces it, and resets after the feedback window", async ({ page }) => {
  await page.goto("/docs/components/inline-copy-text#preview");

  const control = demo(page, "preview").locator(".phi-inline-copy-text");
  const status = demo(page, "preview").locator("[data-copied-value]");
  const id = "0c239dd2-1f6a-4c0b-9f8e-2c1f77bd9a10";

  await expect(control).not.toHaveAttribute("data-copied", "true");
  await control.click();

  await expect(control).toHaveAttribute("data-copied", "true");
  await expect(status).toHaveText(id);
  await expect(control.locator(".phi-inline-copy-text__sr")).toHaveText("Copied");

  await expect(control).not.toHaveAttribute("data-copied", "true", { timeout: 3000 });
});

test("restarts the feedback window when the control is copied again", async ({ page }) => {
  await page.goto("/docs/components/inline-copy-text#preview");

  const control = demo(page, "preview").locator(".phi-inline-copy-text");

  await control.click();
  await page.waitForTimeout(900);
  await control.click();

  await page.waitForTimeout(700);
  await expect(control).toHaveAttribute("data-copied", "true");

  await expect(control).not.toHaveAttribute("data-copied", "true", { timeout: 3000 });
});

test("keeps the copy icon hidden until the control is hovered or focused", async ({ page }) => {
  // Reduced motion removes the opacity transition, so the computed value snaps to the target.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/inline-copy-text#preview");

  const control = demo(page, "preview").locator(".phi-inline-copy-text");
  const icon = control.locator('.phi-inline-copy-text__icon[data-icon="copy"]');

  await expect(icon).toHaveCSS("opacity", "0");

  await control.hover();
  await expect(icon).toHaveCSS("opacity", "1");

  await page.mouse.move(0, 0);
  await expect(icon).toHaveCSS("opacity", "0");

  await control.focus();
  await expect(icon).toHaveCSS("opacity", "1");
});

test("always shows the affordance on devices without hover", async ({ page }) => {
  await page.goto("/docs/components/inline-copy-text#preview");

  const declaresCoarsePointerRule = await page.evaluate(() =>
    Array.from(document.styleSheets).some((sheet) =>
      Array.from(sheet.cssRules ?? []).some((rule) => {
        if (!(rule instanceof CSSMediaRule)) return false;
        if (!rule.media.mediaText.includes("hover: none")) return false;

        return Array.from(rule.cssRules).some(
          (inner) =>
            inner instanceof CSSStyleRule &&
            inner.selectorText.includes(".phi-inline-copy-text__icon") &&
            inner.style.opacity === "1",
        );
      }),
    ),
  );

  expect(declaresCoarsePointerRule).toBe(true);
});

test("reports nothing when the clipboard write fails", async ({ page }) => {
  await page.addInitScript(() => {
    navigator.clipboard.writeText = () => Promise.reject(new Error("denied"));
    document.execCommand = () => false;
  });
  await page.goto("/docs/components/inline-copy-text#preview");

  const control = demo(page, "preview").locator(".phi-inline-copy-text");
  const status = demo(page, "preview").locator("[data-copied-value]");

  await control.click();
  await expect(control).not.toHaveAttribute("data-copied", "true");
  await expect(status).toHaveText("");
  await expect(control.locator(".phi-inline-copy-text__sr")).toHaveText("");
});

test("truncates identifiers inside a narrow table cell without widening the page", async ({ page }) => {
  await page.goto("/docs/components/inline-copy-text#table-cell");

  const table = demo(page, "table-cell").locator(".inline-copy-text-demo__table");
  const cell = demo(page, "table-cell").locator(".inline-copy-text-demo__cell").first();

  const cellBox = await cell.boundingBox();
  const valueBox = await cell.locator(".phi-inline-copy-text__value").boundingBox();
  if (!cellBox || !valueBox) throw new Error("Table cell measurement failed");

  expect(valueBox.width).toBeLessThanOrEqual(cellBox.width + 1);
  expect(await table.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

test("forwards semantic element, size, and bold text props", async ({ page }) => {
  await page.goto("/docs/components/inline-copy-text#variants");

  await expect(demo(page, "preview").locator(".phi-inline-copy-text__value")).toHaveJSProperty("tagName", "SPAN");
  const value = demo(page, "variants").locator(".phi-inline-copy-text__value").first();
  await expect(value).toHaveJSProperty("tagName", "STRONG");
  await expect(value).toHaveClass(/phi-text--size-lg/);
  await expect(value).toHaveClass(/phi-text--bold/);
  await expect(page.locator("#api-reference")).toContainText("as");
  await expect(page.locator("#api-reference")).toContainText("size");
  await expect(page.locator("#api-reference")).toContainText("bold");
});
