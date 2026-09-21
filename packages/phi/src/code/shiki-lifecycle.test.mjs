import assert from "node:assert/strict";
import { test } from "node:test";
import { startShikiInitialization } from "./shiki-lifecycle.ts";

const nextTurn = () => new Promise((resolve) => setImmediate(resolve));

test("startShikiInitialization disposes a ready highlighter on cleanup", async () => {
  let disposeCount = 0;
  let readyHighlighter;
  const highlighter = {
    dispose() {
      disposeCount += 1;
    },
  };

  const cleanup = startShikiInitialization({
    create: async () => highlighter,
    onError: assert.fail,
    onReady: (ready) => {
      readyHighlighter = ready;
    },
    onSettled() {},
  });

  await nextTurn();
  assert.equal(readyHighlighter, highlighter);

  cleanup();
  cleanup();
  assert.equal(disposeCount, 1);
});

test("startShikiInitialization disposes a highlighter that resolves after cleanup", async () => {
  let disposeCount = 0;
  let resolveHighlighter;
  let ready = false;
  let settled = false;
  const pendingHighlighter = new Promise((resolve) => {
    resolveHighlighter = resolve;
  });
  const highlighter = {
    dispose() {
      disposeCount += 1;
    },
  };

  const cleanup = startShikiInitialization({
    create: () => pendingHighlighter,
    onError: assert.fail,
    onReady: () => {
      ready = true;
    },
    onSettled: () => {
      settled = true;
    },
  });

  cleanup();
  resolveHighlighter(highlighter);
  await nextTurn();

  assert.equal(disposeCount, 1);
  assert.equal(ready, false);
  assert.equal(settled, false);
});

test("startShikiInitialization suppresses errors from cancelled work", async () => {
  let rejectHighlighter;
  let receivedError;
  const pendingHighlighter = new Promise((_resolve, reject) => {
    rejectHighlighter = reject;
  });

  const cleanup = startShikiInitialization({
    create: () => pendingHighlighter,
    onError: (error) => {
      receivedError = error;
    },
    onReady: assert.fail,
    onSettled() {},
  });

  cleanup();
  rejectHighlighter(new Error("stale initialization"));
  await nextTurn();

  assert.equal(receivedError, undefined);
});
