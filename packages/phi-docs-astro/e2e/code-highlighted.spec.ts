import { expect, test } from "@playwright/test";

async function scrollThroughPage(page: import("@playwright/test").Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);

  for (let top = 0; top <= height; top += 600) {
    await page.evaluate((scrollTop) => window.scrollTo(0, scrollTop), top);
    await page.waitForTimeout(180);
  }
}

test.describe("CodeHighlighted", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/code-highlighted");
  });

  test("renders the preview with a code snippet", async ({ page }) => {
    const preview = page.locator("#preview");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(preview.locator(".phi-code-highlighted")).toHaveCount(1);
    await expect(preview.locator(".phi-code-highlighted__shiki .shiki")).toBeVisible();
    await expect(snippet).toContainText('from "@dicehub/phi/code"');
    await expect(snippet).toContainText("<ShikiProvider");
    await expect(snippet).toContainText("<CodeHighlighted");
    await expect(snippet).not.toContainText("v-for");
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");
  });

  test("matches curated table of contents structure", async ({ page }) => {
    const toc = page.locator(".docs-page-toc");

    await expect(toc.locator("a")).toHaveText([
      "Overview",
      "Installation",
      "Basic Usage",
      "Examples",
      "Languages",
      "Highlight Lines",
      "Custom Highlight Color",
      "Line Numbers",
      "Copy Button",
      "Full Featured",
      "Plain",
      "Shared Provider",
      "Themes",
      "Server-Side Usage",
      "One-off Highlighting",
      "Reusable Highlighter",
      "Custom Composable",
      "Internationalization",
      "Framework Integration",
      "Vue Router",
      "Astro Static",
      "Plain Code",
      "API Reference",
      "ShikiProvider",
      "CodeHighlighted",
      "useShikiHighlighter",
    ]);
    await expect(toc.locator("a[href='#preview']")).toHaveCount(0);
    await expect(toc.locator("a[href='#examples'] + ul a")).toHaveCount(8);
    await expect(toc.locator("a[href='#server-side-usage'] + ul a")).toHaveCount(2);
    await expect(toc.locator("a[href='#framework-integration'] + ul a")).toHaveCount(2);
    await expect(toc.locator("a[href='#api-reference'] + ul a")).toHaveCount(3);
    await expect(toc.locator("a[href='#bundle-size']")).toHaveCount(0);
    await expect(toc.locator("a[href='#migration']")).toHaveCount(0);
  });

  test("renders the plain variant without a frame", async ({ page }) => {
    const plain = page.locator(".code-highlighted-demo--plain .phi-code-highlighted").first();
    await plain.scrollIntoViewIfNeeded();
    await expect(plain.locator(".phi-code-highlighted__shiki .shiki")).toBeVisible();

    await expect(plain).toHaveCSS("border-top-width", "0px");
    await expect(plain).toHaveCSS("border-radius", "0px");
    await expect(plain).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(plain.locator(".phi-code-highlighted__shiki pre")).toHaveCSS("padding", "0px");
    await expect(plain.locator(".phi-code-highlighted__copy")).toHaveCSS("top", "0px");
    await expect(plain.locator(".phi-code-highlighted__copy")).toHaveCSS("right", "0px");

    const framed = page.locator(".code-highlighted-demo--full-featured .phi-code-highlighted").first();
    await expect(framed).toHaveCSS("border-top-width", "1px");
  });

  test("keeps plain highlighted lines inside the code content", async ({ page }) => {
    const plain = page.locator(".code-highlighted-demo--plain .phi-code-highlighted").first();
    await plain.scrollIntoViewIfNeeded();

    const highlighted = plain.locator(".line-highlighted").first();
    await expect(highlighted).toBeVisible();

    const [highlightedBox, plainCodeBox] = await Promise.all([
      highlighted.boundingBox(),
      plain.locator("pre > code").first().boundingBox(),
    ]);
    if (!highlightedBox || !plainCodeBox) throw new Error("Plain code block measurement failed");

    // Plain mode drops the negative expansion, so the highlight matches the code content width.
    expect(highlightedBox.width).toBeLessThanOrEqual(plainCodeBox.width + 1);

    const framed = page.locator(".code-highlighted-demo--full-featured .phi-code-highlighted").first();
    await framed.scrollIntoViewIfNeeded();
    await expect(framed.locator(".line-highlighted").first()).toBeVisible();

    const [framedHighlightBox, framedCodeBox] = await Promise.all([
      framed.locator(".line-highlighted").first().boundingBox(),
      framed.locator("pre > code").first().boundingBox(),
    ]);
    if (!framedHighlightBox || !framedCodeBox) throw new Error("Framed code block measurement failed");

    // The framed variant still expands the highlight into its 1rem padding on both sides.
    expect(framedHighlightBox.width).toBeGreaterThan(framedCodeBox.width + 16);
  });

  test("renders basic usage code", async ({ page }) => {
    const usage = page.locator("#basic-usage");

    await expect(usage.locator(".docs-component-example")).toHaveCount(0);
    await expect(usage.locator(".docs-code-block")).toContainText("<ShikiProvider");
    await expect(usage.locator(".docs-code-block")).toContainText("<CodeHighlighted");
  });

  test("renders all examples with matching snippets", async ({ page }) => {
    const examples = page.locator("#examples");

    await scrollThroughPage(page);

    await expect(examples.locator(".docs-component-example")).toHaveCount(11);
    await expect(examples.locator(".docs-code-block")).toHaveCount(11);
    await expect(examples.locator(".code-highlighted-demo--custom-highlight")).toBeVisible();
    await expect(examples.locator(".phi-code-highlighted")).toHaveCount(14);
    await expect(examples.locator(".docs-code-block").filter({ hasText: "highlight-lines" })).toHaveCount(3);
    await expect(examples.locator(".docs-code-block").filter({ hasText: "show-line-numbers" })).toHaveCount(1);
    await expect(examples.locator(".docs-code-block").filter({ hasText: "show-copy-button" })).toHaveCount(3);
    await expect(examples.locator(".docs-code-block").filter({ hasText: "v-for" })).toHaveCount(0);
  });

  test("keeps neutral heading links and custom highlight defaults", async ({ page }) => {
    const customHeading = page.locator('.docs-section-anchor[href="#custom-highlight-color"]');
    const customExample = page.locator(".code-highlighted-demo--custom-highlight");

    await customHeading.scrollIntoViewIfNeeded();
    await expect(customHeading).toHaveCSS("color", "rgb(23, 23, 23)");
    const anchorIcon = await customHeading.evaluate((node) => {
      const style = getComputedStyle(node, "::before");
      return {
        width: style.width,
        height: style.height,
        color: style.backgroundColor,
        mask: style.maskImage || style.webkitMaskImage,
      };
    });
    expect(anchorIcon).toMatchObject({
      width: "16px",
      height: "16px",
      color: "rgb(115, 115, 115)",
    });
    expect(anchorIcon.mask).not.toBe("none");

    await expect(customExample.locator(".line-highlighted").first()).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0.05)",
    );
    await expect(customExample.locator("code").last()).toContainText("rgba(0, 0, 0, 0.05)");
  });

  test("renders Astro static code with compact spacing", async ({ page }) => {
    const astroStaticBlock = page.locator("#astro-static + p + .docs-code-block pre");

    await astroStaticBlock.scrollIntoViewIfNeeded();
    await expect(astroStaticBlock).toHaveCSS("line-height", "21px");
    await expect(astroStaticBlock).toContainText('import { highlightCode } from "@dicehub/phi/code/server";');
    const leadingSpaces = await astroStaticBlock.locator("code").evaluate((node) =>
      (node.textContent ?? "").split("\n").map((line) => line.match(/^ */)?.[0].length ?? 0),
    );
    expect(leadingSpaces).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });

  test("documents localized copy labels", async ({ page }) => {
    const section = page.locator("#internationalization");

    await section.scrollIntoViewIfNeeded();
    await expect(section).toContainText("translated labels");
    await expect(section.locator(".docs-code-block")).toContainText(":labels");
    await expect(section.locator(".docs-code-block")).toContainText("Copier");
    await expect(section.locator(".docs-code-block")).toContainText("Copié");
    await expect(section.locator(".docs-code-block")).toContainText("Befehl kopieren");
    await expect(section.locator(".docs-code-block")).toContainText("Befehl kopiert");
  });

  test("uses neutral dark theme colors", async ({ page }) => {
    await page.evaluate(() => document.documentElement.setAttribute("data-mode", "dark"));

    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(3, 3, 3)");
    await expect(page.locator(".docs-component-preview").first()).toHaveCSS("background-color", "rgb(15, 15, 15)");
    await expect(page.locator("#preview .phi-code-highlighted")).toHaveCSS("background-color", "oklch(0.17 0 0)");
    await expect(page.locator("#preview .phi-code-highlighted")).toHaveCSS("border-color", "oklch(0.32 0 0)");
  });

  test("supports highlighted lines and line numbers", async ({ page }) => {
    const highlightedLines = page.locator("#highlight-lines + p + .docs-component-example");
    const lineNumbers = page.locator("#line-numbers + .docs-component-example");

    await highlightedLines.scrollIntoViewIfNeeded();
    await expect(highlightedLines.locator(".phi-code-highlighted__shiki .shiki")).toBeVisible();

    await expect(highlightedLines.locator(".line-highlighted")).toHaveCount(2);
    await expect(highlightedLines.locator(".line-highlighted").first()).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0.05)",
    );
    await page.evaluate(() => document.documentElement.setAttribute("data-mode", "dark"));
    await expect(highlightedLines.locator(".line-highlighted").first()).toHaveCSS(
      "background-color",
      "rgba(255, 255, 255, 0.08)",
    );
    await lineNumbers.scrollIntoViewIfNeeded();
    await expect(lineNumbers.locator(".phi-code-highlighted__shiki .shiki")).toBeVisible();
    await expect(lineNumbers.locator(".phi-code-highlighted__line-numbers span")).toHaveCount(21);
    await expect(lineNumbers.locator(".phi-code-highlighted__line-numbers span").first()).toHaveText("1");
  });

  test("copies code from the copy button example", async ({ page, context }) => {
    const origin = new URL(page.url()).origin;
    const copyExample = page.locator("#copy-button + .docs-component-example");

    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin });
    await copyExample.scrollIntoViewIfNeeded();
    await copyExample.locator(".phi-code-highlighted__copy").click();

    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("pnpm add @dicehub/phi@beta");
    await expect(copyExample.getByRole("button", { name: "Copied!" })).toBeVisible();
  });
});
