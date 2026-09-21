import { expect, type Locator, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

async function expectTooltip(page: Page, trigger: Locator, text: string, delay = 700) {
  await trigger.scrollIntoViewIfNeeded();
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveCSS("cursor", "pointer");

  const triggerBox = await trigger.boundingBox();
  expect(triggerBox).not.toBeNull();

  await page.mouse.move(4, 4);
  await page.mouse.move(triggerBox!.x + triggerBox!.width / 2, triggerBox!.y + triggerBox!.height / 2, { steps: 5 });
  await expect(trigger).toHaveAttribute("aria-describedby", /^tooltip:/, { timeout: Math.max(5000, delay + 2000) });

  const tooltipId = await trigger.getAttribute("aria-describedby");
  const tooltip = page.locator(`[id="${tooltipId}"]`);
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toContainText(text);

  const tooltipBox = await tooltip.boundingBox();
  expect(tooltipBox).not.toBeNull();
  expect(tooltipBox!.y).toBeGreaterThanOrEqual(0);
  expect(tooltipBox!.x).toBeGreaterThanOrEqual(0);
  expect(tooltipBox!.x + tooltipBox!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  expect(Math.abs(tooltipBox!.x + tooltipBox!.width / 2 - (triggerBox!.x + triggerBox!.width / 2))).toBeLessThan(170);

  await page.mouse.move(4, 4);
  await expect(tooltip).toHaveCount(0);
}

test.describe("Tooltip", () => {
  test("inherits line height for nested truncated Text", async ({ page }) => {
    await page.goto("/docs/components/tooltip#custom-trigger");
    const text = page.locator(".tooltip-demo__nested-text");
    await expect(text).toHaveCSS("line-height", "28px");
    await expect(text).toHaveCSS("height", "28px");
    await expect(text).toHaveCSS("text-overflow", "ellipsis");
    await expectTooltip(page, text.locator(".."), "Project environments");
  });

  test("keeps deep-linked examples interactive and positioned near their triggers", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/docs/components/tooltip#basic-tooltip");

    await expect(page.locator("main h1").first()).toHaveText("Tooltip");
    await expect(page.locator("#basic-tooltip")).toBeInViewport();
    await expect(page.locator(".docs-component-example")).toHaveCount(6);

    await expectTooltip(page, exampleById(page, "basic-tooltip").getByRole("button", { name: "Add" }), "Add");

    await page.goto("/docs/components/tooltip#multiple-tooltips");
    await expect(page.locator("#multiple-tooltips")).toBeInViewport();

    const multiple = exampleById(page, "multiple-tooltips");
    await expectTooltip(page, multiple.getByRole("button", { name: "Add" }), "Add");
    await expectTooltip(page, multiple.getByRole("button", { name: "Change language" }), "Change language");

    await expectTooltip(
      page,
      exampleById(page, "long-content-overflow").getByRole("button", { name: "Near left edge" }),
      "Lorem ipsum",
    );
    await expectTooltip(
      page,
      exampleById(page, "delay-control").getByRole("button", { name: "Instant + 1s close" }),
      "Instant open",
      100,
    );
    await expectTooltip(page, exampleById(page, "custom-trigger").getByRole("button", { name: "Help" }), "Click to learn");

    const duplicateTooltipIds = await page.locator("[data-scope='tooltip'][id]").evaluateAll((elements) => {
      const counts = new Map<string, number>();

      for (const element of elements) {
        counts.set(element.id, (counts.get(element.id) ?? 0) + 1);
      }

      return [...counts.entries()].filter(([, count]) => count > 1);
    });

    expect(duplicateTooltipIds).toEqual([]);
  });
});
