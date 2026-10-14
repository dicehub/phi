import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.goto("/docs/components/tag-input"); });

for (const signal of ["isComposing", "keyCode 229"] as const) {
  for (const key of ["Enter", ",", "Tab"]) {
    test(`preserves IME text and form values on ${key} with ${signal}`, async ({ page }) => {
      const demo = page.locator(".tag-input-demo--unrestricted");
      const input = demo.getByRole("textbox", { name: "Labels", exact: true });
      const chips = demo.locator(".phi-tag-input-chip__label");
      const fields = demo.locator('input[type="hidden"][name="labels"]');
      await expect(chips).toHaveText(["frontend", "priority"]);
      await input.fill("にほんご");
      const prevented = await input.evaluate((element, { key, signal }) => {
        element.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true }));
        // Safari ends composition before the confirming keydown.
        if (signal === "keyCode 229") {
          element.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true, data: "にほんご" }));
        }
        const event = new KeyboardEvent("keydown", {
          key, bubbles: true, cancelable: true,
          isComposing: signal === "isComposing", keyCode: signal === "keyCode 229" ? 229 : 0,
        });
        element.dispatchEvent(event);
        return event.defaultPrevented;
      }, { key, signal });
      expect(prevented).toBe(false);
      await expect(input).toHaveValue("にほんご");
      await expect(chips).toHaveText(["frontend", "priority"]);
      await expect(fields).toHaveCount(2);
      await expect(fields.nth(1)).toHaveValue("priority");
      if (signal === "isComposing") {
        await input.dispatchEvent("compositionend", { data: "にほんご" });
      }
      await input.press(key);
      await expect(chips).toHaveText(["frontend", "priority", "にほんご"]);
      await expect(input).toHaveValue("");
      await expect(fields).toHaveCount(3);
      await expect(fields.nth(2)).toHaveValue("にほんご");
    });
  }
}

test("preserves existing tags on composing Backspace with an empty input", async ({ page }) => {
  const demo = page.locator(".tag-input-demo--unrestricted");
  const input = demo.getByRole("textbox", { name: "Labels", exact: true });
  const chips = demo.locator(".phi-tag-input-chip__label");
  await expect(chips).toHaveText(["frontend", "priority"]);
  await input.focus();
  for (const init of [{ isComposing: true }, { keyCode: 229 }]) {
    await input.dispatchEvent("keydown", { key: "Backspace", ...init });
    await expect(chips).toHaveText(["frontend", "priority"]);
  }
  await input.press("Backspace");
  await expect(chips).toHaveText(["frontend"]);
});
