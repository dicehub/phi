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
  getToastBumpClass,
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

test("replays every duplicate add and keeps bump intent specific to each operation", () => {
  const manager = createPhiToastManager();
  const current = () => manager.toasts.value[0];
  manager.add({ id: "repeat", title: "Original", timeout: 0 });
  assert.equal(getToastBumpClass(current()), undefined);

  const animations = [];
  for (let index = 0; index < 3; index += 1) {
    manager.add({ id: "repeat", title: `Repeat ${index}` });
    animations.push(getToastBumpClass(current()));
    assert.equal(current().title, `Repeat ${index}`);
    assert.equal(current().bump, true);
  }
  assert.ok(animations.every(Boolean));
  assert.notEqual(animations[0], animations[1]);
  assert.notEqual(animations[1], animations[2]);
  assert.equal(manager.toasts.value.length, 1);

  manager.add({ id: "repeat", bump: false });
  assert.equal(getToastBumpClass(current()), undefined);
  manager.add({ id: "repeat" });
  assert.ok(getToastBumpClass(current()));
  manager.update("repeat", { description: "Ordinary update" });
  assert.equal(getToastBumpClass(current()), undefined);
});

test("replays explicit bumps without inheriting them in object or callback updates", () => {
  const manager = createPhiToastManager();
  const current = () => manager.toasts.value[0];
  manager.add({ id: "update", bump: true, timeout: 0 });
  const first = getToastBumpClass(current());
  manager.update("update", { bump: true });
  const second = getToastBumpClass(current());
  manager.update("update", () => ({ bump: true }));
  assert.ok(first);
  assert.ok(second);
  assert.notEqual(first, second);
  assert.notEqual(second, getToastBumpClass(current()));

  manager.update("update", () => ({ description: "Quiet callback" }));
  assert.equal(getToastBumpClass(current()), undefined);
});

test("does not revive a closing toast through a duplicate add or update", async () => {
  const manager = createPhiToastManager();
  manager.add({ id: "closing", title: "Original", timeout: 0 });
  manager.dismiss("closing");
  assert.equal(manager.add({ id: "closing", title: "Duplicate" }), "closing");
  let called = false;
  manager.update("closing", () => {
    called = true;
    return { title: "Updated" };
  });
  assert.equal(called, false);
  assert.equal(manager.toasts.value[0].title, "Original");
  assert.equal(manager.toasts.value[0].state, "closing");
  await wait(200);
  assert.equal(manager.toasts.value.length, 0);
});

test("promise loading and results clear prior bumps unless explicitly requested", async () => {
  const manager = createPhiToastManager();
  manager.add({ id: "promise", title: "Existing", bump: true, timeout: 0 });
  let resolve;
  const pending = manager.promise(new Promise((done) => { resolve = done; }), {
    loading: { id: "promise", title: "Loading", timeout: 0 },
    success: { title: "Done", timeout: 0 },
    error: { title: "Failed", timeout: 0 },
  });
  assert.equal(getToastBumpClass(manager.toasts.value[0]), undefined);
  manager.update("promise", { bump: true });
  resolve("done");
  assert.equal(await pending, "done");
  assert.equal(manager.toasts.value[0].title, "Done");
  assert.equal(getToastBumpClass(manager.toasts.value[0]), undefined);

  await manager.promise(Promise.resolve("saved"), {
    loading: { id: "promise", bump: true, timeout: 0 },
    success: () => ({ bump: true, timeout: 0 }),
    error: { timeout: 0 },
  });
  assert.ok(getToastBumpClass(manager.toasts.value[0]));

  const failure = new Error("Failed");
  await assert.rejects(manager.promise(Promise.reject(failure), {
    loading: { id: "promise", bump: true, timeout: 0 },
    success: { timeout: 0 },
    error: (error) => ({ title: error.message, timeout: 0 }),
  }), failure);
  assert.equal(getToastBumpClass(manager.toasts.value[0]), undefined);
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
