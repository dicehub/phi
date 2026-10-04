import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/flow");
  });

  test("renders reference-style page sections and snippets", async ({ page }) => {
    await expect(page.locator("main h1").first()).toHaveText("Flow");
    await expect(page.locator(".docs-component-example")).toHaveCount(13);
    await expect(page.locator(".docs-code-block")).toHaveCount(16);
    await expect(page.locator("#preview .docs-code-block")).toContainText('from "@dicehub/phi/components/flow"');
    await expect(page.locator("#preview .docs-code-block")).toContainText("<Flow.Parallel>");
    await expect(page.locator("#examples .docs-code-block").filter({ hasText: 'orientation="vertical"' })).toHaveCount(2);
    await expect(page.locator("#preview marker").first()).toHaveAttribute("markerWidth", "8");
    await expect(page.locator("#preview marker").first()).toHaveAttribute("refX", "0");
    await expect(page.locator("#preview marker").first()).toHaveAttribute("markerUnits", "userSpaceOnUse");
    await expect(page.locator("#preview .phi-flow__connector-path").first()).toHaveCSS("stroke", "oklch(0.87 0 0)");
    await expect(page.locator(".docs-code-block").filter({ hasText: "v-for" })).toHaveCount(0);
    await expect(page.locator("#components .docs-api-table")).toHaveCount(5);
    await expect(page.locator("#components .docs-api-table").first().locator("th")).toHaveText(["Prop", "Type", "Description"]);
    await expect(page.locator("#components .docs-api-table").first()).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(page.locator("#components .docs-api-table").first()).toHaveCSS("border-top-style", "none");
    await expect(page.locator("#components .docs-api-table code").first()).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(page.locator("#flow-api")).toContainText("onOverflowChange");
    await expect(page.locator("#flow-node-api")).toContainText("unstyled");
    await expect(page.locator("#flow-anchor-api")).toContainText('"start" | "end"');
    await expect(page.locator("#flow-parallel-api")).toContainText("align");
    await expect(page.locator("#flow-list-api")).toContainText("default slot");
  });

  test("matches reference table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Examples",
      "Sequential Flow",
      "Parallel Branches",
      "Vertical Orientation",
      "Custom Node Styling",
      "Centered Alignment",
      "Complex Flow",
      "Custom Anchor Points",
      "Panning Large Diagrams",
      "Disabled Nodes",
      "Parallel Node Alignment",
      "Other Examples",
      "Nested Node Lists in Parallel",
      "Components",
      "Flow",
      "Flow.Node",
      "Flow.Anchor",
      "Flow.Parallel",
      "Flow.List",
    ]);
    await expect(page.locator(".docs-page-toc a[href='#preview']")).toHaveCount(0);
  });

  test("draws connectors for the preview and basic examples", async ({ page }) => {
    const preview = page.locator("#preview .phi-flow");
    const sequential = exampleById(page, "sequential-flow");
    const parallel = exampleById(page, "parallel-branches");
    const vertical = exampleById(page, "vertical-orientation");

    await expect(preview.locator(".phi-flow-node")).toHaveText(["Start", "Branch A1", "Branch A2", "Branch B", "Branch C", "End"]);
    await expect(preview.locator(".phi-flow__connector-path")).toHaveCount(7);
    await expect(sequential.locator(".phi-flow-node")).toHaveText(["Step 1", "Step 2", "Step 3"]);
    await expect(sequential.locator(".phi-flow__connector-path")).toHaveCount(2);
    await expect(parallel.locator(".phi-flow__connector-path")).toHaveCount(7);
    await expect(vertical.locator(".phi-flow-node")).toHaveText(["Step 1", "Step 2", "Step 3"]);
    await expect(vertical.locator(".phi-flow__connector-path")).toHaveCount(2);
    await expect(exampleById(page, "centered-alignment").locator(".phi-flow-node").last()).toHaveCSS("padding-top", "24px");
    await expect(exampleById(page, "centered-alignment").locator(".docs-code-block")).toContainText('style="padding-block: 1.5rem;"');
    await expect(exampleById(page, "centered-alignment").locator(".docs-code-block")).not.toContainText("tall-node");
  });

  test("renders custom anchors, disabled nodes, panning, and nested lists", async ({ page }) => {
    const custom = exampleById(page, "custom-node-styling");
    const anchor = exampleById(page, "custom-anchor-points");
    const panning = exampleById(page, "panning-large-diagrams");
    const disabled = exampleById(page, "disabled-nodes");
    const nested = exampleById(page, "nested-node-lists-in-parallel");

    await expect(custom.locator(".flow-demo__dot")).toHaveCount(1);
    await expect(custom.locator(".flow-demo__worker")).toHaveText("my-worker");
    await expect(anchor.locator("[data-flow-anchor='end']")).toContainText("my-worker");
    await expect(anchor.locator("[data-flow-anchor='start']")).toContainText("Bindings");
    await expect(panning.locator(".phi-flow-node")).toHaveCount(10);
    await expect(panning.locator(".phi-flow__scrollbar--x")).toHaveCount(1);
    await expect(disabled.locator(".phi-flow-node--disabled")).toContainText("Backup Handler (disabled)");
    await expect(disabled.locator(".phi-flow__connector--disabled")).toHaveCount(2);
    await expect(nested.locator(".phi-flow-sequence")).toHaveCount(2);
    await expect(nested.locator(".phi-flow__connector-path")).toHaveCount(6);
  });

});
