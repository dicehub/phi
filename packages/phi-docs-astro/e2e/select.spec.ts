import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

const box = async (locator: ReturnType<Page["locator"]>) => {
  const result = await locator.boundingBox();
  if (!result) throw new Error("Expected element to have a bounding box");

  return {
    height: Math.round(result.height),
    width: Math.round(result.width),
    x: Math.round(result.x),
    y: Math.round(result.y),
  };
};

const topDelta = async (source: ReturnType<Page["locator"]>, target: ReturnType<Page["locator"]>) => {
  const sourceBox = await box(source);
  const targetBox = await box(target);

  return targetBox.y - sourceBox.y;
};

const leftDelta = async (source: ReturnType<Page["locator"]>, target: ReturnType<Page["locator"]>) => {
  const sourceBox = await box(source);
  const targetBox = await box(target);

  return targetBox.x - sourceBox.x;
};

test.describe("Select", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/select");
  });

  test("uses control and base surfaces while open in both modes", async ({ page }) => {
    for (const mode of ["light", "dark"]) {
      await page.locator("html").evaluate((element, mode) => element.setAttribute("data-mode", mode), mode);
      const trigger = page.locator("#preview .phi-select-trigger");
      await trigger.click();
      const popup = page.locator(".phi-select-content[data-state='open']");
      await expect(popup).toBeVisible();
      for (const [element, token] of [[trigger, "--phi-control"], [popup, "--phi-base"]] as const) {
        await expect.poll(() => element.evaluate((node, token) => {
          const probe = document.createElement("div");
          probe.style.backgroundColor = `var(${token})`;
          node.appendChild(probe);
          const expected = getComputedStyle(probe).backgroundColor;
          probe.remove();
          return getComputedStyle(node).backgroundColor === expected;
        }, token), { message: `${mode}: expected ${token} surface` }).toBe(true);
      }
      await page.keyboard.press("Escape");
    }
  });

  test("renders the preview select with a popup anchored below the trigger", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/docs/components/select");

    const preview = page.locator("#preview");
    const trigger = preview.locator(".phi-select-trigger");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(page.locator("main h1").first()).toHaveText("Select");
    await expect(page.locator(".docs-page-header__primitive-link")).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/select",
    );
    await expect(trigger).toHaveText(/Apple/);
    await expect(snippet).toContainText('from "@dicehub/phi/components/select"');
    await expect.poll(() => box(trigger)).toMatchObject({ width: 200, height: 36 });

    await trigger.click();
    const popup = page.locator(".phi-select-content[data-state='open']");
    const firstOption = popup.locator(".phi-select-item").first();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect.poll(() => box(popup)).toMatchObject({ width: 200, height: 108 });
    await expect.poll(() => box(firstOption)).toMatchObject({ width: 188, height: 32 });
    await expect(firstOption).toHaveCSS("background-color", "oklch(0.97 0 0)");
    await expect.poll(() => leftDelta(trigger, popup)).toBe(0);
    await expect.poll(() => topDelta(trigger, popup)).toBe(40);

    await popup.getByRole("option", { name: "Banana" }).click();
    await expect(trigger.locator(".phi-select-value")).toHaveText("Banana");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect.poll(() => topDelta(trigger, popup)).toBe(40);

    await popup.getByRole("option", { name: "Cherry" }).click();
    await expect(trigger.locator(".phi-select-value")).toHaveText("Cherry");
    await trigger.click();
    await expect.poll(() => topDelta(trigger, popup)).toBe(40);
  });

  test("matches the documented example structure and interactive states", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/docs/components/select");

    await expect(page.locator("#examples .docs-component-example")).toHaveCount(16);
    await expect(page.locator(".docs-page-toc a")).toContainText([
      "Basic",
      "Sizes",
      "Without Visible Label",
      "With Description",
      "With Error",
      "Placeholder",
      "Label with Tooltip",
      "Custom Rendering",
      "Loading",
      "Multiple Selection",
      "More Example",
      "Disabled Options",
      "Disabled Items (via items prop)",
      "Grouped Options",
      "Groups with Disabled Options",
      "Long List (Scrolling Test)",
    ]);

    const sizeTriggers = exampleById(page, "sizes").locator(".phi-select-trigger");
    await expect.poll(() => box(sizeTriggers.nth(0))).toMatchObject({ width: 200, height: 20 });
    await expect.poll(() => box(sizeTriggers.nth(1))).toMatchObject({ width: 200, height: 26 });
    await expect.poll(() => box(sizeTriggers.nth(2))).toMatchObject({ width: 200, height: 36 });
    await expect.poll(() => box(sizeTriggers.nth(3))).toMatchObject({ width: 200, height: 40 });

    const custom = exampleById(page, "custom-rendering");
    await custom.locator(".phi-select-trigger").click();
    await page.locator(".phi-select-content[data-state='open']").getByRole("option", { name: /French/ }).click();
    await expect(custom.locator(".phi-select-value")).toContainText("French");

    const withDescription = exampleById(page, "with-description");
    await expect(withDescription.locator(".phi-select-description")).toHaveCSS("font-size", "14px");
    await expect(withDescription.locator(".phi-select-description")).toHaveCSS("color", "oklch(0.556 0 0)");

    const withError = exampleById(page, "with-error");
    await expect(withError.locator(".phi-select-error")).toHaveCSS("font-size", "14px");
    await expect(withError.locator(".phi-select-error")).toHaveCSS("color", "oklch(0.637 0.237 25.331)");

    const tooltip = exampleById(page, "label-with-tooltip");
    await expect
      .poll(() =>
        tooltip.locator(".phi-label__tooltip").evaluate((element) => getComputedStyle(element, "::after").whiteSpace),
      )
      .toBe("nowrap");

    const multiple = exampleById(page, "multiple-selection");
    const multipleTrigger = multiple.locator(".phi-select-trigger");
    await multipleTrigger.click();
    await page.locator(".phi-select-content[data-state='open']").getByRole("option", { name: "Read" }).click();
    await expect(multipleTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(multiple.locator(".phi-select-value")).toHaveText("Name, Location and 2 more");
    await page.keyboard.press("Escape");

    const disabled = exampleById(page, "disabled-options");
    await disabled.locator(".phi-select-trigger").click();
    const disabledOptions = page.locator(".phi-select-content[data-state='open'] .phi-select-item[data-disabled]");
    await expect(disabledOptions).toHaveCount(2);
    await expect(disabledOptions.first()).toHaveCSS("opacity", "0.5");
    await expect(disabledOptions.first()).toHaveCSS("pointer-events", "none");
    await page.locator(".phi-select-content[data-state='open']").getByRole("option", { name: "US West" }).click();
    await expect(disabled.locator(".phi-select-value")).toHaveText("US West");

    const disabledItems = exampleById(page, "disabled-items-via-items-prop");
    await disabledItems.locator(".phi-select-trigger").click();
    const disabledItemOptions = page.locator(".phi-select-content[data-state='open'] .phi-select-item[data-disabled]");
    await expect(disabledItemOptions).toHaveCount(2);
    await expect(disabledItemOptions.first()).toHaveCSS("pointer-events", "none");
    await page.keyboard.press("Escape");

    const grouped = exampleById(page, "grouped-options");
    await grouped.locator(".phi-select-trigger").click();
    await expect(page.locator(".phi-select-content[data-state='open'] .phi-select-group-label")).toHaveText([
      "Fruits",
      "Vegetables",
    ]);
    await expect(page.locator(".phi-select-content[data-state='open'] .phi-select-separator")).toHaveCount(1);
    await page.keyboard.press("Escape");

    const longList = exampleById(page, "long-list-scrolling-test");
    await longList.locator(".phi-select-trigger").click();
    const list = page.locator(".phi-select-content[data-state='open'] .phi-select-list");
    await expect(page.locator(".phi-select-content[data-state='open'] .phi-select-item")).toHaveCount(50);
    await expect.poll(async () => ({
      clientHeight: await list.evaluate((element) => element.clientHeight),
      scrollHeight: await list.evaluate((element) => element.scrollHeight),
    })).toMatchObject({ clientHeight: 340, scrollHeight: 1600 });
  });

  test("documents the Select API and keeps the sidebar entry real", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/docs/components/select");

    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(5);
    await expect(page.locator("#api-reference")).toContainText("modelValue / v-model");
    await expect(page.locator("#api-reference")).toContainText("hideLabel");
    await expect(page.locator("#api-reference")).toContainText("@value-change");
    await expect(page.locator("#api-reference")).toContainText("Select.GroupLabel");

    const sidebar = page.locator(".docs-sidebar-panel--desktop");
    const labels = await sidebar.locator(".docs-nav-group__panel a").evaluateAll((items) =>
      items.map((item) => item.textContent?.trim()),
    );
    expect(labels.indexOf("Select")).toBe(labels.indexOf("Radio") + 1);
    await expect(sidebar.getByRole("link", { name: "Select" })).toHaveAttribute("href", "/docs/components/select");
  });
});
