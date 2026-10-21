import { expect, test } from "@playwright/test";

test("TimeseriesChart renders large datasets with and without markers", async ({ page }) => {
  await page.goto("/docs/charts/timeseries");
  const demo = page.locator("[data-large-dataset-demo]");
  await expect(demo.locator("canvas").first()).toBeVisible();
  await demo.getByRole("button", { name: "Load 200,000 points" }).click();
  for (const markers of [0, 1, 0]) {
    if (markers === 1) await demo.getByRole("button", { name: "Toggle marker" }).click();
    else if (await demo.getByRole("button", { name: "Toggle marker" }).getAttribute("aria-pressed") === "true") {
      await demo.getByRole("button", { name: "Toggle marker" }).click();
    }
    await expect(async () => {
      await demo.getByRole("button", { name: "Read chart summary" }).click();
      await expect(demo.locator("output")).toHaveText(`200000 points, ${markers} markers`);
    }).toPass();
    expect(await page.pageErrors()).toEqual([]);
  }
});
