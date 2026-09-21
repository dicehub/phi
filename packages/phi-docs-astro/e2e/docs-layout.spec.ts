import { expect, test, type Page } from "@playwright/test";
import { componentRegistry } from "@dicehub/phi/registry";

const readLayout = (page: Page) =>
  page.evaluate(() => {
    const style = (selector: string) => getComputedStyle(document.querySelector(selector)!);
    const pageHeader = style(".docs-page-header__content");
    const pageBody = style(".docs-page-body");
    const mainShell = style(".docs-main-shell");

    return {
      bodyPaddingLeft: pageBody.paddingLeft,
      bodyPaddingRight: pageBody.paddingRight,
      headerPaddingLeft: pageHeader.paddingLeft,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      mainMarginLeft: mainShell.marginLeft,
    };
  });

test.describe("Docs responsive layout", () => {
  test("defaults to light mode without a saved preference", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/docs/components/sidebar");

    await expect(page.locator("html")).toHaveAttribute("data-mode", "light");
    await expect(page.locator("html")).not.toHaveAttribute("data-phi-theme");
    await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
    await expect(page.getByRole("button", { name: "Toggle theme" }).last()).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
  });

  test("provides contrasting favicons for light and dark browser chrome", async ({ page }) => {
    await page.goto("/docs/components/sidebar");

    const icons = page.locator('link[rel="icon"]');
    const lightIcon = page.locator('link[rel="icon"][media="(prefers-color-scheme: light)"]');
    const darkIcon = page.locator('link[rel="icon"][media="(prefers-color-scheme: dark)"]');
    await expect(icons).toHaveCount(2);
    await expect(lightIcon).toHaveAttribute("href", "/phi-mark.svg");
    await expect(darkIcon).toHaveAttribute("href", "/phi-mark-white.svg");
  });

  test("shows the current Phi package version", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/button");

    await expect(page.locator(".docs-header__package")).toHaveText(componentRegistry.package.name);
    await expect(page.locator(".docs-header__version")).toHaveText(`v${componentRegistry.package.version}`);

    await page.goto("/docs/installation");
    await expect(page.locator("#install-package")).toContainText(
      `The current package version is v${componentRegistry.package.version}`,
    );
  });

  test("prefetches links and preserves shell state across soft navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/button");
    await page.evaluate(() => {
      localStorage.setItem("theme", "light");
      document.documentElement.setAttribute("data-mode", "light");
      document.documentElement.style.colorScheme = "light";
    });

    const app = page.locator("[data-docs-app]");
    const sidebar = page.locator(".docs-sidebar-panel--desktop");
    const sidebarScroll = sidebar.locator("[data-sidebar-scroll='desktop']");
    const buttonLink = sidebar.getByRole("link", { name: "Button", exact: true });
    const bannerLink = sidebar.getByRole("link", { name: "Banner", exact: true });
    const sidebarHandle = await sidebar.elementHandle();
    const marker = `soft-nav-${Date.now()}`;

    await expect(buttonLink).toHaveAttribute("aria-current", "page");
    await page.evaluate((value) => {
      (window as Window & { __phiSoftNavMarker?: string }).__phiSoftNavMarker = value;
    }, marker);
    await page.getByRole("button", { name: "Toggle theme" }).last().click();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");

    await sidebarScroll.evaluate((element) => {
      element.scrollTop = 80;
    });
    const prefetched = page.waitForRequest((request) => {
      const url = new URL(request.url());
      return url.pathname.replace(/\/+$/, "") === "/docs/components/banner";
    });
    await bannerLink.hover();
    await prefetched;
    const scrollBeforeNavigation = await sidebarScroll.evaluate((element) => element.scrollTop);

    await bannerLink.click();
    await expect(page).toHaveURL(/\/docs\/components\/banner\/?$/);
    await expect(page.getByRole("heading", { name: "Banner", exact: true }).first()).toBeVisible();
    await expect(page.locator("#preview .phi-banner")).toHaveCount(4);
    await expect(bannerLink).toHaveAttribute("aria-current", "page");
    await expect(buttonLink).not.toHaveAttribute("aria-current", "page");
    await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
    await expect(app).toHaveAttribute("data-sidebar-open", "true");
    expect(await sidebarScroll.evaluate((element) => element.scrollTop)).toBe(scrollBeforeNavigation);
    expect(
      await page.evaluate((value) => {
        return (window as Window & { __phiSoftNavMarker?: string }).__phiSoftNavMarker === value;
      }, marker),
    ).toBe(true);
    expect(
      await page.evaluate((element) => element === document.querySelector(".docs-sidebar-panel--desktop"), sidebarHandle),
    ).toBe(true);
  });

  test("hydrates Vue demos after soft navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/button");
    await page.evaluate(() => {
      (window as Window & { __phiVueHydrationMarker?: boolean }).__phiVueHydrationMarker = true;
    });

    await page
      .locator(".docs-sidebar-panel--desktop")
      .getByRole("link", { name: "Switch", exact: true })
      .click();
    await expect(page).toHaveURL(/\/docs\/components\/switch\/?$/);
    expect(
      await page.evaluate(() => {
        return (window as Window & { __phiVueHydrationMarker?: boolean }).__phiVueHydrationMarker;
      }),
    ).toBe(true);

    const control = page.locator("#preview").getByRole("switch", { name: "Switch" });
    await expect(control).toHaveAttribute("aria-checked", "false");
    await control.click();
    await expect(control).toHaveAttribute("aria-checked", "true");
  });

  test("keeps a collapsed sidebar collapsed after soft navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/button");

    const app = page.locator("[data-docs-app]");
    await page.getByRole("button", { name: "Collapse navigation" }).click();
    await expect(app).toHaveAttribute("data-sidebar-open", "false");

    await page.getByRole("link", { name: "Phi home" }).click();
    await expect(page).toHaveURL(/\/docs\/?$/);
    await expect(page).toHaveTitle("Phi");
    await expect(app).toHaveAttribute("data-sidebar-open", "false");
    await expect(page.getByRole("button", { name: "Expand navigation" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  test("uses compact mobile spacing", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs/components/button");

    await expect(page.locator(".docs-mobile-header")).toBeVisible();
    await expect(page.locator(".docs-rail")).toBeHidden();
    await expect(page.locator(".docs-sidebar-panel--desktop")).toBeHidden();
    await expect(page.locator(".docs-header")).toBeHidden();
    await expect.poll(() => readLayout(page)).toEqual({
      bodyPaddingLeft: "12px",
      bodyPaddingRight: "12px",
      headerPaddingLeft: "12px",
      horizontalOverflow: false,
      mainMarginLeft: "0px",
    });
  });

  test("keeps the home gallery inside narrow viewports", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    await expect(page.locator(".home-gallery")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

    const overflowingItems = await page.locator(".home-gallery__item").evaluateAll((items) =>
      items.filter((item) => item.scrollWidth > item.clientWidth + 1).length,
    );
    expect(overflowingItems).toBe(0);
  });

  test("keeps the mobile shell and medium spacing on tablets", async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.goto("/docs/components/button");

    await expect(page.locator(".docs-mobile-header")).toBeVisible();
    await expect(page.locator(".docs-rail")).toBeHidden();
    await expect(page.locator(".docs-sidebar-panel--desktop")).toBeHidden();
    await expect(page.locator(".docs-header")).toBeHidden();
    await expect.poll(() => readLayout(page)).toEqual({
      bodyPaddingLeft: "24px",
      bodyPaddingRight: "24px",
      headerPaddingLeft: "24px",
      horizontalOverflow: false,
      mainMarginLeft: "0px",
    });
  });

  test("keeps page-specific changelog spacing responsive", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs/changelog");
    await expect.poll(() => readLayout(page)).toMatchObject({
      bodyPaddingLeft: "12px",
      bodyPaddingRight: "12px",
      horizontalOverflow: false,
    });

    await page.setViewportSize({ width: 820, height: 1180 });
    await expect.poll(() => readLayout(page)).toMatchObject({
      bodyPaddingLeft: "24px",
      bodyPaddingRight: "24px",
      horizontalOverflow: false,
    });
  });

  test("switches shell and resize behavior at 1024px", async ({ page }) => {
    await page.setViewportSize({ width: 1023, height: 900 });
    await page.goto("/docs/components/button");

    const app = page.locator("[data-docs-app]");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(app).toHaveAttribute("data-mobile-sidebar-open", "true");

    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(app).toHaveAttribute("data-mobile-sidebar-open", "false");
    await expect(page.locator(".docs-mobile-header")).toBeHidden();
    await expect(page.locator(".docs-rail")).toBeVisible();
    await expect(page.locator(".docs-sidebar-panel--desktop")).toBeVisible();
    await expect(page.locator(".docs-header")).toBeVisible();
  });

  test("uses the full desktop shell and spacing", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/button");

    await expect(page.locator(".docs-mobile-header")).toBeHidden();
    await expect(page.locator(".docs-rail")).toBeVisible();
    await expect(page.locator(".docs-sidebar-panel--desktop")).toBeVisible();
    await expect(page.locator(".docs-header")).toBeVisible();
    await expect.poll(() => readLayout(page)).toEqual({
      bodyPaddingLeft: "48px",
      bodyPaddingRight: "40px",
      headerPaddingLeft: "48px",
      horizontalOverflow: false,
      mainMarginLeft: "304px",
    });
  });
});
