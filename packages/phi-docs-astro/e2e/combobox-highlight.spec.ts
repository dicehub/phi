import { expect, test } from "@playwright/test";

for (const mode of ["light", "dark"]) {
  test(`uses the tint highlight for Combobox keyboard and pointer selection in ${mode} mode`, async ({ page }) => {
    await page.goto("/docs/components/combobox");
    if (mode === "dark") await page.getByRole("button", { name: "Toggle theme" }).first().click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", mode);
    const input = page.locator("#preview").getByPlaceholder("Please select");
    await input.click();
    await input.selectText();
    await input.pressSequentially("blue");
    await input.press("ArrowDown");
    const item = page.getByRole("option", { name: "Blueberry", exact: true });
    await expect(item).toHaveAttribute("data-highlighted", "");
    const tint = await item.evaluate(element => {
      const probe = document.createElement("span");
      probe.style.backgroundColor = "var(--color-phi-tint)";
      element.append(probe);
      const color = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return color;
    });
    await expect(item).toHaveCSS("background-color", tint);
    await item.hover();
    await expect(item).toHaveCSS("background-color", tint);
    await input.press("Enter");
    await expect(input).toHaveValue("Blueberry");
    await expect(page.locator('.phi-combobox-content[data-state="open"]')).toHaveCount(0);
  });
}
