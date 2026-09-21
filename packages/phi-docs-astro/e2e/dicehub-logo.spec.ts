import { expect, test } from "@playwright/test";

test.describe("DicehubLogo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/dicehub-logo");
  });

  test("renders preview with code", async ({ page }) => {
    const preview = page.locator("#preview");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(preview.locator(".phi-dicehub-logo")).toHaveCount(1);
    await expect(preview.locator(".phi-dicehub-logo")).toHaveAttribute("aria-label", "dicehub logo");
    await expect(snippet).toContainText('from "@dicehub/phi/components/dicehub-logo"');
    await expect(snippet).toContainText("<DicehubLogo");
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
      "Glyph Only",
      "Color Variants",
      "Glyph Color Variants",
      "Sizing",
      "Brand Assets Menu",
      "PoweredByDicehub",
      "Basic Usage",
      "Color Variants",
      "Footer Example",
      "SVG Generation",
      "API Reference",
      "DicehubLogo",
      "PoweredByDicehub",
    ]);
    await expect(toc.locator("a[href='#preview']")).toHaveCount(0);
    await expect(toc.locator("a[href='#installation'] + ul a")).toHaveCount(2);
    await expect(toc.locator("a[href='#examples'] + ul a")).toHaveCount(5);
    await expect(toc.locator("a[href='#powered-by-dicehub'] + ul a")).toHaveCount(3);
    await expect(toc.locator("a[href='#api-reference'] + ul a")).toHaveCount(2);
  });

  test("renders usage example above its code", async ({ page }) => {
    const usage = page.locator("#usage");

    await expect(usage.locator(".docs-component-preview .phi-dicehub-logo")).toHaveCount(1);
    await expect(usage.locator(".docs-code-block")).toContainText("<DicehubLogo");
  });

  test("renders logo examples with snippets", async ({ page }) => {
    const examples = page.locator("#examples");

    await expect(examples.getByRole("heading", { name: "Glyph Only" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Color Variants" }).first()).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Glyph Color Variants" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Sizing" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Brand Assets Menu" })).toBeVisible();
    await expect(examples.locator(".docs-component-example")).toHaveCount(5);
    await expect(examples.locator(".docs-code-block")).toHaveCount(5);
    await expect(examples.locator(".docs-code-block").filter({ hasText: "v-for" })).toHaveCount(0);
    await expect(examples.locator(".phi-dicehub-logo--white")).toHaveCount(3);
  });

  test("renders powered badge examples and API docs", async ({ page }) => {
    const powered = page.locator("#powered-by-dicehub");
    const api = page.locator("#api-reference");
    const svgGeneration = page.locator("#svg-generation");

    await expect(powered.locator(".phi-powered-by-dicehub")).toHaveCount(5);
    await expect(powered.getByRole("link", { name: /Powered by dicehub/ }).first()).toHaveAttribute(
      "href",
      "https://dicehub.com",
    );
    await expect(powered.locator(".docs-code-block")).toHaveCount(3);
    await expect(api.locator("table")).toHaveCount(2);
    await expect(svgGeneration).toContainText("generateDicehubLogoSvg");
  });

  test("copies SVG from the brand assets menu", async ({ page, context }) => {
    const origin = new URL(page.url()).origin;
    const menuExample = page.locator("#brand-assets-menu + p + .docs-component-example");

    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin });
    await menuExample.getByRole("button", { name: "Logo" }).click();

    const menuContent = page.locator(".phi-dropdown-content").filter({ hasText: "Copy mark as SVG" });
    await expect(menuContent).toBeVisible();
    await expect
      .poll(async () => {
        const box = await menuContent.boundingBox();
        if (!box) return false;

        return page.evaluate(
          ({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest(".phi-dropdown-content")),
          {
            x: box.x + box.width / 2,
            y: box.y + box.height - 4,
          },
        );
      })
      .toBe(true);

    await menuExample.getByRole("menuitem", { name: "Copy mark as SVG" }).click();

    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("dicehub logo");
    await menuExample.getByRole("button", { name: "Logo" }).click();
    await expect(menuExample.getByRole("menuitem", { name: "Copied!" })).toBeVisible();
  });
});
