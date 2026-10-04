import { expect, type Page, test } from "@playwright/test";

const exampleById = (page: Page, id: string) =>
  page
    .locator(`#${id}`)
    .locator("xpath=following-sibling::*[contains(concat(' ', normalize-space(@class), ' '), ' docs-component-example ')][1]");

test.describe("Toast", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/toast");
  });

  test("renders the preview toast and code", async ({ page }) => {
    const preview = page.locator("#preview");

    await expect(page.locator("main h1").first()).toHaveText("Toast");
    await expect(page.locator(".docs-page-header__primitive-link")).toHaveCount(0);
    await preview.getByRole("button", { name: "Show toast" }).click();
    await expect(page.locator(".phi-toast").filter({ hasText: "Toast created" })).toBeVisible();
    await expect(page.locator(".phi-toast").filter({ hasText: "This is a toast notification." })).toBeVisible();
    await expect(preview.locator(".docs-code-block pre")).toContainText('from "@dicehub/phi/components/toast"');
    await expect(preview.locator(".docs-code-block pre")).toContainText("createPhiToastManager");
    await expect(preview.locator(".docs-code-copy")).toHaveCSS("opacity", "1");
  });

  test("matches the expected table of contents structure", async ({ page }) => {
    await expect(page.locator(".docs-page-toc a")).toHaveText([
      "Installation",
      "Barrel",
      "Granular",
      "Usage",
      "Setup",
      "Examples",
      "Title and Description",
      "Title Only",
      "Description Only",
      "Success Variant",
      "Multiple Toasts",
      "Error Variant",
      "Warning Variant",
      "Info Variant",
      "Custom Content",
      "Action Buttons",
      "Promise",
      "Update a Toast",
      "API Reference",
      "Toasty",
      "usePhiToastManager()",
      "Manager Methods",
      "Toast Options",
    ]);
  });

  test("renders documented examples and API reference", async ({ page }) => {
    await expect(page.locator("#examples .docs-component-example")).toHaveCount(12);

    const success = exampleById(page, "success-variant");
    await success.getByRole("button", { name: "Deploy Worker" }).click();
    const successToast = page.locator(".phi-toast").filter({ hasText: "Deployed successfully" });
    await expect(successToast).toHaveAttribute("data-variant", "success");
    await expect(successToast.locator("[data-toast-icon]")).toBeVisible();

    const multiple = exampleById(page, "multiple-toasts");
    await multiple.getByRole("button", { name: "Show multiple toasts" }).click();
    await expect(page.locator(".phi-toast").filter({ hasText: "First toast" })).toBeVisible();
    await expect(page.locator(".phi-toast").filter({ hasText: "Second toast" })).toBeVisible({ timeout: 1500 });
    await expect(page.locator(".phi-toast").filter({ hasText: "Third toast" })).toBeVisible({ timeout: 2000 });
    await page.waitForTimeout(1250);
    await multiple.getByRole("button", { name: "Show multiple toasts" }).click();
    await page.waitForTimeout(1800);

    const multipleStack = page.locator(".phi-toast-list").filter({ hasText: "Third toast" }).first();
    const stackState = await multipleStack.evaluate((list) =>
      Array.from(list.querySelectorAll<HTMLElement>(".phi-toast-list__item")).map((item) => {
        const title = item.querySelector("[data-toast-title]")?.textContent?.trim();
        const rect = item.getBoundingClientRect();
        const style = getComputedStyle(item);

        return {
          limited: item.hasAttribute("data-limited"),
          opacity: style.opacity,
          text: title,
          visible: rect.width > 0 && rect.height > 0 && style.opacity !== "0",
        };
      }),
    );
    expect(stackState.filter((toast) => toast.visible)).toHaveLength(3);
    expect(stackState.slice(0, 3).every((toast) => toast.limited)).toBe(true);
    expect(stackState.slice(-3).every((toast) => !toast.limited)).toBe(true);

    await multipleStack.hover();
    const hoverState = await multipleStack.evaluate((list) =>
      Array.from(list.querySelectorAll<HTMLElement>(".phi-toast-list__item")).map((item) => ({
        limited: item.hasAttribute("data-limited"),
        opacity: getComputedStyle(item).opacity,
      })),
    );
    expect(hoverState.filter((toast) => toast.opacity !== "0")).toHaveLength(3);
    expect(hoverState.filter((toast) => toast.limited).every((toast) => toast.opacity === "0")).toBe(true);

    await multipleStack.locator(".phi-toast-list__item:not([data-limited]) .phi-toast__close").last().click();
    await expect
      .poll(async () =>
        multipleStack.evaluate((list) =>
          Array.from(list.querySelectorAll<HTMLElement>(".phi-toast-list__item")).filter(
            (item) => getComputedStyle(item).opacity !== "0",
          ).length,
        ),
      )
      .toBe(3);

    const error = exampleById(page, "error-variant");
    await error.getByRole("button", { name: "Show error toast" }).click();
    await expect(page.locator(".phi-toast").filter({ hasText: "Deployment failed" })).toHaveAttribute(
      "data-variant",
      "error",
    );

    const customContent = exampleById(page, "custom-content");
    await customContent.getByRole("button", { name: "Show custom content" }).click();
    await expect(page.locator(".phi-toast").filter({ hasText: "my-first-worker created!" })).toBeVisible();
    await expect(page.locator(".phi-toast").getByRole("link", { name: "my-first-worker" })).toHaveAttribute(
      "href",
      "/",
    );

    const actions = exampleById(page, "action-buttons");
    await actions.getByRole("button", { name: "Show with actions" }).click();
    const actionToast = page.locator(".phi-toast").filter({ hasText: "Need help?" });
    await expect(actionToast.getByRole("button", { name: "Support" })).toBeVisible();
    await expect(actionToast.getByRole("button", { name: "Ask AI" })).toBeVisible();

    const promise = exampleById(page, "promise");
    await promise.getByRole("button", { name: "Deploy with promise" }).click();
    await expect(page.locator(".phi-toast").filter({ hasText: "Deploying..." })).toBeVisible();

    const update = exampleById(page, "update-toast");
    await update.getByRole("button", { name: "Save with update" }).click();
    const pendingToast = page.locator(".phi-toast").filter({ hasText: "Saving changes..." });
    await expect(pendingToast).toBeVisible();
    const savingToast = page.locator(".phi-toast").filter({ hasText: "Changes saved" });
    await expect(savingToast).toBeVisible({ timeout: 4000 });
    await expect(savingToast).toHaveAttribute("data-variant", "success");
    await expect(savingToast).toContainText('Previously: "Saving changes..."');

    await expect(page.locator("#api-reference .docs-api-table")).toHaveCount(3);
    await expect(page.locator("#manager-methods + p + .docs-api-table tbody tr")).toHaveCount(7);
    await expect(page.locator("#api-reference tbody tr td:first-child code").filter({ hasText: "variant" })).toHaveCount(2);
    await expect(page.locator("#api-reference")).toContainText('"default" | "success" | "error" | "warning" | "info"');
    await expect(page.locator("#api-reference")).toContainText("createPhiToastManager()");
    await expect(page.locator("#api-reference")).toContainText("ToastAction[]");
    await expect(page.locator("#setup .docs-code-block pre")).toContainText("<Toasty>");
  });

  test("brings the most recently triggered example viewport to the front", async ({ page }) => {
    const multiple = exampleById(page, "multiple-toasts");
    const success = exampleById(page, "success-variant");

    await multiple.getByRole("button", { name: "Show multiple toasts" }).click();
    await expect(page.locator(".phi-toast").filter({ hasText: "Third toast" })).toBeVisible({ timeout: 2000 });
    await success.getByRole("button", { name: "Deploy Worker" }).click();
    await expect(page.locator(".phi-toast").filter({ hasText: "Deployed successfully" })).toBeVisible();

    await expect
      .poll(() =>
        page.evaluate(() => {
          const element = document
            .elementFromPoint(window.innerWidth - 300, window.innerHeight - 90)
            ?.closest(".phi-toast");

          return element?.textContent?.trim() ?? "";
        }),
      )
      .toContain("Deployed successfully");
  });
});

test("Toast is reachable in the left docs navigation after Toolbar", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sidebar = page.locator(".docs-sidebar-panel--desktop");
  const links = sidebar.locator(".docs-nav-group__panel a");
  const toolbarLink = sidebar.getByRole("link", { name: "Toolbar", exact: true });
  const toastLink = sidebar.getByRole("link", { name: "Toast", exact: true });
  const tooltipLink = sidebar.getByRole("link", { name: "Tooltip", exact: true });

  await expect(toolbarLink).toHaveAttribute("href", "/docs/components/toolbar");
  await expect(toastLink).toHaveAttribute("href", "/docs/components/toast");
  await expect(tooltipLink).toHaveAttribute("href", "/docs/components/tooltip");

  const labels = await links.evaluateAll((items) => items.map((item) => item.textContent?.trim()));
  expect(labels.indexOf("Toast")).toBe(labels.indexOf("Toolbar") + 1);
  expect(labels.indexOf("Tooltip")).toBe(labels.indexOf("Toast") + 1);
});
