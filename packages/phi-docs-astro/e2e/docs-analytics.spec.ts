import { expect, test, type BrowserContext } from "@playwright/test";
import { analyticsEnv } from "./analytics-fixture";

type PageView = { url: string; title: string; referrer: string; website: string };
const trackerOrigin = new URL(analyticsEnv.PUBLIC_UMAMI_SCRIPT_URL).origin;

const stubTracker = async (context: BrowserContext) => {
  const pageviews: PageView[] = [];
  await context.route(`${trackerOrigin}/**`, async (route) => {
    if (new URL(route.request().url()).pathname === "/script.js") {
      return route.fulfill({
        contentType: "application/javascript",
        body: `
          const website = document.currentScript.dataset.websiteId;
          window.umami = {
            track: update => fetch("${trackerOrigin}/api/send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(update({ website }))
            })
          };
        `,
      });
    }
    if (route.request().method() === "OPTIONS") {
      return route.fulfill({
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
    pageviews.push(route.request().postDataJSON());
    return route.fulfill({ contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: "{}" });
  });
  return pageviews;
};

for (const hostname of ["phi-ui.com", "www.phi-ui.com"]) {
  test(`tracks completed navigation once on ${hostname}, including Back and Forward`, async ({ context, page, baseURL }) => {
    const pageviews = await stubTracker(context);
    const origin = `https://${hostname}`;
    await context.route(`${origin}/**`, async (route) => {
      const url = new URL(route.request().url());
      const response = await context.request.get(`${baseURL}${url.pathname}${url.search}`);
      await route.fulfill({ response });
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${origin}/docs?source=test#home`);
    await expect(page.locator("#phi-analytics")).toHaveAttribute("src", analyticsEnv.PUBLIC_UMAMI_SCRIPT_URL);
    await expect(page.locator("#phi-analytics")).toHaveAttribute("data-website-id", analyticsEnv.PUBLIC_UMAMI_WEBSITE_ID);
    await expect.poll(() => pageviews.length).toBe(1);
    await page.locator(".docs-sidebar-panel--desktop").getByRole("link", { name: "Contributing", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Contributing" })).toBeVisible();
    await expect.poll(() => pageviews.length).toBe(2);
    await page.goBack();
    await expect(page).toHaveURL(`${origin}/docs?source=test#home`);
    await expect.poll(() => pageviews.length).toBe(3);
    await page.goForward();
    await expect(page.getByRole("heading", { level: 1, name: "Contributing" })).toBeVisible();
    await expect.poll(() => pageviews.length).toBe(4);

    await page.getByRole("complementary", { name: "On this page" }).getByRole("link", { name: "Checks", exact: true }).click();
    await expect(page).toHaveURL(/#checks$/);
    await page.evaluate(() => document.dispatchEvent(new Event("astro:page-load")));
    await page.waitForLoadState("networkidle");
    expect(pageviews).toHaveLength(4);
    expect(pageviews.every((view) => view.website === analyticsEnv.PUBLIC_UMAMI_WEBSITE_ID)).toBe(true);
    expect(pageviews.map((view) => view.title)).toEqual(["Phi", "Phi / Contributing", "Phi", "Phi / Contributing"]);
    expect(pageviews.map((view) => view.url)).toEqual([
      `${origin}/docs`,
      `${origin}/docs/contributing`,
      `${origin}/docs`,
      `${origin}/docs/contributing`,
    ]);
    expect(pageviews.map((view) => view.referrer)).toEqual([
      "",
      `${origin}/docs`,
      `${origin}/docs/contributing`,
      `${origin}/docs`,
    ]);
  });
}

for (const preview of [false, true]) {
  test(`does not track ${preview ? "preview" : "local"} visits`, async ({ context, page, baseURL }) => {
    const pageviews = await stubTracker(context);
    const origin = preview ? "https://preview.dicehub-phi-ui.pages.dev" : baseURL!;
    if (preview) {
      await context.route(`${origin}/**`, async (route) => {
        const url = new URL(route.request().url());
        const response = await context.request.get(`${baseURL}${url.pathname}${url.search}`);
        await route.fulfill({ response });
      });
    }
    await page.goto(`${origin}/docs`);
    await page.waitForFunction(() => "umami" in window);
    await page.evaluate(() => document.dispatchEvent(new Event("astro:page-load")));
    await page.waitForLoadState("networkidle");
    expect(pageviews).toHaveLength(0);
  });
}
