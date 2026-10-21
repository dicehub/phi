import { expect, test } from "@playwright/test";

test("TagInput read-only state blocks keys, paste, removal, and blur commits", async ({ page }) => {
  await page.goto("/docs/components/tag-input");
  const demo = page.locator(".tag-input-demo--readonly");
  const input = demo.getByRole("textbox", { name: "Reviewed labels", exact: true });
  const empty = demo.getByRole("textbox", { name: "Empty read-only tags", exact: true });
  await expect(input).toHaveAttribute("readonly", "");
  await expect(empty).toHaveAttribute("readonly", "");
  await expect(demo.getByRole("button", { name: "Remove reviewed" })).toBeDisabled();
  await input.focus();
  await input.press("Backspace");
  await expect(input).toBeFocused();
  expect(await empty.evaluate((element) => (element as HTMLInputElement).checkValidity())).toBe(true);
  expect(await demo.locator("form").evaluate((element) => new FormData(element as HTMLFormElement).getAll("labels"))).toEqual(["reviewed"]);

  await demo.getByRole("button", { name: "Allow tag changes" }).click();
  await expect(empty).not.toHaveAttribute("readonly");
  expect(await empty.evaluate((element) => (element as HTMLInputElement).checkValidity())).toBe(false);
  await input.fill("keep-draft");
  await demo.getByRole("button", { name: "Lock tag changes" }).click();
  await expect(empty).toHaveAttribute("readonly", "");
  for (const key of ["Enter", ",", "Tab"]) await input.press(key);
  const prevented = await input.evaluate((element) => {
    const event = new ClipboardEvent("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "clipboardData", { value: { getData: () => "extra, tags" } });
    element.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(prevented).toBe(false);
  await input.blur();
  await expect(input).toHaveValue("keep-draft");
  await expect(demo.locator(".phi-tag-input-chip__label")).toHaveText(["reviewed"]);
  await demo.getByRole("button", { name: "Allow tag changes" }).click();
  await input.press("Enter");
  await expect(demo.locator(".phi-tag-input-chip__label")).toHaveText(["reviewed", "keep-draft"]);
  expect(await page.pageErrors()).toEqual([]);
});

for (const [start, end, expected] of [
  [0, 0, ["alpha", "betadraft"]],
  [2, 2, ["dralpha", "betaaft"]],
  [5, 5, ["draftalpha", "beta"]],
  [1, 4, ["dalpha", "betat"]],
] as const) {
  test(`TagInput pastes into draft selection ${start}:${end}`, async ({ page }) => {
    await page.goto("/docs/components/tag-input");
    const demo = page.locator(".tag-input-demo--unrestricted");
    const input = demo.getByRole("textbox", { name: "Labels", exact: true });
    await input.fill("draft");
    await input.evaluate((element, { start, end }) => {
      (element as HTMLInputElement).setSelectionRange(start, end);
      const event = new ClipboardEvent("paste", { bubbles: true, cancelable: true });
      Object.defineProperty(event, "clipboardData", { value: { getData: () => "alpha, beta" } });
      element.dispatchEvent(event);
    }, { start, end });
    await expect(demo.locator(".phi-tag-input-chip__label")).toHaveText(["frontend", "priority", ...expected]);
    await expect(input).toHaveValue("");
    expect(await demo.locator("form").evaluate((element) => new FormData(element as HTMLFormElement).getAll("labels"))).toEqual(["frontend", "priority", ...expected]);
  });
}
