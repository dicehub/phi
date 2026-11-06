import { expect, type Page, test } from "@playwright/test";

const example = (page: Page, id: string) =>
  page.locator(`#${id}`).locator("xpath=following-sibling::div[contains(@class, 'docs-component-example')][1]");

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/skeleton-line");
});

test("sketch strokes extend 4px past each corner while the fill clips its shimmer", async ({ page }) => {
  const lines = example(page, "sketch-variant").locator('[data-variant="sketch"]');
  await expect(lines).toHaveCount(3);
  const line = lines.first();
  await expect(line).toHaveCSS("overflow", "visible");
  await expect(line).toHaveCSS("height", "8px");
  await expect(line.locator(".phi-skeleton-line__fill")).toHaveCSS("overflow", "hidden");
  await expect(line.locator(".phi-skeleton-line__fill")).toHaveCSS("border-radius", "8px");
  await expect(line.locator(".phi-skeleton-line__outline")).toHaveCSS("border-top-width", "1px");
  await expect(line.locator(".phi-skeleton-line__outline")).toHaveCSS("border-radius", "8px");

  const geometry = await line.evaluate((element) => {
    const root = element.getBoundingClientRect();
    const bounds = (edge: string) => {
      const stroke = element.querySelector(`.phi-skeleton-line__stroke--${edge}`)!.getBoundingClientRect();
      return {
        x: stroke.left - root.left,
        y: stroke.top - root.top,
        width: stroke.width,
        height: stroke.height,
      };
    };
    return { width: root.width, height: root.height, top: bounds("top"), bottom: bounds("bottom"), left: bounds("left"), right: bounds("right") };
  });

  const expectedEdges = {
    top: { x: -4, y: 0, width: geometry.width + 8, height: 1 },
    bottom: { x: -4, y: geometry.height - 1, width: geometry.width + 8, height: 1 },
    left: { x: 0, y: -4, width: 1, height: geometry.height + 8 },
    right: { x: geometry.width - 1, y: -4, width: 1, height: geometry.height + 8 },
  };
  // Bounding rectangles can differ by small fractions of a CSS pixel across browsers.
  for (const edge of ["top", "bottom", "left", "right"] as const) {
    for (const coordinate of ["x", "y", "width", "height"] as const) {
      expect(geometry[edge][coordinate], `${edge} ${coordinate}`).toBeCloseTo(expectedEdges[edge][coordinate], 2);
    }
  }

  const defaultLine = page.locator("#preview .phi-skeleton-line").first();
  await expect(defaultLine.locator(":scope > *")).toHaveCount(0);
  await expect(defaultLine).toHaveCSS("overflow", "hidden");
  await expect(defaultLine).toHaveCSS("border-radius", "2px");
  await expect(example(page, "sketch-variant")).toContainText('variant="sketch"');
  await expect(page.locator("#sketch-variant + p")).toContainText("Leave 4px");
});

test("sketch lines retain random widths, shimmer timing, block height, and class overrides", async ({ page }) => {
  const lines = example(page, "sketch-variant").locator('[data-variant="sketch"]');
  await expect(lines).toHaveCount(3);
  for (const line of await lines.all()) {
    const values = await line.evaluate((element) => {
      const style = (element as HTMLElement).style;
      const shimmer = getComputedStyle(element.querySelector(".phi-skeleton-line__fill")!, "::after");
      return {
        width: Number.parseFloat(style.getPropertyValue("--skeleton-width")),
        duration: Number.parseFloat(shimmer.animationDuration),
        delay: Number.parseFloat(shimmer.animationDelay),
        animation: shimmer.animationName,
      };
    });
    expect(values.width).toBeGreaterThanOrEqual(30);
    expect(values.width).toBeLessThanOrEqual(100);
    expect(values.duration).toBeGreaterThanOrEqual(1.3);
    expect(values.duration).toBeLessThanOrEqual(1.7);
    expect(values.delay).toBeGreaterThanOrEqual(0);
    expect(values.delay).toBeLessThanOrEqual(0.5);
    expect(values.animation).toBe("phi-skeleton-line-shimmer");
  }

  const card = example(page, "sketch-card");
  const block = card.locator(".phi-skeleton-line__block");
  const title = block.locator('[data-variant="sketch"]');
  await expect(block).toHaveCSS("height", "16px");
  const offset = await title.evaluate((element) => {
    const line = element.getBoundingClientRect();
    const wrapper = element.parentElement!.getBoundingClientRect();
    return line.top - wrapper.top;
  });
  expect(offset).toBe(4);

  const buttons = card.locator(".skeleton-line-demo__actions .phi-skeleton-line");
  await expect(buttons).toHaveCount(2);
  for (const button of await buttons.all()) {
    await expect(button).toHaveCSS("height", "36px");
    await expect(button).toHaveCSS("width", "96px");
  }
});

test("sketch fill, outline, and strokes use semantic colors in both themes", async ({ page }) => {
  const line = example(page, "sketch-variant").locator('[data-variant="sketch"]').first();
  await expect(line).toBeVisible();
  const backgrounds: string[] = [];
  for (const mode of ["light", "dark"]) {
    await page.locator("html").evaluate((element, value) => element.setAttribute("data-mode", value), mode);
    const colors = await line.evaluate((element) => {
      const probe = document.createElement("div");
      probe.style.backgroundColor = "var(--phi-recessed)";
      probe.style.borderColor = "var(--phi-interact)";
      probe.style.color = "var(--phi-fill)";
      element.append(probe);
      const expected = getComputedStyle(probe);
      const result = {
        fill: getComputedStyle(element.querySelector(".phi-skeleton-line__fill")!).backgroundColor,
        outline: getComputedStyle(element.querySelector(".phi-skeleton-line__outline")!).borderTopColor,
        stroke: getComputedStyle(element.querySelector(".phi-skeleton-line__stroke")!).backgroundColor,
        expectedFill: expected.backgroundColor,
        expectedOutline: expected.borderTopColor,
        expectedStroke: expected.color,
      };
      probe.remove();
      return result;
    });
    expect(colors.fill).toBe(colors.expectedFill);
    expect(colors.outline).toBe(colors.expectedOutline);
    expect(colors.stroke).toBe(colors.expectedStroke);
    backgrounds.push(colors.fill);
  }
  expect(backgrounds[0]).not.toBe(backgrounds[1]);
});

test("reduced motion stops both sketch and default shimmer", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const sketch = example(page, "sketch-variant").locator(".phi-skeleton-line__fill").first();
  const defaultLine = page.locator("#preview .phi-skeleton-line").first();
  await expect(sketch).toBeVisible();
  await expect.poll(() => sketch.evaluate((element) => getComputedStyle(element, "::after").animationName)).toBe("none");
  await expect.poll(() => defaultLine.evaluate((element) => getComputedStyle(element, "::after").animationName)).toBe("none");
});
