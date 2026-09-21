import { expect, test } from "@playwright/test";

test.describe("Clipboard Text", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/clipboard-text");
  });

  test("renders preview with code", async ({ page }) => {
    const preview = page.locator("#preview");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(preview.locator(".phi-clipboard-text")).toHaveCount(1);
    await expect(preview.locator(".phi-clipboard-text")).toContainText("0c239dd2");
    await expect(preview.getByRole("button", { name: "Copy to clipboard" })).toBeVisible();
    await expect(snippet).toContainText('from "@dicehub/phi/components/clipboard-text"');
    await expect(snippet).toContainText('<ClipboardText text="0c239dd2" />');
    await expect(snippet).not.toContainText("v-for");
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    const toc = page.locator(".docs-page-toc");

    await expect(toc.locator("a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Short Text",
      "API Key",
      "Copy Alternate Text",
      "Long Text",
      "With Tooltip",
      "API Reference",
    ]);
    await expect(toc.locator("a[href='#preview']")).toHaveCount(0);
    await expect(toc.locator("a[href='#installation'] + ul a")).toHaveCount(2);
    await expect(toc.locator("a[href='#examples'] + ul a")).toHaveCount(5);
  });

  test("renders usage example above its code", async ({ page }) => {
    const usage = page.locator("#usage");

    await expect(usage.locator(".docs-component-preview .phi-clipboard-text")).toContainText("Copy this text");
    await expect(usage.locator(".docs-code-block")).toContainText('<ClipboardText text="Copy this text" />');
  });

  test("renders every documented example with snippets", async ({ page }) => {
    const examples = page.locator("#examples");
    const snippets = examples.locator(".docs-code-block");

    await expect(examples.getByRole("heading", { name: "Short Text" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "API Key" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Copy Alternate Text" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Long Text" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "With Tooltip" })).toBeVisible();
    await expect(examples.locator(".docs-component-example")).toHaveCount(5);
    await expect(snippets).toHaveCount(5);
    await expect(snippets.nth(2)).toContainText('text-to-copy="sk_live_51H8_abc123"');
    await expect(snippets.filter({ hasText: "v-for" })).toHaveCount(0);
  });

  test("copies displayed and alternate text values", async ({ page, context, browserName }) => {
    const origin = new URL(page.url()).origin;
    const canReadClipboard = browserName !== "firefox";

    if (canReadClipboard) {
      await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin });
    }

    const preview = page.locator("#preview .phi-clipboard-text");
    await preview.getByRole("button", { name: "Copy to clipboard" }).click();
    await expect(preview).toHaveAttribute("data-copied", "true");
    if (canReadClipboard) {
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("0c239dd2");
    }

    const alternate = page.locator("#examples .docs-component-example").nth(2).locator(".phi-clipboard-text");
    await alternate.getByRole("button", { name: "Copy to clipboard" }).click();
    await expect(alternate).toHaveAttribute("data-copied", "true");
    if (canReadClipboard) {
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("sk_live_51H8_abc123");
    }
  });

  test("keeps one tooltip feedback toast and bumps it on repeat copies", async ({ page, context, browserName }) => {
    const origin = new URL(page.url()).origin;
    const canReadClipboard = browserName !== "firefox";
    const tooltipExample = page.locator("#examples .docs-component-example").nth(4);
    const button = tooltipExample.getByRole("button", { name: "Copy to clipboard" });
    const liveRegion = tooltipExample.locator(".phi-clipboard-text__sr");

    if (canReadClipboard) {
      await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin });
    }
    await button.hover();
    await expect(tooltipExample.getByRole("tooltip")).toHaveText("Copy");

    await button.click();
    const status = tooltipExample.getByRole("status");
    await expect(status).toHaveText("Copied!");
    await expect(status).not.toHaveClass(/phi-clipboard-text__toast--bump/);
    await status.evaluate((element) => element.setAttribute("data-test-feedback-instance", "first"));

    await page.waitForTimeout(1000);
    await button.click();

    await expect(status).toHaveCount(1);
    await expect(status).toHaveClass(/phi-clipboard-text__toast--bump/);
    await expect(status).toHaveCSS("animation-name", "phi-clipboard-text-toast-bump");
    await expect(liveRegion).toHaveText("Copied!");
    await expect(status).not.toHaveAttribute("data-test-feedback-instance", "first");
    if (canReadClipboard) {
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("npx phi add button");
    }

    await page.waitForTimeout(650);
    await expect(status).toBeVisible();
    await expect(status).toHaveCount(0, { timeout: 1200 });
    await expect(liveRegion).toHaveText("");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await button.click();
    await expect(status).toBeVisible();
    await button.click();
    await expect(status).toHaveClass(/phi-clipboard-text__toast--bump/);
    await expect(status).toHaveCSS("animation-name", "none");
  });
});

test("Home ClipboardText card renders a real clipboard field", async ({ page }) => {
  await page.goto("/");

  const card = page
    .locator(".home-gallery__item")
    .filter({ has: page.getByRole("link", { name: "ClipboardText" }) });

  await expect(card).toBeVisible({ timeout: 15_000 });
  await expect(card.locator(".phi-clipboard-text")).toHaveCount(1);
  await expect(card.locator(".phi-clipboard-text")).toContainText("0c239dd2");
});
