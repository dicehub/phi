import { expect, type Locator, type Page, test } from "@playwright/test";

const example = (page: Page, id: string) => page.locator(`#${id}`).locator(
  "xpath=following-sibling::div[contains(@class, 'docs-component-example')][1]",
);

const semanticColor = (target: Locator, name: string) => target.evaluate((element, name) => {
  const probe = document.createElement("span");
  probe.style.color = `var(${name})`;
  element.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}, name);

const cases = [
  { component: "radio", example: "radio-card", owner: ".phi-radio-group", description: ".phi-radio__description", fontSize: 13, role: "radio", name: /^Free\b/ },
  { component: "checkbox", example: "standalone-checkbox-card", owner: ".phi-checkbox-item", description: ".phi-checkbox__description", fontSize: 13, role: "checkbox", name: /^Usage alerts\b/ },
  { component: "radio", example: "with-description", owner: ".phi-radio-group", description: ".phi-radio-group__description", fontSize: 13, role: "radio", name: /^Standard \(5-7 days\)/ },
  { component: "checkbox", example: "checkbox-group", owner: ".phi-checkbox-group", description: ".phi-checkbox-group__description", fontSize: 13, role: "checkbox", name: /^Email notifications\b/ },
  { component: "switch", example: "switch-group", owner: ".phi-switch-group", description: ".phi-switch-group__description", fontSize: 14, role: "switch", name: /^Email notifications\b/ },
] as const;

for (const item of cases) {
  test(`${item.component} ${item.example} descriptions remain readable in narrow layouts`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/docs/components/${item.component}`);
    const demo = example(page, item.example);
    const owner = demo.locator(item.owner).first();
    const description = owner.locator(item.description).first();
    await expect(description).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    // A consumer can place the control in a narrow form column.
    await owner.evaluate((element) => {
      const style = (element as HTMLElement).style;
      style.width = "180px";
      style.maxWidth = "100%";
    });

    for (const mode of ["light", "dark"]) {
      await page.locator("html").evaluate((element, mode) => element.setAttribute("data-mode", mode), mode);
      const metrics = await description.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          fontSize: parseFloat(style.fontSize),
          lineHeight: parseFloat(style.lineHeight),
          height: element.getBoundingClientRect().height,
          fits: element.scrollWidth <= element.clientWidth + 1,
          supportsPretty: CSS.supports("text-wrap", "pretty"),
          wrapping: style.getPropertyValue("text-wrap-style"),
          whiteSpace: style.whiteSpace,
        };
      });
      expect(metrics.fontSize).toBe(item.fontSize);
      // Engines round computed line heights to different subpixel units.
      expect(Math.abs(metrics.lineHeight - item.fontSize * 1.375)).toBeLessThanOrEqual(0.02);
      expect(metrics.height).toBeGreaterThan(metrics.lineHeight * 1.8);
      expect(metrics.fits).toBe(true);
      if (metrics.supportsPretty) expect(metrics.wrapping).toBe("pretty");
      else expect(metrics.whiteSpace).toBe("normal");
      await expect(description).toHaveCSS("color", await semanticColor(description, "--phi-subtle"));
    }

    // Wrapping must preserve each native control's name and keyboard behavior.
    const first = owner.getByRole(item.role).first();
    await expect(first).toHaveAccessibleName(item.name);
    await first.focus();
    await expect(first).toBeFocused();
    if (item.role === "radio") {
      await page.keyboard.press("ArrowDown");
      await expect(owner.getByRole("radio").nth(1)).toBeChecked();
    } else if (item.role === "switch") {
      const wasChecked = await first.getAttribute("aria-checked") === "true";
      await page.keyboard.press("Space");
      await expect(first).toHaveAttribute("aria-checked", String(!wasChecked));
    } else {
      const wasChecked = await first.isChecked();
      await page.keyboard.press("Space");
      if (wasChecked) await expect(first).not.toBeChecked();
      else await expect(first).toBeChecked();
    }
  });
}

for (const item of [
  { component: "radio", example: "with-error", lineHeight: 13 * 1.176 },
  { component: "checkbox", example: "checkbox-group-with-error", lineHeight: 20 },
] as const) {
  test(`${item.component} group errors retain their existing spacing and validation state`, async ({ page }) => {
    await page.goto(`/docs/components/${item.component}`);
    const group = example(page, item.example).locator("fieldset").first();
    const error = group.locator(`.phi-${item.component}-group__error`);
    await expect(error).toBeVisible();
    await expect(group).toHaveAttribute("aria-invalid", "true");
    const lineHeight = await error.evaluate((element) => parseFloat(getComputedStyle(element).lineHeight));
    expect(Math.abs(lineHeight - item.lineHeight)).toBeLessThanOrEqual(0.02);
    await expect(error).toHaveCSS("color", await semanticColor(error, "--phi-danger"));
    await expect(group.getByRole(item.component).first()).toBeEnabled();
  });
}
