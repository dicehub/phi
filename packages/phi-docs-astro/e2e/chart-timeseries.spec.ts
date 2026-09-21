import { expect, test, type Locator, type Page } from "@playwright/test";

async function hoverClusteredMarker(page: Page, canvas: Locator, tooltip: Locator) {
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error("Reference marker canvas has no bounding box");

  await page.mouse.move(box.x + 100, box.y + 200);
  const markerX = box.x + 60 + (15 / 49) * (box.width - 84);

  for (const dx of [0, -1, 1, -2, 2, -4, 4, -6, 6]) {
    for (const dy of [70, 120, 175, 230]) {
      const marker = { x: markerX + dx, y: box.y + dy };
      await page.mouse.move(marker.x, marker.y);
      if (await tooltip.isVisible()) return { box, marker };
    }
  }

  throw new Error("Could not hover the clustered reference marker");
}

test("renders the tooltip footer below values in standard and marker tooltips", async ({ page }) => {
  await page.goto("/docs/charts/timeseries#tooltip-footer");

  const section = page.locator("#tooltip-footer");
  const canvas = section.locator("canvas").first();
  await canvas.scrollIntoViewIfNeeded();
  await expect(canvas).toBeVisible();

  const box = await canvas.boundingBox();
  if (!box) throw new Error("Tooltip footer canvas has no bounding box");

  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  const seriesTooltip = section.locator(".phi-chart div[style*='z-index: 9999999']");
  await expect(seriesTooltip).toBeVisible();

  const seriesFooter = seriesTooltip.locator(".phi-chart-tooltip__footer");
  await expect(seriesFooter).toHaveText('Percentiles use a "five-minute" rolling window.');
  await expect(seriesFooter).toHaveCount(1);

  const rowBox = await seriesTooltip.locator("div[style*='justify-content:space-between']").first().boundingBox();
  const footerBox = await seriesFooter.boundingBox();
  expect(rowBox && footerBox && footerBox.y >= rowBox.y + rowBox.height).toBe(true);

  const markerTooltip = section.locator(".phi-chart-marker-tooltip");
  await hoverClusteredMarker(page, canvas, markerTooltip);
  await expect(markerTooltip).toContainText("change a1b2c3d4");
  const markerFooter = markerTooltip.locator(".phi-chart-marker-tooltip__footer");
  await expect(markerFooter).toHaveText('Percentiles use a "five-minute" rolling window.');

  const markerFooterBox = await markerFooter.boundingBox();
  const seriesRowBox = await markerTooltip.locator(".phi-chart-marker-tooltip__series-row").first().boundingBox();
  expect(
    markerFooterBox && seriesRowBox && markerFooterBox.y >= seriesRowBox.y + seriesRowBox.height,
  ).toBe(true);
});

test("formats tooltip timestamps with a custom formatter and with the locale default", async ({ page }) => {
  await page.goto("/docs/charts/timeseries#custom-timestamp-and-value-formats");

  const customSection = page.locator("#custom-timestamp-and-value-formats");
  const customCanvas = customSection.locator("canvas").first();
  await customCanvas.scrollIntoViewIfNeeded();
  await expect(customCanvas).toBeVisible();

  const customBox = await customCanvas.boundingBox();
  if (!customBox) throw new Error("Custom timestamp canvas has no bounding box");

  await page.mouse.move(customBox.x + customBox.width * 0.5, customBox.y + customBox.height * 0.5);
  const customTooltip = customSection.locator(".phi-chart div[style*='z-index: 9999999']");
  await expect(customTooltip).toBeVisible();

  const customTitle = customTooltip.locator("div[style*='font-weight:600']").first();
  await expect(customTitle).toContainText("2026");
  await expect(customTitle).toContainText(/\d{1,2}:\d{2}:\d{2}/);

  await page.goto("/docs/charts/timeseries#basic-line-chart");

  const defaultSection = page.locator("#basic-line-chart");
  const defaultCanvas = defaultSection.locator("canvas").first();
  await defaultCanvas.scrollIntoViewIfNeeded();
  await expect(defaultCanvas).toBeVisible();

  const defaultBox = await defaultCanvas.boundingBox();
  if (!defaultBox) throw new Error("Basic chart canvas has no bounding box");

  await page.mouse.move(defaultBox.x + defaultBox.width * 0.5, defaultBox.y + defaultBox.height * 0.5);
  const defaultTooltip = defaultSection.locator(".phi-chart div[style*='z-index: 9999999']");
  await expect(defaultTooltip).toBeVisible();

  const defaultTitle = defaultTooltip.locator("div[style*='font-weight:600']").first();
  await expect(defaultTitle).toContainText(/\d{1,2}:\d{2}:\d{2}/);
  await expect(defaultTitle).not.toContainText("2026");
});

test("keeps tooltip spacing unchanged when no tooltipFooter is set", async ({ page }) => {
  await page.goto("/docs/charts/timeseries#bar-chart");

  const section = page.locator("#bar-chart");
  const canvas = section.locator("canvas").first();
  await canvas.scrollIntoViewIfNeeded();
  await expect(canvas).toBeVisible();

  const box = await canvas.boundingBox();
  if (!box) throw new Error("Bar chart canvas has no bounding box");

  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  const seriesTooltip = section.locator(".phi-chart div[style*='z-index: 9999999']");
  await expect(seriesTooltip).toBeVisible();
  await expect(seriesTooltip.locator(".phi-chart-tooltip__footer")).toHaveCount(0);
});

test("adds no tooltip space for an empty tooltipFooter", async ({ page }) => {
  await page.goto("/docs/charts/timeseries#tooltip-footer-empty");

  const section = page.locator("#tooltip-footer-empty");
  const canvas = section.locator("canvas").first();
  await canvas.scrollIntoViewIfNeeded();
  await expect(canvas).toBeVisible();

  const box = await canvas.boundingBox();
  if (!box) throw new Error("Empty tooltip footer canvas has no bounding box");

  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  const seriesTooltip = section.locator(".phi-chart div[style*='z-index: 9999999']");
  await expect(seriesTooltip).toBeVisible();
  await expect(seriesTooltip.locator(".phi-chart-tooltip__footer")).toHaveCount(0);

  const markerTooltip = section.locator(".phi-chart-marker-tooltip");
  await hoverClusteredMarker(page, canvas, markerTooltip);
  await expect(markerTooltip).toContainText("change a1b2c3d4");
  await expect(markerTooltip.locator(".phi-chart-marker-tooltip__footer")).toHaveCount(0);
});

test("closes a marker tooltip outside the chart after a context-menu interaction", async ({ page }) => {
  await page.goto("/docs/charts/timeseries#reference-markers");

  const section = page.locator("#reference-markers");
  const canvas = section.locator("canvas").first();
  const tooltip = section.locator(".phi-chart-marker-tooltip");
  await canvas.scrollIntoViewIfNeeded();
  await expect(canvas).toBeVisible();

  const { box, marker } = await hoverClusteredMarker(page, canvas, tooltip);
  await expect(tooltip).toContainText("change a1b2c3d4");

  await page.evaluate(({ x, y }) => {
    document.elementFromPoint(x, y)?.dispatchEvent(new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
    }));
  }, marker);
  await expect(tooltip).toBeVisible();

  await page.evaluate(({ x, y }) => {
    window.dispatchEvent(new MouseEvent("mousemove", { clientX: x, clientY: y }));
  }, { x: box.x + box.width + 20, y: box.y + box.height / 2 });

  await expect(tooltip).toHaveCount(0);
});
