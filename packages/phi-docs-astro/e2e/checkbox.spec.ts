import { expect, test } from "@playwright/test";

test.describe("Checkbox", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/checkbox");
  });

  test("renders preview with code", async ({ page }) => {
    const preview = page.locator("#preview");
    const checkbox = preview.getByRole("checkbox", { name: "Accept terms and conditions" });
    const snippet = preview.locator(".docs-code-block pre");

    await expect(preview.locator(".phi-checkbox")).toHaveCount(1);
    await expect(checkbox).not.toBeChecked();
    await expect(preview.locator(".docs-component-preview").getByText("Accept terms and conditions")).toBeVisible();
    await expect(preview.locator(".docs-component-preview")).toHaveCSS("padding-top", "36px");
    await expect(preview.locator(".docs-component-preview")).toHaveCSS("padding-bottom", "36px");
    await expect(snippet).toContainText('from "@dicehub/phi/components/checkbox"');
    await expect(snippet).toContainText('label="Accept terms and conditions"');
    await expect(snippet).toContainText("v-model:checked");

    await preview.locator(".docs-component-preview").getByText("Accept terms and conditions").click();
    await expect(checkbox).toBeChecked();
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    const toc = page.locator(".docs-page-toc");

    await expect(toc.locator("a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Default",
      "Checked",
      "Indeterminate",
      "Label First Layout",
      "Disabled",
      "Error",
      "Checkbox Group",
      "Checkbox Group with Error",
      "Visually Hidden Legend",
      "Custom Legend Styling",
      "Checkbox Card",
      "Checkbox Card (Horizontal)",
      "Checkbox Card (Control First)",
      "Standalone Checkbox Card",
      "API Reference",
      "Checkbox",
      "Checkbox.Group",
      "Checkbox.Legend",
      "Checkbox.Item",
      "Accessibility",
      "Label Requirement",
      "Keyboard Navigation",
      "Screen Readers",
    ]);
    await expect(toc.locator("a[href='#preview']")).toHaveCount(0);
    await expect(toc.locator("a[href='#installation'] + ul a")).toHaveCount(2);
    await expect(toc.locator("a[href='#examples'] + ul a")).toHaveCount(14);
    await expect(toc.locator("a[href='#api-reference'] + ul a")).toHaveCount(4);
    await expect(toc.locator("a[href='#accessibility'] + ul a")).toHaveCount(3);
  });

  test("renders usage example above its code", async ({ page }) => {
    const usage = page.locator("#usage");

    await expect(usage.getByRole("checkbox", { name: "Accept terms" })).not.toBeChecked();
    await expect(usage.locator(".docs-code-block")).toContainText('<Checkbox v-model:checked="checked" label="Accept terms" />');
  });

  test("renders every documented example with snippets", async ({ page }) => {
    const examples = page.locator("#examples");

    await expect(examples.getByRole("heading", { name: "Default" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Checked", exact: true })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Indeterminate" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Label First Layout" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Disabled" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Error", exact: true })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Checkbox Group", exact: true })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Checkbox Group with Error" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Visually Hidden Legend" })).toBeVisible();
    await expect(examples.getByRole("heading", { name: "Custom Legend Styling" })).toBeVisible();
    await expect(examples.locator(".docs-component-example")).toHaveCount(14);
    await expect(examples.locator(".docs-code-block")).toHaveCount(14);
    await expect(examples).not.toContainText("v-for");
  });

  test("supports checked, indeterminate, disabled, error, and group interactions", async ({ page }) => {
    const examples = page.locator("#examples");
    const exampleBlocks = examples.locator(".docs-component-example");
    const checked = exampleBlocks.nth(1).getByRole("checkbox", { name: "I agree" });
    const indeterminateControl = exampleBlocks.nth(2).locator(".phi-checkbox__control");
    const disabled = exampleBlocks.nth(4).getByRole("checkbox", { name: "Disabled option" });
    const error = exampleBlocks.nth(5).locator(".phi-checkbox");
    const group = exampleBlocks.nth(6);
    const firstGroupItem = group.locator(".phi-checkbox-item").first();
    const firstGroupControl = firstGroupItem.locator(".phi-checkbox__control");
    const firstGroupLabel = firstGroupItem.locator(".phi-checkbox__label");
    const sms = group.getByRole("checkbox", { name: "SMS notifications" });

    await expect(checked).toBeChecked();
    await exampleBlocks.nth(1).locator(".docs-component-preview").getByText("I agree").click();
    await expect(checked).not.toBeChecked();

    await expect(indeterminateControl).toHaveAttribute("data-state", "indeterminate");
    await exampleBlocks.nth(2).locator(".docs-component-preview").getByText("Select all").click();
    await expect(indeterminateControl).toHaveAttribute("data-state", "indeterminate");
    await expect(disabled).toBeDisabled();
    await expect(error).toHaveClass(/phi-checkbox--error/);

    await expect(group.getByRole("checkbox", { name: "Email notifications" })).toBeChecked();
    await expect(firstGroupControl).toBeVisible();
    await expect(firstGroupLabel).toHaveText("Email notifications");
    expect((await firstGroupControl.boundingBox())!.x).toBeLessThan((await firstGroupLabel.boundingBox())!.x);
    await expect(sms).not.toBeChecked();
    await group.locator(".docs-component-preview").getByText("SMS notifications").click();
    await expect(sms).toBeChecked();
  });
});
