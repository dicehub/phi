import { expect, test } from "@playwright/test";

test.describe("documentation pagination", () => {
  test("shows the correct compact and footer links", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/button");

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });
    const previous = compact.getByRole("link", { name: "Previous page: Breadcrumbs" });
    const next = compact.getByRole("link", { name: "Next page: Button Group" });

    await expect(previous).toHaveAttribute("href", "/docs/components/breadcrumbs");
    await expect(previous).toHaveAttribute("rel", "prev");
    await expect(next).toHaveAttribute("href", "/docs/components/button-group");
    await expect(next).toHaveAttribute("rel", "next");
    await expect(previous).toHaveCSS("width", "28px");
    await expect(next).toHaveCSS("height", "28px");

    await expect(footer).toBeVisible();
    await expect(footer.getByRole("link", { name: "Breadcrumbs", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Button Group", exact: true })).toHaveCSS(
      "height",
      "32px",
    );
  });

  test("updates neighbors through Astro soft navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/button");
    await page.evaluate(() => {
      (window as Window & { __phiPagerMarker?: string }).__phiPagerMarker = "preserved";
    });

    await page
      .getByRole("navigation", { name: "Adjacent documentation pages" })
      .getByRole("link", { name: "Next page: Button Group" })
      .click();

    await expect(page).toHaveURL(/\/docs\/components\/button-group\/?$/);
    await expect(page.getByRole("heading", { level: 1, name: "ButtonGroup" })).toBeVisible();
    await expect(
      page
        .getByRole("navigation", { name: "Adjacent documentation pages" })
        .getByRole("link", { name: "Previous page: Button" }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => (window as Window & { __phiPagerMarker?: string }).__phiPagerMarker,
        ),
      )
      .toBe("preserved");
  });

  test("uses compact navigation without a footer on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs/components/button");

    const compact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    const footer = page.getByRole("navigation", { name: "Documentation pagination" });

    await expect(compact).toBeVisible();
    await expect(compact.getByRole("link", { name: "Next page: Button Group" })).toHaveCSS(
      "width",
      "32px",
    );
    await expect(footer).toBeHidden();
    await expect(
      page.locator(".docs-page-header__mobile-copy").getByRole("button", {
        name: "Copy page",
        exact: true,
      }),
    ).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
      true,
    );
  });

  test("omits links at section boundaries and supports guides", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/docs/components/autocomplete");

    const firstCompact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(firstCompact.getByRole("link")).toHaveCount(1);
    await expect(firstCompact.getByRole("link", { name: "Next page: Badge" })).toBeVisible();

    await page.goto("/docs/components/tooltip");
    const lastCompact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(lastCompact.getByRole("link")).toHaveCount(1);
    await expect(lastCompact.getByRole("link", { name: "Previous page: Toast" })).toBeVisible();

    await page.goto("/docs/installation");
    const guideCompact = page.getByRole("navigation", { name: "Adjacent documentation pages" });
    await expect(guideCompact.getByRole("link", { name: "Previous page: Home" })).toBeVisible();
    await expect(guideCompact.getByRole("link", { name: "Next page: Contributing" })).toBeVisible();

    await page.goto("/docs/contributing");
    await expect(
      page
        .getByRole("navigation", { name: "Adjacent documentation pages" })
        .getByRole("link", { name: "Previous page: Installation" }),
    ).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Documentation pagination" })).toBeVisible();
  });
});
