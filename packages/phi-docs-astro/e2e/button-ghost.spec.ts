import { expect, test } from "@playwright/test";

for (const mode of ["light", "dark"]) {
  test(`ghost Button and LinkButton stay transparent on colored and patterned parents in ${mode} mode`, async ({ page }) => {
    await page.goto("/docs/components/button");
    await page.locator("html").evaluate((element, mode) => element.setAttribute("data-mode", mode), mode);
    const buttons = page.locator(".phi-button--ghost");
    await expect(buttons).toHaveCount(2);
    await expect(buttons.locator("xpath=self::button")).toHaveCount(1);
    await expect(buttons.locator("xpath=self::a")).toHaveCount(1);
    for (const background of ["rgb(42, 80, 110)", "linear-gradient(90deg, rgb(42, 80, 110), rgb(120, 70, 40))"]) {
      for (const button of await buttons.all()) {
        await button.evaluate((element, background) => { element.parentElement!.style.background = background; }, background);
        await page.mouse.move(0, 0);
        await expect(button).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
        await expect(button).toHaveCSS("background-image", "none");
        await expect(button).toHaveCSS("box-shadow", "none");
        await button.hover();
        await expect(button).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
        await expect(button).toHaveCSS("background-image", "none");
        await page.mouse.move(0, 0);
        await button.focus();
        await expect(button).toBeFocused();
        await expect(button).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      }
    }
  });
}
