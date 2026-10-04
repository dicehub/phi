import { expect, type Locator, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

const redChannel = (color: string) => {
  const values = color.match(/[\d.]+/g)?.map(Number) ?? [];
  if (color.startsWith("color(srgb")) return values[0] * 255;
  return values[0] ?? Number.NaN;
};

const colorRedChannel = async (locator: Locator) =>
  redChannel(await locator.evaluate((element) => getComputedStyle(element).color));

test.describe("Empty", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/empty");
  });

  test("renders preview with code", async ({ page }) => {
    const preview = page.locator("#preview");
    const empty = preview.locator(".phi-empty");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(page.locator("main h1").first()).toHaveText("Empty");
    await expect(empty).toHaveCount(1);
    await expect(empty).toContainText("No packages found");
    await expect(empty).toContainText("Get started by installing your first package.");
    await expect(empty).toContainText("$");
    await expect(empty).toContainText("pnpm add @dicehub/phi@beta");
    await expect
      .poll(async () =>
        colorRedChannel(empty.locator(".phi-empty__icon svg")),
      )
      .toBeLessThan(80);
    await expect(empty.getByRole("button", { name: "Copy command" })).toBeVisible();
    await expect
      .poll(async () =>
        empty.locator(".phi-empty__command").evaluate((element) => {
          const background = getComputedStyle(element).backgroundColor;
          const values = background.match(/[\d.]+/g)?.map(Number) ?? [];
          if (background.startsWith("color(srgb")) return values[0] ?? Number.NaN;
          if (background.startsWith("rgb")) return (values[0] ?? Number.NaN) / 255;
          return Number.NaN;
        }),
      )
      .toBeGreaterThan(0.98);
    await expect(empty.locator(".phi-empty__command-value")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(empty.locator(".phi-empty__command-value")).toHaveCSS("padding-left", "0px");
    await expect(preview.getByRole("button", { name: "See examples" })).toBeVisible();
    await expect(preview.getByRole("button", { name: "View documentation" })).toBeVisible();
    await expect(snippet).toContainText('from "@dicehub/phi/components/empty"');
    await expect(snippet).toContainText('command-line="pnpm add @dicehub/phi@beta"');
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
      "Basic",
      "Sizes",
      "With Command Line",
      "With Actions",
      "Minimal",
      "API Reference",
    ]);
    await expect(toc.locator("a[href='#preview']")).toHaveCount(0);
    await expect(toc.locator("a[href='#installation'] + ul a")).toHaveCount(2);
    await expect(toc.locator("a[href='#examples'] + ul a")).toHaveCount(5);
  });

  test("renders usage example above its code", async ({ page }) => {
    const usage = page.locator("#usage");

    await expect(usage.locator(".docs-component-preview .phi-empty")).toContainText("No packages found");
    await expect(usage.locator(".docs-code-block")).toContainText("<Empty");
    await expect(usage.locator(".docs-code-block")).toContainText('command-line="pnpm add @dicehub/phi@beta"');
  });

  test("renders every documented example with snippets and API rows", async ({ page }) => {
    const examples = page.locator("#examples");
    const snippets = examples.locator(".docs-code-block");
    const sizes = exampleById(page, "sizes");
    const actions = exampleById(page, "with-actions");
    const minimal = exampleById(page, "minimal");
    const minimalEmpty = minimal.locator(".phi-empty");

    await expect(examples.getByRole("heading", { name: "Basic" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Sizes" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "With Command Line" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "With Actions" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Minimal" })).toBeVisible();
    await expect(examples.locator(".docs-component-example")).toHaveCount(5);
    await expect(snippets).toHaveCount(5);
    await expect(snippets.filter({ hasText: "v-for" })).toHaveCount(0);
    await expect(sizes.locator(".phi-empty")).toHaveCount(3);
    await expect(sizes.locator(".phi-empty--sm")).toHaveCount(1);
    await expect(sizes.locator(".phi-empty--base")).toHaveCount(1);
    await expect(sizes.locator(".phi-empty--lg")).toHaveCount(1);
    await expect(sizes.locator(".phi-empty__icon svg")).toHaveCount(3);
    await expect
      .poll(async () => sizes.locator(".phi-empty").first().boundingBox().then((box) => box?.width ?? Number.NaN))
      .toBeLessThan(340);
    await expect
      .poll(async () => sizes.locator(".phi-empty__icon svg").nth(0).boundingBox().then((box) => box?.width ?? Number.NaN))
      .toBeGreaterThan(30);
    await expect
      .poll(async () => sizes.locator(".phi-empty__icon svg").nth(2).boundingBox().then((box) => box?.width ?? Number.NaN))
      .toBeGreaterThan(60);
    await expect
      .poll(async () =>
        colorRedChannel(sizes.locator(".phi-empty__icon svg").first()),
      )
      .toBeGreaterThan(180);
    await expect(actions.locator(".phi-empty__icon svg")).toHaveCount(1);
    await expect(actions.locator(".phi-empty__icon svg")).toBeVisible();
    await expect
      .poll(async () =>
        colorRedChannel(actions.locator(".phi-empty__icon svg")),
      )
      .toBeGreaterThan(180);
    await expect(minimalEmpty).toHaveText("Nothing here");
    await expect(minimal.locator(".phi-empty__description")).toHaveCount(0);
    await expect(minimal.locator(".phi-empty__command")).toHaveCount(0);
    await expect
      .poll(async () =>
        minimalEmpty.evaluate((element) => {
          const title = element.querySelector(".phi-empty__title");
          if (!title) return Number.NaN;
          const rootBox = element.getBoundingClientRect();
          const titleBox = title.getBoundingClientRect();
          return Math.abs(rootBox.left + rootBox.width / 2 - (titleBox.left + titleBox.width / 2));
        }),
      )
      .toBeLessThan(1);
    await expect(page.locator("#preview .phi-empty__description")).toHaveCSS("margin-top", "0px");
    await expect(page.locator("#api-reference tbody tr")).toHaveCount(10);
    await expect(page.locator("#api-reference")).toContainText('"sm" | "base" | "lg"');
    await expect(page.locator("#api-reference")).toContainText("commandLine");
    await expect(page.locator("#api-reference")).toContainText("@copy-command");
    await expect(page.locator("#api-reference")).toContainText("default slot");
  });

  test("copies command line values", async ({ page, context }) => {
    const origin = new URL(page.url()).origin;

    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin });

    const preview = page.locator("#preview .phi-empty");
    await preview.getByRole("button", { name: "Copy command" }).click();
    await expect(preview).toHaveAttribute("data-copied", "true");
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("pnpm add @dicehub/phi@beta");

    const command = exampleById(page, "with-command-line").locator(".phi-empty");
    await command.getByRole("button", { name: "Copy command" }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("pnpm create phi-project");
  });
});

test("Empty reports no success when both clipboard methods fail", async ({ page }) => {
  await page.addInitScript(() => {
    navigator.clipboard.writeText = () => Promise.reject(new Error("denied"));
    document.execCommand = () => false;
  });
  await page.goto("/docs/components/empty");

  const preview = page.locator("#preview .phi-empty");
  await preview.getByRole("button", { name: "Copy command" }).click();

  await expect(preview).not.toHaveAttribute("data-copied", "true");
  await expect(preview.locator(".phi-empty__sr")).toHaveText("");
});

test("Home Empty card renders a real empty state", async ({ page }) => {
  await page.goto("/");

  const card = page
    .locator(".home-gallery__item")
    .filter({ has: page.getByRole("link", { name: "Empty" }) });

  await expect(card.locator(".phi-empty")).toHaveCount(1);
  await expect(card.locator(".phi-empty")).toContainText("No results");
  await expect(card.locator(".phi-empty")).toContainText("Try another filter.");
});
