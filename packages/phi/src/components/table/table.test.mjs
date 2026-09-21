import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const styles = await readFile(new URL("./table.css", import.meta.url), "utf8");

test("uses borderless alternating semantic backgrounds for body rows", () => {
  assert.match(styles, /\.phi-table-row--default \{\s+--phi-table-row-bg: var\(--phi-table-bg\);/);
  assert.match(
    styles,
    /\.phi-table-body \.phi-table-row--default:nth-child\(even\) \{\s+--phi-table-row-bg: var\(--phi-elevated, #fafafa\);/,
  );
  assert.match(styles, /\.phi-table-row--selected \{\s+--phi-table-row-bg: var\(--phi-tint, #f4f6f9\);/);
  assert.match(styles, /\.phi-table-cell \{\s+background: var\(--phi-table-row-bg, var\(--phi-table-bg\)\);/);

  const sharedCellRules = styles.match(/\.phi-table-head,\s+\.phi-table-cell \{(?<rules>[^}]+)\}/)?.groups?.rules;
  assert.ok(sharedCellRules);
  assert.doesNotMatch(sharedCellRules, /border-bottom/);
  assert.match(styles, /\.phi-table-head \{\s+border-bottom: 1px solid var\(--phi-table-border\);/);
});

test("matches sticky body cells and fades to their row background", () => {
  assert.match(
    styles,
    /\.phi-table-cell--sticky-left,\s+\.phi-table-cell--sticky-right \{\s+--phi-table-sticky-fade: var\(--phi-table-row-bg, var\(--phi-table-bg\)\);/,
  );
  assert.match(
    styles,
    /background: linear-gradient\(to left, transparent, var\(--phi-table-sticky-fade, var\(--phi-table-bg\)\)\);/,
  );
  assert.match(
    styles,
    /background: linear-gradient\(to right, transparent, var\(--phi-table-sticky-fade, var\(--phi-table-bg\)\)\);/,
  );
});
