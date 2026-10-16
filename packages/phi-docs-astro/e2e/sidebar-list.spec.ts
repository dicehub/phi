import { expect, test } from "@playwright/test";

test("Sidebar submenu keeps valid list children and a decorative guide", async ({ page }) => {
  await page.goto("/docs/components/sidebar");
  const lists = page.locator("#preview .phi-sidebar-menu-sub");
  await expect(lists.first()).toBeAttached();
  for (const list of await lists.all()) {
    expect(await list.evaluate((element) => [...element.children].every((child) => child.tagName === "LI"))).toBe(true);
    const guide = list.locator(":scope > .phi-sidebar-menu-sub__line");
    await expect(guide).toHaveAttribute("aria-hidden", "true");
    await expect(guide).toHaveCSS("pointer-events", "none");
    await expect(guide).toHaveCSS("display", "block");
    await expect(guide).toHaveCSS("width", "1px");
    await expect(guide.locator("a, button, [tabindex]")).toHaveCount(0);
  }
});
