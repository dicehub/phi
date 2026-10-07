import { expect, test, type Locator, type Page } from "@playwright/test";

const example = (page: Page, variant: string) => page.locator(`.slider-demo--${variant}`);
const geometry = (root: Locator) => root.evaluate(element => {
  const rect = (selector: string) => element.querySelector(selector)!.getBoundingClientRect();
  const track = rect(".phi-slider__track");
  const fill = rect(".phi-slider__indicator");
  const thumb = rect(".phi-slider__thumb");
  const grip = rect(".phi-slider__grip");
  return {
    startGap: fill.left - track.left, endGap: track.right - fill.right,
    thumbStartGap: thumb.left - track.left, thumbEndGap: track.right - thumb.right,
    gripOffset: (grip.left + grip.right - thumb.left - thumb.right) / 2,
    width: fill.width,
  };
});

test.beforeEach(async ({ page }) => { await page.goto("/docs/components/slider"); });

test("supports controlled numeric values, keyboard changes, and commit events", async ({ page }) => {
  const ids = await page.locator(".phi-slider [id], .phi-slider[id]").evaluateAll(elements => elements.map(element => element.id));
  expect(new Set(ids).size).toBe(ids.length);
  const preview = example(page, "preview");
  const thumb = preview.getByRole("slider", { name: "Volume", exact: true });
  await expect(thumb).toHaveAttribute("aria-valuenow", "40");
  await thumb.focus();
  await page.keyboard.press("ArrowRight");
  await expect(thumb).toHaveAttribute("aria-valuenow", "41");
  await expect(preview.getByLabel("Selected volume")).toHaveText("41");
  await expect(preview.getByLabel("Change events")).toHaveText("1 changes; 1 completed");
  await expect(preview.getByLabel("Completed volume")).toHaveText("41");
  await page.keyboard.press("Home");
  await expect(thumb).toHaveAttribute("aria-valuenow", "0");
  await page.keyboard.press("End");
  await expect(thumb).toHaveAttribute("aria-valuenow", "100");
  await page.keyboard.press("PageDown");
  await expect(thumb).toHaveAttribute("aria-valuenow", "90");
});

test("fills the track at both ends and centers the grips", async ({ page }) => {
  const preview = example(page, "preview");
  for (const button of ["Set minimum", "Set maximum"]) {
    await preview.getByRole("button", { name: button }).click();
    await expect.poll(async () => Math.abs((await geometry(preview)).gripOffset)).toBeLessThan(0.5);
    const measured = await geometry(preview);
    expect(measured.width).toBeGreaterThanOrEqual(15.5);
    expect(measured.startGap).toBeCloseTo(0, 0);
    expect(measured.endGap).toBeGreaterThanOrEqual(-0.5);
    if (button === "Set minimum") expect(measured.thumbStartGap).toBeCloseTo(0, 0);
    else {
      expect(measured.thumbEndGap).toBeCloseTo(0, 0);
      expect(measured.endGap).toBeCloseTo(0, 0);
    }
  }
  const range = example(page, "range");
  await range.getByRole("button", { name: "Set full range" }).click();
  await expect(range.getByRole("slider", { name: "Minimum price", exact: true })).toHaveAttribute("aria-valuenow", "0");
  await expect(range.getByRole("slider", { name: "Maximum price", exact: true })).toHaveAttribute("aria-valuenow", "100");
  const measured = await geometry(range);
  expect(measured.startGap).toBeCloseTo(0, 0);
  expect(measured.endGap).toBeCloseTo(0, 0);
});

test("names both range thumbs and keeps them in order", async ({ page }) => {
  const range = example(page, "range");
  const lower = range.getByRole("slider", { name: "Minimum price", exact: true });
  const upper = range.getByRole("slider", { name: "Maximum price", exact: true });
  await lower.focus();
  await page.keyboard.press("ArrowRight");
  await expect(range.getByLabel("Selected range")).toHaveText("26, 75");
  await page.keyboard.press("End");
  await expect(lower).toHaveAttribute("aria-valuenow", "75");
  await expect(upper).toHaveAttribute("aria-valuenow", "75");
});

test("supports pointer dragging and reports the completed value", async ({ page }) => {
  const preview = example(page, "preview");
  const thumb = preview.getByRole("slider", { name: "Volume", exact: true });
  await expect(thumb).toBeVisible();
  await thumb.scrollIntoViewIfNeeded();
  const bounds = (await thumb.boundingBox())!;
  const track = (await preview.locator(".phi-slider__track").boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(track.x + track.width * 0.75, bounds.y + bounds.height / 2, { steps: 6 });
  await page.mouse.up();
  await expect.poll(async () => Number(await thumb.getAttribute("aria-valuenow"))).toBeGreaterThan(65);
  await expect(preview.getByLabel("Change events")).toContainText("1 completed");
});

test("formats visible and accessible values and honors step", async ({ page }) => {
  const formatted = example(page, "formatted");
  const thumb = formatted.getByRole("slider", { name: "Budget", exact: true });
  await expect(thumb).toHaveAttribute("aria-valuetext", "$250");
  await expect(formatted.locator(".phi-slider__badge")).toHaveText("$250");
  await expect(formatted.locator(".phi-slider__limits")).toHaveText("$0$500");
  await thumb.focus();
  await page.keyboard.press("ArrowRight");
  await expect(thumb).toHaveAttribute("aria-valuetext", "$260");
  await expect(example(page, "small").locator(".phi-slider__frame")).toHaveCSS("height", "24px");
});

test("keeps disabled and read-only values unchanged", async ({ page }) => {
  const disabled = example(page, "disabled").getByRole("slider", { name: "Disabled", exact: true });
  await expect(disabled).toHaveAttribute("aria-disabled", "true");
  await expect(disabled).not.toHaveAttribute("tabindex", "0");
  const readOnly = example(page, "disabled").getByRole("slider", { name: "Read only", exact: true });
  await readOnly.focus();
  await expect(readOnly).toHaveCSS("outline-style", "solid");
  await expect(readOnly).toHaveAttribute("aria-readonly", "true");
  await expect(readOnly).toHaveAttribute("aria-invalid", "true");
  await expect(readOnly).toHaveAccessibleDescription("This value is fixed until the account is verified.");
  await page.keyboard.press("ArrowRight");
  await expect(readOnly).toHaveAttribute("aria-valuenow", "50");
});

test("submits native form values and resets an uncontrolled slider", async ({ page }) => {
  const form = example(page, "form");
  const thumb = form.getByRole("slider", { name: "Gain", exact: true });
  await thumb.focus();
  await page.keyboard.press("ArrowRight");
  await form.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(form.getByLabel("Submitted values")).toHaveText('[["gain","31"]]');
  await form.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(thumb).toHaveAttribute("aria-valuenow", "30");
});

test("resets only the associated form when it differs from the ancestor", async ({ page }) => {
  const form = example(page, "external-form");
  const thumb = form.getByRole("slider", { name: "External gain", exact: true });
  await thumb.focus();
  await page.keyboard.press("ArrowRight");
  await expect(thumb).toHaveAttribute("aria-valuenow", "31");
  await form.getByRole("button", { name: "Reset other form", exact: true }).click();
  await expect(thumb).toHaveAttribute("aria-valuenow", "31");
  await form.getByRole("button", { name: "Submit owner", exact: true }).click();
  await expect(form.getByLabel("Submitted values")).toHaveText('[["external-gain","31"]]');
  await form.getByRole("button", { name: "Reset owner", exact: true }).click();
  await expect(thumb).toHaveAttribute("aria-valuenow", "30");
  await form.getByRole("button", { name: "Submit owner", exact: true }).click();
  await expect(form.getByLabel("Submitted values")).toHaveText('[["external-gain","30"]]');
});

test("honors canceled reset after an actual reset-button click", async ({ page }) => {
  const form = example(page, "canceled-reset");
  const thumb = form.getByRole("slider", { name: "Retained gain", exact: true });
  await thumb.focus();
  await page.keyboard.press("ArrowRight");
  await form.getByRole("button", { name: "Keep values", exact: true }).click();
  await form.getByRole("button", { name: "Submit retained", exact: true }).click();
  await expect(thumb).toHaveAttribute("aria-valuenow", "31");
  await expect(form.getByLabel("Submitted values")).toHaveText('[["retained-gain","31"]]');
});

test("clamps changed bounds and gaps, snaps step changes, and retains the new values", async ({ page }) => {
  const bounds = example(page, "bounds");
  const scalar = bounds.getByRole("slider", { name: "Bounded value", exact: true });
  const range = bounds.getByRole("slider", { name: "Bounded range", exact: true });
  await bounds.getByRole("button", { name: "Limit to 50", exact: true }).click();
  await expect(scalar).toHaveAttribute("aria-valuenow", "50");
  await expect(range.nth(0)).toHaveAttribute("aria-valuenow", "45");
  await expect(range.nth(1)).toHaveAttribute("aria-valuenow", "50");
  await scalar.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(scalar).toHaveAttribute("aria-valuenow", "49");
  await bounds.getByRole("button", { name: "Set step 10", exact: true }).click();
  await expect(scalar).toHaveAttribute("aria-valuenow", "50");
  await expect(range.nth(0)).toHaveAttribute("aria-valuenow", "0");
  await expect(range.nth(1)).toHaveAttribute("aria-valuenow", "50");
  await bounds.getByRole("button", { name: "Restore limit", exact: true }).click();
  await expect(scalar).toHaveAttribute("aria-valuenow", "50");
  await expect(range.nth(0)).toHaveAttribute("aria-valuenow", "0");
  const root = scalar.locator("xpath=ancestor::*[contains(@class, 'phi-slider')][1]");
  const measured = await geometry(root);
  expect(measured.thumbStartGap).toBeGreaterThanOrEqual(-0.5);
  expect(measured.thumbEndGap).toBeGreaterThanOrEqual(-0.5);
});

test("reverses keyboard direction in RTL and keeps the grip centered", async ({ page }) => {
  const root = example(page, "rtl");
  const thumb = root.getByRole("slider", { name: "RTL volume", exact: true });
  await thumb.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(thumb).toHaveAttribute("aria-valuenow", "41");
  const measured = await geometry(root);
  expect(measured.gripOffset).toBeCloseTo(0, 0);
  expect(measured.endGap).toBeCloseTo(0, 0);
});

test("keeps offset-minimum event payloads and native form values consistent", async ({ page }) => {
  const form = example(page, "decimal");
  const thumb = form.getByRole("slider", { name: "Rate", exact: true });
  await expect(thumb).toHaveAttribute("aria-valuenow", "0.201");
  await expect(thumb).toHaveAttribute("aria-valuemin", "0.001");
  await expect(thumb).toHaveAttribute("aria-valuemax", "1");
  await thumb.focus();
  await page.keyboard.press("ArrowRight");
  await expect(thumb).toHaveAttribute("aria-valuenow", "0.301");
  await expect(thumb).toHaveAttribute("aria-valuetext", "0.301");
  await expect(form.getByLabel("Changed rate")).toHaveText("0.301");
  await expect(form.getByLabel("Completed rate")).toHaveText("0.301");
  await form.getByRole("button", { name: "Submit rate", exact: true }).click();
  await expect(form.getByLabel("Submitted values")).toHaveText('[["rate","0.301"],["exact-span[]","0"],["exact-span[]","0.3"],["offset-units[]","3.1"],["offset-units[]","4.1"]]');
  const range = form.getByRole("slider", { name: "Offset range", exact: true });
  await expect(range.nth(0)).toHaveAttribute("aria-valuenow", "0.901");
  await expect(range.nth(1)).toHaveAttribute("aria-valuenow", "0.901");
  const exact = form.getByRole("slider", { name: "Exact decimal span", exact: true });
  await expect(exact.nth(0)).toHaveAttribute("aria-valuenow", "0");
  await expect(exact.nth(1)).toHaveAttribute("aria-valuenow", "0.3");
  const units = form.getByRole("slider", { name: "Offset units", exact: true });
  await expect(units.nth(0)).toHaveAttribute("aria-valuenow", "3.1");
  await expect(units.nth(0)).toHaveAttribute("aria-valuemax", "3.1");
  await expect(units.nth(1)).toHaveAttribute("aria-valuenow", "4.1");
  const fractional = form.getByRole("slider", { name: "Fractional limit", exact: true });
  await expect(fractional).toHaveAttribute("aria-valuenow", "0.9");
  await expect(fractional).toHaveAttribute("aria-valuemax", "0.96");
  await fractional.focus();
  await page.keyboard.press("End");
  await expect(fractional).toHaveAttribute("aria-valuenow", "0.9");
});

test("drops completion values from a canceled drag before reset and re-enable", async ({ page }) => {
  const form = example(page, "availability");
  const thumb = form.getByRole("slider", { name: "Availability", exact: true });
  await thumb.scrollIntoViewIfNeeded();
  const rect = (await thumb.boundingBox())!;
  const track = (await form.locator(".phi-slider__track").boundingBox())!;
  await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
  await page.mouse.down();
  await page.mouse.move(track.x + track.width * 0.75, rect.y + rect.height / 2, { steps: 6 });
  await expect.poll(async () => Number(await thumb.getAttribute("aria-valuenow"))).toBeGreaterThan(65);
  await form.getByRole("button", { name: "Disable slider", exact: true }).evaluate(button => (button as HTMLButtonElement).click());
  await expect(thumb).toHaveAttribute("aria-disabled", "true");
  await page.mouse.up();
  await form.getByRole("button", { name: "Reset availability", exact: true }).click();
  await expect(thumb).toHaveAttribute("aria-valuenow", "40");
  await form.getByRole("button", { name: "Enable slider", exact: true }).click();
  await thumb.click();
  await expect(form.getByLabel("Completed availability")).toHaveText("40");
  await form.getByRole("button", { name: "Submit availability", exact: true }).click();
  await expect(form.getByLabel("Submitted values")).toHaveText('[["availability","40"]]');
});

test("fits a narrow viewport in both themes and appears in docs navigation", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await expect(page.getByRole("heading", { name: "Slider", level: 1 })).toBeVisible();
  for (const mode of ["light", "dark"]) {
    await expect(page.locator("html")).toHaveAttribute("data-mode", mode);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (mode === "light") await page.getByRole("button", { name: "Toggle theme" }).first().click();
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator(".docs-sidebar-panel--desktop").getByRole("link", { name: "Slider", exact: true })).toHaveAttribute("href", "/docs/components/slider");
});
