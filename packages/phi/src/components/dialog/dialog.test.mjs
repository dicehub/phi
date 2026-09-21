import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const styles = await readFile(new URL("./dialog.css", import.meta.url), "utf8");

test("positions dialogs near the viewport top", () => {
  assert.match(styles, /\.phi-dialog-positioner \{[^}]*align-items: start;/);
  assert.match(styles, /\.phi-dialog-positioner \{[^}]*padding: 2rem 1rem 1rem;/);
  assert.match(
    styles,
    /@media \(min-width: 640px\) \{[\s\S]*\.phi-dialog-positioner \{[^}]*padding-top: 4rem;/,
  );
  assert.doesNotMatch(styles, /\.phi-dialog-positioner \{[^}]*align-items: center;/);
});

test("keeps dialog content inside the remaining viewport", () => {
  assert.match(styles, /--phi-dialog-viewport-spacing: 3rem;/);
  assert.match(styles, /--phi-dialog-viewport-spacing: 5rem;/);
  assert.match(
    styles,
    /max-height: calc\(100dvh - var\(--phi-dialog-viewport-spacing, 3rem\)\);/,
  );
});
