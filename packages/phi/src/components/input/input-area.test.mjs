import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  calculateInputAreaAutoResizeLayout,
  resolveInputAreaLineHeight,
  resolveInputAreaMaxRows,
  resolveInputAreaRowCount,
} from "./input-area.ts";

test("normalizes InputArea auto-resize row bounds", () => {
  assert.equal(resolveInputAreaRowCount(3.8), 3);
  assert.equal(resolveInputAreaRowCount(0), 1);
  assert.equal(resolveInputAreaRowCount("4"), 4);
  assert.equal(resolveInputAreaMaxRows(2, 4), 4);
  assert.equal(resolveInputAreaMaxRows(8, 2), 8);
  assert.equal(resolveInputAreaMaxRows(0, 2), undefined);
});

test("resolves pixel, unitless, and normal line heights", () => {
  assert.equal(resolveInputAreaLineHeight("20px", "16px"), 20);
  assert.equal(resolveInputAreaLineHeight("1.5", "16px"), 24);
  assert.equal(resolveInputAreaLineHeight("normal", "20px"), 24);
});

test("clamps auto-resize height between minRows and maxRows", () => {
  assert.deepEqual(
    calculateInputAreaAutoResizeLayout({
      borders: 0,
      isBorderBox: true,
      lineHeight: 20,
      maxRows: 5,
      minRows: 2,
      padding: 16,
      scrollHeight: 20,
    }),
    { height: 56, overflowY: "hidden" },
  );
  assert.deepEqual(
    calculateInputAreaAutoResizeLayout({
      borders: 0,
      isBorderBox: true,
      lineHeight: 20,
      maxRows: 5,
      minRows: 2,
      padding: 16,
      scrollHeight: 240,
    }),
    { height: 116, overflowY: "auto" },
  );
});

test("accounts for content-box textarea padding", () => {
  assert.deepEqual(
    calculateInputAreaAutoResizeLayout({
      borders: 2,
      isBorderBox: false,
      lineHeight: 20,
      minRows: 1,
      padding: 16,
      scrollHeight: 80,
    }),
    { height: 64, overflowY: "hidden" },
  );
});

test("wires resize observation and inline-style cleanup in InputArea", async () => {
  const source = await readFile(new URL("./InputArea.vue", import.meta.url), "utf8");

  assert.match(source, /new ResizeObserver/);
  assert.match(source, /textarea\.clientWidth === lastObservedWidth/);
  assert.match(source, /observedTextarea\.style\.height = originalInlineStyles\.height/);
  assert.match(source, /onBeforeUnmount\(restoreAutoResizeStyles\)/);
  assert.match(source, /emit\("update:modelValue", target\.value\)/);
  assert.match(source, /resizeInputArea\(target\)/);
});
