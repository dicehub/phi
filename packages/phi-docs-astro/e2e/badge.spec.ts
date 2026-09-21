import { expect, test } from "@playwright/test";

test.describe("Badge", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/badge");
  });

  test("renders semantic variants in the preview", async ({ page }) => {
    const preview = page.locator("#preview");

    await expect(preview.locator(".phi-badge")).toHaveCount(8);
    await expect(preview.locator(".phi-badge").first()).toHaveText("Primary");
    await expect(preview.locator(".phi-badge").filter({ hasText: "Secondary" })).toBeVisible();
    await expect(preview.locator(".phi-badge").filter({ hasText: "Error" })).toBeVisible();
    await expect(preview.locator(".phi-badge").filter({ hasText: "Success" })).toBeVisible();
    await expect(preview.locator(".phi-badge").filter({ hasText: "Warning" })).toBeVisible();
    await expect(preview.locator(".phi-badge").filter({ hasText: "Info" })).toBeVisible();
    await expect(preview.locator(".phi-badge").filter({ hasText: "Outline" })).toBeVisible();
    await expect(preview.locator(".phi-badge").filter({ hasText: "Beta" })).toBeVisible();
  });

  test("keeps semantic preview badges on one row at desktop width", async ({ page }) => {
    const badges = page.locator("#preview .phi-badge");

    await expect(badges).toHaveCount(8);

    const rows = await badges.evaluateAll((nodes) => {
      const topValues = nodes.map((node) => Math.round(node.getBoundingClientRect().top));

      return new Set(topValues).size;
    });

    expect(rows).toBe(1);
  });

  test("uses compact badge corners", async ({ page }) => {
    await expect(page.locator("#preview .phi-badge").first()).toHaveCSS("border-radius", "6px");
  });

  test("shows an explicit preview snippet", async ({ page }) => {
    const preview = page.locator("#preview");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(snippet).toContainText('<div class="flex flex-wrap items-center gap-2">');
    await expect(snippet).toContainText('<Badge variant="primary">Primary</Badge>');
    await expect(snippet).not.toContainText("v-for");
  });

  test("keeps snippet copy buttons visible", async ({ page }) => {
    await expect(page.locator("#preview .docs-code-copy")).toHaveCSS("opacity", "1");
  });

  test("shows code snippets for every example", async ({ page }) => {
    const examples = page.locator("#examples");

    await expect(examples.locator(".docs-component-example")).toHaveCount(5);
    await expect(examples.locator(".docs-code-block")).toHaveCount(5);
    await expect(examples.locator(".docs-code-block").nth(0)).toContainText(
      '<Badge variant="primary">Primary</Badge>',
    );
    await expect(examples.locator(".docs-code-block").nth(1)).toContainText('<Badge variant="neutral">Neutral</Badge>');
    await expect(examples.locator(".docs-code-block").nth(2)).toContainText(
      '<Badge variant="secondary">New</Badge>',
    );
    await expect(examples.locator(".docs-code-block").nth(3)).toContainText(
      '<Badge :icon="PhCheckCircle"',
    );
    await expect(examples.locator(".docs-code-block").nth(4)).toContainText(
      '<Link href="/docs/components/badge#api" variant="plain">',
    );
    await expect(examples.locator(".docs-code-block").filter({ hasText: "v-for" })).toHaveCount(0);
  });

  test("renders icons and linked Badge feedback", async ({ page }) => {
    const examples = page.locator("#examples .docs-component-example");
    const iconExample = examples.nth(3);
    const iconBadge = iconExample.locator(".phi-badge");

    await expect(iconBadge).toHaveText("Verified");
    await expect(iconBadge.locator(".phi-badge__icon")).toHaveAttribute("aria-hidden", "true");
    await expect(iconBadge.locator(".phi-badge__icon svg")).toHaveCount(1);

    const linkedExample = examples.nth(4);
    const link = linkedExample.getByRole("link", { name: "View API" });
    const linkedBadge = link.locator(".phi-badge");

    await expect(link).toHaveAttribute("href", "/docs/components/badge#api");
    await expect(linkedBadge).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(linkedBadge).toHaveCSS("box-shadow", "none");

    const badgeColor = await linkedBadge.evaluate((element) => getComputedStyle(element).color);

    await link.hover();
    await expect
      .poll(() => linkedBadge.evaluate((element) => getComputedStyle(element).boxShadow))
      .toBe(`${badgeColor} 0px 0px 0px 1px`);

    // The focus ring follows the badge silhouette instead of the default link radius.
    await expect(link).toHaveCSS("border-radius", "6px");
  });

  test("uses dark mode semantic colors", async ({ page }) => {
    await page.evaluate(() => document.documentElement.setAttribute("data-mode", "dark"));

    await expect(page.locator("#preview .phi-badge--error")).toHaveCSS(
      "background-color",
      "oklch(0.429 0.176 28.7 / 0.17)",
    );
    await expect(page.locator("#preview .phi-badge--error")).toHaveCSS("color", "oklch(0.704 0.191 22.216)");
    await expect(page.locator("#preview .phi-badge--primary")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  });
});
