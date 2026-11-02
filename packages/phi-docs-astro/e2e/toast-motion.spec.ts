import { expect, type Page, test } from "@playwright/test";

const demo = (page: Page) => page.locator(".toast-motion-demo");
const toast = (page: Page) => page.locator(".phi-toast").filter({ hasText: "Repeated notification" });

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components/toast");
  await demo(page).getByRole("button", { name: "Show or repeat toast", exact: true }).waitFor();
});

test("every duplicate add replays motion and preserves the focused action", async ({ page }) => {
  await demo(page).getByRole("button", { name: "Show or repeat toast", exact: true }).click();
  const notification = toast(page);
  const action = notification.getByRole("button", { name: "Repeat notification", exact: true });
  await expect(notification).toHaveCSS("animation-name", "none");
  await action.focus();
  await action.evaluate((button) => button.setAttribute("data-original-action", "true"));

  let previous = "none";
  for (let count = 2; count <= 4; count += 1) {
    await action.press("Enter");
    await expect(notification).toContainText(`Received ${count} times.`);
    await expect(action).toBeFocused();
    await expect(action).toHaveAttribute("data-original-action", "true");
    const next = await notification.evaluate((element) => getComputedStyle(element).animationName);
    expect(next).toMatch(/^phi-toast-bump(?:-alternate)?$/);
    expect(next).not.toBe(previous);
    previous = next;
  }
  await expect(notification).toHaveCount(1);
});

test("a rapid duplicate leaves the active entrance transition running", async ({ page }) => {
  await page.addStyleTag({ content: ".phi-toast-transition-enter-active { transition-duration: 2s !important; }" });
  const result = await demo(page).getByRole("button", { name: "Show and repeat quickly" }).evaluate(async (button) => {
    (button as HTMLButtonElement).click();
    let entrance: Animation | undefined;
    let notification: HTMLElement | null = null;
    let item: HTMLElement | null = null;

    for (let frame = 0; frame < 60; frame += 1) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      notification = document.querySelector<HTMLElement>(".phi-toast");
      item = notification?.closest<HTMLElement>(".phi-toast-list__item") ?? null;
      entrance ??= item?.getAnimations().find((animation) =>
        "transitionProperty" in animation && animation.transitionProperty === "transform",
      );
      if (entrance && notification?.textContent?.includes("Received 2 times.")) break;
    }

    return {
      active: entrance?.playState,
      sameEntrance: Boolean(entrance && item?.getAnimations().includes(entrance)),
      slideAnimation: item ? getComputedStyle(item).animationName : null,
      bumpAnimation: notification ? getComputedStyle(notification).animationName : null,
      text: notification?.textContent,
    };
  });

  expect(result.text).toContain("Received 2 times.");
  expect(result.active).toBe("running");
  expect(result.sameEntrance).toBe(true);
  expect(result.slideAnimation).toBe("none");
  expect(result.bumpAnimation).toMatch(/^phi-toast-bump(?:-alternate)?$/);
});

test("quiet adds and updates clear motion while each explicit update replays it", async ({ page }) => {
  const controls = demo(page);
  await controls.getByRole("button", { name: "Show or repeat toast", exact: true }).click();
  const notification = toast(page);
  const explicitUpdate = controls.getByRole("button", { name: "Update with bump", exact: true });
  await explicitUpdate.click();
  const first = await notification.evaluate((element) => getComputedStyle(element).animationName);
  await explicitUpdate.click();
  await expect(notification).not.toHaveCSS("animation-name", first);
  await expect(notification).not.toHaveCSS("animation-name", "none");

  await controls.getByRole("button", { name: "Update without bump", exact: true }).click();
  await expect(notification).toHaveCSS("animation-name", "none");
  await controls.getByRole("button", { name: "Show or repeat toast", exact: true }).click();
  await expect(notification).not.toHaveCSS("animation-name", "none");
  await controls.getByRole("button", { name: "Repeat without bump", exact: true }).click();
  await expect(notification).toHaveCSS("animation-name", "none");
  await controls.getByRole("button", { name: "Show or repeat toast", exact: true }).click();
  await expect(notification).not.toHaveCSS("animation-name", "none");
});

test("duplicate adds do not reopen a closing toast", async ({ page }) => {
  await demo(page).getByRole("button", { name: "Show or repeat toast", exact: true }).click();
  const notification = toast(page);
  const state = await notification.getByRole("button", { name: "Close", exact: true }).evaluate(async (button) => {
    const surface = button.closest(".phi-toast");
    (button as HTMLButtonElement).click();
    const repeat = Array.from(document.querySelectorAll<HTMLButtonElement>(".toast-motion-demo button"))
      .find((control) => control.textContent?.trim() === "Show or repeat toast");
    repeat?.click();
    await Promise.resolve();
    return surface?.getAttribute("data-state");
  });
  expect(state).toBe("closing");
  await expect(notification).toHaveCount(0);
});

test("reduced motion disables bumps and transform transitions across the stack", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const controls = demo(page);
  await controls.getByRole("button", { name: "Show and repeat quickly" }).click();
  const notification = toast(page);
  await expect(notification).toContainText("Received 2 times.");
  await expect(notification).toHaveCSS("animation-name", "none");
  const item = page.locator(".phi-toast-list__item").filter({ has: notification });
  await expect(item).toHaveCSS("transition-property", "opacity");
  await expect(page.locator(".phi-toast-list")).toHaveCSS("transition-property", "opacity");
  await item.hover();
  await expect(item).toHaveCSS("transition-property", "opacity");

  const closingTransition = await notification.getByRole("button", { name: "Close", exact: true }).evaluate(async (button) => {
    const container = button.closest(".phi-toast-list__item")!;
    (button as HTMLButtonElement).click();
    await Promise.resolve();
    return getComputedStyle(container).transitionProperty;
  });
  expect(closingTransition).toBe("opacity");
  await expect(notification).toHaveCount(0);
});
