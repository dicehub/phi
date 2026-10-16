import { expect, test } from "@playwright/test";

test("Table of Contents selects a literal-percent hash on mount", async ({ page }) => {
  await page.goto("/docs/components/table-of-contents#50%-off");
  await expect(page.locator("[data-hash-tracking] [aria-current='true']")).toHaveText("50%-off");
});

test("Table of Contents handles raw, encoded, unknown, and empty hashes", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/docs/components/table-of-contents");
  const active = page.locator("[data-hash-tracking] [aria-current='true']");
  await expect(page.locator("[data-hash-tracking]")).toBeVisible();
  await expect(active).toHaveCount(0);
  for (const [hash, id] of [["hash-tracking-valid", "hash-tracking-valid"], ["50%-off", "50%-off"], ["caf%C3%A9", "café"], ["50%25-off", "50%-off"]]) {
    await page.evaluate((value) => { window.location.hash = value; }, hash);
    await expect(active).toHaveText(id);
  }
  for (const hash of ["%ZZ", "%", "untracked", ""]) {
    await page.evaluate((value) => { window.location.hash = value; }, hash);
    await expect(active).toHaveText("50%-off");
  }
  expect(errors).toEqual([]);
});
