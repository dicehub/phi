import { expect, test } from "@playwright/test";

const guides = [
  { title: "Contributing", path: "/docs/contributing", section: "Checks", anchor: "checks" },
  { title: "Accessibility", path: "/docs/accessibility", section: "Labels and errors", anchor: "labels-and-errors" },
];

for (const guide of guides) {
  test(`${guide.title} opens from navigation and copies complete Markdown`, async ({ page, context }, testInfo) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs");
    await page.locator(".docs-sidebar-panel--desktop").getByRole("link", { name: guide.title, exact: true }).click();

    await expect(page).toHaveURL(new RegExp(`${guide.path}/?$`));
    await expect(page.getByRole("heading", { level: 1, name: guide.title, exact: true })).toBeVisible();
    await expect(page.locator("article")).not.toContainText("navigation placeholder");
    await expect(page.getByRole("navigation", { name: "Adjacent documentation pages" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Documentation pagination" })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("desktop.png") });

    const response = await page.request.get(`${guide.path}.md`);
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toMatch(new RegExp(`^# ${guide.title}\\b`));
    expect(markdown).toContain(guide.section);
    expect(markdown).toContain("```");
    expect(markdown).not.toMatch(/navigation placeholder|Copy page|Previous page|Next page/);

    await page.locator(".docs-page-header__desktop-copy").getByRole("button", { name: "Copy page", exact: true }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(markdown);
    await page.getByRole("complementary", { name: "On this page" }).getByRole("link", { name: guide.section, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${guide.anchor}$`));
    await expect(page.locator(`#${guide.anchor}`)).toBeInViewport();
  });

  test(`${guide.title} opens from mobile navigation without horizontal overflow`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator(".docs-sidebar-panel--mobile").getByRole("link", { name: guide.title, exact: true }).click();

    await expect(page.getByRole("heading", { level: 1, name: guide.title, exact: true })).toBeVisible();
    await expect(page.locator("[data-docs-app]")).toHaveAttribute("data-mobile-sidebar-open", "false");
    await expect(page.locator(".docs-page-header__mobile-copy").getByRole("button", { name: "Copy page", exact: true })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Adjacent documentation pages" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Documentation pagination" })).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("mobile.png") });
  });
}
