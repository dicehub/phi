import { expect, type Locator, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

const box = async (locator: Locator) => {
  const result = await locator.boundingBox();
  if (!result) throw new Error("Expected element to have a bounding box");

  return {
    height: Math.round(result.height),
    width: Math.round(result.width),
    x: Math.round(result.x),
    y: Math.round(result.y),
  };
};

const expectIndicatorToTrackTab = async (root: Locator, tabName: string, options: { matchHeight?: boolean } = {}) => {
  const tab = root.getByRole("tab", { name: tabName });
  const indicator = root.locator(".phi-tabs__indicator").first();

  await tab.click();
  await expect(tab).toHaveAttribute("aria-selected", "true");
  await expect(indicator).toBeVisible();
  await expect
    .poll(async () => {
      const [tabBox, indicatorBox] = await Promise.all([box(tab), box(indicator)]);
      const heightDiff = options.matchHeight ? Math.abs(tabBox.height - indicatorBox.height) : 0;

      return Math.max(Math.abs(tabBox.x - indicatorBox.x), Math.abs(tabBox.width - indicatorBox.width), heightDiff);
    })
    .toBeLessThanOrEqual(1);
};

test.describe("Tabs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/tabs");
  });

  test("renders the preview tabs with code and Ark link", async ({ page }) => {
    const preview = page.locator("#preview");
    const tabLists = preview.getByRole("tablist");
    const segmented = tabLists.first();
    const underline = tabLists.nth(1);
    const snippet = preview.locator(".docs-code-block pre");
    const headerTitle = page.locator(".docs-header__page-title");

    await expect(page.locator("main h1").first()).toHaveText("Tabs");
    await expect(page.locator(".docs-page-header__primitive-link")).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/tabs",
    );
    await expect(headerTitle).toContainText("Tabs");
    await expect(headerTitle.getByLabel("View Ark UI documentation")).toHaveAttribute(
      "href",
      "https://ark-ui.com/docs/components/tabs",
    );
    await expect(headerTitle.getByLabel("View source on GitLab")).toHaveCount(0);
    await expect(headerTitle).toHaveCSS("opacity", "0");
    await page.evaluate(() => window.scrollTo(0, 160));
    await expect(headerTitle).toHaveCSS("opacity", "1");
    await expect(tabLists).toHaveCount(2);
    await expect(segmented.getByRole("tab")).toHaveText(["Tab 1", "Tab 2", "Tab 3"]);
    await expect(underline.getByRole("tab")).toHaveText(["Tab 1", "Tab 2", "Tab 3"]);
    await expect(segmented.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("aria-selected", "true");
    await expect(underline.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("aria-selected", "true");
    await expect.poll(() => box(segmented)).toMatchObject({ height: 36 });
    await expect.poll(() => box(underline)).toMatchObject({ height: 30 });
    await expect(preview.locator(".phi-tabs__indicator--segmented").first()).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    expect((await box(preview.locator(".phi-tabs__indicator--segmented").first())).width).toBeGreaterThan(40);
    await expect(snippet).toContainText('from "@dicehub/phi/components/tabs"');
    await expect(snippet).toContainText('variant="underline"');
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Variants",
      "Segmented (Default)",
      "Underline",
      "Small Size",
      "Controlled",
      "Horizontal Overflow",
      "API Reference",
      "Tabs",
      "TabsItem",
      "TabsLabels",
    ]);
  });

  test("renders documented examples and API reference", async ({ page }) => {
    const segmented = exampleById(page, "segmented-default");
    const underline = exampleById(page, "underline");
    const small = exampleById(page, "small-size");
    const controlled = exampleById(page, "controlled");
    const overflow = exampleById(page, "horizontal-overflow");
    const smallRoots = small.locator(".phi-tabs");

    await expect(page.locator("#examples .docs-component-example")).toHaveCount(5);
    await expect(segmented.locator(".phi-tabs")).toHaveAttribute("data-variant", "segmented");
    await expect(underline.locator(".phi-tabs")).toHaveAttribute("data-variant", "underline");
    await expect.poll(() => box(small.getByRole("tablist").first())).toMatchObject({ height: 26 });
    await expect.poll(() => box(small.getByRole("tablist").nth(1))).toMatchObject({ height: 26 });
    await expect.poll(() => smallRoots.evaluateAll((roots) => new Set(roots.map((root) => root.id)).size)).toBe(2);
    await expectIndicatorToTrackTab(underline.locator(".phi-tabs"), "Tab 3");
    await expectIndicatorToTrackTab(smallRoots.first(), "Tab 3", { matchHeight: true });
    await expectIndicatorToTrackTab(smallRoots.nth(1), "Tab 3");

    await controlled.getByRole("tab", { name: "Tab 2" }).click();
    await expect(controlled.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("aria-selected", "true");
    await expect(controlled.locator(".tabs-demo__status")).toContainText("tab2");

    const overflowTabs = overflow.getByRole("tab");
    await expect(overflowTabs).toHaveText([
      "Overview",
      "Analytics",
      "Reports",
      "Notifications",
      "Settings",
      "Billing",
      "Security",
      "Integrations",
    ]);
    const overflowRoot = overflow.locator(".phi-tabs");
    const overflowList = overflow.locator(".phi-tabs__list");

    await expect(overflowList).toHaveAttribute("data-overflowing", "true");
    await expect(overflowList).toHaveAttribute("data-scroll-end", "true");
    await expect(overflowList).not.toHaveAttribute("data-scroll-start", "true");
    await expect(overflowList).toHaveCSS("cursor", "grab");
    const overviewTab = overflowRoot.getByRole("tab", { name: "Overview" });

    await expect(overviewTab).toHaveCSS("cursor", "pointer");
    await overflowRoot.scrollIntoViewIfNeeded();
    const overviewBox = await box(overviewTab);
    await page.mouse.move(overviewBox.x + overviewBox.width / 2, overviewBox.y + overviewBox.height / 2);
    await page.mouse.down();
    await expect(overflowList).not.toHaveAttribute("data-dragging", "true");
    await expect(overviewTab).toHaveCSS("cursor", "pointer");
    await page.mouse.move(overviewBox.x + overviewBox.width / 2 + 12, overviewBox.y + overviewBox.height / 2);
    await expect(overflowList).toHaveAttribute("data-dragging", "true");
    await page.mouse.up();
    await expect(overflowList).toHaveCSS(
      "mask-image",
      /linear-gradient\(to right, rgba\(0, 0, 0, 0\) 0px, rgb\(0, 0, 0\) 0px,/,
    );
    await expectIndicatorToTrackTab(overflowRoot, "Settings", { matchHeight: true });
    await overflowList.evaluate((element) => {
      element.scrollLeft = 0;
      element.dispatchEvent(new Event("scroll", { bubbles: true }));
    });
    const startControl = overflowRoot.locator("[data-phi-part='overflow-control'][data-side='start']");
    const endControl = overflowRoot.locator("[data-phi-part='overflow-control'][data-side='end']");

    await expect(startControl).toHaveAttribute("aria-label", "Scroll tabs left");
    await expect(startControl).toHaveAttribute("aria-hidden", "true");
    await expect(startControl).toHaveAttribute("tabindex", "-1");
    await expect(startControl).not.toHaveAttribute("data-visible", "true");
    await expect(endControl).toHaveAttribute("aria-label", "Scroll tabs right");
    await expect(endControl).not.toHaveAttribute("aria-hidden", "true");
    await expect(endControl).toHaveAttribute("tabindex", "0");
    await expect(endControl).toHaveAttribute("data-visible", "true");
    await expect(endControl).toHaveCSS("opacity", "1");
    const endControlIcon = endControl.locator(".phi-tabs__overflow-control-icon");
    await expect(endControlIcon).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(endControlIcon).toHaveCSS("box-shadow", "none");
    await expect(endControlIcon).toHaveCSS("border-radius", "6px");
    await endControl.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(endControl).toBeFocused();
    await expect(endControlIcon).not.toHaveCSS("box-shadow", "none");

    for (let attempt = 0; attempt < 4 && (await endControl.getAttribute("data-visible")); attempt += 1) {
      await endControl.click();
      await page.waitForTimeout(450);
    }

    await expect.poll(() => overflowList.evaluate((element) => Math.round(element.scrollLeft))).toBeGreaterThan(0);
    await expect(startControl).toHaveAttribute("data-visible", "true");
    await expect(startControl).not.toHaveAttribute("aria-hidden", "true");
    await expect(endControl).not.toHaveAttribute("data-visible", "true");
    await expect(endControl).toHaveAttribute("aria-hidden", "true");

    for (let attempt = 0; attempt < 4 && (await startControl.getAttribute("data-visible")); attempt += 1) {
      await startControl.click();
      await page.waitForTimeout(450);
    }

    await expect.poll(() => overflowList.evaluate((element) => Math.round(element.scrollLeft))).toBeLessThanOrEqual(1);
    await expect(startControl).not.toHaveAttribute("data-visible", "true");
    await expect(endControl).toHaveAttribute("data-visible", "true");

    const lastSelection = await overflowRoot.evaluate(async (root) => {
      const list = root.querySelector(".phi-tabs__list") as HTMLElement | null;
      const tab = Array.from(root.querySelectorAll<HTMLElement>("[role='tab']")).find(
        (item) => item.textContent?.trim() === "Integrations",
      );

      if (!list || !tab) throw new Error("Expected overflowing Tabs list and Integrations tab");

      list.scrollLeft = 0;
      list.dispatchEvent(new Event("scroll", { bubbles: true }));
      tab.click();
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 650);
      });

      const listRect = list.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      return {
        listRight: Math.round(listRect.right),
        scrollLeft: Math.round(list.scrollLeft),
        selected: tab.getAttribute("aria-selected"),
        tabRight: Math.round(tabRect.right),
      };
    });
    expect(lastSelection.selected).toBe("true");
    expect(lastSelection.scrollLeft).toBeGreaterThan(0);
    expect(lastSelection.tabRight).toBeLessThanOrEqual(lastSelection.listRight);
    expect(lastSelection.listRight - lastSelection.tabRight).toBeLessThanOrEqual(4);
    await expect(overflowList).toHaveAttribute("data-scroll-start", "true");
    await expect(overflowList).not.toHaveAttribute("data-scroll-end", "true");
    await expectIndicatorToTrackTab(overflowRoot, "Integrations", { matchHeight: true });

    const underlineRoot = underline.locator(".phi-tabs");
    await underlineRoot.evaluate((element) => {
      element.style.width = "8rem";
    });
    await expect(underlineRoot.locator(".phi-tabs__list")).toHaveAttribute("data-overflowing", "true");
    await expect(underlineRoot.locator("[data-phi-part='overflow-control']")).toHaveCount(0);

    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(3);
    await expect(page.locator("#api-reference")).toContainText("activateOnFocus");
    await expect(page.locator("#api-reference")).toContainText("selectedValue");
    await expect(page.locator("#api-reference")).toContainText("labels");
    await expect(page.locator("#api-reference")).toContainText("scrollStart");
    await expect(page.locator("#api-reference")).toContainText("@value-change");
    await expect(page.locator("#api-reference")).toContainText("listClassName");
    await expect(page.locator("#api-reference")).toContainText("indicatorClassName");
    await expect(page.locator("#api-reference")).toContainText("Selection callback");
    await expect(page.locator("#api-reference")).toContainText("Vue consumers can also use @value-change");
  });
});

test("Home Tabs card renders the real component", async ({ page }) => {
  await page.goto("/");

  const card = page
    .locator(".home-gallery__item")
    .filter({ has: page.getByRole("link", { name: "Tabs" }) });

  await expect(card.getByRole("link", { name: "Tabs" })).toHaveAttribute("href", "/docs/components/tabs");
  await expect(card.locator(".phi-tabs")).toHaveCount(1);
  await expect(card.getByRole("tab")).toHaveText(["Overview", "Analytics", "Settings"]);
  await expect(card.locator(".home-static--tabs")).toHaveCount(0);
});

test("Tabs is reachable in the left docs navigation after Table of Contents", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sidebar = page.locator(".docs-sidebar-panel--desktop");
  const links = sidebar.locator(".docs-nav-group__panel a");
  const tableOfContents = sidebar.getByRole("link", { name: "Table of Contents" });
  const tabs = sidebar.getByRole("link", { name: "Tabs" });

  await expect(tableOfContents).toHaveAttribute("href", "/docs/components/table-of-contents");
  await expect(tabs).toHaveAttribute("href", "/docs/components/tabs");

  const labels = await links.evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(labels.indexOf("Tabs")).toBe(labels.indexOf("Table of Contents") + 1);
});
