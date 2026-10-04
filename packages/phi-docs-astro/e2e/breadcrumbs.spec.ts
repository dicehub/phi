import { expect, test } from "@playwright/test";

test.describe("Breadcrumbs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/breadcrumbs");
  });

  test("renders preview trail with icon and current page", async ({ page }) => {
    const preview = page.locator("#preview");
    const breadcrumbs = preview.locator(".phi-breadcrumbs");

    await expect(breadcrumbs).toHaveAttribute("aria-label", "breadcrumb");
    await expect(breadcrumbs.locator(".phi-breadcrumbs__link")).toHaveCount(2);
    await expect(breadcrumbs.locator(".phi-breadcrumbs__separator")).toHaveCount(2);
    await expect(breadcrumbs.locator(".phi-breadcrumbs__current")).toContainText("Current Project");
    await expect(breadcrumbs.locator(".phi-breadcrumbs__icon")).toHaveCount(1);
  });

  test("shows an explicit preview snippet", async ({ page }) => {
    const snippet = page.locator("#preview .docs-code-block pre");

    await expect(snippet).toContainText('from "@phosphor-icons/vue"');
    await expect(snippet).toContainText("<Breadcrumbs>");
    await expect(snippet).toContainText("<Breadcrumbs.Link");
    await expect(snippet).toContainText('<Breadcrumbs.Separator />');
    await expect(snippet).toContainText("<Breadcrumbs.Current>Current Project</Breadcrumbs.Current>");
    await expect(snippet).toContainText(':icon="PhHouse"');
    await expect(snippet).not.toContainText("v-for");
  });

  test("renders usage example above its code", async ({ page }) => {
    const usage = page.locator("#usage");

    await expect(usage.locator(".docs-component-preview .phi-breadcrumbs")).toHaveCount(1);
    await expect(usage.locator(".docs-component-preview .phi-breadcrumbs__current")).toContainText("Breadcrumbs");
    await expect(usage.locator(".docs-code-block")).toHaveCount(1);
  });

  test("uses documented table of contents active state", async ({ page }) => {
    const activeLink = page.locator(".docs-page-toc a[href='#api-reference']");

    const styles = await activeLink.evaluate((element) => {
      element.classList.add("is-active");
      const style = getComputedStyle(element);

      return {
        backgroundColor: style.backgroundColor,
        borderLeftWidth: style.borderLeftWidth,
        fontWeight: style.fontWeight,
      };
    });

    expect(styles).toEqual({
      backgroundColor: "rgba(0, 0, 0, 0)",
      borderLeftWidth: "2px",
      fontWeight: "500",
    });
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    const toc = page.locator(".docs-page-toc");

    await expect(toc.locator("a")).toHaveText([
      "Installation",
      "Usage",
      "Examples",
      "Basic",
      "Loading",
      "Root",
      "Clipboard",
      "API Reference",
      "Breadcrumbs",
      "Breadcrumbs.Link",
      "Breadcrumbs.Current",
      "Breadcrumbs.Separator",
      "Breadcrumbs.Clipboard",
    ]);
    await expect(toc.locator("a[href='#preview']")).toHaveCount(0);
    await expect(toc.locator("a[href='#examples'] + ul a")).toHaveCount(4);
    await expect(toc.locator("a[href='#api-reference'] + ul a")).toHaveCount(5);
  });

  test("matches the documented examples structure", async ({ page }) => {
    const examples = page.locator("#examples");

    await expect(examples.getByRole("heading", { name: "Basic" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Loading" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Root" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Clipboard" })).toBeVisible();
    await expect(examples.locator(".docs-component-example")).toHaveCount(4);
    await expect(examples.locator(".docs-code-block")).toHaveCount(4);
  });

  test("renders loading and clipboard states", async ({ page, context }) => {
    await expect(page.locator("#examples .phi-breadcrumbs__skeleton")).toBeVisible();

    await context.grantPermissions(["clipboard-write"], { origin: new URL(page.url()).origin });
    const clipboard = page.locator("#examples .phi-breadcrumbs__clipboard");

    await expect(clipboard).toHaveAttribute("aria-label", "Copy");
    await expect(clipboard.locator(".phi-breadcrumbs__clipboard-icon")).toBeVisible();
    await clipboard.click();
    await expect(clipboard).toHaveAttribute("aria-label", "Copied");
  });
});
