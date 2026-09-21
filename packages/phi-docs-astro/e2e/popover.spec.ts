import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("Popover", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/popover");
  });

  test("renders the preview popover with code and accessible content", async ({ page }) => {
    const preview = page.locator("#preview");
    const snippet = preview.locator(".docs-code-block pre");

    await expect(page.locator("main h1").first()).toHaveText("Popover");
    await expect(preview.getByRole("button", { name: "Notifications" })).toHaveCount(1);
    await expect(snippet).toContainText('from "@dicehub/phi/components/popover"');
    await expect(snippet).toContainText("<Popover.Content>");
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");

    await preview.getByRole("button", { name: "Notifications" }).click();
    await expect(page.locator(".phi-popover-content")).toBeVisible();
    await expect(page.locator(".phi-popover-content").getByText("You are all caught up. Good job!")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator(".phi-popover-content")).toHaveCount(0);
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Popover vs Tooltip",
      "Examples",
      "Basic Popover",
      "With Close Button",
      "Positioning",
      "Custom Content",
      "Open on Hover",
      "Virtual Anchor",
      "API Reference",
      "Popover",
      "Popover.Trigger",
      "Popover.Content",
      "Popover.Title",
      "Popover.Description",
      "Popover.Close",
    ]);
  });

  test("matches the documented popover versus tooltip comparison", async ({ page }) => {
    const comparison = page.locator("#popover-vs-tooltip");

    await expect(comparison).toContainText("Understanding when to use each is important");
    await expect(comparison).toContainText("for accessibility and user experience.");
    await expect(comparison).toContainText("Focus moves inside, traps when open");
    await expect(comparison).toContainText("Use a Tooltip");
    await expect(comparison).toContainText("Use a Popover");
    await expect(comparison.locator("code")).toHaveText(["openOnHover", 'role="tooltip"', "aria-haspopup"]);
    await expect(comparison.locator(".docs-api-table--comparison td code")).toHaveCount(2);
    await expect(comparison.locator(".docs-api-table--comparison td code").first()).toHaveCSS("display", "inline");
    await expect(comparison.locator(".docs-api-table--comparison td code").first()).toHaveCSS("border-top-style", "solid");
  });

  test("renders examples, hover trigger, virtual anchor, and API reference", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/docs/components/popover");

    const basic = exampleById(page, "basic-popover");
    const withClose = exampleById(page, "with-close-button");
    const positioning = exampleById(page, "positioning");
    const custom = exampleById(page, "custom-content");
    const hover = exampleById(page, "open-on-hover");
    const virtual = exampleById(page, "virtual-anchor");

    await expect(page.locator("#examples .docs-component-example")).toHaveCount(6);

    await basic.getByRole("button", { name: "Open Popover" }).click();
    await expect(
      page.locator(".phi-popover-content").getByText("This is a basic popover with a title and description."),
    ).toBeVisible();
    const basicContent = page.locator(".phi-popover-content").filter({ hasText: "Popover Title" });
    const basicMotion = await basicContent.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        animationName: style.animationName,
        transitionDuration: style.transitionDuration,
        transitionProperty: style.transitionProperty,
        transitionTimingFunction: style.transitionTimingFunction,
      };
    });
    expect(basicMotion.animationName).toBe("none");
    expect(basicMotion.transitionProperty).toBe("transform, scale, opacity");
    expect(basicMotion.transitionDuration).toContain("0.15s");
    expect(basicMotion.transitionTimingFunction).toContain("cubic-bezier(0.4, 0, 0.2, 1)");
    await page.keyboard.press("Escape");

    await withClose.getByRole("button", { name: "Open Settings" }).click();
    await expect(page.locator(".phi-popover-content").getByText("Configure your preferences below.")).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByText("Configure your preferences below.")).toHaveCount(1);

    await positioning.getByRole("button", { name: "Top" }).click();
    await expect(page.locator(".phi-popover-content").getByText("Popover on top.")).toBeVisible();
    await page.keyboard.press("Escape");

    await custom.getByRole("button", { name: "User Profile" }).click();
    await expect(page.locator(".phi-popover-content").getByText("Jane Doe")).toBeVisible();
    await expect(page.locator(".phi-popover-content").getByText("jane@example.com")).toBeVisible();
    await page.keyboard.press("Escape");

    await hover.getByRole("button", { name: "Hover Me" }).hover();
    const hoverContent = page.locator(".phi-popover-content").filter({ hasText: "Hover Triggered" });
    await expect(hoverContent).toBeVisible();
    const hoverBox = await hoverContent.boundingBox();
    expect(hoverBox).not.toBeNull();
    expect(hoverBox!.width).toBeGreaterThan(600);
    expect(hoverBox!.height).toBeLessThan(140);
    await page.keyboard.press("Escape");

    await virtual.getByRole("button", { name: "Actions for api-gateway" }).click();
    const virtualContent = page.locator(".phi-popover-content").filter({ hasText: "Edit api-gateway" });
    await expect(virtualContent).toBeVisible();
    await expect(virtualContent).toHaveCSS("scale", "1");
    await expect(
      page.locator(".phi-popover-content").getByText("The popover anchors to the selected row, not the icon button."),
    ).toBeVisible();
    const virtualRow = virtual.locator("tbody tr").filter({ hasText: "api-gateway" });
    const virtualButton = virtual.getByRole("button", { name: "Actions for api-gateway" });
    const rowBox = await virtualRow.boundingBox();
    const buttonBox = await virtualButton.boundingBox();
    const contentBox = await virtualContent.boundingBox();
    expect(rowBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();
    expect(contentBox).not.toBeNull();
    await expect(virtualContent).toHaveAttribute("data-placement", "bottom");
    expect(rowBox!.width).toBeGreaterThan(630);
    expect(rowBox!.width).toBeLessThan(660);
    expect(buttonBox!.width).toBeGreaterThan(13);
    expect(buttonBox!.width).toBeLessThan(15);
    expect(contentBox!.x).toBeGreaterThan(0);
    expect(contentBox!.width).toBeGreaterThan(428);
    expect(contentBox!.width).toBeLessThan(432);
    expect(contentBox!.height).toBeGreaterThan(108);
    expect(contentBox!.height).toBeLessThan(112);
    expect(contentBox!.y - rowBox!.y - rowBox!.height).toBeGreaterThan(7);
    expect(contentBox!.y - rowBox!.y - rowBox!.height).toBeLessThan(10);
    expect(Math.abs(contentBox!.x + contentBox!.width / 2 - (rowBox!.x + rowBox!.width / 2))).toBeLessThan(1);

    const apiTables = page.locator("#api-reference .docs-api-table");
    await expect(apiTables).toHaveCount(6);
    await expect(page.locator("#api-reference")).toContainText("openOnHover");
    await expect(page.locator("#api-reference")).toContainText("sideOffset");
    await expect(page.locator("#api-reference")).toContainText("anchor");
    await expect(page.locator("#api-reference")).toContainText("PopoverOpenChangeDetails");
  });

  test("positions the caret correctly on every side", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/docs/components/popover");

    const positioning = exampleById(page, "positioning");
    const cases = [
      { name: "Bottom", text: "Popover on bottom" },
      { name: "Top", text: "Popover on top" },
      { name: "Left", text: "Popover on left" },
      { name: "Right", text: "Popover on right" },
    ] as const;
    const expectedBySide = {
      bottom: { transform: "matrix(1, 0, 0, 1, 0, 2)", protrusion: "above" },
      top: { transform: "matrix(-1, 0, 0, -1, 0, 8)", protrusion: "below" },
      left: { transform: "matrix(0, 1, -1, 0, 3, 0)", protrusion: "right" },
      right: { transform: "matrix(0, -1, 1, 0, -3, 0)", protrusion: "left" },
    } as const;

    for (const entry of cases) {
      const trigger = positioning.getByRole("button", { name: entry.name });
      await trigger.click();
      const triggerBox = await trigger.boundingBox();
      if (!triggerBox) throw new Error(`Popover trigger ${entry.name} was not visible`);

      const metrics = await page.locator(".phi-popover-content").filter({ hasText: entry.text }).evaluate((content) => {
        const svg = content.querySelector(".phi-popover-arrow svg");
        if (!(svg instanceof SVGElement)) throw new Error("Popover caret was not rendered");

        const contentRect = content.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();

        return {
          protrusion: {
            above: Math.round(contentRect.top - svgRect.top),
            below: Math.round(svgRect.bottom - contentRect.bottom),
            left: Math.round(contentRect.left - svgRect.left),
            right: Math.round(svgRect.right - contentRect.right),
          },
          rect: {
            bottom: contentRect.bottom,
            left: contentRect.left,
            right: contentRect.right,
            top: contentRect.top,
          },
          transform: getComputedStyle(svg).transform,
        };
      });
      const side =
        metrics.rect.right <= triggerBox.x
          ? "left"
          : metrics.rect.left >= triggerBox.x + triggerBox.width
            ? "right"
            : metrics.rect.bottom <= triggerBox.y
              ? "top"
              : "bottom";
      const expected = expectedBySide[side];

      expect(metrics.transform).toBe(expected.transform);
      expect(metrics.protrusion[expected.protrusion]).toBeGreaterThanOrEqual(7);
      expect(metrics.protrusion[expected.protrusion]).toBeLessThanOrEqual(8);
      await page.keyboard.press("Escape");
    }
  });
});

test("Home Popover card renders a real popover control", async ({ page }) => {
  await page.goto("/");

  const card = page
    .locator(".home-gallery__item")
    .filter({ has: page.getByRole("link", { name: "Popover" }) });

  await expect(card.getByRole("link", { name: "Popover" })).toHaveAttribute("href", "/docs/components/popover");
  await expect(card.locator(".home-static--popover")).toHaveCount(0);
  await card.getByRole("button", { name: "Notifications" }).click();
  await expect(page.locator(".phi-popover-content")).toBeVisible();
  await expect(page.getByText("All caught up.")).toBeVisible();
});

test("Popover is reachable in the left docs navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sidebar = page.locator(".docs-sidebar-panel--desktop");
  const links = sidebar.locator(".docs-nav-group__panel a");
  const popover = sidebar.getByRole("link", { name: "Popover" });

  await expect(popover).toHaveAttribute("href", "/docs/components/popover");

  const labels = await links.evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(labels.indexOf("Popover")).toBe(labels.indexOf("Pagination") + 1);

  await popover.scrollIntoViewIfNeeded();

  await expect(popover).toBeInViewport();
});
