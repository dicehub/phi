import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  PHI_TOAST_DEFAULT_VARIANTS,
  PHI_TOAST_STYLING,
  PHI_TOAST_VARIANTS,
  TOAST_DEFAULT_TIMEOUT,
  TOAST_VARIANTS,
  createPhiToastManager,
  isToastVariant,
  resolveToastVariant,
  toastVariants,
} from "./toast.ts";

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

test("exports Toasty and ToastProvider aliases", async () => {
  const index = await readFile(new URL("./index.ts", import.meta.url), "utf8");

  assert.match(index, /export const Toasty = ToastyRoot/);
  assert.match(index, /export const ToastProvider = ToastyRoot/);
  assert.match(index, /createPhiToastManager/);
  assert.match(index, /usePhiToastManager/);
});

test("exposes toast variant metadata", () => {
  assert.deepEqual(TOAST_VARIANTS, ["default", "success", "error", "warning", "info"]);
  assert.deepEqual(PHI_TOAST_DEFAULT_VARIANTS, { variant: "default" });
  assert.equal(TOAST_DEFAULT_TIMEOUT, 5000);
  assert.equal(PHI_TOAST_VARIANTS.variant.success.icon, "check-circle");
  assert.equal(PHI_TOAST_STYLING.container.width, 300);
  assert.equal(isToastVariant("warning"), true);
  assert.equal(isToastVariant("alert"), false);
  assert.equal(resolveToastVariant("info"), "info");
  assert.equal(resolveToastVariant("alert"), "default");
  assert.equal(toastVariants({ variant: "error" }), "phi-toast phi-toast--error");
});

test("dedupes add calls by id and updates the existing toast", () => {
  const manager = createPhiToastManager();

  manager.add({ id: "deploy", title: "Deploying", timeout: 0 });
  manager.add({ id: "deploy", title: "Still deploying", variant: "info", timeout: 0 });

  assert.equal(manager.toasts.value.length, 1);
  assert.equal(manager.toasts.value[0].title, "Still deploying");
  assert.equal(manager.toasts.value[0].variant, "info");
});

test("updates promise toasts in place", async () => {
  const manager = createPhiToastManager();

  await manager.promise(Promise.resolve({ name: "my-worker" }), {
    loading: { title: "Deploying...", timeout: 0 },
    success: (data) => ({ title: "Deployed!", description: data.name, timeout: 0 }),
    error: (error) => ({ title: "Deployment failed", description: error.message, variant: "error" }),
  });

  assert.equal(manager.toasts.value.length, 1);
  assert.equal(manager.toasts.value[0].title, "Deployed!");
  assert.equal(manager.toasts.value[0].description, "my-worker");
});

test("updates a toast from a callback that receives the current toast", () => {
  const manager = createPhiToastManager();

  manager.add({ id: "save", title: "Saving", timeout: 0 });
  const seen = [];
  const returnedId = manager.update("save", (toast) => {
    seen.push(toast);
    return { title: "Saved", variant: "success" };
  });

  assert.equal(returnedId, "save");
  assert.equal(seen.length, 1);
  assert.equal(seen[0].id, "save");
  assert.equal(seen[0].title, "Saving");
  assert.equal(seen[0].state, "open");
  assert.ok(seen[0].createdAt > 0);
  assert.equal(manager.toasts.value.length, 1);
  assert.equal(manager.toasts.value[0].title, "Saved");
  assert.equal(manager.toasts.value[0].variant, "success");
  assert.equal(manager.toasts.value[0].timeout, 0);
});

test("keeps untouched fields and skips callbacks for unknown toast ids", () => {
  const manager = createPhiToastManager();

  manager.add({ description: "kept", id: "keep", title: "Title", timeout: 0 });
  manager.update("keep", (toast) => ({ title: `${toast.title}!` }));

  assert.equal(manager.toasts.value[0].title, "Title!");
  assert.equal(manager.toasts.value[0].description, "kept");

  let called = false;
  assert.equal(
    manager.update("missing", () => {
      called = true;
      return { title: "nope" };
    }),
    "missing",
  );
  assert.equal(called, false);
  assert.equal(manager.toasts.value.length, 1);
});

test("pauses auto-dismiss while the toast stack is being interacted with", async () => {
  const manager = createPhiToastManager();

  manager.add({ id: "hovered", title: "Hover me", timeout: 30 });
  manager.pauseAll();
  await wait(70);

  assert.equal(manager.toasts.value.length, 1);
  assert.equal(manager.toasts.value[0].state, "open");

  manager.resumeAll();
  await wait(60);

  assert.equal(manager.toasts.value[0].state, "closing");
});
