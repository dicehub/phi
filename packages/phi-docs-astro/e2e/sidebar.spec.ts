import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

const box = async (locator: ReturnType<Page["locator"]>) => {
  const result = await locator.boundingBox();
  if (!result) throw new Error("Expected element to have a bounding box");

  return {
    height: Math.round(result.height),
    width: Math.round(result.width),
    x: Math.round(result.x),
    y: Math.round(result.y),
  };
};

test.describe("Sidebar", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/docs/components/sidebar");
  });

  test("renders the full preview and docs navigation", async ({ page }) => {
    await expect(page.locator("main h1").first()).toHaveText("Sidebar");
    await expect(page.locator("#preview .sidebar-demo")).toHaveCount(1);
    await expect.poll(() => box(page.locator("#preview .sidebar-demo"))).toMatchObject({
      height: 540,
    });
    await expect(page.locator("#preview [data-sidebar='sidebar']")).toHaveAttribute("data-state", "expanded");
    await expect(page.locator("#preview [data-sidebar='menu-button'][data-active]").first()).toContainText("Home");
    await expect(page.locator("#preview [data-sidebar='menu-badge']")).toContainText(["Beta", "Beta"]);
    const basic = exampleById(page, "basic");
    await expect(basic.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "location");
    await expect(basic.getByRole("link", { name: "Home" })).toHaveAttribute("data-active", "true");
    await expect(basic.getByRole("link", { name: "Durable Objects" })).toHaveAttribute("aria-current", "step");
    await expect(basic.getByRole("link", { name: "Durable Objects" })).toHaveAttribute("data-active", "true");
    const accountTrigger = page.locator("#preview").getByRole("button", { name: "Company" });
    await expect.poll(() => box(accountTrigger)).toMatchObject({ height: 32, width: 235 });
    await accountTrigger.click();
    await expect(page.getByRole("menuitem", { name: "Personal" })).toBeVisible();
    await expect.poll(() => box(page.getByRole("menu"))).toMatchObject({ height: 108, width: 235 });
    await page.getByRole("menuitem", { name: "Personal" }).click();
    await expect(page.locator("#preview").getByRole("button", { name: "Personal" })).toBeVisible();

    const full = exampleById(page, "full-example");
    await full.scrollIntoViewIfNeeded();
    const fullAccountTrigger = full.getByRole("button", { name: "Company" });
    const fullAccountBox = await box(fullAccountTrigger);
    await fullAccountTrigger.click();
    await expect(page.getByRole("menuitem", { name: "Personal" })).toBeVisible();
    await expect.poll(() => box(page.getByRole("menu"))).toMatchObject({ height: 108, width: 235 });
    const fullMenuBox = await box(page.getByRole("menu"));
    expect(Math.abs(fullMenuBox.x - fullAccountBox.x)).toBeLessThanOrEqual(1);
    expect(fullMenuBox.y).toBeGreaterThan(fullAccountBox.y);
    await page.keyboard.press("Escape");

    const sidebar = page.locator(".docs-sidebar-panel--desktop");
    const labels = await sidebar.locator(".docs-nav-group__panel a").evaluateAll((items) =>
      items.map((item) => item.textContent?.trim()),
    );
    expect(labels.indexOf("Sidebar")).toBe(labels.indexOf("Sensitive Input") + 1);
    await expect(sidebar.getByRole("link", { name: "Sidebar" })).toHaveAttribute(
      "href",
      "/docs/components/sidebar",
    );
  });

  test("supports collapse, peeking, sliding views, and mobile drawer behavior", async ({ page }) => {
    const toggle = exampleById(page, "toggle-collapsed-state");
    const toggleSidebar = toggle.locator("[data-sidebar='sidebar']");
    await toggle.getByRole("button", { name: "Collapse sidebar" }).click();
    await expect(toggleSidebar).toHaveAttribute("data-state", "collapsed");
    await expect.poll(() => box(toggleSidebar)).toMatchObject({ width: 57 });
    await expect
      .poll(async () => {
        const sidebarBox = await box(toggleSidebar);
        const brandIcon = await box(toggle.locator(".sidebar-demo-brand__icon"));
        const menuIcon = await box(toggle.locator(".phi-sidebar-menu-button__icon").first());

        return {
          brand: Math.round(brandIcon.x + brandIcon.width / 2 - sidebarBox.x),
          menu: Math.round(menuIcon.x + menuIcon.width / 2 - sidebarBox.x),
        };
      })
      .toEqual({ brand: 28, menu: 28 });
    await expect(toggle.getByRole("button", { name: "Expand sidebar" })).toHaveAttribute("aria-expanded", "false");

    const peeking = exampleById(page, "peeking");
    await peeking.getByRole("button", { name: "Collapse sidebar" }).click();
    await expect(peeking.locator("[data-sidebar='sidebar']")).toHaveAttribute("data-state", "collapsed");
    await peeking.locator("[data-sidebar='content-container']").hover();
    await expect(peeking.locator("[data-sidebar='sidebar']")).toHaveAttribute("data-state", "peeking");
    await expect(peeking.locator(".sidebar-demo-main-title")).toHaveText("State: Peeking");

    const autoScroll = exampleById(page, "auto-scroll");
    await expect
      .poll(() =>
        autoScroll.locator(".phi-sidebar-content__viewport").evaluate((node) => {
          const style = getComputedStyle(node);
          return {
            canScroll: node.scrollHeight > node.clientHeight,
            overflowY: style.overflowY,
            scrollbarWidth: style.scrollbarWidth,
          };
        }),
      )
      .toEqual({ canScroll: true, overflowY: "auto", scrollbarWidth: "thin" });
    await autoScroll.locator("[data-sidebar='trigger']").click();
    await expect(autoScroll.locator("[data-sidebar='sidebar']")).toHaveAttribute("data-state", "collapsed");
    await expect
      .poll(async () => {
        const sidebarBox = await box(autoScroll.locator("[data-sidebar='sidebar']"));
        const icon = await box(autoScroll.locator(".phi-sidebar-menu-button__icon").first());
        const scrollbar = await autoScroll.locator(".phi-sidebar-content__viewport").evaluate((node) => {
          const style = getComputedStyle(node);
          return {
            canScroll: node.scrollHeight > node.clientHeight,
            overflowY: style.overflowY,
            paddingRight: style.paddingRight,
            scrollbarWidth: style.scrollbarWidth,
          };
        });

        return {
          ...scrollbar,
          icon: Math.round(icon.x + icon.width / 2 - sidebarBox.x),
        };
      })
      .toEqual({ canScroll: true, icon: 28, overflowY: "auto", paddingRight: "3px", scrollbarWidth: "thin" });

    const sliding = exampleById(page, "sliding-views");
    await expect(sliding.locator(".sidebar-demo-main-title")).toHaveText("Active: Account surface");
    await sliding.getByRole("button", { name: "Account Nav" }).click();
    await expect(sliding.locator(".sidebar-demo-main-title")).toHaveText("Active: Zone surface");
    await expect(sliding.locator("[data-sidebar='sliding-view'][data-value='account']")).toHaveAttribute("aria-hidden", "true");
    await expect(sliding.locator("[data-sidebar='sliding-view'][data-value='zone']")).toHaveAttribute("aria-hidden", "false");

    const mobile = exampleById(page, "mobile");
    const mobileNav = mobile.locator("nav[data-sidebar='sidebar']");
    await expect(mobileNav).toHaveAttribute("aria-hidden", "true");
    await mobile.getByRole("button", { name: "Open sidebar" }).click();
    await expect(mobileNav).toHaveAttribute("aria-hidden", "false");
    await expect
      .poll(() =>
        mobile.locator("[data-sidebar-backdrop]").evaluate((node) => {
          const style = getComputedStyle(node);
          return { opacity: style.opacity, pointerEvents: style.pointerEvents };
        }),
      )
      .toEqual({ opacity: "0.8", pointerEvents: "auto" });
    await page.keyboard.press("Escape");
    await expect(mobileNav).toHaveAttribute("aria-hidden", "true");
    await mobile.getByRole("button", { name: "Open sidebar" }).click();
    await expect(mobileNav).toHaveAttribute("aria-hidden", "false");

    const portaledTrigger = mobileNav.getByRole("button", { name: "Open portaled content" });
    await portaledTrigger.click();
    const portaledContent = page.locator(".phi-popover-content").filter({ hasText: "Portaled content" });
    const portaledControl = portaledContent.getByRole("button", { name: "Focus inside portal" });
    await expect(portaledContent).toBeVisible();
    await portaledControl.focus();
    await expect(portaledControl).toBeFocused();
    await expect(mobileNav).toHaveAttribute("aria-hidden", "false");
    await expect(mobileNav).not.toHaveAttribute("inert", "");

    await portaledTrigger.click();
    await expect(portaledContent).toHaveCount(0);
    await expect(mobileNav).toHaveAttribute("aria-hidden", "false");
    await page.keyboard.press("Escape");
    await expect(mobileNav).toHaveAttribute("aria-hidden", "true");
  });

  test("keeps peeking when a sliding view replaces the focused item under the pointer", async ({ page }) => {
    const example = exampleById(page, "full-example");
    const sidebar = example.locator("[data-sidebar='sidebar']");
    const peekZone = example.locator("[data-sidebar='content-container']");

    await example.getByRole("button", { name: "Collapse sidebar" }).click();
    await expect(sidebar).toHaveAttribute("data-state", "collapsed");

    await peekZone.hover();
    await expect(sidebar).toHaveAttribute("data-state", "peeking");

    await example.getByRole("button", { name: "Domains" }).click();
    await expect(example.locator("[data-sidebar='sliding-view'][data-value='domain']")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    await expect(sidebar).toHaveAttribute("data-state", "peeking");

    await example.locator(".sidebar-demo__main").hover();
    await expect(sidebar).toHaveAttribute("data-state", "collapsed");
  });

  test("keeps focus-only peeking active while focus moves inside the sidebar", async ({ page }) => {
    const example = exampleById(page, "peeking");
    const sidebar = example.locator("[data-sidebar='sidebar']");

    await example.getByRole("button", { name: "Collapse sidebar" }).click();
    await expect(sidebar).toHaveAttribute("data-state", "collapsed");
    await example.locator(".sidebar-demo__main").hover();

    await example.getByRole("button", { name: "Home" }).focus();
    await expect(sidebar).toHaveAttribute("data-state", "peeking");

    await example.getByRole("button", { name: "Analytics" }).focus();
    await expect(sidebar).toHaveAttribute("data-state", "peeking");

    await page.getByRole("button", { name: "Toggle theme" }).last().focus();
    await expect(sidebar).toHaveAttribute("data-state", "collapsed");
  });

  test("supports an opt-in full-screen mobile drawer with an internal close control", async ({ page }) => {
    const example = exampleById(page, "full-screen-mobile");
    const provider = example.locator("[data-sidebar-wrapper]");
    const nav = example.locator("nav[data-sidebar='sidebar']");
    const backdrop = example.locator("[data-sidebar-backdrop]");
    const trigger = example.locator("[data-sidebar='trigger']");

    await expect(nav).toHaveAttribute("aria-hidden", "true");
    await expect(trigger).toHaveAttribute("aria-label", "Expand sidebar");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(nav).toHaveAttribute("aria-hidden", "false");
    await expect(trigger).toHaveAttribute("aria-label", "Collapse sidebar");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await expect
      .poll(async () => {
        const providerBox = await box(provider);
        const navBox = await box(nav);
        const navStyle = await nav.evaluate((node) => {
          const style = getComputedStyle(node);
          return {
            borderLeftWidth: style.borderLeftWidth,
            borderRightWidth: style.borderRightWidth,
          };
        });
        const backdropStyle = await backdrop.evaluate((node) => {
          const style = getComputedStyle(node);
          return { opacity: style.opacity, pointerEvents: style.pointerEvents };
        });

        return {
          frameDelta: {
            height: navBox.height - providerBox.height,
            width: navBox.width - providerBox.width,
            x: navBox.x - providerBox.x,
            y: navBox.y - providerBox.y,
          },
          navStyle,
          backdropStyle,
        };
      })
      .toEqual({
        frameDelta: { height: 0, width: 0, x: 0, y: 0 },
        navStyle: { borderLeftWidth: "0px", borderRightWidth: "0px" },
        backdropStyle: { opacity: "0", pointerEvents: "none" },
      });

    const ancestor = nav.locator(".phi-breadcrumbs__link");
    const current = nav.locator(".phi-breadcrumbs__current");
    await expect
      .poll(async () => ({
        ancestor: await ancestor.evaluate((node) => getComputedStyle(node).flexShrink),
        current: await current.evaluate((node) => getComputedStyle(node).flexShrink),
      }))
      .toEqual({ ancestor: "0", current: "1" });

    await nav.getByRole("button", { name: "Close navigation" }).click();
    await expect(nav).toHaveAttribute("aria-hidden", "true");
    await expect(trigger).toHaveAttribute("aria-label", "Expand sidebar");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("documents the compound API and accessibility details", async ({ page }) => {
    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(9);
    await expect(page.locator("#sidebar-provider")).toBeVisible();
    await expect(page.locator("#sidebar-content")).toBeVisible();
    await expect(page.locator("#sidebar-compound-parts")).toBeVisible();
    await expect(page.locator("#api-reference")).toContainText("Sidebar.ResizeHandle");
    await expect(page.locator("#api-reference")).toContainText("Sidebar.Close");
    await expect(page.locator("#api-reference")).toContainText("useSidebar");
    await expect(page.locator("#api-reference")).toContainText("fullScreenOnMobile");
    await expect(page.locator("#api-reference")).toContainText("mobileBreakpoint");
    await expect(page.locator("#api-reference")).toContainText("@width-change");
    await expect(page.locator("#api-reference")).toContainText("Sidebar.MenuButton");
    await expect(page.locator("#api-reference")).toContainText("Sidebar.Loading");
    await expect(page.locator("#accessibility")).toContainText("aria-hidden");
    await expect(page.locator("#accessibility")).toContainText("inert");
    await expect(page.locator("#api-reference")).toContainText("@open-change-complete");
  });

  test("emits open-change-complete only after the provider transition settles", async ({ page }) => {
    const example = exampleById(page, "transition-completion");
    const status = example.locator("[data-provider-complete]");
    const sectionStatus = example.locator("[data-collapsible-complete]");
    const content = example.locator(".phi-sidebar-collapsible-content");
    const wrapper = example.locator("[data-sidebar-wrapper]");
    const toggle = example.locator(".sidebar-demo-button");

    await expect(status).toHaveAttribute("data-provider-complete", "waiting");

    await toggle.click();
    await expect(wrapper).toHaveAttribute("data-state", "collapsed");
    await expect(status).toHaveAttribute("data-provider-complete", "waiting");
    await expect(status).toHaveAttribute("data-provider-complete", "false");
    await expect(sectionStatus).toHaveAttribute("data-collapsible-complete", "false");
    await expect(content).toHaveAttribute("aria-hidden", "true");

    await toggle.click();
    await expect(wrapper).toHaveAttribute("data-state", "expanded");
    await expect(status).toHaveAttribute("data-provider-complete", "true");
    await expect(sectionStatus).toHaveAttribute("data-collapsible-complete", "true");
    await expect(content).toHaveAttribute("aria-hidden", "false");
  });

  test("completes section visibility changes when the mobile drawer opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 1080 });
    await page.goto("/docs/components/sidebar#transition-completion");
    const example = exampleById(page, "transition-completion");
    const status = example.locator("[data-collapsible-complete]");
    const content = example.locator(".phi-sidebar-collapsible-content");

    await expect(content).toHaveAttribute("aria-hidden", "true");
    await example.locator(".sidebar-demo-button").click();
    await expect(content).toHaveAttribute("aria-hidden", "false");
    await expect(status).toHaveAttribute("data-collapsible-complete", "true");

    await page.keyboard.press("Escape");
    await expect(content).toHaveAttribute("aria-hidden", "true");
    await expect(status).toHaveAttribute("data-collapsible-complete", "false");
  });

  test("cancels a pending desktop completion when the mobile layout becomes active", async ({ page }) => {
    const example = exampleById(page, "transition-completion");
    const status = example.locator("[data-provider-complete]");

    await example.locator(".sidebar-demo-button").click();
    await page.setViewportSize({ width: 700, height: 1080 });
    await page.waitForTimeout(1200);

    await expect(status).toHaveAttribute("data-provider-complete", "waiting");
  });

  test("emits open-change-complete for the collapsible content transition", async ({ page }) => {
    const example = exampleById(page, "transition-completion");
    const status = example.locator("[data-collapsible-complete]");
    const trigger = example.locator(".phi-sidebar-menu-button").first();

    await expect(status).toHaveAttribute("data-collapsible-complete", "waiting");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(status).toHaveAttribute("data-collapsible-complete", "waiting");
    await expect(status).toHaveAttribute("data-collapsible-complete", "false");
  });

  test("completes without waiting when reduced motion is active", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/docs/components/sidebar#transition-completion");

    const example = exampleById(page, "transition-completion");
    const status = example.locator("[data-provider-complete]");

    await example.locator(".sidebar-demo-button").click();
    await page.waitForTimeout(50);

    expect(await status.getAttribute("data-provider-complete")).toBe("false");
  });
});
