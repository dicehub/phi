import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("Table of Contents", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/table-of-contents");
  });

  test("renders the preview and code", async ({ page }) => {
    const preview = page.locator("#preview");
    const toc = preview.locator(".phi-table-of-contents");

    await expect(page.locator("main h1").first()).toHaveText("Table of Contents");
    await expect(toc).toHaveAttribute("aria-label", "Table of contents");
    await expect(toc.locator(".phi-table-of-contents-title")).toHaveText("On this page");
    await expect(toc.locator(".phi-table-of-contents-item")).toHaveText([
      "Introduction",
      "Installation",
      "Usage",
      "API Reference",
      "Examples",
    ]);
    await expect(toc.locator(".phi-table-of-contents-item--active")).toHaveText("Usage");
    await expect(toc.locator(".phi-table-of-contents-item--active")).toHaveAttribute("aria-current", "true");
    await expect(preview.locator(".docs-code-block pre")).toContainText(
      'from "@dicehub/phi/components/table-of-contents"',
    );
  });

  test("matches the expected docs table of contents", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Interactive",
      "No active item",
      "Scroll tracking",
      "Groups",
      "Without title",
      "Custom element",
      "Vue Router",
      "Nuxt",
      "Button (no navigation)",
      "API Reference",
      "TableOfContents",
      "TableOfContents.Title",
      "TableOfContents.List",
      "TableOfContents.Item",
      "TableOfContents.Group",
      "useTableOfContentsActiveId",
    ]);
  });

  test("renders documented examples and API reference", async ({ page }) => {
    const examples = page.locator("#examples");
    const interactive = exampleById(page, "interactive");
    const noActive = exampleById(page, "no-active-item");
    const scrollTracking = exampleById(page, "scroll-tracking");
    const groups = exampleById(page, "groups");
    const withoutTitle = exampleById(page, "without-title");
    const customElement = exampleById(page, "custom-element");

    await expect(examples.locator(".docs-component-example")).toHaveCount(6);

    await interactive.locator(".phi-table-of-contents-item").filter({ hasText: "Installation" }).click();
    await expect(interactive.locator(".phi-table-of-contents-item--active")).toHaveText("Installation");

    await expect(noActive.locator(".phi-table-of-contents-item--active")).toHaveCount(0);
    await expect(noActive.locator("[aria-current='true']")).toHaveCount(0);

    const scrollRoot = scrollTracking.locator("[data-scrollspy-root]");
    await expect(scrollTracking.locator(".phi-table-of-contents-item--active")).toHaveText("Overview");
    await scrollRoot.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    await expect(scrollTracking.locator(".phi-table-of-contents-item--active")).toHaveText("API");

    await expect(groups.locator(".phi-table-of-contents-group")).toHaveCount(3);
    await expect(groups.locator(".phi-table-of-contents-group-link")).toHaveText(["Examples", "API"]);
    await expect(groups.locator(".phi-table-of-contents-group-label")).toHaveText("Getting Started");
    await expect(groups.locator(".phi-table-of-contents-group-list")).toHaveCount(3);
    await groups.getByRole("link", { name: "Examples", exact: true }).click();
    await expect(groups.locator(".table-of-contents-demo__clicked")).toHaveText("Clicked: Examples");
    await groups.getByRole("button", { name: "Basic example" }).click();
    await expect(groups.locator(".table-of-contents-demo__clicked")).toHaveText("Clicked: Basic example");

    await expect(withoutTitle.locator(".phi-table-of-contents-title")).toHaveCount(0);
    await expect(withoutTitle.locator(".phi-table-of-contents-item--active")).toHaveText("Introduction");

    const customElementPreview = customElement.locator(".docs-component-preview");
    await expect(customElementPreview.getByRole("button")).toHaveText(["Introduction", "Installation", "Usage"]);
    await customElementPreview.getByRole("button", { name: "Usage" }).click();
    await expect(customElement).toContainText("Clicked: Usage");

    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(6);
    await expect(page.locator("#api-reference")).toContainText("as");
    await expect(page.locator("#api-reference")).toContainText("Element or component to render as the item control");
    await expect(page.locator("#api-reference")).toContainText('aria-current="true"');
    await expect(page.locator("#api-reference")).toContainText("label");
    await expect(page.locator("#api-reference")).toContainText("href");
    await expect(page.locator("#examples")).toContainText('as="button"');
  });

  test("tracks the docs page hash through the shared composable", async ({ page }) => {
    await page.goto("/docs/components/table-of-contents#groups");

    await expect(page.locator(".docs-page-toc a[href='#groups']")).toHaveClass(/is-active/);
  });
});

test("Table of Contents is reachable in the left docs navigation after Table", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sidebar = page.locator(".docs-sidebar-panel--desktop");
  const links = sidebar.locator(".docs-nav-group__panel a");
  const tableLink = sidebar.getByRole("link", { name: "Table", exact: true });
  const tableOfContentsLink = sidebar.getByRole("link", { name: "Table of Contents" });

  await expect(tableLink).toHaveAttribute("href", "/docs/components/table");
  await expect(tableOfContentsLink).toHaveAttribute("href", "/docs/components/table-of-contents");
  await expect(sidebar.getByRole("link", { name: "TableOfContents" })).toHaveCount(0);

  const labels = await links.evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(labels.indexOf("Table of Contents")).toBe(labels.indexOf("Table") + 1);
});
