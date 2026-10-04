import { expect, type Page, test } from "@playwright/test";

const exampleAfterHeading = (page: Page, name: string) =>
  page
    .getByRole("heading", { name, exact: true })
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("Banner", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/banner");
  });

  test("renders all preview variants", async ({ page }) => {
    const preview = page.locator("#preview");

    await expect(preview.locator(".phi-banner")).toHaveCount(4);
    await expect(preview.locator(".phi-banner--default")).toContainText("Update available");
    await expect(preview.locator(".phi-banner--alert")).toContainText("Session expiring");
    await expect(preview.locator(".phi-banner--error")).toContainText("Save failed");
    await expect(preview.locator(".phi-banner--secondary")).toContainText("Maintenance scheduled");
    await expect(preview.locator(".phi-banner__icon svg")).toHaveCount(4);
  });

  test("keeps expected geometry when consumed from the production package", async ({ page }) => {
    const banner = page.locator("#preview .phi-banner").first();
    const title = banner.locator(".phi-banner__title");
    const description = banner.locator(".phi-banner__description");
    const icon = banner.locator(".phi-banner__icon");

    await expect(banner).toHaveCSS("border-top-width", "0px");
    await expect(title).toHaveCSS("color", await banner.evaluate((element) => getComputedStyle(element).color));
    await expect(title).toHaveCSS("font-size", "14px");
    await expect(title).toHaveCSS("line-height", "19.25px");
    await expect(title).toHaveCSS("margin-top", "0px");
    await expect(description).toHaveCSS("font-size", "13px");
    await expect(description).toHaveCSS("line-height", "17.875px");
    await expect(icon).toHaveCSS("height", "19.25px");

    const box = await banner.boundingBox();
    expect(box?.height).toBeCloseTo(63.125, 2);
  });

  test("shows an explicit preview snippet", async ({ page }) => {
    const snippet = page.locator("#preview .docs-code-block pre");

    await expect(snippet).toContainText('from "@phosphor-icons/vue"');
    await expect(snippet).toContainText('<Banner');
    await expect(snippet).toContainText('variant="alert"');
    await expect(snippet).toContainText('variant="error"');
    await expect(snippet).toContainText('variant="secondary"');
    await expect(snippet).toContainText(':icon="PhInfo"');
    await expect(snippet).toContainText(':icon-props="{ weight: \'fill\' }"');
    await expect(snippet).not.toContainText("<template #icon>");
    await expect(snippet).not.toContainText("v-for");
  });

  test("supports accent-aware Banner.Action compounds", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Update now" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Got it" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Extend session" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Dismiss update" }).locator("svg")).toBeVisible();
    await expect(page.getByRole("button", { name: "Dismiss", exact: true })).toHaveClass(/phi-banner-action--secondary/);
    await expect(page.getByRole("button", { name: "Dismiss update" })).toHaveClass(/phi-banner-action--ghost/);
    await expect(page.locator("#examples .docs-code-block").filter({ hasText: ':icon="PhX"' })).toHaveCount(2);
    await expect(page.locator("#examples .docs-code-block").filter({ hasText: "<Banner.Action>" })).toHaveCount(3);
    await expect(page.locator("#examples")).not.toContainText("@dicehub/phi/components/button");
    await expect(page.locator("#examples")).not.toContainText("<path d=");
  });

  test("inherits action accents and sizes from the parent banner", async ({ page }) => {
    const actionExample = exampleAfterHeading(page, "With Action");
    const retry = actionExample.getByRole("button", { name: "Retry" });
    const gotIt = actionExample.getByRole("button", { name: "Got it" });
    const compactExample = exampleAfterHeading(page, "With CTA");
    const compactAction = compactExample.getByRole("button", { name: "Manage DNS" });

    await expect(retry).toHaveClass(/phi-banner-action--primary/);
    await expect(retry).toHaveClass(/phi-button--sm/);
    await expect(compactAction).toHaveClass(/phi-button--xs/);

    const accent = await retry.evaluate((button) => {
      const buttonStyles = getComputedStyle(button);
      const bannerStyles = getComputedStyle(button.closest(".phi-banner")!);

      return {
        action: buttonStyles.getPropertyValue("--phi-button-emphasis-gradient-end").trim(),
        banner: bannerStyles.getPropertyValue("--phi-banner-action-accent").trim(),
      };
    });
    expect(accent.action).toBe(accent.banner);

    await page.evaluate(() => document.documentElement.setAttribute("data-mode", "dark"));
    await expect(gotIt).toHaveCSS("color", "rgb(0, 0, 0)");
  });

  test("renders compact links inline, keeps CTAs trailing, and stacks actions on narrow screens", async ({ page }) => {
    const inlineLinkExample = exampleAfterHeading(page, "With Inline Link");
    const inlineBanner = inlineLinkExample.locator(".phi-banner--sm");
    const inlineCopy = inlineBanner.locator(".phi-banner__copy");
    const inlineDescription = inlineBanner.locator(".phi-banner__description");
    const inlineAction = inlineBanner.locator(".phi-banner__action");
    const inlineLink = inlineAction.getByRole("link", { name: "Manage DNS for puppies.example.com" });

    await expect(inlineDescription).toHaveJSProperty("tagName", "SPAN");
    await expect(inlineDescription).toHaveCSS("font-size", "13px");
    await expect(inlineDescription).toHaveCSS("line-height", "17.875px");
    await expect(inlineCopy).toHaveCSS("display", "block");
    await expect(inlineAction).toHaveCSS("display", "inline");
    await expect(inlineLink).toHaveCSS("display", "inline");
    await expect(inlineAction.locator("xpath=..")).toHaveClass(/phi-banner__copy/);

    const compactCtaExample = exampleAfterHeading(page, "With CTA");
    const compactCtaBanner = compactCtaExample.locator(".phi-banner--sm");
    const compactCtaAction = compactCtaBanner.locator(".phi-banner__action");
    await expect(compactCtaBanner.locator(".phi-banner__copy")).toHaveCSS("display", "flex");
    await expect(compactCtaAction.getByRole("button", { name: "Manage DNS" })).toHaveClass(/phi-button--xs/);
    await expect(compactCtaAction.getByRole("link")).toHaveCount(0);

    const compactWithoutAction = exampleAfterHeading(page, "Without Action");
    await expect(compactWithoutAction.locator(".phi-banner__action")).toHaveCount(0);

    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/docs/components/banner#examples");

    const actionExample = exampleAfterHeading(page, "With Multiple Actions");
    const body = actionExample.locator(".phi-banner__body");
    const banner = actionExample.locator(".phi-banner");
    const action = actionExample.locator(".phi-banner__action");
    const [bannerBox, actionBox] = await Promise.all([banner.boundingBox(), action.boundingBox()]);

    await expect(body).toHaveCSS("flex-direction", "column");
    expect(bannerBox).not.toBeNull();
    expect(actionBox).not.toBeNull();
    expect(actionBox!.x + actionBox!.width).toBeLessThanOrEqual(bannerBox!.x + bannerBox!.width + 1);
  });

  test("matches the documented examples structure", async ({ page }) => {
    const examples = page.locator("#examples");

    await expect(examples.getByRole("heading", { name: "Variants" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Default" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Alert" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Error" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Secondary" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "With Icon" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "With Action" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "With Multiple Actions" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Compact Size" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "With Inline Link" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "With CTA" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Without Action" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Custom Content" })).toBeVisible();
    await expect(examples.locator(".docs-component-example")).toHaveCount(11);
    await expect(examples.locator(".docs-code-block")).toHaveCount(11);
  });

  test("keeps code examples inside the page width", async ({ page }) => {
    const metrics = await page.evaluate(() => {
      const article = document.querySelector(".docs-article--component");
      const examples = Array.from(document.querySelectorAll(".docs-component-example"));
      const articleRect = article?.getBoundingClientRect();

      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        widestExampleRight: Math.max(...examples.map((example) => example.getBoundingClientRect().right)),
        articleRight: articleRect?.right ?? 0,
      };
    });

    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
    expect(metrics.widestExampleRight).toBeLessThanOrEqual(metrics.articleRight + 1);
  });

  test("uses dark mode banner colors", async ({ page }) => {
    await page.evaluate(() => document.documentElement.setAttribute("data-mode", "dark"));

    await expect(page.locator("#preview .phi-banner--default").first()).toHaveCSS(
      "background-color",
      "oklch(0.38 0.145 265.5 / 0.22)",
    );
    await expect(page.locator("#preview .phi-banner--default").first()).toHaveCSS("color", "oklch(0.707 0.165 254.624)");
  });
});
