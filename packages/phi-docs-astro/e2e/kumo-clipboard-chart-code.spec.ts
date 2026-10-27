import { expect, test } from "@playwright/test";

test("masked ClipboardText hides, reveals, and copies the original value", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: async (text: string) => { document.documentElement.dataset.copiedValue = text; },
    });
  });
  await page.goto("/docs/components/clipboard-text");
  const demo = page.locator("#masked-values + p + .docs-component-example .phi-clipboard-text");
  const value = demo.locator(".phi-clipboard-text__value");
  const reveal = demo.getByRole("button", { name: "Reveal value" });
  await expect(value).toHaveText("••••••••");
  await expect(demo).not.toContainText("sk_live_abc123");
  await expect(reveal).toHaveAttribute("aria-pressed", "false");
  await demo.getByRole("button", { name: "Copy to clipboard" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-copied-value", "sk_live_abc123");
  await expect(value).toHaveText("••••••••");
  await reveal.focus();
  await page.keyboard.press("Enter");
  const hide = demo.getByRole("button", { name: "Hide value" });
  await expect(hide).toBeFocused();
  await expect(hide).toHaveAttribute("aria-pressed", "true");
  await expect(value).toHaveText("sk_live_abc123");
  await page.keyboard.press("Space");
  await expect(value).toHaveText("••••••••");
  await expect(reveal).toBeFocused();
  const form = page.locator("[data-masked-form]");
  await form.getByLabel("Copy alternate value").check();
  await form.getByLabel("Custom action labels").check();
  await demo.getByRole("button", { name: "Copy token" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-copied-value", "alternate-secret");
  await demo.getByRole("button", { name: "Show token" }).click();
  await expect(value).toHaveText("sk_live_abc123");
  await demo.getByRole("button", { name: "Hide token" }).click();
  await expect(value).toHaveText("••••••••");
  await expect(form.getByLabel("Form submissions")).toHaveText("0");
  await expect(page.locator("#preview").getByRole("button", { name: "Reveal value" })).toHaveCount(0);
});

test("TimeseriesChart defaults to hiding overlapping labels and updates the option", async ({ page }) => {
  await page.goto("/docs/charts/timeseries");
  const demo = page.locator("[data-large-dataset-demo]");
  await expect(demo.locator("canvas").first()).toBeVisible();
  for (const expected of [true, false, true]) {
    await expect(async () => {
      await demo.getByRole("button", { name: "Read chart summary" }).click();
      await expect(demo.locator("[data-label-summary]")).toHaveText(String(expected));
    }).toPass();
    await demo.getByRole("button", { name: "Hide overlapping labels" }).click();
  }
});

test("fallback code resets global pre and code styles in both variants", async ({ page }) => {
  await page.goto("/docs/components/code-highlighted");
  await page.addStyleTag({ content: "pre { border-radius: 20px; border: 7px solid red; background: red; margin: 20px; padding: 30px; } code { border: 4px solid red; background: red; margin: 10px; padding: 10px; }" });
  const demo = page.locator("[data-code-fallback-demo]");
  await demo.scrollIntoViewIfNeeded();
  const fallback = demo.locator("pre");
  await expect(fallback).toHaveCount(4);
  for (const pre of await fallback.all()) {
    await expect(pre).toHaveCSS("border-radius", "0px");
    await expect(pre).toHaveCSS("border-top-width", "0px");
    await expect(pre).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(pre).toHaveCSS("margin", "0px");
    await expect(pre.locator("code")).toHaveCSS("padding", "0px");
    await expect(pre.locator("code")).toHaveCSS("border-top-width", "0px");
    await expect(pre.locator("code")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  }
  for (const pre of await demo.locator(".phi-code-highlighted--plain pre").all()) {
    await expect(pre).toHaveCSS("padding", "0px");
  }
  for (const pre of await demo.locator(".phi-code-highlighted--default pre").all()) {
    await expect(pre).toHaveCSS("padding", "16px");
  }
});
