import assert from "node:assert/strict";
import { test } from "node:test";
import { writeClipboardText } from "./clipboard.ts";

test("reports success after an async clipboard write", async () => {
  const values = [];
  const copied = await writeClipboardText("value", {
    clipboard: { writeText: async (value) => values.push(value) },
    fallback: () => false,
  });

  assert.equal(copied, true);
  assert.deepEqual(values, ["value"]);
});

test("uses and verifies the fallback after clipboard rejection", async () => {
  let fallbackValue;
  const copied = await writeClipboardText("fallback", {
    clipboard: { writeText: async () => Promise.reject(new Error("denied")) },
    fallback: (value) => {
      fallbackValue = value;
      return true;
    },
  });

  assert.equal(copied, true);
  assert.equal(fallbackValue, "fallback");
});

test("reports failure when neither copy method succeeds", async () => {
  const copied = await writeClipboardText("failure", {
    clipboard: null,
    fallback: () => false,
  });

  assert.equal(copied, false);
});
