import { expect, test } from "@playwright/test";

test("Loader allows class sizes to override its SVG dimensions", async ({ page }) => {
  await page.goto("/docs/components/loader");
  const loader = page.locator("#preview .phi-loader");
  await expect(loader).toBeVisible();
  await expect(loader).toHaveCSS("width", "24px");
  await page.addStyleTag({ content: ".phi-loader { width: 48px; height: 40px; }" });
  await expect(loader).toHaveCSS("width", "48px");
  await expect(loader).toHaveCSS("height", "40px");
  await expect(loader).toHaveAttribute("width", "24");
  await expect(loader).toHaveAttribute("height", "24");
  await expect(loader).toHaveAccessibleName("Loading");
});
