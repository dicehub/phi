import { expect, test } from "@playwright/test";

for (const commit of ["Enter", "blur"]) {
  test(`Pagination rejects invalid input on ${commit}`, async ({ page }) => {
    await page.goto("/docs/components/pagination");
    const demo = page.locator("#preview");
    const input = demo.getByRole("textbox", { name: "Page number" });
    await demo.getByRole("button", { name: "Next page" }).click();
    for (const text of ["", " ", "abc", "2abc", "2.5", "-1", "1e2", "Infinity"]) {
      await input.fill(text);
      await expect(input).toHaveValue(text);
      if (commit === "Enter") await input.press("Enter");
      else await input.blur();
      await expect(input).toHaveValue("2");
      await expect(demo.locator(".phi-pagination__info")).toContainText("11-20");
    }
    for (const [text, expected] of [[" 3 ", "3"], ["005", "5"], ["0", "1"], ["999", "10"]]) {
      await input.fill(text);
      if (commit === "Enter") await input.press("Enter");
      else await input.blur();
      await expect(input).toHaveValue(expected);
    }
    expect(await page.pageErrors()).toEqual([]);
  });
}

test("Pagination keeps empty results on page 1", async ({ page }) => {
  await page.goto("/docs/components/pagination");
  const demo = page.locator("#empty-results ~ .docs-component-example").first();
  const input = demo.getByRole("textbox", { name: "Page number" });
  await expect(input).toHaveValue("1");
  for (const button of await demo.getByRole("navigation", { name: "Pagination" }).getByRole("button").all()) {
    await expect(button).toBeDisabled();
  }
  await input.fill("100");
  await input.press("Enter");
  await expect(input).toHaveValue("1");
});
