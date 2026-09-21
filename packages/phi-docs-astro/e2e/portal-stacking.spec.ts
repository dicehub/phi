import { expect, test } from "@playwright/test";

// Guards the portal stacking guidance from the installation docs: an
// application root with `isolation: isolate` must keep high z-index app
// content below body-teleported Phi overlays. A non-modal popover is used
// because modal dialogs mark app content inert, which hides it from hit
// testing regardless of paint order.
test.describe("Portal stacking", () => {
  test("body-teleported overlay paints above high z-index app content", async ({ page }) => {
    await page.goto("/docs/components/popover");
    await page.locator("#preview").getByRole("button", { name: "Notifications" }).click();

    const popover = page.locator(".phi-popover-content");
    await expect(popover).toBeVisible();

    await page.evaluate(() => {
      const layer = document.createElement("div");
      layer.dataset.testid = "stacking-blocker";
      layer.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgb(255 0 0 / 0.5);";
      document.querySelector("[data-docs-app]")?.appendChild(layer);
    });

    const hit = await popover.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const hitElement = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
      return {
        blocker: hitElement?.closest("[data-testid='stacking-blocker']") !== null,
        popover: hitElement?.closest(".phi-popover-content") !== null,
      };
    });

    expect(hit.blocker).toBe(false);
    expect(hit.popover).toBe(true);
  });

  test("documents the root isolation guidance and the anti-workaround rule", async ({ page }) => {
    await page.goto("/docs/installation#portal-stacking");

    const section = page.locator("#portal-stacking");
    await expect(section).toContainText("isolation: isolate");
    await expect(section).toContainText("class=\"isolate\"");
    await expect(section).toContainText("never to body");
    await expect(section).toContainText("Dialog, Select, Combobox, Dropdown, Popover, Tooltip, Toasty, and CommandPalette");
    await expect(section).toContainText("Do not raise z-index values on Phi overlays");
    await expect(section).toContainText("custom teleport container");
  });
});
