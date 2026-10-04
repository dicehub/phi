import { expect, test, type Page } from "@playwright/test";

const demo = (page: Page, variant: string) => page.locator(`.resource-list-demo[data-variant="${variant}"]`);

test.describe("ResourceListPage block", () => {
  test("renders one instance of every slot", async ({ page }) => {
    await page.goto("/docs/blocks/resource-list#preview");

    const block = demo(page, "complete").locator(".phi-resource-list-page");
    await expect(block.locator("h1")).toHaveText("KV Namespaces");
    await expect(block.locator(".phi-resource-list-page__description")).toContainText("Store key-value data");
    await expect(block.locator(".phi-resource-list-page__usage")).toHaveCount(1);
    await expect(block.locator(".phi-resource-list-page__additional")).toHaveCount(1);
    await expect(block.getByText("production-kv")).toHaveCount(1);
    await expect(block.getByText("Learn More", { exact: true })).toHaveCount(1);
  });

  test("renders no empty heading when the title is absent", async ({ page }) => {
    await page.goto("/docs/blocks/resource-list#minimal");

    const block = demo(page, "minimal").locator(".phi-resource-list-page");
    await expect(block).toHaveCount(1);
    await expect(block.locator("h1")).toHaveCount(0);
    await expect(block.locator(".phi-resource-list-page__aside")).toHaveCount(0);
  });

  test("keeps the main column first in the DOM and the focus order", async ({ page }) => {
    await page.setViewportSize({ width: 420, height: 900 });
    await page.goto("/docs/blocks/resource-list#preview");

    const block = demo(page, "complete").locator(".phi-resource-list-page");
    const main = block.locator(".phi-resource-list-page__main");
    const aside = block.locator(".phi-resource-list-page__aside");

    const [mainBox, asideBox] = await Promise.all([main.boundingBox(), aside.boundingBox()]);
    if (!mainBox || !asideBox) throw new Error("Resource list measurement failed");

    expect(mainBox.y).toBeLessThan(asideBox.y);
    expect(
      await block.evaluate((element) => {
        const sections = Array.from(element.querySelectorAll(".phi-resource-list-page__main, .phi-resource-list-page__aside"));
        return sections[0]?.classList.contains("phi-resource-list-page__main") ?? false;
      }),
    ).toBe(true);
  });

  test("sticks the sidebar only at the wide breakpoint", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/docs/blocks/resource-list#preview");

    const aside = demo(page, "complete").locator(".phi-resource-list-page__aside");
    await expect(aside).toHaveCSS("position", "sticky");
    await expect(aside).toHaveCSS("width", "380px");

    await page.setViewportSize({ width: 900, height: 900 });
    await expect(aside).toHaveCSS("position", "static");
  });

  test("documents the install command and the local import", async ({ page }) => {
    await page.goto("/docs/blocks/resource-list#installation");

    const installation = page.locator("#installation");
    await expect(installation).toContainText("pnpm dlx @dicehub/phi@beta add ResourceListPage");
    await expect(installation).toContainText(
      'import ResourceListPage from "./components/phi/resource-list-page/ResourceListPage.vue";',
    );
    await expect(installation).not.toContainText("Preview design");
  });

  test("does not overflow the page at narrow widths", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/docs/blocks/resource-list#preview");

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  });
});
