import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("Tag Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/tag-input");
  });

  test("renders expected page sections and snippets", async ({ page }) => {
    await expect(page.locator("main h1").first()).toHaveText("Tag Input");
    await expect(page.locator(".docs-component-example")).toHaveCount(9);
    await expect(page.locator(".docs-code-block")).toHaveCount(12);
    await expect(page.locator("#preview .docs-code-block")).toContainText('from "@dicehub/phi/components/tag-input"');
    await expect(page.locator("#preview .docs-code-block")).toContainText('label="Recipients"');
    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(4);
    await expect(page.locator("#props + .docs-api-table tbody tr")).toHaveCount(18);
    await expect(page.locator("#labels + p + .docs-api-table tbody tr")).toHaveCount(4);
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Unrestricted Values",
      "Maximum Values",
      "Validation",
      "Localization",
      "Fallback Accessible Name",
      "Disabled",
      "Bare TagInput (Custom Layouts)",
      "Sizes",
      "Behavior",
      "API Reference",
      "Props",
      "Slots",
      "Events",
      "Labels",
      "Accessibility",
      "Label Requirement",
      "Tag Removal",
      "Validation Feedback",
    ]);
    await expect(page.locator(".docs-page-toc a[href='#preview']")).toHaveCount(0);
  });

  test("commits tags on Enter, comma, Tab, and blur", async ({ page }) => {
    const example = exampleById(page, "unrestricted-values");
    const input = example.locator(".phi-tag-input__input");
    const chips = example.locator(".phi-tag-input-chip__label");

    await expect(chips).toHaveText(["frontend", "priority"]);

    await input.fill("enter-value");
    await input.press("Enter");
    await expect(chips).toHaveText(["frontend", "priority", "enter-value"]);
    await expect(input).toHaveValue("");

    await input.fill("comma-value");
    await input.press(",");
    await expect(chips).toHaveText(["frontend", "priority", "enter-value", "comma-value"]);
    await expect(input).toHaveValue("");

    await input.fill("tab-value");
    await input.press("Tab");
    await expect(chips).toHaveText(["frontend", "priority", "enter-value", "comma-value", "tab-value"]);
    await expect(input).toHaveValue("");

    await input.fill("blur-value");
    await page.locator("main h1").first().click();
    await expect(chips).toHaveText([
      "frontend",
      "priority",
      "enter-value",
      "comma-value",
      "tab-value",
      "blur-value",
    ]);
    await expect(input).toHaveValue("");
  });

  test("submits accepted tags and satisfies required after a value is accepted", async ({ page }) => {
    const example = exampleById(page, "unrestricted-values");
    const input = example.locator(".phi-tag-input__input");
    const submittedValues = example.locator('input[type="hidden"][name="labels"]');

    await expect(submittedValues).toHaveCount(2);
    await expect(submittedValues.nth(0)).toHaveValue("frontend");
    await expect(submittedValues.nth(1)).toHaveValue("priority");
    await expect(input).not.toHaveAttribute("name");
    await expect(input).not.toHaveAttribute("required");
    await expect.poll(() =>
      example.locator("[data-tag-input-form]").evaluate((form) =>
        new FormData(form as HTMLFormElement).getAll("labels"),
      ),
    ).toEqual(["frontend", "priority"]);
    expect(await input.evaluate((element) => (element as HTMLInputElement).checkValidity())).toBe(true);

    await example.getByRole("button", { name: "Remove frontend" }).click();
    await example.getByRole("button", { name: "Remove priority" }).click();
    await expect(submittedValues).toHaveCount(0);
    await expect(input).toHaveAttribute("required", "");
    expect(await input.evaluate((element) => (element as HTMLInputElement).checkValidity())).toBe(false);
  });

  test("splits comma- and newline-separated pasted text into single tags", async ({ page }) => {
    const example = exampleById(page, "unrestricted-values");
    const input = example.locator(".phi-tag-input__input");
    const chips = example.locator(".phi-tag-input-chip__label");

    await input.focus();
    await input.evaluate((element) => {
      const transfer = new DataTransfer();
      transfer.setData("text", "pasted-one, pasted-two\npasted-three");
      element.dispatchEvent(new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData: transfer }));
    });

    await expect(chips).toHaveText(["frontend", "priority", "pasted-one", "pasted-two", "pasted-three"]);
    await expect(input).toHaveValue("");
  });

  test("suppresses duplicates and removes the last tag with Backspace", async ({ page }) => {
    const example = exampleById(page, "unrestricted-values");
    const input = example.locator(".phi-tag-input__input");
    const chips = example.locator(".phi-tag-input-chip__label");

    await input.fill("frontend");
    await input.press("Enter");
    await expect(chips).toHaveText(["frontend", "priority"]);

    await input.fill("typed text");
    await input.press("Backspace");
    await expect(input).toHaveValue("typed tex");
    await expect(chips).toHaveText(["frontend", "priority"]);

    await input.fill("");
    await input.press("Backspace");
    await expect(chips).toHaveText(["frontend"]);
  });

  test("limits values, keeps the rejected text, and shows the limit message", async ({ page }) => {
    const example = exampleById(page, "maximum-values");
    const input = example.locator(".phi-tag-input__input");
    const chips = example.locator(".phi-tag-input-chip__label");

    await expect(chips).toHaveText(["alpha"]);
    await input.fill("beta");
    await input.press("Enter");
    await input.fill("gamma");
    await input.press("Enter");
    await expect(chips).toHaveText(["alpha", "beta", "gamma"]);
    await expect(example.locator(".phi-tag-input-error")).toHaveCount(0);

    await input.fill("delta");
    await input.press("Enter");
    await expect(chips).toHaveText(["alpha", "beta", "gamma"]);
    await expect(example.locator(".phi-tag-input-error")).toHaveText("Limit of 3 tags reached.");
    await expect(input).toHaveValue("delta");
    await expect(input).toHaveAttribute("aria-invalid", "true");

    await example.getByRole("button", { name: "Remove beta" }).click();
    await expect(chips).toHaveText(["alpha", "gamma"]);
    await input.press("Enter");
    await expect(chips).toHaveText(["alpha", "gamma", "delta"]);
    await expect(example.locator(".phi-tag-input-error")).toHaveCount(0);
    await expect(input).toHaveValue("");
  });

  test("reports invalid values through validateValue and stays aria-invalid", async ({ page }) => {
    const example = exampleById(page, "validation");
    const input = example.locator(".phi-tag-input__input");
    const chips = example.locator(".phi-tag-input-chip__label");

    await expect(chips).toHaveText(["staging"]);

    await input.fill("Production");
    await input.press("Enter");
    await expect(example.locator(".phi-tag-input-error")).toHaveText('"Production" is not valid.');
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveValue("Production");
    await expect(chips).toHaveText(["staging"]);

    const describedBy = await input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveText('"Production" is not valid.');

    await input.fill("canary");
    await input.press("Enter");
    await expect(chips).toHaveText(["staging", "canary"]);
    await expect(example.locator(".phi-tag-input-error")).toHaveCount(0);
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  test("removes tags from accessible remove buttons", async ({ page }) => {
    const example = exampleById(page, "unrestricted-values");
    const chips = example.locator(".phi-tag-input-chip__label");

    await expect(chips).toHaveText(["frontend", "priority"]);
    await example.getByRole("button", { name: "Remove frontend" }).click();
    await expect(chips).toHaveText(["priority"]);

    await example.getByRole("button", { name: "Remove priority" }).click();
    await expect(chips).toHaveCount(0);
  });

  test("uses localized labels for removal and limit feedback", async ({ page }) => {
    const example = exampleById(page, "localization");
    const input = example.locator(".phi-tag-input__input");
    const chips = example.locator(".phi-tag-input-chip__label");

    await expect(chips).toHaveText(["uno"]);
    await expect(example.getByRole("button", { name: "Eliminar uno" })).toBeVisible();

    await input.fill("dos");
    await input.press("Enter");
    await input.fill("tres");
    await input.press("Enter");
    await input.fill("cuatro");
    await input.press("Enter");
    await expect(example.locator(".phi-tag-input-error")).toHaveText("Maximo de 3 etiquetas.");

    await example.getByRole("button", { name: "Eliminar dos" }).click();
    await expect(chips).toHaveText(["uno", "tres"]);
  });

  test("keeps the fallback input name without a visible label", async ({ page }) => {
    const bare = exampleById(page, "bare-taginput-custom-layouts");
    const bareInput = bare.locator(".phi-tag-input__input");

    await expect(bareInput).toHaveAttribute("aria-label", "Notes");
    await expect(bare.locator(".phi-tag-input-label")).toHaveCount(0);
    await expect(bare.locator(".phi-tag-input-description")).toHaveCount(0);

    const fallback = exampleById(page, "fallback-accessible-name");
    const fallbackInputs = fallback.locator(".phi-tag-input__input");

    await expect(fallbackInputs).toHaveCount(2);
    await expect(fallbackInputs.nth(0)).toHaveAttribute("aria-label", "Add tag");
    await expect(fallbackInputs.nth(1)).toHaveAttribute("aria-label", "Agregar etiqueta");
    await expect(fallback.locator(".phi-tag-input-label")).toHaveCount(0);
    await expect(page.getByLabel("Add tag")).toHaveCount(1);
    await expect(page.getByLabel("Agregar etiqueta")).toHaveCount(1);
  });

  test("blocks typing and removal while disabled", async ({ page }) => {
    const example = exampleById(page, "disabled");

    await expect(example.locator(".phi-tag-input__input")).toBeDisabled();
    await expect(example.locator(".phi-tag-input-chip__label")).toHaveText(["eu-central", "us-east"]);
    await expect(example.getByRole("button", { name: "Remove eu-central" })).toBeDisabled();
  });

  test("renders each size on the Input size scale", async ({ page }) => {
    const example = exampleById(page, "sizes");
    const controls = example.locator(".phi-tag-input");

    await expect(controls).toHaveCount(4);
    await expect(example.locator(".phi-tag-input-chip__label")).toHaveCount(4);

    const heights = await controls.evaluateAll((nodes) =>
      nodes.map((node) => Math.round(node.getBoundingClientRect().height)),
    );

    expect(heights).toEqual([24, 28, 36, 40]);
  });

  test("associates the label with the native input", async ({ page }) => {
    const example = exampleById(page, "unrestricted-values");
    const input = example.locator(".phi-tag-input__input");
    const label = example.locator("label.phi-tag-input-label");

    await expect(label).toHaveCount(1);
    await expect(label).toHaveAttribute("for", (await input.getAttribute("id")) ?? "");
    await expect(example.getByLabel("Labels")).toHaveCount(1);
  });

  test("validates, clears, and removes tags in the preview demo", async ({ page }) => {
    const example = page.locator("#preview .docs-component-example");
    const input = example.locator(".phi-tag-input__input");
    const chips = example.locator(".phi-tag-input-chip__label");

    await input.fill("grace@example.com");
    await input.press("Enter");
    await expect(chips).toHaveText(["ava@example.com", "grace@example.com"]);

    await input.fill("not-an-email");
    await input.press("Enter");
    await expect(example.locator(".phi-tag-input-error")).toHaveText('"not-an-email" is not valid.');
    await expect(input).toHaveValue("not-an-email");

    await example.getByRole("button", { name: "Remove grace@example.com" }).click();
    await expect(chips).toHaveText(["ava@example.com"]);
  });
});

test("Tag Input is reachable in the left docs navigation after Tabs", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sidebar = page.locator(".docs-sidebar-panel--desktop");
  const links = sidebar.locator(".docs-nav-group__panel a");
  const tabsLink = sidebar.getByRole("link", { name: "Tabs" });
  const tagInputLink = sidebar.getByRole("link", { name: "Tag Input" });

  await expect(tabsLink).toHaveAttribute("href", "/docs/components/tabs");
  await expect(tagInputLink).toHaveAttribute("href", "/docs/components/tag-input");

  const labels = await links.evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(labels.indexOf("Tag Input")).toBe(labels.indexOf("Tabs") + 1);
});
